// components/common-header/common-header.js
Component({
  properties: {
    // 标题
    title: {
      type: String,
      value: ''
    },
    // 副标题
    subtitle: {
      type: String,
      value: ''
    },
    // 背景类型
    bgType: {
      type: String,
      value: 'default' // default, gradient, image
    },
    // 背景图片
    bgImage: {
      type: String,
      value: ''
    },
    // 是否显示返回按钮
    showBack: {
      type: Boolean,
      value: false
    },
    // 右侧操作按钮
    rightActions: {
      type: Array,
      value: []
    },
    // 统计数据
    stats: {
      type: Array,
      value: []
    }
  },

  data: {
    
  },

  methods: {
    // 返回上一页
    onBack() {
      wx.navigateBack();
    },

    // 右侧按钮点击
    onRightAction(e) {
      const { action } = e.currentTarget.dataset;
      this.triggerEvent('rightaction', { action });
    },

    // 统计项点击
    onStatTap(e) {
      const { stat } = e.currentTarget.dataset;
      this.triggerEvent('stattap', { stat });
    }
  }
});