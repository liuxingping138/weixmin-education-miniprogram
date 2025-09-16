// utils/request.js
// 网络请求封装 (支持Mock模式)

// 安全地获取全局应用实例
let app;
try {
  app = getApp();
} catch (e) {
  console.warn('获取全局应用实例失败:', e);
  app = null;
}

/**
 * Mock响应处理器
 */
class MockHandler {
  constructor() {
    this.routes = new Map();
    this.setupRoutes();
  }

  // 设置Mock路由
  setupRoutes() {
    // 认证相关
    this.routes.set('POST:/auth/login', this.handleLogin.bind(this));
    this.routes.set('POST:/auth/register', this.handleRegister.bind(this));
    this.routes.set('GET:/auth/user', this.handleGetUserInfo.bind(this));
    this.routes.set('POST:/auth/send-code', this.handleSendCode.bind(this));
    
    // 班级管理
    this.routes.set('GET:/class/list', this.handleGetClassList.bind(this));
    this.routes.set('GET:/class/:id', this.handleGetClassDetail.bind(this));
    this.routes.set('GET:/class/:id/members', this.handleGetClassMembers.bind(this));
    this.routes.set('GET:/class/:id/ranking', this.handleGetClassRanking.bind(this));
    this.routes.set('GET:/class/:id/groups', this.handleGetGroups.bind(this));
    
    // 作业系统
    this.routes.set('GET:/homework/list', this.handleGetHomeworkList.bind(this));
    this.routes.set('GET:/homework/:id', this.handleGetHomeworkDetail.bind(this));
    this.routes.set('POST:/homework/create', this.handleCreateHomework.bind(this));
    this.routes.set('POST:/homework/:id/submit', this.handleSubmitHomework.bind(this));
    this.routes.set('GET:/homework/wrong-questions', this.handleGetWrongQuestions.bind(this));
    
    // 积分系统
    this.routes.set('GET:/points/history', this.handleGetPointsHistory.bind(this));
    this.routes.set('GET:/points/stats', this.handleGetPointsStats.bind(this));
    this.routes.set('POST:/points/exchange', this.handleExchangePoints.bind(this));
    this.routes.set('GET:/shop/items', this.handleGetShopItems.bind(this));
    
    // AI功能
    this.routes.set('GET:/ai/study-suggestions', this.handleGetStudySuggestions.bind(this));
    this.routes.set('POST:/ai/generate-questions', this.handleGenerateQuestions.bind(this));
    this.routes.set('GET:/ai/recommendations', this.handleGetRecommendations.bind(this));
    
    // 课件系统
    this.routes.set('GET:/courseware/list', this.handleGetCoursewareList.bind(this));
    this.routes.set('GET:/courseware/:id', this.handleGetCoursewareDetail.bind(this));
    this.routes.set('POST:/courseware/generate-ppt', this.handleGeneratePPT.bind(this));
    
    // 家长功能
    this.routes.set('GET:/parent/reports', this.handleGetParentReports.bind(this));
    this.routes.set('GET:/parent/students/:id/growth', this.handleGetGrowthArchive.bind(this));
    
    // 学生档案
    this.routes.set('GET:/student/:id/profile', this.handleGetStudentProfile.bind(this));
    this.routes.set('GET:/student/:id/ability', this.handleGetAbilityAnalysis.bind(this));
  }

