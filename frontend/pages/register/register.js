// pages/register/register.js
const app = getApp();
const { API } = require('../../utils/api.js');
const util = require('../../utils/util.js');

Page({
  data: {
    identity: '', // 用户身份
    step: 1, // 注册步骤：1-基本信息，2-身份验证，3-完善资料
    
    // 基本信息
    phone: '',
    verifyCode: '',
    password: '',
    confirmPassword: '',
    
    // 身份验证
    realName: '',
    idCard: '',
    
    // 学生信息
    studentId: '',
    grade: '',
    className: '',
    
    // 教师信息
    teacherId: '',
    subject: '',
    title: '',
    
    // 家长信息
    childName: '',
    childStudentId: '',
    relationship: 'father', // father, mother, guardian
    relationshipLabel: '父亲', // 显示用的关系标签
    
    // 验证码相关
    canSendCode: false,
    codeButtonText: '获取验证码',
    countdown: 0,
    
    // 表单验证
    canNext: false,
    submitLoading: false,
    
    // 选项数据
    grades: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
    subjects: ['语文', '数学', '英语', '科学', '音乐', '美术', '体育'],
    titles: ['助教', '讲师', '副教授', '教授'],
    relationships: [
      { value: 'father', label: '父亲' },
      { value: 'mother', label: '母亲' },
      { value: 'guardian', label: '监护人' }
    ],
    
    // UI状态
    showToast: false,
    toastMessage: ''
  },

  onLoad(options) {
    console.log('注册页面加载');
    
    // 启用Mock模式
    API.enableMock();
    
    // 获取身份类型
    const identity = options.identity || '';
    this.setData({ identity });
    
    this.checkCanNext();
  },

  // 手机号输入
  onPhoneInput(e) {
    const phone = e.detail.value;
    this.setData({ phone });
    
    // 验证手机号格式
    const canSendCode = util.validatePhone(phone);
    this.setData({ canSendCode });
    
    this.checkCanNext();
  },

  // 验证码输入
  onCodeInput(e) {
    const verifyCode = e.detail.value;
    this.setData({ verifyCode });
    this.checkCanNext();
  },

  // 密码输入
  onPasswordInput(e) {
    const password = e.detail.value;
    this.setData({ password });
    this.checkCanNext();
  },

  // 确认密码输入
  onConfirmPasswordInput(e) {
    const confirmPassword = e.detail.value;
    this.setData({ confirmPassword });
    this.checkCanNext();
  },

  // 真实姓名输入
  onRealNameInput(e) {
    const realName = e.detail.value;
    this.setData({ realName });
    this.checkCanNext();
  },

  // 身份证输入
  onIdCardInput(e) {
    const idCard = e.detail.value;
    this.setData({ idCard });
    this.checkCanNext();
  },

  // 学号输入
  onStudentIdInput(e) {
    const studentId = e.detail.value;
    this.setData({ studentId });
    this.checkCanNext();
  },

  // 年级选择
  onGradeChange(e) {
    const grade = this.data.grades[e.detail.value];
    this.setData({ grade });
    this.checkCanNext();
  },

  // 班级输入
  onClassNameInput(e) {
    const className = e.detail.value;
    this.setData({ className });
    this.checkCanNext();
  },

  // 教师工号输入
  onTeacherIdInput(e) {
    const teacherId = e.detail.value;
    this.setData({ teacherId });
    this.checkCanNext();
  },

  // 科目选择
  onSubjectChange(e) {
    const subject = this.data.subjects[e.detail.value];
    this.setData({ subject });
    this.checkCanNext();
  },

  // 职称选择
  onTitleChange(e) {
    const title = this.data.titles[e.detail.value];
    this.setData({ title });
    this.checkCanNext();
  },

  // 孩子姓名输入
  onChildNameInput(e) {
    const childName = e.detail.value;
    this.setData({ childName });
    this.checkCanNext();
  },

  // 孩子学号输入
  onChildStudentIdInput(e) {
    const childStudentId = e.detail.value;
    this.setData({ childStudentId });
    this.checkCanNext();
  },

  // 关系选择
  onRelationshipChange(e) {
    const selectedItem = this.data.relationships[e.detail.value];
    this.setData({ 
      relationship: selectedItem.value,
      relationshipLabel: selectedItem.label
    });
    this.checkCanNext();
  },

  // 发送验证码
  async sendVerifyCode() {
    const { phone, canSendCode, countdown } = this.data;
    
    if (!canSendCode || countdown > 0) {
      return;
    }

    try {
      const result = await API.auth.sendCode({ 
        phone,
        type: 'register'
      });
      
      console.log('验证码发送结果:', result);
      this.showToast('验证码已发送');
      this.startCountdown();
    } catch (error) {
      console.error('发送验证码失败:', error);
      this.showToast(error.message || '发送验证码失败');
    }
  },

  // 开始倒计时
  startCountdown() {
    let countdown = 60;
    this.setData({ 
      countdown,
      codeButtonText: `${countdown}s后重发`
    });

    const timer = setInterval(() => {
      countdown--;
      if (countdown <= 0) {
        clearInterval(timer);
        this.setData({
          countdown: 0,
          codeButtonText: '获取验证码'
        });
      } else {
        this.setData({
          countdown,
          codeButtonText: `${countdown}s后重发`
        });
      }
    }, 1000);
  },

  // 下一步
  nextStep() {
    const { step, canNext } = this.data;
    
    if (!canNext) {
      return;
    }

    if (step < 3) {
      this.setData({ 
        step: step + 1,
        canNext: false 
      });
      this.checkCanNext();
    } else {
      this.submitRegister();
    }
  },

  // 上一步
  prevStep() {
    const { step } = this.data;
    
    if (step > 1) {
      this.setData({ 
        step: step - 1,
        canNext: false 
      });
      this.checkCanNext();
    }
  },

  // 提交注册
  async submitRegister() {
    const { 
      identity, 
      phone, 
      verifyCode, 
      password, 
      realName, 
      idCard 
    } = this.data;

    try {
      this.setData({ submitLoading: true });

      // 构建注册数据
      let registerData = {
        phone,
        verifyCode,
        password,
        realName,
        idCard,
        identity
      };

      // 根据身份添加特定信息
      if (identity === 'student') {
        registerData = {
          ...registerData,
          studentId: this.data.studentId,
          grade: this.data.grade,
          className: this.data.className
        };
      } else if (identity === 'teacher') {
        registerData = {
          ...registerData,
          teacherId: this.data.teacherId,
          subject: this.data.subject,
          title: this.data.title
        };
      } else if (identity === 'parent') {
        registerData = {
          ...registerData,
          childName: this.data.childName,
          childStudentId: this.data.childStudentId,
          relationship: this.data.relationship
        };
      }

      const result = await API.auth.register(registerData);
      console.log('注册结果:', result);

      this.showToast('注册成功！');
      
      // 延迟跳转到登录页
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);

    } catch (error) {
      console.error('注册失败:', error);
      this.showToast(error.message || '注册失败');
    } finally {
      this.setData({ submitLoading: false });
    }
  },

  // 检查是否可以进行下一步
  checkCanNext() {
    const { step, identity } = this.data;
    let canNext = false;

    if (step === 1) {
      // 第一步：基本信息验证
      const { phone, verifyCode, password, confirmPassword } = this.data;
      canNext = util.validatePhone(phone) && 
                verifyCode.length === 6 && 
                password.length >= 6 && 
                password === confirmPassword;
    } else if (step === 2) {
      // 第二步：身份验证
      const { realName, idCard } = this.data;
      canNext = realName.length >= 2 && util.validateIdCard(idCard);
    } else if (step === 3) {
      // 第三步：完善资料
      if (identity === 'student') {
        const { studentId, grade, className } = this.data;
        canNext = studentId.length > 0 && grade && className.length > 0;
      } else if (identity === 'teacher') {
        const { teacherId, subject } = this.data;
        canNext = teacherId.length > 0 && subject;
      } else if (identity === 'parent') {
        const { childName, childStudentId } = this.data;
        canNext = childName.length >= 2 && childStudentId.length > 0;
      }
    }

    this.setData({ canNext });
  },

  // 返回登录页
  backToLogin() {
    wx.navigateBack();
  },

  // 显示Toast提示
  showToast(message) {
    this.setData({
      toastMessage: message,
      showToast: true
    });

    setTimeout(() => {
      this.setData({ showToast: false });
    }, 2000);
  }
});