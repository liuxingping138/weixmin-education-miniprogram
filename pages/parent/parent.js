// pages/parent/parent.js
Page({
  data: {
    // 加载状态
    loading: true,
    isEmpty: false,
    
    // 当前标签页
    activeTab: 'report',
    
    // 家校互动统计数据
    parentStats: {
      reports: 12,
      messages: 8,
      activities: 5
    },
    
    // 学生列表
    students: [
      {
        id: 1,
        name: '小明',
        avatar: '/images/avatar1.png',
        className: '三年级一班',
        studentId: '2021001'
      },
      {
        id: 2,
        name: '小红',
        avatar: '/images/avatar2.png',
        className: '一年级二班',
        studentId: '2023002'
      }
    ],
    
    // 报告相关数据
    selectedStudent: null,
    selectedReportType: null,
    selectedTimeRange: null,
    generatingReport: false,
    canGenerateReport: false,
    
    // 报告类型
    reportTypes: [
      {
        id: 'weekly',
        name: '周报告',
        description: '本周学习情况总结',
        icon: '📊'
      },
      {
        id: 'monthly',
        name: '月报告',
        description: '本月学习进展分析',
        icon: '📈'
      },
      {
        id: 'semester',
        name: '学期报告',
        description: '学期综合评估报告',
        icon: '📋'
      }
    ],
    
    // 时间范围
    timeRanges: [
      { id: 'week', name: '最近一周' },
      { id: 'month', name: '最近一月' },
      { id: 'quarter', name: '最近三月' },
      { id: 'semester', name: '本学期' }
    ],
    
    // 历史报告
    reportHistory: [
      {
        id: 1,
        title: '小明周学习报告',
        type: 'weekly',
        typeIcon: '📊',
        typeName: '周报告',
        studentName: '小明',
        createTime: '2024-01-15 14:30',
        timeRange: '2024.01.08 - 2024.01.14',
        pages: 5,
        preview: '/images/report-preview1.png'
      },
      {
        id: 2,
        title: '小红月学习报告',
        type: 'monthly',
        typeIcon: '📈',
        typeName: '月报告',
        studentName: '小红',
        createTime: '2024-01-10 16:20',
        timeRange: '2023.12.01 - 2023.12.31',
        pages: 12,
        preview: '/images/report-preview2.png'
      }
    ],
    
    // 学生档案
    studentArchives: [
      {
        id: 1,
        name: '小明',
        avatar: '/images/avatar1.png',
        className: '三年级一班',
        studentId: '2021001',
        totalPoints: 2580,
        completedHomework: 156,
        averageScore: 92.5,
        classRank: 3,
        learningProgress: 85,
        schoolDays: 128,
        rewards: 15,
        activities: 8,
        highlights: [
          '数学竞赛获得二等奖',
          '连续三周作业全对',
          '主动帮助同学解答问题',
          '课堂发言积极主动'
        ]
      },
      {
        id: 2,
        name: '小红',
        avatar: '/images/avatar2.png',
        className: '一年级二班',
        studentId: '2023002',
        totalPoints: 1890,
        completedHomework: 89,
        averageScore: 88.2,
        classRank: 5,
        learningProgress: 78,
        schoolDays: 95,
        rewards: 12,
        activities: 6,
        highlights: [
          '语文朗读比赛第一名',
          '书写工整获得表扬',
          '乐于助人品德优秀',
          '学习态度认真端正'
        ]
      }
    ],
    
    // 成长记录相关
    selectedRecordType: 'all',
    recordTypes: [
      { id: 'all', name: '全部' },
      { id: 'achievement', name: '成就' },
      { id: 'activity', name: '活动' },
      { id: 'homework', name: '作业' }
    ],
    
    // 成长记录数据
    growthRecords: [
      {
        id: 1,
        type: 'achievement',
        title: '数学竞赛获奖',
        description: '在校级数学竞赛中获得二等奖，表现优异',
        time: '2024-01-12',
        images: ['/images/award1.png', '/images/award2.png']
      },
      {
        id: 2,
        type: 'activity',
        title: '参加科技节',
        description: '积极参与学校科技节活动，制作了精美的科技作品',
        time: '2024-01-08',
        images: ['/images/tech1.png']
      },
      {
        id: 3,
        type: 'homework',
        title: '作业质量提升',
        description: '最近两周作业完成质量显著提升，字迹工整',
        time: '2024-01-05',
        images: []
      }
    ],
    
    // 家校沟通相关
    unreadTeacherMessages: 2,
    unreadGroupMessages: 5,
    unreadNotifications: 1,
    
    // 最近消息
    recentMessages: [
      {
        id: 1,
        type: 'teacher',
        typeIcon: '👩‍🏫',
        senderName: '张老师',
        senderAvatar: '/images/teacher1.png',
        preview: '小明这周数学作业完成得很好，继续保持',
        time: '10:30',
        unread: true,
        attachments: 0
      },
      {
        id: 2,
        type: 'group',
        typeIcon: '👥',
        senderName: '班级群',
        senderAvatar: '/images/class-group.png',
        preview: '明天下午有家长会，请各位家长准时参加',
        time: '昨天',
        unread: true,
        attachments: 1
      },
      {
        id: 3,
        type: 'notice',
        typeIcon: '📢',
        senderName: '学校通知',
        senderAvatar: '/images/school-logo.png',
        preview: '关于寒假放假时间安排的通知',
        time: '2天前',
        unread: false,
        attachments: 2
      }
    ],
    
    // 弹窗状态
    showToast: false,
    toastMessage: '',
    showReportDetail: false,
    selectedReport: null,
    showArchiveDetail: false,
    selectedStudentArchive: null
  },

  // 计算属性
  get filteredRecords() {
    const { growthRecords, selectedRecordType } = this.data;
    if (selectedRecordType === 'all') {
      return growthRecords;
    }
    return growthRecords.filter(record => record.type === selectedRecordType);
  },

  // 页面生命周期
  onLoad(options) {
    console.log('家校互动页面加载', options);
    this.loadPageData();
  },

  onShow() {
    console.log('家校互动页面显示');
    this.refreshData();
  },

  onReady() {
    console.log('家校互动页面渲染完成');
  },

  onHide() {
    console.log('家校互动页面隐藏');
  },

  onUnload() {
    console.log('家校互动页面卸载');
  },

  // 下拉刷新
  onPullDownRefresh() {
    console.log('下拉刷新');
    this.refreshData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  // 上拉加载更多
  onReachBottom() {
    console.log('上拉加载更多');
    this.loadMoreData();
  },

  // 页面分享
  onShareAppMessage() {
    return {
      title: '家校互动平台 - 共同关注孩子成长',
      path: '/pages/parent/parent',
      imageUrl: '/images/share-parent.png'
    };
  },

  // 数据加载
  async loadPageData() {
    try {
      this.setData({ loading: true });
      
      // 模拟加载数据
      await Promise.all([
        this.loadParentStats(),
        this.loadStudents(),
        this.loadReportHistory(),
        this.loadStudentArchives(),
        this.loadGrowthRecords(),
        this.loadRecentMessages()
      ]);
      
      this.setData({ 
        loading: false,
        isEmpty: false
      });
      
    } catch (error) {
      console.error('加载页面数据失败:', error);
      this.showToastMessage('加载数据失败，请重试');
      this.setData({ 
        loading: false,
        isEmpty: true
      });
    }
  },

  // 刷新数据
  async refreshData() {
    try {
      await this.loadPageData();
      this.showToastMessage('刷新成功');
    } catch (error) {
      console.error('刷新数据失败:', error);
      this.showToastMessage('刷新失败，请重试');
    }
  },

  // 加载更多数据
  async loadMoreData() {
    try {
      // 根据当前标签页加载对应的更多数据
      const { activeTab } = this.data;
      
      switch (activeTab) {
        case 'report':
          await this.loadMoreReports();
          break;
        case 'archive':
          await this.loadMoreRecords();
          break;
        case 'communication':
          await this.loadMoreMessages();
          break;
      }
      
    } catch (error) {
      console.error('加载更多数据失败:', error);
      this.showToastMessage('加载失败，请重试');
    }
  },

  // 加载统计数据
  async loadParentStats() {
    // 模拟API调用
    return new Promise(resolve => {
      setTimeout(() => {
        this.setData({
          parentStats: {
            reports: 12,
            messages: 8,
            activities: 5
          }
        });
        resolve();
      }, 500);
    });
  },

  // 加载学生列表
  async loadStudents() {
    // 模拟API调用
    return new Promise(resolve => {
      setTimeout(() => {
        // 数据已在data中定义
        resolve();
      }, 300);
    });
  },

  // 加载报告历史
  async loadReportHistory() {
    // 模拟API调用
    return new Promise(resolve => {
      setTimeout(() => {
        // 数据已在data中定义
        resolve();
      }, 400);
    });
  },

  // 加载学生档案
  async loadStudentArchives() {
    // 模拟API调用
    return new Promise(resolve => {
      setTimeout(() => {
        // 数据已在data中定义
        resolve();
      }, 600);
    });
  },

  // 加载成长记录
  async loadGrowthRecords() {
    // 模拟API调用
    return new Promise(resolve => {
      setTimeout(() => {
        // 数据已在data中定义
        this.updateFilteredRecords();
        resolve();
      }, 500);
    });
  },

  // 加载最近消息
  async loadRecentMessages() {
    // 模拟API调用
    return new Promise(resolve => {
      setTimeout(() => {
        // 数据已在data中定义
        resolve();
      }, 400);
    });
  },

  // 加载更多报告
  async loadMoreReports() {
    // 模拟API调用
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('加载更多报告');
        resolve();
      }, 1000);
    });
  },

  // 加载更多记录
  async loadMoreRecords() {
    // 模拟API调用
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('加载更多记录');
        resolve();
      }, 1000);
    });
  },

  // 加载更多消息
  async loadMoreMessages() {
    // 模拟API调用
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('加载更多消息');
        resolve();
      }, 1000);
    });
  },

  // 标签页切换
  switchTab(e) {
    const { tab } = e.currentTarget.dataset;
    console.log('切换标签页:', tab);
    
    this.setData({ activeTab: tab });
    
    // 根据标签页加载对应数据
    switch (tab) {
      case 'report':
        this.loadReportData();
        break;
      case 'archive':
        this.loadArchiveData();
        break;
      case 'communication':
        this.loadCommunicationData();
        break;
    }
  },

  // 加载报告数据
  async loadReportData() {
    try {
      await this.loadReportHistory();
    } catch (error) {
      console.error('加载报告数据失败:', error);
    }
  },

  // 加载档案数据
  async loadArchiveData() {
    try {
      await Promise.all([
        this.loadStudentArchives(),
        this.loadGrowthRecords()
      ]);
    } catch (error) {
      console.error('加载档案数据失败:', error);
    }
  },

  // 加载沟通数据
  async loadCommunicationData() {
    try {
      await this.loadRecentMessages();
    } catch (error) {
      console.error('加载沟通数据失败:', error);
    }
  },

  // 学生选择
  selectStudent(e) {
    const { student } = e.currentTarget.dataset;
    console.log('选择学生:', student);
    
    this.setData({ selectedStudent: student });
    this.checkCanGenerateReport();
  },

  // 报告类型选择
  selectReportType(e) {
    const { type } = e.currentTarget.dataset;
    console.log('选择报告类型:', type);
    
    this.setData({ selectedReportType: type });
    this.checkCanGenerateReport();
  },

  // 时间范围选择
  selectTimeRange(e) {
    const { range } = e.currentTarget.dataset;
    console.log('选择时间范围:', range);
    
    this.setData({ selectedTimeRange: range });
    this.checkCanGenerateReport();
  },

  // 检查是否可以生成报告
  checkCanGenerateReport() {
    const { selectedStudent, selectedReportType, selectedTimeRange } = this.data;
    const canGenerate = selectedStudent && selectedReportType && selectedTimeRange;
    
    this.setData({ canGenerateReport: canGenerate });
  },

  // 生成报告
  async generateReport() {
    const { selectedStudent, selectedReportType, selectedTimeRange } = this.data;
    
    if (!selectedStudent || !selectedReportType || !selectedTimeRange) {
      this.showToastMessage('请完善报告配置');
      return;
    }
    
    try {
      this.setData({ generatingReport: true });
      
      // 模拟生成报告
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 添加到历史记录
      const newReport = {
        id: Date.now(),
        title: `${this.getStudentName(selectedStudent)}${this.getReportTypeName(selectedReportType)}`,
        type: selectedReportType,
        typeIcon: this.getReportTypeIcon(selectedReportType),
        typeName: this.getReportTypeName(selectedReportType),
        studentName: this.getStudentName(selectedStudent),
        createTime: this.formatDateTime(new Date()),
        timeRange: this.getTimeRangeText(selectedTimeRange),
        pages: Math.floor(Math.random() * 10) + 5,
        preview: '/images/report-preview-new.png'
      };
      
      const reportHistory = [newReport, ...this.data.reportHistory];
      this.setData({ reportHistory });
      
      this.showToastMessage('报告生成成功');
      
      // 重置选择
      this.setData({
        selectedStudent: null,
        selectedReportType: null,
        selectedTimeRange: null,
        canGenerateReport: false
      });
      
    } catch (error) {
      console.error('生成报告失败:', error);
      this.showToastMessage('生成报告失败，请重试');
    } finally {
      this.setData({ generatingReport: false });
    }
  },

  // 查看报告
  viewReport(e) {
    const { report } = e.currentTarget.dataset;
    console.log('查看报告:', report);
    
    this.setData({
      selectedReport: report,
      showReportDetail: true
    });
  },

  // 下载报告
  downloadReport(e) {
    const { report } = e.currentTarget.dataset;
    console.log('下载报告:', report);
    
    // 模拟下载
    wx.showLoading({ title: '下载中...' });
    
    setTimeout(() => {
      wx.hideLoading();
      this.showToastMessage('下载完成');
    }, 2000);
  },

  // 分享报告
  shareReport(e) {
    const { report } = e.currentTarget.dataset;
    console.log('分享报告:', report);
    
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    
    this.showToastMessage('请选择分享方式');
  },

  // 导出档案
  exportArchive() {
    console.log('导出档案');
    
    wx.showLoading({ title: '导出中...' });
    
    setTimeout(() => {
      wx.hideLoading();
      this.showToastMessage('导出完成');
    }, 3000);
  },

  // 查看学生档案
  viewStudentArchive(e) {
    const { student } = e.currentTarget.dataset;
    console.log('查看学生档案:', student);
    
    this.setData({
      selectedStudentArchive: student,
      showArchiveDetail: true
    });
  },

  // 记录类型选择
  selectRecordType(e) {
    const { type } = e.currentTarget.dataset;
    console.log('选择记录类型:', type);
    
    this.setData({ selectedRecordType: type });
    this.updateFilteredRecords();
  },

  // 更新过滤后的记录
  updateFilteredRecords() {
    const { growthRecords, selectedRecordType } = this.data;
    let filteredRecords = growthRecords;
    
    if (selectedRecordType !== 'all') {
      filteredRecords = growthRecords.filter(record => record.type === selectedRecordType);
    }
    
    this.setData({ filteredRecords });
  },

  // 预览图片
  previewImages(e) {
    const { images, current } = e.currentTarget.dataset;
    
    wx.previewImage({
      urls: images,
      current: images[current]
    });
  },

  // 沟通功能
  openTeacherChat() {
    console.log('打开老师私聊');
    wx.navigateTo({
      url: '/pages/chat/chat?type=teacher'
    });
  },

  openClassGroup() {
    console.log('打开班级群聊');
    wx.navigateTo({
      url: '/pages/chat/chat?type=group'
    });
  },

  openNotifications() {
    console.log('打开通知公告');
    wx.navigateTo({
      url: '/pages/notifications/notifications'
    });
  },

  openFeedback() {
    console.log('打开意见反馈');
    wx.navigateTo({
      url: '/pages/feedback/feedback'
    });
  },

  // 查看全部消息
  viewAllMessages() {
    console.log('查看全部消息');
    wx.navigateTo({
      url: '/pages/messages/messages'
    });
  },

  // 打开消息
  openMessage(e) {
    const { message } = e.currentTarget.dataset;
    console.log('打开消息:', message);
    
    wx.navigateTo({
      url: `/pages/message-detail/message-detail?id=${message.id}`
    });
  },

  // 快捷操作
  requestLeave() {
    console.log('请假申请');
    wx.navigateTo({
      url: '/pages/leave/leave'
    });
  },

  scheduleParentMeeting() {
    console.log('预约家长会');
    wx.navigateTo({
      url: '/pages/parent-meeting/parent-meeting'
    });
  },

  reportIssue() {
    console.log('问题反馈');
    wx.navigateTo({
      url: '/pages/issue-report/issue-report'
    });
  },

  viewSchedule() {
    console.log('查看课程表');
    wx.navigateTo({
      url: '/pages/schedule/schedule'
    });
  },

  // 弹窗控制
  closeReportDetail() {
    this.setData({
      showReportDetail: false,
      selectedReport: null
    });
  },

  onReportDetailClose(e) {
    if (!e.detail.visible) {
      this.closeReportDetail();
    }
  },

  downloadSelectedReport() {
    const { selectedReport } = this.data;
    if (selectedReport) {
      this.downloadReport({ currentTarget: { dataset: { report: selectedReport } } });
      this.closeReportDetail();
    }
  },

  shareSelectedReport() {
    const { selectedReport } = this.data;
    if (selectedReport) {
      this.shareReport({ currentTarget: { dataset: { report: selectedReport } } });
      this.closeReportDetail();
    }
  },

  closeArchiveDetail() {
    this.setData({
      showArchiveDetail: false,
      selectedStudentArchive: null
    });
  },

  onArchiveDetailClose(e) {
    if (!e.detail.visible) {
      this.closeArchiveDetail();
    }
  },

  exportSelectedArchive() {
    const { selectedStudentArchive } = this.data;
    if (selectedStudentArchive) {
      console.log('导出选中学生档案:', selectedStudentArchive.name);
      this.exportArchive();
      this.closeArchiveDetail();
    }
  },

  shareSelectedArchive() {
    const { selectedStudentArchive } = this.data;
    if (selectedStudentArchive) {
      console.log('分享选中学生档案:', selectedStudentArchive.name);
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      });
      this.showToastMessage('请选择分享方式');
      this.closeArchiveDetail();
    }
  },

  // Toast提示
  showToastMessage(message) {
    this.setData({
      showToast: true,
      toastMessage: message
    });
  },

  onToastClose() {
    this.setData({ showToast: false });
  },

  // 工具方法
  getStudentName(studentId) {
    const student = this.data.students.find(s => s.id === studentId);
    return student ? student.name : '未知学生';
  },

  getReportTypeName(typeId) {
    const type = this.data.reportTypes.find(t => t.id === typeId);
    return type ? type.name : '未知类型';
  },

  getReportTypeIcon(typeId) {
    const type = this.data.reportTypes.find(t => t.id === typeId);
    return type ? type.icon : '📋';
  },

  getTimeRangeText(rangeId) {
    const range = this.data.timeRanges.find(r => r.id === rangeId);
    if (!range) return '未知时间';
    
    const now = new Date();
    switch (rangeId) {
      case 'week':
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return `${this.formatDate(weekStart)} - ${this.formatDate(now)}`;
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        return `${this.formatDate(monthStart)} - ${this.formatDate(now)}`;
      case 'quarter':
        const quarterStart = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        return `${this.formatDate(quarterStart)} - ${this.formatDate(now)}`;
      case 'semester':
        const semesterStart = new Date(now.getFullYear(), 8, 1); // 9月1日
        return `${this.formatDate(semesterStart)} - ${this.formatDate(now)}`;
      default:
        return range.name;
    }
  },

  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  },

  formatDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}`;
  }
});