  // 匹配路由
  matchRoute(method, url) {
    // 移除查询参数
    const cleanUrl = url.split('?')[0];
    
    // 精确匹配
    const exactKey = `${method}:${cleanUrl}`;
    if (this.routes.has(exactKey)) {
      return { handler: this.routes.get(exactKey), params: {} };
    }
    
    // 参数匹配
    for (const [routeKey, handler] of this.routes.entries()) {
      const [routeMethod, routePath] = routeKey.split(':');
      if (routeMethod !== method) continue;
      
      const routeRegex = routePath.replace(/:([^/]+)/g, '([^/]+)');
      const regex = new RegExp(`^${routeRegex}$`);
      const match = cleanUrl.match(regex);
      
      if (match) {
        const paramNames = (routePath.match(/:([^/]+)/g) || []).map(p => p.slice(1));
        const params = {};
        paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });
        return { handler, params };
      }
    }
    
    return null;
  }

  // 处理Mock请求
  async handleRequest(method, url, data, params) {
    const route = this.matchRoute(method, url);
    if (!route) {
      throw new Error(`Mock route not found: ${method} ${url}`);
    }
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const result = await route.handler(data, params, route.params);
      return {
        code: 200,
        message: 'success',
        data: result
      };
    } catch (error) {
      return {
        code: 500,
        message: error.message || 'Internal server error',
        data: null
      };
    }
  }

  // === Mock处理函数 ===

  // 登录
  async handleLogin(data) {
    const { type, phone, verifyCode, code, userInfo, identity } = data;
    
    if (type === 'phone') {
      if (!phone || !verifyCode) {
        throw new Error('手机号和验证码不能为空');
      }
      if (verifyCode !== '123456') {
        throw new Error('验证码错误');
      }
    }
    
    const mockUser = {
      id: 'user_' + Date.now(),
      name: userInfo?.nickName || '测试用户',
      avatar: userInfo?.avatarUrl || '/images/default-avatar.png',
      phone: phone || '13800138000',
      role: identity || 'student',
      points: Math.floor(Math.random() * 500 + 100),
      classId: 'class_1',
      className: '高一1班'
    };
    
    const token = 'mock_token_' + Date.now();
    
    return {
      token,
      userInfo: mockUser,
      userType: mockUser.role
    };
  }

  // 注册
  async handleRegister(data) {
    const { username, password, role } = data;
    
    if (!username || !password) {
      throw new Error('用户名和密码不能为空');
    }
    
    return {
      user_id: 'user_' + Date.now(),
      message: '注册成功'
    };
  }

  // 获取用户信息
  async handleGetUserInfo() {
    return {
      id: 'user_123',
      name: '张三',
      avatar: '/images/default-avatar.png',
      role: 'student',
      points: 350,
      classId: 'class_1',
      className: '高一1班'
    };
  }

  // 发送验证码
  async handleSendCode(data) {
    const { phone } = data;
    if (!phone) {
      throw new Error('手机号不能为空');
    }
    return { message: '验证码发送成功' };
  }

  // 获取班级列表
  async handleGetClassList(data, params) {
    const mockClasses = [
      {
        id: 'class_1',
        name: '高一1班',
        description: '积极向上的班级',
        studentCount: 45,
        avgScore: 85,
        completionRate: 0.92
      },
      {
        id: 'class_2',
        name: '高一2班', 
        description: '团结友爱的班级',
        studentCount: 42,
        avgScore: 82,
        completionRate: 0.88
      }
    ];
    
    const { activities } = params;
    let result = { list: mockClasses, total: mockClasses.length };
    
    if (activities) {
      result.activities = [
        {
          id: 'act_1',
          content: '张三同学完成了数学作业',
          userAvatar: '/images/avatar1.png',
          createTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        }
      ];
    }
    
    return result;
  }

  // 获取班级详情
  async handleGetClassDetail(data, params, routeParams) {
    return {
      id: routeParams.id,
      name: '高一1班',
      description: '积极向上的班级',
      studentCount: 45,
      avgScore: 85,
      completionRate: 0.92,
      teacherName: '李老师'
    };
  }

  // 获取班级成员
  async handleGetClassMembers(data, params, routeParams) {
    const mockStudents = Array.from({ length: 10 }, (_, i) => ({
      id: `student_${i + 1}`,
      name: `学生${i + 1}`,
      avatar: `/images/avatar${(i % 5) + 1}.png`,
      score: Math.floor(Math.random() * 40 + 60),
      points: Math.floor(Math.random() * 200 + 100)
    }));
    
    return { list: mockStudents, total: mockStudents.length };
  }

  // 获取班级排行榜
  async handleGetClassRanking(data, params, routeParams) {
    const mockRanking = Array.from({ length: 10 }, (_, i) => ({
      id: `student_${i + 1}`,
      name: `学生${i + 1}`,
      avatar: `/images/avatar${(i % 5) + 1}.png`,
      points: 500 - i * 20,
      rank: i + 1
    }));
    
    return { list: mockRanking, total: mockRanking.length };
  }

  // 获取小组列表
  async handleGetGroups(data, params, routeParams) {
    const groups = [
      {
        id: 'group_1',
        name: '学霸小组',
        members: 8,
        totalPoints: 450,
        rank: 1
      },
      {
        id: 'group_2',
        name: '进步小组', 
        members: 7,
        totalPoints: 380,
        rank: 2
      }
    ];
    
    return {
      list: groups,
      battleInfo: {
        endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      }
    };
  }

  // 获取作业列表
  async handleGetHomeworkList(data, params) {
    const mockHomework = Array.from({ length: 5 }, (_, i) => ({
      id: `hw_${i + 1}`,
      title: `数学作业${i + 1}`,
      subject: '数学',
      status: ['pending', 'completed', 'graded'][i % 3],
      statusText: ['待完成', '已完成', '已批改'][i % 3],
      score: i % 3 === 2 ? Math.floor(Math.random() * 30 + 70) : null,
      createTime: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
    }));
    
    const { status } = params;
    let result = { list: mockHomework, total: mockHomework.length };
    
    if (status === 'today') {
      result.total = 4;
      result.completed = 2;
      result.accuracy = '85%';
    }
    
    return result;
  }

  // 获取作业详情
  async handleGetHomeworkDetail(data, params, routeParams) {
    return {
      id: routeParams.id,
      title: '数学作业1',
      subject: '数学',
      description: '请认真完成以下题目',
      questionCount: 10,
      totalScore: 100,
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      questions: Array.from({ length: 5 }, (_, i) => ({
        id: `q_${i + 1}`,
        title: `题目${i + 1}`,
        type: 'single_choice',
        options: ['A', 'B', 'C', 'D'],
        score: 20
      }))
    };
  }

  // 创建作业
  async handleCreateHomework(data) {
    return {
      id: 'hw_' + Date.now(),
      ...data,
      status: 'pending',
      message: '作业创建成功'
    };
  }

  // 提交作业
  async handleSubmitHomework(data, params, routeParams) {
    const { answers } = data;
    if (!answers) {
      throw new Error('答案不能为空');
    }
    
    const score = Math.floor(Math.random() * 30 + 70);
    return {
      submissionId: 'sub_' + Date.now(),
      score,
      message: '提交成功'
    };
  }

  // 获取错题本
  async handleGetWrongQuestions(data, params) {
    const mockQuestions = Array.from({ length: 5 }, (_, i) => ({
      id: `q_${i + 1}`,
      title: `错题${i + 1}`,
      subject: '数学',
      wrongCount: Math.floor(Math.random() * 3 + 1),
      lastWrongTime: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
    }));
    
    return { list: mockQuestions, total: mockQuestions.length };
  }

  // 获取积分历史
  async handleGetPointsHistory(data, params) {
    const mockRecords = Array.from({ length: 10 }, (_, i) => ({
      id: `pr_${i + 1}`,
      type: ['homework_complete', 'attendance', 'exchange'][i % 3],
      typeName: ['完成作业', '出勤奖励', '积分兑换'][i % 3],
      points: i % 3 === 2 ? -20 : Math.floor(Math.random() * 15 + 5),
      description: i % 3 === 2 ? '兑换奖品' : '获得积分',
      createTime: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
    }));
    
    return { list: mockRecords, total: mockRecords.length };
  }

  // 获取积分统计
  async handleGetPointsStats() {
    return {
      totalPoints: 350,
      todayEarned: 15,
      weekEarned: 85,
      monthEarned: 280
    };
  }

  // 积分兑换
  async handleExchangePoints(data) {
    const { item_id } = data;
    return {
      exchangeId: 'ex_' + Date.now(),
      message: '兑换成功',
      remainingPoints: 250
    };
  }

  // 获取商城商品
  async handleGetShopItems(data, params) {
    const mockItems = Array.from({ length: 8 }, (_, i) => ({
      id: `item_${i + 1}`,
      name: `商品${i + 1}`,
      category: ['文具', '书籍', '电子产品'][i % 3],
      points: Math.floor(Math.random() * 100 + 50),
      image: `/images/shop/item${i + 1}.png`,
      stock: Math.floor(Math.random() * 50 + 10),
      status: 'available'
    }));
    
    return { list: mockItems, total: mockItems.length };
  }

  // 获取学习建议
  async handleGetStudySuggestions(data, params) {
    const mockSuggestions = [
      {
        id: 'ai_1',
        title: '学习计划建议',
        description: '建议每天复习数学30分钟，重点练习函数题型',
        priority: 'high'
      },
      {
        id: 'ai_2',
        title: '薄弱点分析',
        description: '数学几何题正确率较低，需要加强空间想象能力',
        priority: 'medium'
      }
    ];
    
    return { list: mockSuggestions };
  }

  // AI生成题目
  async handleGenerateQuestions(data) {
    const { subject, difficulty, count = 5 } = data;
    const questions = Array.from({ length: count }, (_, i) => ({
      id: `q_${i + 1}`,
      title: `${subject}题目${i + 1}`,
      type: 'single_choice',
      difficulty,
      options: ['A', 'B', 'C', 'D']
    }));
    
    return { questions, message: '题目生成成功' };
  }

  // 获取推荐内容
  async handleGetRecommendations(data, params) {
    const mockRecommendations = Array.from({ length: 5 }, (_, i) => ({
      id: `rec_${i + 1}`,
      title: `推荐内容${i + 1}`,
      description: '基于你的学习情况智能推荐',
      confidence: (Math.random() * 0.3 + 0.7).toFixed(2)
    }));
    
    return { list: mockRecommendations };
  }

  // 获取课件列表
  async handleGetCoursewareList(data, params) {
    const mockCourseware = Array.from({ length: 6 }, (_, i) => ({
      id: `cw_${i + 1}`,
      title: `数学课件${i + 1}`,
      subject: '数学',
      type: ['ppt', 'video', 'animation'][i % 3],
      typeName: ['PPT课件', '视频课件', '动画演示'][i % 3],
      teacherName: '李老师',
      downloadCount: Math.floor(Math.random() * 100),
      rating: (Math.random() * 2 + 3).toFixed(1)
    }));
    
    return { list: mockCourseware, total: mockCourseware.length };
  }

  // 获取课件详情
  async handleGetCoursewareDetail(data, params, routeParams) {
    return {
      id: routeParams.id,
      title: '数学课件1',
      subject: '数学',
      type: 'ppt',
      description: '详细的数学课件内容',
      fileUrl: '/courseware/math1.pptx',
      fileSize: '15MB',
      teacherName: '李老师'
    };
  }

  // 生成PPT
  async handleGeneratePPT(data) {
    const { title, content } = data;
    return {
      pptId: 'ppt_' + Date.now(),
      title,
      fileUrl: '/courseware/generated.pptx',
      message: 'PPT生成成功'
    };
  }

  // 获取家长报告
  async handleGetParentReports(data, params) {
    const reports = {
      summary: {
        totalChildren: 2,
        avgScore: 85,
        completionRate: 0.92
      }
    };
    
    const { includeChildren } = params;
    if (includeChildren) {
      reports.children = [
        {
          id: 'child_1',
          name: '张小明',
          className: '高一1班',
          todayCompleted: 3,
          todayTotal: 4,
          averageScore: 88
        }
      ];
    }
    
    return reports;
  }

  // 获取成长档案
  async handleGetGrowthArchive(data, params, routeParams) {
    const mockRecords = Array.from({ length: 3 }, (_, i) => ({
      id: `gr_${i + 1}`,
      semester: `2024年${i % 2 ? '上' : '下'}学期`,
      overallRating: '优秀',
      abilities: {
        calculation: Math.floor(Math.random() * 40 + 60),
        logic: Math.floor(Math.random() * 40 + 60),
        spatial: Math.floor(Math.random() * 40 + 60)
      }
    }));
    
    return { list: mockRecords, total: mockRecords.length };
  }

  // 获取学生档案
  async handleGetStudentProfile(data, params, routeParams) {
    return {
      id: routeParams.id,
      name: '张三',
      studentNumber: '20240001',
      className: '高一1班',
      averageScore: 85,
      totalHomework: 50,
      completedHomework: 45
    };
  }

  // 获取能力分析
  async handleGetAbilityAnalysis(data, params, routeParams) {
    return {
      studentId: routeParams.id,
      abilities: {
        calculation: Math.floor(Math.random() * 40 + 60),
        logic: Math.floor(Math.random() * 40 + 60),
        modeling: Math.floor(Math.random() * 40 + 60),
        analysis: Math.floor(Math.random() * 40 + 60),
        space: Math.floor(Math.random() * 40 + 60),
        creativity: Math.floor(Math.random() * 40 + 60)
      }
    };
  }
}

