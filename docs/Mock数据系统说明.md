# Mock数据系统说明

## 📋 概述

为了提高开发效率，项目采用Mock数据优先的开发策略。Mock数据系统完全模拟真实API的行为，支持完整的CRUD操作和业务逻辑。

## 🎯 设计目标

1. **快速开发**: 前端无需等待后端接口，可立即开始开发
2. **真实模拟**: 完全模拟真实API的响应格式和业务逻辑
3. **易于切换**: 一键切换Mock模式和真实API模式
4. **便于测试**: 支持各种数据场景和边界情况测试

## 📁 文件结构

```
frontend/
├── data/                    # Mock数据文件
│   ├── mock-students.js     # 学生数据
│   └── mock-tags.js         # 标签数据
├── utils/
│   ├── mock-api.js          # Mock API实现
│   ├── data-manager.js      # 数据管理器
│   └── config.js            # 配置文件
```

## 🔧 核心组件

### 1. Mock数据文件

#### `mock-students.js`
- 提供8个预设学生数据
- 包含完整的学生信息字段
- 支持随机学生数据生成
- 包含学生状态、标签、进度等信息

#### `mock-tags.js`
- 提供11个预设标签数据
- 包含系统标签和自定义标签
- 支持不同类型和颜色的标签
- 包含标签统计信息

### 2. Mock API (`mock-api.js`)

#### 学生API (StudentAPI)
```javascript
// 获取学生列表（支持分页、搜索、筛选）
StudentAPI.getStudents(params)

// 获取学生详情
StudentAPI.getStudentById(studentId)

// 创建学生
StudentAPI.createStudent(studentData)

// 更新学生信息
StudentAPI.updateStudent(studentId, updateData)

// 删除学生
StudentAPI.deleteStudent(studentId)

// 批量更新学生标签
StudentAPI.batchUpdateStudentTags(studentIds, tagIds, action)
```

#### 标签API (TagAPI)
```javascript
// 获取标签列表
TagAPI.getTags(params)

// 创建标签
TagAPI.createTag(tagData)

// 更新标签
TagAPI.updateTag(tagId, updateData)

// 删除标签
TagAPI.deleteTag(tagId)
```

#### 统计API (StatsAPI)
```javascript
// 获取概览统计数据
StatsAPI.getOverviewStats()
```

### 3. 数据管理器 (`data-manager.js`)

统一的数据访问层，提供：
- 缓存管理
- 错误处理
- 数据一致性保证
- 便捷的查询方法

### 4. 配置系统 (`config.js`)

支持：
- Mock/真实API模式切换
- 环境配置管理
- 调试选项控制
- 日志系统

## 🚀 使用方法

### 1. 基本使用

```javascript
import dataManager from '../utils/data-manager.js'

Page({
  async onLoad() {
    // 获取学生列表
    const response = await dataManager.getStudents()
    if (response.success) {
      this.setData({
        students: response.data.list
      })
    }
  },

  async onSearch(e) {
    const keyword = e.detail.value
    // 搜索学生
    const response = await dataManager.searchStudents(keyword)
    if (response.success) {
      this.setData({
        searchResults: response.data.list
      })
    }
  }
})
```

### 2. 创建学生

```javascript
async createStudent() {
  const studentData = {
    name: '新学生',
    grade: '五年级',
    age: 11,
    gender: '男',
    phone: '13800138000',
    parentPhone: '13900139000',
    subjects: ['数学', '语文']
  }

  const response = await dataManager.createStudent(studentData)
  if (response.success) {
    wx.showToast({
      title: '创建成功',
      icon: 'success'
    })
    // 刷新列表
    this.loadStudents()
  } else {
    wx.showToast({
      title: response.message,
      icon: 'none'
    })
  }
}
```

### 3. 标签操作

```javascript
async loadTags() {
  const response = await dataManager.getTags()
  if (response.success) {
    this.setData({
      tags: response.data
    })
  }
}

async createTag() {
  const tagData = {
    name: '新标签',
    color: '#4299E1',
    type: 'custom',
    description: '自定义标签'
  }

  const response = await dataManager.createTag(tagData)
  if (response.success) {
    this.loadTags() // 刷新标签列表
  }
}
```

