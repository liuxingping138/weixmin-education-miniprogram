// pages/class/class-simple.js - 简化版班级管理
const app = getApp();
const cache = require('../../utils/cache.js');
const errorHandler = require('../../utils/errorHandler.js');

// 安全地引入API模块
let classManagement = null;
try {
  const apiModule = require('../../utils/api.js');
  classManagement = apiModule.classManagement;
} catch (e) {
  console.warn('API模块加载失败:', e);
}

Page({
  data: {
    loading: false,
    // 班级基本信息
    classInfo: {
      name: '三年级一班',
      studentCount: 0,
      teacherName: '张老师',
      avgScore: 0,
      completionRate: 0
    },
    // 学生列表
    students: [],
    filteredStudents: [],
    searchKeyword: '',
    // 快速统计
    quickStats: {
      totalStudents: 0,
      onlineStudents: 0,
      todayHomework: 0,
      completedHomework: 0
    },
    // 最近活动
    recentActivities: [],
    // UI状态
    showSearch: false,
    selectedStudent: null,
    showStudentActions: false
  },

  onLoad(options) {
    console.log('简化班级页面加载');
    this.initPage();
  },

  onShow() {
    this.refreshData();
  },

  onPullDownRefresh() {
    this.refreshData().finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  // 初始化页面
  async initPage() {
    try {
      this.setData({ loading: true });
      
      // 获取用户信息
      const userInfo = app.globalData.userInfo || {};
      this.setData({
        'classInfo.teacherName': userInfo.name || '老师'
      });
      
      // 加载数据
      await this.loadAllData();
      
    } catch (error) {
      errorHandler.handle(error, '班级页面初始化', {
        message: '页面加载失败，请重试',
        retry: () => this.initPage()
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  // 刷新数据
  async refreshData() {
    try {
      // 尝试从缓存获取
      const cacheKey = 'class_data';
      const cachedData = cache.get(cacheKey);
      
      if (cachedData) {
        this.setData(cachedData);
      }
      
      // 重新加载数据
      await this.loadAllData();
      
    } catch (error) {
      errorHandler.handle(error, '数据刷新', {
        message: '刷新失败，请稍后重试'
      });
    }
  },

  // 加载所有数据
  async loadAllData() {
    const promises = [
      this.loadStudents(),
      this.loadQuickStats(),
      this.loadRecentActivities()
    ];
    
    const results = await Promise.allSettled(promises);
    
    // 处理加载结果
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.warn(`数据加载失败 [${index}]:`, result.reason);
      }
    });
    
    // 缓存数据
    const dataToCache = {
      students: this.data.students,
      filteredStudents: this.data.filteredStudents,
      quickStats: this.data.quickStats,
      recentActivities: this.data.recentActivities,
      classInfo: this.data.classInfo
    };
    cache.set('class_data', dataToCache, 5 * 60 * 1000); // 缓存5分钟
  },

  // 加载学生列表
  async loadStudents() {
    try {
      // 模拟API调用或使用真实API
      const students = this.generateMockStudents();
      
      this.setData({
        students,
        filteredStudents: students,
        'classInfo.studentCount': students.length
      });
      
    } catch (error) {
      console.warn('学生列表加载失败:', error);
    }
  },

  // 生成模拟学生数据
  generateMockStudents() {
    const names = [
      '张小明', '李小红', '王小华', '刘小强', '陈小美',
      '杨小刚', '赵小丽', '孙小军', '周小芳', '吴小东',
      '郑小燕', '王小磊', '李小娟', '张小伟', '刘小霞',
      '陈小龙', '杨小凤', '赵小鹏', '孙小玲', '周小涛'
    ];
    
    return names.map((name, index) => ({
      id: `student_${(index + 1).toString().padStart(3, '0')}`,
      name,
      studentNumber: `2024${(index + 1).toString().padStart(3, '0')}`,
      avatar: `/images/avatar/avatar_${(index % 10) + 1}.png`,
      isOnline: Math.random() > 0.3,
      todayHomework: Math.floor(Math.random() * 3) + 1,
      completedHomework: Math.floor(Math.random() * 3),
      avgScore: Math.floor(Math.random() * 30) + 70,
      attendanceRate: Math.floor(Math.random() * 20) + 80,
      parentPhone: `138****${Math.floor(Math.random() * 9000) + 1000}`,
      lastActive: this.getRandomRecentTime()
    }));
  },

  // 获取随机最近时间
  getRandomRecentTime() {
    const now = new Date();
    const randomHours = Math.floor(Math.random() * 24);
    const randomMinutes = Math.floor(Math.random() * 60);
    
    const time = new Date(now.getTime() - (randomHours * 60 + randomMinutes) * 60 * 1000);
    
    if (randomHours === 0) {
      return `${randomMinutes}分钟前`;
    } else if (randomHours < 24) {
      return `${randomHours}小时前`;
    } else {
      return '1天前';
    }
  },

  // 加载快速统计
  async loadQuickStats() {
    try {
      const { students } = this.data;
      
      const totalStudents = students.length;
      const onlineStudents = students.filter(s => s.isOnline).length;
      const todayHomework = students.reduce((sum, s) => sum + s.todayHomework, 0);
      const completedHomework = students.reduce((sum, s) => sum + s.completedHomework, 0);
      const avgScore = Math.round(students.reduce((sum, s) => sum + s.avgScore, 0) / totalStudents) || 0;
      const completionRate = Math.round((completedHomework / Math.max(todayHomework, 1)) * 100);
      
      this.setData({
        quickStats: {
          totalStudents,
          onlineStudents,
          todayHomework,
          completedHomework
        },
        'classInfo.avgScore': avgScore,
        'classInfo.completionRate': completionRate
      });
      
    } catch (error) {
      console.warn('统计数据加载失败:', error);
    }
  },

  // 加载最近活动
  async loadRecentActivities() {
    try {
      const activities = [
        {
          id: 1,
          type: 'homework',
          icon: '📝',
          content: '张小明提交了数学作业',
          time: '5分钟前',
          student: '张小明'
        },
        {
          id: 2,
          type: 'attendance',
          icon: '✅',
          content: '李小红完成签到',
          time: '10分钟前',
          student: '李小红'
        },
        {
          id: 3,
          type: 'interaction',
          icon: '💬',
          content: '王小华在课堂上积极发言',
          time: '15分钟前',
          student: '王小华'
        },
        {
          id: 4,
          type: 'homework',
          icon: '📝',
          content: '刘小强提交了语文作业',
          time: '20分钟前',
          student: '刘小强'
        },
        {
          id: 5,
          type: 'achievement',
          icon: '🏆',
          content: '陈小美获得学习之星徽章',
          time: '30分钟前',
          student: '陈小美'
        }
      ];
      
      this.setData({ recentActivities: activities });
      
    } catch (error) {
      console.warn('活动数据加载失败:', error);
    }
  },

  // 搜索功能
  toggleSearch() {
    this.setData({ 
      showSearch: !this.data.showSearch,
      searchKeyword: ''
    });
    
    if (!this.data.showSearch) {
      this.setData({ filteredStudents: this.data.students });
    }
  },

  onSearchInput(e) {
    const keyword = e.detail.value.trim();
    this.setData({ searchKeyword: keyword });
    
    if (!keyword) {
      this.setData({ filteredStudents: this.data.students });
      return;
    }
    
    const filtered = this.data.students.filter(student => 
      student.name.includes(keyword) || 
      student.studentNumber.includes(keyword)
    );
    
    this.setData({ filteredStudents: filtered });
  },

  // 学生操作
  onStudentTap(e) {
    const student = e.currentTarget.dataset.student;
    this.setData({
      selectedStudent: student,
      showStudentActions: true
    });
  },

  closeStudentActions() {
    this.setData({ showStudentActions: false });
  },

  // 查看学生详情
  viewStudentDetail() {
    const { selectedStudent } = this.data;
    this.closeStudentActions();
    
    wx.navigateTo({
      url: `/pages/student-detail/student-detail?studentId=${selectedStudent.id}`,
      fail: () => {
        wx.showToast({
          title: '页面开发中',
          icon: 'none'
        });
      }
    });
  },

  // 联系家长
  contactParent() {
    const { selectedStudent } = this.data;
    this.closeStudentActions();
    
    wx.showActionSheet({
      itemList: ['拨打电话', '发送消息'],
      success: (res) => {
        if (res.tapIndex === 0) {
          // 拨打电话
          wx.showModal({
            title: '联系家长',
            content: `是否拨打 ${selectedStudent.name} 家长电话？\n${selectedStudent.parentPhone}`,
            success: (modalRes) => {
              if (modalRes.confirm) {
                wx.showToast({
                  title: '拨号功能开发中',
                  icon: 'none'
                });
              }
            }
          });
        } else {
          // 发送消息
          wx.showToast({
            title: '消息功能开发中',
            icon: 'none'
          });
        }
      }
    });
  },

  // 奖励学生
  rewardStudent() {
    const { selectedStudent } = this.data;
    this.closeStudentActions();
    
    wx.showActionSheet({
      itemList: ['奖励积分', '表扬学生', '颁发徽章'],
      success: (res) => {
        const actions = ['积分奖励', '表扬信', '徽章奖励'];
        wx.showToast({
          title: `${actions[res.tapIndex]}功能开发中`,
          icon: 'none'
        });
      }
    });
  },

  // 快速操作
  quickAction(e) {
    const action = e.currentTarget.dataset.action;
    
    switch (action) {
      case 'homework':
        wx.navigateTo({
          url: '/pages/homework/homework',
          fail: () => {
            wx.showToast({ title: '作业功能开发中', icon: 'none' });
          }
        });
        break;
      case 'attendance':
        wx.showToast({ title: '考勤功能开发中', icon: 'none' });
        break;
      case 'message':
        wx.showToast({ title: '消息功能开发中', icon: 'none' });
        break;
      case 'report':
        wx.showToast({ title: '报告功能开发中', icon: 'none' });
        break;
    }
  },

  // 查看更多活动
  viewMoreActivities() {
    wx.showToast({
      title: '活动详情页开发中',
      icon: 'none'
    });
  },

  // 页面分享
  onShareAppMessage() {
    return {
      title: `${this.data.classInfo.name} - 班级管理`,
      path: '/pages/class/class-simple',
      imageUrl: '/images/share-class.png'
    };
  }
});