/**
 * 网络请求封装
 */
class Request {
  constructor() {
    this.baseUrl = '';
    this.timeout = 10000;
    this.mockEnabled = true; // Mock模式开关
    this.mockHandler = new MockHandler();
  }

  // 设置基础URL
  setBaseUrl(url) {
    this.baseUrl = url;
  }

  // 启用/禁用Mock模式
  setMockEnabled(enabled) {
    this.mockEnabled = enabled;
  }

  // 通用请求方法
  request(options) {
    // 如果启用Mock模式，使用Mock处理
    if (this.mockEnabled) {
      return this.handleMockRequest(options);
    }

    return new Promise((resolve, reject) => {
      const {
        url,
        method = 'GET',
        data = {},
        header = {},
        showLoading = true,
        loadingText = '加载中...'
      } = options;

      // 显示加载提示
      if (showLoading) {
        wx.showLoading({
          title: loadingText,
          mask: true
        });
      }

      // 构建完整URL
      const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;

      // 设置请求头
      const requestHeader = {
        'Content-Type': 'application/json',
        ...header
      };

      // 添加token
      const token = app.globalData.token;
      if (token) {
        requestHeader['Authorization'] = `Bearer ${token}`;
      }

      wx.request({
        url: fullUrl,
        method,
        data,
        header: requestHeader,
        timeout: this.timeout,
        success: (res) => {
          if (showLoading) {
            wx.hideLoading();
          }

          const { statusCode, data: responseData } = res;

          if (statusCode === 200) {
            if (responseData.code === 200) {
              resolve(responseData);
            } else {
              this.handleError(responseData.message || '请求失败');
              reject(responseData);
            }
          } else if (statusCode === 401) {
            this.handleUnauthorized();
            reject(res);
          } else {
            this.handleError(`请求失败 (${statusCode})`);
            reject(res);
          }
        },
        fail: (err) => {
          if (showLoading) {
            wx.hideLoading();
          }
          console.error('请求失败:', err);
          this.handleError('网络请求失败，请检查网络连接');
          reject(err);
        }
      });
    });
  }

