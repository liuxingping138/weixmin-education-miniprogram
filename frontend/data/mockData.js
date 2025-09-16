// data/mockData.js
// Mock数据配置和预生成数据

const { mockGenerator } = require('../utils/mock.js');

/**
 * Mock数据配置
 */
const mockConfig = {
  // 是否启用Mock模式
  enabled: true,
  
  // 网络延迟模拟(ms)
  delay: 800,
  
  // 数据生成数量配置
  dataCount: {
    students: 45,
    teachers: 8,
    parents: 30,
    classes: 6,
    homework: 25,
    questions: 100,
    pointsRecords: 50,
    shopItems: 20,
    aiSuggestions: 15,
    courseware: 30,
    growthRecords: 20
  },
  
  // 分页配置
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 50
  }
};

/**
 * 预生成的Mock数据
 */
class MockDataStore {
  constructor() {
    this.data = {};
    this.initialized = false;
  }

  // 初始化所有Mock数据
  init() {
    if (this.initialized) return;
    
    console.log('初始化Mock数据...');
    
    // 生成用户数据
    this.data.students = mockGenerator.generateBatch('student', mockConfig.dataCount.students);
    this.data.teachers = mockGenerator.generateBatch('teacher', mockConfig.dataCount.teachers);
    this.data.parents = mockGenerator.generateBatch('parent', mockConfig.dataCount.parents);
    
    // 生成班级数据
    this.data.classes = mockGenerator.generateBatch('class', mockConfig.dataCount.classes);
    
    // 为班级分配学生
    this.assignStudentsToClasses();
    
    // 生成作业数据
    this.data.homework = mockGenerator.generateBatch('homework', mockConfig.dataCount.homework);
    
    // 生成题目数据
    this.data.questions = mockGenerator.generateBatch('question', mockConfig.dataCount.questions);
    
    // 生成积分记录
    this.data.pointsRecords = mockGenerator.generateBatch('points', mockConfig.dataCount.pointsRecords);
    
    // 生成商城商品
    this.data.shopItems = mockGenerator.generateBatch('shop', mockConfig.dataCount.shopItems);
    
    // 生成AI建议
    this.data.aiSuggestions = mockGenerator.generateBatch('ai', mockConfig.dataCount.aiSuggestions);
    
    // 生成课件数据
    this.data.courseware = mockGenerator.generateBatch('courseware', mockConfig.dataCount.courseware);
    
    // 生成成长档案
    this.data.growthRecords = mockGenerator.generateBatch('growth', mockConfig.dataCount.growthRecords);
    
    // 建立数据关联关系
    this.buildRelationships();
    
    this.initialized = true;
    console.log('Mock数据初始化完成');
  }

  // 为班级分配学生
  assignStudentsToClasses() {
    const studentsPerClass = Math.floor(this.data.students.length / this.data.classes.length);
    
    this.data.students.forEach((student, index) => {
      const classIndex = Math.floor(index / studentsPerClass);
      const targetClass = this.data.classes[classIndex] || this.data.classes[0];
      
      student.classId = targetClass.id;
      student.className = targetClass.name;
    });
    
    // 更新班级学生数量
    this.data.classes.forEach(classItem => {
      const studentCount = this.data.students.filter(s => s.classId === classItem.id).length;
      classItem.studentCount = studentCount;
    });
  }

  // 建立数据关联关系
  buildRelationships() {
    // 为作业分配班级和教师
    this.data.homework.forEach(hw => {
      const randomClass = this.data.classes[Math.floor(Math.random() * this.data.classes.length)];
      const randomTeacher = this.data.teachers[Math.floor(Math.random() * this.data.teachers.length)];
      
      hw.classId = randomClass.id;
      hw.className = randomClass.name;
      hw.teacherId = randomTeacher.id;
      hw.teacherName = randomTeacher.name;
    });
    
    // 为积分记录分配用户
    this.data.pointsRecords.forEach(record => {
      const randomStudent = this.data.students[Math.floor(Math.random() * this.data.students.length)];
      record.userId = randomStudent.id;
      record.userName = randomStudent.name;
    });
    
    // 为AI建议分配学生
    this.data.aiSuggestions.forEach(suggestion => {
      const randomStudent = this.data.students[Math.floor(Math.random() * this.data.students.length)];
      suggestion.studentId = randomStudent.id;
      suggestion.studentName = randomStudent.name;
    });
    
    // 为成长档案分配学生
    this.data.growthRecords.forEach(record => {
      const randomStudent = this.data.students[Math.floor(Math.random() * this.data.students.length)];
      record.studentId = randomStudent.id;
      record.studentName = randomStudent.name;
    });
  }

