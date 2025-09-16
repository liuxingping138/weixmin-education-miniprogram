// utils/errorHandler.js - 统一错误处理

class ErrorHandler {
  constructor() {
    this.errorLog = [];
    this.maxLogSize = 100; // 最多保存100条错误日志
  }

  /**
   * 处理错误
   * @param {Error|string} error 错误对象或错误信息
   * @param {string} context 错误上下文
   * @param {object} options 处理选项
   */
  handle(error, context = 'Unknown', options = {}) {
    const errorInfo = this.formatError(error, context);
    
    // 记录错误日志
    this.logError(errorInfo);
    
    // 显示用户友好的错误提示
    this.showUserMessage(errorInfo, options);
    
    // 上报错误（如果需要）
    if (options.report !== false) {
      this.reportError(errorInfo);
    }
    
    // 执行特定的错误处理逻辑
    this.executeErrorAction(errorInfo, options);
  }

  /**
   * 格式化错误信息
   * @param {Error|string} error 错误
   * @param {string} context 上下文
   * @returns {object} 格式化后的错误信息
   */
  formatError(error, context) {
    const timestamp = new Date().toISOString();
    
    if (typeof error === 'string') {
      return {
        message: error,
        context,
        timestamp,
        type: 'custom'
      };
    }
    
    if (error instanceof Error) {
      return {
        message: error.message,
        stack: error.stack,
        name: error.name,
        context,
        timestamp,
        type: 'exception'
      };
    }
    
    // 网络错误
    if (error && error.errMsg) {
      return {
        message: error.errMsg,
        code: error.errno || error.errCode,
        context,
        timestamp,
        type: 'network'
      };
    }
    
    return {
      message: '未知错误',
      context,
      timestamp,
      type: 'unknown',
      raw: error
    };
  }

  /**
   * 记录错误日志
   * @param {object} errorInfo 错误信息
   */
  logError(errorInfo) {
    console.error(`[${errorInfo.context}] 错误:`, errorInfo);
    
    // 添加到错误日志
    this.errorLog.unshift(errorInfo);
    
    // 限制日志大小
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxLogSize);
    }
    
    // 持久化重要错误
    if (this.isImportantError(errorInfo)) {
      try {
        const savedErrors = wx.getStorageSync('error_log') || [];
        savedErrors.unshift(errorInfo);
        wx.setStorageSync('error_log', savedErrors.slice(0, 20));
      } catch (e) {
        console.warn('保存错误日志失败:', e);
      }
    }
  }

  /**
   * 显示用户友好的错误提示
   * @param {object} errorInfo 错误信息
   * @param {object} options 选项
   */
  showUserMessage(errorInfo, options) {
    if (options.silent) return;
    
    let userMessage = this.getUserFriendlyMessage(errorInfo);
    
    // 自定义消息
    if (options.message) {
      userMessage = options.message;
    }
    
    // 显示提示
    if (options.showModal) {
      wx.showModal({
        title: '提示',
        content: userMessage,
        showCancel: false,
        confirmText: '知道了'
      });
    } else {
      wx.showToast({
        title: userMessage,
        icon: 'none',
        duration: 3000
      });
    }
  }

  /**
   * 获取用户友好的错误消息
   * @param {object} errorInfo 错误信息
   * @returns {string} 用户友好的消息
   */
  getUserFriendlyMessage(errorInfo) {
    const { type, message, code } = errorInfo;
    
    // 网络错误
    if (type === 'network') {
      if (message.includes('timeout')) {
        return '网络连接超时，请检查网络后重试';
      }
      if (message.includes('fail')) {
        return '网络连接失败，请检查网络设置';
      }
      if (code === 600) {
        return '网络异常，请稍后重试';
      }
      return '网络连接异常，请检查网络后重试';
    }
    
    // 认证错误
    if (message.includes('auth') || message.includes('token')) {
      return '登录已过期，请重新登录';
    }
    
    // 权限错误
    if (message.includes('permission') || message.includes('unauthorized')) {
      return '没有操作权限，请联系管理员';
    }
    
    // 数据错误
    if (message.includes('data') || message.includes('parse')) {
      return '数据格式错误，请稍后重试';
    }
    
    // 服务器错误
    if (message.includes('server') || message.includes('500')) {
      return '服务器繁忙，请稍后重试';
    }
    
    // 默认消息
    return '操作失败，请稍后重试';
  }

  /**
   * 执行错误处理动作
   * @param {object} errorInfo 错误信息
   * @param {object} options 选项
   */
  executeErrorAction(errorInfo, options) {
    const { message, context } = errorInfo;
    
    // 认证过期，跳转登录
    if (message.includes('auth') || message.includes('token')) {
      setTimeout(() => {
        wx.reLaunch({
          url: '/pages/login/login'
        });
      }, 1500);
      return;
    }
    
    // 网络错误，提供重试选项
    if (errorInfo.type === 'network' && options.retry) {
      setTimeout(() => {
        wx.showModal({
          title: '网络异常',
          content: '是否重新尝试？',
          success: (res) => {
            if (res.confirm && typeof options.retry === 'function') {
              options.retry();
            }
          }
        });
      }, 1000);
    }
  }

  /**
   * 上报错误
   * @param {object} errorInfo 错误信息
   */
  reportError(errorInfo) {
    // 这里可以集成错误上报服务
    // 比如腾讯云监控、阿里云监控等
    console.log('错误上报:', errorInfo);
  }

  /**
   * 判断是否为重要错误
   * @param {object} errorInfo 错误信息
   * @returns {boolean}
   */
  isImportantError(errorInfo) {
    const importantContexts = ['API', 'Auth', 'Payment', 'Data'];
    return importantContexts.some(ctx => 
      errorInfo.context.includes(ctx)
    );
  }

  /**
   * 获取错误日志
   * @param {number} limit 限制数量
   * @returns {array} 错误日志
   */
  getErrorLog(limit = 20) {
    return this.errorLog.slice(0, limit);
  }

  /**
   * 清空错误日志
   */
  clearErrorLog() {
    this.errorLog = [];
    try {
      wx.removeStorageSync('error_log');
    } catch (e) {
      console.warn('清空错误日志失败:', e);
    }
  }
}

// 创建全局错误处理实例
const errorHandler = new ErrorHandler();

// 全局错误监听
wx.onError && wx.onError((error) => {
  errorHandler.handle(error, 'Global', { report: true });
});

// 全局未处理的Promise拒绝监听
wx.onUnhandledRejection && wx.onUnhandledRejection((res) => {
  errorHandler.handle(res.reason, 'Promise', { report: true });
});

module.exports = errorHandler;