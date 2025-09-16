// pages/courseware/courseware.js
Page({
  data: {
    // 页面状态
    loading: false,
    isEmpty: false,
    showToast: false,
    toastMessage: '',
    
    // 标签页状态
    activeTab: 'generate', // generate, animation, library
    
    // 课件统计数据
    coursewareStats: {
      totalCourseware: 0,
      animations: 0,
      templates: 0
    },
    
    // PPT生成相关
    subjects: [],
    selectedSubject: '',
    coursewareTitle: '',
    contentPoints: [''],
    templates: [],
    selectedTemplate: '',
    generating: false,
    generatedCourseware: [],
    
    // 知识动画相关
    animationCategories: [],
    selectedAnimationCategory: 'all',
    animations: [],
    filteredAnimations: [],
    
    // 课件库相关
    librarySubjects: [],
    selectedLibrarySubject: 'all',
    coursewareTypes: [],
    selectedCoursewareType: 'all',
    coursewareLibrary: [],
    filteredCourseware: [],
    
    // 弹窗状态
    showAnimationDetail: false,
    selectedAnimation: null,
    showCoursewareDetail: false,
    selectedCoursewareItem: null
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
      title: '智慧校园 - 智能课件制作',
      path: '/pages/courseware/courseware'
    };
  },

  /**
   * 初始化页面
   */
  async initPage() {
    this.setData({ loading: true });
    
    try {
      await Promise.all([
        this.loadCoursewareStats(),
        this.loadSubjects(),
        this.loadTemplates(),
        this.loadAnimations(),
        this.loadCoursewareLibrary()
      ]);
      
      this.filterAnimations();
      this.filterCourseware();
      
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
   * 加载课件统计数据
   */
  async loadCoursewareStats() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats = {
          totalCourseware: 156,
          animations: 89,
          templates: 24
        };
        this.setData({ coursewareStats: stats });
        resolve(stats);
      }, 300);
    });
  },

  /**
   * 加载科目列表
   */
  async loadSubjects() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const subjects = [
          { id: 'math', name: '数学', icon: '📐' },
          { id: 'chinese', name: '语文', icon: '📚' },
          { id: 'english', name: '英语', icon: '🔤' },
          { id: 'physics', name: '物理', icon: '⚛️' },
          { id: 'chemistry', name: '化学', icon: '🧪' },
          { id: 'biology', name: '生物', icon: '🧬' }
        ];
        
        const librarySubjects = [
          { id: 'all', name: '全部' },
          ...subjects
        ];
        
        this.setData({ subjects, librarySubjects });
        resolve(subjects);
      }, 200);
    });
  },

  /**
   * 加载模板列表
   */
  async loadTemplates() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const templates = [
          {
            id: 'modern',
            name: '现代简约',
            preview: '/images/templates/modern.png',
            description: '简洁现代的设计风格，适合各类学科'
          },
          {
            id: 'colorful',
            name: '活力彩色',
            preview: '/images/templates/colorful.png',
            description: '色彩丰富，适合小学和初中课程'
          },
          {
            id: 'academic',
            name: '学术风格',
            preview: '/images/templates/academic.png',
            description: '严谨的学术风格，适合高中和大学课程'
          },
          {
            id: 'creative',
            name: '创意设计',
            preview: '/images/templates/creative.png',
            description: '富有创意的设计，激发学习兴趣'
          }
        ];
        
        this.setData({ templates });
        resolve(templates);
      }, 250);
    });
  },

  /**
   * 加载动画数据
   */
  async loadAnimations() {
    return Promise.all([
      this.loadAnimationCategories(),
      this.loadAnimationList()
    ]);
  },

  /**
   * 加载动画分类
   */
  async loadAnimationCategories() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const categories = [
          { id: 'all', name: '全部' },
          { id: 'math', name: '数学' },
          { id: 'physics', name: '物理' },
          { id: 'chemistry', name: '化学' },
          { id: 'biology', name: '生物' },
          { id: 'geography', name: '地理' }
        ];
        
        this.setData({ animationCategories: categories });
        resolve(categories);
      }, 200);
    });
  },

  /**
   * 加载动画列表
   */
  async loadAnimationList() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const animations = [
          {
            id: 1,
            title: '二次函数图像变换',
            description: '生动展示二次函数图像的平移、伸缩变换过程',
            thumbnail: '/images/animations/quadratic.png',
            videoUrl: '/videos/quadratic.mp4',
            subject: '数学',
            category: 'math',
            duration: 3,
            views: 1248,
            collected: false,
            knowledgePoints: ['二次函数', '图像变换', '函数性质']
          },
          {
            id: 2,
            title: '电磁感应现象',
            description: '直观演示电磁感应的物理过程和原理',
            thumbnail: '/images/animations/electromagnetic.png',
            videoUrl: '/videos/electromagnetic.mp4',
            subject: '物理',
            category: 'physics',
            duration: 4,
            views: 892,
            collected: true,
            knowledgePoints: ['电磁感应', '法拉第定律', '楞次定律']
          },
          {
            id: 3,
            title: '化学反应速率',
            description: '动态展示影响化学反应速率的各种因素',
            thumbnail: '/images/animations/reaction_rate.png',
            videoUrl: '/videos/reaction_rate.mp4',
            subject: '化学',
            category: 'chemistry',
            duration: 5,
            views: 756,
            collected: false,
            knowledgePoints: ['反应速率', '催化剂', '温度影响']
          },
          {
            id: 4,
            title: '细胞分裂过程',
            description: '详细展示细胞分裂的各个阶段和特点',
            thumbnail: '/images/animations/cell_division.png',
            videoUrl: '/videos/cell_division.mp4',
            subject: '生物',
            category: 'biology',
            duration: 6,
            views: 1156,
            collected: true,
            knowledgePoints: ['细胞分裂', '染色体', '遗传物质']
          },
          {
            id: 5,
            title: '板块构造运动',
            description: '展示地球板块的运动和相互作用过程',
            thumbnail: '/images/animations/plate_tectonics.png',
            videoUrl: '/videos/plate_tectonics.mp4',
            subject: '地理',
            category: 'geography',
            duration: 4,
            views: 634,
            collected: false,
            knowledgePoints: ['板块构造', '地震', '火山']
          },
          {
            id: 6,
            title: '三角函数图像',
            description: '动态展示正弦、余弦函数的图像特征',
            thumbnail: '/images/animations/trigonometric.png',
            videoUrl: '/videos/trigonometric.mp4',
            subject: '数学',
            category: 'math',
            duration: 3,
            views: 987,
            collected: false,
            knowledgePoints: ['三角函数', '周期性', '图像特征']
          }
        ];
        
        this.setData({ animations });
        resolve(animations);
      }, 400);
    });
  },

  /**
   * 加载课件库数据
   */
  async loadCoursewareLibrary() {
    return Promise.all([
      this.loadCoursewareTypes(),
      this.loadCoursewareList()
    ]);
  },

  /**
   * 加载课件类型
   */
  async loadCoursewareTypes() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const types = [
          { id: 'all', name: '全部' },
          { id: 'lesson', name: '课堂教学' },
          { id: 'review', name: '复习总结' },
          { id: 'exercise', name: '习题讲解' },
          { id: 'experiment', name: '实验演示' }
        ];
        
        this.setData({ coursewareTypes: types });
        resolve(types);
      }, 200);
    });
  },

  /**
   * 加载课件列表
   */
  async loadCoursewareList() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const coursewareLibrary = [
          {
            id: 1,
            title: '二次函数的图像与性质',
            description: '全面讲解二次函数的图像特征、性质和应用',
            cover: '/images/courseware/quadratic_function.png',
            subject: '数学',
            subjectId: 'math',
            type: 'lesson',
            slides: 24,
            createTime: '2024-01-15',
            isNew: true,
            tags: ['函数', '图像', '性质']
          },
          {
            id: 2,
            title: '电磁感应定律详解',
            description: '深入解析法拉第电磁感应定律的原理和应用',
            cover: '/images/courseware/electromagnetic_law.png',
            subject: '物理',
            subjectId: 'physics',
            type: 'lesson',
            slides: 18,
            createTime: '2024-01-12',
            isNew: false,
            tags: ['电磁感应', '法拉第定律', '应用']
          },
          {
            id: 3,
            title: '化学平衡习题精讲',
            description: '精选化学平衡典型题目，详细讲解解题思路',
            cover: '/images/courseware/chemical_equilibrium.png',
            subject: '化学',
            subjectId: 'chemistry',
            type: 'exercise',
            slides: 16,
            createTime: '2024-01-10',
            isNew: false,
            tags: ['化学平衡', '习题', '解题技巧']
          },
          {
            id: 4,
            title: '细胞结构观察实验',
            description: '显微镜下观察植物细胞和动物细胞的结构特点',
            cover: '/images/courseware/cell_structure.png',
            subject: '生物',
            subjectId: 'biology',
            type: 'experiment',
            slides: 12,
            createTime: '2024-01-08',
            isNew: false,
            tags: ['细胞结构', '显微镜', '实验']
          },
          {
            id: 5,
            title: '古诗词鉴赏方法',
            description: '系统介绍古诗词鉴赏的方法和技巧',
            cover: '/images/courseware/poetry_appreciation.png',
            subject: '语文',
            subjectId: 'chinese',
            type: 'lesson',
            slides: 20,
            createTime: '2024-01-05',
            isNew: true,
            tags: ['古诗词', '鉴赏', '文学']
          },
          {
            id: 6,
            title: '英语语法总复习',
            description: '全面复习英语语法要点，梳理知识体系',
            cover: '/images/courseware/english_grammar.png',
            subject: '英语',
            subjectId: 'english',
            type: 'review',
            slides: 28,
            createTime: '2024-01-03',
            isNew: false,
            tags: ['语法', '复习', '知识体系']
          }
        ];
        
        this.setData({ coursewareLibrary });
        resolve(coursewareLibrary);
      }, 350);
    });
  },

  /**
   * 计算是否可以生成课件
   */
  get canGenerate() {
    const { selectedSubject, coursewareTitle, selectedTemplate } = this.data;
    return selectedSubject && coursewareTitle.trim() && selectedTemplate;
  },

  /**
   * 切换标签页
   */
  switchTab(e) {
    const { tab } = e.currentTarget.dataset;
    this.setData({ activeTab: tab });
  },

  /**
   * 选择科目
   */
  selectSubject(e) {
    const { subject } = e.currentTarget.dataset;
    this.setData({ selectedSubject: subject });
    this.updateCanGenerate();
  },

  /**
   * 课件标题输入
   */
  onTitleChange(e) {
    this.setData({ coursewareTitle: e.detail.value });
    this.updateCanGenerate();
  },

  /**
   * 内容要点输入
   */
  onPointChange(e) {
    const { index } = e.currentTarget.dataset;
    const { contentPoints } = this.data;
    const newPoints = [...contentPoints];
    newPoints[index] = e.detail.value;
    this.setData({ contentPoints: newPoints });
  },

  /**
   * 添加要点
   */
  addPoint() {
    const { contentPoints } = this.data;
    if (contentPoints.length < 8) {
      this.setData({ contentPoints: [...contentPoints, ''] });
    }
  },

  /**
   * 删除要点
   */
  deletePoint(e) {
    const { index } = e.currentTarget.dataset;
    const { contentPoints } = this.data;
    if (contentPoints.length > 1) {
      const newPoints = contentPoints.filter((_, i) => i !== index);
      this.setData({ contentPoints: newPoints });
    }
  },

  /**
   * 选择模板
   */
  selectTemplate(e) {
    const { template } = e.currentTarget.dataset;
    this.setData({ selectedTemplate: template });
    this.updateCanGenerate();
  },

  /**
   * 更新生成按钮状态
   */
  updateCanGenerate() {
    const canGenerate = this.canGenerate;
    this.setData({ canGenerate });
  },

  /**
   * 生成课件
   */
  async generateCourseware() {
    const { selectedSubject, coursewareTitle, contentPoints, selectedTemplate } = this.data;
    
    if (!this.canGenerate) {
      this.showToastMessage('请完善课件配置信息');
      return;
    }
    
    this.setData({ generating: true });
    
    try {
      // 模拟AI生成过程
      await this.simulateAIGeneration();
      
      const generatedCourseware = this.createMockCourseware(
        selectedSubject,
        coursewareTitle,
        contentPoints.filter(point => point.trim()),
        selectedTemplate
      );
      
      this.setData({ 
        generatedCourseware,
        generating: false
      });
      
      this.showToastMessage('课件生成成功！');
      
    } catch (error) {
      console.error('生成课件失败:', error);
      this.setData({ generating: false });
      this.showToastMessage('生成失败，请重试');
    }
  },

  /**
   * 模拟AI生成过程
   */
  async simulateAIGeneration() {
    return new Promise((resolve) => {
      setTimeout(resolve, 3000); // 模拟3秒生成时间
    });
  },

  /**
   * 创建模拟课件
   */
  createMockCourseware(subject, title, points, template) {
    const slides = [
      {
        id: 1,
        title: '课程标题',
        description: title,
        preview: `/images/slides/${template}_title.png`
      },
      {
        id: 2,
        title: '学习目标',
        description: '明确本节课的学习目标和重点',
        preview: `/images/slides/${template}_objectives.png`
      }
    ];
    
    // 为每个要点创建幻灯片
    points.forEach((point, index) => {
      slides.push({
        id: slides.length + 1,
        title: `要点 ${index + 1}`,
        description: point,
        preview: `/images/slides/${template}_content_${index + 1}.png`
      });
    });
    
    // 添加总结幻灯片
    slides.push({
      id: slides.length + 1,
      title: '课程总结',
      description: '回顾本节课的重点内容',
      preview: `/images/slides/${template}_summary.png`
    });
    
    return slides;
  },

  /**
   * 预览课件
   */
  previewCourseware() {
    const { generatedCourseware } = this.data;
    
    if (generatedCourseware.length === 0) {
      this.showToastMessage('请先生成课件');
      return;
    }
    
    // 跳转到预览页面
    wx.navigateTo({
      url: '/pages/preview/preview?type=courseware'
    });
  },

  /**
   * 下载课件
   */
  downloadCourseware() {
    const { generatedCourseware } = this.data;
    
    if (generatedCourseware.length === 0) {
      this.showToastMessage('请先生成课件');
      return;
    }
    
    // 模拟下载过程
    this.showToastMessage('课件下载中...');
    
    setTimeout(() => {
      this.showToastMessage('课件已保存到相册');
    }, 2000);
  },

  /**
   * 查看幻灯片
   */
  viewSlide(e) {
    const { slide } = e.currentTarget.dataset;
    
    // 跳转到幻灯片详情页面
    wx.navigateTo({
      url: `/pages/slide-detail/slide-detail?slideId=${slide.id}`
    });
  },

  /**
   * 选择动画分类
   */
  selectAnimationCategory(e) {
    const { category } = e.currentTarget.dataset;
    this.setData({ selectedAnimationCategory: category });
    this.filterAnimations();
  },

  /**
   * 筛选动画列表
   */
  filterAnimations() {
    const { animations, selectedAnimationCategory } = this.data;
    
    let filteredAnimations = animations;
    
    if (selectedAnimationCategory !== 'all') {
      filteredAnimations = animations.filter(item => item.category === selectedAnimationCategory);
    }
    
    this.setData({ filteredAnimations });
  },

  /**
   * 查看动画
   */
  viewAnimation(e) {
    const { animation } = e.currentTarget.dataset;
    this.setData({
      selectedAnimation: animation,
      showAnimationDetail: true
    });
  },

  /**
   * 收藏动画
   */
  collectAnimation(e) {
    const { animation } = e.currentTarget.dataset;
    const { animations } = this.data;
    
    const updatedAnimations = animations.map(item => {
      if (item.id === animation.id) {
        return { ...item, collected: !item.collected };
      }
      return item;
    });
    
    this.setData({ animations: updatedAnimations });
    this.filterAnimations();
    
    const message = animation.collected ? '取消收藏成功' : '收藏成功';
    this.showToastMessage(message);
  },

  /**
   * 关闭动画详情弹窗
   */
  closeAnimationDetail() {
    this.setData({ showAnimationDetail: false });
  },

  /**
   * 动画详情弹窗显示状态变化
   */
  onAnimationDetailClose(e) {
    if (!e.detail.visible) {
      this.setData({ showAnimationDetail: false });
    }
  },

  /**
   * 收藏选中的动画
   */
  collectSelectedAnimation() {
    const { selectedAnimation, animations } = this.data;
    
    if (!selectedAnimation) return;
    
    const updatedAnimations = animations.map(item => {
      if (item.id === selectedAnimation.id) {
        return { ...item, collected: !item.collected };
      }
      return item;
    });
    
    const updatedSelectedAnimation = {
      ...selectedAnimation,
      collected: !selectedAnimation.collected
    };
    
    this.setData({ 
      animations: updatedAnimations,
      selectedAnimation: updatedSelectedAnimation
    });
    this.filterAnimations();
    
    const message = selectedAnimation.collected ? '取消收藏成功' : '收藏成功';
    this.showToastMessage(message);
  },

  /**
   * 使用动画
   */
  useAnimation() {
    const { selectedAnimation } = this.data;
    
    if (!selectedAnimation) return;
    
    this.closeAnimationDetail();
    
    // 跳转到课件编辑页面，插入动画
    wx.navigateTo({
      url: `/pages/courseware-editor/courseware-editor?animationId=${selectedAnimation.id}`
    });
  },

  /**
   * 选择课件库科目
   */
  selectLibrarySubject(e) {
    const { subject } = e.currentTarget.dataset;
    this.setData({ selectedLibrarySubject: subject });
    this.filterCourseware();
  },

  /**
   * 选择课件类型
   */
  selectCoursewareType(e) {
    const { type } = e.currentTarget.dataset;
    this.setData({ selectedCoursewareType: type });
    this.filterCourseware();
  },

  /**
   * 筛选课件列表
   */
  filterCourseware() {
    const { coursewareLibrary, selectedLibrarySubject, selectedCoursewareType } = this.data;
    
    let filteredCourseware = coursewareLibrary;
    
    if (selectedLibrarySubject !== 'all') {
      filteredCourseware = filteredCourseware.filter(item => item.subjectId === selectedLibrarySubject);
    }
    
    if (selectedCoursewareType !== 'all') {
      filteredCourseware = filteredCourseware.filter(item => item.type === selectedCoursewareType);
    }
    
    this.setData({ filteredCourseware });
  },

  /**
   * 查看课件
   */
  viewCourseware(e) {
    const { courseware } = e.currentTarget.dataset;
    this.setData({
      selectedCoursewareItem: courseware,
      showCoursewareDetail: true
    });
  },

  /**
   * 下载课件项
   */
  downloadCoursewareItem(e) {
    const { courseware } = e.currentTarget.dataset;
    
    this.showToastMessage(`正在下载《${courseware.title}》...`);
    
    setTimeout(() => {
      this.showToastMessage('下载完成');
    }, 2000);
  },

  /**
   * 使用课件
   */
  useCourseware(e) {
    const { courseware } = e.currentTarget.dataset;
    
    // 跳转到课件使用页面
    wx.navigateTo({
      url: `/pages/courseware-viewer/courseware-viewer?coursewareId=${courseware.id}`
    });
  },

  /**
   * 关闭课件详情弹窗
   */
  closeCoursewareDetail() {
    this.setData({ showCoursewareDetail: false });
  },

  /**
   * 课件详情弹窗显示状态变化
   */
  onCoursewareDetailClose(e) {
    if (!e.detail.visible) {
      this.setData({ showCoursewareDetail: false });
    }
  },

  /**
   * 下载选中的课件
   */
  downloadSelectedCourseware() {
    const { selectedCoursewareItem } = this.data;
    
    if (!selectedCoursewareItem) return;
    
    this.showToastMessage(`正在下载《${selectedCoursewareItem.title}》...`);
    
    setTimeout(() => {
      this.showToastMessage('下载完成');
    }, 2000);
  },

  /**
   * 使用选中的课件
   */
  useSelectedCourseware() {
    const { selectedCoursewareItem } = this.data;
    
    if (!selectedCoursewareItem) return;
    
    this.closeCoursewareDetail();
    
    // 跳转到课件使用页面
    wx.navigateTo({
      url: `/pages/courseware-viewer/courseware-viewer?coursewareId=${selectedCoursewareItem.id}`
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