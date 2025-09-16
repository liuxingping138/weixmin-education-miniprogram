// pages/mistakes/mistakes.js
const app = getApp();
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');

Page({
  data: {
    loading: true,
    isEmpty: false,
    activeTab: 'list',
    
    // 错题统计
    mistakeStats: {
      totalCount: 0,
      reviewedCount: 0,
      masteredCount: 0
    },
    
    // 筛选器
    subjectFilter: [
      { id: 'all', name: '全部学科' },
      { id: 'math', name: '数学' },
      { id: 'chinese', name: '语文' },
      { id: 'english', name: '英语' },
      { id: 'physics', name: '物理' },
      { id: 'chemistry', name: '化学' }
    ],
    selectedSubjectFilter: 0,
    statusFilter: [
      { id: 'all', name: '全部状态' },
      { id: 'new', name: '新错题' },
      { id: 'reviewing', name: '复习中' },
      { id: 'mastered', name: '已掌握' }
    ],
    selectedStatusFilter: 0,
    sortOptions: [
      { id: 'time_desc', name: '最新错误' },
      { id: 'time_asc', name: '最早错误' },
      { id: 'error_count_desc', name: '错误次数多' },
      { id: 'difficulty_desc', name: '难度高' }
    ],
    selectedSort: 0,
    
    // 错题列表
    mistakesList: [],
    hasMoreMistakes: true,
    loadingMore: false,
    
    // 错题分析
    subjectDistribution: [],
    weakKnowledgePoints: [],
    trendData: {
      weekCount: 0,
      weekChange: 0
    },
    
    // 复习计划
    reviewStats: {
      todayCount: 0,
      todayProgress: 0,
      weekCount: 0,
      weekTarget: 100
    },
    reviewPlans: [],
    
    // 专项练习
    subjects: [
      { id: 'math', name: '数学' },
      { id: 'chinese', name: '语文' },
      { id: 'english', name: '英语' },
      { id: 'physics', name: '物理' },
      { id: 'chemistry', name: '化学' }
    ],
    practiceModes: [
      {
        id: 'quick',
        name: '快速练习',
        description: '随机选择10道错题进行快速复习',
        questionCount: 10,
        difficulty: '混合'
      },
      {
        id: 'intensive',
        name: '强化练习',
        description: '针对薄弱知识点进行强化训练',
        questionCount: 20,
        difficulty: '中等'
      },
      {
        id: 'weak',
        name: '薄弱专练',
        description: '专门练习掌握度低的知识点',
        questionCount: 15,
        difficulty: '困难'
      },
      {
        id: 'random',
        name: '随机练习',
        description: '随机抽取各学科错题进行练习',
        questionCount: 25,
        difficulty: '混合'
      }
    ],
    selectedPracticeSubjects: [],
    practiceQuestionCount: 20,
    practiceRanges: [
      { id: 'recent', name: '最近错题' },
      { id: 'frequent', name: '高频错题' },
      { id: 'unmastered', name: '未掌握' },
      { id: 'all', name: '全部错题' }
    ],
    selectedPracticeRange: 'recent',
    
    // 创建复习计划弹窗
    showCreatePlanDialog: false,
    newPlan: {
      title: '',
      dateTime: [0, 0, 0],
      dateTimeText: '请选择时间',
      questionCount: 20
    },
    dateTimeRange: [
      ['今天', '明天', '后天'],
      ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'],
      ['00', '15', '30', '45']
    ]
  },

  // 页面加载
  onLoad(options) {
    this.loadInitialData();
  },

  // 页面显示
  onShow() {
    // 刷新统计数据
    this.loadMistakeStats();
  },

  // 页面就绪
  onReady() {
    // 初始化图表
    if (this.data.activeTab === 'analysis') {
      this.initCharts();
    }
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.refreshData().finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  // 上拉加载
  onReachBottom() {
    if (this.data.activeTab === 'list' && this.data.hasMoreMistakes) {
      this.loadMoreMistakes();
    }
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '错题本 - 智能分析错题',
      path: '/pages/mistakes/mistakes'
    };
  },

  // 加载初始数据
  async loadInitialData() {
    try {
      this.setData({ loading: true });
      
      await Promise.all([
        this.loadMistakeStats(),
        this.loadMistakesList()
      ]);
      
      this.setData({ 
        loading: false,
        isEmpty: this.checkIfEmpty()
      });
    } catch (error) {
      console.error('加载初始数据失败:', error);
      this.setData({ loading: false });
      this.showToast('加载数据失败，请重试');
    }
  },

  // 刷新数据
  async refreshData() {
    try {
      await this.loadInitialData();
      this.showToast('刷新成功');
    } catch (error) {
      console.error('刷新数据失败:', error);
      this.showToast('刷新失败，请重试');
    }
  },

  // 加载错题统计
  async loadMistakeStats() {
    try {
      const res = await api.homework.getWrongQuestions({
        type: 'stats'
      });
      
      if (res.code === 200) {
        this.setData({
          mistakeStats: {
            totalCount: res.data.totalCount || 0,
            reviewedCount: res.data.reviewedCount || 0,
            masteredCount: res.data.masteredCount || 0
          }
        });
      }
    } catch (error) {
      console.error('加载错题统计失败:', error);
    }
  },

  // 加载错题列表
  async loadMistakesList(loadMore = false) {
    try {
      if (loadMore) {
        this.setData({ loadingMore: true });
      }
      
      const subjectFilter = this.data.subjectFilter[this.data.selectedSubjectFilter];
      const statusFilter = this.data.statusFilter[this.data.selectedStatusFilter];
      const sortOption = this.data.sortOptions[this.data.selectedSort];
      
      const params = {
        page: loadMore ? Math.floor(this.data.mistakesList.length / 10) + 1 : 1,
        limit: 10,
        sort: sortOption.id
      };
      
      if (subjectFilter.id !== 'all') {
        params.subject = subjectFilter.id;
      }
      
      if (statusFilter.id !== 'all') {
        params.status = statusFilter.id;
      }
      
      const res = await api.homework.getWrongQuestions(params);
      
      if (res.code === 200) {
        const newMistakes = res.data.list.map(item => ({
          ...item,
          subjectName: this.getSubjectName(item.subject),
          statusText: this.getStatusText(item.status),
          difficultyText: this.getDifficultyText(item.difficulty),
          lastErrorTime: util.formatTime(item.lastErrorTime, 'MM-DD HH:mm')
        }));
        
        this.setData({
          mistakesList: loadMore ? 
            [...this.data.mistakesList, ...newMistakes] : 
            newMistakes,
          hasMoreMistakes: res.data.hasMore,
          loadingMore: false
        });
      }
    } catch (error) {
      console.error('加载错题列表失败:', error);
      this.setData({ loadingMore: false });
    }
  },

  // 加载错题分析数据
  async loadAnalysisData() {
    try {
      const [distributionRes, knowledgeRes, trendRes] = await Promise.all([
        api.homework.getAccuracyAnalysis({ type: 'subject_distribution' }),
        api.homework.getAccuracyAnalysis({ type: 'weak_knowledge' }),
        api.homework.getAccuracyAnalysis({ type: 'trend', timeRange: 'month' })
      ]);
      
      if (distributionRes.code === 200) {
        const distribution = distributionRes.data.subjects.map(item => ({
          ...item,
          subjectName: this.getSubjectName(item.subject),
          percentage: Math.round((item.count / distributionRes.data.total) * 100)
        }));
        this.setData({ subjectDistribution: distribution });
      }
      
      if (knowledgeRes.code === 200) {
        this.setData({ weakKnowledgePoints: knowledgeRes.data.points || [] });
      }
      
      if (trendRes.code === 200) {
        this.setData({ 
          trendData: {
            weekCount: trendRes.data.weekCount || 0,
            weekChange: trendRes.data.weekChange || 0
          }
        });
        this.drawTrendChart(trendRes.data.chartData || []);
      }
    } catch (error) {
      console.error('加载分析数据失败:', error);
    }
  },

  // 加载复习计划数据
  async loadReviewData() {
    try {
      const [statsRes, plansRes] = await Promise.all([
        api.homework.getAccuracyAnalysis({ type: 'review_stats' }),
        api.homework.getWrongQuestions({ type: 'review_plans' })
      ]);
      
      if (statsRes.code === 200) {
        this.setData({ reviewStats: statsRes.data });
      }
      
      if (plansRes.code === 200) {
        const plans = plansRes.data.list.map(item => ({
          ...item,
          statusText: this.getPlanStatusText(item.status),
          reviewTime: util.formatTime(item.reviewTime, 'MM-DD HH:mm')
        }));
        this.setData({ reviewPlans: plans });
      }
    } catch (error) {
      console.error('加载复习数据失败:', error);
    }
  },

  // 切换标签页
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
    
    // 懒加载数据
    if (tab === 'analysis' && this.data.subjectDistribution.length === 0) {
      this.loadAnalysisData();
    } else if (tab === 'review' && this.data.reviewPlans.length === 0) {
      this.loadReviewData();
    }
  },

  // 筛选器变化
  onSubjectFilterChange(e) {
    const index = e.detail.value;
    this.setData({ selectedSubjectFilter: index });
    this.loadMistakesList();
  },

  onStatusFilterChange(e) {
    const index = e.detail.value;
    this.setData({ selectedStatusFilter: index });
    this.loadMistakesList();
  },

  onSortChange(e) {
    const index = e.detail.value;
    this.setData({ selectedSort: index });
    this.loadMistakesList();
  },

  // 查看错题详情
  viewMistakeDetail(e) {
    const mistake = e.currentTarget.dataset.mistake;
    
    wx.navigateTo({
      url: `/pages/mistakes/detail?id=${mistake.id}`
    });
  },

  // 预览图片
  previewImage(e) {
    const { src, urls } = e.currentTarget.dataset;
    
    wx.previewImage({
      current: src,
      urls: urls
    });
  },

  // 加入复习
  addToReview(e) {
    const id = e.currentTarget.dataset.id;
    
    // 阻止事件冒泡
    e.stopPropagation();
    
    this.showToast('已加入复习计划');
  },

  // 再次练习
  practiceAgain(e) {
    const id = e.currentTarget.dataset.id;
    
    // 阻止事件冒泡
    e.stopPropagation();
    
    wx.navigateTo({
      url: `/pages/practice/exercise?mistakeId=${id}&type=retry`
    });
  },

  // 加载更多错题
  loadMoreMistakes() {
    if (!this.data.loadingMore && this.data.hasMoreMistakes) {
      this.loadMistakesList(true);
    }
  },

  // 练习知识点
  practiceKnowledgePoint(e) {
    const point = e.currentTarget.dataset.point;
    
    wx.navigateTo({
      url: `/pages/practice/exercise?knowledgePoint=${point.id}&type=knowledge`
    });
  },

  // 图表相关方法
  initCharts() {
    // 初始化图表
    setTimeout(() => {
      this.loadAnalysisData();
    }, 100);
  },

  drawTrendChart(data) {
    // 绘制趋势图表
    const ctx = wx.createCanvasContext('trendChart', this);
    
    // 简单的折线图绘制逻辑
    ctx.setStrokeStyle('#e74c3c');
    ctx.setLineWidth(3);
    
    if (data && data.length > 0) {
      const width = 690; // canvas宽度
      const height = 400; // canvas高度
      const padding = 50;
      
      const chartWidth = width - padding * 2;
      const chartHeight = height - padding * 2;
      
      // 绘制数据点和连线
      data.forEach((point, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth;
        const y = padding + (1 - point.value / Math.max(...data.map(d => d.value))) * chartHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
    }
    
    ctx.draw();
  },

  // 图表触摸事件
  onChartTouchStart(e) {
    // 处理图表触摸开始
  },

  onChartTouchMove(e) {
    // 处理图表触摸移动
  },

  onChartTouchEnd(e) {
    // 处理图表触摸结束
  },

  // 复习计划相关方法
  startReview(e) {
    const plan = e.currentTarget.dataset.plan;
    
    wx.navigateTo({
      url: `/pages/practice/review?planId=${plan.id}`
    });
  },

  continueReview(e) {
    const plan = e.currentTarget.dataset.plan;
    
    wx.navigateTo({
      url: `/pages/practice/review?planId=${plan.id}&continue=true`
    });
  },

  viewReviewResult(e) {
    const plan = e.currentTarget.dataset.plan;
    
    wx.navigateTo({
      url: `/pages/practice/result?planId=${plan.id}`
    });
  },

  // 显示创建计划弹窗
  showCreatePlanDialog() {
    this.setData({ showCreatePlanDialog: true });
  },

  // 隐藏创建计划弹窗
  hideCreatePlanDialog() {
    this.setData({ 
      showCreatePlanDialog: false,
      newPlan: {
        title: '',
        dateTime: [0, 0, 0],
        dateTimeText: '请选择时间',
        questionCount: 20
      }
    });
  },

  // 弹窗显示状态变化
  onCreatePlanDialogChange(e) {
    this.setData({ showCreatePlanDialog: e.detail.visible });
  },

  // 计划标题输入
  onPlanTitleInput(e) {
    this.setData({
      'newPlan.title': e.detail.value
    });
  },

  // 计划时间选择
  onPlanDateTimeChange(e) {
    const dateTime = e.detail.value;
    const dateTimeRange = this.data.dateTimeRange;
    const dateTimeText = `${dateTimeRange[0][dateTime[0]]} ${dateTimeRange[1][dateTime[1]]}:${dateTimeRange[2][dateTime[2]]}`;
    
    this.setData({
      'newPlan.dateTime': dateTime,
      'newPlan.dateTimeText': dateTimeText
    });
  },

  // 选择新计划题目数量
  selectNewPlanQuestionCount(e) {
    const count = e.currentTarget.dataset.count;
    this.setData({
      'newPlan.questionCount': count
    });
  },

  // 创建复习计划
  async createReviewPlan() {
    const { title, dateTime, questionCount } = this.data.newPlan;
    
    if (!title.trim()) {
      this.showToast('请输入计划名称');
      return;
    }
    
    try {
      const res = await api.homework.createHomework({
        type: 'review_plan',
        title: title.trim(),
        reviewTime: this.formatPlanDateTime(dateTime),
        questionCount: questionCount
      });
      
      if (res.code === 200) {
        this.showToast('创建成功');
        this.hideCreatePlanDialog();
        this.loadReviewData();
      } else {
        this.showToast(res.message || '创建失败');
      }
    } catch (error) {
      console.error('创建复习计划失败:', error);
      this.showToast('创建失败，请重试');
    }
  },

  // 专项练习相关方法
  selectPracticeMode(e) {
    const mode = e.currentTarget.dataset.mode;
    
    wx.navigateTo({
      url: `/pages/practice/exercise?mode=${mode.id}&type=mistake`
    });
  },

  togglePracticeSubject(e) {
    const subjectId = e.currentTarget.dataset.subject;
    const selectedSubjects = [...this.data.selectedPracticeSubjects];
    
    const index = selectedSubjects.indexOf(subjectId);
    if (index > -1) {
      selectedSubjects.splice(index, 1);
    } else {
      selectedSubjects.push(subjectId);
    }
    
    this.setData({ selectedPracticeSubjects: selectedSubjects });
  },

  selectPracticeQuestionCount(e) {
    const count = e.currentTarget.dataset.count;
    this.setData({ practiceQuestionCount: count });
  },

  selectPracticeRange(e) {
    const range = e.currentTarget.dataset.range;
    this.setData({ selectedPracticeRange: range });
  },

  startCustomPractice() {
    if (this.data.selectedPracticeSubjects.length === 0) {
      this.showToast('请选择至少一个学科');
      return;
    }
    
    const params = {
      subjects: this.data.selectedPracticeSubjects.join(','),
      questionCount: this.data.practiceQuestionCount,
      range: this.data.selectedPracticeRange,
      type: 'custom_mistake'
    };
    
    const queryString = Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    wx.navigateTo({
      url: `/pages/practice/exercise?${queryString}`
    });
  },

  // 工具方法
  getSubjectName(subjectId) {
    const subject = this.data.subjects.find(s => s.id === subjectId);
    return subject ? subject.name : subjectId;
  },

  getStatusText(status) {
    const statusMap = {
      new: '新错题',
      reviewing: '复习中',
      mastered: '已掌握'
    };
    return statusMap[status] || status;
  },

  getDifficultyText(difficulty) {
    const difficultyMap = {
      easy: '简单',
      medium: '中等',
      hard: '困难'
    };
    return difficultyMap[difficulty] || difficulty;
  },

  getPlanStatusText(status) {
    const statusMap = {
      pending: '待开始',
      in_progress: '进行中',
      completed: '已完成'
    };
    return statusMap[status] || status;
  },

  formatPlanDateTime(dateTime) {
    const dateTimeRange = this.data.dateTimeRange;
    const date = new Date();
    
    // 根据选择的日期调整
    date.setDate(date.getDate() + dateTime[0]);
    
    // 设置时间
    const hour = parseInt(dateTimeRange[1][dateTime[1]].split(':')[0]);
    const minute = parseInt(dateTimeRange[2][dateTime[2]]);
    date.setHours(hour, minute, 0, 0);
    
    return date.toISOString();
  },

  checkIfEmpty() {
    const { activeTab, mistakesList, subjectDistribution, reviewPlans } = this.data;
    
    switch (activeTab) {
      case 'list':
        return mistakesList.length === 0;
      case 'analysis':
        return subjectDistribution.length === 0;
      case 'review':
        return reviewPlans.length === 0;
      default:
        return false;
    }
  },

  showToast(message, icon = 'none') {
    this.selectComponent('#t-toast').showToast({
      theme: icon,
      message: message,
      duration: 2000
    });
  }
});