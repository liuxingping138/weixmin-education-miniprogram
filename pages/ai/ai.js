// pages/ai/ai.js
const mock = require('../../utils/mock.js');
const request = require('../../utils/request.js');

Page({
  data: {
    // 页面状态
    loading: false,
    isEmpty: false,
    showToast: false,
    toastMessage: '',
    
    // 标签页状态
    activeTab: 'generate', // generate, recommend, analysis
    
    // AI统计数据
    aiStats: {
      totalQuestions: 0,
      recommendations: 0,
      accuracy: 0,
      studyDays: 0
    },
    
    // 智能出题相关
    subjects: [],
    selectedSubject: '',
    difficulties: [
      { value: 'easy', name: '简单', icon: '🟢', color: '#67c23a' },
      { value: 'medium', name: '中等', icon: '🟡', color: '#e6a23c' },
      { value: 'hard', name: '困难', icon: '🔴', color: '#f56c6c' }
    ],
    selectedDifficulty: 'medium',
    questionQuantity: 10,
    knowledgePoints: [],
    generating: false,
    generatedQuestions: [],
    
    // 个性推荐相关
    todayRecommendations: [],
    completedRecommendations: 0,
    selectedCategory: 'all',
    recommendCategories: [],
    recommendations: [],
    filteredRecommendations: [],
    
    // 学习分析相关
    analysisDate: '',
    learningStatus: [],
    strengths: [],
    weaknesses: [],
    aiSuggestions: [],
    studyTrends: [],
    
    // 弹窗状态
    showRecommendDetail: false,
    selectedRecommendation: null,
    showQuestionDetail: false,
    selectedQuestion: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initPage();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.refreshData();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.refreshData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '智慧校园 - AI智能助手',
      path: '/pages/ai/ai'
    };
  },

  /**
   * 初始化页面
   */
  async initPage() {
    this.setData({ loading: true });
    
    try {
      await Promise.all([
        this.loadAIStats(),
        this.loadSubjects(),
        this.loadRecommendations(),
        this.loadAnalysisData()
      ]);
      
      this.filterRecommendations();
      
    } catch (error) {
      console.error('初始化页面失败:', error);
      this.showToastMessage('加载失败，请重试');
    } finally {
      this.setData({ loading: false });
    }
  },

  /**
   * 刷新数据
   */
  async refreshData() {
    return this.initPage();
  },

  /**
   * 加载AI统计数据
   */
  async loadAIStats() {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const stats = {
      totalQuestions: mock.generateNumber(1000, 2000),
      recommendations: mock.generateNumber(100, 300),
      accuracy: mock.generateNumber(85, 98),
      studyDays: mock.generateNumber(30, 100)
    };
    
    this.setData({ aiStats: stats });
    return stats;
  },

  /**
   * 加载科目列表
   */
  async loadSubjects() {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const subjects = [
      { id: 'math', name: '数学', icon: '📐', color: '#667eea' },
      { id: 'chinese', name: '语文', icon: '📚', color: '#e6a23c' },
      { id: 'english', name: '英语', icon: '🔤', color: '#67c23a' },
      { id: 'physics', name: '物理', icon: '⚛️', color: '#909399' },
      { id: 'chemistry', name: '化学', icon: '🧪', color: '#f56c6c' },
      { id: 'biology', name: '生物', icon: '🧬', color: '#85ce61' }
    ];
    
    this.setData({ subjects });
    return subjects;
  },

  /**
   * 加载推荐数据
   */
  async loadRecommendations() {
    return Promise.all([
      this.loadRecommendCategories(),
      this.loadRecommendationList()
    ]);
  },

  /**
   * 加载推荐分类
   */
  async loadRecommendCategories() {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const categories = [
      { id: 'weak', name: '薄弱提升', icon: '⚠️' },
      { id: 'practice', name: '专项练习', icon: '🎯' },
      { id: 'review', name: '复习巩固', icon: '📖' },
      { id: 'advance', name: '拓展提高', icon: '🚀' }
    ];
    
    this.setData({ recommendCategories: categories });
    return categories;
  },

  /**
   * 加载推荐列表
   */
  async loadRecommendationList() {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const subjects = ['数学', '语文', '英语', '物理', '化学', '生物'];
    const icons = ['📐', '📚', '🔤', '⚛️', '🧪', '🧬'];
    const categories = ['weak', 'practice', 'review', 'advance'];
    const priorities = ['high', 'medium', 'low'];
    const priorityTexts = { high: '高优先级', medium: '中优先级', low: '低优先级' };
    
    const knowledgePoints = {
      '数学': ['二次函数', '三角函数', '数列', '立体几何', '概率统计'],
      '语文': ['古诗词鉴赏', '现代文阅读', '文言文', '作文写作', '语言文字运用'],
      '英语': ['语法', '词汇', '阅读理解', '写作', '听力'],
      '物理': ['力学', '电磁学', '光学', '热学', '原子物理'],
      '化学': ['化学方程式', '有机化学', '无机化学', '化学实验', '化学计算'],
      '生物': ['细胞生物学', '遗传学', '生态学', '生物实验', '分子生物学']
    };
    
    const recommendations = [];
    for (let i = 1; i <= 15; i++) {
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      const icon = icons[subjects.indexOf(subject)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      const knowledgePoint = knowledgePoints[subject][Math.floor(Math.random() * knowledgePoints[subject].length)];
      const progress = Math.random() > 0.7 ? mock.generateNumber(0, 100) : 0;
      const completed = progress === 100;
      
      recommendations.push({
        id: i,
        icon,
        title: this.generateRecommendTitle(subject, knowledgePoint),
        reason: this.generateRecommendReason(),
        description: this.generateRecommendDescription(subject, knowledgePoint),
        subject,
        knowledgePoint,
        estimatedTime: mock.generateNumber(15, 45),
        priority,
        priorityText: priorityTexts[priority],
        category,
        progress,
        completed,
        goal: this.generateRecommendGoal(knowledgePoint),
        benefit: this.generateRecommendBenefit(subject),
        aiScore: mock.generateNumber(80, 98),
        difficulty: this.difficulties[Math.floor(Math.random() * this.difficulties.length)].value,
        tags: this.generateRecommendTags(category, priority)
      });
    }
    
    // 按优先级和AI评分排序
    recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return b.aiScore - a.aiScore;
    });
    
    const todayRecommendations = recommendations.filter(item => !item.completed);
    const completedCount = recommendations.filter(item => item.completed).length;
    
    this.setData({ 
      recommendations,
      todayRecommendations,
      completedRecommendations: completedCount
    });
    return recommendations;
  },

  /**
   * 生成推荐标题
   */
  generateRecommendTitle(subject, knowledgePoint) {
    const templates = [
      `${knowledgePoint}专项训练`,
      `${knowledgePoint}强化练习`,
      `${knowledgePoint}提升课程`,
      `${knowledgePoint}巩固复习`,
      `${subject}${knowledgePoint}突破`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  },

  /**
   * 生成推荐原因
   */
  generateRecommendReason() {
    const reasons = [
      '基于错题分析推荐',
      '学习进度推荐',
      '知识点关联推荐',
      '薄弱环节推荐',
      '兴趣拓展推荐',
      'AI智能分析推荐',
      '同学对比推荐',
      '学习目标推荐'
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  },

  /**
   * 生成推荐描述
   */
  generateRecommendDescription(subject, knowledgePoint) {
    const templates = [
      `针对${knowledgePoint}的核心概念和解题方法进行专项训练，提高${subject}学习效果`,
      `通过系统性练习${knowledgePoint}相关题目，巩固基础知识，提升解题能力`,
      `深入学习${knowledgePoint}的重点难点，结合实际应用加深理解`,
      `全面复习${knowledgePoint}知识体系，查漏补缺，完善知识结构`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  },

  /**
   * 生成推荐目标
   */
  generateRecommendGoal(knowledgePoint) {
    const templates = [
      `熟练掌握${knowledgePoint}的基本概念和解题方法`,
      `提高${knowledgePoint}相关题目的解题速度和准确率`,
      `深入理解${knowledgePoint}的应用场景和解题思路`,
      `建立完整的${knowledgePoint}知识体系`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  },

  /**
   * 生成推荐收益
   */
  generateRecommendBenefit(subject) {
    const benefits = [
      `提高${subject}成绩，增强学科理解能力`,
      `为后续学习打好基础，提升学习效率`,
      `增强解题思维，培养逻辑分析能力`,
      `提升学习兴趣，建立学习自信心`
    ];
    return benefits[Math.floor(Math.random() * benefits.length)];
  },

  /**
   * 生成推荐标签
   */
  generateRecommendTags(category, priority) {
    const categoryTags = {
      weak: ['薄弱', '重点'],
      practice: ['练习', '巩固'],
      review: ['复习', '回顾'],
      advance: ['拓展', '提高']
    };
    
    const priorityTags = {
      high: ['紧急', '重要'],
      medium: ['推荐', '适中'],
      low: ['选修', '补充']
    };
    
    return [
      ...categoryTags[category] || [],
      ...priorityTags[priority] || []
    ];
  },

  /**
   * 加载分析数据
   */
  async loadAnalysisData() {
    return Promise.all([
      this.loadLearningStatus(),
      this.loadStrengthsWeaknesses(),
      this.loadAISuggestions(),
      this.loadStudyTrends()
    ]);
  },

  /**
   * 加载学习状态
   */
  async loadLearningStatus() {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const learningStatus = [
      { 
        type: 'focus', 
        name: '专注度', 
        icon: '🎯', 
        score: mock.generateNumber(75, 95),
        description: '学习时的注意力集中程度'
      },
      { 
        type: 'efficiency', 
        name: '学习效率', 
        icon: '⚡', 
        score: mock.generateNumber(70, 90),
        description: '单位时间内的学习成果'
      },
      { 
        type: 'consistency', 
        name: '学习持续性', 
        icon: '📈', 
        score: mock.generateNumber(80, 98),
        description: '学习习惯的稳定性'
      },
      { 
        type: 'comprehension', 
        name: '理解能力', 
        icon: '🧠', 
        score: mock.generateNumber(75, 95),
        description: '对新知识的理解速度'
      },
      { 
        type: 'memory', 
        name: '记忆能力', 
        icon: '💭', 
        score: mock.generateNumber(70, 88),
        description: '知识点的记忆和保持能力'
      },
      { 
        type: 'application', 
        name: '应用能力', 
        icon: '🔧', 
        score: mock.generateNumber(65, 85),
        description: '将知识运用到实际问题的能力'
      }
    ];
    
    const analysisDate = new Date().toLocaleDateString('zh-CN');
    
    this.setData({ 
      learningStatus,
      analysisDate
    });
    return learningStatus;
  },

  /**
   * 加载优势与不足
   */
  async loadStrengthsWeaknesses() {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const allStrengths = [
      '数学逻辑思维能力强',
      '英语词汇量丰富',
      '物理概念理解准确',
      '学习态度认真积极',
      '化学实验操作规范',
      '语文阅读理解能力好',
      '生物知识记忆牢固',
      '学习计划执行力强',
      '课堂参与度高',
      '作业完成质量好'
    ];
    
    const allWeaknesses = [
      '化学方程式配平需要加强',
      '语文阅读理解速度较慢',
      '生物知识点记忆不够牢固',
      '做题时间分配需要优化',
      '数学计算准确率有待提高',
      '英语语法应用不够熟练',
      '物理公式记忆需要巩固',
      '学习方法需要改进',
      '复习计划执行不够规律',
      '错题整理不够及时'
    ];
    
    const strengths = mock.generateArray(mock.generateNumber(4, 6), () => {
      const index = Math.floor(Math.random() * allStrengths.length);
      return allStrengths.splice(index, 1)[0];
    });
    
    const weaknesses = mock.generateArray(mock.generateNumber(3, 5), () => {
      const index = Math.floor(Math.random() * allWeaknesses.length);
      return allWeaknesses.splice(index, 1)[0];
    });
    
    this.setData({ strengths, weaknesses });
    return { strengths, weaknesses };
  },

  /**
   * 加载AI建议
   */
  async loadAISuggestions() {
    await new Promise(resolve => setTimeout(resolve, 280));
    
    const suggestionTemplates = [
      {
        icon: '📚',
        title: '增加专项练习',
        contentTemplate: '建议每天花{time}分钟练习{subject}，可以显著提高{subject}成绩',
        priority: 'high'
      },
      {
        icon: '⏰',
        title: '优化学习时间安排',
        contentTemplate: '建议在{timeSlot}进行{subject}学习，效果更佳',
        priority: 'medium'
      },
      {
        icon: '🎯',
        title: '制定阶段性目标',
        contentTemplate: '建议设定{period}学习目标，如{goal}，提高学习动力',
        priority: 'medium'
      },
      {
        icon: '📖',
        title: '增加课外阅读',
        contentTemplate: '建议每天阅读{time}分钟{type}，提高{benefit}',
        priority: 'low'
      },
      {
        icon: '🔄',
        title: '建立复习机制',
        contentTemplate: '建议采用{method}复习法，提高知识保持率',
        priority: 'high'
      },
      {
        icon: '👥',
        title: '加强同伴学习',
        contentTemplate: '建议与同学组成学习小组，互相{action}，共同进步',
        priority: 'low'
      }
    ];
    
    const subjects = ['数学', '语文', '英语', '物理', '化学', '生物'];
    const timeSlots = ['上午9-11点', '下午3-5点', '晚上7-9点'];
    const periods = ['每周', '每月', '每学期'];
    const methods = ['艾宾浩斯遗忘曲线', '费曼学习法', '思维导图'];
    const actions = ['讨论问题', '互相提问', '分享笔记'];
    
    const aiSuggestions = [];
    for (let i = 0; i < 6; i++) {
      const template = suggestionTemplates[i];
      let content = template.contentTemplate;
      
      // 替换模板变量
      content = content.replace('{time}', mock.generateNumber(15, 30));
      content = content.replace('{subject}', subjects[Math.floor(Math.random() * subjects.length)]);
      content = content.replace('{timeSlot}', timeSlots[Math.floor(Math.random() * timeSlots.length)]);
      content = content.replace('{period}', periods[Math.floor(Math.random() * periods.length)]);
      content = content.replace('{goal}', '完成20道练习题');
      content = content.replace('{type}', '课外书籍');
      content = content.replace('{benefit}', '阅读理解能力和知识面');
      content = content.replace('{method}', methods[Math.floor(Math.random() * methods.length)]);
      content = content.replace('{action}', actions[Math.floor(Math.random() * actions.length)]);
      
      aiSuggestions.push({
        id: i + 1,
        icon: template.icon,
        title: template.title,
        content,
        priority: template.priority,
        priorityText: template.priority === 'high' ? '高优先级' : 
                     template.priority === 'medium' ? '中优先级' : '低优先级',
        aiConfidence: mock.generateNumber(85, 98),
        estimatedEffect: mock.generateNumber(15, 35)
      });
    }
    
    this.setData({ aiSuggestions });
    return aiSuggestions;
  },

  /**
   * 加载学习趋势
   */
  async loadStudyTrends() {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const studyTrends = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      studyTrends.push({
        date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
        studyTime: mock.generateNumber(30, 180), // 分钟
        efficiency: mock.generateNumber(60, 95),
        completedTasks: mock.generateNumber(3, 12),
        score: mock.generateNumber(70, 100)
      });
    }
    
    this.setData({ studyTrends });
    return studyTrends;
  },

  /**
   * 切换标签页
   */
  switchTab(e) {
    const { tab } = e.currentTarget.dataset;
    this.setData({ activeTab: tab });
    
    // 根据标签页加载对应数据
    if (tab === 'analysis') {
      this.initCharts();
    }
  },

  /**
   * 选择科目
   */
  selectSubject(e) {
    const { subject } = e.currentTarget.dataset;
    this.setData({ selectedSubject: subject });
    this.loadKnowledgePoints(subject);
  },

  /**
   * 加载知识点
   */
  async loadKnowledgePoints(subjectId) {
    const knowledgePointsMap = {
      math: [
        { id: 1, name: '二次函数', selected: false, difficulty: 'medium' },
        { id: 2, name: '三角函数', selected: false, difficulty: 'hard' },
        { id: 3, name: '数列', selected: false, difficulty: 'medium' },
        { id: 4, name: '立体几何', selected: false, difficulty: 'hard' },
        { id: 5, name: '概率统计', selected: false, difficulty: 'easy' }
      ],
      chinese: [
        { id: 6, name: '古诗词鉴赏', selected: false, difficulty: 'medium' },
        { id: 7, name: '现代文阅读', selected: false, difficulty: 'easy' },
        { id: 8, name: '文言文', selected: false, difficulty: 'hard' },
        { id: 9, name: '作文写作', selected: false, difficulty: 'medium' },
        { id: 10, name: '语言文字运用', selected: false, difficulty: 'easy' }
      ],
      english: [
        { id: 11, name: '语法', selected: false, difficulty: 'medium' },
        { id: 12, name: '词汇', selected: false, difficulty: 'easy' },
        { id: 13, name: '阅读理解', selected: false, difficulty: 'medium' },
        { id: 14, name: '写作', selected: false, difficulty: 'hard' },
        { id: 15, name: '听力', selected: false, difficulty: 'medium' }
      ],
      physics: [
        { id: 16, name: '力学', selected: false, difficulty: 'medium' },
        { id: 17, name: '电磁学', selected: false, difficulty: 'hard' },
        { id: 18, name: '光学', selected: false, difficulty: 'easy' },
        { id: 19, name: '热学', selected: false, difficulty: 'easy' },
        { id: 20, name: '原子物理', selected: false, difficulty: 'hard' }
      ],
      chemistry: [
        { id: 21, name: '化学方程式', selected: false, difficulty: 'medium' },
        { id: 22, name: '有机化学', selected: false, difficulty: 'hard' },
        { id: 23, name: '无机化学', selected: false, difficulty: 'medium' },
        { id: 24, name: '化学实验', selected: false, difficulty: 'easy' },
        { id: 25, name: '化学计算', selected: false, difficulty: 'hard' }
      ],
      biology: [
        { id: 26, name: '细胞生物学', selected: false, difficulty: 'medium' },
        { id: 27, name: '遗传学', selected: false, difficulty: 'hard' },
        { id: 28, name: '生态学', selected: false, difficulty: 'easy' },
        { id: 29, name: '生物实验', selected: false, difficulty: 'easy' },
        { id: 30, name: '分子生物学', selected: false, difficulty: 'hard' }
      ]
    };
    
    const knowledgePoints = knowledgePointsMap[subjectId] || [];
    this.setData({ knowledgePoints });
  },

  /**
   * 选择难度
   */
  selectDifficulty(e) {
    const { difficulty } = e.currentTarget.dataset;
    this.setData({ selectedDifficulty: difficulty });
  },

  /**
   * 减少题目数量
   */
  decreaseQuantity() {
    const { questionQuantity } = this.data;
    if (questionQuantity > 5) {
      this.setData({ questionQuantity: questionQuantity - 5 });
    }
  },

  /**
   * 增加题目数量
   */
  increaseQuantity() {
    const { questionQuantity } = this.data;
    if (questionQuantity < 50) {
      this.setData({ questionQuantity: questionQuantity + 5 });
    }
  },

  /**
   * 切换知识点选择
   */
  toggleKnowledge(e) {
    const { knowledge } = e.currentTarget.dataset;
    const { knowledgePoints } = this.data;
    
    const updatedPoints = knowledgePoints.map(point => {
      if (point.id === knowledge) {
        return { ...point, selected: !point.selected };
      }
      return point;
    });
    
    this.setData({ knowledgePoints: updatedPoints });
  },

  /**
   * 生成题目
   */
  async generateQuestions() {
    const { selectedSubject, selectedDifficulty, questionQuantity, knowledgePoints } = this.data;
    
    if (!selectedSubject) {
      this.showToastMessage('请先选择科目');
      return;
    }
    
    this.setData({ generating: true });
    
    try {
      // 模拟AI生成题目
      await this.simulateAIGeneration();
      
      const generatedQuestions = this.createMockQuestions(
        selectedSubject, 
        selectedDifficulty, 
        questionQuantity,
        knowledgePoints.filter(p => p.selected)
      );
      
      this.setData({ 
        generatedQuestions,
        generating: false
      });
      
      this.showToastMessage(`AI成功生成${questionQuantity}道题目`);
      
    } catch (error) {
      console.error('生成题目失败:', error);
      this.setData({ generating: false });
      this.showToastMessage('生成失败，请重试');
    }
  },

  /**
   * 模拟AI生成过程
   */
  async simulateAIGeneration() {
    return new Promise((resolve) => {
      setTimeout(resolve, mock.generateNumber(1500, 3000)); // 模拟1.5-3秒生成时间
    });
  },

  /**
   * 创建模拟题目
   */
  createMockQuestions(subject, difficulty, quantity, selectedKnowledgePoints) {
    const questions = [];
    const subjectMap = {
      math: '数学',
      chinese: '语文',
      english: '英语',
      physics: '物理',
      chemistry: '化学',
      biology: '生物'
    };
    
    const difficultyMap = {
      easy: { text: '简单', time: 2, color: '#67c23a' },
      medium: { text: '中等', time: 3, color: '#e6a23c' },
      hard: { text: '困难', time: 5, color: '#f56c6c' }
    };
    
    const questionTemplates = {
      math: [
        '求函数 f(x) = x² + 2x - 3 的最小值',
        '解方程 2x + 3 = 7',
        '计算三角形的面积，已知底边长为8cm，高为6cm',
        '求数列 {an} 的通项公式，其中 a1=1, an+1=2an+1',
        '在正方体中，求异面直线所成角的余弦值'
      ],
      english: [
        'Choose the correct form: I ____ (go) to school yesterday.',
        'Translate: "我喜欢读书" into English.',
        'Complete the sentence: She is ____ than her sister.',
        'What is the past tense of "bring"?',
        'Fill in the blank: I have been ____ English for 5 years.'
      ],
      physics: [
        '一个物体从高度h自由落下，求落地时的速度',
        '计算电阻为10Ω的导体中通过2A电流时的功率',
        '解释牛顿第一定律的内容',
        '光在水中的传播速度是多少？',
        '计算弹簧的弹性势能，已知弹簧常数k=100N/m，压缩量x=0.1m'
      ],
      chemistry: [
        '配平化学方程式：Al + HCl → AlCl₃ + H₂',
        '计算1mol NaCl的质量',
        '写出甲烷燃烧的化学方程式',
        '什么是氧化还原反应？',
        '计算0.1mol/L HCl溶液的pH值'
      ],
      chinese: [
        '分析《静夜思》的艺术特色',
        '解释"山重水复疑无路，柳暗花明又一村"的含义',
        '概括文章的主要内容',
        '分析人物形象特点',
        '写一篇关于"友谊"的作文'
      ],
      biology: [
        '描述细胞膜的结构和功能',
        '解释DNA复制的过程',
        '什么是生态系统？',
        '分析遗传定律的应用',
        '描述光合作用的过程'
      ]
    };
    
    const knowledgePointsList = {
      math: ['二次函数', '一元一次方程', '几何图形', '数列', '立体几何'],
      english: ['时态', '翻译', '比较级', '词汇', '语法'],
      physics: ['自由落体', '电功率', '牛顿定律', '光学', '弹性势能'],
      chemistry: ['化学方程式', '摩尔计算', '燃烧反应', '氧化还原', 'pH计算'],
      chinese: ['古诗词鉴赏', '诗歌理解', '阅读理解', '人物分析', '作文写作'],
      biology: ['细胞结构', 'DNA复制', '生态系统', '遗传定律', '光合作用']
    };
    
    for (let i = 0; i < quantity; i++) {
      const questionTexts = questionTemplates[subject] || ['示例题目'];
      const knowledgePointList = knowledgePointsList[subject] || ['基础知识'];
      
      // 如果选择了特定知识点，优先使用
      let knowledgePoint;
      if (selectedKnowledgePoints.length > 0) {
        knowledgePoint = selectedKnowledgePoints[i % selectedKnowledgePoints.length].name;
      } else {
        knowledgePoint = knowledgePointList[i % knowledgePointList.length];
      }
      
      const questionType = Math.random() > 0.7 ? 'essay' : 'choice';
      let options = [];
      
      if (questionType === 'choice') {
        options = [
          'A. 选项1',
          'B. 选项2', 
          'C. 选项3',
          'D. 选项4'
        ];
      }
      
      questions.push({
        id: i + 1,
        question: questionTexts[i % questionTexts.length],
        type: questionType,
        options,
        difficulty,
        difficultyText: difficultyMap[difficulty].text,
        difficultyColor: difficultyMap[difficulty].color,
        knowledgePoint,
        estimatedTime: difficultyMap[difficulty].time,
        subject: subjectMap[subject],
        aiGenerated: true,
        aiScore: mock.generateNumber(85, 98),
        tags: this.generateQuestionTags(difficulty, knowledgePoint),
        explanation: this.generateQuestionExplanation(subject, knowledgePoint),
        relatedQuestions: mock.generateNumber(3, 8)
      });
    }
    
    return questions;
  },

  /**
   * 生成题目标签
   */
  generateQuestionTags(difficulty, knowledgePoint) {
    const difficultyTags = {
      easy: ['基础', '入门'],
      medium: ['进阶', '综合'],
      hard: ['高难', '拓展']
    };
    
    return [
      ...difficultyTags[difficulty] || [],
      knowledgePoint,
      'AI生成'
    ];
  },

  /**
   * 生成题目解析
   */
  generateQuestionExplanation(subject, knowledgePoint) {
    const templates = [
      `这道题主要考查${knowledgePoint}的基本概念和应用方法。`,
      `解题关键在于理解${knowledgePoint}的核心原理。`,
      `此题综合运用了${knowledgePoint}的相关知识点。`,
      `通过这道题可以加深对${knowledgePoint}的理解。`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  },

  /**
   * 查看题目详情
   */
  viewQuestionDetail(e) {
    const { question } = e.currentTarget.dataset;
    this.setData({
      selectedQuestion: question,
      showQuestionDetail: true
    });
  },

  /**
   * 关闭题目详情
   */
  closeQuestionDetail() {
    this.setData({ showQuestionDetail: false });
  },

  /**
   * 开始练习
   */
  startPractice() {
    const { generatedQuestions } = this.data;
    
    if (generatedQuestions.length === 0) {
      this.showToastMessage('请先生成题目');
      return;
    }
    
    // 跳转到练习页面
    wx.navigateTo({
      url: '/pages/practice/practice?type=generated'
    });
  },

  /**
   * 保存题目
   */
  saveQuestions() {
    const { generatedQuestions } = this.data;
    
    if (generatedQuestions.length === 0) {
      this.showToastMessage('请先生成题目');
      return;
    }
    
    // 模拟保存题目
    this.showToastMessage('题目已保存到个人题库');
  },

  /**
   * 重新生成
   */
  regenerateQuestions() {
    this.setData({ generatedQuestions: [] });
    this.generateQuestions();
  },

  /**
   * 选择推荐分类
   */
  selectCategory(e) {
    const { category } = e.currentTarget.dataset;
    this.setData({ selectedCategory: category });
    this.filterRecommendations();
  },

  /**
   * 筛选推荐列表
   */
  filterRecommendations() {
    const { recommendations, selectedCategory } = this.data;
    
    let filteredRecommendations = recommendations;
    
    if (selectedCategory !== 'all') {
      filteredRecommendations = recommendations.filter(item => item.category === selectedCategory);
    }
    
    this.setData({ filteredRecommendations });
  },

  /**
   * 查看推荐详情
   */
  viewRecommendation(e) {
    const { recommendation } = e.currentTarget.dataset;
    this.setData({
      selectedRecommendation: recommendation,
      showRecommendDetail: true
    });
  },

  /**
   * 关闭推荐详情弹窗
   */
  closeRecommendDetail() {
    this.setData({ showRecommendDetail: false });
  },

  /**
   * 弹窗显示状态变化
   */
  onRecommendDetailClose(e) {
    if (!e.detail.visible) {
      this.setData({ showRecommendDetail: false });
    }
  },

  /**
   * 开始推荐学习
   */
  startRecommendation(e) {
    const { recommendation } = e.currentTarget.dataset;
    
    if (recommendation.completed) {
      this.showToastMessage('该推荐已完成');
      return;
    }
    
    // 跳转到对应的学习页面
    wx.navigateTo({
      url: `/pages/practice/practice?recommendId=${recommendation.id}`
    });
  },

  /**
   * 开始选中的推荐
   */
  startSelectedRecommendation() {
    const { selectedRecommendation } = this.data;
    if (selectedRecommendation && !selectedRecommendation.completed) {
      this.closeRecommendDetail();
      wx.navigateTo({
        url: `/pages/practice/practice?recommendId=${selectedRecommendation.id}`
      });
    }
  },

  /**
   * 推迟推荐
   */
  postponeRecommendation(e) {
    const { recommendation } = e.currentTarget.dataset;
    
    // 模拟推迟推荐
    this.showToastMessage('已推迟到明天，AI将重新安排学习计划');
  },

  /**
   * 应用AI建议
   */
  applySuggestion(e) {
    const { suggestion } = e.currentTarget.dataset;
    
    // 根据建议类型跳转到对应页面
    switch (suggestion.id) {
      case 1:
        wx.navigateTo({
          url: '/pages/practice/practice?type=subject'
        });
        break;
      case 2:
        wx.navigateTo({
          url: '/pages/schedule/schedule'
        });
        break;
      case 3:
        wx.navigateTo({
          url: '/pages/goals/goals'
        });
        break;
      case 4:
        wx.navigateTo({
          url: '/pages/reading/reading'
        });
        break;
      case 5:
        wx.navigateTo({
          url: '/pages/review/review'
        });
        break;
      case 6:
        wx.navigateTo({
          url: '/pages/group-study/group-study'
        });
        break;
      default:
        this.showToastMessage('功能开发中，敬请期待');
    }
  },

  /**
   * 初始化图表
   */
  async initCharts() {
    // 这里可以初始化学习趋势图表
    // 由于小程序canvas较复杂，这里仅做占位
    return Promise.resolve();
  },

  /**
   * 显示Toast消息
   */
  showToastMessage(message) {
    this.setData({
      showToast: true,
      toastMessage: message
    });
  },

  /**
   * 关闭Toast
   */
  onToastClose() {
    this.setData({ showToast: false });
  }
});