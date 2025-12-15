// app/_layout.tsx (確保包含 (auth) 群組)
import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* 這裡 name="(auth)" 是指 app/(auth)/_layout.tsx 所在的群組。
        Expo Router 會自動找到並使用該佈局。
      */}
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      {/* 您可能還有 (main) 群組或其他全域頁面 */}
    </Stack>
  );
}