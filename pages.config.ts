/*
 * @Author: August_rush
 * @Date: 2025-06-17 16:05:01
 * @LastEditors: August_rush 864011713@qq.com
 * @LastEditTime: 2025-06-19 18:30:13
 * @FilePath: \huijiashenghuo_uniapp\pages.config.ts
 * @Description:
 *
 */
import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  globalStyle: {
    navigationStyle: 'default',
    navigationBarTitleText: '华泾镇',
    navigationBarBackgroundColor: '#f8f8f8',
    navigationBarTextStyle: 'black',
    backgroundColor: '#FFFFFF',
  },
  easycom: {
    autoscan: true,
    custom: {
      '^fg-(.*)': '@/components/fg-$1/fg-$1.vue',
      '^wd-(.*)': 'wot-design-uni/components/wd-$1/wd-$1.vue',
      '^(?!z-paging-refresh|z-paging-load-more)z-paging(.*)':
        'z-paging/components/z-paging$1/z-paging$1.vue',
      '^mp-html$': 'mp-html/dist/uni-app/components/mp-html/mp-html.vue',
    },
  },
  // 如果不需要tabBar，推荐使用 spa 模板。（pnpm create xxx -t spa）
  tabBar: {
    custom: true,
    color: '#999999',
    selectedColor: '#018d71',
    backgroundColor: '#F8F8F8',
    borderStyle: 'black',
    height: '50px',
    fontSize: '10px',
    iconWidth: '24px',
    spacing: '3px',
    list: [
      {
        iconPath: '/static/tabbar/home.png',
        selectedIconPath: '/static/tabbar/home_active.png',
        pagePath: 'pages/home/index',
        text: '首页',
      },
      {
        iconPath: '/static/tabbar/service.png',
        selectedIconPath: '/static/tabbar/service_active.png',
        pagePath: 'pages/service/index',
        text: '全部服务',
      },
      {
        iconPath: '/static/tabbar/logo.png',
        selectedIconPath: '/static/tabbar/logo.png',
        pagePath: 'pages/empty',
        text: 'logo',
      },
      {
        iconPath: '/static/tabbar/message.png',
        selectedIconPath: '/static/tabbar/message_active.png',
        pagePath: 'pages/message/index',
        text: '消息',
      },
      {
        iconPath: '/static/tabbar/mine.png',
        selectedIconPath: '/static/tabbar/mine_active.png',
        pagePath: 'pages/mine/index',
        text: '我的',
      },
    ],
  },
  pages: [
    {
      path: 'pages/home/index',
      type: 'home',
      style: {
        navigationStyle: 'custom',
        navigationBarTitleText: '首页',
      },
    },
    {
      path: 'pages/service/index',
      type: 'page',
      style: {
        navigationBarTitleText: '全部服务',
        navigationStyle: 'custom',
      },
    },
    {
      path: 'pages/mine/index',
      type: 'page',
      style: {
        navigationBarTitleText: '我的',
        navigationStyle: 'custom',
      },
    },
    {
      path: 'pages/message/index',
      type: 'page',
      style: {
        navigationBarTitleText: '消息',
        navigationStyle: 'custom',
      },
    },
  ],
  subPackages: [
    {
      root: 'pages-sub',
      pages: [],
    },
  ],
})
