// pages/class/class.js
const app = getApp();
const request = require('../../utils/request.js');
const mock = require('../../utils/mock.js');

Page({
  data: {
    // 班级信息
    classInfo: {
      id: '',
      name: '三年级一班',
      description: '积极向上的班级',
      studentCount: 0,
      avgScore: 0,
      completionRate: 0,
      avatar: '/images/class-avatar.png',
      teacherName: '',
      semester: '2024春季学期'
    },
    
    // 当前激活的标签页
    activeTab: 'students',
    
    // 学生相关数据
    students: [],
    filteredStudents: [],
    searchKeyword: '',
    selectedStudent: null,
    showStudentDetail: false,
    
    // 排行榜数据
    rankingType: 'points', // points, homework, attendance
    rankingList: [],
    
    // 小组对抗数据
    groupList: [],
    battleTimeLeft: '',
    battleEndTime: '',
    
    // 班级动态
    classActivities: [],
    
    // UI状态
    loading: false,
    isEmpty: false,
    showToast: false,
    toastMessage: '',
    refreshing: false
  },

  onLoad(options) {
    console.log('班级页面加载', options);
    
    // 获取班级ID
    const classId = options.classId || app.globalData.userInfo?.classId || 'class_001';
    this.setData({ 'classInfo.id': classId });
    this.loadClassData();
  },

  onShow() {
    // 刷新数据
    if (this.data.classInfo.id) {
      this.refreshCurrentTab();
    }
  },

  onPullDownRefresh() {
    this.setData({ refreshing: true });
    this.refreshCurrentTab().finally(() => {
      this.setData({ refreshing: false });
      wx.stopPullDownRefresh();
    });
  },

  onReachBottom() {
    // 加载更多数据
    this.loadMoreData();
  },

  // 加载班级基础数据
  async loadClassData() {
    try {
      this.setData({ loading: true });
      
      // 使用mock数据
      const classData = this.generateClassInfo();
      
      this.setData({
        classInfo: {
          ...this.data.classInfo,
          ...classData
        }
      });
      
      // 加载当前标签页数据
      await this.loadTabData(this.data.activeTab);
    } catch (error) {
      console.error('加载班级数据失败:', error);
      this.showToast(error.message || '加载失败');
    } finally {
      this.setData({ loading: false });
    }
  },

  // 生成班级信息
  generateClassInfo() {
    return {
      name: '三年级一班',
      description: '团结友爱，积极向上的优秀班级',
      studentCount: 42,
      avgScore: 87.5,
      completionRate: 92,
      teacherName: '张老师',
      semester: '2024春季学期',
      avatar: '/images/class-avatar.png'
    };
  },

  // 切换标签页
  async switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    if (tab === this.data.activeTab) return;
    
    this.setData({ activeTab: tab });
    await this.loadTabData(tab);
  },

  // 加载标签页数据
  async loadTabData(tab) {
    try {
      this.setData({ loading: true });
      
      switch (tab) {
        case 'students':
          await this.loadStudents();
          break;
        case 'ranking':
          await this.loadRanking();
          break;
        case 'groups':
          await this.loadGroups();
          break;
        case 'activities':
          await this.loadActivities();
          break;
      }
    } catch (error) {
      console.error(`加载${tab}数据失败:`, error);
      this.showToast(error.message || '加载失败');
    } finally {
      this.setData({ loading: false });
    }
  },

  // 加载学生列表
  async loadStudents() {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const students = [];
    for (let i = 1; i <= 42; i++) {
      students.push({
        id: `student_${i.toString().padStart(3, '0')}`,
        name: mock.generateName(),
        studentNumber: `2024${i.toString().padStart(3, '0')}`,
        avatar: mock.generateAvatar(),
        points: mock.generateNumber(200, 1000),
        rank: i,
        isOnline: Math.random() > 0.3,
        attendanceRate: mock.generateNumber(85, 100),
        homeworkRate: mock.generateNumber(80, 100),
        avgScore: mock.generateNumber(70, 100),
        level: mock.generateNumber(1, 10),
        badges: mock.generateArray(3, () => mock.generateBadge()),
        lastActiveTime: mock.generateRecentDate(),
        parentContact: mock.generatePhone(),
        subjects: ['数学', '语文', '英语', '科学']
      });
    }
    
    // 按积分排序
    students.sort((a, b) => b.points - a.points);
    students.forEach((student, index) => {
      student.rank = index + 1;
    });
    
    this.setData({
      students,
      filteredStudents: students,
      isEmpty: students.length === 0
    });
  },

  // 搜索学生
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

  // 查看学生详情
  viewStudentDetail(e) {
    const student = e.currentTarget.dataset.student;
    this.setData({
      selectedStudent: student,
      showStudentDetail: true
    });
  },

  // 关闭学生详情
  closeStudentDetail() {
    this.setData({ showStudentDetail: false });
  },

  onStudentDetailClose(e) {
    if (!e.detail.visible) {
      this.closeStudentDetail();
    }
  },

  // 发送消息给学生
  sendMessage(e) {
    e.stopPropagation();
    const student = e.currentTarget.dataset.student;
    
    wx.navigateTo({
      url: `/pages/chat/chat?userId=${student.id}&userName=${student.name}`
    });
  },

  // 联系家长
  contactParent(e) {
    const student = e.currentTarget.dataset.student;
    
    wx.showActionSheet({
      itemList: ['拨打电话', '发送短信'],
      success: (res) => {
        if (res.tapIndex === 0) {
          wx.makePhoneCall({
            phoneNumber: student.parentContact
          });
        } else if (res.tapIndex === 1) {
          // 发送短信逻辑
          this.showToast('短信功能开发中');
        }
      }
    });
  },

  // 查看学生报告
  viewStudentReport(e) {
    const student = e.currentTarget.dataset.student;
    
    wx.navigateTo({
      url: `/pages/student-report/student-report?studentId=${student.id}`
    });
  },

  // 奖励学生
  rewardStudent(e) {
    const student = e.currentTarget.dataset.student;
    
    wx.showActionSheet({
      itemList: ['奖励积分', '颁发徽章', '表扬信'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            this.showRewardPointsDialog(student);
            break;
          case 1:
            this.showRewardBadgeDialog(student);
            break;
          case 2:
            this.showPraiseLetterDialog(student);
            break;
        }
      }
    });
  },

  // 显示奖励积分对话框
  showRewardPointsDialog(student) {
    wx.showModal({
      title: '奖励积分',
      content: `为 ${student.name} 奖励多少积分？`,
      editable: true,
      placeholderText: '请输入积分数量',
      success: (res) => {
        if (res.confirm && res.content) {
          const points = parseInt(res.content);
          if (points > 0) {
            this.rewardPoints(student, points);
          }
        }
      }
    });
  },

  // 奖励积分
  async rewardPoints(student, points) {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 更新学生积分
      const students = this.data.students.map(s => {
        if (s.id === student.id) {
          return { ...s, points: s.points + points };
        }
        return s;
      });
      
      this.setData({ students });
      this.filterStudents();
      this.showToast(`成功为 ${student.name} 奖励 ${points} 积分`);
    } catch (error) {
      this.showToast('奖励失败，请重试');
    }
  },

  // 加载排行榜
  async loadRanking() {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let rankingList = [];
    const { rankingType } = this.data;
    
    // 基于排行榜类型生成数据
    for (let i = 1; i <= 20; i++) {
      let score;
      let unit;
      
      switch (rankingType) {
        case 'points':
          score = mock.generateNumber(500, 1000);
          unit = '分';
          break;
        case 'homework':
          score = mock.generateNumber(85, 100);
          unit = '%';
          break;
        case 'attendance':
          score = mock.generateNumber(20, 30);
          unit = '天';
          break;
      }
      
      rankingList.push({
        id: `student_${i.toString().padStart(3, '0')}`,
        name: mock.generateName(),
        avatar: mock.generateAvatar(),
        className: '三年级一班',
        score,
        unit,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        trendValue: mock.generateNumber(1, 5)
      });
    }
    
    // 按分数排序
    rankingList.sort((a, b) => b.score - a.score);
    
    this.setData({
      rankingList,
      isEmpty: rankingList.length === 0
    });
  },

  // 切换排行榜类型
  async switchRankingType(e) {
    const type = e.currentTarget.dataset.type;
    if (type === this.data.rankingType) return;
    
    this.setData({ rankingType: type });
    await this.loadRanking();
  },

  // 加载小组数据
  async loadGroups() {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const groupNames = ['雄鹰小组', '彩虹小组', '阳光小组', '星星小组', '月亮小组', '太阳小组'];
    const groupList = [];
    
    for (let i = 0; i < 6; i++) {
      const members = [];
      const memberCount = mock.generateNumber(6, 8);
      
      for (let j = 0; j < memberCount; j++) {
        members.push({
          id: `member_${i}_${j}`,
          name: mock.generateName(),
          avatar: mock.generateAvatar()
        });
      }
      
      const totalScore = mock.generateNumber(800, 1200);
      const maxScore = 1200;
      const progress = Math.round((totalScore / maxScore) * 100);
      
      groupList.push({
        id: `group_${i + 1}`,
        name: groupNames[i],
        members,
        totalScore,
        progress,
        rank: i + 1,
        weeklyGrowth: mock.generateNumber(-50, 100),
        achievements: mock.generateArray(mock.generateNumber(1, 3), () => mock.generateAchievement())
      });
    }
    
    // 按总分排序
    groupList.sort((a, b) => b.totalScore - a.totalScore);
    groupList.forEach((group, index) => {
      group.rank = index + 1;
    });
    
    // 设置对抗结束时间（本周日23:59）
    const now = new Date();
    const endTime = new Date(now);
    endTime.setDate(now.getDate() + (7 - now.getDay()));
    endTime.setHours(23, 59, 59, 999);
    
    this.setData({
      groupList,
      battleEndTime: endTime.toISOString(),
      battleTimeLeft: this.calculateTimeLeft(endTime.toISOString()),
      isEmpty: groupList.length === 0
    });
    
    // 开始倒计时
    this.startBattleCountdown(endTime.toISOString());
  },

  // 加载班级动态
  async loadActivities() {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const activityTypes = [
      { type: 'homework', icon: '📝', name: '作业提交' },
      { type: 'achievement', icon: '🏆', name: '获得成就' },
      { type: 'praise', icon: '👍', name: '获得表扬' },
      { type: 'attendance', icon: '✅', name: '出勤打卡' },
      { type: 'interaction', icon: '💬', name: '课堂互动' }
    ];
    
    const activities = [];
    for (let i = 0; i < 20; i++) {
      const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      const student = mock.generateName();
      
      activities.push({
        id: `activity_${i + 1}`,
        type: activityType.type,
        icon: activityType.icon,
        title: this.generateActivityTitle(activityType.type, student),
        student,
        time: mock.generateRecentDate(),
        description: this.generateActivityDescription(activityType.type)
      });
    }
    
    // 按时间排序
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    
    this.setData({
      classActivities: activities,
      isEmpty: activities.length === 0
    });
  },

  // 生成活动标题
  generateActivityTitle(type, student) {
    const titles = {
      homework: `${student} 提交了数学作业`,
      achievement: `${student} 获得了"学习之星"徽章`,
      praise: `${student} 获得老师表扬`,
      attendance: `${student} 完成今日出勤打卡`,
      interaction: `${student} 在课堂上积极发言`
    };
    return titles[type] || `${student} 的班级活动`;
  },

  // 生成活动描述
  generateActivityDescription(type) {
    const descriptions = {
      homework: '按时完成作业，字迹工整',
      achievement: '连续一周表现优秀',
      praise: '课堂表现积极，回答问题准确',
      attendance: '准时到校，从不迟到',
      interaction: '主动参与讨论，思维活跃'
    };
    return descriptions[type] || '表现优秀';
  },

  // 计算剩余时间
  calculateTimeLeft(endTime) {
    if (!endTime) return '已结束';
    
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const diff = end - now;
    
    if (diff <= 0) return '已结束';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}天${hours}小时`;
    } else if (hours > 0) {
      return `${hours}小时${minutes}分钟`;
    } else {
      return `${minutes}分钟`;
    }
  },

  // 开始对抗倒计时
  startBattleCountdown(endTime) {
    if (this.battleTimer) {
      clearInterval(this.battleTimer);
    }
    
    this.battleTimer = setInterval(() => {
      const timeLeft = this.calculateTimeLeft(endTime);
      this.setData({ battleTimeLeft: timeLeft });
      
      if (timeLeft === '已结束') {
        clearInterval(this.battleTimer);
        this.showToast('本周小组对抗已结束！');
      }
    }, 60000); // 每分钟更新一次
  },

  // 显示对抗规则
  showBattleRules() {
    wx.showModal({
      title: '小组对抗规则',
      content: '1. 每周进行一次小组对抗\n2. 根据作业完成情况、课堂表现等综合评分\n3. 获胜小组将获得额外积分奖励\n4. 鼓励小组成员互相帮助，共同进步\n5. 评分标准：作业完成率40%，课堂表现30%，互助合作30%',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 查看小组详情
  viewGroupDetail(e) {
    const group = e.currentTarget.dataset.group;
    
    wx.navigateTo({
      url: `/pages/group-detail/group-detail?groupId=${group.id}`
    });
  },

  // 刷新当前标签页
  async refreshCurrentTab() {
    await this.loadTabData(this.data.activeTab);
  },

  // 加载更多数据
  async loadMoreData() {
    // 根据当前标签页加载更多数据
    console.log('加载更多数据');
  },

  // 筛选学生
  filterStudents() {
    const { students, searchKeyword } = this.data;
    
    if (!searchKeyword) {
      this.setData({ filteredStudents: students });
      return;
    }
    
    const filtered = students.filter(student => 
      student.name.includes(searchKeyword) || 
      student.studentNumber.includes(searchKeyword)
    );
    
    this.setData({ filteredStudents: filtered });
  },

  // 显示Toast
  showToast(message) {
    this.setData({
      toastMessage: message,
      showToast: true
    });
  },

  // Toast关闭回调
  onToastClose() {
    this.setData({ showToast: false });
  },

  // 页面卸载
  onUnload() {
    if (this.battleTimer) {
      clearInterval(this.battleTimer);
    }
  },

  // 页面分享
  onShareAppMessage() {
    return {
      title: `${this.data.classInfo.name} - 班级管理`,
      path: `/pages/class/class?classId=${this.data.classInfo.id}`,
      imageUrl: '/images/share-class.png'
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: `${this.data.classInfo.name} - 班级管理`,
      imageUrl: '/images/share-class.png'
    };
  }
});