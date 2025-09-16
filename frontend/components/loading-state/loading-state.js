// components/loading-state/loading-state.js
Component({
  properties: {
    // 是否显示加载状态
    loading: {
      type: Boolean,
      value: false
    },
    // 加载文本
    text: {
      type: String,
      value: '加载中...'
    },
    // 加载类型
    type: {
      type: String,
      value: 'spinner' // spinner, dots, circular
    },
    // 大小
    size: {
      type: String,
      value: 'medium' // small, medium, large
    }
  },

  data: {
    
  },

  methods: {
    
  }
});