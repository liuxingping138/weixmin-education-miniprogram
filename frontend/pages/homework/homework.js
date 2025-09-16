// pages/homework/homework.js
Page({
  data: {
    // 页面状态
    loading: false,
    isEmpty: false,
    showToast: false,
    toastMessage: '',
    
    // 标签页状态
    activeTab: 'list', // list, mistakes, analysis
    
    // 作业统计数据
    homeworkStats: {
      total: 0,
      completed: 0,
      avgScore: 0,
      accuracy: 0
    },
    
    // 作业列表相关
    statusFilter: 'all', // all, pending, completed, overdue
    homeworkList: [],
    filteredHomework: [],
    
    // 错题本相关
    mistakeStats: {
      total: 0,
      mastered: 0,
      reviewing: 0
    },
    selectedSubject: 'all',
    subjects: [],
    mistakeList: [],
    filteredMistakes: [],
    
    // 学习分析相关
    knowledgePoints: [],
    suggestions: [],
    
    // 弹窗状态
    showHomeworkDetail: false,
    selectedHomework: null
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this.loadMoreData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '智慧校园 - 作业系统',
      path: '/pages/homework/homework'
    };
  },

  /**
   * 初始化页面
   */
  async initPage() {
    this.setData({ loading: true });
    
    try {
      await Promise.all([
        this.loadHomeworkStats(),
        this.loadHomeworkList(),
        this.loadMistakeStats(),
        this.loadMistakeList(),
        this.loadSubjects(),
        this.loadAnalysisData()
      ]);
      
      this.filterHomework();
      this.filterMistakes();
      
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
   * 加载更多数据
   */
  async loadMoreData() {
    // 根据当前标签页加载更多数据
    const { activeTab } = this.data;
    
    try {
      if (activeTab === 'list') {
        await this.loadMoreHomework();
      } else if (activeTab === 'mistakes') {
        await this.loadMoreMistakes();
      }
    } catch (error) {
      console.error('加载更多数据失败:', error);
    }
  },

  /**
   * 加载作业统计数据
   */
  async loadHomeworkStats() {
    // 模拟API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats = {
          total: 45,
          completed: 38,
          avgScore: 87,
          accuracy: 85
        };
        this.setData({ homeworkStats: stats });
        resolve(stats);
      }, 500);
    });
  },

  /**
   * 加载作业列表
   */
  async loadHomeworkList() {
    // 模拟API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        const homeworkList = [
          {
            id: 1,
            title: '数学第三章练习题',
            subject: '数学',
            questionCount: 20,
            deadline: '2024-01-15 23:59',
            status: 'pending',
            statusText: '待完成',
            description: '请认真完成第三章的所有练习题'
          },
          {
            id: 2,
            title: '语文阅读理解专项',
            subject: '语文',
            questionCount: 15,
            deadline: '2024-01-14 23:59',
            status: 'completed',
            statusText: '已完成',
            score: 85,
            totalScore: 100,
            accuracy: 85,
            description: '阅读理解能力提升练习'
          },
          {
            id: 3,
            title: '英语单词测试',
            subject: '英语',
            questionCount: 30,
            deadline: '2024-01-13 23:59',
            status: 'overdue',
            statusText: '已逾期',
            description: '第四单元单词测试'
          },
          {
            id: 4,
            title: '物理实验报告',
            subject: '物理',
            questionCount: 5,
            deadline: '2024-01-16 23:59',
            status: 'pending',
            statusText: '待完成',
            description: '光学实验报告撰写'
          },
          {
            id: 5,
            title: '化学方程式练习',
            subject: '化学',
            questionCount: 25,
            deadline: '2024-01-12 23:59',
            status: 'completed',
            statusText: '已完成',
            score: 92,
            totalScore: 100,
            accuracy: 92,
            description: '化学方程式配平练习'
          }
        ];
        
        this.setData({ 
          homeworkList,
          isEmpty: homeworkList.length === 0
        });
        resolve(homeworkList);
      }, 300);
    });
  },

  /**
   * 加载更多作业
   */
  async loadMoreHomework() {
    // 模拟加载更多作业数据
    return new Promise((resolve) => {
      setTimeout(() => {
        // 这里可以添加更多作业数据
        resolve([]);
      }, 500);
    });
  },

  /**
   * 加载错题统计
   */
  async loadMistakeStats() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats = {
          total: 156,
          mastered: 89,
          reviewing: 67
        };
        this.setData({ mistakeStats: stats });
        resolve(stats);
      }, 400);
    });
  },

  /**
   * 加载错题列表
   */
  async loadMistakeList() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mistakeList = [
          {
            id: 1,
            subject: '数学',
            subjectId: 'math',
            questionText: '求函数 f(x) = x² + 2x - 3 的最小值',
            mistakeCount: 3,
            lastMistakeTime: '2024-01-10',
            masteryLevel: 'weak',
            masteryText: '薄弱'
          },
          {
            id: 2,
            subject: '英语',
            subjectId: 'english',
            questionText: 'Choose the correct form: I ____ (go) to school yesterday.',
            mistakeCount: 2,
            lastMistakeTime: '2024-01-09',
            masteryLevel: 'reviewing',
            masteryText: '复习中'
          },
          {
            id: 3,
            subject: '物理',
            subjectId: 'physics',
            questionText: '一个物体从高度h自由落下，求落地时的速度',
            mistakeCount: 1,
            lastMistakeTime: '2024-01-08',
            masteryLevel: 'mastered',
            masteryText: '已掌握'
          },
          {
            id: 4,
            subject: '化学',
            subjectId: 'chemistry',
            questionText: '配平化学方程式：Al + HCl → AlCl₃ + H₂',
            mistakeCount: 4,
            lastMistakeTime: '2024-01-11',
            masteryLevel: 'weak',
            masteryText: '薄弱'
          }
        ];
        
        this.setData({ mistakeList });
        resolve(mistakeList);
      }, 350);
    });
  },

  /**
   * 加载更多错题
   */
  async loadMoreMistakes() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([]);
      }, 500);
    });
  },

  /**
   * 加载科目列表
   */
  async loadSubjects() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const subjects = [
          { id: 'math', name: '数学' },
          { id: 'chinese', name: '语文' },
          { id: 'english', name: '英语' },
          { id: 'physics', name: '物理' },
          { id: 'chemistry', name: '化学' },
          { id: 'biology', name: '生物' }
        ];
        
        this.setData({ subjects });
        resolve(subjects);
      }, 200);
    });
  },

  /**
   * 加载分析数据
   */
  async loadAnalysisData() {
    return Promise.all([
      this.loadKnowledgePoints(),
      this.loadSuggestions(),
      this.initCharts()
    ]);
  },

  /**
   * 加载知识点掌握情况
   */
  async loadKnowledgePoints() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const knowledgePoints = [
          {
            id: 1,
            name: '二次函数',
            subject: '数学',
            mastery: 65
          },
          {
            id: 2,
            name: '现在完成时',
            subject: '英语',
            mastery: 78
          },
          {
            id: 3,
            name: '牛顿定律',
            subject: '物理',
            mastery: 82
          },
          {
            id: 4,
            name: '化学平衡',
            subject: '化学',
            mastery: 58
          },
          {
            id: 5,
            name: '古诗词鉴赏',
            subject: '语文',
            mastery: 71
          }
        ];
        
        this.setData({ knowledgePoints });
        resolve(knowledgePoints);
      }, 300);
    });
  },

  /**
   * 加载学习建议
   */
  async loadSuggestions() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const suggestions = [
          {
            id: 1,
            icon: '📚',
            title: '加强数学基础练习',
            description: '建议多做二次函数相关题目，提高解题熟练度'
          },
          {
            id: 2,
            icon: '🔬',
            title: '复习化学平衡',
            description: '化学平衡是薄弱环节，建议重点复习相关概念'
          },
          {
            id: 3,
            icon: '📖',
            title: '增加英语阅读',
            description: '通过阅读提高语感，巩固语法知识'
          },
          {
            id: 4,
            icon: '✍️',
            title: '练习古诗词背诵',
            description: '加强古诗词的理解和记忆，提高文学素养'
          }
        ];
        
        this.setData({ suggestions });
        resolve(suggestions);
      }, 250);
    });
  },

  /**
   * 初始化图表
   */
  async initCharts() {
    // 这里可以初始化雷达图和趋势图
    // 由于小程序canvas较复杂，这里仅做占位
    return Promise.resolve();
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
   * 切换状态筛选
   */
  switchStatusFilter(e) {
    const { status } = e.currentTarget.dataset;
    this.setData({ statusFilter: status });
    this.filterHomework();
  },

  /**
   * 筛选作业列表
   */
  filterHomework() {
    const { homeworkList, statusFilter } = this.data;
    
    let filteredHomework = homeworkList;
    
    if (statusFilter !== 'all') {
      filteredHomework = homeworkList.filter(item => item.status === statusFilter);
    }
    
    this.setData({ filteredHomework });
  },

  /**
   * 选择科目
   */
  selectSubject(e) {
    const { subject } = e.currentTarget.dataset;
    this.setData({ selectedSubject: subject });
    this.filterMistakes();
  },

  /**
   * 筛选错题列表
   */
  filterMistakes() {
    const { mistakeList, selectedSubject } = this.data;
    
    let filteredMistakes = mistakeList;
    
    if (selectedSubject !== 'all') {
      filteredMistakes = mistakeList.filter(item => item.subjectId === selectedSubject);
    }
    
    this.setData({ filteredMistakes });
  },

  /**
   * 查看作业详情
   */
  viewHomeworkDetail(e) {
    const { homework } = e.currentTarget.dataset;
    this.setData({
      selectedHomework: homework,
      showHomeworkDetail: true
    });
  },

  /**
   * 关闭作业详情弹窗
   */
  closeHomeworkDetail() {
    this.setData({ showHomeworkDetail: false });
  },

  /**
   * 弹窗显示状态变化
   */
  onHomeworkDetailClose(e) {
    if (!e.detail.visible) {
      this.setData({ showHomeworkDetail: false });
    }
  },

  /**
   * 开始作业
   */
  startHomework(e) {
    const { homework } = e.currentTarget.dataset;
    
    // 跳转到作业答题页面
    wx.navigateTo({
      url: `/pages/homework-detail/homework-detail?id=${homework.id}`
    });
  },

  /**
   * 开始选中的作业
   */
  startSelectedHomework() {
    const { selectedHomework } = this.data;
    if (selectedHomework && selectedHomework.status === 'pending') {
      this.closeHomeworkDetail();
      wx.navigateTo({
        url: `/pages/homework-detail/homework-detail?id=${selectedHomework.id}`
      });
    }
  },

  /**
   * 查看作业结果
   */
  viewHomeworkResult(e) {
    const { homework } = e.currentTarget.dataset;
    
    wx.navigateTo({
      url: `/pages/homework-result/homework-result?id=${homework.id}`
    });
  },

  /**
   * 查看错题详情
   */
  viewMistakeDetail(e) {
    const { mistake } = e.currentTarget.dataset;
    
    wx.navigateTo({
      url: `/pages/mistake-detail/mistake-detail?id=${mistake.id}`
    });
  },

  /**
   * 再次练习错题
   */
  practiceAgain(e) {
    const { mistake } = e.currentTarget.dataset;
    
    wx.navigateTo({
      url: `/pages/practice/practice?mistakeId=${mistake.id}`
    });
  },

  /**
   * 查看错题解析
   */
  viewExplanation(e) {
    const { mistake } = e.currentTarget.dataset;
    
    wx.navigateTo({
      url: `/pages/explanation/explanation?mistakeId=${mistake.id}`
    });
  },

  /**
   * 知识点专项练习
   */
  practiceKnowledge(e) {
    const { knowledge } = e.currentTarget.dataset;
    
    wx.navigateTo({
      url: `/pages/practice/practice?knowledgeId=${knowledge.id}`
    });
  },

  /**
   * 应用学习建议
   */
  applySuggestion(e) {
    const { suggestion } = e.currentTarget.dataset;
    
    // 根据建议类型跳转到对应页面
    wx.navigateTo({
      url: `/pages/practice/practice?suggestionId=${suggestion.id}`
    });
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