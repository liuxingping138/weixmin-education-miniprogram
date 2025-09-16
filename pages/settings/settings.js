// pages/settings/settings.js
const app = getApp();
const { API } = require('../../utils/api.js');

Page({
  data: {
    // 系统设置
    settings: {
      notifications: {
        homework: true,
        points: true,
        class: true,
        system: true
      },
      privacy: {
        showProfile: true,
        showProgress: false,
        allowSearch: true
      },
      display: {
        theme: 'light', // light, dark, auto
        fontSize: 'medium', // small, medium, large
        language: 'zh-CN'
      },
      features: {
        aiSuggestions: true,
        autoBackup: true,
        offlineMode: false
      }
    },
    
    // Mock系统设置
    mockSettings: {
      enabled: false,
      delay: 300,
      errorRate: 0
    },
    
    // 系统信息
    systemInfo: {},
    appVersion: '1.0.0',
    
    // 缓存信息
    cacheSize: '0MB',
    
    loading: false
  },

  onLoad() {
    this.initPage();
  },

  onShow() {
    this.loadSettings();
  },

  // 初始化页面
  initPage() {
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      systemInfo,
      appVersion: app.globalData.version || '1.0.0',
      mockSettings: {
        enabled: API.isMockEnabled(),
        delay: 300,
        errorRate: 0
      }
    });
    
    this.loadSettings();
    this.calculateCacheSize();
  },

  // 加载设置
  loadSettings() {
    try {
      // 从本地存储加载设置
      const savedSettings = wx.getStorageSync('userSettings');
      if (savedSettings) {
        this.setData({
          settings: { ...this.data.settings, ...savedSettings }
        });
      }
    } catch (error) {
      console.error('加载设置失败:', error);
    }
  },

  // 保存设置
  saveSettings() {
    try {
      wx.setStorageSync('userSettings', this.data.settings);
      wx.showToast({
        title: '设置已保存',
        icon: 'success'
      });
    } catch (error) {
      console.error('保存设置失败:', error);
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      });
    }
  },

  // 通知设置切换
  toggleNotification(e) {
    const { type } = e.currentTarget.dataset;
    const { value } = e.detail;
    
    this.setData({
      [`settings.notifications.${type}`]: value
    });
    
    this.saveSettings();
  },

  // 隐私设置切换
  togglePrivacy(e) {
    const { type } = e.currentTarget.dataset;
    const { value } = e.detail;
    
    this.setData({
      [`settings.privacy.${type}`]: value
    });
    
    this.saveSettings();
  },

  // 功能设置切换
  toggleFeature(e) {
    const { type } = e.currentTarget.dataset;
    const { value } = e.detail;
    
    this.setData({
      [`settings.features.${type}`]: value
    });
    
    // 特殊处理AI建议设置
    if (type === 'aiSuggestions') {
      app.setFeature('ai', value);
    }
    
    this.saveSettings();
  },

  // 主题设置
  changeTheme(e) {
    const theme = e.currentTarget.dataset.theme;
    
    this.setData({
      'settings.display.theme': theme
    });
    
    // 应用主题
    app.setTheme(theme);
    this.saveSettings();
  },

  // 字体大小设置
  changeFontSize(e) {
    const fontSize = e.currentTarget.dataset.size;
    
    this.setData({
      'settings.display.fontSize': fontSize
    });
    
    this.saveSettings();
  },

  // 语言设置
  changeLanguage(e) {
    const language = e.currentTarget.dataset.lang;
    
    this.setData({
      'settings.display.language': language
    });
    
    this.saveSettings();
    
    wx.showModal({
      title: '语言设置',
      content: '语言设置将在下次启动时生效',
      showCancel: false
    });
  },

  // Mock设置切换
  toggleMock(e) {
    const { value } = e.detail;
    
    if (value) {
      API.enableMock();
      app.enableMock(this.data.mockSettings.delay);
    } else {
      API.disableMock();
      app.disableMock();
    }
    
    this.setData({
      'mockSettings.enabled': value
    });
  },

  // Mock延迟设置
  changeMockDelay(e) {
    const delay = parseInt(e.detail.value);
    
    this.setData({
      'mockSettings.delay': delay
    });
    
    API.setMockDelay(delay);
    app.setMockDelay(delay);
  },

  // 计算缓存大小
  async calculateCacheSize() {
    try {
      const res = await wx.getStorageInfo();
      const sizeKB = res.currentSize;
      const sizeMB = (sizeKB / 1024).toFixed(2);
      
      this.setData({
        cacheSize: `${sizeMB}MB`
      });
    } catch (error) {
      console.error('计算缓存大小失败:', error);
    }
  },

  // 清除缓存
  clearCache() {
    wx.showModal({
      title: '清除缓存',
      content: '确定要清除所有缓存数据吗？这不会影响您的个人设置。',
      success: (res) => {
        if (res.confirm) {
          this.handleClearCache();
        }
      }
    });
  },

  // 处理清除缓存
  async handleClearCache() {
    wx.showLoading({ title: '清除中...' });
    
    try {
      // 保留重要数据
      const userInfo = wx.getStorageSync('userInfo');
      const userType = wx.getStorageSync('userType');
      const token = wx.getStorageSync('token');
      const userSettings = wx.getStorageSync('userSettings');
      
      // 清除所有存储
      await wx.clearStorage();
      
      // 恢复重要数据
      if (userInfo) wx.setStorageSync('userInfo', userInfo);
      if (userType) wx.setStorageSync('userType', userType);
      if (token) wx.setStorageSync('token', token);
      if (userSettings) wx.setStorageSync('userSettings', userSettings);
      
      this.setData({
        cacheSize: '0MB'
      });
      
      wx.showToast({
        title: '缓存已清除',
        icon: 'success'
      });
      
    } catch (error) {
      console.error('清除缓存失败:', error);
      wx.showToast({
        title: '清除失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  // 检查更新
  checkUpdate() {
    wx.showLoading({ title: '检查中...' });
    
    // 模拟检查更新
    setTimeout(() => {
      wx.hideLoading();
      wx.showModal({
        title: '检查更新',
        content: '当前已是最新版本',
        showCancel: false
      });
    }, 1500);
  },

  // 意见反馈
  feedback() {
    wx.navigateTo({
      url: '/pages/settings/feedback'
    });
  },

  // 关于我们
  about() {
    wx.navigateTo({
      url: '/pages/settings/about'
    });
  },

  // 用户协议
  userAgreement() {
    wx.navigateTo({
      url: '/pages/settings/user-agreement'
    });
  },

  // 隐私政策
  privacyPolicy() {
    wx.navigateTo({
      url: '/pages/settings/privacy-policy'
    });
  },

  // 重置设置
  resetSettings() {
    wx.showModal({
      title: '重置设置',
      content: '确定要重置所有设置为默认值吗？',
      success: (res) => {
        if (res.confirm) {
          this.handleResetSettings();
        }
      }
    });
  },

  // 处理重置设置
  handleResetSettings() {
    const defaultSettings = {
      notifications: {
        homework: true,
        points: true,
        class: true,
        system: true
      },
      privacy: {
        showProfile: true,
        showProgress: false,
        allowSearch: true
      },
      display: {
        theme: 'light',
        fontSize: 'medium',
        language: 'zh-CN'
      },
      features: {
        aiSuggestions: true,
        autoBackup: true,
        offlineMode: false
      }
    };
    
    this.setData({
      settings: defaultSettings
    });
    
    this.saveSettings();
    
    wx.showToast({
      title: '设置已重置',
      icon: 'success'
    });
  },

  // 导出数据
  exportData() {
    wx.showModal({
      title: '导出数据',
      content: '此功能将导出您的学习数据，是否继续？',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '功能开发中',
            icon: 'none'
          });
        }
      }
    });
  }
});