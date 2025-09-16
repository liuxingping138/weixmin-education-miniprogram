/**
 * 学生Mock数据
 * @description 提供学生相关的模拟数据
 * @author CodeBuddy
 * @date 2025-09-16
 */

// 学生状态枚举
export const STUDENT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  GRADUATED: 'graduated'
}

// 年级枚举
export const GRADES = {
  GRADE_1: '一年级',
  GRADE_2: '二年级',
  GRADE_3: '三年级',
  GRADE_4: '四年级',
  GRADE_5: '五年级',
  GRADE_6: '六年级',
  JUNIOR_1: '初一',
  JUNIOR_2: '初二',
  JUNIOR_3: '初三',
  SENIOR_1: '高一',
  SENIOR_2: '高二',
  SENIOR_3: '高三'
}

// Mock学生数据
export const mockStudents = [
  {
    id: 'student_001',
    name: '张小明',
    avatar: '/images/avatars/avatar1.png',
    grade: GRADES.GRADE_5,
    age: 11,
    gender: '男',
    phone: '13800138001',
    parentPhone: '13900139001',
    status: STUDENT_STATUS.ACTIVE,
    tags: ['tag_001', 'tag_003', 'tag_005'],
    progress: 85,
    joinDate: '2024-09-01',
    lastActiveTime: '2025-09-16 10:30:00',
    notes: '学习积极主动，数学成绩优秀',
    subjects: ['数学', '语文', '英语'],
    createTime: '2024-09-01 09:00:00',
    updateTime: '2025-09-16 10:30:00'
  },
  {
    id: 'student_002',
    name: '李小红',
    avatar: '/images/avatars/avatar2.png',
    grade: GRADES.GRADE_4,
    age: 10,
    gender: '女',
    phone: '13800138002',
    parentPhone: '13900139002',
    status: STUDENT_STATUS.ACTIVE,
    tags: ['tag_002', 'tag_004'],
    progress: 92,
    joinDate: '2024-09-05',
    lastActiveTime: '2025-09-16 09:15:00',
    notes: '语文表达能力强，作文写得很好',
    subjects: ['语文', '英语'],
    createTime: '2024-09-05 14:20:00',
    updateTime: '2025-09-16 09:15:00'
  },
  {
    id: 'student_003',
    name: '王大强',
    avatar: '/images/avatars/avatar3.png',
    grade: GRADES.JUNIOR_1,
    age: 13,
    gender: '男',
    phone: '13800138003',
    parentPhone: '13900139003',
    status: STUDENT_STATUS.ACTIVE,
    tags: ['tag_001', 'tag_006'],
    progress: 78,
    joinDate: '2024-08-28',
    lastActiveTime: '2025-09-15 20:45:00',
    notes: '理科思维较强，需要加强文科学习',
    subjects: ['数学', '物理', '化学'],
    createTime: '2024-08-28 16:30:00',
    updateTime: '2025-09-15 20:45:00'
  },
  {
    id: 'student_004',
    name: '陈美丽',
    avatar: '/images/avatars/avatar4.png',
    grade: GRADES.GRADE_6,
    age: 12,
    gender: '女',
    phone: '13800138004',
    parentPhone: '13900139004',
    status: STUDENT_STATUS.ACTIVE,
    tags: ['tag_002', 'tag_003', 'tag_007'],
    progress: 88,
    joinDate: '2024-09-10',
    lastActiveTime: '2025-09-16 11:20:00',
    notes: '全面发展，各科成绩均衡',
    subjects: ['数学', '语文', '英语', '科学'],
    createTime: '2024-09-10 10:15:00',
    updateTime: '2025-09-16 11:20:00'
  },
  {
    id: 'student_005',
    name: '刘小刚',
    avatar: '/images/avatars/avatar5.png',
    grade: GRADES.GRADE_3,
    age: 9,
    gender: '男',
    phone: '13800138005',
    parentPhone: '13900139005',
    status: STUDENT_STATUS.INACTIVE,
    tags: ['tag_008'],
    progress: 45,
    joinDate: '2024-08-20',
    lastActiveTime: '2025-09-10 15:30:00',
    notes: '最近学习状态不佳，需要重点关注',
    subjects: ['数学', '语文'],
    createTime: '2024-08-20 11:00:00',
    updateTime: '2025-09-10 15:30:00'
  },
  {
    id: 'student_006',
    name: '赵小花',
    avatar: '/images/avatars/avatar6.png',
    grade: GRADES.SENIOR_2,
    age: 17,
    gender: '女',
    phone: '13800138006',
    parentPhone: '13900139006',
    status: STUDENT_STATUS.ACTIVE,
    tags: ['tag_001', 'tag_009'],
    progress: 95,
    joinDate: '2024-07-15',
    lastActiveTime: '2025-09-16 12:00:00',
    notes: '学习能力强，目标清晰，是班级榜样',
    subjects: ['数学', '物理', '化学', '生物'],
    createTime: '2024-07-15 09:30:00',
    updateTime: '2025-09-16 12:00:00'
  },
  {
    id: 'student_007',
    name: '孙小军',
    avatar: '/images/avatars/avatar7.png',
    grade: GRADES.JUNIOR_3,
    age: 15,
    gender: '男',
    phone: '13800138007',
    parentPhone: '13900139007',
    status: STUDENT_STATUS.ACTIVE,
    tags: ['tag_006', 'tag_010'],
    progress: 72,
    joinDate: '2024-09-01',
    lastActiveTime: '2025-09-16 08:45:00',
    notes: '体育特长生，文化课需要加强',
    subjects: ['数学', '语文', '英语', '体育'],
    createTime: '2024-09-01 14:00:00',
    updateTime: '2025-09-16 08:45:00'
  },
  {
    id: 'student_008',
    name: '周小慧',
    avatar: '/images/avatars/avatar8.png',
    grade: GRADES.GRADE_2,
    age: 8,
    gender: '女',
    phone: '13800138008',
    parentPhone: '13900139008',
    status: STUDENT_STATUS.ACTIVE,
    tags: ['tag_004', 'tag_011'],
    progress: 90,
    joinDate: '2024-09-12',
    lastActiveTime: '2025-09-16 10:00:00',
    notes: '年龄虽小但学习能力很强',
    subjects: ['数学', '语文'],
    createTime: '2024-09-12 15:45:00',
    updateTime: '2025-09-16 10:00:00'
  }
]

