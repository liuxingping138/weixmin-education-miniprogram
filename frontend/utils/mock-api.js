/**
 * Mock API 工具
 * @description 模拟后端API接口，提供数据操作功能
 * @author CodeBuddy
 * @date 2025-09-16
 */

import { mockStudents, generateRandomStudent, STUDENT_STATUS } from '../data/mock-students.js'
import { mockTags, generateRandomTag, TAG_TYPES } from '../data/mock-tags.js'

// 模拟网络延迟
const MOCK_DELAY = 300

// 模拟API响应格式
function createResponse(data, success = true, message = '') {
  return {
    success,
    data,
    message,
    timestamp: new Date().toISOString()
  }
}

// 模拟异步延迟
function delay(ms = MOCK_DELAY) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 学生相关API
 */
export const StudentAPI = {
  /**
   * 获取学生列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @param {string} params.keyword - 搜索关键词
   * @param {string} params.status - 学生状态
   * @param {Array} params.tags - 标签筛选
   * @returns {Promise<Object>} 学生列表响应
   */
  async getStudents(params = {}) {
    await delay()
    
    try {
      let students = [...mockStudents]
      
      // 关键词搜索
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase()
        students = students.filter(student => 
          student.name.toLowerCase().includes(keyword) ||
          student.grade.includes(keyword) ||
          student.notes.toLowerCase().includes(keyword)
        )
      }
      
      // 状态筛选
      if (params.status) {
        students = students.filter(student => student.status === params.status)
      }
      
      // 标签筛选
      if (params.tags && params.tags.length > 0) {
        students = students.filter(student => 
          params.tags.some(tagId => student.tags.includes(tagId))
        )
      }
      
      // 分页处理
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      
      const paginatedStudents = students.slice(startIndex, endIndex)
      
      return createResponse({
        list: paginatedStudents,
        total: students.length,
        page,
        pageSize,
        totalPages: Math.ceil(students.length / pageSize)
      })
    } catch (error) {
      return createResponse(null, false, '获取学生列表失败')
    }
  },

  /**
   * 获取学生详情
   * @param {string} studentId - 学生ID
   * @returns {Promise<Object>} 学生详情响应
   */
  async getStudentById(studentId) {
    await delay()
    
    try {
      const student = mockStudents.find(s => s.id === studentId)
      if (!student) {
        return createResponse(null, false, '学生不存在')
      }
      
      return createResponse(student)
    } catch (error) {
      return createResponse(null, false, '获取学生详情失败')
    }
  },

  /**
   * 创建学生
   * @param {Object} studentData - 学生数据
   * @returns {Promise<Object>} 创建结果
   */
  async createStudent(studentData) {
    await delay()
    
    try {
      // 验证必填字段
      if (!studentData.name || !studentData.grade) {
        return createResponse(null, false, '姓名和年级为必填项')
      }
      
      // 检查姓名是否重复
      const existingStudent = mockStudents.find(s => s.name === studentData.name)
      if (existingStudent) {
        return createResponse(null, false, '学生姓名已存在')
      }
      
      const newStudent = {
        id: `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...studentData,
        status: studentData.status || STUDENT_STATUS.ACTIVE,
        tags: studentData.tags || [],
        progress: studentData.progress || 0,
        joinDate: new Date().toISOString().split('T')[0],
        lastActiveTime: new Date().toISOString().replace('T', ' ').split('.')[0],
        createTime: new Date().toISOString().replace('T', ' ').split('.')[0],
        updateTime: new Date().toISOString().replace('T', ' ').split('.')[0]
      }
      
      mockStudents.push(newStudent)
      
      return createResponse(newStudent, true, '学生创建成功')
    } catch (error) {
      return createResponse(null, false, '创建学生失败')
    }
  },

  /**
   * 更新学生信息
   * @param {string} studentId - 学生ID
   * @param {Object} updateData - 更新数据
   * @returns {Promise<Object>} 更新结果
   */
  async updateStudent(studentId, updateData) {
    await delay()
    
    try {
      const studentIndex = mockStudents.findIndex(s => s.id === studentId)
      if (studentIndex === -1) {
        return createResponse(null, false, '学生不存在')
      }
      
      const updatedStudent = {
        ...mockStudents[studentIndex],
        ...updateData,
        updateTime: new Date().toISOString().replace('T', ' ').split('.')[0]
      }
      
      mockStudents[studentIndex] = updatedStudent
      
      return createResponse(updatedStudent, true, '学生信息更新成功')
    } catch (error) {
      return createResponse(null, false, '更新学生信息失败')
    }
  },

  /**
   * 删除学生
   * @param {string} studentId - 学生ID
   * @returns {Promise<Object>} 删除结果
   */
  async deleteStudent(studentId) {
    await delay()
    
    try {
      const studentIndex = mockStudents.findIndex(s => s.id === studentId)
      if (studentIndex === -1) {
        return createResponse(null, false, '学生不存在')
      }
      
      mockStudents.splice(studentIndex, 1)
      
      return createResponse(null, true, '学生删除成功')
    } catch (error) {
      return createResponse(null, false, '删除学生失败')
    }
  },

  /**
   * 批量更新学生标签
   * @param {Array} studentIds - 学生ID数组
   * @param {Array} tagIds - 标签ID数组
   * @param {string} action - 操作类型：'add' | 'remove' | 'replace'
   * @returns {Promise<Object>} 更新结果
   */
  async batchUpdateStudentTags(studentIds, tagIds, action = 'add') {
    await delay()
    
    try {
      let updatedCount = 0
      
      studentIds.forEach(studentId => {
        const studentIndex = mockStudents.findIndex(s => s.id === studentId)
        if (studentIndex !== -1) {
          const student = mockStudents[studentIndex]
          
          switch (action) {
            case 'add':
              tagIds.forEach(tagId => {
                if (!student.tags.includes(tagId)) {
                  student.tags.push(tagId)
                }
              })
              break
            case 'remove':
              student.tags = student.tags.filter(tagId => !tagIds.includes(tagId))
              break
            case 'replace':
              student.tags = [...tagIds]
              break
          }
          
          student.updateTime = new Date().toISOString().replace('T', ' ').split('.')[0]
          updatedCount++
        }
      })
      
      return createResponse({ updatedCount }, true, `成功更新${updatedCount}个学生的标签`)
    } catch (error) {
      return createResponse(null, false, '批量更新标签失败')
    }
  }
}

/**
 * 标签相关API
 */
export const TagAPI = {
  /**
   * 获取标签列表
   * @param {Object} params - 查询参数
   * @returns {Promise<Object>} 标签列表响应
   */
  async getTags(params = {}) {
    await delay()
    
    try {
      let tags = [...mockTags]
      
      // 类型筛选
      if (params.type) {
        tags = tags.filter(tag => tag.type === params.type)
      }
      
      // 系统/自定义筛选
      if (params.isSystem !== undefined) {
        tags = tags.filter(tag => tag.isSystem === params.isSystem)
      }
      
      return createResponse(tags)
    } catch (error) {
      return createResponse(null, false, '获取标签列表失败')
    }
  },

  /**
   * 创建标签
   * @param {Object} tagData - 标签数据
   * @returns {Promise<Object>} 创建结果
   */
  async createTag(tagData) {
    await delay()
    
    try {
      // 验证必填字段
      if (!tagData.name) {
        return createResponse(null, false, '标签名称为必填项')
      }
      
      // 检查名称是否重复
      const existingTag = mockTags.find(t => t.name === tagData.name)
      if (existingTag) {
        return createResponse(null, false, '标签名称已存在')
      }
      
      const newTag = {
        id: `tag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...tagData,
        type: tagData.type || TAG_TYPES.CUSTOM,
        isSystem: false,
        studentCount: 0,
        createTime: new Date().toISOString().replace('T', ' ').split('.')[0],
        updateTime: new Date().toISOString().replace('T', ' ').split('.')[0]
      }
      
      mockTags.push(newTag)
      
      return createResponse(newTag, true, '标签创建成功')
    } catch (error) {
      return createResponse(null, false, '创建标签失败')
    }
  },

  /**
   * 更新标签
   * @param {string} tagId - 标签ID
   * @param {Object} updateData - 更新数据
   * @returns {Promise<Object>} 更新结果
   */
  async updateTag(tagId, updateData) {
    await delay()
    
    try {
      const tagIndex = mockTags.findIndex(t => t.id === tagId)
      if (tagIndex === -1) {
        return createResponse(null, false, '标签不存在')
      }
      
      const tag = mockTags[tagIndex]
      if (tag.isSystem) {
        return createResponse(null, false, '系统标签不允许修改')
      }
      
      const updatedTag = {
        ...tag,
        ...updateData,
        updateTime: new Date().toISOString().replace('T', ' ').split('.')[0]
      }
      
      mockTags[tagIndex] = updatedTag
      
      return createResponse(updatedTag, true, '标签更新成功')
    } catch (error) {
      return createResponse(null, false, '更新标签失败')
    }
  },

  /**
   * 删除标签
   * @param {string} tagId - 标签ID
   * @returns {Promise<Object>} 删除结果
   */
  async deleteTag(tagId) {
    await delay()
    
    try {
      const tagIndex = mockTags.findIndex(t => t.id === tagId)
      if (tagIndex === -1) {
        return createResponse(null, false, '标签不存在')
      }
      
      const tag = mockTags[tagIndex]
      if (tag.isSystem) {
        return createResponse(null, false, '系统标签不允许删除')
      }
      
      // 从所有学生中移除该标签
      mockStudents.forEach(student => {
        student.tags = student.tags.filter(t => t !== tagId)
      })
      
      mockTags.splice(tagIndex, 1)
      
      return createResponse(null, true, '标签删除成功')
    } catch (error) {
      return createResponse(null, false, '删除标签失败')
    }
  }
}

