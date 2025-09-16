/**
 * 学生管理页面
 * @description 学生列表展示、搜索、筛选和管理功能
 */

import dataManager from '../../utils/data-manager.js'

Page({
  data: {
    // 学生列表
    students: [],
    
    // 标签列表（用于筛选）
    tags: [],
    
    // 搜索关键词
    searchKeyword: '',
    
    // 筛选条件
    filters: {
      status: '', // 状态筛选：'active', 'inactive', ''
      tags: []    // 标签筛选
    },
    
    // 分页信息
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0,
      hasMore: true
    },
    
    // 加载状态
    loading: false,
    loadingMore: false,
    
    // 错误状态
    error: null,
    
    // UI状态
    showFilterPanel: false,
    selectedStudents: [], // 批量选择的学生
    isSelectionMode: false // 是否处于选择模式
  },

  /**
   * 页面加载
   */
  onLoad() {
    this.loadTags()
    this.loadStudents(true)
  },

  /**
   * 页面显示时刷新数据
   */
  onShow() {
    // 如果是从学生详情页返回，刷新列表
    if (this.data.students.length > 0) {
      this.loadStudents(true)
    }
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadStudents(true).finally(() => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 上拉加载更多
   */
  onReachBottom() {
    if (this.data.pagination.hasMore && !this.data.loadingMore) {
      this.loadStudents(false)
    }
  },

  /**
   * 加载标签列表
   */
  async loadTags() {
    try {
      const response = await dataManager.getTags()
      if (response.success) {
        this.setData({
          tags: response.data || []
        })
      }
    } catch (error) {
      console.error('加载标签失败:', error)
    }
  },

  /**
   * 加载学生列表
   * @param {boolean} refresh 是否刷新（重置分页）
   */
  async loadStudents(refresh = false) {
    try {
      if (refresh) {
        this.setData({ 
          loading: true, 
          error: null,
          'pagination.page': 1
        })
      } else {
        this.setData({ loadingMore: true })
      }

      const params = {
        page: refresh ? 1 : this.data.pagination.page + 1,
        pageSize: this.data.pagination.pageSize,
        keyword: this.data.searchKeyword,
        status: this.data.filters.status,
        tags: this.data.filters.tags
      }

      const response = await dataManager.getStudents(params, false)

      if (response.success) {
        const newStudents = response.data.list || []
        
        this.setData({
          students: refresh ? newStudents : [...this.data.students, ...newStudents],
          'pagination.page': params.page,
          'pagination.total': response.data.total || 0,
          'pagination.hasMore': newStudents.length === this.data.pagination.pageSize,
          loading: false,
          loadingMore: false
        })
      } else {
        throw new Error(response.message || '加载学生列表失败')
      }
    } catch (error) {
      console.error('加载学生列表失败:', error)
      this.setData({
        loading: false,
        loadingMore: false,
        error: refresh ? (error.message || '加载失败，请重试') : null
      })
      
      if (refresh) {
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        })
      }
    }
  },

  /**
   * 搜索输入处理
   */
  onSearchInput(e) {
    const keyword = e.detail.value
    this.setData({ searchKeyword: keyword })
    
    // 防抖处理
    clearTimeout(this.searchTimer)
    this.searchTimer = setTimeout(() => {
      this.loadStudents(true)
    }, 500)
  },

  /**
   * 清空搜索
   */
  onClearSearch() {
    this.setData({ searchKeyword: '' })
    this.loadStudents(true)
  },

  /**
   * 显示筛选面板
   */
  onShowFilter() {
    this.setData({ showFilterPanel: true })
  },

  /**
   * 隐藏筛选面板
   */
  onHideFilter() {
    this.setData({ showFilterPanel: false })
  },

  /**
   * 状态筛选
   */
  onStatusFilter(e) {
    const status = e.currentTarget.dataset.status
    this.setData({ 
      'filters.status': status === this.data.filters.status ? '' : status,
      showFilterPanel: false
    })
    this.loadStudents(true)
  },

  /**
   * 标签筛选
   */
  onTagFilter(e) {
    const tagId = e.currentTarget.dataset.tagId
    const currentTags = [...this.data.filters.tags]
    const index = currentTags.indexOf(tagId)
    
    if (index > -1) {
      currentTags.splice(index, 1)
    } else {
      currentTags.push(tagId)
    }
    
    this.setData({ 
      'filters.tags': currentTags,
      showFilterPanel: false
    })
    this.loadStudents(true)
  },

  /**
   * 清空筛选
   */
  onClearFilter() {
    this.setData({
      'filters.status': '',
      'filters.tags': [],
      showFilterPanel: false
    })
    this.loadStudents(true)
  },

  /**
   * 跳转到学生详情
   */
  onGoToStudentDetail(e) {
    if (this.data.isSelectionMode) {
      this.onToggleStudentSelection(e)
      return
    }
    
    const studentId = e.currentTarget.dataset.studentId
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
   * 切换选择模式
   */
  onToggleSelectionMode() {
    this.setData({
      isSelectionMode: !this.data.isSelectionMode,
      selectedStudents: []
    })
  },

  /**
   * 切换学生选择状态
   */
  onToggleStudentSelection(e) {
    const studentId = e.currentTarget.dataset.studentId
    const selectedStudents = [...this.data.selectedStudents]
    const index = selectedStudents.indexOf(studentId)
    
    if (index > -1) {
      selectedStudents.splice(index, 1)
    } else {
      selectedStudents.push(studentId)
    }
    
    this.setData({ selectedStudents })
  },

  /**
   * 全选/取消全选
   */
  onToggleSelectAll() {
    const allSelected = this.data.selectedStudents.length === this.data.students.length
    this.setData({
      selectedStudents: allSelected ? [] : this.data.students.map(s => s.id)
    })
  },

  /**
   * 批量删除学生
   */
  async onBatchDelete() {
    if (this.data.selectedStudents.length === 0) {
      wx.showToast({
        title: '请选择要删除的学生',
        icon: 'none'
      })
      return
    }

    const result = await new Promise(resolve => {
      wx.showModal({
        title: '确认删除',
        content: `确定要删除选中的 ${this.data.selectedStudents.length} 个学生吗？`,
        success: resolve
      })
    })

    if (!result.confirm) return

    try {
      wx.showLoading({ title: '删除中...' })
      
      // 逐个删除学生
      for (const studentId of this.data.selectedStudents) {
        await dataManager.deleteStudent(studentId)
      }
      
      wx.hideLoading()
      wx.showToast({
        title: '删除成功',
        icon: 'success'
      })
      
      this.setData({
        selectedStudents: [],
        isSelectionMode: false
      })
      
      this.loadStudents(true)
    } catch (error) {
      wx.hideLoading()
      wx.showToast({
        title: '删除失败',
        icon: 'none'
      })
    }
  },

  /**
   * 重新加载
   */
  onRetry() {
    this.loadStudents(true)
  },

  /**
   * 获取标签名称
   */
  getTagName(tagId) {
    const tag = this.data.tags.find(t => t.id === tagId)
    return tag ? tag.name : ''
  },

  /**
   * 获取标签颜色
   */
  getTagColor(tagId) {
    const tag = this.data.tags.find(t => t.id === tagId)
    return tag ? tag.color : '#999'
  }
})