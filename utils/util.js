// utils/util.js
// 通用工具函数

/**
 * 格式化时间
 * @param {Date|string|number} date 日期
 * @param {string} format 格式 默认 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 格式化后的时间字符串
 */
function formatTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hour = String(d.getHours()).padStart(2, '0');
  const minute = String(d.getMinutes()).padStart(2, '0');
  const second = String(d.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second);
}

/**
 * 获取相对时间
 * @param {Date|string|number} date 日期
 * @returns {string} 相对时间字符串
 */
function getRelativeTime(date) {
  if (!date) return '';
  
  const now = new Date();
  const target = new Date(date);
  const diff = now.getTime() - target.getTime();
  
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;
  
  if (diff < minute) {
    return '刚刚';
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`;
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`;
  } else if (diff < week) {
    return `${Math.floor(diff / day)}天前`;
  } else if (diff < month) {
    return `${Math.floor(diff / week)}周前`;
  } else if (diff < year) {
    return `${Math.floor(diff / month)}个月前`;
  } else {
    return `${Math.floor(diff / year)}年前`;
  }
}

/**
 * 防抖函数
 * @param {Function} func 要防抖的函数
 * @param {number} wait 等待时间
 * @returns {Function} 防抖后的函数
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 节流函数
 * @param {Function} func 要节流的函数
 * @param {number} limit 时间间隔
 * @returns {Function} 节流后的函数
 */
function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * 深拷贝
 * @param {any} obj 要拷贝的对象
 * @returns {any} 拷贝后的对象
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }
  
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
}

/**
 * 验证手机号
 * @param {string} phone 手机号
 * @returns {boolean} 是否有效
 */
function validatePhone(phone) {
  const phoneReg = /^1[3-9]\d{9}$/;
  return phoneReg.test(phone);
}

/**
 * 验证邮箱
 * @param {string} email 邮箱
 * @returns {boolean} 是否有效
 */
function validateEmail(email) {
  const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailReg.test(email);
}

/**
 * 验证身份证号
 * @param {string} idCard 身份证号
 * @returns {boolean} 是否有效
 */
function validateIdCard(idCard) {
  const idCardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return idCardReg.test(idCard);
}

/**
 * 生成随机字符串
 * @param {number} length 长度
 * @returns {string} 随机字符串
 */
function generateRandomString(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 数组去重
 * @param {Array} arr 数组
 * @param {string} key 对象数组的去重键
 * @returns {Array} 去重后的数组
 */
function uniqueArray(arr, key) {
  if (!Array.isArray(arr)) return [];
  
  if (key) {
    const seen = new Set();
    return arr.filter(item => {
      const val = item[key];
      if (seen.has(val)) {
        return false;
      }
      seen.add(val);
      return true;
    });
  }
  
  return [...new Set(arr)];
}

/**
 * 格式化文件大小
 * @param {number} bytes 字节数
 * @returns {string} 格式化后的大小
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 获取文件扩展名
 * @param {string} filename 文件名
 * @returns {string} 扩展名
 */
function getFileExtension(filename) {
  if (!filename) return '';
  return filename.split('.').pop().toLowerCase();
}

/**
 * 数字格式化（添加千分位分隔符）
 * @param {number} num 数字
 * @returns {string} 格式化后的数字字符串
 */
function formatNumber(num) {
  if (typeof num !== 'number') return num;
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 获取URL参数
 * @param {string} url URL字符串
 * @returns {Object} 参数对象
 */
function getUrlParams(url) {
  const params = {};
  const urlObj = new URL(url);
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

/**
 * 存储管理
 */
const storage = {
  // 设置存储
  set(key, value, expire) {
    const data = {
      value,
      expire: expire ? Date.now() + expire * 1000 : null
    };
    wx.setStorageSync(key, JSON.stringify(data));
  },
  
  // 获取存储
  get(key) {
    try {
      const data = wx.getStorageSync(key);
      if (!data) return null;
      
      const parsed = JSON.parse(data);
      
      // 检查是否过期
      if (parsed.expire && Date.now() > parsed.expire) {
        wx.removeStorageSync(key);
        return null;
      }
      
      return parsed.value;
    } catch (e) {
      return null;
    }
  },
  
  // 删除存储
  remove(key) {
    wx.removeStorageSync(key);
  },
  
  // 清空存储
  clear() {
    wx.clearStorageSync();
  }
};

module.exports = {
  formatTime,
  getRelativeTime,
  debounce,
  throttle,
  deepClone,
  validatePhone,
  validateEmail,
  validateIdCard,
  generateRandomString,
  uniqueArray,
  formatFileSize,
  getFileExtension,
  formatNumber,
  getUrlParams,
  storage
};