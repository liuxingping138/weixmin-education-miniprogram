// pages/mock-demo/mock-demo.js
// Mock数据系统演示页面

const { API, auth, classManagement, homework, points, ai } = require('../../utils/api.js');

Page({
  data: {
    mockEnabled: false,
    testResults: [],
    loading: false
  },

  onLoad() {
    this.setData({
      mockEnabled: API.isMockEnabled()
    });
  },

  // 切换Mock模式
  toggleMock() {
    if (API.isMockEnabled()) {
      API.disableMock();
    } else {
      API.enableMock();
      API.setMockDelay(500);
    }
    
    this.setData({
      mockEnabled: API.isMockEnabled()
    });

    wx.showToast({
      title: API.isMockEnabled() ? 'Mock模式已启用' : 'Mock模式已禁用',
      icon: 'success'
    });
  },

  // 测试所有API
  async testAllAPIs() {
    this.setData({ loading: true, testResults: [] });

    const tests = [
      {
        name: '用户登录',
        api: () => auth.login({ username: 'student001', password: '123456' })
      },
      {
        name: '获取班级列表',
        api: () => classManagement.getClassList()
      },
      {
        name: '获取作业列表',
        api: () => homework.getHomeworkList()
      },
      {
        name: '获取积分记录',
        api: () => points.getPointsHistory()
      },
      {
        name: '获取学习建议',
        api: () => ai.getStudySuggestions({ userId: 1, limit: 3 })
      },
      {
        name: '获取班级详情',
        api: () => classManagement.getClassDetail(1)
      },
      {
        name: '获取作业详情',
        api: () => homework.getHomeworkDetail(1)
      },
      {
        name: '获取积分统计',
        api: () => points.getPointsStats()
      }
    ];

    const results = [];

    for (const test of tests) {
      try {
        console.log(`开始测试: ${test.name}`);
        const startTime = Date.now();
        const result = await test.api();
        const endTime = Date.now();
        
        results.push({
          name: test.name,
          status: 'success',
          time: `${endTime - startTime}ms`,
          data: JSON.stringify(result, null, 2).substring(0, 200) + '...'
        });
        
        console.log(`${test.name} 测试成功:`, result);
      } catch (error) {
        results.push({
          name: test.name,
          status: 'error',
          time: '0ms',
          data: error.message || '未知错误'
        });
        
        console.error(`${test.name} 测试失败:`, error);
      }
    }

    this.setData({ 
      testResults: results,
      loading: false 
    });

    wx.showToast({
      title: '测试完成',
      icon: 'success'
    });
  },

  // 测试单个API
  async testSingleAPI(e) {
    const { api, name } = e.currentTarget.dataset;
    
    this.setData({ loading: true });

    try {
      let result;
      const startTime = Date.now();
      
      switch (api) {
        case 'login':
          result = await auth.login({ username: 'student001', password: '123456' });
          break;
        case 'classList':
          result = await classManagement.getClassList();
          break;
        case 'homeworkList':
          result = await homework.getHomeworkList();
          break;
        case 'pointsHistory':
          result = await points.getPointsHistory();
          break;
        default:
          throw new Error('未知的API');
      }
      
      const endTime = Date.now();
      
      wx.showModal({
        title: `${name} - 成功`,
        content: `耗时: ${endTime - startTime}ms\n\n数据: ${JSON.stringify(result, null, 2).substring(0, 300)}...`,
        showCancel: false
      });
      
    } catch (error) {
      wx.showModal({
        title: `${name} - 失败`,
        content: error.message || '未知错误',
        showCancel: false
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  // 清空测试结果
  clearResults() {
    this.setData({ testResults: [] });
  },

  // 查看详细结果
  viewDetail(e) {
    const index = e.currentTarget.dataset.index;
    const result = this.data.testResults[index];
    
    wx.showModal({
      title: result.name,
      content: `状态: ${result.status}\n耗时: ${result.time}\n\n数据:\n${result.data}`,
      showCancel: false
    });
  }
});