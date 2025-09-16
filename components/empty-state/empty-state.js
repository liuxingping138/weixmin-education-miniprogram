// components/empty-state/empty-state.js
Component({
  properties: {
    // 是否显示空状态
    show: {
      type: Boolean,
      value: false
    },
    // 图标
    icon: {
      type: String,
      value: '📝'
    },
    // 标题
    title: {
      type: String,
      value: '暂无数据'
    },
    // 描述
    description: {
      type: String,
      value: ''
    },
    // 按钮文本
    buttonText: {
      type: String,
      value: ''
    },
    // 按钮类型
    buttonType: {
      type: String,
      value: 'primary'
    }
  },

  data: {
    
  },

  methods: {
    // 按钮点击事件
    onButtonTap() {
      this.triggerEvent('buttontap');
    }
  }
});