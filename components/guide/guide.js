// components/guide/guide.js
Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    steps: {
      type: Array,
      value: []
    },
    currentStep: {
      type: Number,
      value: 0
    }
  },

  data: {
    
  },

  methods: {
    // 下一步
    nextStep() {
      this.triggerEvent('next');
    },

    // 上一步
    prevStep() {
      this.triggerEvent('prev');
    },

    // 跳过引导
    skipGuide() {
      this.triggerEvent('skip');
    },

    // 关闭引导
    closeGuide() {
      this.triggerEvent('close');
    },

    // 阻止冒泡
    preventBubble() {
      // 阻止点击内容区域时关闭引导
    }
  }
});