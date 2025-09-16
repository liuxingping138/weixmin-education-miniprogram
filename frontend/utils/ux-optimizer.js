// utils/ux-optimizer.js - 用户体验优化工具类

class UXOptimizer {
  constructor() {
    this.animationQueue = [];
    this.isAnimating = false;
    this.touchStartTime = 0;
    this.touchStartPos = { x: 0, y: 0 };
    this.gestureHandlers = new Map();
    this.accessibilityEnabled = false;
  }

  /**
   * 初始化UX优化
   */
  init() {
    this.initAnimations();
    this.initGestures();
    this.initAccessibility();
    this.initResponsiveLayout();
    this.initHapticFeedback();
  }

  /**
   * 初始化动画系统
   */
  initAnimations() {
    // 检查设备性能，决定动画复杂度
    this.checkDevicePerformance();
    
    // 监听页面可见性变化，暂停/恢复动画
    wx.onAppShow(() => {
      this.resumeAnimations();
    });
    
    wx.onAppHide(() => {
      this.pauseAnimations();
    });
  }

  /**
   * 检查设备性能
   */
  checkDevicePerformance() {
    const systemInfo = wx.getSystemInfoSync();
    const { model, platform, version } = systemInfo;
    
    // 根据设备型号和系统版本判断性能等级
    let performanceLevel = 'high';
    
    if (platform === 'android') {
      // Android设备性能判断逻辑
      if (model.includes('Redmi') || model.includes('OPPO A') || model.includes('vivo Y')) {
        performanceLevel = 'low';
      } else if (model.includes('Xiaomi') || model.includes('OPPO') || model.includes('vivo')) {
        performanceLevel = 'medium';
      }
    } else if (platform === 'ios') {
      // iOS设备性能判断逻辑
      const versionNum = parseFloat(version);
      if (versionNum < 12) {
        performanceLevel = 'low';
      } else if (versionNum < 14) {
        performanceLevel = 'medium';
      }
    }
    
    this.performanceLevel = performanceLevel;
    this.setAnimationConfig(performanceLevel);
  }

  /**
   * 设置动画配置
   */
  setAnimationConfig(level) {
    const configs = {
      high: {
        duration: 300,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        enableComplexAnimations: true,
        maxConcurrentAnimations: 10
      },
      medium: {
        duration: 250,
        easing: 'ease-out',
        enableComplexAnimations: true,
        maxConcurrentAnimations: 5
      },
      low: {
        duration: 200,
        easing: 'ease',
        enableComplexAnimations: false,
        maxConcurrentAnimations: 3
      }
    };
    
    this.animationConfig = configs[level];
  }

  /**
   * 创建动画
   */
  createAnimation(options = {}) {
    const {
      duration = this.animationConfig.duration,
      easing = this.animationConfig.easing,
      delay = 0,
      fill = 'forwards'
    } = options;
    
    return wx.createAnimation({
      duration,
      timingFunction: easing,
      delay,
      transformOrigin: '50% 50%',
      fill
    });
  }

  /**
   * 页面进入动画
   */
  pageEnterAnimation(selector, options = {}) {
    const {
      type = 'slideInRight',
      duration = this.animationConfig.duration,
      delay = 0
    } = options;
    
    const animation = this.createAnimation({ duration, delay });
    
    switch (type) {
      case 'slideInRight':
        animation.translateX(0).opacity(1);
        break;
      case 'slideInLeft':
        animation.translateX(0).opacity(1);
        break;
      case 'slideInUp':
        animation.translateY(0).opacity(1);
        break;
      case 'slideInDown':
        animation.translateY(0).opacity(1);
        break;
      case 'fadeIn':
        animation.opacity(1);
        break;
      case 'zoomIn':
        animation.scale(1).opacity(1);
        break;
      default:
        animation.opacity(1);
    }
    
    return animation.export();
  }

  /**
   * 页面退出动画
   */
  pageExitAnimation(selector, options = {}) {
    const {
      type = 'slideOutLeft',
      duration = this.animationConfig.duration
    } = options;
    
    const animation = this.createAnimation({ duration });
    
    switch (type) {
      case 'slideOutLeft':
        animation.translateX(-100).opacity(0);
        break;
      case 'slideOutRight':
        animation.translateX(100).opacity(0);
        break;
      case 'slideOutUp':
        animation.translateY(-100).opacity(0);
        break;
      case 'slideOutDown':
        animation.translateY(100).opacity(0);
        break;
      case 'fadeOut':
        animation.opacity(0);
        break;
      case 'zoomOut':
        animation.scale(0).opacity(0);
        break;
      default:
        animation.opacity(0);
    }
    
    return animation.export();
  }

