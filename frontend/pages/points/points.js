// pages/points/points.js
const app = getApp();
const mock = require('../../utils/mock.js');
const request = require('../../utils/request.js');

Page({
  data: {
    // 用户积分信息
    userPoints: {
      current: 0,
      total: 0,
      used: 0,
      rank: 0,
      level: 1,
      levelName: '新手',
      nextLevelPoints: 100,
      todayEarned: 0
    },
    
    // 当前激活的标签页
    activeTab: 'mall',
    
    // 商城相关数据
    categories: [],
    selectedCategory: 'all',
    goods: [],
    filteredGoods: [],
    selectedGoods: null,
    showGoodsDetail: false,
    
    // 任务相关数据
    dailyTasks: [],
    achievementTasks: [],
    weeklyTasks: [],
    
    // 记录相关数据
    recordType: 'all', // all, earn, spend
    records: [],
    filteredRecords: [],
    
    // 排行榜数据
    rankingList: [],
    myRanking: null,
    
    // UI状态
    loading: false,
    isEmpty: false,
    showToast: false,
    toastMessage: '',
    showRankingModal: false,
    showLevelUpModal: false,
    levelUpInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('积分页面加载');
    this.initPage();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.refreshUserPoints();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.refreshCurrentTab().then(() => {
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
      title: '积分商城 - 学习积分兑换好礼',
      path: '/pages/points/points',
      imageUrl: '/images/share-points.png'
    };
  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    return {
      title: '积分商城 - 学习积分兑换好礼',
      imageUrl: '/images/share-points.png'
    };
  },

  /**
   * 初始化页面
   */
  async initPage() {
    this.setData({ loading: true });
    
    try {
      await Promise.all([
        this.loadUserPoints(),
        this.loadTabData(this.data.activeTab)
      ]);
    } catch (error) {
      console.error('初始化页面失败:', error);
      this.showToast('加载失败，请重试');
    } finally {
      this.setData({ loading: false });
    }
  },

  /**
   * 加载用户积分信息
   */
  async loadUserPoints() {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const userInfo = app.globalData.userInfo || {};
      const basePoints = mock.generateNumber(500, 2000);
      const usedPoints = mock.generateNumber(100, 500);
      const todayEarned = mock.generateNumber(20, 80);
      
      const userPoints = {
        current: basePoints - usedPoints,
        total: basePoints + mock.generateNumber(200, 800),
        used: usedPoints,
        rank: mock.generateNumber(1, 50),
        level: this.calculateLevel(basePoints),
        levelName: this.getLevelName(this.calculateLevel(basePoints)),
        nextLevelPoints: this.getNextLevelPoints(this.calculateLevel(basePoints)),
        todayEarned
      };
      
      this.setData({ userPoints });
      return userPoints;
    } catch (error) {
      console.error('加载用户积分失败:', error);
      throw error;
    }
  },

  /**
   * 刷新用户积分
   */
  async refreshUserPoints() {
    try {
      await this.loadUserPoints();
    } catch (error) {
      console.error('刷新积分失败:', error);
    }
  },

  /**
   * 计算用户等级
   */
  calculateLevel(totalPoints) {
    if (totalPoints < 100) return 1;
    if (totalPoints < 300) return 2;
    if (totalPoints < 600) return 3;
    if (totalPoints < 1000) return 4;
    if (totalPoints < 1500) return 5;
    if (totalPoints < 2500) return 6;
    if (totalPoints < 4000) return 7;
    if (totalPoints < 6000) return 8;
    if (totalPoints < 10000) return 9;
    return 10;
  },

  /**
   * 获取等级名称
   */
  getLevelName(level) {
    const levelNames = {
      1: '新手',
      2: '学徒',
      3: '进阶',
      4: '熟练',
      5: '专家',
      6: '大师',
      7: '宗师',
      8: '传奇',
      9: '史诗',
      10: '神话'
    };
    return levelNames[level] || '新手';
  },

  /**
   * 获取下一等级所需积分
   */
  getNextLevelPoints(level) {
    const levelPoints = {
      1: 100,
      2: 300,
      3: 600,
      4: 1000,
      5: 1500,
      6: 2500,
      7: 4000,
      8: 6000,
      9: 10000,
      10: 0
    };
    return levelPoints[level] || 0;
  },

  /**
   * 切换标签页
   */
  async switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    if (tab === this.data.activeTab) return;
    
    this.setData({ activeTab: tab });
    await this.loadTabData(tab);
  },

  /**
   * 加载标签页数据
   */
  async loadTabData(tab) {
    try {
      this.setData({ loading: true });
      
      switch (tab) {
        case 'mall':
          await this.loadMallData();
          break;
        case 'tasks':
          await this.loadTasksData();
          break;
        case 'records':
          await this.loadRecordsData();
          break;
        case 'ranking':
          await this.loadRankingData();
          break;
      }
    } catch (error) {
      console.error(`加载${tab}数据失败:`, error);
      this.showToast(error.message || '加载失败');
    } finally {
      this.setData({ loading: false });
    }
  },

  /**
   * 加载商城数据
   */
  async loadMallData() {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // 生成商品分类
    const categories = [
      { id: 'study', name: '学习用品', icon: '📚' },
      { id: 'digital', name: '数码产品', icon: '📱' },
      { id: 'book', name: '图书', icon: '📖' },
      { id: 'gift', name: '礼品', icon: '🎁' },
      { id: 'coupon', name: '优惠券', icon: '🎫' }
    ];
    
    // 生成商品列表
    const goodsTemplates = [
      // 学习用品
      { name: '精美笔记本', category: 'study', points: [50, 80], image: '/images/goods/notebook.jpg', isHot: true },
      { name: '多彩笔套装', category: 'study', points: [30, 50], image: '/images/goods/pens.jpg' },
      { name: '学习台灯', category: 'study', points: [200, 300], image: '/images/goods/lamp.jpg' },
      { name: '文具礼盒', category: 'study', points: [100, 150], image: '/images/goods/stationery.jpg' },
      
      // 数码产品
      { name: '蓝牙耳机', category: 'digital', points: [500, 800], image: '/images/goods/earphone.jpg', isHot: true },
      { name: '充电宝', category: 'digital', points: [300, 500], image: '/images/goods/powerbank.jpg' },
      { name: '手机支架', category: 'digital', points: [80, 120], image: '/images/goods/stand.jpg' },
      { name: '数据线', category: 'digital', points: [50, 80], image: '/images/goods/cable.jpg' },
      
      // 图书
      { name: '经典名著', category: 'book', points: [100, 200], image: '/images/goods/book1.jpg' },
      { name: '科普读物', category: 'book', points: [80, 150], image: '/images/goods/book2.jpg' },
      { name: '学习辅导书', category: 'book', points: [120, 180], image: '/images/goods/book3.jpg', isHot: true },
      
      // 礼品
      { name: '定制水杯', category: 'gift', points: [150, 250], image: '/images/goods/cup.jpg' },
      { name: '毛绒玩具', category: 'gift', points: [200, 300], image: '/images/goods/toy.jpg' },
      { name: '装饰摆件', category: 'gift', points: [100, 200], image: '/images/goods/decoration.jpg' },
      
      // 优惠券
      { name: '书店优惠券', category: 'coupon', points: [20, 50], image: '/images/goods/coupon1.jpg' },
      { name: '文具店代金券', category: 'coupon', points: [30, 80], image: '/images/goods/coupon2.jpg' },
      { name: '在线课程券', category: 'coupon', points: [100, 200], image: '/images/goods/coupon3.jpg', isHot: true }
    ];
    
    const goods = [];
    goodsTemplates.forEach((template, index) => {
      const pointsRange = template.points;
      const points = mock.generateNumber(pointsRange[0], pointsRange[1]);
      const stock = Math.random() > 0.1 ? mock.generateNumber(5, 50) : 0; // 10%概率售罄
      
      goods.push({
        id: index + 1,
        name: template.name,
        description: this.generateGoodsDescription(template.name),
        image: template.image,
        points,
        originalPoints: Math.floor(points * 1.2), // 原价
        categoryId: template.category,
        stock,
        sales: mock.generateNumber(10, 200),
        isHot: template.isHot || false,
        isNew: Math.random() > 0.8,
        discount: Math.random() > 0.7 ? mock.generateNumber(10, 30) : 0
      });
    });
    
    // 按热度和库存排序
    goods.sort((a, b) => {
      if (a.isHot && !b.isHot) return -1;
      if (!a.isHot && b.isHot) return 1;
      if (a.stock === 0 && b.stock > 0) return 1;
      if (a.stock > 0 && b.stock === 0) return -1;
      return b.sales - a.sales;
    });
    
    this.setData({
      categories,
      goods,
      filteredGoods: goods,
      isEmpty: goods.length === 0
    });
  },

  /**
   * 生成商品描述
   */
  generateGoodsDescription(name) {
    const descriptions = {
      '精美笔记本': '高质量纸张，精美封面设计，记录学习点滴',
      '多彩笔套装': '多种颜色，书写流畅，让学习更有趣',
      '学习台灯': '护眼LED灯，可调节亮度，学习好伴侣',
      '文具礼盒': '精美包装，多种文具组合，送礼佳品',
      '蓝牙耳机': '高音质，长续航，学习娱乐两不误',
      '充电宝': '大容量，快充技术，随时随地充电',
      '手机支架': '稳固支撑，多角度调节，解放双手',
      '数据线': '快速传输，耐用材质，充电传输两用',
      '经典名著': '文学经典，提升文化素养',
      '科普读物': '趣味科普，拓展知识视野',
      '学习辅导书': '权威编写，提升学习效果',
      '定制水杯': '个性定制，环保材质，健康饮水',
      '毛绒玩具': '柔软舒适，可爱造型，减压好物',
      '装饰摆件': '精美工艺，装点学习空间',
      '书店优惠券': '指定书店通用，购书更优惠',
      '文具店代金券': '文具购买抵扣，实用便民',
      '在线课程券': '精品课程，提升学习技能'
    };
    return descriptions[name] || '优质商品，值得拥有';
  },

  /**
   * 选择商品分类
   */
  selectCategory(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({ selectedCategory: category });
    
    let filteredGoods = this.data.goods;
    if (category !== 'all') {
      filteredGoods = this.data.goods.filter(item => item.categoryId === category);
    }
    
    this.setData({ filteredGoods });
  },

  /**
   * 查看商品详情
   */
  viewGoodsDetail(e) {
    const goods = e.currentTarget.dataset.goods;
    this.setData({
      selectedGoods: goods,
      showGoodsDetail: true
    });
  },

  /**
   * 关闭商品详情
   */
  closeGoodsDetail() {
    this.setData({ showGoodsDetail: false });
  },

  /**
   * 商品详情弹窗状态变化
   */
  onGoodsDetailClose(e) {
    if (!e.detail.visible) {
      this.closeGoodsDetail();
    }
  },

  /**
   * 兑换商品
   */
  exchangeGoods(e) {
    e.stopPropagation();
    const goods = e.currentTarget.dataset.goods;
    
    if (goods.stock === 0) {
      this.showToast('商品已售罄');
      return;
    }
    
    if (this.data.userPoints.current < goods.points) {
      this.showToast('积分不足');
      return;
    }
    
    this.setData({
      selectedGoods: goods,
      showGoodsDetail: true
    });
  },

  /**
   * 确认兑换
   */
  async confirmExchange() {
    const goods = this.data.selectedGoods;
    
    try {
      wx.showModal({
        title: '确认兑换',
        content: `确定要用 ${goods.points} 积分兑换 ${goods.name} 吗？`,
        success: async (res) => {
          if (res.confirm) {
            await this.performExchange(goods);
          }
        }
      });
    } catch (error) {
      console.error('兑换商品失败:', error);
      this.showToast(error.message || '兑换失败');
    }
  },

  /**
   * 执行兑换
   */
  async performExchange(goods) {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 更新用户积分
      const { userPoints } = this.data;
      const newPoints = {
        ...userPoints,
        current: userPoints.current - goods.points,
        used: userPoints.used + goods.points
      };
      
      // 更新商品库存
      const updatedGoods = this.data.goods.map(item => {
        if (item.id === goods.id) {
          return {
            ...item,
            stock: item.stock - 1,
            sales: item.sales + 1
          };
        }
        return item;
      });
      
      // 添加兑换记录
      const newRecord = {
        id: Date.now(),
        title: `兑换${goods.name}`,
        description: `积分商城兑换`,
        points: goods.points,
        type: 'spend',
        icon: '🛍️',
        createTime: new Date().toLocaleString('zh-CN', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      
      this.setData({
        userPoints: newPoints,
        goods: updatedGoods,
        filteredGoods: this.data.selectedCategory === 'all' ? 
          updatedGoods : 
          updatedGoods.filter(item => item.categoryId === this.data.selectedCategory),
        records: [newRecord, ...this.data.records]
      });
      
      this.showToast('兑换成功！');
      this.closeGoodsDetail();
      
      // 检查是否升级
      this.checkLevelUp(newPoints.total);
      
    } catch (error) {
      console.error('兑换失败:', error);
      this.showToast(error.message || '兑换失败');
    }
  },

  /**
   * 检查等级提升
   */
  checkLevelUp(totalPoints) {
    const newLevel = this.calculateLevel(totalPoints);
    const currentLevel = this.data.userPoints.level;
    
    if (newLevel > currentLevel) {
      const levelUpInfo = {
        oldLevel: currentLevel,
        newLevel: newLevel,
        oldLevelName: this.getLevelName(currentLevel),
        newLevelName: this.getLevelName(newLevel),
        rewards: this.getLevelUpRewards(newLevel)
      };
      
      this.setData({
        levelUpInfo,
        showLevelUpModal: true
      });
      
      // 更新用户等级
      this.setData({
        'userPoints.level': newLevel,
        'userPoints.levelName': this.getLevelName(newLevel),
        'userPoints.nextLevelPoints': this.getNextLevelPoints(newLevel)
      });
    }
  },

  /**
   * 获取升级奖励
   */
  getLevelUpRewards(level) {
    const rewards = {
      2: ['新手礼包', '积分+50'],
      3: ['进阶徽章', '积分+100'],
      4: ['熟练称号', '积分+150'],
      5: ['专家特权', '积分+200'],
      6: ['大师光环', '积分+300'],
      7: ['宗师印记', '积分+500'],
      8: ['传奇勋章', '积分+800'],
      9: ['史诗称号', '积分+1000'],
      10: ['神话荣耀', '积分+1500']
    };
    return rewards[level] || ['升级奖励', '积分+50'];
  },

  /**
   * 关闭升级弹窗
   */
  closeLevelUpModal() {
    this.setData({ showLevelUpModal: false });
  },

  /**
   * 加载任务数据
   */
  async loadTasksData() {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 生成每日任务
    const dailyTaskTemplates = [
      { name: '完成作业', icon: '📝', points: 20, type: 'progress', target: 3 },
      { name: '在线学习', icon: '💻', points: 15, type: 'progress', target: 30 },
      { name: '错题练习', icon: '❌', points: 25, type: 'progress', target: 10 },
      { name: '课程签到', icon: '✅', points: 10, type: 'simple' },
      { name: '分享学习', icon: '📤', points: 30, type: 'simple' }
    ];
    
    const dailyTasks = dailyTaskTemplates.map((template, index) => {
      const progress = template.type === 'progress' ? 
        mock.generateNumber(0, template.target) : 0;
      const completed = template.type === 'simple' ? 
        Math.random() > 0.6 : progress >= template.target;
      
      return {
        id: `daily_${index + 1}`,
        name: template.name,
        description: this.generateTaskDescription(template.name),
        icon: template.icon,
        points: template.points,
        type: template.type,
        target: template.target || 1,
        progress: template.type === 'simple' ? (completed ? 1 : 0) : progress,
        completed,
        canComplete: template.type === 'simple' ? !completed : progress >= template.target,
        refreshTime: '每日0点刷新'
      };
    });
    
    // 生成周任务
    const weeklyTaskTemplates = [
      { name: '完成20次作业', icon: '📚', points: 100, target: 20 },
      { name: '学习时长达5小时', icon: '⏰', points: 150, target: 300 },
      { name: '错题练习50道', icon: '🎯', points: 120, target: 50 }
    ];
    
    const weeklyTasks = weeklyTaskTemplates.map((template, index) => {
      const progress = mock.generateNumber(0, template.target);
      const completed = progress >= template.target;
      
      return {
        id: `weekly_${index + 1}`,
        name: template.name,
        description: this.generateTaskDescription(template.name),
        icon: template.icon,
        points: template.points,
        type: 'progress',
        target: template.target,
        progress,
        completed,
        canComplete: progress >= template.target,
        refreshTime: '每周一刷新'
      };
    });
    
    // 生成成就任务
    const achievementTaskTemplates = [
      { name: '学习达人', icon: '🏆', points: 500, target: 100, desc: '累计学习100小时' },
      { name: '作业之星', icon: '⭐', points: 300, target: 200, desc: '完成200次作业' },
      { name: '错题克星', icon: '💪', points: 400, target: 500, desc: '练习500道错题' },
      { name: '分享专家', icon: '📢', points: 200, target: 50, desc: '分享学习50次' },
      { name: '连续签到', icon: '📅', points: 150, target: 30, desc: '连续签到30天' }
    ];
    
    const achievementTasks = achievementTaskTemplates.map((template, index) => {
      const progress = mock.generateNumber(0, template.target);
      const completed = progress >= template.target;
      
      return {
        id: `achievement_${index + 1}`,
        name: template.name,
        description: template.desc,
        icon: template.icon,
        points: template.points,
        type: 'progress',
        target: template.target,
        progress,
        completed,
        canComplete: progress >= template.target,
        difficulty: template.points >= 400 ? 'hard' : template.points >= 200 ? 'medium' : 'easy'
      };
    });
    
    this.setData({
      dailyTasks,
      weeklyTasks,
      achievementTasks,
      isEmpty: dailyTasks.length === 0 && achievementTasks.length === 0
    });
  },

  /**
   * 生成任务描述
   */
  generateTaskDescription(taskName) {
    const descriptions = {
      '完成作业': '按时完成老师布置的作业',
      '在线学习': '在线学习时长达到要求',
      '错题练习': '完成错题本中的练习题',
      '课程签到': '每日课程签到打卡',
      '分享学习': '分享学习心得或成果',
      '完成20次作业': '本周内完成20次作业提交',
      '学习时长达5小时': '本周累计在线学习5小时',
      '错题练习50道': '本周完成50道错题练习'
    };
    return descriptions[taskName] || '完成指定任务获得积分奖励';
  },

  /**
   * 完成任务
   */
  async completeTask(e) {
    const task = e.currentTarget.dataset.task;
    
    if (task.completed || !task.canComplete) {
      return;
    }
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 更新任务状态
      const updateTaskList = (taskList) => {
        return taskList.map(item => {
          if (item.id === task.id) {
            return { ...item, completed: true, canComplete: false };
          }
          return item;
        });
      };
      
      // 更新用户积分
      const { userPoints } = this.data;
      const newPoints = {
        ...userPoints,
        current: userPoints.current + task.points,
        total: userPoints.total + task.points,
        todayEarned: userPoints.todayEarned + task.points
      };
      
      // 添加积分记录
      const newRecord = {
        id: Date.now(),
        title: `完成任务：${task.name}`,
        description: task.description,
        points: task.points,
        type: 'earn',
        icon: task.icon,
        createTime: new Date().toLocaleString('zh-CN', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      
      this.setData({
        userPoints: newPoints,
        dailyTasks: updateTaskList(this.data.dailyTasks),
        weeklyTasks: updateTaskList(this.data.weeklyTasks),
        achievementTasks: updateTaskList(this.data.achievementTasks),
        records: [newRecord, ...this.data.records]
      });
      
      this.showToast(`获得 ${task.points} 积分！`);
      
      // 检查是否升级
      this.checkLevelUp(newPoints.total);
      
    } catch (error) {
      console.error('完成任务失败:', error);
      this.showToast(error.message || '操作失败');
    }
  },

  /**
   * 加载积分记录
   */
  async loadRecordsData() {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    // 生成积分记录
    const recordTemplates = [
      { title: '完成作业', type: 'earn', points: 20, icon: '📝' },
      { title: '在线学习', type: 'earn', points: 15, icon: '💻' },
      { title: '错题练习', type: 'earn', points: 25, icon: '❌' },
      { title: '课程签到', type: 'earn', points: 10, icon: '✅' },
      { title: '分享学习', type: 'earn', points: 30, icon: '📤' },
      { title: '兑换笔记本', type: 'spend', points: 50, icon: '🛍️' },
      { title: '兑换文具', type: 'spend', points: 80, icon: '🛍️' },
      { title: '兑换图书', type: 'spend', points: 120, icon: '🛍️' }
    ];
    
    const records = [];
    const now = new Date();
    
    for (let i = 0; i < 30; i++) {
      const template = recordTemplates[Math.floor(Math.random() * recordTemplates.length)];
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000 * Math.random());
      
      records.push({
        id: i + 1,
        title: template.title,
        description: this.generateRecordDescription(template.title, template.type),
        points: template.points + mock.generateNumber(-5, 10),
        type: template.type,
        icon: template.icon,
        createTime: date.toLocaleString('zh-CN', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      });
    }
    
    // 按时间排序
    records.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
    
    this.setData({
      records,
      filteredRecords: this.filterRecordsByType(records, this.data.recordType),
      isEmpty: records.length === 0
    });
  },

  /**
   * 生成记录描述
   */
  generateRecordDescription(title, type) {
    if (type === 'earn') {
      const earnDescriptions = {
        '完成作业': '按时提交作业获得奖励',
        '在线学习': '在线学习时长奖励',
        '错题练习': '完成错题练习获得积分',
        '课程签到': '每日签到奖励',
        '分享学习': '分享学习内容获得积分'
      };
      return earnDescriptions[title] || '学习活动奖励';
    } else {
      return '积分商城兑换消费';
    }
  },

  /**
   * 按类型筛选记录
   */
  filterRecordsByType(records, type) {
    if (type === 'all') return records;
    return records.filter(record => record.type === type);
  },

  /**
   * 切换记录类型
   */
  async switchRecordType(e) {
    const type = e.currentTarget.dataset.type;
    if (type === this.data.recordType) return;
    
    this.setData({ 
      recordType: type,
      filteredRecords: this.filterRecordsByType(this.data.records, type)
    });
  },

  /**
   * 加载排行榜数据
   */
  async loadRankingData() {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // 生成排行榜数据
    const rankingList = [];
    const names = ['小明', '小红', '小刚', '小丽', '小华', '小强', '小美', '小杰', '小雨', '小雪'];
    const avatars = [
      '/images/avatar/avatar1.png',
      '/images/avatar/avatar2.png',
      '/images/avatar/avatar3.png',
      '/images/avatar/avatar4.png',
      '/images/avatar/avatar5.png'
    ];
    
    for (let i = 0; i < 50; i++) {
      const points = mock.generateNumber(100, 2000);
      rankingList.push({
        id: i + 1,
        rank: i + 1,
        name: names[Math.floor(Math.random() * names.length)] + (i > 9 ? i : ''),
        avatar: avatars[Math.floor(Math.random() * avatars.length)],
        points,
        level: this.calculateLevel(points),
        levelName: this.getLevelName(this.calculateLevel(points)),
        weeklyIncrease: mock.generateNumber(10, 100),
        isMe: i === this.data.userPoints.rank - 1
      });
    }
    
    // 按积分排序
    rankingList.sort((a, b) => b.points - a.points);
    
    // 更新排名
    rankingList.forEach((item, index) => {
      item.rank = index + 1;
    });
    
    const myRanking = rankingList.find(item => item.isMe);
    
    this.setData({
      rankingList: rankingList.slice(0, 100), // 只显示前100名
      myRanking,
      isEmpty: rankingList.length === 0
    });
  },

  /**
   * 查看排行榜
   */
  viewRanking() {
    this.setData({ showRankingModal: true });
  },

  /**
   * 关闭排行榜弹窗
   */
  closeRankingModal() {
    this.setData({ showRankingModal: false });
  },

  /**
   * 刷新当前标签页
   */
  async refreshCurrentTab() {
    await this.loadUserPoints();
    await this.loadTabData(this.data.activeTab);
  },

  /**
   * 加载更多数据
   */
  async loadMoreData() {
    // 根据当前标签页加载更多数据
    console.log('加载更多数据');
  },

  /**
   * 显示Toast
   */
  showToast(message) {
    this.setData({
      toastMessage: message,
      showToast: true
    });
  },

  /**
   * Toast关闭回调
   */
  onToastClose() {
    this.setData({ showToast: false });
  }
});