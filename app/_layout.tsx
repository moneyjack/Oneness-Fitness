import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from '../context/auth';
import { CartProvider } from '../context/cart'; // 引入 CartProvider
import '../global.css'; // 確保你的 global.css 有引入

// 這是負責監聽路由變化的組件
function InitialLayout() {
  const { session, loading } = useAuth();
  const segments = useSegments(); // 取得目前的網址路徑段落
  const router = useRouter();

  useEffect(() => {
    // 1. 如果還在讀取硬碟資料，什麼都不做，繼續轉圈圈
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (session && inAuthGroup) {
      // 情況 A：已登入，但使用者還停留在 (auth) 群組 (登入/註冊頁)
      // -> 把他踢進首頁
      router.replace('/(main)/home');
      
    } 
  }, [session, loading, segments]);

  // 2. 顯示 Loading 畫面
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // 3. 讀取完畢，顯示正常的 App 內容
  return <Slot />;
}

// 這是最外層的 Root Layout
export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
      <InitialLayout />
      </CartProvider>
    </AuthProvider>
  );
}