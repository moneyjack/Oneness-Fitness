// i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// 定義翻譯資源
const resources = {
  en: {
    translation: {
      // Menu / Navigation
      "menu": {
        "home": "Home",
        "gallery": "Gallery",
        "event": "Event",
        "shop": "Shop",
        "profile": "Profile",
        "logout": "Log Out",
        "navigation": "NAVIGATION"
      },
      // Home Screen
      "home": {
        "quote": "The universe is not outside of you. Look inside yourself; everything that you want, you already are.",
        "author": "RUMI",
        "breath": "Breath in • Breath out"
      },
      // Shop Screen
      "shop": {
        "title": "SHOP",
        "search": "Search cosmic goods...",
        "sort": "Sort by: ",
        "add": "ADD",
        "categories": {
          "all": "All",
          "supplements": "Supplements",
          "gear": "Gear",
          "event": "Event",
          "vitamins": "Vitamins",
          "wellness": "Wellness"
        }
      },
      // Profile Screen
      "profile": {
        "settings": "Settings",
        "history": "Order History",
        "support": "Help & Support",
        "language": "Language / 語言"
      },
      // Auth
      "auth": {
        "welcome": "Welcome Back",
        "signin": "SIGN IN",
        "signup": "SIGN UP",
        "email": "Email",
        "password": "Password"
      }
    }
  },
  zh: {
    translation: {
      "menu": {
        "home": "首頁",
        "gallery": "藝廊",
        "event": "活動",
        "shop": "商店",
        "profile": "個人",
        "logout": "登出",
        "navigation": "導航選單"
      },
      "home": {
        "quote": "宇宙並非在你之外。向內觀照；你所追尋的一切，早已是你自己。",
        "author": "魯米",
        "breath": "吸氣 • 吐氣"
      },
      "shop": {
        "title": "星際商店",
        "search": "搜尋靈性商品...",
        "sort": "排序：",
        "add": "加入",
        "categories": {
          "all": "全部",
          "supplements": "補給品",
          "gear": "裝備",
          "event": "活動",
          "vitamins": "維他命",
          "wellness": "身心靈"
        }
      },
      "profile": {
        "settings": "設定",
        "history": "訂單紀錄",
        "support": "幫助與支援",
        "language": "語言 / Language"
      },
      "auth": {
        "welcome": "歡迎回來",
        "signin": "登入",
        "signup": "註冊",
        "email": "電子郵件",
        "password": "密碼"
      }
    }
  }
};

// 偵測手機語系 (如果是 zh-TW 或 zh-CN 都當作 zh，否則 en)
const deviceLanguage = Localization.getLocales()[0]?.languageCode; 
const defaultLanguage = deviceLanguage === 'zh' ? 'zh' : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLanguage, // 預設語言
    fallbackLng: 'en',    // 如果找不到翻譯就用英文
    interpolation: {
      escapeValue: false // React 已經有防護，不需要 escape
    },
    compatibilityJSON: 'v4' // 兼容性設定
  });

export default i18n;