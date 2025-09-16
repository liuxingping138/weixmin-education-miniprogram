/**
 * 数据管理器
 * @description 统一管理应用数据，提供数据操作接口
 * @author CodeBuddy
 * @date 2025-09-16
 */

import { StudentAPI, TagAPI, StatsAPI } from './mock-api.js'

/**
 * 数据管理器类
 */
class DataManager {
  constructor() {
    this.cache = {
      students: null,
      tags: null,
      stats: null
    }
    this.cacheExpiry = {
      students: 0,
      tags: 0,
      stats: 0
    }
    this.CACHE_DURATION = 5 * 60 * 1000 // 5分钟缓存
  }

  /**
   * 检查缓存是否有效
   * @param {string} key - 缓存键
   * @returns {boolean} 是否有效
   */
  isCacheValid(key) {
    return this.cache[key] && Date.now() < this.cacheExpiry[key]
  }

  /**
   * 设置缓存
   * @param {string} key - 缓存键
   * @param {*} data - 数据
   */
  setCache(key, data) {
    this.cache[key] = data
    this.cacheExpiry[key] = Date.now() + this.CACHE_DURATION
  }

  /**
   * 清除缓存
   * @param {string} key - 缓存键，不传则清除所有
   */
  clearCache(key = null) {
    if (key) {
      this.cache[key] = null
      this.cacheExpiry[key] = 0
    } else {
      this.cache = { students: null, tags: null, stats: null }
      this.cacheExpiry = { students: 0, tags: 0, stats: 0 }
    }
  }

  // ==================== 学生相关方法 ====================

  /**
   * 获取学生列表
   * @param {Object} params - 查询参数
   * @param {boolean} useCache - 是否使用缓存
   * @returns {Promise<Object>} 学生列表
   */
  async getStudents(params = {}, useCache = true) {
    try {
      // 如果有查询参数，不使用缓存
      const hasParams = Object.keys(params).length > 0
      if (!hasParams && useCache && this.isCacheValid('students')) {
        return {
          success: true,
          data: this.cache.students
        }
      }

      const response = await StudentAPI.getStudents(params)
      
      if (response.success && !hasParams) {
        this.setCache('students', response.data)
      }
      
      return response
    } catch (error) {
      console.error('获取学生列表失败:', error)
      return {
        success: false,
        message: '获取学生列表失败'
      }
    }
  }

  /**
   * 获取学生详情
   * @param {string} studentId - 学生ID
   * @returns {Promise<Object>} 学生详情
   */
  async getStudentById(studentId) {
    try {
      return await StudentAPI.getStudentById(studentId)
    } catch (error) {
      console.error('获取学生详情失败:', error)
      return {
        success: false,
        message: '获取学生详情失败'
      }
    }
  }

  /**
   * 创建学生
   * @param {Object} studentData - 学生数据
   * @returns {Promise<Object>} 创建结果
   */
  async createStudent(studentData) {
    try {
      const response = await StudentAPI.createStudent(studentData)
      
      if (response.success) {
        this.clearCache('students')
        this.clearCache('stats')
      }
      
      return response
    } catch (error) {
      console.error('创建学生失败:', error)
      return {
        success: false,
        message: '创建学生失败'
      }
    }
  }

  /**
   * 更新学生信息
   * @param {string} studentId - 学生ID
   * @param {Object} updateData - 更新数据
   * @returns {Promise<Object>} 更新结果
   */
  async updateStudent(studentId, updateData) {
    try {
      const response = await StudentAPI.updateStudent(studentId, updateData)
      
      if (response.success) {
        this.clearCache('students')
        this.clearCache('stats')
      }
      
      return response
    } catch (error) {
      console.error('更新学生信息失败:', error)
      return {
        success: false,
        message: '更新学生信息失败'
      }
    }
  }

  /**
   * 删除学生
   * @param {string} studentId - 学生ID
   * @returns {Promise<Object>} 删除结果
   */
  async deleteStudent(studentId) {
    try {
      const response = await StudentAPI.deleteStudent(studentId)
      
      if (response.success) {
        this.clearCache('students')
        this.clearCache('stats')
      }
      
      return response
    } catch (error) {
      console.error('删除学生失败:', error)
      return {
        success: false,
        message: '删除学生失败'
      }
    }
  }

