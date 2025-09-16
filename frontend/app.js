/**
 * 智慧教育小程序 - 应用入口
 * @description 简洁版本，专注于学生管理和标签功能
 * @author CodeBuddy
 */

// 导入数据管理器
import dataManager from './utils/data-manager.js'

App({
  /**
   * 全局数据
   */
  globalData: {
    userInfo: null,
    systemInfo: null,
    version: '1.0.0'
  },

  /**
   * 应用启动
   */
  onLaunch(options) {
    console.log('智慧教育小程序启动', options)
    
    // 获取系统信息
    this.getSystemInfo()
    
    // 初始化数据管理器
    this.initDataManager()
    
    // 检查更新
    this.checkForUpdate()
  },

  /**
   * 应用显示
   */
  onShow(options) {
    console.log('应用显示', options)
  },

  /**
   * 应用隐藏
   */
  onHide() {
    console.log('应用隐藏')
  },

  /**
   * 应用错误
   */
  onError(msg) {
    console.error('应用错误:', msg)
  },

  /**
   * 获取系统信息
   */
  getSystemInfo() {
    try {
      const systemInfo = wx.getSystemInfoSync()
      this.globalData.systemInfo = systemInfo
      console.log('系统信息:', systemInfo)
    } catch (error) {
      console.error('获取系统信息失败:', error)
    }
  },

  /**
   * 初始化数据管理器
   */
  async initDataManager() {
    try {
      // 初始化Mock数据（如果需要）
      await dataManager.init()
      console.log('数据管理器初始化成功')
    } catch (error) {
      console.error('数据管理器初始化失败:', error)
    }
  },

  /**
   * 检查小程序更新
   */
  checkForUpdate() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      
      updateManager.onCheckForUpdate((res) => {
        console.log('检查更新结果:', res.hasUpdate)
      })
      
      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: (res) => {
            if (res.confirm) {
              updateManager.applyUpdate()
            }
          }
        })
      })
      
      updateManager.onUpdateFailed(() => {
        console.error('新版本下载失败')
      })
    }
  },

  /**
   * 获取用户信息
   */
  getUserInfo() {
    return new Promise((resolve, reject) => {
      if (this.globalData.userInfo) {
        resolve(this.globalData.userInfo)
        return
      }
      
      wx.getUserProfile({
        desc: '用于完善用户资料',
        success: (res) => {
          this.globalData.userInfo = res.userInfo
          resolve(res.userInfo)
        },
        fail: reject
      })
    })
  },

  /**
   * 显示加载提示
   */
  showLoading(title = '加载中...') {
    wx.showLoading({
      title,
      mask: true
    })
  },

  /**
   * 隐藏加载提示
   */
  hideLoading() {
    wx.hideLoading()
  },

  /**
   * 显示成功提示
   */
  showSuccess(title = '操作成功') {
    wx.showToast({
      title,
      icon: 'success',
      duration: 2000
    })
  },

  /**
   * 显示错误提示
   */
  showError(title = '操作失败') {
    wx.showToast({
      title,
      icon: 'error',
      duration: 2000
    })
  },

  /**
   * 显示普通提示
   */
  showToast(title, icon = 'none') {
    wx.showToast({
      title,
      icon,
      duration: 2000
    })
  }
})