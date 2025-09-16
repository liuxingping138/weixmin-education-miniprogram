// utils/mock.js
// Mock数据管理系统

/**
 * Mock数据生成器
 */
class MockDataGenerator {
  constructor() {
    this.enabled = true; // 是否启用Mock模式
    this.delay = 500; // 模拟网络延迟(ms)
  }

  // 生成随机ID
  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  // 生成随机姓名
  generateName() {
    const surnames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴'];
    const names = ['伟', '芳', '娜', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '涛', '明', '超', '秀英', '霞', '平', '刚'];
    return surnames[Math.floor(Math.random() * surnames.length)] + 
           names[Math.floor(Math.random() * names.length)];
  }

  // 生成随机头像
  generateAvatar() {
    const avatars = [
      '/images/avatar1.png',
      '/images/avatar2.png', 
      '/images/avatar3.png',
      '/images/avatar4.png',
      '/images/avatar5.png'
    ];
    return avatars[Math.floor(Math.random() * avatars.length)];
  }

  // 生成随机日期
  generateDate(daysAgo = 30) {
    const now = new Date();
    const randomDays = Math.floor(Math.random() * daysAgo);
    const date = new Date(now.getTime() - randomDays * 24 * 60 * 60 * 1000);
    return date.toISOString();
  }

