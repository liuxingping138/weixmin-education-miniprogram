// utils/mockConfig.js
// Mock配置管理

/**
 * Mock配置管理器
 */
class MockConfigManager {
  constructor() {
    this.config = {
      // 全局Mock开关
      enabled: true,
      
      // 网络延迟模拟(ms)
      delay: 800,
      
      // 错误模拟概率 (0-1)
      errorRate: 0.05,
      
      // 分页配置
      pagination: {
        defaultPageSize: 10,
        maxPageSize: 50
      },
      
      // 数据生成配置
      dataGeneration: {
        // 用户数据
        users: {
          students: 45,
          teachers: 8,
          parents: 30
        },
        
        // 业务数据
        business: {
          classes: 6,
          homework: 25,
          questions: 100,
          pointsRecords: 50,
          shopItems: 20,
          aiSuggestions: 15,
          courseware: 30,
          growthRecords: 20
        }
      },
      
      // 响应模板
      responseTemplates: {
        success: {
          code: 200,
          message: 'success'
        },
        error: {
          code: 500,
          message: 'Internal server error'
        },
        unauthorized: {
          code: 401,
          message: 'Unauthorized'
        },
        notFound: {
          code: 404,
          message: 'Not found'
        }
      },
      
      // 特殊场景配置
      scenarios: {
        // 登录场景
        login: {
          // 默认验证码
          defaultVerifyCode: '123456',
          // Token有效期(ms)
          tokenExpiry: 24 * 60 * 60 * 1000,
          // 支持的登录方式
          supportedMethods: ['phone', 'wechat']
        },
        
        // 作业场景
        homework: {
          // 自动批改延迟(ms)
          gradingDelay: 2000,
          // 默认正确率范围
          accuracyRange: [0.7, 0.95],
          // 支持的题型
          supportedTypes: ['single_choice', 'multiple_choice', 'fill_blank', 'essay']
        },
        
        // 积分场景
        points: {
          // 每日获得积分范围
          dailyEarnRange: [10, 50],
          // 兑换成功率
          exchangeSuccessRate: 0.95
        },
        
        // AI场景
        ai: {
          // 建议生成延迟(ms)
          suggestionDelay: 1500,
          // 置信度范围
          confidenceRange: [0.7, 0.95],
          // 支持的建议类型
          suggestionTypes: ['study_plan', 'weak_point', 'practice_recommend', 'learning_method']
        }
      }
    };
    
    // 从本地存储加载配置
    this.loadConfig();
  }

  // 加载配置
  loadConfig() {
    try {
      const savedConfig = wx.getStorageSync('mockConfig');
      if (savedConfig) {
        this.config = { ...this.config, ...JSON.parse(savedConfig) };
      }
    } catch (error) {
      console.warn('加载Mock配置失败:', error);
    }
  }

  // 保存配置
  saveConfig() {
    try {
      wx.setStorageSync('mockConfig', JSON.stringify(this.config));
    } catch (error) {
      console.error('保存Mock配置失败:', error);
    }
  }

  // 获取配置
  getConfig(path) {
    if (!path) return this.config;
    
    const keys = path.split('.');
    let value = this.config;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return undefined;
      }
    }
    
    return value;
  }

  // 设置配置
  setConfig(path, value) {
    const keys = path.split('.');
    let target = this.config;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!target[key] || typeof target[key] !== 'object') {
        target[key] = {};
      }
      target = target[key];
    }
    
    target[keys[keys.length - 1]] = value;
    this.saveConfig();
  }

  // 启用/禁用Mock
  setEnabled(enabled) {
    this.setConfig('enabled', enabled);
  }

  // 设置延迟
  setDelay(delay) {
    this.setConfig('delay', delay);
  }

  // 设置错误率
  setErrorRate(rate) {
    this.setConfig('errorRate', Math.max(0, Math.min(1, rate)));
  }

  // 是否启用Mock
  isEnabled() {
    return this.getConfig('enabled');
  }

  // 获取延迟时间
  getDelay() {
    return this.getConfig('delay') || 0;
  }

  // 获取错误率
  getErrorRate() {
    return this.getConfig('errorRate') || 0;
  }

  // 是否应该模拟错误
  shouldSimulateError() {
    return Math.random() < this.getErrorRate();
  }

  // 获取响应模板
  getResponseTemplate(type = 'success') {
    return this.getConfig(`responseTemplates.${type}`) || this.getConfig('responseTemplates.success');
  }

  // 获取场景配置
  getScenarioConfig(scenario) {
    return this.getConfig(`scenarios.${scenario}`) || {};
  }

  // 重置配置
  resetConfig() {
    wx.removeStorageSync('mockConfig');
    this.loadConfig();
  }

  // 导出配置
  exportConfig() {
    return JSON.stringify(this.config, null, 2);
  }

  // 导入配置
  importConfig(configJson) {
    try {
      const importedConfig = JSON.parse(configJson);
      this.config = { ...this.config, ...importedConfig };
      this.saveConfig();
      return true;
    } catch (error) {
      console.error('导入配置失败:', error);
      return false;
    }
  }

  // 获取调试信息
  getDebugInfo() {
    return {
      enabled: this.isEnabled(),
      delay: this.getDelay(),
      errorRate: this.getErrorRate(),
      dataCount: this.getConfig('dataGeneration'),
      scenarios: Object.keys(this.getConfig('scenarios') || {}),
      configSize: JSON.stringify(this.config).length
    };
  }
}

// 创建全局配置管理器实例
const mockConfigManager = new MockConfigManager();

// 开发环境下的快捷配置方法
const mockUtils = {
  // 快速启用Mock
  enable() {
    mockConfigManager.setEnabled(true);
    console.log('Mock模式已启用');
  },
  
  // 快速禁用Mock
  disable() {
    mockConfigManager.setEnabled(false);
    console.log('Mock模式已禁用');
  },
  
  // 设置快速模式(无延迟)
  fastMode() {
    mockConfigManager.setDelay(0);
    mockConfigManager.setErrorRate(0);
    console.log('Mock快速模式已启用');
  },
  
  // 设置真实模式(有延迟和错误)
  realMode() {
    mockConfigManager.setDelay(800);
    mockConfigManager.setErrorRate(0.05);
    console.log('Mock真实模式已启用');
  },
  
  // 设置调试模式(详细日志)
  debugMode() {
    mockConfigManager.setConfig('debug', true);
    console.log('Mock调试模式已启用');
  },
  
  // 显示配置信息
  showConfig() {
    console.table(mockConfigManager.getDebugInfo());
  },
  
  // 重置所有配置
  reset() {
    mockConfigManager.resetConfig();
    console.log('Mock配置已重置');
  }
};

// 在开发环境下暴露到全局
if (typeof global !== 'undefined') {
  global.mockUtils = mockUtils;
}

module.exports = {
  mockConfigManager,
  mockUtils
};