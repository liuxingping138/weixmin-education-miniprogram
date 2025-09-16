// app.js
const { API } = require('./utils/api.js');

App({
  globalData: {
    userInfo: null,
    userType: '', // student, teacher, parent
    token: '',
    baseUrl: 'https://api.example.com', // 后端API地址
    version: '1.0.0',
    
    // Mock系统配置
    mockConfig: {
      enabled: true, // 开发阶段默认启用Mock
      delay: 300,    // 模拟网络延迟
      autoInit: true // 自动初始化
    },
    
    // 系统配置
    systemInfo: null,
    networkType: 'unknown',
    
    // 学习数据缓存
    subjects: [],
    currentClass: null,
    learningProgress: {},
    
    // AI功能配置
    aiConfig: {
      enabled: true,
      autoGenerate: true,
      personalizedRecommend: true
    },
    
    // 主题配置
    theme: {
      mode: 'light', // light, dark, auto
      primaryColor: '#667eea',
      accentColor: '#764ba2'
    },
    
    // 功能开关
    features: {
      practice: true,
      mistakes: true,
      ai: true,
      courseware: true,
      growth: true,
      parent: true
    }
  },

  onLaunch() {
    console.log('小程序启动');
    this.initMockSystem();
    this.initSystem();
    this.checkLogin();
    this.checkUpdate();
    this.loadGlobalData();
  },

  onShow() {
    console.log('小程序显示');
  },

  onHide() {
    console.log('小程序隐藏');
  },

  onError(msg) {
    console.error('小程序错误:', msg);
  },

  // 初始化Mock系统
  initMockSystem() {
    try {
      // 从本地存储读取Mock配置
      const savedMockConfig = wx.getStorageSync('mockConfig');
      if (savedMockConfig) {
        this.globalData.mockConfig = { ...this.globalData.mockConfig, ...savedMockConfig };
      }
      
      // 如果启用自动初始化Mock
      if (this.globalData.mockConfig.autoInit && this.globalData.mockConfig.enabled) {
        API.enableMock();
        API.setMockDelay(this.globalData.mockConfig.delay);
        console.log(`Mock系统已启用，延迟: ${this.globalData.mockConfig.delay}ms`);
      } else {
        API.disableMock();
        console.log('Mock系统已禁用');
      }
    } catch (error) {
      console.error('Mock系统初始化失败:', error);
    }
  },

  // 检查登录状态
  checkLogin() {
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');
    const userType = wx.getStorageSync('userType');
    
    if (token && userInfo && userType) {
      this.globalData.token = token;
      this.globalData.userInfo = userInfo;
      this.globalData.userType = userType;
    }
  },

  // 检查版本更新
  checkUpdate() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      
      updateManager.onCheckForUpdate((res) => {
        if (res.hasUpdate) {
          console.log('发现新版本');
        }
      });
      
      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: (res) => {
            if (res.confirm) {
              updateManager.applyUpdate();
            }
          }
        });
      });
      
      updateManager.onUpdateFailed(() => {
        console.error('新版本下载失败');
      });
    }
  },

  // 全局方法：设置用户信息
  setUserInfo(userInfo, userType, token) {
    this.globalData.userInfo = userInfo;
    this.globalData.userType = userType;
    this.globalData.token = token;
    
    // 持久化存储
    wx.setStorageSync('userInfo', userInfo);
    wx.setStorageSync('userType', userType);
    wx.setStorageSync('token', token);
  },

  // 全局方法：清除用户信息
  clearUserInfo() {
    this.globalData.userInfo = null;
    this.globalData.userType = '';
    this.globalData.token = '';
    
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('userType');
    wx.removeStorageSync('token');
  },
  
  // 初始化系统信息
  initSystem() {
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    this.globalData.systemInfo = systemInfo;
    
    // 获取网络状态
    wx.getNetworkType({
      success: (res) => {
        this.globalData.networkType = res.networkType;
      }
    });
    
    // 监听网络状态变化
    wx.onNetworkStatusChange((res) => {
      this.globalData.networkType = res.networkType;
      if (!res.isConnected) {
        wx.showToast({
          title: '网络连接已断开',
          icon: 'none'
        });
      }
    });
    
    // 设置主题
    this.initTheme();
  },
  
  // 初始化主题
  initTheme() {
    const savedTheme = wx.getStorageSync('theme');
    if (savedTheme) {
      this.globalData.theme = { ...this.globalData.theme, ...savedTheme };
    }
    
    // 监听系统主题变化
    wx.onThemeChange((res) => {
      if (this.globalData.theme.mode === 'auto') {
        this.setTheme(res.theme);
      }
    });
  },
  
  // 设置主题
  setTheme(mode) {
    this.globalData.theme.mode = mode;
    wx.setStorageSync('theme', this.globalData.theme);
    
    // 通知所有页面主题变化
    const pages = getCurrentPages();
    pages.forEach(page => {
      if (page.onThemeChange && typeof page.onThemeChange === 'function') {
        page.onThemeChange(this.globalData.theme);
      }
    });
  },
  
  // 加载全局数据
  async loadGlobalData() {
    try {
      // 加载科目列表
      const subjects = wx.getStorageSync('subjects');
      if (subjects) {
        this.globalData.subjects = subjects;
      }
      
      // 加载当前班级
      const currentClass = wx.getStorageSync('currentClass');
      if (currentClass) {
        this.globalData.currentClass = currentClass;
      }
      
      // 加载学习进度
      const learningProgress = wx.getStorageSync('learningProgress');
      if (learningProgress) {
        this.globalData.learningProgress = learningProgress;
      }
      
      // 加载AI配置
      const aiConfig = wx.getStorageSync('aiConfig');
      if (aiConfig) {
        this.globalData.aiConfig = { ...this.globalData.aiConfig, ...aiConfig };
      }
      
      // 加载功能开关
      const features = wx.getStorageSync('features');
      if (features) {
        this.globalData.features = { ...this.globalData.features, ...features };
      }
    } catch (error) {
      console.error('加载全局数据失败:', error);
    }
  },
  
  // 保存全局数据
  saveGlobalData() {
    try {
      wx.setStorageSync('subjects', this.globalData.subjects);
      wx.setStorageSync('currentClass', this.globalData.currentClass);
      wx.setStorageSync('learningProgress', this.globalData.learningProgress);
      wx.setStorageSync('aiConfig', this.globalData.aiConfig);
      wx.setStorageSync('features', this.globalData.features);
    } catch (error) {
      console.error('保存全局数据失败:', error);
    }
  },
  
  // 更新学习进度
  updateLearningProgress(subjectId, progress) {
    this.globalData.learningProgress[subjectId] = {
      ...this.globalData.learningProgress[subjectId],
      ...progress,
      updateTime: new Date().toISOString()
    };
    this.saveGlobalData();
  },
  
  // 获取功能是否启用
  isFeatureEnabled(featureName) {
    return this.globalData.features[featureName] !== false;
  },
  
  // 设置功能开关
  setFeature(featureName, enabled) {
    this.globalData.features[featureName] = enabled;
    this.saveGlobalData();
  },
  
  // 全局错误处理
  handleError(error, context = '') {
    console.error(`${context} 错误:`, error);
    
    // 根据错误类型显示不同提示
    let message = '操作失败，请重试';
    if (error.message) {
      if (error.message.includes('network')) {
        message = '网络连接异常，请检查网络';
      } else if (error.message.includes('timeout')) {
        message = '请求超时，请重试';
      } else if (error.message.includes('unauthorized')) {
        message = '登录已过期，请重新登录';
        this.clearUserInfo();
        wx.reLaunch({
          url: '/pages/login/login'
        });
        return;
      }
    }
    
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    });
  },
  
  // 全局请求方法
  request(options) {
    return new Promise((resolve, reject) => {
      const { url, method = 'GET', data = {}, header = {} } = options;
      
      // 添加token
      if (this.globalData.token) {
        header.Authorization = `Bearer ${this.globalData.token}`;
      }
      
      wx.request({
        url: this.globalData.baseUrl + url,
        method,
        data,
        header: {
          'Content-Type': 'application/json',
          ...header
        },
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.data);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${res.data.message || '请求失败'}`));
          }
        },
        fail: (error) => {
          reject(new Error(`network: ${error.errMsg}`));
        }
      });
    });
  },
  
  // Mock系统控制方法
  enableMock(delay = 300) {
    this.globalData.mockConfig.enabled = true;
    this.globalData.mockConfig.delay = delay;
    API.enableMock();
    API.setMockDelay(delay);
    wx.setStorageSync('mockConfig', this.globalData.mockConfig);
    console.log(`Mock模式已启用，延迟: ${delay}ms`);
  },
  
  disableMock() {
    this.globalData.mockConfig.enabled = false;
    API.disableMock();
    wx.setStorageSync('mockConfig', this.globalData.mockConfig);
    console.log('Mock模式已禁用');
  },
  
  isMockEnabled() {
    return this.globalData.mockConfig.enabled && API.isMockEnabled();
  },
  
  setMockDelay(delay) {
    this.globalData.mockConfig.delay = delay;
    API.setMockDelay(delay);
    wx.setStorageSync('mockConfig', this.globalData.mockConfig);
  },
  
  getMockConfig() {
    return { ...this.globalData.mockConfig };
  }
});