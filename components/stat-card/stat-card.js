// components/stat-card/stat-card.js
Component({
  properties: {
    // 统计数据
    stats: {
      type: Array,
      value: []
    },
    // 卡片标题
    title: {
      type: String,
      value: ''
    },
    // 布局类型
    layout: {
      type: String,
      value: 'grid' // grid, row, column
    },
    // 背景类型
    background: {
      type: String,
      value: 'white' // white, gradient, transparent
    }
  },

  data: {
    
  },

  methods: {
    // 统计项点击
    onStatTap(e) {
      const { stat } = e.currentTarget.dataset;
      this.triggerEvent('stattap', { stat });
    }
  }
});