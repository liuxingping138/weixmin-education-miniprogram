// utils/api.js
// API接口管理 (支持Mock模式)

const request = require('./request.js');
const { mockConfigManager } = require('./mockConfig');

// Mock模式控制
const API = {
  // 启用Mock模式
  enableMock() {
    mockConfigManager.setEnabled(true);
    console.log('Mock模式已启用');
  },
  
  // 禁用Mock模式
  disableMock() {
    mockConfigManager.setEnabled(false);
    console.log('Mock模式已禁用');
  },
  
  // 检查Mock状态
  isMockEnabled() {
    return mockConfigManager.isEnabled();
  },
  
  // 设置Mock延迟
  setMockDelay(delay) {
    mockConfigManager.setDelay(delay);
  }
};

// 用户认证相关接口
const auth = {
  // 用户登录
  login(data) {
    return request.post('/auth/login', data);
  },
  
  // 用户注册
  register(data) {
    return request.post('/auth/register', data);
  },
  
  // 获取用户信息
  getUserInfo() {
    return request.get('/auth/user');
  },
  
  // 更新用户信息
  updateUserInfo(data) {
    return request.put('/auth/user', data);
  },
  
  // 修改密码
  changePassword(data) {
    return request.put('/auth/password', data);
  },
  
  // 退出登录
  logout() {
    return request.post('/auth/logout');
  },
  
  // 发送验证码
  sendCode(data) {
    return request.post('/auth/send-code', data);
  },
  
  // 验证验证码
  verifyCode(data) {
    return request.post('/auth/verify-code', data);
  }
};

// 班级管理相关接口
const classManagement = {
  // 获取班级列表
  getClassList(params) {
    return request.get('/class/list', params);
  },
  
  // 获取班级详情
  getClassDetail(classId) {
    return request.get(`/class/${classId}`);
  },
  
  // 创建班级
  createClass(data) {
    return request.post('/class/create', data);
  },
  
  // 更新班级信息
  updateClass(classId, data) {
    return request.put(`/class/${classId}`, data);
  },
  
  // 删除班级
  deleteClass(classId) {
    return request.delete(`/class/${classId}`);
  },
  
  // 加入班级
  joinClass(data) {
    return request.post('/class/join', data);
  },
  
  // 退出班级
  leaveClass(classId) {
    return request.post(`/class/${classId}/leave`);
  },
  
  // 获取班级成员
  getClassMembers(classId, params) {
    return request.get(`/class/${classId}/members`, params);
  },
  
  // 移除班级成员
  removeMember(classId, userId) {
    return request.delete(`/class/${classId}/members/${userId}`);
  },
  
  // 获取班级排行榜
  getClassRanking(classId, params) {
    return request.get(`/class/${classId}/ranking`, params);
  },
  
  // 获取小组列表
  getGroups(classId) {
    return request.get(`/class/${classId}/groups`);
  },
  
  // 创建小组
  createGroup(classId, data) {
    return request.post(`/class/${classId}/groups`, data);
  },
  
  // 小组对抗记录
  getGroupBattles(classId, params) {
    return request.get(`/class/${classId}/battles`, params);
  }
};

// 学生档案相关接口
const studentProfile = {
  // 获取学生档案
  getProfile(studentId) {
    return request.get(`/student/${studentId}/profile`);
  },
  
  // 更新学生档案
  updateProfile(studentId, data) {
    return request.put(`/student/${studentId}/profile`, data);
  },
  
  // 获取学习记录
  getStudyRecords(studentId, params) {
    return request.get(`/student/${studentId}/records`, params);
  },
  
  // 获取成绩统计
  getGradeStats(studentId, params) {
    return request.get(`/student/${studentId}/grades`, params);
  },
  
  // 获取能力分析
  getAbilityAnalysis(studentId) {
    return request.get(`/student/${studentId}/ability`);
  },
  
  // 生成学习报告
  generateReport(studentId, data) {
    return request.post(`/student/${studentId}/report`, data);
  }
};

// 积分系统相关接口
const points = {
  // 获取积分记录
  getPointsHistory(params) {
    return request.get('/points/history', params);
  },
  
  // 获取积分统计
  getPointsStats() {
    return request.get('/points/stats');
  },
  
  // 积分兑换
  exchangePoints(data) {
    return request.post('/points/exchange', data);
  },
  
  // 获取商城商品
  getShopItems(params) {
    return request.get('/shop/items', params);
  },
  
  // 获取兑换记录
  getExchangeHistory(params) {
    return request.get('/points/exchange-history', params);
  },
  
  // 获取奖品管理
  getPrizes(params) {
    return request.get('/shop/prizes', params);
  },
  
  // 创建奖品
  createPrize(data) {
    return request.post('/shop/prizes', data);
  },
  
  // 更新奖品
  updatePrize(prizeId, data) {
    return request.put(`/shop/prizes/${prizeId}`, data);
  },
  
  // 删除奖品
  deletePrize(prizeId) {
    return request.delete(`/shop/prizes/${prizeId}`);
  }
};

