# 微信小程序前端

这是微信小程序教育平台的前端代码部分。

## 📁 目录结构

```
frontend/
├── app.js                          # 小程序入口文件
├── app.json                        # 小程序全局配置
├── app.wxss                        # 全局样式文件
├── sitemap.json                    # 站点地图配置
├── project.config.json             # 项目配置文件
├── package.json                    # 依赖管理
├── pages/                          # 页面文件
│   ├── index/                     # 首页
│   ├── class/                     # 班级管理
│   ├── homework/                  # 作业系统
│   ├── points/                    # 积分商城
│   ├── profile/                   # 个人中心
│   ├── ai/                        # AI助手
│   ├── courseware/                # 课件管理
│   ├── growth/                    # 成长分析
│   ├── help/                      # 帮助中心
│   ├── login/                     # 登录页面
│   ├── mistakes/                  # 错题本
│   ├── parent/                    # 家长端
│   ├── practice/                  # 练习模块
│   ├── register/                  # 注册页面
│   ├── settings/                  # 设置页面
│   └── shop/                      # 商城页面
├── components/                     # 自定义组件
│   ├── common-header/             # 通用头部组件
│   ├── empty-state/               # 空状态组件
│   ├── guide/                     # 引导组件
│   ├── loading-state/             # 加载状态组件
│   └── stat-card/                 # 统计卡片组件
├── utils/                         # 工具函数
│   ├── api.js                     # API接口定义
│   ├── request.js                 # 网络请求封装
│   ├── util.js                    # 通用工具函数
│   ├── cache.js                   # 缓存管理
│   ├── storage-manager.js         # 存储管理
│   ├── errorHandler.js            # 错误处理
│   ├── performance.js             # 性能监控
│   ├── ux-optimizer.js            # 用户体验优化
│   ├── mock.js                    # Mock数据
│   ├── mockConfig.js              # Mock配置
│   ├── mockTest.js                # Mock测试
│   └── test-framework.js          # 测试框架
├── data/                          # 数据文件
│   └── mockData.js                # Mock数据定义
├── images/                        # 图片资源
│   ├── avatar/                    # 头像图片
│   ├── courseware/                # 课件相关图片
│   ├── goods/                     # 商品图片
│   └── shop/                      # 商城图片
├── miniprogram_npm/               # 小程序npm包
│   └── tdesign-miniprogram/       # TDesign组件库
└── node_modules/                  # Node.js依赖包
```

## 🚀 快速开始

### 环境要求
- 微信开发者工具
- Node.js 16+

### 开发步骤

1. **安装依赖**
```bash
cd frontend
npm install
```

2. **导入微信开发者工具**
- 打开微信开发者工具
- 选择"导入项目"
- 选择 `frontend` 目录
- 填入 AppID

3. **开发调试**
- 在微信开发者工具中点击"编译"
- 使用模拟器或真机预览

## 🛠 技术栈

- **框架**: 微信小程序原生框架
- **UI库**: TDesign WeApp
- **语言**: JavaScript
- **样式**: WXSS
- **模板**: WXML

## 📝 开发规范

- 遵循微信小程序开发规范
- 使用TDesign组件库统一UI风格
- 组件化开发，提高代码复用性
- 合理使用Mock数据进行开发测试

## 🔗 相关链接

- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [TDesign WeApp 组件库](https://tdesign.tencent.com/miniprogram/overview)