## ⚙️ 配置切换

### 切换到Mock模式
```javascript
// config.js
export const CONFIG = {
  API_MODE: 'mock',
  // ... 其他配置
}
```

### 切换到真实API模式
```javascript
// config.js
export const CONFIG = {
  API_MODE: 'real',
  REAL_API_CONFIG: {
    baseUrl: 'https://api.example.com',
    // ... 其他配置
  }
}
```

## 📊 数据格式

### 学生数据格式
```javascript
{
  id: 'student_001',
  name: '张小明',
  avatar: '/images/avatars/avatar1.png',
  grade: '五年级',
  age: 11,
  gender: '男',
  phone: '13800138001',
  parentPhone: '13900139001',
  status: 'active',           // 'active' | 'inactive' | 'graduated'
  tags: ['tag_001', 'tag_003'],
  progress: 85,
  joinDate: '2024-09-01',
  lastActiveTime: '2025-09-16 10:30:00',
  notes: '学习积极主动，数学成绩优秀',
  subjects: ['数学', '语文', '英语'],
  createTime: '2024-09-01 09:00:00',
  updateTime: '2025-09-16 10:30:00'
}
```

### 标签数据格式
```javascript
{
  id: 'tag_001',
  name: '优秀学生',
  color: '#48BB78',
  type: 'academic',           // 'system' | 'custom' | 'behavior' | 'academic' | 'special'
  description: '学习成绩优秀，表现突出的学生',
  isSystem: true,
  studentCount: 3,
  createTime: '2024-09-01 09:00:00',
  updateTime: '2025-09-16 10:30:00'
}
```

### API响应格式
```javascript
{
  success: true,              // 是否成功
  data: {},                   // 响应数据
  message: '操作成功',         // 消息
  timestamp: '2025-09-16T10:30:00.000Z'
}
```

## 🔍 高级功能

### 1. 分页查询
```javascript
const response = await dataManager.getStudents({
  page: 1,
  pageSize: 10,
  keyword: '张三',
  status: 'active',
  tags: ['tag_001', 'tag_002']
})
```

### 2. 批量操作
```javascript
// 批量添加标签
await dataManager.batchUpdateStudentTags(
  ['student_001', 'student_002'],
  ['tag_001'],
  'add'
)

// 批量移除标签
await dataManager.batchUpdateStudentTags(
  ['student_001', 'student_002'],
  ['tag_001'],
  'remove'
)
```

### 3. 缓存管理
```javascript
// 强制刷新数据（不使用缓存）
const response = await dataManager.getStudents({}, false)

// 清除指定缓存
dataManager.clearCache('students')

// 清除所有缓存
dataManager.clearCache()
```

## 🧪 测试场景

Mock系统支持以下测试场景：

1. **正常数据流程**: 完整的CRUD操作
2. **边界情况**: 空数据、大量数据
3. **错误处理**: 网络错误、数据验证错误
4. **性能测试**: 大数据量下的响应速度
5. **并发操作**: 同时进行多个数据操作

## 🔄 迁移到真实API

当后端API准备就绪时，迁移步骤：

1. **更新配置**: 修改`config.js`中的`API_MODE`为`'real'`
2. **配置API地址**: 设置`REAL_API_CONFIG.baseUrl`
3. **实现真实API**: 创建`real-api.js`文件，实现真实API调用
4. **更新数据管理器**: 在`data-manager.js`中根据配置选择API实现
5. **测试验证**: 确保真实API的响应格式与Mock API一致

## 📝 注意事项

1. **数据一致性**: Mock数据会在应用重启后重置
2. **ID生成**: Mock系统使用时间戳+随机数生成ID
3. **关联关系**: 学生和标签的关联关系需要手动维护
4. **性能考虑**: 大量数据时建议使用分页查询
5. **错误模拟**: 可以通过配置模拟各种错误场景

## 🎉 优势总结

1. **开发效率**: 前后端并行开发，提高整体效率
2. **测试完整**: 可以测试各种数据场景和边界情况
3. **演示友好**: 有完整的示例数据，便于演示
4. **维护简单**: 统一的数据管理，易于维护和扩展
5. **切换便捷**: 一键切换Mock和真实API，无缝迁移