/**
 * 标签Mock数据
 * @description 提供标签相关的模拟数据
 * @author CodeBuddy
 * @date 2025-09-16
 */

// 标签类型枚举
export const TAG_TYPES = {
  SYSTEM: 'system',     // 系统标签
  CUSTOM: 'custom',     // 自定义标签
  BEHAVIOR: 'behavior', // 行为标签
  ACADEMIC: 'academic', // 学术标签
  SPECIAL: 'special'    // 特殊标签
}

// 标签颜色预设
export const TAG_COLORS = {
  RED: '#F56565',
  ORANGE: '#ED8936',
  YELLOW: '#ECC94B',
  GREEN: '#48BB78',
  TEAL: '#38B2AC',
  BLUE: '#4299E1',
  CYAN: '#0BC5EA',
  PURPLE: '#9F7AEA',
  PINK: '#ED64A6',
  GRAY: '#A0AEC0'
}

// Mock标签数据
export const mockTags = [
  {
    id: 'tag_001',
    name: '优秀学生',
    color: TAG_COLORS.GREEN,
    type: TAG_TYPES.ACADEMIC,
    description: '学习成绩优秀，表现突出的学生',
    isSystem: true,
    studentCount: 3,
    createTime: '2024-09-01 09:00:00',
    updateTime: '2025-09-16 10:30:00'
  },
  {
    id: 'tag_002',
    name: '积极发言',
    color: TAG_COLORS.BLUE,
    type: TAG_TYPES.BEHAVIOR,
    description: '课堂上积极发言，参与度高',
    isSystem: true,
    studentCount: 3,
    createTime: '2024-09-01 09:00:00',
    updateTime: '2025-09-16 10:30:00'
  },
  {
    id: 'tag_003',
    name: '作业认真',
    color: TAG_COLORS.TEAL,
    type: TAG_TYPES.BEHAVIOR,
    description: '作业完成质量高，态度认真',
    isSystem: true,
    studentCount: 2,
    createTime: '2024-09-01 09:00:00',
    updateTime: '2025-09-16 10:30:00'
  },
  {
    id: 'tag_004',
    name: '创意思维',
    color: TAG_COLORS.PURPLE,
    type: TAG_TYPES.SPECIAL,
    description: '思维活跃，有创新能力',
    isSystem: true,
    studentCount: 2,
    createTime: '2024-09-01 09:00:00',
    updateTime: '2025-09-16 10:30:00'
  },
  {
    id: 'tag_005',
    name: '数学强项',
    color: TAG_COLORS.ORANGE,
    type: TAG_TYPES.ACADEMIC,
    description: '数学学科表现突出',
    isSystem: false,
    studentCount: 1,
    createTime: '2024-09-05 14:20:00',
    updateTime: '2025-09-16 09:15:00'
  },
  {
    id: 'tag_006',
    name: '理科思维',
    color: TAG_COLORS.CYAN,
    type: TAG_TYPES.ACADEMIC,
    description: '理科学习能力强',
    isSystem: false,
    studentCount: 2,
    createTime: '2024-09-10 10:15:00',
    updateTime: '2025-09-16 11:20:00'
  },
  {
    id: 'tag_007',
    name: '全面发展',
    color: TAG_COLORS.PINK,
    type: TAG_TYPES.SPECIAL,
    description: '各方面发展均衡',
    isSystem: false,
    studentCount: 1,
    createTime: '2024-09-10 10:15:00',
    updateTime: '2025-09-16 11:20:00'
  },
  {
    id: 'tag_008',
    name: '需要关注',
    color: TAG_COLORS.RED,
    type: TAG_TYPES.SPECIAL,
    description: '学习状态需要重点关注',
    isSystem: true,
    studentCount: 1,
    createTime: '2024-08-20 11:00:00',
    updateTime: '2025-09-10 15:30:00'
  },
  {
    id: 'tag_009',
    name: '班级榜样',
    color: TAG_COLORS.YELLOW,
    type: TAG_TYPES.SPECIAL,
    description: '品学兼优，是其他学生的榜样',
    isSystem: false,
    studentCount: 1,
    createTime: '2024-07-15 09:30:00',
    updateTime: '2025-09-16 12:00:00'
  },
  {
    id: 'tag_010',
    name: '体育特长',
    color: TAG_COLORS.GRAY,
    type: TAG_TYPES.SPECIAL,
    description: '体育方面有特长',
    isSystem: false,
    studentCount: 1,
    createTime: '2024-09-01 14:00:00',
    updateTime: '2025-09-16 08:45:00'
  },
  {
    id: 'tag_011',
    name: '潜力学生',
    color: TAG_COLORS.BLUE,
    type: TAG_TYPES.SPECIAL,
    description: '年龄小但学习能力强，有很大潜力',
    isSystem: false,
    studentCount: 1,
    createTime: '2024-09-12 15:45:00',
    updateTime: '2025-09-16 10:00:00'
  }
]

// 生成随机标签数据的工具函数
export function generateRandomTag() {
  const tagNames = [
    '学习积极', '课堂活跃', '作业优秀', '进步明显', '需要鼓励',
    '语文强项', '英语优秀', '思维敏捷', '团队合作', '独立思考'
  ]
  const colorValues = Object.values(TAG_COLORS)
  const typeValues = Object.values(TAG_TYPES)
  
  const randomName = tagNames[Math.floor(Math.random() * tagNames.length)]
  const randomColor = colorValues[Math.floor(Math.random() * colorValues.length)]
  const randomType = typeValues[Math.floor(Math.random() * typeValues.length)]
  
  return {
    id: `tag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: randomName,
    color: randomColor,
    type: randomType,
    description: `${randomName}相关的标签描述`,
    isSystem: Math.random() > 0.7,
    studentCount: Math.floor(Math.random() * 10),
    createTime: new Date().toISOString().replace('T', ' ').split('.')[0],
    updateTime: new Date().toISOString().replace('T', ' ').split('.')[0]
  }
}

// 批量生成标签数据
export function generateMockTags(count = 5) {
  const tags = []
  for (let i = 0; i < count; i++) {
    tags.push(generateRandomTag())
  }
  return tags
}

// 获取标签统计信息
export function getTagStats(tags) {
  const stats = {
    total: tags.length,
    system: 0,
    custom: 0,
    byType: {},
    totalStudents: 0
  }
  
  tags.forEach(tag => {
    if (tag.isSystem) {
      stats.system++
    } else {
      stats.custom++
    }
    
    if (!stats.byType[tag.type]) {
      stats.byType[tag.type] = 0
    }
    stats.byType[tag.type]++
    
    stats.totalStudents += tag.studentCount || 0
  })
  
  return stats
}