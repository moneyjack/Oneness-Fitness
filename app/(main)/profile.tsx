// app/(main)/profile.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Redirect } from 'expo-router'; // 引入 Redirect
import { useAuth } from '../../context/auth'; // 引入我們剛做的 Hook

export default function ProfileScreenWrapper() {
  const { user, signOut } = useAuth();

  // --- 核心邏輯 ---
  // 因為 user 狀態是全域的，這裡不需要等待 isLoading
  // 如果沒有 user，直接渲染 Redirect，畫面甚至不會渲染 Profile 的 UI
  if (!user) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  // --- 以下是有登入才會看到的畫面 ---
  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text className="text-xl font-bold mb-4">會員中心</Text>
      <Text className="mb-4">你好，{user.name}</Text>
      
      <TouchableOpacity 
        onPress={signOut} 
        className="p-3 bg-red-500 rounded-lg items-center"
      >
        <Text className="text-white">登出</Text>
      </TouchableOpacity>
    </View>
  );
}