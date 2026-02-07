// context/auth.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { Platform } from 'react-native';

// 1. 確保瀏覽器登入完成後可以關閉
WebBrowser.maybeCompleteAuthSession();

type AuthContextType = {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any; data: any }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, data: null }),
  signInWithGoogle: async () => {},
  signOut: () => {},
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    return { data, error };
  };

  // 🌟 Google 登入邏輯 (修正版)
  const signInWithGoogle = async () => {
    try {
      // 產生 Redirect URL
      const redirectUrl = makeRedirectUri({
        scheme: 'oneness',
        path: 'auth/callback',
      });

      console.log('🔗 Redirect URL:', redirectUrl);

      // 1. 取得 OAuth 網址
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true, // 我們自己處理跳轉
        },
      });

      if (error) throw error;

      // 2. 打開瀏覽器，並等待結果 (包含網址參數)
      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
        
        // 3. 🌟 關鍵修正：手動解析回傳的網址
        if (result.type === 'success' && result.url) {
          console.log('Google Sign in success flow initiated');
          
          // 解析 URL 中的 access_token 和 refresh_token
          // Supabase 通常會把 token 放在 hash (#) 或 query (?) 裡面
          const params = extractParamsFromUrl(result.url);
          
          if (params.access_token && params.refresh_token) {
            // 4. 手動設定 Session，這會觸發 onAuthStateChange，進而更新 user 狀態
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: params.access_token,
              refresh_token: params.refresh_token,
            });
            
            if (sessionError) {
                console.error('Set Session Error:', sessionError);
            } else {
                console.log('✅ Session manually set successfully!');
            }
          } else {
             console.log('⚠️ No tokens found in URL. Check Supabase Redirect settings.');
          }
        }
      }
    } catch (error) {
      console.error('Google Sign In Error:', error);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, signIn, signUp, signInWithGoogle, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// 🛠️ 輔助函數：從 URL 解析參數 (支援 hash 和 query)
function extractParamsFromUrl(url: string) {
    const params: { [key: string]: string } = {};
    
    // 處理 Hash (#) 模式，Supabase 預設是把 token 放在 hash 裡
    const hashPart = url.split('#')[1];
    if (hashPart) {
        hashPart.split('&').forEach((part) => {
            const [key, value] = part.split('=');
            if (key && value) params[key] = decodeURIComponent(value);
        });
    }

    // 處理 Query (?) 模式 (以防萬一)
    const queryPart = url.split('?')[1];
    if (queryPart) {
        queryPart.split('&').forEach((part) => {
            const [key, value] = part.split('=');
            if (key && value) params[key] = decodeURIComponent(value);
        });
    }

    return params;
}

export const useAuth = () => useContext(AuthContext);