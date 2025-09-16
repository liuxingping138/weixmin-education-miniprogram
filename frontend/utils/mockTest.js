// utils/mockTest.js
// Mock数据系统测试文件

const { API, auth, classManagement, homework, points } = require('./api');

// 测试Mock数据系统
function testMockSystem() {
  console.log('=== Mock数据系统测试开始 ===');
  
  // 启用Mock模式
  API.enableMock();
  API.setMockDelay(500); // 设置500ms延迟模拟网络请求
  
  // 测试用户登录
  console.log('测试用户登录...');
  auth.login({
    username: 'student001',
    password: '123456'
  }).then(res => {
    console.log('登录结果:', res);
  }).catch(err => {
    console.error('登录失败:', err);
  });
  
  // 测试获取班级列表
  console.log('测试获取班级列表...');
  classManagement.getClassList().then(res => {
    console.log('班级列表:', res);
  }).catch(err => {
    console.error('获取班级列表失败:', err);
  });
  
  // 测试获取作业列表
  console.log('测试获取作业列表...');
  homework.getHomeworkList().then(res => {
    console.log('作业列表:', res);
  }).catch(err => {
    console.error('获取作业列表失败:', err);
  });
  
  // 测试获取积分记录
  console.log('测试获取积分记录...');
  points.getPointsHistory().then(res => {
    console.log('积分记录:', res);
  }).catch(err => {
    console.error('获取积分记录失败:', err);
  });
  
  console.log('=== Mock数据系统测试完成 ===');
}

// 导出测试函数
module.exports = {
  testMockSystem
};