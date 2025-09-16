# Mock数据系统说明文档

## 系统概述

Mock数据系统是为微信小程序开发阶段设计的前端数据模拟解决方案，允许在没有后端服务的情况下进行完整的前端开发和测试。

## 系统架构

### 核心文件结构
```
utils/
├── mock.js           # Mock数据生成器
├── mockConfig.js     # Mock配置管理
├── request.js        # 请求拦截器（支持Mock模式）
└── api.js           # API接口管理（集成Mock控制）

data/
└── mockData.js      # 预生成的Mock数据

pages/
└── mock-demo/       # Mock系统演示页面
    ├── mock-demo.js
    ├── mock-demo.wxml
    ├── mock-demo.wxss
    └── mock-demo.json
```

## 核心功能

### 1. 智能数据生成 (utils/mock.js)
- **随机数据生成**: 姓名、头像、手机号、邮箱等
- **教育数据模拟**: 学生、教师、班级、作业、积分等
- **关联数据生成**: 保持数据间的逻辑关系
- **批量数据创建**: 支持生成大量测试数据

### 2. 配置管理系统 (utils/mockConfig.js)
- **动态开关控制**: 运行时启用/禁用Mock模式
- **延迟模拟**: 可配置网络延迟模拟真实环境
- **路由映射**: 灵活的API路由到Mock数据的映射
- **持久化配置**: 配置自动保存到本地存储

### 3. 请求拦截器 (utils/request.js)
- **透明拦截**: 无需修改现有API调用代码
- **智能路由**: 自动判断是否使用Mock数据
- **错误模拟**: 支持模拟网络错误和业务错误
- **日志记录**: 详细的请求日志便于调试

### 4. API集成 (utils/api.js)
- **统一接口**: 所有API调用保持一致
- **Mock控制**: 提供全局Mock开关方法
- **模块化设计**: 按功能模块组织API接口

## 使用方法

### 1. 基础使用

```javascript
// 在页面中引入API
const { API, auth, homework } = require('../../utils/api.js');

// 启用Mock模式
API.enableMock();
API.setMockDelay(500); // 设置500ms延迟

// 正常调用API，会自动使用Mock数据
const result = await auth.login({
  username: 'student001',
  password: '123456'
});
```

### 2. 全局控制

```javascript
// 在app.js中全局控制
const app = getApp();

// 启用Mock模式
app.enableMock(300);

// 禁用Mock模式
app.disableMock();

// 检查Mock状态
const isEnabled = app.isMockEnabled();
```

### 3. 自定义Mock数据

```javascript
// 在mockConfig.js中添加新的路由
mockConfigManager.addRoute('/custom/api', (options) => {
  return {
    code: 200,
    message: 'success',
    data: {
      // 自定义数据
    }
  };
});
```

## 预置数据

### 用户数据
- **学生**: 50个虚拟学生账户
- **教师**: 10个虚拟教师账户  
- **家长**: 20个虚拟家长账户

### 教学数据
- **班级**: 5个虚拟班级
- **作业**: 100个虚拟作业
- **课件**: 30个虚拟课件
- **积分记录**: 500条积分变动记录

### 系统数据
- **商城商品**: 20个虚拟商品
- **学习建议**: 50条AI学习建议
- **成长档案**: 完整的学生成长数据

## 开发流程

### 1. 开发阶段
```javascript
// 启用Mock模式进行开发
API.enableMock();
API.setMockDelay(300); // 模拟网络延迟

// 正常编写业务逻辑
const homeworkList = await homework.getHomeworkList();
```

### 2. 测试阶段
```javascript
// 使用Mock演示页面进行测试
// 访问 pages/mock-demo/mock-demo 页面
// 可以测试所有API接口的Mock响应
```

### 3. 生产阶段
```javascript
// 禁用Mock模式，使用真实API
API.disableMock();
```

## 演示页面

访问 `pages/mock-demo/mock-demo` 页面可以：
- 实时切换Mock模式开关
- 测试所有API接口
- 查看Mock数据响应
- 监控请求耗时
- 验证数据格式

## 配置选项

### Mock配置参数
```javascript
{
  enabled: true,        // 是否启用Mock
  delay: 300,          // 响应延迟(ms)
  autoInit: true,      // 自动初始化
  logRequests: true,   // 记录请求日志
  errorRate: 0         // 错误率(0-1)
}
```

### 应用配置
```javascript
// app.js中的Mock配置
globalData: {
  mockConfig: {
    enabled: true,     // 开发阶段默认启用
    delay: 300,        // 默认延迟
    autoInit: true     // 自动初始化
  }
}
```

## 最佳实践

### 1. 开发建议
- 开发阶段始终启用Mock模式
- 设置合理的网络延迟模拟真实环境
- 定期更新Mock数据保持数据新鲜度
- 使用演示页面验证API功能

### 2. 数据管理
- 保持Mock数据的逻辑一致性
- 定期清理过期的测试数据
- 为不同测试场景准备不同数据集
- 模拟各种边界情况和异常状态

### 3. 团队协作
- 统一Mock数据格式和规范
- 共享Mock配置和测试用例
- 文档化自定义Mock接口
- 定期同步Mock数据更新

## 技术特性

### 1. 性能优化
- 懒加载Mock数据
- 内存缓存常用数据
- 异步数据生成
- 智能数据复用

### 2. 扩展性
- 插件化架构设计
- 支持自定义数据生成器
- 灵活的路由配置
- 可扩展的数据类型

### 3. 调试支持
- 详细的日志输出
- 请求响应时间统计
- 数据格式验证
- 错误堆栈追踪

## 注意事项

1. **生产环境**: 确保在生产环境中禁用Mock模式
2. **数据安全**: Mock数据仅用于开发测试，不包含真实用户信息
3. **性能影响**: Mock模式会增加一定的内存使用
4. **版本兼容**: 确保Mock数据格式与后端API保持一致

## 更新日志

### v1.0.0 (2024-01-15)
- ✅ 完整的Mock数据系统
- ✅ 智能请求拦截器
- ✅ 可视化演示页面
- ✅ 全局配置管理
- ✅ 教育场景数据模拟
- ✅ 完整的API接口覆盖

---

Mock数据系统让前端开发更加高效，无需等待后端接口即可进行完整的功能开发和测试。