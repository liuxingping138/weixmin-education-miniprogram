// utils/cache.js - 数据缓存工具

class DataCache {
  constructor() {
    this.memoryCache = new Map();
    this.defaultExpire = 5 * 60 * 1000; // 默认5分钟过期
  }

  /**
   * 设置缓存
   * @param {string} key 缓存键
   * @param {any} data 缓存数据
   * @param {number} expire 过期时间(毫秒)
   */
  set(key, data, expire = this.defaultExpire) {
    const cacheData = {
      data,
      timestamp: Date.now(),
      expire
    };
    
    // 内存缓存
    this.memoryCache.set(key, cacheData);
    
    // 持久化缓存（重要数据）
    if (this.shouldPersist(key)) {
      try {
        wx.setStorageSync(`cache_${key}`, cacheData);
      } catch (e) {
        console.warn('缓存存储失败:', e);
      }
    }
  }

  /**
   * 获取缓存
   * @param {string} key 缓存键
   * @returns {any|null} 缓存数据或null
   */
  get(key) {
    // 先从内存缓存获取
    let cacheData = this.memoryCache.get(key);
    
    // 内存缓存未命中，尝试从持久化缓存获取
    if (!cacheData && this.shouldPersist(key)) {
      try {
        cacheData = wx.getStorageSync(`cache_${key}`);
        if (cacheData) {
          // 重新放入内存缓存
          this.memoryCache.set(key, cacheData);
        }
      } catch (e) {
        console.warn('缓存读取失败:', e);
      }
    }
    
    if (!cacheData) return null;
    
    // 检查是否过期
    if (Date.now() - cacheData.timestamp > cacheData.expire) {
      this.remove(key);
      return null;
    }
    
    return cacheData.data;
  }

  /**
   * 删除缓存
   * @param {string} key 缓存键
   */
  remove(key) {
    this.memoryCache.delete(key);
    if (this.shouldPersist(key)) {
      try {
        wx.removeStorageSync(`cache_${key}`);
      } catch (e) {
        console.warn('缓存删除失败:', e);
      }
    }
  }

  /**
   * 清空所有缓存
   */
  clear() {
    this.memoryCache.clear();
    try {
      const info = wx.getStorageInfoSync();
      info.keys.forEach(key => {
        if (key.startsWith('cache_')) {
          wx.removeStorageSync(key);
        }
      });
    } catch (e) {
      console.warn('清空缓存失败:', e);
    }
  }

  /**
   * 判断是否需要持久化
   * @param {string} key 缓存键
   * @returns {boolean}
   */
  shouldPersist(key) {
    const persistKeys = [
      'userInfo',
      'classInfo',
      'studentList',
      'homeworkList'
    ];
    return persistKeys.some(persistKey => key.includes(persistKey));
  }

  /**
   * 获取缓存统计信息
   * @returns {object} 缓存统计
   */
  getStats() {
    const memorySize = this.memoryCache.size;
    let storageSize = 0;
    
    try {
      const info = wx.getStorageInfoSync();
      storageSize = info.keys.filter(key => key.startsWith('cache_')).length;
    } catch (e) {
      console.warn('获取缓存统计失败:', e);
    }
    
    return {
      memorySize,
      storageSize,
      totalSize: memorySize + storageSize
    };
  }

  /**
   * 清理过期缓存
   */
  cleanExpired() {
    const now = Date.now();
    
    // 清理内存缓存
    for (const [key, cacheData] of this.memoryCache.entries()) {
      if (now - cacheData.timestamp > cacheData.expire) {
        this.memoryCache.delete(key);
      }
    }
    
    // 清理持久化缓存
    try {
      const info = wx.getStorageInfoSync();
      info.keys.forEach(key => {
        if (key.startsWith('cache_')) {
          const cacheData = wx.getStorageSync(key);
          if (cacheData && now - cacheData.timestamp > cacheData.expire) {
            wx.removeStorageSync(key);
          }
        }
      });
    } catch (e) {
      console.warn('清理过期缓存失败:', e);
    }
  }
}

// 创建全局缓存实例
const cache = new DataCache();

// 定期清理过期缓存（每10分钟）
setInterval(() => {
  cache.cleanExpired();
}, 10 * 60 * 1000);

module.exports = cache;