  /**
   * 列表项动画
   */
  listItemAnimation(index, options = {}) {
    const {
      type = 'slideInUp',
      stagger = 50
    } = options;
    
    const delay = index * stagger;
    return this.pageEnterAnimation(null, { type, delay });
  }

  /**
   * 按钮点击动画
   */
  buttonClickAnimation(selector) {
    if (!this.animationConfig.enableComplexAnimations) {
      return null;
    }
    
    const animation = this.createAnimation({ duration: 150 });
    animation.scale(0.95);
    
    setTimeout(() => {
      const resetAnimation = this.createAnimation({ duration: 150 });
      resetAnimation.scale(1);
      return resetAnimation.export();
    }, 150);
    
    return animation.export();
  }

  /**
   * 加载动画
   */
  loadingAnimation(selector) {
    const animation = this.createAnimation({ duration: 1000 });
    animation.rotate(360);
    
    const animationData = animation.export();
    
    // 循环动画
    const loop = () => {
      setTimeout(() => {
        if (this.isAnimating) {
          loop();
        }
      }, 1000);
    };
    
    this.isAnimating = true;
    loop();
    
    return animationData;
  }

  /**
   * 停止加载动画
   */
  stopLoadingAnimation() {
    this.isAnimating = false;
  }

  /**
   * 暂停所有动画
   */
  pauseAnimations() {
    this.isAnimating = false;
  }

  /**
   * 恢复所有动画
   */
  resumeAnimations() {
    this.isAnimating = true;
  }

  /**
   * 初始化手势识别
   */
  initGestures() {
    this.setupSwipeGestures();
    this.setupLongPressGestures();
  }

