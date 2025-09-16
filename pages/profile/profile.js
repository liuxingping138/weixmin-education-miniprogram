// pages/profile/profile.js
const app = getApp();
const { API, auth, upload } = require('../../utils/api.js');

Page({
  data: {
    userInfo: {},
    userType: '',
    userTypeText: '',
    loading: false,
    
    // 统计数据
    stats: {
      totalHomework: 0,
      completedHomework: 0,
      totalPoints: 0,
      currentLevel: 1,
      nextLevelPoints: 100
    },
    
    // 功能菜单
    menuItems: [
      {
        id: 'edit-profile',
        title: '编辑资料',
        icon: 'edit',
        arrow: true
      },
      {
        id: 'change-password',
        title: '修改密码',
        icon: 'lock-on',
        arrow: true
      },
      {
        id: 'notification',
        title: '消息通知',
        icon: 'notification',
        arrow: true,
        badge: 3
      },
      {
        id: 'settings',
        title: '系统设置',
        icon: 'setting',
        arrow: true
      },
      {
        id: 'help',
        title: '帮助中心',
        icon: 'help-circle',
        arrow: true
      },
      {
        id: 'about',
        title: '关于我们',
        icon: 'info-circle',
        arrow: true
      }
    ],
    
    // Mock开关（开发阶段显示）
    showMockControl: true
  },

  onLoad() {
    this.initPage();
  },

  onShow() {
    this.loadUserData();
  },

  onPullDownRefresh() {
    this.loadUserData().finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  // 初始化页面
  initPage() {
    // 启用Mock模式
    API.enableMock();
    
    this.setUserInfo();
    this.loadUserData();
  },

  // 设置用户信息
  setUserInfo() {
    const userInfo = app.globalData.userInfo || {};
    const userType = app.globalData.userType || '';
    
    let userTypeText = '';
    switch (userType) {
      case 'student':
        userTypeText = '学生';
        break;
      case 'teacher':
        userTypeText = '教师';
        break;
      case 'parent':
        userTypeText = '家长';
        break;
      default:
        userTypeText = '未知';
    }

    this.setData({
      userInfo,
      userType,
      userTypeText
    });
  },

  // 加载用户数据
  async loadUserData() {
    this.setData({ loading: true });
    
    try {
      // 获取用户详细信息
      const userRes = await auth.getUserInfo();
      if (userRes.code === 200) {
        this.setData({
          userInfo: { ...this.data.userInfo, ...userRes.data }
        });
      }

      // 根据用户类型加载不同统计数据
      await this.loadUserStats();
      
    } catch (error) {
      console.error('加载用户数据失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  // 加载用户统计数据
  async loadUserStats() {
    try {
      const { userType } = this.data;
      let stats = {};

      if (userType === 'student') {
        // 学生统计数据
        stats = {
          totalHomework: 156,
          completedHomework: 142,
          totalPoints: 2580,
          currentLevel: 8,
          nextLevelPoints: 3000
        };
      } else if (userType === 'teacher') {
        // 教师统计数据
        stats = {
          totalHomework: 89,
          completedHomework: 89,
          totalPoints: 0,
          currentLevel: 0,
          nextLevelPoints: 0
        };
      } else if (userType === 'parent') {
        // 家长统计数据
        stats = {
          totalHomework: 0,
          completedHomework: 0,
          totalPoints: 0,
          currentLevel: 0,
          nextLevelPoints: 0
        };
      }

      this.setData({ stats });
    } catch (error) {
      console.error('加载统计数据失败:', error);
    }
  },

  // 选择头像
  chooseAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        this.uploadAvatar(tempFilePath);
      }
    });
  },

  // 上传头像
  async uploadAvatar(filePath) {
    wx.showLoading({ title: '上传中...' });
    
    try {
      const result = await upload.uploadImage(filePath, {
        type: 'avatar',
        userId: this.data.userInfo.id
      });
      
      if (result.code === 200) {
        this.setData({
          'userInfo.avatar': result.data.url
        });
        
        // 更新全局用户信息
        app.globalData.userInfo.avatar = result.data.url;
        wx.setStorageSync('userInfo', app.globalData.userInfo);
        
        wx.showToast({
          title: '头像更新成功',
          icon: 'success'
        });
      }
    } catch (error) {
      console.error('上传头像失败:', error);
      wx.showToast({
        title: '上传失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  // 菜单项点击
  onMenuItemTap(e) {
    const { id } = e.currentTarget.dataset;
    
    switch (id) {
      case 'edit-profile':
        this.editProfile();
        break;
      case 'change-password':
        this.changePassword();
        break;
      case 'notification':
        this.openNotification();
        break;
      case 'settings':
        this.openSettings();
        break;
      case 'help':
        this.openHelp();
        break;
      case 'about':
        this.openAbout();
        break;
      default:
        wx.showToast({
          title: '功能开发中',
          icon: 'none'
        });
    }
  },

  // 编辑资料
  editProfile() {
    wx.navigateTo({
      url: '/pages/profile/edit-profile'
    });
  },

  // 修改密码
  changePassword() {
    wx.navigateTo({
      url: '/pages/profile/change-password'
    });
  },

  // 消息通知
  openNotification() {
    wx.navigateTo({
      url: '/pages/profile/notification'
    });
  },

  // 系统设置
  openSettings() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    });
  },

  // 帮助中心
  openHelp() {
    wx.navigateTo({
      url: '/pages/profile/help'
    });
  },

  // 关于我们
  openAbout() {
    wx.navigateTo({
      url: '/pages/profile/about'
    });
  },

  // Mock控制开关
  toggleMock() {
    if (API.isMockEnabled()) {
      API.disableMock();
      wx.showToast({
        title: 'Mock模式已关闭',
        icon: 'success'
      });
    } else {
      API.enableMock();
      wx.showToast({
        title: 'Mock模式已开启',
        icon: 'success'
      });
    }
  },

  // 打开Mock演示页面
  openMockDemo() {
    wx.navigateTo({
      url: '/pages/mock-demo/mock-demo'
    });
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          this.handleLogout();
        }
      }
    });
  },

  // 处理退出登录
  async handleLogout() {
    wx.showLoading({ title: '退出中...' });
    
    try {
      await auth.logout();
      
      // 清除本地数据
      app.clearUserInfo();
      
      // 跳转到登录页
      wx.reLaunch({
        url: '/pages/login/login'
      });
      
    } catch (error) {
      console.error('退出登录失败:', error);
      // 即使接口失败也清除本地数据
      app.clearUserInfo();
      wx.reLaunch({
        url: '/pages/login/login'
      });
    } finally {
      wx.hideLoading();
    }
  },

  // 分享功能
  onShareAppMessage() {
    return {
      title: '智慧教育小程序',
      path: '/pages/index/index',
      imageUrl: '/images/share-cover.png'
    };
  }
});