// 作业系统相关接口
const homework = {
  // 获取作业列表
  getHomeworkList(params) {
    return request.get('/homework/list', params);
  },
  
  // 获取作业详情
  getHomeworkDetail(homeworkId) {
    return request.get(`/homework/${homeworkId}`);
  },
  
  // 创建作业
  createHomework(data) {
    return request.post('/homework/create', data);
  },
  
  // 更新作业
  updateHomework(homeworkId, data) {
    return request.put(`/homework/${homeworkId}`, data);
  },
  
  // 删除作业
  deleteHomework(homeworkId) {
    return request.delete(`/homework/${homeworkId}`);
  },
  
  // 提交作业
  submitHomework(homeworkId, data) {
    return request.post(`/homework/${homeworkId}/submit`, data);
  },
  
  // 批改作业
  gradeHomework(submissionId, data) {
    return request.post(`/homework/submissions/${submissionId}/grade`, data);
  },
  
  // 获取作业提交记录
  getSubmissions(homeworkId, params) {
    return request.get(`/homework/${homeworkId}/submissions`, params);
  },
  
  // 获取错题本
  getWrongQuestions(params) {
    return request.get('/homework/wrong-questions', params);
  },
  
  // 获取正确率分析
  getAccuracyAnalysis(params) {
    return request.get('/homework/accuracy-analysis', params);
  },
  
  // AI智能批改
  aiGrading(data) {
    return request.post('/homework/ai-grading', data);
  }
};

// AI功能相关接口
const ai = {
  // AI自动出题
  generateQuestions(data) {
    return request.post('/ai/generate-questions', data);
  },
  
  // 个性化推荐
  getRecommendations(params) {
    return request.get('/ai/recommendations', params);
  },
  
  // 学习路径规划
  getStudyPath(data) {
    return request.post('/ai/study-path', data);
  },
  
  // 知识点分析
  analyzeKnowledge(data) {
    return request.post('/ai/knowledge-analysis', data);
  },
  
  // 学习建议
  getStudySuggestions(params) {
    return request.get('/ai/study-suggestions', params);
  }
};

// 课件功能相关接口
const courseware = {
  // 获取课件列表
  getCoursewareList(params) {
    return request.get('/courseware/list', params);
  },
  
  // 获取课件详情
  getCoursewareDetail(coursewareId) {
    return request.get(`/courseware/${coursewareId}`);
  },
  
  // 创建课件
  createCourseware(data) {
    return request.post('/courseware/create', data);
  },
  
  // 自动生成PPT
  generatePPT(data) {
    return request.post('/courseware/generate-ppt', data);
  },
  
  // 获取知识点动画
  getKnowledgeAnimations(params) {
    return request.get('/courseware/animations', params);
  },
  
  // 上传课件文件
  uploadCoursewareFile(filePath, formData) {
    return request.upload('/courseware/upload', filePath, 'file', formData);
  }
};

// 家校互动相关接口
const parentInteraction = {
  // 获取家长报告
  getParentReports(params) {
    return request.get('/parent/reports', params);
  },
  
  // 生成学习档案PDF
  generateStudyArchivePDF(studentId, data) {
    return request.post(`/parent/students/${studentId}/archive-pdf`, data);
  },
  
  // 发送微信群消息
  sendWechatGroupMessage(data) {
    return request.post('/parent/wechat-message', data);
  },
  
  // 获取家长通知
  getParentNotifications(params) {
    return request.get('/parent/notifications', params);
  },
  
  // 标记通知已读
  markNotificationRead(notificationId) {
    return request.put(`/parent/notifications/${notificationId}/read`);
  },
  
  // 获取学生成长档案
  getGrowthArchive(studentId, params) {
    return request.get(`/parent/students/${studentId}/growth`, params);
  }
};

// 文件上传相关接口
const upload = {
  // 上传图片
  uploadImage(filePath, formData = {}) {
    return request.upload('/upload/image', filePath, 'image', formData);
  },
  
  // 上传文档
  uploadDocument(filePath, formData = {}) {
    return request.upload('/upload/document', filePath, 'document', formData);
  },
  
  // 上传音频
  uploadAudio(filePath, formData = {}) {
    return request.upload('/upload/audio', filePath, 'audio', formData);
  },
  
  // 上传视频
  uploadVideo(filePath, formData = {}) {
    return request.upload('/upload/video', filePath, 'video', formData);
  },
  
  // 批量上传
  batchUpload(files) {
    return request.post('/upload/batch', { files });
  }
};

module.exports = {
  API,
  auth,
  classManagement,
  studentProfile,
  points,
  homework,
  ai,
  courseware,
  parentInteraction,
  upload
};