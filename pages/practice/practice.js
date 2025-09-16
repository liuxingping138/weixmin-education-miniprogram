// pages/practice/practice.js
const app = getApp();
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');

Page({
  data: {
    loading: true,
    isEmpty: false,
    activeTab: 'recommend',
    
    // 练习统计
    practiceStats: {
      totalCount: 0,
      accuracy: 0,
      streak: 0
    },
    
    // AI推荐练习
    recommendReason: '',
    recommendPractices: [],
    
    // 学科练习
    subjects: [
      { id: 'math', name: '数学' },
      { id: 'chinese', name: '语文' },
      { id: 'english', name: '英语' },
      { id: 'physics', name: '物理' },
      { id: 'chemistry', name: '化学' }
    ],
    selectedSubject: '',
    knowledgePoints: [],
    selectedKnowledgePoints: [],
    
    // 练习设置
    questionCount: 20,
    difficulties: [
      { id: 'easy', name: '简单' },
      { id: 'medium', name: '中等' },
      { id: 'hard', name: '困难' }
    ],
    selectedDifficulty: 'medium',
    
    // 模拟考试
    examPapers: [],
    
    // 练习记录
    practiceHistory: [],
    timeRanges: [
      { id: 'week', name: '最近一周' },
      { id: 'month', name: '最近一月' },
      { id: 'quarter', name: '最近三月' },
      { id: 'all', name: '全部' }
    ],
    selectedTimeRange: 0,
    subjectFilter: [
      { id: 'all', name: '全部学科' },
      { id: 'math', name: '数学' },
      { id: 'chinese', name: '语文' },
      { id: 'english', name: '英语' },
      { id: 'physics', name: '物理' },
      { id: 'chemistry', name: '化学' }
    ],
    selectedSubjectFilter: 0,
    hasMoreHistory: true,
    loadingMore: false
  },

  // 页面加载
  onLoad(options) {
    this.loadInitialData();
  },

  // 页面显示
  onShow() {
    // 刷新统计数据
    this.loadPracticeStats();
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.refreshData().finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  // 上拉加载
  onReachBottom() {
    if (this.data.activeTab === 'history' && this.data.hasMoreHistory) {
      this.loadMoreHistory();
    }
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '智能练习 - AI个性化推荐',
      path: '/pages/practice/practice'
    };
  },

  // 加载初始数据
  async loadInitialData() {
    try {
      this.setData({ loading: true });
      
      await Promise.all([
        this.loadPracticeStats(),
        this.loadRecommendPractices(),
        this.loadExamPapers()
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

  // 加载练习统计
  async loadPracticeStats() {
    try {
      const res = await api.homework.getAccuracyAnalysis({
        type: 'practice',
        timeRange: 'month'
      });
      
      if (res.code === 200) {
        this.setData({
          practiceStats: {
            totalCount: res.data.totalCount || 0,
            accuracy: Math.round(res.data.accuracy || 0),
            streak: res.data.streak || 0
          }
        });
      }
    } catch (error) {
      console.error('加载练习统计失败:', error);
    }
  },

  // 加载AI推荐练习
  async loadRecommendPractices() {
    try {
      const res = await api.ai.getRecommendations({
        type: 'practice',
        limit: 5
      });
      
      if (res.code === 200) {
        const practices = res.data.practices.map(item => ({
          ...item,
          subjectName: this.getSubjectName(item.subject),
          difficultyText: this.getDifficultyText(item.difficulty)
        }));
        
        this.setData({
          recommendReason: res.data.reason || 'AI根据你的学习情况为你推荐以下练习',
          recommendPractices: practices
        });
      }
    } catch (error) {
      console.error('加载AI推荐练习失败:', error);
    }
  },

  // 加载模拟考试
  async loadExamPapers() {
    try {
      const res = await api.homework.getHomeworkList({
        type: 'exam',
        status: 'published',
        limit: 10
      });
      
      if (res.code === 200) {
        this.setData({
          examPapers: res.data.list || []
        });
      }
    } catch (error) {
      console.error('加载模拟考试失败:', error);
    }
  },

  // 加载练习记录
  async loadPracticeHistory(loadMore = false) {
    try {
      if (loadMore) {
        this.setData({ loadingMore: true });
      }
      
      const timeRange = this.data.timeRanges[this.data.selectedTimeRange];
      const subjectFilter = this.data.subjectFilter[this.data.selectedSubjectFilter];
      
      const params = {
        type: 'practice',
        timeRange: timeRange.id,
        page: loadMore ? Math.floor(this.data.practiceHistory.length / 10) + 1 : 1,
        limit: 10
      };
      
      if (subjectFilter.id !== 'all') {
        params.subject = subjectFilter.id;
      }
      
      const res = await api.homework.getSubmissions('practice', params);
      
      if (res.code === 200) {
        const newHistory = res.data.list.map(item => ({
          ...item,
          createTime: util.formatTime(item.createTime, 'MM-DD HH:mm'),
          subjectName: this.getSubjectName(item.subject),
          duration: this.formatDuration(item.duration)
        }));
        
        this.setData({
          practiceHistory: loadMore ? 
            [...this.data.practiceHistory, ...newHistory] : 
            newHistory,
          hasMoreHistory: res.data.hasMore,
          loadingMore: false
        });
      }
    } catch (error) {
      console.error('加载练习记录失败:', error);
      this.setData({ loadingMore: false });
    }
  },

  // 切换标签页
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
    
    // 懒加载数据
    if (tab === 'history' && this.data.practiceHistory.length === 0) {
      this.loadPracticeHistory();
    }
  },

  // 选择学科
  selectSubject(e) {
    const subjectId = e.currentTarget.dataset.subject;
    this.setData({ 
      selectedSubject: subjectId,
      selectedKnowledgePoints: []
    });
    this.loadKnowledgePoints(subjectId);
  },

  // 加载知识点
  async loadKnowledgePoints(subjectId) {
    try {
      const res = await api.ai.analyzeKnowledge({
        subject: subjectId,
        type: 'points'
      });
      
      if (res.code === 200) {
        const points = res.data.points.map(item => ({
          ...item,
          mastery: this.getMasteryLevel(item.masteryRate)
        }));
        
        this.setData({ knowledgePoints: points });
      }
    } catch (error) {
      console.error('加载知识点失败:', error);
      this.showToast('加载知识点失败');
    }
  },

  // 选择知识点
  selectKnowledgePoint(e) {
    const pointId = e.currentTarget.dataset.point;
    const selectedPoints = this.data.selectedKnowledgePoints;
    
    const index = selectedPoints.indexOf(pointId);
    if (index > -1) {
      selectedPoints.splice(index, 1);
    } else {
      selectedPoints.push(pointId);
    }
    
    this.setData({ selectedKnowledgePoints: selectedPoints });
  },

  // 选择题目数量
  selectQuestionCount(e) {
    const count = e.currentTarget.dataset.count;
    this.setData({ questionCount: count });
  },

  // 选择难度
  selectDifficulty(e) {
    const difficulty = e.currentTarget.dataset.difficulty;
    this.setData({ selectedDifficulty: difficulty });
  },

  // 开始推荐练习
  startPractice(e) {
    const practice = e.currentTarget.dataset.practice;
    
    wx.navigateTo({
      url: `/pages/practice/exercise?id=${practice.id}&type=recommend`
    });
  },

  // 开始自定义练习
  startCustomPractice() {
    if (this.data.selectedKnowledgePoints.length === 0) {
      this.showToast('请选择至少一个知识点');
      return;
    }
    
    const params = {
      subject: this.data.selectedSubject,
      knowledgePoints: this.data.selectedKnowledgePoints.join(','),
      questionCount: this.data.questionCount,
      difficulty: this.data.selectedDifficulty,
      type: 'custom'
    };
    
    const queryString = Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    wx.navigateTo({
      url: `/pages/practice/exercise?${queryString}`
    });
  },

  // 开始考试
  startExam(e) {
    const exam = e.currentTarget.dataset.exam;
    
    wx.navigateTo({
      url: `/pages/practice/exam?id=${exam.id}`
    });
  },

  // 查看练习详情
  viewPracticeDetail(e) {
    const practice = e.currentTarget.dataset.practice;
    
    wx.navigateTo({
      url: `/pages/practice/result?id=${practice.id}`
    });
  },

  // 时间范围变化
  onTimeRangeChange(e) {
    const index = e.detail.value;
    this.setData({ selectedTimeRange: index });
    this.loadPracticeHistory();
  },

  // 学科筛选变化
  onSubjectFilterChange(e) {
    const index = e.detail.value;
    this.setData({ selectedSubjectFilter: index });
    this.loadPracticeHistory();
  },

  // 加载更多历史记录
  loadMoreHistory() {
    if (!this.data.loadingMore && this.data.hasMoreHistory) {
      this.loadPracticeHistory(true);
    }
  },

  // 工具方法
  getSubjectName(subjectId) {
    const subject = this.data.subjects.find(s => s.id === subjectId);
    return subject ? subject.name : subjectId;
  },

  getDifficultyText(difficulty) {
    const difficultyMap = {
      easy: '简单',
      medium: '中等',
      hard: '困难'
    };
    return difficultyMap[difficulty] || difficulty;
  },

  getMasteryLevel(rate) {
    if (rate >= 80) return 'high';
    if (rate >= 60) return 'medium';
    return 'low';
  },

  formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}分${remainingSeconds}秒`;
  },

  checkIfEmpty() {
    const { activeTab, recommendPractices, examPapers, practiceHistory } = this.data;
    
    switch (activeTab) {
      case 'recommend':
        return recommendPractices.length === 0;
      case 'exam':
        return examPapers.length === 0;
      case 'history':
        return practiceHistory.length === 0;
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