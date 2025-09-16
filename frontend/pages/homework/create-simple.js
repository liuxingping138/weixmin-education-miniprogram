// pages/homework/create-simple.js - 简化版作业发布
const app = getApp();
const util = require('../../utils/util.js');
const cache = require('../../utils/cache.js');
const errorHandler = require('../../utils/errorHandler.js');

// 安全地引入API模块
let homework;
try {
  const apiModule = require('../../utils/api.js');
  ({ homework } = apiModule);
} catch (e) {
  console.warn('API模块加载失败:', e);
}

Page({
  data: {
    // 基本信息
    title: '',
    description: '',
    subject: 'math',
    subjectIndex: 0,
    dueDate: '',
    dueTime: '18:00',
    
    // 科目选项
    subjects: [
      { value: 'math', label: '数学' },
      { value: 'chinese', label: '语文' },
      { value: 'english', label: '英语' },
      { value: 'science', label: '科学' },
      { value: 'other', label: '其他' }
    ],
    
    // 班级选择
    selectedClasses: [],
    classList: [],
    
    // 题目列表
    questions: [],
    
    // 状态
    loading: false,
    submitting: false,
    
    // 表单验证
    errors: {}
  },

  onLoad(options) {
    this.initPage();
  },

  // 初始化页面
  async initPage() {
    try {
      this.setData({ loading: true });
      
      // 设置默认截止日期为明天
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const defaultDate = util.formatDate(tomorrow, 'YYYY-MM-DD');
      
      // 加载班级列表
      await this.loadClassList();
      
      this.setData({
        dueDate: defaultDate
      });
      
    } catch (error) {
      errorHandler.handle(error, '页面初始化');
    } finally {
      this.setData({ loading: false });
    }
  },

  // 加载班级列表
  async loadClassList() {
    try {
      // 从缓存获取或模拟数据
      let classList = cache.get('teacher_classes');
      
      if (!classList) {
        // 模拟班级数据
        classList = [
          { id: '1', name: '三年级一班', studentCount: 35 },
          { id: '2', name: '三年级二班', studentCount: 32 },
          { id: '3', name: '四年级一班', studentCount: 38 }
        ];
        cache.set('teacher_classes', classList, 10 * 60 * 1000);
      }
      
      this.setData({ classList });
      
    } catch (error) {
      console.warn('班级列表加载失败:', error);
    }
  },

  // 表单输入处理
  onTitleInput(e) {
    this.setData({ 
      title: e.detail.value,
      'errors.title': ''
    });
  },

  onDescriptionInput(e) {
    this.setData({ 
      description: e.detail.value,
      'errors.description': ''
    });
  },

  onSubjectChange(e) {
    const index = e.detail.value;
    this.setData({ 
      subjectIndex: index,
      subject: this.data.subjects[index].value 
    });
  },

  onDueDateChange(e) {
    this.setData({ dueDate: e.detail.value });
  },

  onDueTimeChange(e) {
    this.setData({ dueTime: e.detail.value });
  },

  // 班级选择
  onClassToggle(e) {
    const classId = e.currentTarget.dataset.id;
    const { selectedClasses } = this.data;
    
    const index = selectedClasses.indexOf(classId);
    if (index > -1) {
      selectedClasses.splice(index, 1);
    } else {
      selectedClasses.push(classId);
    }
    
    this.setData({ 
      selectedClasses: [...selectedClasses],
      'errors.classes': ''
    });
  },

  // 添加题目
  addQuestion() {
    const { questions } = this.data;
    const newQuestion = {
      id: Date.now(),
      type: 'text',
      content: '',
      answer: '',
      points: 10
    };
    
    questions.push(newQuestion);
    this.setData({ questions });
  },

  // 删除题目
  removeQuestion(e) {
    const index = e.currentTarget.dataset.index;
    const { questions } = this.data;
    
    questions.splice(index, 1);
    this.setData({ questions });
  },

  // 题目内容输入
  onQuestionInput(e) {
    const { index, field } = e.currentTarget.dataset;
    const value = e.detail.value;
    const { questions } = this.data;
    
    questions[index][field] = value;
    this.setData({ questions });
  },

  // 表单验证
  validateForm() {
    const { title, description, selectedClasses, dueDate } = this.data;
    const errors = {};
    
    if (!title.trim()) {
      errors.title = '请输入作业标题';
    }
    
    if (!description.trim()) {
      errors.description = '请输入作业描述';
    }
    
    if (selectedClasses.length === 0) {
      errors.classes = '请选择至少一个班级';
    }
    
    if (!dueDate) {
      errors.dueDate = '请选择截止日期';
    }
    
    this.setData({ errors });
    return Object.keys(errors).length === 0;
  },

  // 预览作业
  previewHomework() {
    if (!this.validateForm()) {
      wx.showToast({
        title: '请完善作业信息',
        icon: 'none'
      });
      return;
    }
    
    const homeworkData = this.getHomeworkData();
    
    wx.navigateTo({
      url: `/pages/homework/preview?data=${encodeURIComponent(JSON.stringify(homeworkData))}`
    });
  },

  // 发布作业
  async publishHomework() {
    if (!this.validateForm()) {
      wx.showToast({
        title: '请完善作业信息',
        icon: 'none'
      });
      return;
    }
    
    try {
      this.setData({ submitting: true });
      
      const homeworkData = this.getHomeworkData();
      
      // 显示确认对话框
      const result = await this.showConfirmDialog(homeworkData);
      if (!result) return;
      
      // 模拟发布作业
      await this.submitHomework(homeworkData);
      
      wx.showToast({
        title: '作业发布成功',
        icon: 'success'
      });
      
      // 延迟返回上一页
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
      
    } catch (error) {
      errorHandler.handle(error, '作业发布', {
        message: '作业发布失败，请重试'
      });
    } finally {
      this.setData({ submitting: false });
    }
  },

  // 获取作业数据
  getHomeworkData() {
    const { 
      title, 
      description, 
      subject, 
      dueDate, 
      dueTime, 
      selectedClasses, 
      questions,
      classList
    } = this.data;
    
    const selectedClassNames = selectedClasses.map(id => {
      const classInfo = classList.find(c => c.id === id);
      return classInfo ? classInfo.name : '';
    }).filter(Boolean);
    
    return {
      title: title.trim(),
      description: description.trim(),
      subject,
      dueDateTime: `${dueDate} ${dueTime}`,
      classes: selectedClasses,
      classNames: selectedClassNames,
      questions: questions.filter(q => q.content.trim()),
      totalPoints: questions.reduce((sum, q) => sum + (q.points || 0), 0),
      createTime: new Date().toISOString()
    };
  },

  // 显示确认对话框
  showConfirmDialog(homeworkData) {
    return new Promise((resolve) => {
      const classNames = homeworkData.classNames.join('、');
      const questionCount = homeworkData.questions.length;
      
      wx.showModal({
        title: '确认发布作业',
        content: `作业：${homeworkData.title}\n班级：${classNames}\n题目：${questionCount}道\n截止：${homeworkData.dueDateTime}`,
        confirmText: '发布',
        cancelText: '取消',
        success: (res) => {
          resolve(res.confirm);
        }
      });
    });
  },

  // 提交作业数据
  async submitHomework(homeworkData) {
    try {
      // 模拟API调用
      if (homework && homework.createHomework) {
        await homework.createHomework(homeworkData);
      } else {
        // 模拟延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('作业发布成功:', homeworkData);
      }
      
      // 清除相关缓存
      cache.remove('homework_list');
      cache.remove('teacher_stats');
      
    } catch (error) {
      throw new Error('作业发布失败');
    }
  },

  // 保存草稿
  saveDraft() {
    const homeworkData = this.getHomeworkData();
    const draftKey = `homework_draft_${Date.now()}`;
    
    wx.setStorageSync(draftKey, {
      ...homeworkData,
      isDraft: true,
      saveTime: new Date().toISOString()
    });
    
    wx.showToast({
      title: '草稿已保存',
      icon: 'success'
    });
  },

  // 快速模板
  useTemplate(e) {
    const templateType = e.currentTarget.dataset.type;
    
    const templates = {
      math: {
        title: '数学练习',
        description: '请认真完成以下数学题目，注意计算过程。',
        questions: [
          { id: 1, type: 'text', content: '计算：25 + 37 = ?', answer: '62', points: 10 },
          { id: 2, type: 'text', content: '计算：84 - 29 = ?', answer: '55', points: 10 }
        ]
      },
      chinese: {
        title: '语文作业',
        description: '请完成以下语文练习，注意书写工整。',
        questions: [
          { id: 1, type: 'text', content: '写出下列词语的近义词：美丽', answer: '漂亮', points: 5 },
          { id: 2, type: 'text', content: '造句：因为...所以...', answer: '', points: 10 }
        ]
      },
      english: {
        title: 'English Homework',
        description: '请完成以下英语练习。',
        questions: [
          { id: 1, type: 'text', content: 'Translate: Hello', answer: '你好', points: 5 },
          { id: 2, type: 'text', content: 'Spell: 苹果', answer: 'apple', points: 5 }
        ]
      }
    };
    
    const template = templates[templateType];
    if (template) {
      this.setData({
        title: template.title,
        description: template.description,
        questions: template.questions,
        subject: templateType
      });
      
      wx.showToast({
        title: '模板已应用',
        icon: 'success'
      });
    }
  }
});