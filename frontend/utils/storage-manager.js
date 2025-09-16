// utils/storage-manager.js - 数据持久化和缓存管理工具类

class StorageManager {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = new Map();
    this.syncQueue = [];
    this.isOnline = true;
    this.maxCacheSize = 50; // MB
    this.defaultExpiry = 24 * 60 * 60 * 1000; // 24小时
    this.compressionEnabled = true;
  }

  /**
   * 初始化存储管理器
   */
  init() {
    this.checkStorageQuota();
    this.setupNetworkMonitoring();
    this.setupAutoCleanup();
    this.loadCacheFromStorage();
  }

  /**
   * 检查存储配额
   */
  checkStorageQuota() {
    try {
      const storageInfo = wx.getStorageInfoSync();
      const usedSize = storageInfo.currentSize;
      const limitSize = storageInfo.limitSize;
      
      this.storageInfo = {
        used: usedSize,
        limit: limitSize,
        available: limitSize - usedSize,
        usagePercent: (usedSize / limitSize) * 100
      };
      
      console.log('存储使用情况:', this.storageInfo);
      
      // 存储使用率超过80%时清理缓存
      if (this.storageInfo.usagePercent > 80) {
        this.cleanupStorage();
      }
      
      return this.storageInfo;
    } catch (error) {
      console.error('检查存储配额失败:', error);
      return null;
    }
  }

  /**
   * 设置网络监控
   */
  setupNetworkMonitoring() {
    // 监听网络状态变化
    wx.onNetworkStatusChange((res) => {
      this.isOnline = res.isConnected;
      
      if (this.isOnline) {
        console.log('网络已连接，开始同步数据');
        this.syncOfflineData();
      } else {
        console.log('网络已断开，启用离线模式');
      }
    });
    
    // 获取初始网络状态
    wx.getNetworkType({
      success: (res) => {
        this.isOnline = res.networkType !== 'none';
      }
    });
  }

  /**
   * 设置自动清理
   */
  setupAutoCleanup() {
    // 每小时检查一次过期缓存
    setInterval(() => {
      this.cleanupExpiredCache();
    }, 60 * 60 * 1000);
    
    // 应用启动时清理过期缓存
    this.cleanupExpiredCache();
  }

  /**
   * 从存储加载缓存
   */
  loadCacheFromStorage() {
    try {
      const cacheData = wx.getStorageSync('app_cache_data');
      const cacheExpiry = wx.getStorageSync('app_cache_expiry');
      
      if (cacheData) {
        this.cache = new Map(Object.entries(cacheData));
      }
      
      if (cacheExpiry) {
        this.cacheExpiry = new Map(Object.entries(cacheExpiry));
      }
      
      console.log(`从存储加载了 ${this.cache.size} 个缓存项`);
    } catch (error) {
      console.error('加载缓存失败:', error);
    }
  }

  /**
   * 保存缓存到存储
   */
  saveCacheToStorage() {
    try {
      const cacheData = Object.fromEntries(this.cache);
      const cacheExpiry = Object.fromEntries(this.cacheExpiry);
      
      wx.setStorageSync('app_cache_data', cacheData);
      wx.setStorageSync('app_cache_expiry', cacheExpiry);
    } catch (error) {
      console.error('保存缓存失败:', error);
    }
  }

  /**
   * 设置数据
   */
  async setItem(key, value, options = {}) {
    const {
      expiry = this.defaultExpiry,
      compress = this.compressionEnabled,
      sync = false
    } = options;
    
    try {
      let processedValue = value;
      
      // 数据压缩
      if (compress && typeof value === 'object') {
        processedValue = this.compressData(value);
      }
      
      // 设置到内存缓存
      this.cache.set(key, processedValue);
      this.cacheExpiry.set(key, Date.now() + expiry);
      
      // 持久化存储
      wx.setStorageSync(key, processedValue);
      
      // 如果需要同步到服务器
      if (sync && this.isOnline) {
        this.addToSyncQueue(key, value, 'set');
      } else if (sync && !this.isOnline) {
        this.addToOfflineQueue(key, value, 'set');
      }
      
      return true;
    } catch (error) {
      console.error(`设置数据失败 [${key}]:`, error);
      return false;
    }
  }

  /**
   * 获取数据
   */
  async getItem(key, options = {}) {
    const {
      defaultValue = null,
      decompress = this.compressionEnabled,
      fromCache = true
    } = options;
    
    try {
      let value = null;
      
      // 先从内存缓存获取
      if (fromCache && this.cache.has(key)) {
        const expiry = this.cacheExpiry.get(key);
        
        if (!expiry || Date.now() < expiry) {
          value = this.cache.get(key);
        } else {
          // 缓存已过期，清理
          this.cache.delete(key);
          this.cacheExpiry.delete(key);
          wx.removeStorageSync(key);
        }
      }
      
      // 如果缓存中没有，从存储获取
      if (value === null) {
        value = wx.getStorageSync(key);
        
        if (value) {
          // 更新内存缓存
          this.cache.set(key, value);
          this.cacheExpiry.set(key, Date.now() + this.defaultExpiry);
        }
      }
      
      // 数据解压缩
      if (value && decompress && this.isCompressedData(value)) {
        value = this.decompressData(value);
      }
      
      return value || defaultValue;
    } catch (error) {
      console.error(`获取数据失败 [${key}]:`, error);
      return defaultValue;
    }
  }

  /**
   * 删除数据
   */
  async removeItem(key, options = {}) {
    const { sync = false } = options;
    
    try {
      // 从内存缓存删除
      this.cache.delete(key);
      this.cacheExpiry.delete(key);
      
      // 从存储删除
      wx.removeStorageSync(key);
      
      // 如果需要同步到服务器
      if (sync && this.isOnline) {
        this.addToSyncQueue(key, null, 'remove');
      } else if (sync && !this.isOnline) {
        this.addToOfflineQueue(key, null, 'remove');
      }
      
      return true;
    } catch (error) {
      console.error(`删除数据失败 [${key}]:`, error);
      return false;
    }
  }

  /**
   * 清空所有数据
   */
  async clear() {
    try {
      this.cache.clear();
      this.cacheExpiry.clear();
      wx.clearStorageSync();
      return true;
    } catch (error) {
      console.error('清空数据失败:', error);
      return false;
    }
  }

  /**
   * 获取所有键
   */
  getAllKeys() {
    try {
      const storageInfo = wx.getStorageInfoSync();
      return storageInfo.keys;
    } catch (error) {
      console.error('获取所有键失败:', error);
      return [];
    }
  }

  /**
   * 批量设置数据
   */
  async setMultiple(items, options = {}) {
    const results = [];
    
    for (const [key, value] of Object.entries(items)) {
      const result = await this.setItem(key, value, options);
      results.push({ key, success: result });
    }
    
    return results;
  }

  /**
   * 批量获取数据
   */
  async getMultiple(keys, options = {}) {
    const results = {};
    
    for (const key of keys) {
      results[key] = await this.getItem(key, options);
    }
    
    return results;
  }

  /**
   * 数据压缩
   */
  compressData(data) {
    try {
      const jsonString = JSON.stringify(data);
      // 简单的压缩算法（实际项目中可以使用更高效的压缩库）
      const compressed = this.simpleCompress(jsonString);
      
      return {
        __compressed: true,
        data: compressed,
        originalSize: jsonString.length,
        compressedSize: compressed.length
      };
    } catch (error) {
      console.error('数据压缩失败:', error);
      return data;
    }
  }

  /**
   * 数据解压缩
   */
  decompressData(compressedData) {
    try {
      if (!this.isCompressedData(compressedData)) {
        return compressedData;
      }
      
      const decompressed = this.simpleDecompress(compressedData.data);
      return JSON.parse(decompressed);
    } catch (error) {
      console.error('数据解压缩失败:', error);
      return compressedData;
    }
  }

  /**
   * 检查是否为压缩数据
   */
  isCompressedData(data) {
    return data && typeof data === 'object' && data.__compressed === true;
  }

  /**
   * 简单压缩算法
   */
  simpleCompress(str) {
    // 这里使用简单的重复字符压缩
    return str.replace(/(.)\1+/g, (match, char) => {
      return char + match.length;
    });
  }

  /**
   * 简单解压缩算法
   */
  simpleDecompress(str) {
    // 解压缩重复字符
    return str.replace(/(.)\d+/g, (match, char) => {
      const count = parseInt(match.slice(1));
      return char.repeat(count);
    });
  }

  /**
   * 添加到同步队列
   */
  addToSyncQueue(key, value, operation) {
    this.syncQueue.push({
      key,
      value,
      operation,
      timestamp: Date.now()
    });
    
    // 立即尝试同步
    this.processSyncQueue();
  }

  /**
   * 添加到离线队列
   */
  addToOfflineQueue(key, value, operation) {
    try {
      const offlineQueue = wx.getStorageSync('offline_sync_queue') || [];
      
      offlineQueue.push({
        key,
        value,
        operation,
        timestamp: Date.now()
      });
      
      wx.setStorageSync('offline_sync_queue', offlineQueue);
    } catch (error) {
      console.error('添加到离线队列失败:', error);
    }
  }

  /**
   * 处理同步队列
   */
  async processSyncQueue() {
    if (!this.isOnline || this.syncQueue.length === 0) {
      return;
    }
    
    const queue = [...this.syncQueue];
    this.syncQueue = [];
    
    for (const item of queue) {
      try {
        await this.syncToServer(item);
      } catch (error) {
        console.error('同步数据失败:', error);
        // 同步失败的项目重新加入队列
        this.syncQueue.push(item);
      }
    }
  }

  /**
   * 同步离线数据
   */
  async syncOfflineData() {
    try {
      const offlineQueue = wx.getStorageSync('offline_sync_queue') || [];
      
      if (offlineQueue.length === 0) {
        return;
      }
      
      console.log(`开始同步 ${offlineQueue.length} 个离线数据`);
      
      for (const item of offlineQueue) {
        try {
          await this.syncToServer(item);
        } catch (error) {
          console.error('同步离线数据失败:', error);
        }
      }
      
      // 清空离线队列
      wx.removeStorageSync('offline_sync_queue');
      
    } catch (error) {
      console.error('同步离线数据失败:', error);
    }
  }

  /**
   * 同步到服务器
   */
  async syncToServer(item) {
    // 这里应该调用实际的API接口
    // 目前使用mock实现
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`同步数据到服务器: ${item.key} - ${item.operation}`);
        resolve();
      }, 100);
    });
  }

  /**
   * 清理过期缓存
   */
  cleanupExpiredCache() {
    const now = Date.now();
    const expiredKeys = [];
    
    for (const [key, expiry] of this.cacheExpiry.entries()) {
      if (expiry && now > expiry) {
        expiredKeys.push(key);
      }
    }
    
    expiredKeys.forEach(key => {
      this.cache.delete(key);
      this.cacheExpiry.delete(key);
      try {
        wx.removeStorageSync(key);
      } catch (error) {
        console.error(`删除过期缓存失败 [${key}]:`, error);
      }
    });
    
    if (expiredKeys.length > 0) {
      console.log(`清理了 ${expiredKeys.length} 个过期缓存`);
      this.saveCacheToStorage();
    }
  }

  /**
   * 清理存储空间
   */
  cleanupStorage() {
    try {
      // 获取所有存储的键
      const allKeys = this.getAllKeys();
      
      // 按最后访问时间排序，删除最旧的数据
      const keyStats = allKeys.map(key => {
        try {
          const data = wx.getStorageSync(key);
          return {
            key,
            size: JSON.stringify(data).length,
            lastAccess: this.cacheExpiry.get(key) || 0
          };
        } catch (error) {
          return { key, size: 0, lastAccess: 0 };
        }
      });
      
      keyStats.sort((a, b) => a.lastAccess - b.lastAccess);
      
      // 删除最旧的20%数据
      const deleteCount = Math.floor(keyStats.length * 0.2);
      const keysToDelete = keyStats.slice(0, deleteCount);
      
      keysToDelete.forEach(({ key }) => {
        this.removeItem(key);
      });
      
      console.log(`清理了 ${deleteCount} 个存储项`);
      
    } catch (error) {
      console.error('清理存储空间失败:', error);
    }
  }

  /**
   * 获取缓存统计信息
   */
  getCacheStats() {
    const stats = {
      cacheSize: this.cache.size,
      memoryUsage: 0,
      hitRate: 0,
      expiredCount: 0
    };
    
    // 计算内存使用量
    for (const [key, value] of this.cache.entries()) {
      try {
        stats.memoryUsage += JSON.stringify(value).length;
      } catch (error) {
        // 忽略序列化错误
      }
    }
    
    // 计算过期项数量
    const now = Date.now();
    for (const [key, expiry] of this.cacheExpiry.entries()) {
      if (expiry && now > expiry) {
        stats.expiredCount++;
      }
    }
    
    return stats;
  }

  /**
   * 导出数据
   */
  async exportData() {
    try {
      const allKeys = this.getAllKeys();
      const exportData = {};
      
      for (const key of allKeys) {
        exportData[key] = await this.getItem(key);
      }
      
      return {
        data: exportData,
        timestamp: Date.now(),
        version: '1.0'
      };
    } catch (error) {
      console.error('导出数据失败:', error);
      return null;
    }
  }

  /**
   * 导入数据
   */
  async importData(exportedData) {
    try {
      if (!exportedData || !exportedData.data) {
        throw new Error('无效的导入数据');
      }
      
      const { data } = exportedData;
      const results = [];
      
      for (const [key, value] of Object.entries(data)) {
        const success = await this.setItem(key, value);
        results.push({ key, success });
      }
      
      return results;
    } catch (error) {
      console.error('导入数据失败:', error);
      return [];
    }
  }

  /**
   * 销毁存储管理器
   */
  destroy() {
    this.saveCacheToStorage();
    this.cache.clear();
    this.cacheExpiry.clear();
    this.syncQueue = [];
  }
}

// 创建全局实例
const storageManager = new StorageManager();

// 自动初始化
wx.onAppShow(() => {
  storageManager.init();
});

wx.onAppHide(() => {
  storageManager.saveCacheToStorage();
});

module.exports = storageManager;