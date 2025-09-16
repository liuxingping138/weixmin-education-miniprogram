/**
 * 个人资料页面
 * @description 显示用户信息和应用设置
 * @author CodeBuddy
 */

const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      name: '张老师',
      avatar: '/images/default-avatar.png',
      school: '智慧教育学院',
      subject: '数学',
      teachingYears: 5,
      studentCount: 0,
      tagCount: 0
    },
    
    menuItems: [
      {
        id: 'data-export',
        title: '数据导出',
        icon: '📊',
        desc: '导出学生数据和统计报告'
      },
      {
        id: 'data-import',
        title: '数据导入',
        icon: '📥',
        desc: '批量导入学生信息'
      },
      {
        id: 'backup',
        title: '数据备份',
        icon: '💾',
        desc: '备份和恢复数据'
      },
      {
        id: 'settings',
        title: '应用设置',
        icon: '⚙️',
        desc: '个性化设置和偏好'
      },
      {
        id: 'help',
        title: '帮助中心',
        icon: '❓',
        desc: '使用指南和常见问题'
      },
      {
        id: 'feedback',
        title: '意见反馈',
        icon: '💬',
        desc: '提交建议和问题反馈'
      },
      {
        id: 'about',
        title: '关于应用',
        icon: 'ℹ️',
        desc: '版本信息和开发团队'
      }
    ],
    
    loading: false,
    error: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadUserStats()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 每次显示页面时刷新统计数据
    this.loadUserStats()
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadUserStats().finally(() => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 加载用户统计数据
   */
  async loadUserStats() {
    try {
      this.setData({ loading: true, error: null })
      
      // 这里使用Mock数据，后续可以替换为真实API
      const mockStats = {
        studentCount: 25,
        tagCount: 8
      }
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      this.setData({
        'userInfo.studentCount': mockStats.studentCount,
        'userInfo.tagCount': mockStats.tagCount,
        loading: false
      })
      
    } catch (error) {
      console.error('加载用户统计失败:', error)
      this.setData({
        error: '加载数据失败，请重试',
        loading: false
      })
      
      wx.showToast({
        title: '加载失败',
        icon: 'error'
      })
    }
  },

  /**
   * 编辑用户信息
   */
  onEditProfile() {
    wx.showModal({
      title: '编辑资料',
      content: '此功能正在开发中...',
      showCancel: false
    })
  },

  /**
   * 菜单项点击处理
   */
  onMenuItemTap(e) {
    const { itemId } = e.currentTarget.dataset
    
    switch (itemId) {
      case 'data-export':
        this.handleDataExport()
        break
      case 'data-import':
        this.handleDataImport()
        break
      case 'backup':
        this.handleBackup()
        break
      case 'settings':
        this.handleSettings()
        break
      case 'help':
        this.handleHelp()
        break
      case 'feedback':
        this.handleFeedback()
        break
      case 'about':
        this.handleAbout()
        break
      default:
        wx.showToast({
          title: '功能开发中',
          icon: 'none'
        })
    }
  },

  /**
   * 数据导出
   */
  handleDataExport() {
    wx.showActionSheet({
      itemList: ['导出学生列表', '导出标签数据', '导出统计报告'],
      success: (res) => {
        const options = ['学生列表', '标签数据', '统计报告']
        wx.showModal({
          title: '导出确认',
          content: `确定要导出${options[res.tapIndex]}吗？`,
          success: (modalRes) => {
            if (modalRes.confirm) {
              wx.showLoading({ title: '导出中...' })
              
              // 模拟导出过程
              setTimeout(() => {
                wx.hideLoading()
                wx.showToast({
                  title: '导出成功',
                  icon: 'success'
                })
              }, 2000)
            }
          }
        })
      }
    })
  },

  /**
   * 数据导入
   */
  handleDataImport() {
    wx.showModal({
      title: '数据导入',
      content: '支持Excel格式的学生信息批量导入，是否查看导入模板？',
      success: (res) => {
        if (res.confirm) {
          wx.showModal({
            title: '导入模板',
            content: '模板包含：姓名、年级、年龄、联系方式等字段。请按照模板格式准备数据。',
            showCancel: false
          })
        }
      }
    })
  },

  /**
   * 数据备份
   */
  handleBackup() {
    wx.showActionSheet({
      itemList: ['立即备份', '恢复数据', '查看备份历史'],
      success: (res) => {
        const actions = ['备份', '恢复', '查看历史']
        wx.showLoading({ title: `${actions[res.tapIndex]}中...` })
        
        setTimeout(() => {
          wx.hideLoading()
          wx.showToast({
            title: `${actions[res.tapIndex]}成功`,
            icon: 'success'
          })
        }, 1500)
      }
    })
  },

  /**
   * 应用设置
   */
  handleSettings() {
    wx.showModal({
      title: '应用设置',
      content: '包含主题设置、通知设置、数据同步等选项。',
      showCancel: false
    })
  },

  /**
   * 帮助中心
   */
  handleHelp() {
    wx.showModal({
      title: '帮助中心',
      content: '1. 如何添加学生？\n2. 如何使用标签功能？\n3. 数据导入导出说明\n4. 常见问题解答',
      showCancel: false
    })
  },

  /**
   * 意见反馈
   */
  handleFeedback() {
    wx.showModal({
      title: '意见反馈',
      content: '请通过以下方式联系我们：\n邮箱：feedback@example.com\n微信：智慧教育助手',
      showCancel: false
    })
  },

  /**
   * 关于应用
   */
  handleAbout() {
    wx.showModal({
      title: '关于智慧教育小程序',
      content: '版本：v1.0.0\n开发：智慧教育团队\n\n专为在线教育老师设计的学生管理工具，帮助老师更好地管理和了解学生。',
      showCancel: false
    })
  },

  /**
   * 重试加载
   */
  onRetry() {
    this.loadUserStats()
  }
})