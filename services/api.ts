import { supabase } from '../lib/supabase'; // 引用你原本設定好的 supabase client

// --- 1. Authentication (身分驗證 API) ---

export const authApi = {
  // 註冊
  signUp: async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name }, // 把名字存進去
      },
    });
    return { data, error };
  },

  // 登入
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // 登出
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },
  
  // 取得目前使用者資訊 (使用 Partner 的 RPC)
  getCurrentUserInfo: async () => {
    // 注意：這需要你的 Partner 在 Supabase 建立 'get_current_user_info' 這個函數
    const { data, error } = await supabase.rpc('get_current_user_info');
    return { data, error };
  }
};

// --- 2. Data Fetching (資料獲取 API) ---

export const itemsApi = {
  // 抓取所有已發布的項目 (影片 & 產品)
  getAllPublishedItems: async () => {
    const { data, error } = await supabase.rpc('get_published_items');
    
    if (error) {
      console.error('Error fetching items:', error);
      return null;
    }
    return data;
  },

  // 依照類型抓取 (例如只抓影片)
  getItemsByType: async (type: 'video' | 'physical_product') => {
    const { data, error } = await supabase.rpc('get_published_items', {
      item_type: type // 傳參數給後端
    });
    
    if (error) {
      console.error(`Error fetching ${type}:`, error);
      return null;
    }
    return data;
  }
};

// 🌟 新增：使用者與設定相關 API
export const userApi = {
  // 1. 取得使用者語言
  getUserLanguage: async () => {
    const { data, error } = await supabase.rpc('get_user_language');
    if (error) console.error('Error fetching language:', error);
    return { data, error };
  },

  // 2. 設定使用者語言 ('en' 或 'zh-HK')
  setUserLanguage: async (language: string) => {
    // 轉換邏輯：如果前端是用 'zh'，轉成後端要的 'zh-HK'
    const backendLang = language.startsWith('zh') ? 'zh-HK' : 'en';
    
    const { error } = await supabase.rpc('set_user_language', {
      new_language: backendLang
    });
    
    if (error) console.error('Error setting language:', error);
    return { error };
  },

  // 3. 取得每日金句 (會根據後端紀錄的使用者語言回傳對應內容)
  getQuoteOfTheDay: async () => {
    const { data, error } = await supabase.rpc('get_quote_of_the_day');
    
    if (error) {
      console.error('Error fetching quote:', error);
      return null;
    }
    return data; 
    // 假設回傳格式為: { quote: "...", author: "..." }
    // 如果回傳的是陣列，我們會自動取第一個
  }
};