  /**
   * 设置滑动手势
   */
  setupSwipeGestures() {
    this.onTouchStart = (e) => {
      this.touchStartTime = Date.now();
      this.touchStartPos = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    };
    
    this.onTouchEnd = (e) => {
      const touchEndTime = Date.now();
      const touchEndPos = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      };
      
      const deltaTime = touchEndTime - this.touchStartTime;
      const deltaX = touchEndPos.x - this.touchStartPos.x;
      const deltaY = touchEndPos.y - this.touchStartPos.y;
      
      // 判断滑动方向和距离
      if (deltaTime < 300 && Math.abs(deltaX) > 50) {
        const direction = deltaX > 0 ? 'right' : 'left';
        this.triggerSwipeGesture(direction, { deltaX, deltaY, deltaTime });
      }
      
      if (deltaTime < 300 && Math.abs(deltaY) > 50) {
        const direction = deltaY > 0 ? 'down' : 'up';
        this.triggerSwipeGesture(direction, { deltaX, deltaY, deltaTime });
      }
    };
  }

  /**
   * 设置长按手势
   */
  setupLongPressGestures() {
    this.longPressTimer = null;
    
    this.onLongPressStart = (e) => {
      this.longPressTimer = setTimeout(() => {
        this.triggerLongPressGesture(e);
      }, 500);
    };
    
    this.onLongPressEnd = () => {
      if (this.longPressTimer) {
        clearTimeout(this.longPressTimer);
        this.longPressTimer = null;
      }
    };
  }

  /**
   * 触发滑动手势
   */
  triggerSwipeGesture(direction, details) {
    const handlers = this.gestureHandlers.get(`swipe-${direction}`);
    if (handlers) {
      handlers.forEach(handler => handler(details));
    }
  }

  /**
   * 触发长按手势
   */
  triggerLongPressGesture(e) {
    const handlers = this.gestureHandlers.get('longpress');
    if (handlers) {
      handlers.forEach(handler => handler(e));
    }
  }

  /**
   * 注册手势处理器
   */
  registerGestureHandler(gesture, handler) {
    if (!this.gestureHandlers.has(gesture)) {
      this.gestureHandlers.set(gesture, []);
    }
    this.gestureHandlers.get(gesture).push(handler);
  }

  /**
   * 移除手势处理器
   */
  removeGestureHandler(gesture, handler) {
    const handlers = this.gestureHandlers.get(gesture);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * 初始化无障碍访问
   */
  initAccessibility() {
    // 检查是否启用了无障碍功能
    this.checkAccessibilitySettings();
    
    // 设置语音播报
    this.setupVoiceOver();
    
    // 设置高对比度模式
    this.setupHighContrast();
  }

  /**
   * 检查无障碍设置
   */
  checkAccessibilitySettings() {
    try {
      const systemInfo = wx.getSystemInfoSync();
      // 这里可以根据系统信息判断是否启用了无障碍功能
      this.accessibilityEnabled = false; // 默认关闭，实际应用中可以通过设置页面控制
    } catch (error) {
      console.error('检查无障碍设置失败:', error);
    }
  }

  /**
   * 设置语音播报
   */
  setupVoiceOver() {
    this.speak = (text, options = {}) => {
      if (!this.accessibilityEnabled) return;
      
      const { rate = 1, pitch = 1, volume = 1 } = options;
      
      // 微信小程序暂不支持语音合成，这里是预留接口
      console.log(`语音播报: ${text}`);
    };
  }

  /**
   * 设置高对比度模式
   */
  setupHighContrast() {
    this.enableHighContrast = (enable = true) => {
      const className = enable ? 'high-contrast' : '';
      
      // 通过CSS类名控制高对比度样式
      try {
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];
        if (currentPage) {
          currentPage.setData({
            accessibilityClass: className
          });
        }
      } catch (error) {
        console.error('设置高对比度模式失败:', error);
      }
    };
  }

  /**
   * 初始化响应式布局
   */
  initResponsiveLayout() {
    this.getScreenInfo();
    this.setupBreakpoints();
  }

  /**
   * 获取屏幕信息
   */
  getScreenInfo() {
    const systemInfo = wx.getSystemInfoSync();
    
    this.screenInfo = {
      width: systemInfo.windowWidth,
      height: systemInfo.windowHeight,
      pixelRatio: systemInfo.pixelRatio,
      statusBarHeight: systemInfo.statusBarHeight,
      safeArea: systemInfo.safeArea
    };
    
    return this.screenInfo;
  }

  /**
   * 设置断点
   */
  setupBreakpoints() {
    const { width } = this.screenInfo;
    
    this.breakpoint = 'mobile'; // 默认移动端
    
    if (width >= 768) {
      this.breakpoint = 'tablet';
    }
    if (width >= 1024) {
      this.breakpoint = 'desktop';
    }
    
    return this.breakpoint;
  }

  /**
   * 获取响应式样式
   */
  getResponsiveStyle(styles) {
    const currentBreakpoint = this.breakpoint;
    
    if (styles[currentBreakpoint]) {
      return { ...styles.base, ...styles[currentBreakpoint] };
    }
    
    return styles.base || {};
  }

  /**
   * 初始化触觉反馈
   */
  initHapticFeedback() {
    this.hapticEnabled = true;
  }

  /**
   * 触觉反馈
   */
  hapticFeedback(type = 'light') {
    if (!this.hapticEnabled) return;
    
    const types = {
      light: 'light',
      medium: 'medium',
      heavy: 'heavy',
      success: 'success',
      warning: 'warning',
      error: 'error'
    };
    
    wx.vibrateShort({
      type: types[type] || 'light'
    });
  }

  /**
   * 页面转场动画
   */
  pageTransition(type = 'slide', direction = 'left') {
    const transitions = {
      slide: {
        left: 'slide-left',
        right: 'slide-right',
        up: 'slide-up',
        down: 'slide-down'
      },
      fade: {
        in: 'fade-in',
        out: 'fade-out'
      },
      zoom: {
        in: 'zoom-in',
        out: 'zoom-out'
      }
    };
    
    const transitionClass = transitions[type]?.[direction] || 'slide-left';
    
    return {
      animationType: transitionClass,
      animationDuration: this.animationConfig.duration
    };
  }

  /**
   * 智能加载状态
   */
  smartLoading(show = true, options = {}) {
    const {
      title = '加载中...',
      mask = true,
      timeout = 10000
    } = options;
    
    if (show) {
      wx.showLoading({
        title,
        mask
      });
      
      // 超时自动隐藏
      setTimeout(() => {
        wx.hideLoading();
      }, timeout);
    } else {
      wx.hideLoading();
    }
  }

  /**
   * 智能提示
   */
  smartToast(message, type = 'none', duration = 2000) {
    const icons = {
      success: 'success',
      error: 'error',
      warning: 'none',
      info: 'none',
      none: 'none'
    };
    
    wx.showToast({
      title: message,
      icon: icons[type],
      duration,
      mask: true
    });
    
    // 触觉反馈
    if (type === 'success') {
      this.hapticFeedback('success');
    } else if (type === 'error') {
      this.hapticFeedback('error');
    }
  }

  /**
   * 获取UX配置
   */
  getUXConfig() {
    return {
      performanceLevel: this.performanceLevel,
      animationConfig: this.animationConfig,
      screenInfo: this.screenInfo,
      breakpoint: this.breakpoint,
      accessibilityEnabled: this.accessibilityEnabled,
      hapticEnabled: this.hapticEnabled
    };
  }

  /**
   * 销毁UX优化器
   */
  destroy() {
    this.pauseAnimations();
    this.gestureHandlers.clear();
    
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
    }
  }
}

// 创建全局实例
const uxOptimizer = new UXOptimizer();

// 自动初始化
wx.onAppShow(() => {
  uxOptimizer.init();
});

module.exports = uxOptimizer;