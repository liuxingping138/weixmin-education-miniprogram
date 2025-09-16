// pages/login/login.js
const app = getApp();
const { API } = require('../../utils/api.js');
const util = require('../../utils/util.js');

Page({
  data: {
    selectedIdentity: '', // 选中的身份：student, teacher, parent
    loginMethod: 'phone', // 登录方式：phone, wechat
    phone: '',
    verifyCode: '',
    canSendCode: false,
    codeButtonText: '获取验证码',
    countdown: 0,
    canLogin: false,
    loginLoading: false,
    agreedToTerms: false,
    showToast: false,
    toastMessage: ''
  },

  onLoad(options) {
    console.log('登录页面加载');
    
    // 启用Mock模式进行开发测试
    API.enableMock();
    console.log('Mock模式已启用');
    
    // 检查是否已经登录
    if (app.globalData.token) {
      this.redirectToHome();
      return;
    }
    
    // 从参数中获取身份类型
    if (options.identity) {
      this.setData({ selectedIdentity: options.identity });
    }
  },

  onShow() {
    // 重置登录状态
    this.setData({
      loginLoading: false
    });
  },

  // 选择身份
  selectIdentity(e) {
    const identity = e.currentTarget.dataset.identity;
    this.setData({ 
      selectedIdentity: identity 
    });
    this.checkCanLogin();
  },

  // 切换登录方式
  switchLoginMethod(e) {
    const method = e.currentTarget.dataset.method;
    this.setData({ 
      loginMethod: method,
      phone: '',
      verifyCode: ''
    });
    this.checkCanLogin();
  },

  // 手机号输入
  onPhoneInput(e) {
    const phone = e.detail.value;
    this.setData({ phone });
    
    // 验证手机号格式
    const canSendCode = util.validatePhone(phone);
    this.setData({ canSendCode });
    
    this.checkCanLogin();
  },

  // 验证码输入
  onCodeInput(e) {
    const verifyCode = e.detail.value;
    this.setData({ verifyCode });
    this.checkCanLogin();
  },

  // 发送验证码
  async sendVerifyCode() {
    const { phone, canSendCode, countdown } = this.data;
    
    if (!canSendCode || countdown > 0) {
      return;
    }

    try {
      const result = await API.auth.sendCode({ 
        phone,
        type: 'login'
      });
      
      console.log('验证码发送结果:', result);
      this.showToast('验证码已发送');
      this.startCountdown();
    } catch (error) {
      console.error('发送验证码失败:', error);
      this.showToast(error.message || '发送验证码失败');
    }
  },

  // 开始倒计时
  startCountdown() {
    let countdown = 60;
    this.setData({ 
      countdown,
      codeButtonText: `${countdown}s后重发`
    });

    const timer = setInterval(() => {
      countdown--;
      if (countdown <= 0) {
        clearInterval(timer);
        this.setData({
          countdown: 0,
          codeButtonText: '获取验证码'
        });
      } else {
        this.setData({
          countdown,
          codeButtonText: `${countdown}s后重发`
        });
      }
    }, 1000);
  },

  // 微信授权登录
  onGetUserProfile(e) {
    const { userInfo } = e.detail;
    if (!userInfo) {
      this.showToast('授权失败，请重试');
      return;
    }

    // 获取微信登录凭证
    wx.login({
      success: (res) => {
        if (res.code) {
          this.wechatLogin(res.code, userInfo);
        } else {
          this.showToast('获取登录凭证失败');
        }
      },
      fail: () => {
        this.showToast('微信登录失败');
      }
    });
  },

  // 微信登录
  async wechatLogin(code, userInfo) {
    const { selectedIdentity } = this.data;
    
    try {
      this.setData({ loginLoading: true });
      
      const res = await API.auth.login({
        type: 'wechat',
        code,
        userInfo,
        identity: selectedIdentity
      });

      console.log('微信登录结果:', res);
      await this.handleLoginSuccess(res);
    } catch (error) {
      console.error('微信登录失败:', error);
      this.showToast(error.message || '登录失败');
    } finally {
      this.setData({ loginLoading: false });
    }
  },

  // 处理登录
  async handleLogin() {
    const { 
      selectedIdentity, 
      loginMethod, 
      phone, 
      verifyCode, 
      canLogin,
      agreedToTerms 
    } = this.data;

    if (!canLogin) {
      return;
    }

    if (!agreedToTerms) {
      this.showToast('请先同意用户协议和隐私政策');
      return;
    }

    try {
      this.setData({ loginLoading: true });

      let loginData = {
        identity: selectedIdentity
      };

      if (loginMethod === 'phone') {
        loginData = {
          ...loginData,
          type: 'phone',
          phone,
          verifyCode
        };
      }

      const res = await API.auth.login(loginData);
      console.log('登录结果:', res);
      await this.handleLoginSuccess(res);
    } catch (error) {
      console.error('登录失败:', error);
      this.showToast(error.message || '登录失败');
    } finally {
      this.setData({ loginLoading: false });
    }
  },

  // 处理登录成功
  async handleLoginSuccess(data) {
    const { token, userInfo, userType } = data;
    
    // 保存用户信息到全局状态
    app.setUserInfo(userInfo, userType, token);
    
    this.showToast('登录成功');
    
    // 延迟跳转，让用户看到成功提示
    setTimeout(() => {
      this.redirectToHome();
    }, 1500);
  },

  // 检查是否可以登录
  checkCanLogin() {
    const { 
      selectedIdentity, 
      loginMethod, 
      phone, 
      verifyCode 
    } = this.data;

    let canLogin = false;

    if (selectedIdentity) {
      if (loginMethod === 'phone') {
        canLogin = util.validatePhone(phone) && verifyCode.length === 6;
      } else if (loginMethod === 'wechat') {
        canLogin = true;
      }
    }

    this.setData({ canLogin });
  },

  // 切换协议同意状态
  toggleAgreement() {
    this.setData({
      agreedToTerms: !this.data.agreedToTerms
    });
  },

  // 查看用户协议
  viewUserAgreement() {
    wx.navigateTo({
      url: '/pages/webview/webview?url=https://example.com/user-agreement&title=用户协议'
    });
  },

  // 查看隐私政策
  viewPrivacyPolicy() {
    wx.navigateTo({
      url: '/pages/webview/webview?url=https://example.com/privacy-policy&title=隐私政策'
    });
  },

  // 跳转到注册页面
  goToRegister() {
    wx.navigateTo({
      url: `/pages/register/register?identity=${this.data.selectedIdentity}`
    });
  },

  // 跳转到首页
  redirectToHome() {
    wx.reLaunch({
      url: '/pages/index/index'
    });
  },

  // 显示Toast提示
  showToast(message) {
    this.setData({
      toastMessage: message,
      showToast: true
    });

    setTimeout(() => {
      this.setData({ showToast: false });
    }, 2000);
  },

  // 页面分享
  onShareAppMessage() {
    return {
      title: '智慧教育小程序 - 让学习更高效',
      path: '/pages/login/login',
      imageUrl: '/images/share-cover.png'
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '智慧教育小程序 - 让学习更高效',
      imageUrl: '/images/share-cover.png'
    };
  }
});