// 生成随机学生数据的工具函数
export function generateRandomStudent() {
  const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十']
  const gradeValues = Object.values(GRADES)
  const subjects = ['数学', '语文', '英语', '物理', '化学', '生物', '历史', '地理']
  
  const randomName = names[Math.floor(Math.random() * names.length)]
  const randomGrade = gradeValues[Math.floor(Math.random() * gradeValues.length)]
  const randomSubjects = subjects.slice(0, Math.floor(Math.random() * 4) + 1)
  
  return {
    id: `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: randomName,
    avatar: `/images/avatars/avatar${Math.floor(Math.random() * 8) + 1}.png`,
    grade: randomGrade,
    age: Math.floor(Math.random() * 10) + 8,
    gender: Math.random() > 0.5 ? '男' : '女',
    phone: `138${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
    parentPhone: `139${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
    status: Math.random() > 0.8 ? STUDENT_STATUS.INACTIVE : STUDENT_STATUS.ACTIVE,
    tags: [],
    progress: Math.floor(Math.random() * 50) + 50,
    joinDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    lastActiveTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').split('.')[0],
    notes: '系统生成的测试学生',
    subjects: randomSubjects,
    createTime: new Date().toISOString().replace('T', ' ').split('.')[0],
    updateTime: new Date().toISOString().replace('T', ' ').split('.')[0]
  }
}

// 批量生成学生数据
export function generateMockStudents(count = 10) {
  const students = []
  for (let i = 0; i < count; i++) {
    students.push(generateRandomStudent())
  }
  return students
}