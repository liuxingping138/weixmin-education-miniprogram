// pages/growth/growth.js
Page({
  data: {
    // 加载状态
    loading: true,
    
    // 当前标签页
    activeTab: 0,
    tabs: [
      { id: 0, name: '能力分析', icon: '📊' },
      { id: 1, name: '成长档案', icon: '📋' },
      { id: 2, name: '分析报告', icon: '📈' }
    ],
    
    // 学生列表
    students: [
      {
        id: 1,
        name: '小明',
        avatar: '/images/avatar1.png',
        class: '三年级2班',
        studentId: '2021001'
      },
      {
        id: 2,
        name: '小红',
        avatar: '/images/avatar2.png',
        class: '三年级2班',
        studentId: '2021002'
      },
      {
        id: 3,
        name: '小刚',
        avatar: '/images/avatar3.png',
        class: '三年级2班',
        studentId: '2021003'
      }
    ],
    selectedStudentId: 1,
    
    // 能力分析数据
    abilityData: {
      // 时间选择
      timeOptions: [
        { id: 'week', name: '本周', active: false },
        { id: 'month', name: '本月', active: true },
        { id: 'term', name: '本学期', active: false }
      ],
      selectedTime: 'month',
      
      // 六边形能力数据
      radarData: {
        abilities: [
          { name: '语言表达', score: 85, level: '优秀', color: '#667eea' },
          { name: '逻辑思维', score: 78, level: '良好', color: '#764ba2' },
          { name: '创新能力', score: 92, level: '优秀', color: '#f093fb' },
          { name: '团队协作', score: 76, level: '良好', color: '#f5576c' },
          { name: '学习能力', score: 88, level: '优秀', color: '#4facfe' },
          { name: '实践能力', score: 82, level: '良好', color: '#43e97b' }
        ],
        averageScore: 83.5
      },
      
      // 能力详细列表
      abilityDetails: [
        {
          id: 1,
          name: '语言表达',
          desc: '口语表达清晰，词汇丰富，能够准确传达想法',
          score: 85,
          progress: 85,
          trend: 'up',
          trendText: '+5',
          color: '#667eea',
          icon: '🗣️',
          breakdown: [
            { name: '口语表达', score: 88 },
            { name: '书面表达', score: 82 },
            { name: '词汇运用', score: 85 }
          ],
          suggestions: [
            '多参与课堂讨论，提高口语表达的流畅度',
            '增加阅读量，丰富词汇储备',
            '练习写作，提升书面表达能力'
          ]
        },
        {
          id: 2,
          name: '逻辑思维',
          desc: '思维清晰，能够进行有条理的分析和推理',
          score: 78,
          progress: 78,
          trend: 'stable',
          trendText: '0',
          color: '#764ba2',
          icon: '🧠',
          breakdown: [
            { name: '分析能力', score: 80 },
            { name: '推理能力', score: 76 },
            { name: '归纳总结', score: 78 }
          ],
          suggestions: [
            '多做逻辑推理题，训练思维能力',
            '学习思维导图，提高分析归纳能力',
            '参与辩论活动，锻炼逻辑表达'
          ]
        },
        {
          id: 3,
          name: '创新能力',
          desc: '想象力丰富，善于提出新颖的想法和解决方案',
          score: 92,
          progress: 92,
          trend: 'up',
          trendText: '+8',
          color: '#f093fb',
          icon: '💡',
          breakdown: [
            { name: '想象力', score: 95 },
            { name: '创造性思维', score: 90 },
            { name: '问题解决', score: 91 }
          ],
          suggestions: [
            '继续保持创新思维，多尝试不同的解决方案',
            '参与创意活动，发挥想象力',
            '学习设计思维方法'
          ]
        },
        {
          id: 4,
          name: '团队协作',
          desc: '能够与他人良好合作，具备一定的领导和沟通能力',
          score: 76,
          progress: 76,
          trend: 'down',
          trendText: '-2',
          color: '#f5576c',
          icon: '🤝',
          breakdown: [
            { name: '沟通协调', score: 78 },
            { name: '团队合作', score: 75 },
            { name: '领导能力', score: 75 }
          ],
          suggestions: [
            '多参与小组活动，提高合作意识',
            '学习有效沟通技巧',
            '培养责任心和领导能力'
          ]
        },
        {
          id: 5,
          name: '学习能力',
          desc: '学习主动性强，能够快速掌握新知识和技能',
          score: 88,
          progress: 88,
          trend: 'up',
          trendText: '+6',
          color: '#4facfe',
          icon: '📚',
          breakdown: [
            { name: '学习主动性', score: 90 },
            { name: '知识掌握', score: 86 },
            { name: '学习方法', score: 88 }
          ],
          suggestions: [
            '继续保持学习热情',
            '尝试多种学习方法，找到最适合的',
            '建立良好的学习习惯'
          ]
        },
        {
          id: 6,
          name: '实践能力',
          desc: '动手能力强，能够将理论知识应用到实际操作中',
          score: 82,
          progress: 82,
          trend: 'up',
          trendText: '+3',
          color: '#43e97b',
          icon: '🔧',
          breakdown: [
            { name: '动手操作', score: 85 },
            { name: '理论应用', score: 80 },
            { name: '实验探究', score: 81 }
          ],
          suggestions: [
            '多参与实践活动和实验',
            '将课堂知识与实际生活联系',
            '培养观察和探究能力'
          ]
        }
      ],
      
      // 能力发展趋势
      trendData: {
        chartData: [], // Canvas图表数据
        summary: {
          improved: 4,
          stable: 1,
          declined: 1,
          avgGrowth: 3.3
        }
      }
    },
    
    // 成长档案数据
    archiveData: {
      // 学生档案概览
      profile: {
        name: '小明',
        avatar: '/images/avatar1.png',
        class: '三年级2班',
        studentId: '2021001',
        enrollDate: '2021-09-01',
        stats: {
          totalDays: 245,
          attendanceRate: 98.5,
          avgScore: 87.2
        },
        achievements: [
          '数学小能手',
          '阅读之星',
          '创意达人',
          '团队合作奖'
        ]
      },
      
      // 成长时间轴
      timeline: {
        filterOptions: [
          { id: 'all', name: '全部', active: true },
          { id: 'achievement', name: '成就', active: false },
          { id: 'activity', name: '活动', active: false },
          { id: 'homework', name: '作业', active: false },
          { id: 'test', name: '考试', active: false }
        ],
        selectedFilter: 'all',
        events: [
          {
            id: 1,
            type: 'achievement',
            title: '获得"数学小能手"称号',
            desc: '在数学竞赛中表现优异，获得年级第一名',
            date: '2024-01-15',
            time: '14:30',
            tags: ['数学', '竞赛', '第一名'],
            images: ['/images/award1.jpg']
          },
          {
            id: 2,
            type: 'activity',
            title: '参与科学实验活动',
            desc: '积极参与"小小科学家"实验活动，动手制作了火山模型',
            date: '2024-01-10',
            time: '15:45',
            tags: ['科学', '实验', '动手能力'],
            images: ['/images/experiment1.jpg', '/images/experiment2.jpg']
          },
          {
            id: 3,
            type: 'homework',
            title: '语文作业获得优秀',
            desc: '作文《我的梦想》获得老师高度评价，被选为范文',
            date: '2024-01-08',
            time: '16:20',
            tags: ['语文', '作文', '优秀'],
            images: []
          },
          {
            id: 4,
            type: 'test',
            title: '期末考试成绩优异',
            desc: '各科成绩均衡发展，总分位列班级前三',
            date: '2024-01-05',
            time: '09:00',
            tags: ['期末考试', '优异', '前三'],
            images: []
          },
          {
            id: 5,
            type: 'activity',
            title: '班级文艺汇演',
            desc: '担任主持人，表现自然大方，获得师生好评',
            date: '2023-12-25',
            time: '19:00',
            tags: ['文艺汇演', '主持人', '表现优秀'],
            images: ['/images/performance1.jpg']
          }
        ]
      },
      
      // 学习统计
      learningStats: {
        homework: {
          completed: 156,
          total: 160,
          rate: 97.5
        },
        tests: {
          excellent: 8,
          good: 5,
          total: 15,
          avgScore: 87.2
        },
        activities: {
          participated: 12,
          total: 15,
          rate: 80.0
        },
        points: {
          current: 2580,
          rank: 3
        }
      }
    },
    
    // AI分析报告数据
    reportData: {
      // 综合评价
      overallAssessment: {
        score: 87.2,
        level: '优秀',
        desc: '该学生在各方面表现均衡，学习能力强，创新思维突出，是一名全面发展的优秀学生。'
      },
      
      // 优势分析
      strengths: [
        '创新能力突出，想象力丰富，经常能提出独特的见解',
        '学习主动性强，能够自主完成学习任务',
        '语言表达能力优秀，口语和书面表达都很出色',
        '实践动手能力强，理论与实践结合能力好'
      ],
      
      // 改进建议
      improvements: [
        '团队协作能力有待提升，建议多参与小组活动',
        '逻辑思维能力需要加强，可以多做推理训练',
        '时间管理能力需要改善，建议制定学习计划',
        '抗压能力有待提高，面对挫折时需要更多支持'
      ],
      
      // 学习计划
      learningPlan: [
        {
          period: '近期',
          title: '基础能力巩固',
          desc: '重点提升逻辑思维和团队协作能力',
          goals: [
            '• 每周完成2-3道逻辑推理题',
            '• 积极参与小组讨论和合作项目',
            '• 学习有效的沟通技巧'
          ]
        },
        {
          period: '中期',
          title: '能力拓展提升',
          desc: '在保持优势的基础上，全面提升各项能力',
          goals: [
            '• 参与更多创新实践活动',
            '• 担任小组长角色，锻炼领导能力',
            '• 制定个人学习计划，提高时间管理'
          ]
        },
        {
          period: '长期',
          title: '综合素质发展',
          desc: '培养全面发展的综合素质',
          goals: [
            '• 培养批判性思维和独立思考能力',
            '• 提升抗压能力和心理素质',
            '• 发展特长爱好，形成个人特色'
          ]
        }
      ],
      
      // 历史报告
      historyReports: [
        {
          id: 1,
          title: '2024年1月成长分析报告',
          type: 'ai',
          date: '2024-01-20',
          period: '2024年1月',
          summary: 'AI智能分析生成的综合成长报告，包含能力分析、学习建议等',
          score: 87.2
        },
        {
          id: 2,
          title: '期末综合评价报告',
          type: 'manual',
          date: '2024-01-15',
          period: '2023学年上学期',
          summary: '教师手动生成的期末综合评价，详细记录学期表现',
          score: 85.8
        },
        {
          id: 3,
          title: '2023年12月成长分析报告',
          type: 'ai',
          date: '2023-12-20',
          period: '2023年12月',
          summary: 'AI智能分析生成的月度成长报告',
          score: 84.5
        }
      ]
    },
    
    // 弹窗状态
    showAbilityDetail: false,
    selectedAbility: null
  },
  
  // 计算属性
  get selectedStudent() {
    return this.data.students.find(s => s.id === this.data.selectedStudentId) || this.data.students[0];
  },
  
  get filteredTimelineEvents() {
    const { events, selectedFilter } = this.data.archiveData.timeline;
    if (selectedFilter === 'all') {
      return events;
    }
    return events.filter(event => event.type === selectedFilter);
  },
  
  // 生命周期函数
  onLoad(options) {
    console.log('Growth page loaded with options:', options);
    this.loadInitialData();
  },
  
  onShow() {
    console.log('Growth page shown');
    this.refreshData();
  },
  
  onReady() {
    console.log('Growth page ready');
    this.initCharts();
  },
  
  onPullDownRefresh() {
    console.log('Pull down refresh triggered');
    this.refreshData().then(() => {
      wx.stopPullDownRefresh();
    });
  },
  
  onReachBottom() {
    console.log('Reached bottom');
    this.loadMoreData();
  },
  
  onShareAppMessage() {
    const student = this.selectedStudent;
    return {
      title: `${student.name}的成长分析报告`,
      path: `/pages/growth/growth?studentId=${this.data.selectedStudentId}`,
      imageUrl: '/images/share-growth.jpg'
    };
  },
  
  // 数据加载方法
  async loadInitialData() {
    try {
      this.setData({ loading: true });
      
      // 模拟API调用
      await Promise.all([
        this.loadStudentList(),
        this.loadAbilityData(),
        this.loadArchiveData(),
        this.loadReportData()
      ]);
      
      this.setData({ loading: false });
    } catch (error) {
      console.error('Failed to load initial data:', error);
      this.showToast('数据加载失败，请重试', 'error');
      this.setData({ loading: false });
    }
  },
  
  async refreshData() {
    try {
      // 根据当前标签页刷新对应数据
      switch (this.data.activeTab) {
        case 0:
          await this.loadAbilityData();
          break;
        case 1:
          await this.loadArchiveData();
          break;
        case 2:
          await this.loadReportData();
          break;
      }
    } catch (error) {
      console.error('Failed to refresh data:', error);
      this.showToast('刷新失败，请重试', 'error');
    }
  },
  
  async loadMoreData() {
    // 加载更多历史报告或时间轴事件
    if (this.data.activeTab === 1) {
      await this.loadMoreTimelineEvents();
    } else if (this.data.activeTab === 2) {
      await this.loadMoreReports();
    }
  },
  
  async loadStudentList() {
    // 模拟加载学生列表
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('Student list loaded');
        resolve();
      }, 300);
    });
  },
  
  async loadAbilityData() {
    // 模拟加载能力分析数据
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('Ability data loaded');
        // 更新雷达图数据
        this.updateRadarChart();
        this.updateTrendChart();
        resolve();
      }, 500);
    });
  },
  
  async loadArchiveData() {
    // 模拟加载档案数据
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('Archive data loaded');
        resolve();
      }, 400);
    });
  },
  
  async loadReportData() {
    // 模拟加载报告数据
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('Report data loaded');
        resolve();
      }, 300);
    });
  },
  
  async loadMoreTimelineEvents() {
    // 模拟加载更多时间轴事件
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('More timeline events loaded');
        resolve();
      }, 500);
    });
  },
  
  async loadMoreReports() {
    // 模拟加载更多历史报告
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('More reports loaded');
        resolve();
      }, 500);
    });
  },
  
  // 交互方法
  onTabChange(e) {
    const tabId = e.currentTarget.dataset.tab;
    console.log('Tab changed to:', tabId);
    
    this.setData({
      activeTab: parseInt(tabId)
    });
    
    // 切换标签页时刷新数据
    this.refreshData();
  },
  
  onStudentSelect(e) {
    const studentId = e.currentTarget.dataset.id;
    console.log('Student selected:', studentId);
    
    this.setData({
      selectedStudentId: parseInt(studentId)
    });
    
    // 切换学生时重新加载数据
    this.loadInitialData();
  },
  
  onTimeOptionSelect(e) {
    const timeId = e.currentTarget.dataset.time;
    console.log('Time option selected:', timeId);
    
    const timeOptions = this.data.abilityData.timeOptions.map(option => ({
      ...option,
      active: option.id === timeId
    }));
    
    this.setData({
      'abilityData.timeOptions': timeOptions,
      'abilityData.selectedTime': timeId
    });
    
    // 重新加载能力数据
    this.loadAbilityData();
  },
  
  onAbilityItemTap(e) {
    const abilityId = e.currentTarget.dataset.id;
    const ability = this.data.abilityData.abilityDetails.find(a => a.id === parseInt(abilityId));
    
    if (ability) {
      console.log('Ability item tapped:', ability.name);
      this.setData({
        selectedAbility: ability,
        showAbilityDetail: true
      });
    }
  },
  
  onAbilityDetailClose() {
    console.log('Ability detail closed');
    this.setData({
      showAbilityDetail: false,
      selectedAbility: null
    });
  },
  
  onTimelineFilterSelect(e) {
    const filterId = e.currentTarget.dataset.filter;
    console.log('Timeline filter selected:', filterId);
    
    const filterOptions = this.data.archiveData.timeline.filterOptions.map(option => ({
      ...option,
      active: option.id === filterId
    }));
    
    this.setData({
      'archiveData.timeline.filterOptions': filterOptions,
      'archiveData.timeline.selectedFilter': filterId
    });
  },
  
  onReportItemTap(e) {
    const reportId = e.currentTarget.dataset.id;
    console.log('Report item tapped:', reportId);
    
    // 跳转到报告详情页面
    wx.navigateTo({
      url: `/pages/report-detail/report-detail?id=${reportId}`
    });
  },
  
  onGenerateReport() {
    console.log('Generate new report');
    
    this.showToast('正在生成分析报告...', 'loading');
    
    // 模拟生成报告
    setTimeout(() => {
      this.showToast('报告生成成功！', 'success');
      // 刷新报告列表
      this.loadReportData();
    }, 2000);
  },
  
  onExportReport(e) {
    const reportId = e.currentTarget.dataset.id;
    console.log('Export report:', reportId);
    
    this.showToast('正在导出报告...', 'loading');
    
    // 模拟导出报告
    setTimeout(() => {
      this.showToast('报告导出成功！', 'success');
    }, 1500);
  },
  
  onShareReport(e) {
    const reportId = e.currentTarget.dataset.id;
    console.log('Share report:', reportId);
    
    // 触发分享
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },
  
  // 图表初始化方法
  initCharts() {
    // 初始化雷达图
    this.initRadarChart();
    // 初始化趋势图
    this.initTrendChart();
  },
  
  initRadarChart() {
    // 获取Canvas上下文
    const query = wx.createSelectorQuery();
    query.select('#radarCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (res[0]) {
          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');
          
          // 设置Canvas尺寸
          const dpr = wx.getSystemInfoSync().pixelRatio;
          canvas.width = res[0].width * dpr;
          canvas.height = res[0].height * dpr;
          ctx.scale(dpr, dpr);
          
          // 绘制雷达图
          this.drawRadarChart(ctx, res[0].width, res[0].height);
        }
      });
  },
  
  initTrendChart() {
    // 获取Canvas上下文
    const query = wx.createSelectorQuery();
    query.select('#trendCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (res[0]) {
          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');
          
          // 设置Canvas尺寸
          const dpr = wx.getSystemInfoSync().pixelRatio;
          canvas.width = res[0].width * dpr;
          canvas.height = res[0].height * dpr;
          ctx.scale(dpr, dpr);
          
          // 绘制趋势图
          this.drawTrendChart(ctx, res[0].width, res[0].height);
        }
      });
  },
  
  drawRadarChart(ctx, width, height) {
    const { abilities } = this.data.abilityData.radarData;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40;
    const angleStep = (Math.PI * 2) / abilities.length;
    
    // 清空画布
    ctx.clearRect(0, 0, width, height);
    
    // 绘制背景网格
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    for (let i = 1; i <= 5; i++) {
      const r = (radius * i) / 5;
      ctx.beginPath();
      for (let j = 0; j < abilities.length; j++) {
        const angle = j * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        
        if (j === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.stroke();
    }
    
    // 绘制轴线
    for (let i = 0; i < abilities.length; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    
    // 绘制数据区域
    ctx.fillStyle = 'rgba(102, 126, 234, 0.2)';
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    for (let i = 0; i < abilities.length; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const score = abilities[i].score / 100;
      const x = centerX + Math.cos(angle) * radius * score;
      const y = centerY + Math.sin(angle) * radius * score;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // 绘制数据点
    ctx.fillStyle = '#667eea';
    for (let i = 0; i < abilities.length; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const score = abilities[i].score / 100;
      const x = centerX + Math.cos(angle) * radius * score;
      const y = centerY + Math.sin(angle) * radius * score;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // 绘制标签
    ctx.fillStyle = '#333333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    for (let i = 0; i < abilities.length; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const labelRadius = radius + 20;
      const x = centerX + Math.cos(angle) * labelRadius;
      const y = centerY + Math.sin(angle) * labelRadius;
      
      ctx.fillText(abilities[i].name, x, y + 4);
    }
  },
  
  drawTrendChart(ctx, width, height) {
    // 模拟趋势数据
    const trendData = [
      { month: '9月', score: 78 },
      { month: '10月', score: 82 },
      { month: '11月', score: 79 },
      { month: '12月', score: 85 },
      { month: '1月', score: 87 }
    ];
    
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const stepX = chartWidth / (trendData.length - 1);
    
    // 清空画布
    ctx.clearRect(0, 0, width, height);
    
    // 绘制坐标轴
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    // Y轴
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();
    
    // X轴
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // 绘制网格线
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight * i) / 4;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }
    
    // 绘制趋势线
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    for (let i = 0; i < trendData.length; i++) {
      const x = padding + i * stepX;
      const y = height - padding - ((trendData[i].score - 60) / 40) * chartHeight;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    
    // 绘制数据点
    ctx.fillStyle = '#667eea';
    for (let i = 0; i < trendData.length; i++) {
      const x = padding + i * stepX;
      const y = height - padding - ((trendData[i].score - 60) / 40) * chartHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // 绘制标签
    ctx.fillStyle = '#666666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    for (let i = 0; i < trendData.length; i++) {
      const x = padding + i * stepX;
      ctx.fillText(trendData[i].month, x, height - padding + 20);
    }
  },
  
  updateRadarChart() {
    // 更新雷达图数据后重新绘制
    setTimeout(() => {
      this.initRadarChart();
    }, 100);
  },
  
  updateTrendChart() {
    // 更新趋势图数据后重新绘制
    setTimeout(() => {
      this.initTrendChart();
    }, 100);
  },
  
  // 工具方法
  showToast(title, icon = 'none', duration = 2000) {
    wx.showToast({
      title,
      icon,
      duration
    });
  },
  
  formatDate(dateStr) {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return {
      month: month + '月',
      day: day.toString()
    };
  },
  
  getProgressColor(score) {
    if (score >= 90) return '#28a745';
    if (score >= 80) return '#667eea';
    if (score >= 70) return '#ffc107';
    return '#dc3545';
  },
  
  getTrendIcon(trend) {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  },
  
  getEventTypeColor(type) {
    const colors = {
      achievement: '#28a745',
      activity: '#ffc107',
      homework: '#17a2b8',
      test: '#dc3545'
    };
    return colors[type] || '#6c757d';
  },
  
  getEventTypeIcon(type) {
    const icons = {
      achievement: '🏆',
      activity: '🎯',
      homework: '📝',
      test: '📊'
    };
    return icons[type] || '📌';
  }
});