  // 生成随机分数
  generateScore(min = 60, max = 100) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // 生成随机手机号
  generatePhone() {
    const prefixes = ['130', '131', '132', '133', '134', '135', '136', '137', '138', '139'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    return prefix + suffix;
  }

  // 模拟网络延迟
  async simulateDelay() {
    if (this.delay > 0) {
      await new Promise(resolve => setTimeout(resolve, this.delay));
    }
  }

  // 生成用户数据
  generateUser(type = 'student') {
    const baseUser = {
      id: this.generateId(),
      name: this.generateName(),
      avatar: this.generateAvatar(),
      phone: this.generatePhone(),
      createTime: this.generateDate(365),
      updateTime: this.generateDate(30)
    };

    switch (type) {
      case 'student':
        return {
          ...baseUser,
          role: 'student',
          studentNumber: '2024' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
          classId: 'class_' + Math.floor(Math.random() * 5 + 1),
          className: `高一${Math.floor(Math.random() * 10 + 1)}班`,
          grade: Math.floor(Math.random() * 3 + 1), // 1-3年级
          points: Math.floor(Math.random() * 1000),
          totalScore: this.generateScore(300, 450), // 总分450
          averageScore: this.generateScore(60, 95),
          homeworkCompleted: Math.floor(Math.random() * 50),
          homeworkTotal: Math.floor(Math.random() * 20) + 50,
          attendanceRate: (Math.random() * 0.3 + 0.7).toFixed(2) // 70%-100%
        };
      
      case 'teacher':
        return {
          ...baseUser,
          role: 'teacher',
          teacherNumber: 'T' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
          subject: ['数学', '语文', '英语', '物理', '化学'][Math.floor(Math.random() * 5)],
          classes: [`高一${Math.floor(Math.random() * 5 + 1)}班`, `高一${Math.floor(Math.random() * 5 + 6)}班`],
          experience: Math.floor(Math.random() * 20 + 1) + '年',
          title: ['助教', '讲师', '副教授', '教授'][Math.floor(Math.random() * 4)]
        };
      
      case 'parent':
        return {
          ...baseUser,
          role: 'parent',
          children: [this.generateId(), this.generateId()], // 孩子ID列表
          occupation: ['工程师', '医生', '教师', '销售', '经理'][Math.floor(Math.random() * 5)],
          relationship: ['父亲', '母亲'][Math.floor(Math.random() * 2)]
        };
      
      default:
        return baseUser;
    }
  }

  // 生成班级数据
  generateClass() {
    const classNumber = Math.floor(Math.random() * 10 + 1);
    const grade = Math.floor(Math.random() * 3 + 1);
    return {
      id: 'class_' + this.generateId(),
      name: `高${grade}年级${classNumber}班`,
      description: '积极向上的班级，团结友爱，共同进步',
      grade: grade,
      classNumber: classNumber,
      teacherId: 'teacher_' + this.generateId(),
      teacherName: this.generateName(),
      studentCount: Math.floor(Math.random() * 20 + 30), // 30-50人
      avgScore: this.generateScore(75, 90),
      completionRate: (Math.random() * 0.2 + 0.8).toFixed(2), // 80%-100%
      avatar: '/images/class-avatar.png',
      createTime: this.generateDate(365),
      updateTime: this.generateDate(7)
    };
  }

  // 生成作业数据
  generateHomework() {
    const subjects = ['数学', '语文', '英语', '物理', '化学', '生物', '历史', '地理'];
    const types = ['选择题', '填空题', '解答题', '综合题'];
    const statuses = ['pending', 'completed', 'graded', 'overdue'];
    
    return {
      id: 'hw_' + this.generateId(),
      title: `${subjects[Math.floor(Math.random() * subjects.length)]}作业${Math.floor(Math.random() * 100 + 1)}`,
      subject: subjects[Math.floor(Math.random() * subjects.length)],
      type: types[Math.floor(Math.random() * types.length)],
      description: '请认真完成以下题目，注意解题步骤和答题规范',
      teacherId: 'teacher_' + this.generateId(),
      teacherName: this.generateName(),
      classId: 'class_' + this.generateId(),
      className: `高${Math.floor(Math.random() * 3 + 1)}年级${Math.floor(Math.random() * 10 + 1)}班`,
      questionCount: Math.floor(Math.random() * 15 + 5), // 5-20题
      totalScore: Math.floor(Math.random() * 50 + 50), // 50-100分
      timeLimit: Math.floor(Math.random() * 60 + 30), // 30-90分钟
      deadline: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      submitCount: Math.floor(Math.random() * 40),
      totalStudents: Math.floor(Math.random() * 10 + 40),
      averageScore: this.generateScore(70, 90),
      createTime: this.generateDate(30),
      updateTime: this.generateDate(7)
    };
  }

  // 生成题目数据
  generateQuestion() {
    const types = ['single_choice', 'multiple_choice', 'fill_blank', 'essay'];
    const subjects = ['数学', '语文', '英语', '物理', '化学'];
    const difficulties = ['easy', 'medium', 'hard'];
    
    return {
      id: 'q_' + this.generateId(),
      type: types[Math.floor(Math.random() * types.length)],
      subject: subjects[Math.floor(Math.random() * subjects.length)],
      difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
      title: '这是一道测试题目，请根据题目要求选择正确答案',
      content: '题目内容详细描述...',
      options: ['选项A', '选项B', '选项C', '选项D'],
      correctAnswer: 'A',
      analysis: '这道题考查的是基础知识点，正确答案是A，因为...',
      score: Math.floor(Math.random() * 10 + 5), // 5-15分
      tags: ['基础', '重点', '易错'],
      createTime: this.generateDate(90),
      updateTime: this.generateDate(30)
    };
  }

  // 生成积分记录
  generatePointsRecord() {
    const types = ['homework_complete', 'attendance', 'performance', 'exchange', 'bonus'];
    const typeNames = {
      'homework_complete': '完成作业',
      'attendance': '出勤奖励', 
      'performance': '课堂表现',
      'exchange': '积分兑换',
      'bonus': '额外奖励'
    };
    
    const type = types[Math.floor(Math.random() * types.length)];
    const isExchange = type === 'exchange';
    
    return {
      id: 'pr_' + this.generateId(),
      userId: 'user_' + this.generateId(),
      type: type,
      typeName: typeNames[type],
      points: isExchange ? -Math.floor(Math.random() * 50 + 10) : Math.floor(Math.random() * 20 + 5),
      description: isExchange ? '兑换奖品消耗积分' : '获得积分奖励',
      relatedId: this.generateId(), // 关联的作业ID或商品ID
      createTime: this.generateDate(30),
      balance: Math.floor(Math.random() * 500 + 100) // 余额
    };
  }

  // 生成商品数据
  generateShopItem() {
    const categories = ['文具', '书籍', '电子产品', '生活用品', '体育用品'];
    const items = {
      '文具': ['定制笔记本', '精美钢笔', '文具礼盒', '创意橡皮'],
      '书籍': ['课外读物', '工具书', '名著经典', '学习指导'],
      '电子产品': ['蓝牙耳机', '充电宝', '数据线', '手机支架'],
      '生活用品': ['保温杯', '小台灯', '收纳盒', '抱枕'],
      '体育用品': ['跳绳', '羽毛球拍', '篮球', '运动毛巾']
    };
    
    const category = categories[Math.floor(Math.random() * categories.length)];
    const itemNames = items[category];
    const itemName = itemNames[Math.floor(Math.random() * itemNames.length)];
    
    return {
      id: 'item_' + this.generateId(),
      name: itemName,
      category: category,
      description: `精美的${itemName}，学习生活的好伙伴`,
      image: `/images/shop/${category.toLowerCase()}.png`,
      points: Math.floor(Math.random() * 200 + 50), // 50-250积分
      stock: Math.floor(Math.random() * 50 + 10), // 10-60库存
      sales: Math.floor(Math.random() * 100), // 销量
      status: Math.random() > 0.1 ? 'available' : 'sold_out', // 90%概率有货
      createTime: this.generateDate(90),
      updateTime: this.generateDate(7)
    };
  }

  // 生成AI建议数据
  generateAISuggestion() {
    const types = ['study_plan', 'weak_point', 'practice_recommend', 'learning_method'];
    const typeNames = {
      'study_plan': '学习计划建议',
      'weak_point': '薄弱点分析',
      'practice_recommend': '练习推荐',
      'learning_method': '学习方法'
    };
    
    const suggestions = {
      'study_plan': [
        '建议每天复习数学30分钟，重点练习函数题型',
        '制定周计划，合理分配各科学习时间',
        '建议增加英语阅读量，提高语感'
      ],
      'weak_point': [
        '数学几何题正确率较低，需要加强空间想象能力',
        '英语语法掌握不够扎实，建议系统复习',
        '物理力学部分理解不够深入'
      ],
      'practice_recommend': [
        '推荐练习二次函数相关题目',
        '建议多做阅读理解题提高语文成绩',
        '化学方程式需要反复练习记忆'
      ],
      'learning_method': [
        '采用费曼学习法，通过教授他人来检验理解程度',
        '使用思维导图整理知识点',
        '建议使用番茄工作法提高学习效率'
      ]
    };
    
    const type = types[Math.floor(Math.random() * types.length)];
    const suggestionList = suggestions[type];
    
    return {
      id: 'ai_' + this.generateId(),
      type: type,
      title: typeNames[type],
      description: suggestionList[Math.floor(Math.random() * suggestionList.length)],
      priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
      subject: ['数学', '语文', '英语', '物理', '化学'][Math.floor(Math.random() * 5)],
      confidence: (Math.random() * 0.3 + 0.7).toFixed(2), // 70%-100%置信度
      createTime: this.generateDate(7),
      applied: Math.random() > 0.5 // 是否已应用
    };
  }

  // 生成课件数据
  generateCourseware() {
    const subjects = ['数学', '语文', '英语', '物理', '化学', '生物'];
    const types = ['ppt', 'video', 'animation', 'document'];
    const typeNames = {
      'ppt': 'PPT课件',
      'video': '视频课件',
      'animation': '动画演示',
      'document': '文档资料'
    };
    
    const type = types[Math.floor(Math.random() * types.length)];
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    
    return {
      id: 'cw_' + this.generateId(),
      title: `${subject} - 第${Math.floor(Math.random() * 20 + 1)}章课件`,
      subject: subject,
      type: type,
      typeName: typeNames[type],
      description: `${subject}学科的精品课件，内容丰富，讲解详细`,
      teacherId: 'teacher_' + this.generateId(),
      teacherName: this.generateName(),
      fileUrl: `/courseware/${type}/${this.generateId()}.${type === 'ppt' ? 'pptx' : type === 'video' ? 'mp4' : 'pdf'}`,
      thumbnailUrl: `/images/courseware/${type}.png`,
      fileSize: Math.floor(Math.random() * 50 + 5) + 'MB', // 5-55MB
      duration: type === 'video' ? Math.floor(Math.random() * 30 + 10) + '分钟' : null,
      downloadCount: Math.floor(Math.random() * 500),
      viewCount: Math.floor(Math.random() * 1000),
      rating: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0评分
      tags: ['重点', '难点', '基础', '提高'].slice(0, Math.floor(Math.random() * 3 + 1)),
      createTime: this.generateDate(90),
      updateTime: this.generateDate(30)
    };
  }

  // 生成成长档案数据
  generateGrowthRecord() {
    const abilities = ['计算能力', '逻辑思维', '空间想象', '语言表达', '创新思维', '团队协作'];
    const subjects = ['数学', '语文', '英语', '物理', '化学', '生物'];
    
    return {
      id: 'gr_' + this.generateId(),
      studentId: 'student_' + this.generateId(),
      studentName: this.generateName(),
      recordDate: this.generateDate(30),
      semester: `2024年${Math.random() > 0.5 ? '上' : '下'}学期`,
      
      // 六边形能力分析
      abilities: {
        calculation: Math.floor(Math.random() * 40 + 60), // 计算能力 60-100
        logic: Math.floor(Math.random() * 40 + 60), // 逻辑思维
        spatial: Math.floor(Math.random() * 40 + 60), // 空间想象
        language: Math.floor(Math.random() * 40 + 60), // 语言表达
        creativity: Math.floor(Math.random() * 40 + 60), // 创新思维
        teamwork: Math.floor(Math.random() * 40 + 60) // 团队协作
      },
      
      // 学科成绩
      subjectScores: subjects.reduce((acc, subject) => {
        acc[subject] = {
          score: this.generateScore(60, 95),
          rank: Math.floor(Math.random() * 50 + 1),
          improvement: Math.floor(Math.random() * 20 - 10) // -10到+10的进步幅度
        };
        return acc;
      }, {}),
      
      // 综合评价
      overallRating: ['优秀', '良好', '中等', '待提高'][Math.floor(Math.random() * 4)],
      teacherComment: '该学生学习态度端正，成绩稳步提升，希望继续保持',
      parentComment: '孩子在家学习很认真，希望老师多多指导',
      
      // 学习统计
      studyStats: {
        homeworkCompleted: Math.floor(Math.random() * 50 + 80), // 完成作业数
        attendanceRate: (Math.random() * 0.1 + 0.9).toFixed(2), // 出勤率 90%-100%
        participationRate: (Math.random() * 0.3 + 0.7).toFixed(2), // 课堂参与度 70%-100%
        averageScore: this.generateScore(70, 90)
      },
      
      createTime: this.generateDate(90),
      updateTime: this.generateDate(7)
    };
  }

  // 批量生成数据
  generateBatch(type, count = 10) {
    const generators = {
      'user': () => this.generateUser(),
      'student': () => this.generateUser('student'),
      'teacher': () => this.generateUser('teacher'),
      'parent': () => this.generateUser('parent'),
      'class': () => this.generateClass(),
      'homework': () => this.generateHomework(),
      'question': () => this.generateQuestion(),
      'points': () => this.generatePointsRecord(),
      'shop': () => this.generateShopItem(),
      'ai': () => this.generateAISuggestion(),
      'courseware': () => this.generateCourseware(),
      'growth': () => this.generateGrowthRecord()
    };
    
    const generator = generators[type];
    if (!generator) {
      throw new Error(`Unknown data type: ${type}`);
    }
    
    return Array.from({ length: count }, () => generator());
  }
}

// 创建全局Mock数据生成器实例
const mockGenerator = new MockDataGenerator();

module.exports = {
  MockDataGenerator,
  mockGenerator
};