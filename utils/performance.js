// utils/performance.js - 性能优化工具类

class PerformanceOptimizer {
  constructor() {
    this.imageCache = new Map();
    this.lazyLoadObserver = null;
    this.preloadQueue = [];
    this.isPreloading = false;
  }

  /**
   * 初始化性能优化
   */
  init() {
    this.initLazyLoad();
    this.initPreload();
    this.initMemoryOptimization();
  }

  /**
   * 初始化图片懒加载
   */
  initLazyLoad() {
    // 创建懒加载观察器
    if (typeof IntersectionObserver !== 'undefined') {
      this.lazyLoadObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.dataset.src;
            if (src) {
              this.loadImage(src).then(url => {
                img.src = url;
                img.removeAttribute('data-src');
                this.lazyLoadObserver.unobserve(img);
              });
            }
          }
        });
      }, {
        rootMargin: '50px'
      });
    }
  }

  /**
   * 初始化预加载
   */
  initPreload() {
    // 预加载关键资源
    this.preloadCriticalResources();
  }

  /**
   * 初始化内存优化
   */
  initMemoryOptimization() {
    // 监听内存警告
    wx.onMemoryWarning(() => {
      console.warn('内存不足，开始清理缓存');
      this.clearCache();
    });

    // 定期清理缓存
    setInterval(() => {
      this.cleanupCache();
    }, 5 * 60 * 1000); // 5分钟清理一次
  }

  /**
   * 预加载关键资源
   */
  preloadCriticalResources() {
    const criticalImages = [
      '/images/logo.png',
      '/images/default-avatar.png',
      '/images/empty-state.png'
    ];

    criticalImages.forEach(src => {
      this.preloadImage(src);
    });
  }

  /**
   * 预加载图片
   */
  preloadImage(src) {
    if (this.imageCache.has(src)) {
      return Promise.resolve(this.imageCache.get(src));
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.imageCache.set(src, src);
        resolve(src);
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  /**
   * 加载图片（带缓存）
   */
  loadImage(src) {
    if (this.imageCache.has(src)) {
      return Promise.resolve(this.imageCache.get(src));
    }

    return this.preloadImage(src);
  }

  /**
   * 添加懒加载图片
   */
  addLazyImage(selector) {
    if (this.lazyLoadObserver) {
      const images = document.querySelectorAll(selector);
      images.forEach(img => {
        this.lazyLoadObserver.observe(img);
      });
    }
  }

  /**
   * 批量预加载图片
   */
  batchPreloadImages(urls) {
    if (this.isPreloading) {
      this.preloadQueue.push(...urls);
      return;
    }

    this.isPreloading = true;
    const promises = urls.map(url => this.preloadImage(url));
    
    Promise.allSettled(promises).then(() => {
      this.isPreloading = false;
      if (this.preloadQueue.length > 0) {
        const nextBatch = this.preloadQueue.splice(0, 5);
        this.batchPreloadImages(nextBatch);
      }
    });
  }

  /**
   * 清理缓存
   */
  clearCache() {
    this.imageCache.clear();
    console.log('图片缓存已清理');
  }

  /**
   * 清理过期缓存
   */
  cleanupCache() {
    const maxCacheSize = 50;
    if (this.imageCache.size > maxCacheSize) {
      const entries = Array.from(this.imageCache.entries());
      const toDelete = entries.slice(0, entries.length - maxCacheSize);
      toDelete.forEach(([key]) => {
        this.imageCache.delete(key);
      });
      console.log(`清理了 ${toDelete.length} 个过期缓存`);
    }
  }

  /**
   * 页面性能监控
   */
  monitorPagePerformance(pageName) {
    const startTime = Date.now();
    
    return {
      end: () => {
        const endTime = Date.now();
        const loadTime = endTime - startTime;
        
        console.log(`页面 ${pageName} 加载耗时: ${loadTime}ms`);
        
        // 记录性能数据
        this.recordPerformance(pageName, loadTime);
        
        return loadTime;
      }
    };
  }

  /**
   * 记录性能数据
   */
  recordPerformance(pageName, loadTime) {
    try {
      const performanceData = wx.getStorageSync('performance_data') || {};
      
      if (!performanceData[pageName]) {
        performanceData[pageName] = [];
      }
      
      performanceData[pageName].push({
        loadTime,
        timestamp: Date.now()
      });
      
      // 只保留最近50条记录
      if (performanceData[pageName].length > 50) {
        performanceData[pageName] = performanceData[pageName].slice(-50);
      }
      
      wx.setStorageSync('performance_data', performanceData);
    } catch (error) {
      console.error('记录性能数据失败:', error);
    }
  }

  /**
   * 获取性能报告
   */
  getPerformanceReport() {
    try {
      const performanceData = wx.getStorageSync('performance_data') || {};
      const report = {};
      
      Object.keys(performanceData).forEach(pageName => {
        const data = performanceData[pageName];
        const loadTimes = data.map(item => item.loadTime);
        
        report[pageName] = {
          count: data.length,
          average: Math.round(loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length),
          min: Math.min(...loadTimes),
          max: Math.max(...loadTimes),
          recent: data.slice(-10).map(item => ({
            loadTime: item.loadTime,
            date: new Date(item.timestamp).toLocaleString()
          }))
        };
      });
      
      return report;
    } catch (error) {
      console.error('获取性能报告失败:', error);
      return {};
    }
  }

  /**
   * 优化长列表渲染
   */
  optimizeListRendering(options = {}) {
    const {
      itemHeight = 100,
      containerHeight = 600,
      buffer = 5
    } = options;
    
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const totalCount = visibleCount + buffer * 2;
    
    return {
      visibleCount,
      totalCount,
      getVisibleRange: (scrollTop) => {
        const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
        const endIndex = Math.min(startIndex + totalCount);
        return { startIndex, endIndex };
      }
    };
  }

  /**
   * 防抖函数
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * 节流函数
   */
  throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * 图片压缩
   */
  compressImage(filePath, quality = 0.8) {
    return new Promise((resolve, reject) => {
      wx.compressImage({
        src: filePath,
        quality: Math.floor(quality * 100),
        success: (res) => {
          resolve(res.tempFilePath);
        },
        fail: reject
      });
    });
  }

  /**
   * 批量压缩图片
   */
  batchCompressImages(filePaths, quality = 0.8) {
    const promises = filePaths.map(path => this.compressImage(path, quality));
    return Promise.allSettled(promises);
  }

  /**
   * 获取网络状态
   */
  getNetworkType() {
    return new Promise((resolve) => {
      wx.getNetworkType({
        success: (res) => {
          resolve(res.networkType);
        },
        fail: () => {
          resolve('unknown');
        }
      });
    });
  }

  /**
   * 根据网络状态调整加载策略
   */
  async adjustLoadingStrategy() {
    const networkType = await this.getNetworkType();
    
    switch (networkType) {
      case 'wifi':
        return {
          imageQuality: 1.0,
          preloadCount: 10,
          enableAnimation: true
        };
      case '4g':
        return {
          imageQuality: 0.8,
          preloadCount: 5,
          enableAnimation: true
        };
      case '3g':
      case '2g':
        return {
          imageQuality: 0.6,
          preloadCount: 2,
          enableAnimation: false
        };
      default:
        return {
          imageQuality: 0.7,
          preloadCount: 3,
          enableAnimation: true
        };
    }
  }

  /**
   * 内存使用监控
   */
  monitorMemoryUsage() {
    if (wx.getPerformance) {
      const performance = wx.getPerformance();
      const memory = performance.memory;
      
      if (memory) {
        const memoryInfo = {
          used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
        };
        
        console.log('内存使用情况:', memoryInfo);
        
        // 内存使用率超过80%时清理缓存
        if (memoryInfo.used / memoryInfo.limit > 0.8) {
          this.clearCache();
        }
        
        return memoryInfo;
      }
    }
    
    return null;
  }

  /**
   * 销毁优化器
   */
  destroy() {
    if (this.lazyLoadObserver) {
      this.lazyLoadObserver.disconnect();
    }
    this.clearCache();
    this.preloadQueue = [];
  }
}

// 创建全局实例
const performanceOptimizer = new PerformanceOptimizer();

// 自动初始化
wx.onAppShow(() => {
  performanceOptimizer.init();
});

wx.onAppHide(() => {
  performanceOptimizer.cleanupCache();
});

module.exports = performanceOptimizer;