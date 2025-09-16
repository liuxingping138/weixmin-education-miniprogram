// pages/help/help.js - 使用帮助页面
const app = getApp();

Page({
  data: {
    userType: 'teacher',
    currentTab: 0,
    
    // 帮助内容
    helpSections: {
      teacher: [
        {
          id: 'getting_started',
          title: '快速开始',
          icon: 'play-circle',
          items: [
            {
              title: '登录系统',
              content: '使用您的教师账号登录智慧教育小程序',
              steps: [
                '打开小程序',
                '点击"教师登录"',
                '输入用户名和密码',
                '完成登录'
              ]
            },
            {
              title: '首次使用',
              content: '首次登录会有新手引导，建议完整体验',
              steps: [
                '观看新手引导',
                '了解主要功能',
                '设置个人信息',
                '开始使用'
              ]
            }
          ]
        },
        {
          id: 'class_management',
          title: '班级管理',
          icon: 'usergroup',
          items: [
            {
              title: '查看学生列表',
              content: '在班级管理页面可以查看所有学生信息',
              steps: [
                '进入"班级管理"',
                '查看学生列表',
                '点击学生查看详情',
                '了解学生学习情况'
              ]
            },
            {
              title: '学生排行榜',
              content: '查看学生的学习排名和积分情况',
              steps: [
                '切换到"排行榜"标签',
                '查看积分排名',
                '了解学生表现',
                '给予适当鼓励'
              ]
            }
          ]
        },
        {
          id: 'homework',
          title: '作业管理',
          icon: 'edit',
          items: [
            {
              title: '发布作业',
              content: '简单几步即可发布作业给学生',
              steps: [
                '点击"作业中心"',
                '选择"发布作业"',
                '填写作业信息',
                '选择班级并发布'
              ]
            },
            {
              title: '批改作业',
              content: '查看学生提交的作业并进行批改',
              steps: [
                '进入"作业中心"',
                '选择要批改的作业',
                '查看学生答案',
                '给出分数和评语'
              ]
            },
            {
              title: '使用模板',
              content: '使用预设模板快速创建作业',
              steps: [
                '在发布作业页面',
                '选择合适的模板',
                '修改模板内容',
                '直接发布'
              ]
            }
          ]
        },
        {
          id: 'statistics',
          title: '数据统计',
          icon: 'chart',
          items: [
            {
              title: '查看班级数据',
              content: '了解班级整体学习情况',
              steps: [
                '进入首页查看概览',
                '点击"数据统计"',
                '查看详细报表',
                '分析学习趋势'
              ]
            }
          ]
        }
      ],
      student: [
        {
          id: 'homework',
          title: '完成作业',
          icon: 'edit',
          items: [
            {
              title: '查看作业',
              content: '查看老师布置的作业任务',
              steps: [
                '进入"我的作业"',
                '查看待完成作业',
                '点击开始答题',
                '提交作业'
              ]
            },
            {
              title: '获得积分',
              content: '完成作业可以获得积分奖励',
              steps: [
                '认真完成作业',
                '及时提交',
                '获得积分',
                '查看积分余额'
              ]
            }
          ]
        },
        {
          id: 'points',
          title: '积分系统',
          icon: 'money-circle',
          items: [
            {
              title: '积分商城',
              content: '使用积分兑换奖励',
              steps: [
                '进入"积分商城"',
                '浏览商品',
                '选择心仪商品',
                '使用积分兑换'
              ]
            }
          ]
        }
      ],
      parent: [
        {
          id: 'children',
          title: '孩子管理',
          icon: 'user',
          items: [
            {
              title: '查看孩子信息',
              content: '了解孩子的学习情况',
              steps: [
                '进入"孩子管理"',
                '选择要查看的孩子',
                '查看学习数据',
                '了解学习进度'
              ]
            }
          ]
        }
      ]
    },
    
    // 常见问题
    faqList: [
      {
        question: '忘记密码怎么办？',
        answer: '请联系学校管理员重置密码，或使用"忘记密码"功能通过手机号找回。'
      },
      {
        question: '作业发布后可以修改吗？',
        answer: '作业发布后可以修改，但如果已有学生开始答题，建议谨慎修改以免影响学生。'
      },
      {
        question: '学生看不到作业怎么办？',
        answer: '请检查：1.作业是否发布给正确的班级 2.学生是否在该班级中 3.网络连接是否正常。'
      },
      {
        question: '如何查看学生的详细学习报告？',
        answer: '在班级管理页面点击具体学生，或在数据统计页面查看班级整体报告。'
      },
      {
        question: '积分系统如何工作？',
        answer: '学生完成作业、参与活动可获得积分，积分可在商城兑换奖励，激励学习积极性。'
      }
    ],
    
    // 联系方式
    contactInfo: {
      phone: '400-123-4567',
      email: 'support@wiseedu.com',
      wechat: 'WiseEdu_Support',
      workTime: '工作日 9:00-18:00'
    }
  },

  onLoad(options) {
    const userType = app.globalData.userType || 'teacher';
    this.setData({ userType });
  },

  // 切换标签
  onTabChange(e) {
    this.setData({
      currentTab: e.detail.value
    });
  },

  // 展开/收起FAQ
  toggleFAQ(e) {
    const index = e.currentTarget.dataset.index;
    const key = `faqList[${index}].expanded`;
    this.setData({
      [key]: !this.data.faqList[index].expanded
    });
  },

  // 复制联系方式
  copyContact(e) {
    const type = e.currentTarget.dataset.type;
    const { contactInfo } = this.data;
    
    let text = '';
    switch (type) {
      case 'phone':
        text = contactInfo.phone;
        break;
      case 'email':
        text = contactInfo.email;
        break;
      case 'wechat':
        text = contactInfo.wechat;
        break;
    }
    
    if (text) {
      wx.setClipboardData({
        data: text,
        success: () => {
          wx.showToast({
            title: '已复制到剪贴板',
            icon: 'success'
          });
        }
      });
    }
  },

  // 拨打电话
  makeCall() {
    wx.makePhoneCall({
      phoneNumber: this.data.contactInfo.phone
    });
  },

  // 反馈问题
  submitFeedback() {
    wx.navigateTo({
      url: '/pages/feedback/feedback'
    });
  },

  // 查看更新日志
  viewChangelog() {
    wx.navigateTo({
      url: '/pages/help/changelog'
    });
  }
});