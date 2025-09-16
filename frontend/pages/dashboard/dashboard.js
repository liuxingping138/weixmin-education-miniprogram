/**
 * 概览页面
 * @description 显示学生和标签的统计信息，提供快速操作入口
 */

import dataManager from '../../utils/data-manager.js'

Page({
  data: {
    // 统计数据
    stats: {
      students: {
        total: 0,
        active: 0,
        inactive: 0,
        avgProgress: 0
      },
      tags: {
        total: 0,
        system: 0,
        custom: 0
      }
    },
    
    // 年级分布
    gradeDistribution: {},
    
    // 最近活跃学生
    recentActiveStudents: [],
    
    // 加载状态
    loading: true,
    
    // 错误状态
    error: null
  },

  /**
   * 页面加载
   */
  onLoad() {
    this.loadDashboardData()
  },

  /**
   * 页面显示时刷新数据
   */
  onShow() {
    this.loadDashboardData()
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadDashboardData().finally(() => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 加载概览数据
   */
  async loadDashboardData() {
    try {
      this.setData({ loading: true, error: null })
      
      const response = await dataManager.getOverviewStats()
      
      if (response.success) {
        this.setData({
          stats: response.data.students ? {
            students: response.data.students,
            tags: response.data.tags
          } : this.data.stats,
          gradeDistribution: response.data.gradeDistribution || {},
          recentActiveStudents: response.data.recentActiveStudents || [],
          loading: false
        })
      } else {
        throw new Error(response.message || '加载数据失败')
      }
    } catch (error) {
      console.error('加载概览数据失败:', error)
      this.setData({
        loading: false,
        error: error.message || '加载数据失败，请重试'
      })
      
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  /**
   * 跳转到学生管理页面
   */
  onGoToStudents() {
    wx.navigateTo({
      url: '/pages/students/students'
    })
  },

  /**
   * 跳转到标签管理页面
   */
  onGoToTags() {
    wx.navigateTo({
      url: '/pages/tags/tags'
    })
  },

  /**
   * 跳转到学生详情页面
   */
  onGoToStudentDetail(e) {
    const { studentId } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/student-detail/student-detail?id=${studentId}`
    })
  },

  /**
   * 添加新学生
   */
  onAddStudent() {
    wx.navigateTo({
      url: '/pages/student-detail/student-detail?mode=create'
    })
  },

  /**
   * 重新加载数据
   */
  onRetry() {
    this.loadDashboardData()
  }
})