// pages/shop/shop.js
const app = getApp();
const { API, points } = require('../../utils/api.js');

Page({
  data: {
    userInfo: {},
    userPoints: 0,
    loading: false,
    refreshing: false,
    
    // 商品分类
    categories: [
      { id: 'all', name: '全部', active: true },
      { id: 'study', name: '学习用品', active: false },
      { id: 'digital', name: '数码产品', active: false },
      { id: 'book', name: '图书', active: false },
      { id: 'toy', name: '玩具', active: false },
      { id: 'other', name: '其他', active: false }
    ],
    
    currentCategory: 'all',
    
    // 商品列表
    shopItems: [],
    
    // 兑换记录
    exchangeHistory: [],
    showHistory: false,
    
    // 搜索
    searchKeyword: '',
    showSearch: false
  },

  onLoad() {
    this.initPage();
  },

  onShow() {
    this.loadUserPoints();
    this.loadShopItems();
  },

  onPullDownRefresh() {
    this.refreshData();
  },

  onReachBottom() {
    this.loadMoreItems();
  },

  // 初始化页面
  initPage() {
    // 启用Mock模式
    API.enableMock();
    
    this.setData({
      userInfo: app.globalData.userInfo || {}
    });
    
    this.loadUserPoints();
    this.loadShopItems();
  },

  // 加载用户积分
  async loadUserPoints() {
    try {
      const res = await points.getPointsStats();
      if (res.code === 200) {
        this.setData({
          userPoints: res.data.totalPoints || 0
        });
      }
    } catch (error) {
      console.error('加载积分失败:', error);
    }
  },

  // 加载商品列表
  async loadShopItems() {
    this.setData({ loading: true });
    
    try {
      const res = await points.getShopItems({
        category: this.data.currentCategory === 'all' ? '' : this.data.currentCategory,
        keyword: this.data.searchKeyword,
        pageSize: 20
      });
      
      if (res.code === 200) {
        this.setData({
          shopItems: res.data.list || []
        });
      }
    } catch (error) {
      console.error('加载商品失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  // 刷新数据
  async refreshData() {
    this.setData({ refreshing: true });
    
    try {
      await Promise.all([
        this.loadUserPoints(),
        this.loadShopItems()
      ]);
    } catch (error) {
      console.error('刷新失败:', error);
    } finally {
      this.setData({ refreshing: false });
      wx.stopPullDownRefresh();
    }
  },

  // 加载更多商品
  async loadMoreItems() {
    // 这里可以实现分页加载
    console.log('加载更多商品');
  },

  // 切换分类
  switchCategory(e) {
    const categoryId = e.currentTarget.dataset.id;
    
    // 更新分类状态
    const categories = this.data.categories.map(cat => ({
      ...cat,
      active: cat.id === categoryId
    }));
    
    this.setData({
      categories,
      currentCategory: categoryId
    });
    
    // 重新加载商品
    this.loadShopItems();
  },

  // 搜索商品
  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },

  // 执行搜索
  performSearch() {
    this.loadShopItems();
  },

  // 清空搜索
  clearSearch() {
    this.setData({
      searchKeyword: '',
      showSearch: false
    });
    this.loadShopItems();
  },

  // 显示搜索框
  showSearchBox() {
    this.setData({
      showSearch: true
    });
  },

  // 商品兑换
  exchangeItem(e) {
    const itemId = e.currentTarget.dataset.id;
    const item = this.data.shopItems.find(item => item.id === itemId);
    
    if (!item) return;
    
    // 检查积分是否足够
    if (this.data.userPoints < item.points) {
      wx.showModal({
        title: '积分不足',
        content: `兑换此商品需要 ${item.points} 积分，您当前只有 ${this.data.userPoints} 积分`,
        showCancel: false
      });
      return;
    }
    
    // 确认兑换
    wx.showModal({
      title: '确认兑换',
      content: `确定要用 ${item.points} 积分兑换「${item.name}」吗？`,
      success: (res) => {
        if (res.confirm) {
          this.handleExchange(item);
        }
      }
    });
  },

  // 处理兑换
  async handleExchange(item) {
    wx.showLoading({ title: '兑换中...' });
    
    try {
      const res = await points.exchangePoints({
        itemId: item.id,
        points: item.points
      });
      
      if (res.code === 200) {
        // 更新用户积分
        this.setData({
          userPoints: this.data.userPoints - item.points
        });
        
        // 更新商品库存
        const shopItems = this.data.shopItems.map(shopItem => {
          if (shopItem.id === item.id) {
            return {
              ...shopItem,
              stock: shopItem.stock - 1
            };
          }
          return shopItem;
        });
        
        this.setData({ shopItems });
        
        wx.showModal({
          title: '兑换成功',
          content: `恭喜您成功兑换「${item.name}」！请在兑换记录中查看详情。`,
          showCancel: false
        });
      }
    } catch (error) {
      console.error('兑换失败:', error);
      wx.showToast({
        title: '兑换失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  // 查看商品详情
  viewItemDetail(e) {
    const itemId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/shop/item-detail?id=${itemId}`
    });
  },

  // 显示兑换记录
  async showExchangeHistory() {
    this.setData({ showHistory: true });
    
    try {
      const res = await points.getExchangeHistory({
        pageSize: 50
      });
      
      if (res.code === 200) {
        this.setData({
          exchangeHistory: res.data.list || []
        });
      }
    } catch (error) {
      console.error('加载兑换记录失败:', error);
    }
  },

  // 隐藏兑换记录
  hideExchangeHistory() {
    this.setData({ showHistory: false });
  },

  // 查看兑换详情
  viewExchangeDetail(e) {
    const exchangeId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/shop/exchange-detail?id=${exchangeId}`
    });
  },

  // 获取积分
  getMorePoints() {
    wx.showModal({
      title: '获取积分',
      content: '完成作业、参与活动都可以获得积分哦！',
      confirmText: '去完成作业',
      success: (res) => {
        if (res.confirm) {
          wx.switchTab({
            url: '/pages/homework/homework'
          });
        }
      }
    });
  },

  // 分享功能
  onShareAppMessage() {
    return {
      title: '积分商城 - 用积分兑换心仪商品',
      path: '/pages/shop/shop',
      imageUrl: '/images/share-shop.png'
    };
  }
});