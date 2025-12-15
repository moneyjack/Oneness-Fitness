// app/_layout.tsx
import "../global.css";
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/auth';
import React from 'react';

export default function RootLayout() {
  return (
    // 1. AuthProvider 包在最外層，確保全域都能拿到 user 狀態
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* 2. 定義路由：Expo Router 會自動處理 (auth) 和 (main) 的切換 */}
        <Stack.Screen name="(main)" />
        <Stack.Screen name="(auth)" />
        
        {/* Modal 頁面 */}
        <Stack.Screen 
          name="choose-plan" 
          options={{ presentation: 'modal', title: 'Choose Plan' }} 
        />
      </Stack>
    </AuthProvider>
  );
}