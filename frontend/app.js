// 简洁版微信小程序 - 网络教学班级管理平台
App({
  onLaunch() {
    console.log('班级管理小程序启动')
    
    // 检查登录状态
    this.checkLoginStatus()
    
    // 初始化全局数据
    this.globalData = {
      userInfo: null,
      teacherInfo: null,
      currentClass: null,
      tags: [] // 标签数据
    }
  },

  // 检查登录状态
  checkLoginStatus() {
    const token = wx.getStorageSync('token')
    if (token) {
      // 验证token有效性
      this.validateToken(token)
    }
  },

  // 验证token
  validateToken(token) {
    // TODO: 调用后端API验证token
    console.log('验证token:', token)
  },

  // 全局数据
  globalData: {
    userInfo: null,
    teacherInfo: null,
    currentClass: null,
    tags: []
  }
})