  // 处理Mock请求
  async handleMockRequest(options) {
    const { url, method = 'GET', data = {}, showLoading = true } = options;
    
    if (showLoading) {
      wx.showLoading({
        title: '加载中...',
        mask: true
      });
    }

    try {
      console.log(`[Mock] ${method} ${url}`, data);
      
      // 解析查询参数
      const [path, queryString] = url.split('?');
      const params = {};
      if (queryString) {
        queryString.split('&').forEach(param => {
          const [key, value] = param.split('=');
          if (key && value !== undefined) {
            params[decodeURIComponent(key)] = decodeURIComponent(value);
          }
        });
      }
      
      const result = await this.mockHandler.handleRequest(method, path, data, params);
      
      if (showLoading) {
        wx.hideLoading();
      }
      
      console.log(`[Mock] Response:`, result);
      return result;
    } catch (error) {
      if (showLoading) {
        wx.hideLoading();
      }
      
      console.error(`[Mock] Error:`, error);
      this.handleError(error.message || 'Mock请求失败');
      throw error;
    }
  }

  // GET请求
  get(url, data = {}, options = {}) {
    // 处理查询参数
    const queryString = Object.keys(data)
      .filter(key => data[key] !== undefined && data[key] !== null && data[key] !== '')
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
      .join('&');

    const fullUrl = queryString ? `${url}?${queryString}` : url;

    return this.request({
      url: fullUrl,
      method: 'GET',
      ...options
    });
  }