/**
 * 统计相关API
 */
export const StatsAPI = {
  /**
   * 获取概览统计数据
   * @returns {Promise<Object>} 统计数据响应
   */
  async getOverviewStats() {
    await delay()
    
    try {
      const totalStudents = mockStudents.length
      const activeStudents = mockStudents.filter(s => s.status === STUDENT_STATUS.ACTIVE).length
      const inactiveStudents = mockStudents.filter(s => s.status === STUDENT_STATUS.INACTIVE).length
      
      // 计算平均进度
      const totalProgress = mockStudents.reduce((sum, student) => sum + (student.progress || 0), 0)
      const avgProgress = totalStudents > 0 ? Math.round(totalProgress / totalStudents) : 0
      
      // 标签统计
      const totalTags = mockTags.length
      const systemTags = mockTags.filter(t => t.isSystem).length
      const customTags = mockTags.filter(t => !t.isSystem).length
      
      // 年级分布
      const gradeDistribution = {}
      mockStudents.forEach(student => {
        gradeDistribution[student.grade] = (gradeDistribution[student.grade] || 0) + 1
      })
      
      // 最近活跃学生
      const recentActiveStudents = mockStudents
        .filter(s => s.status === STUDENT_STATUS.ACTIVE)
        .sort((a, b) => new Date(b.lastActiveTime) - new Date(a.lastActiveTime))
        .slice(0, 5)
      
      return createResponse({
        students: {
          total: totalStudents,
          active: activeStudents,
          inactive: inactiveStudents,
          avgProgress
        },
        tags: {
          total: totalTags,
          system: systemTags,
          custom: customTags
        },
        gradeDistribution,
        recentActiveStudents
      })
    } catch (error) {
      return createResponse(null, false, '获取统计数据失败')
    }
  }
}