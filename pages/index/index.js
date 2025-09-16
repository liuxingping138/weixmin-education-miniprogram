// pages/index/index.js
const app = getApp();
// 安全地引入API模块
let apiModule = null;
let API, auth, classManagement, homework, points, ai, parentInteraction;
try {
  apiModule = require('../../utils/api.js');
  ({ API, auth, classManagement, homework, points, ai, parentInteraction } = apiModule);
} catch (e) {
  console.warn('API模块加载失败:', e);
}

const util = require('../../utils/util.js');
const cache = require('../../utils/cache.js');
const errorHandler = require('../../utils/errorHandler.js');

Page({
  data: {
    userInfo: {},
    userType: '',
    userTypeText: '',
    loading: true,
    // 简化的核心数据
    coreStats: {
      students: { total: 0, active: 0 },
      homework: { total: 0, completed: 0, pending: 0 },
      points: { total: 0, todayEarned: 0 },
      classes: { avgScore: 0 },
      performance: { 
        rank: 0, 
        completionRate: 0, 
        completionRatePercent: 0,
        avgScore: 0 
      },
      children: { total: 0 }
    },
    // 简化的快捷操作
    quickActions: [],
    // 最近活动
    recentActivities: [],
    // 家长的孩子列表
    children: [],
    // 简化模式
    simpleMode: true,
    // 新手引导
    showGuide: false,
    guideStep: 0,
    guideSteps: []
  },

  onLoad(options) {
    console.log('首页加载');
    this.initPage();
  },

  onShow() {
    console.log('首页显示');
    // 每次显示页面时刷新数据
    if (app.globalData.token) {
      this.loadPageData();
    }
  },

  onPullDownRefresh() {
    console.log('下拉刷新');
    this.loadPageData().finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  // 初始化页面
  async initPage() {
    try {
      this.setData({ loading: true });
      
      // 获取用户信息
      const userInfo = app.globalData.userInfo || {};
      const userType = app.globalData.userType || 'student';
      
      // 设置用户类型文本
      const userTypeMap = {
        'student': '学生',
        'teacher': '教师', 
        'parent': '家长'
      };
      
      // 初始化快捷操作
      const quickActions = this.getQuickActions(userType);
      
      // 初始化引导步骤
      const guideSteps = this.getGuideSteps(userType);
      
      // 检查是否需要显示引导
      const hasShownGuide = wx.getStorageSync(`guide_shown_${userType}`) || false;
      
      this.setData({
        userInfo,
        userType,
        userTypeText: userTypeMap[userType] || '用户',
        quickActions,
        guideSteps,
        showGuide: !hasShownGuide,
        simpleMode: wx.getStorageSync('simple_mode') !== false // 默认开启简化模式
      });
      
      // 加载页面数据
      await this.loadPageData();
      
    } catch (error) {
      errorHandler.handle(error, '首页初始化', {
        message: '页面初始化失败，请重试',
        retry: () => this.initPage()
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  // 加载页面数据
  async loadPageData() {
    try {
      const { userType } = this.data;
      
      // 尝试从缓存获取数据
      const cacheKey = `home_data_${userType}`;
      const cachedData = cache.get(cacheKey);
      
      if (cachedData) {
        this.setData(cachedData);
        console.log('使用缓存数据');
      }
      
      // 并行加载数据
      const promises = [];
      
      if (userType === 'teacher') {
        promises.push(this.loadTeacherData());
      } else if (userType === 'student') {
        promises.push(this.loadStudentData());
      } else if (userType === 'parent') {
        promises.push(this.loadParentData());
      }
      
      // 加载最近活动
      promises.push(this.loadRecentActivities());
      
      const results = await Promise.allSettled(promises);
      
      // 处理加载结果
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.warn(`数据加载失败 [${index}]:`, result.reason);
        }
      });
      
      // 缓存数据
      const dataToCache = {
        coreStats: this.data.coreStats,
        recentActivities: this.data.recentActivities,
        children: this.data.children
      };
      cache.set(cacheKey, dataToCache, 3 * 60 * 1000); // 缓存3分钟
      
    } catch (error) {
      errorHandler.handle(error, '数据加载', {
        message: '数据加载失败，请下拉刷新重试'
      });
    }
  },

  // 获取快捷操作配置
  getQuickActions(userType) {
    const { simpleMode } = this.data;
    
    const baseActions = {
      teacher: [
        {
          id: 'class',
          name: '班级管理',
          description: '管理学生信息',
          icon: 'usergroup',
          color: '#667eea',
          path: simpleMode ? '/pages/class/class-simple' : '/pages/class/class'
        },
        {
          id: 'homework',
          name: '作业中心',
          description: '发布和批改作业',
          icon: 'edit',
          color: '#4facfe',
          path: '/pages/homework/homework'
        },
        {
          id: 'stats',
          name: '数据统计',
          description: '查看学习数据',
          icon: 'chart',
          color: '#43e97b',
          path: '/pages/stats/stats'
        },
        {
          id: 'settings',
          name: '设置',
          description: '个人设置',
          icon: 'setting',
          color: '#f093fb',
          path: '/pages/settings/settings'
        }
      ],
      student: [
        {
          id: 'homework',
          name: '我的作业',
          description: '查看和完成作业',
          icon: 'edit',
          color: '#667eea',
          path: '/pages/homework/homework'
        },
        {
          id: 'points',
          name: '积分商城',
          description: '兑换奖励',
          icon: 'money-circle',
          color: '#4facfe',
          path: '/pages/points/points'
        },
        {
          id: 'mistakes',
          name: '错题本',
          description: '复习错题',
          icon: 'error-circle',
          color: '#f093fb',
          path: '/pages/mistakes/mistakes'
        },
        {
          id: 'growth',
          name: '成长档案',
          description: '学习记录',
          icon: 'user',
          color: '#43e97b',
          path: '/pages/growth/growth'
        }
      ],
      parent: [
        {
          id: 'children',
          name: '孩子管理',
          description: '查看孩子信息',
          icon: 'user',
          color: '#667eea',
          path: '/pages/parent/parent'
        },
        {
          id: 'reports',
          name: '学习报告',
          description: '查看学习情况',
          icon: 'chart',
          color: '#4facfe',
          path: '/pages/parent/reports'
        },
        {
          id: 'communication',
          name: '家校沟通',
          description: '与老师沟通',
          icon: 'chat',
          color: '#43e97b',
          path: '/pages/parent/communication'
        },
        {
          id: 'settings',
          name: '设置',
          description: '个人设置',
          icon: 'setting',
          color: '#f093fb',
          path: '/pages/settings/settings'
        }
      ]
    };
    
    const actions = baseActions[userType] || [];
    
    // 简化模式只显示前2个
    return simpleMode ? actions.slice(0, 2) : actions;
  },

  // 获取引导步骤
  getGuideSteps(userType) {
    const steps = {
      teacher: [
        {
          icon: 'usergroup',
          title: '欢迎使用智慧教育',
          content: '这里是教师专用的智慧教育平台，让我们开始简单的使用指导'
        },
        {
          icon: 'edit',
          title: '班级管理',
          content: '点击"班级管理"可以查看和管理您的学生信息'
        },
        {
          icon: 'chart',
          title: '作业中心',
          content: '在"作业中心"可以发布作业、查看学生完成情况'
        },
        {
          icon: 'setting',
          title: '开始使用',
          content: '现在您可以开始使用了！右上角可以切换简化/完整模式'
        }
      ],
      student: [
        {
          icon: 'user',
          title: '欢迎来到学习平台',
          content: '这里是您的专属学习空间，一起来探索吧！'
        },
        {
          icon: 'edit',
          title: '我的作业',
          content: '点击"我的作业"查看老师布置的作业并完成'
        },
        {
          icon: 'money-circle',
          title: '积分商城',
          content: '完成作业可以获得积分，在积分商城兑换奖励'
        },
        {
          icon: 'star',
          title: '开始学习',
          content: '现在开始您的学习之旅吧！'
        }
      ],
      parent: [
        {
          icon: 'heart',
          title: '家长专区',
          content: '欢迎使用家长端，随时了解孩子的学习情况'
        },
        {
          icon: 'user',
          title: '孩子管理',
          content: '在这里可以查看孩子的基本信息和学习状态'
        },
        {
          icon: 'chart',
          title: '学习报告',
          content: '定期查看孩子的学习报告，了解学习进度'
        },
        {
          icon: 'chat',
          title: '家校沟通',
          content: '与老师保持沟通，共同关注孩子成长'
        }
      ]
    };
    
    return steps[userType] || [];
  },

  // 加载教师数据
  async loadTeacherData() {
    try {
      // 模拟API调用
      const [studentsRes, homeworkRes, statsRes] = await Promise.all([
        classManagement?.getStudentList?.() || Promise.resolve({ data: [] }),
        homework?.getHomeworkList?.() || Promise.resolve({ data: [] }),
        API?.getTeacherStats?.() || Promise.resolve({ data: {} })
      ]);
      
      const students = studentsRes.data || [];
      const homeworkList = homeworkRes.data || [];
      const stats = statsRes.data || {};
      
      this.setData({
        'coreStats.students.total': students.length,
        'coreStats.students.active': students.filter(s => s.isOnline).length,
        'coreStats.homework.total': homeworkList.length,
        'coreStats.homework.completed': homeworkList.filter(h => h.status === 'completed').length,
        'coreStats.homework.pending': homeworkList.filter(h => h.status === 'pending').length,
        'coreStats.classes.avgScore': stats.avgScore || 0
      });
      
    } catch (error) {
      console.warn('教师数据加载失败:', error);
    }
  },

  // 加载学生数据
  async loadStudentData() {
    try {
      const [homeworkRes, pointsRes, performanceRes] = await Promise.all([
        homework?.getMyHomework?.() || Promise.resolve({ data: [] }),
        points?.getMyPoints?.() || Promise.resolve({ data: {} }),
        API?.getStudentPerformance?.() || Promise.resolve({ data: {} })
      ]);
      
      const homeworkList = homeworkRes.data || [];
      const pointsData = pointsRes.data || {};
      const performance = performanceRes.data || {};
      
      this.setData({
        'coreStats.homework.completed': homeworkList.filter(h => h.status === 'completed').length,
        'coreStats.homework.pending': homeworkList.filter(h => h.status === 'pending').length,
        'coreStats.points.total': pointsData.total || 0,
        'coreStats.points.todayEarned': pointsData.todayEarned || 0,
        'coreStats.performance.rank': performance.rank || 0
      });
      
    } catch (error) {
      console.warn('学生数据加载失败:', error);
    }
  },

  // 加载家长数据
  async loadParentData() {
    try {
      const childrenRes = await parentInteraction?.getChildren?.() || Promise.resolve({ data: [] });
      const children = childrenRes.data || [];
      
      // 计算统计数据
      const totalChildren = children.length;
      const avgScore = children.reduce((sum, child) => sum + (child.averageScore || 0), 0) / totalChildren || 0;
      const completionRate = children.reduce((sum, child) => sum + (child.completionRate || 0), 0) / totalChildren || 0;
      
      // 计算进度百分比
      const childrenWithProgress = children.map(child => ({
        ...child,
        progressPercent: Math.round((child.todayHomework / Math.max(child.totalHomework, 1)) * 100)
      }));
      
      this.setData({
        children: childrenWithProgress,
        'coreStats.children.total': totalChildren,
        'coreStats.performance.avgScore': Math.round(avgScore),
        'coreStats.performance.completionRate': completionRate,
        'coreStats.performance.completionRatePercent': Math.round(completionRate * 100)
      });
      
    } catch (error) {
      console.warn('家长数据加载失败:', error);
    }
  },

  // 加载最近活动
  async loadRecentActivities() {
    try {
      const { userType } = this.data;
      
      // 模拟最近活动数据
      const mockActivities = {
        teacher: [
          {
            id: 1,
            type: 'homework',
            content: '数学作业已发布给三年级一班',
            time: '2小时前',
            status: 'completed'
          },
          {
            id: 2,
            type: 'class_activity',
            content: '张小明完成了语文作业',
            time: '3小时前',
            status: 'graded'
          },
          {
            id: 3,
            type: 'homework',
            content: '英语测试批改完成',
            time: '1天前',
            status: 'completed'
          }
        ],
        student: [
          {
            id: 1,
            type: 'homework',
            content: '完成了数学作业第3题',
            time: '1小时前',
            status: 'completed'
          },
          {
            id: 2,
            type: 'points',
            content: '获得了10积分奖励',
            time: '2小时前'
          },
          {
            id: 3,
            type: 'homework',
            content: '语文作业待完成',
            time: '今天',
            status: 'pending'
          }
        ],
        parent: [
          {
            id: 1,
            type: 'homework',
            content: '小明完成了今日作业',
            time: '1小时前',
            status: 'completed'
          },
          {
            id: 2,
            type: 'class_activity',
            content: '收到老师的学习反馈',
            time: '3小时前'
          }
        ]
      };
      
      this.setData({
        recentActivities: mockActivities[userType] || []
      });
      
    } catch (error) {
      console.warn('活动数据加载失败:', error);
    }
  },

  // 切换简化模式
  toggleSimpleMode() {
    const newSimpleMode = !this.data.simpleMode;
    this.setData({ 
      simpleMode: newSimpleMode,
      quickActions: this.getQuickActions(this.data.userType)
    });
    
    // 保存设置
    wx.setStorageSync('simple_mode', newSimpleMode);
    
    wx.showToast({
      title: newSimpleMode ? '已切换到简化模式' : '已切换到完整模式',
      icon: 'success'
    });
  },

  // 快捷操作点击
  onQuickActionTap(e) {
    const action = e.currentTarget.dataset.action;
    if (!action || !action.path) return;
    
    wx.navigateTo({
      url: action.path,
      fail: (err) => {
        console.warn('页面跳转失败:', err);
        wx.showToast({
          title: '页面暂未开放',
          icon: 'none'
        });
      }
    });
  },

  // 新手引导相关方法
  nextGuideStep() {
    const { guideStep, guideSteps } = this.data;
    if (guideStep < guideSteps.length - 1) {
      this.setData({ guideStep: guideStep + 1 });
    } else {
      this.completeGuide();
    }
  },

  prevGuideStep() {
    const { guideStep } = this.data;
    if (guideStep > 0) {
      this.setData({ guideStep: guideStep - 1 });
    }
  },

  skipGuide() {
    this.completeGuide();
  },

  closeGuide() {
    this.completeGuide();
  },

  completeGuide() {
    const { userType } = this.data;
    this.setData({ showGuide: false });
    
    // 记录已显示过引导
    wx.setStorageSync(`guide_shown_${userType}`, true);
    
    wx.showToast({
      title: '欢迎使用智慧教育',
      icon: 'success'
    });
  },

  // 查看孩子详情
  viewChildDetail(e) {
    const childId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/parent/child-detail?id=${childId}`
    });
  },

  // 分享功能
  onShareAppMessage() {
    return {
      title: '智慧教育小程序',
      path: '/pages/index/index',
      imageUrl: '/images/share-cover.png'
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '智慧教育小程序 - 让学习更高效',
      imageUrl: '/images/share-cover.png'
    };
  }
});