  // POST请求
  post(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'POST',
      data,
      ...options
    });
  }

  // PUT请求
  put(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'PUT',
      data,
      ...options
    });
  }

  // DELETE请求
  delete(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'DELETE',
      data,
      ...options
    });
  }

  // 文件上传
  upload(url, filePath, name = 'file', formData = {}) {
    // Mock模式下的文件上传
    if (this.mockEnabled) {
      return new Promise((resolve) => {
        wx.showLoading({ title: '上传中...', mask: true });
        setTimeout(() => {
          wx.hideLoading();
          resolve({
            code: 200,
            message: 'success',
            data: {
              fileId: 'file_' + Date.now(),
              url: '/uploads/' + Date.now() + '.jpg',
              message: '上传成功'
            }
          });
        }, 1500);
      });
    }

    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: '上传中...',
        mask: true
      });

      const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
      const token = app.globalData.token;
      const header = {};
      
      if (token) {
        header['Authorization'] = `Bearer ${token}`;
      }

      wx.uploadFile({
        url: fullUrl,
        filePath,
        name,
        formData,
        header,
        success: (res) => {
          wx.hideLoading();
          
          try {
            const data = JSON.parse(res.data);
            if (data.code === 200) {
              resolve(data);
            } else {
              this.handleError(data.message || '上传失败');
              reject(data);
            }
          } catch (e) {
            this.handleError('上传响应解析失败');
            reject(e);
          }
        },
        fail: (err) => {
          wx.hideLoading();
          console.error('上传失败:', err);
          this.handleError('文件上传失败');
          reject(err);
        }
      });
    });
  }

  // 错误处理
  handleError(message) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    });
  }

  // 未授权处理
  handleUnauthorized() {
    wx.showModal({
      title: '提示',
      content: '登录已过期，请重新登录',
      showCancel: false,
      success: () => {
        app.clearUserInfo();
        wx.reLaunch({
          url: '/pages/login/login'
        });
      }
    });
  }
}

// 创建实例
const request = new Request();

// 设置基础URL
if (app && app.globalData) {
  request.setBaseUrl(app.globalData.baseUrl || 'https://api.example.com');
}

module.exports = request;