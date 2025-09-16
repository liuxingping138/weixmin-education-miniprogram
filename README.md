# 微信小程序教育平台

> 基于微信小程序的智能教育管理平台，提供教学管理、课堂互动、学习评估、家校沟通等功能

## 📱 项目简介

本项目为 **教育类微信小程序**，目标用户为教师、学生及家长。小程序提供教学管理、课堂互动、学习评估、家校沟通等功能，利用 **AI 辅助与数据驱动** 提升课堂效率和学习体验。

## ✨ 核心功能

### 🏠 总览模块
- 数据仪表盘：全班和个人学习情况总览
- 学习进步曲线：学生学习进度趋势
- 班级对比：学生或班级成绩对比

### 👥 班级管理
- 学生档案管理：支持学习记录存档
- 班级排行榜：基于积分激励学生
- 小组对抗：小组竞赛和协作学习

### 🛒 积分商城
- 积分兑换：完成任务获取积分兑换奖品
- 奖品定制：教师上传带LOGO的专属奖品
- 活动奖励：结合班级活动发放额外积分

### 📝 作业系统
- 智能批改：选择题、填空题自动批改
- 错题本：个人错题自动整理
- 正确率分析：题目、班级正确率分析

### 📊 课件与课堂
- 自动PPT生成：知识点转化为课件
- 知识点动画：动画化讲解抽象概念
- 动态课件：支持课堂互动展示

### 🤖 AI 辅助
- 自动出题：根据课程内容生成题目
- 讲解提示：自动提供易错点与讲解建议
- 个性化推荐：学生专项练习推送

### 👨‍👩‍👧‍👦 家校互动
- 家长端报告：查看孩子学习情况
- 学习档案PDF：自动生成学期档案
- 微信群推送：一键分享题目与学习卡片

### 📈 学生成长
- 六边形能力分析：计算、逻辑、建模、分析、空间等
- 自评互评：学生自我和同伴评价
- 成长档案：长期成长记录

## 🛠 技术架构

### 前端技术栈
- **微信小程序框架**：原生 + WXML/WXSS + JavaScript
- **UI 库**：TDesign WeApp
- **图表展示**：ECharts 小程序版
- **状态管理**：原生数据绑定

### 后端技术栈
- **语言与框架**：Python + FastAPI
- **数据库**：MySQL
- **AI服务**：OpenAI API 集成
- **存储**：腾讯云 COS

## 📁 项目结构

```
weixmin-education-miniprogram/
├── frontend/              # 前端代码（微信小程序）
│   ├── pages/            # 页面文件
│   ├── components/       # 自定义组件
│   ├── utils/            # 工具函数
│   ├── data/             # Mock 数据
│   ├── images/           # 图片资源
│   ├── app.js            # 小程序入口
│   ├── app.json          # 小程序配置
│   ├── app.wxss          # 全局样式
│   └── package.json      # 前端依赖
├── backend/              # 后端代码（预留）
│   └── app/              # 后端应用
├── docs/                 # 项目文档
├── README.md             # 项目说明
└── .gitignore            # Git忽略文件
```

## 🚀 快速开始

### 环境要求
- 微信开发者工具
- Node.js 16+
- 微信小程序开发账号

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/liuxingping138/weixmin-education-miniprogram.git
cd weixmin-education-miniprogram
```

2. **安装前端依赖**
```bash
cd frontend
npm install
```

3. **导入微信开发者工具**
- 打开微信开发者工具
- 选择"导入项目"
- 选择 `frontend` 目录
- 填入 AppID（测试号或正式号）

4. **配置后端接口**
- 修改 `frontend/utils/api.js` 中的接口地址
- 配置相关的 API 密钥

5. **运行项目**
- 在微信开发者工具中点击"编译"
- 预览或真机调试

## 📖 开发文档

- [需求文档](./docs/教育小程序需求文档.md)
- [接口文档](./docs/教育小程序接口文档.md)
- [项目规范](./docs/微信小程序开发项目规范.md)
- [Mock数据说明](./docs/Mock数据系统说明.md)
- [开发总结](./docs/第1周开发总结-页面模板完善.md)
- [部署指南](./docs/部署指南.md)
- [开发文档](./docs/开发文档.md)

## 🗓 开发计划

- [x] **阶段一**：基础框架搭建（2周）
- [x] **阶段二**：核心功能开发（4周）
- [ ] **阶段三**：AI 辅助与课堂功能（3周）
- [ ] **阶段四**：家校互动与成长分析（2周）
- [ ] **阶段五**：测试与优化（2周）

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- 项目维护者：[liuxingping138](https://github.com/liuxingping138)
- 邮箱：xingping.l@telelands.com

## 🙏 致谢

- [TDesign WeApp](https://tdesign.tencent.com/miniprogram/overview) - UI 组件库
- [ECharts](https://echarts.apache.org/) - 图表库
- 微信小程序团队 - 开发平台支持