  /**
   * 批量更新学生标签
   * @param {Array} studentIds - 学生ID数组
   * @param {Array} tagIds - 标签ID数组
   * @param {string} action - 操作类型
   * @returns {Promise<Object>} 更新结果
   */
  async batchUpdateStudentTags(studentIds, tagIds, action) {
    try {
      const response = await StudentAPI.batchUpdateStudentTags(studentIds, tagIds, action)
      
      if (response.success) {
        this.clearCache('students')
        this.clearCache('stats')
      }
      
      return response
    } catch (error) {
      console.error('批量更新学生标签失败:', error)
      return {
        success: false,
        message: '批量更新学生标签失败'
      }
    }
  }

  // ==================== 标签相关方法 ====================

  /**
   * 获取标签列表
   * @param {Object} params - 查询参数
   * @param {boolean} useCache - 是否使用缓存
   * @returns {Promise<Object>} 标签列表
   */
  async getTags(params = {}, useCache = true) {
    try {
      const hasParams = Object.keys(params).length > 0
      if (!hasParams && useCache && this.isCacheValid('tags')) {
        return {
          success: true,
          data: this.cache.tags
        }
      }

      const response = await TagAPI.getTags(params)
      
      if (response.success && !hasParams) {
        this.setCache('tags', response.data)
      }
      
      return response
    } catch (error) {
      console.error('获取标签列表失败:', error)
      return {
        success: false,
        message: '获取标签列表失败'
      }
    }
  }

  /**
   * 创建标签
   * @param {Object} tagData - 标签数据
   * @returns {Promise<Object>} 创建结果
   */
  async createTag(tagData) {
    try {
      const response = await TagAPI.createTag(tagData)
      
      if (response.success) {
        this.clearCache('tags')
      }
      
      return response
    } catch (error) {
      console.error('创建标签失败:', error)
      return {
        success: false,
        message: '创建标签失败'
      }
    }
  }

  /**
   * 更新标签
   * @param {string} tagId - 标签ID
   * @param {Object} updateData - 更新数据
   * @returns {Promise<Object>} 更新结果
   */
  async updateTag(tagId, updateData) {
    try {
      const response = await TagAPI.updateTag(tagId, updateData)
      
      if (response.success) {
        this.clearCache('tags')
      }
      
      return response
    } catch (error) {
      console.error('更新标签失败:', error)
      return {
        success: false,
        message: '更新标签失败'
      }
    }
  }

  /**
   * 删除标签
   * @param {string} tagId - 标签ID
   * @returns {Promise<Object>} 删除结果
   */
  async deleteTag(tagId) {
    try {
      const response = await TagAPI.deleteTag(tagId)
      
      if (response.success) {
        this.clearCache('tags')
        this.clearCache('students')
      }
      
      return response
    } catch (error) {
      console.error('删除标签失败:', error)
      return {
        success: false,
        message: '删除标签失败'
      }
    }
  }

  // ==================== 统计相关方法 ====================

  /**
   * 获取概览统计数据
   * @param {boolean} useCache - 是否使用缓存
   * @returns {Promise<Object>} 统计数据
   */
  async getOverviewStats(useCache = true) {
    try {
      if (useCache && this.isCacheValid('stats')) {
        return {
          success: true,
          data: this.cache.stats
        }
      }

      const response = await StatsAPI.getOverviewStats()
      
      if (response.success) {
        this.setCache('stats', response.data)
      }
      
      return response
    } catch (error) {
      console.error('获取统计数据失败:', error)
      return {
        success: false,
        message: '获取统计数据失败'
      }
    }
  }

  // ==================== 工具方法 ====================

  /**
   * 搜索学生
   * @param {string} keyword - 搜索关键词
   * @returns {Promise<Object>} 搜索结果
   */
  async searchStudents(keyword) {
    return this.getStudents({ keyword }, false)
  }

  /**
   * 按标签筛选学生
   * @param {Array} tagIds - 标签ID数组
   * @returns {Promise<Object>} 筛选结果
   */
  async filterStudentsByTags(tagIds) {
    return this.getStudents({ tags: tagIds }, false)
  }

  /**
   * 按状态筛选学生
   * @param {string} status - 学生状态
   * @returns {Promise<Object>} 筛选结果
   */
  async filterStudentsByStatus(status) {
    return this.getStudents({ status }, false)
  }
}

// 创建全局实例
const dataManager = new DataManager()

export default dataManager