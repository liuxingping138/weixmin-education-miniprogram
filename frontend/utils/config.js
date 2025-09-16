/**
 * 应用配置文件
 * @description 统一管理应用配置，包括API模式切换
 * @author CodeBuddy
 * @date 2025-09-16
 */

// 开发环境配置
export const DEV_CONFIG = {
  // API模式：'mock' | 'real'
  API_MODE: 'mock',
  
  // Mock API配置
  MOCK_CONFIG: {
    delay: 300,           // 模拟网络延迟(ms)
    enableLog: true,      // 是否启用日志
    errorRate: 0.05       // 模拟错误率(0-1)
  },
  
  // 真实API配置
  REAL_API_CONFIG: {
    baseUrl: 'https://api.example.com',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  },
  
  // 缓存配置
  CACHE_CONFIG: {
    duration: 5 * 60 * 1000,  // 缓存时长(ms)
    enabled: true             // 是否启用缓存
  },
  
  // 调试配置
  DEBUG_CONFIG: {
    showApiLog: true,         // 显示API日志
    showPerformanceLog: false, // 显示性能日志
    enableMockData: true      // 启用Mock数据
  }
}

// 生产环境配置
export const PROD_CONFIG = {
  API_MODE: 'real',
  
  REAL_API_CONFIG: {
    baseUrl: 'https://prod-api.example.com',
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json'
    }
  },
  
  CACHE_CONFIG: {
    duration: 10 * 60 * 1000,
    enabled: true
  },
  
  DEBUG_CONFIG: {
    showApiLog: false,
    showPerformanceLog: false,
    enableMockData: false
  }
}

// 当前环境配置
export const CONFIG = DEV_CONFIG

// API模式检查
export const isMockMode = () => CONFIG.API_MODE === 'mock'
export const isRealMode = () => CONFIG.API_MODE === 'real'

// 日志工具
export const logger = {
  info: (message, data = null) => {
    if (CONFIG.DEBUG_CONFIG?.showApiLog) {
      console.log(`[INFO] ${message}`, data || '')
    }
  },
  
  error: (message, error = null) => {
    console.error(`[ERROR] ${message}`, error || '')
  },
  
  warn: (message, data = null) => {
    if (CONFIG.DEBUG_CONFIG?.showApiLog) {
      console.warn(`[WARN] ${message}`, data || '')
    }
  },
  
  performance: (message, startTime) => {
    if (CONFIG.DEBUG_CONFIG?.showPerformanceLog) {
      const duration = Date.now() - startTime
      console.log(`[PERF] ${message}: ${duration}ms`)
    }
  }
}

// 环境检测
export const getEnvironment = () => {
  // 在微信小程序中检测环境
  try {
    const accountInfo = wx.getAccountInfoSync()
    return accountInfo.miniProgram.envVersion || 'develop'
  } catch (error) {
    return 'develop'
  }
}

// 根据环境自动切换配置
export const getConfigByEnv = () => {
  const env = getEnvironment()
  
  switch (env) {
    case 'release':
      return PROD_CONFIG
    case 'trial':
      return { ...DEV_CONFIG, API_MODE: 'real' }
    case 'develop':
    default:
      return DEV_CONFIG
  }
}