  // 获取数据
  getData(type) {
    if (!this.initialized) {
      this.init();
    }
    return this.data[type] || [];
  }

  // 根据ID查找数据
  findById(type, id) {
    const data = this.getData(type);
    return data.find(item => item.id === id);
  }

  // 分页查询
  paginate(data, page = 1, pageSize = mockConfig.pagination.defaultPageSize) {
    const total = data.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const list = data.slice(start, end);
    
    return {
      list,
      pagination: {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }

  // 筛选数据
  filter(data, filters = {}) {
    return data.filter(item => {
      return Object.keys(filters).every(key => {
        const filterValue = filters[key];
        const itemValue = item[key];
        
        if (filterValue === undefined || filterValue === null || filterValue === '') {
          return true;
        }
        
        if (typeof filterValue === 'string') {
          return String(itemValue).toLowerCase().includes(filterValue.toLowerCase());
        }
        
        return itemValue === filterValue;
      });
    });
  }

  // 排序数据
  sort(data, sortBy = 'createTime', order = 'desc') {
    return [...data].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (order === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });
  }

  // 搜索数据
  search(data, keyword, fields = ['name', 'title']) {
    if (!keyword) return data;
    
    const lowerKeyword = keyword.toLowerCase();
    return data.filter(item => {
      return fields.some(field => {
        const value = item[field];
        return value && String(value).toLowerCase().includes(lowerKeyword);
      });
    });
  }

  // 添加数据
  add(type, item) {
    if (!this.data[type]) {
      this.data[type] = [];
    }
    
    const newItem = {
      ...item,
      id: item.id || mockGenerator.generateId(),
      createTime: item.createTime || new Date().toISOString(),
      updateTime: new Date().toISOString()
    };
    
    this.data[type].push(newItem);
    return newItem;
  }

  // 更新数据
  update(type, id, updates) {
    const data = this.getData(type);
    const index = data.findIndex(item => item.id === id);
    
    if (index === -1) {
      throw new Error(`${type} with id ${id} not found`);
    }
    
    const updatedItem = {
      ...data[index],
      ...updates,
      updateTime: new Date().toISOString()
    };
    
    data[index] = updatedItem;
    return updatedItem;
  }

  // 删除数据
  delete(type, id) {
    const data = this.getData(type);
    const index = data.findIndex(item => item.id === id);
    
    if (index === -1) {
      throw new Error(`${type} with id ${id} not found`);
    }
    
    const deletedItem = data.splice(index, 1)[0];
    return deletedItem;
  }

  // 重置数据
  reset() {
    this.data = {};
    this.initialized = false;
    this.init();
  }

  // 获取统计数据
  getStats() {
    if (!this.initialized) {
      this.init();
    }
    
    return {
      students: this.data.students.length,
      teachers: this.data.teachers.length,
      parents: this.data.parents.length,
      classes: this.data.classes.length,
      homework: this.data.homework.length,
      questions: this.data.questions.length,
      pointsRecords: this.data.pointsRecords.length,
      shopItems: this.data.shopItems.length,
      aiSuggestions: this.data.aiSuggestions.length,
      courseware: this.data.courseware.length,
      growthRecords: this.data.growthRecords.length
    };
  }
}

// 创建全局Mock数据存储实例
const mockDataStore = new MockDataStore();

module.exports = {
  mockConfig,
  mockDataStore,
  MockDataStore
};