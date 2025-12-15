import { Tabs, useRouter, usePathname } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Modal, StatusBar } from 'react-native';
import { Icon } from 'react-native-paper';
import { useAuth } from '../../context/auth';
import "../../global.css"; // 引入 Tailwind

export default function TabLayout() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); // 獲取當前路徑以高亮顯示選單
  const tintColor = '#4DC6B9'; // Primary Color
  
  // 控制側邊選單開關
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // 定義選單項目 (用於 Sidebar 渲染)
  const MENU_ITEMS = [
    { name: 'videos', label: 'VIDEOS', icon: 'play-box-multiple-outline' },
    { name: 'collections', label: 'COLLECTIONS', icon: 'collage' },
    { name: 'search', label: 'SEARCH', icon: 'magnify' },
    { name: 'calendar', label: 'CALENDAR', icon: 'calendar-range' },
    { name: 'profile', label: 'PROFILE', icon: 'account' },
  ];

  // 處理導航跳轉
  const handleNavigation = (route: string) => {
    setSidebarOpen(false); // 關閉選單
    
    if (route === 'profile' && !user) {
      router.push('/(auth)/sign-in');
      return;
    }
    
    // 跳轉到對應的 Tab
    router.push(`/(main)/${route}` as any);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 設置狀態列顏色以配合設計 */}
      <StatusBar barStyle="dark-content" />

      <Tabs
        screenOptions={{
          // --- Header 設定 ---
          headerShown: true, // 開啟頂部 Header
          headerTitle: 'ONENESS', // 中間 App 名稱
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: '800',
            fontSize: 20,
            letterSpacing: 2, // 增加字距讓看起來更高級
            color: '#333',
          },
          headerStyle: {
            backgroundColor: 'white',
            shadowColor: 'transparent', // 移除陰影讓介面更乾淨
            elevation: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#F3F4F6',
          },
          // 左側 Menu 按鈕
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => setSidebarOpen(true)} 
              style={{ marginLeft: 16 }}
            >
              <Icon source="menu" size={28} color="#333" />
            </TouchableOpacity>
          ),
          
          // --- Tab Bar 設定 (您原本的設定) ---
          tabBarActiveTintColor: tintColor,
          tabBarStyle: {
            height: 90,
            paddingBottom: 10,
            paddingTop: 10,
          },
        }}
      >
        {/* 定義各個 Tab (保持不變) */}
        <Tabs.Screen
          name="videos"
          options={{
            title: 'VIDEOS',
            tabBarIcon: ({ color }) => <Icon source="play-box-multiple-outline" color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="collections"
          options={{
            title: 'COLLECTIONS',
            tabBarIcon: ({ color }) => <Icon source="collage" color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'SEARCH',
            tabBarIcon: ({ color }) => <Icon source="magnify" color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            title: 'CALENDAR',
            tabBarIcon: ({ color }) => <Icon source="calendar-range" color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'PROFILE',
            tabBarIcon: ({ color }) => <Icon source="account" color={color} size={24} />,
          }}
          listeners={{
            tabPress: (e) => {
              if (!user) {
                e.preventDefault();
                router.push('/(auth)/sign-in');
              }
            },
          }}
        />
      </Tabs>

      {/* --- 自定義側邊選單 (Sidebar Modal) --- */}
      <Modal
        visible={isSidebarOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSidebarOpen(false)}
      >
        <View className="flex-1 flex-row">
          {/* 1. 黑色半透明背景 (點擊關閉) */}
          <TouchableOpacity 
            className="absolute inset-0 bg-black/50" 
            activeOpacity={1}
            onPress={() => setSidebarOpen(false)}
          />

          {/* 2. 選單內容 (白色區域) */}
          <View className="w-3/4 h-full bg-white pt-12 pb-10 px-6 shadow-xl relative z-10">
            {/* Menu Header */}
            <View className="mb-10 flex-row justify-between items-center">
               <Text className="text-2xl font-black tracking-widest text-primary">ONENESS</Text>
               <TouchableOpacity onPress={() => setSidebarOpen(false)}>
                 <Icon source="close" size={24} color="#999" />
               </TouchableOpacity>
            </View>

            {/* Menu Items Loop */}
            <View className="flex-1">
              {MENU_ITEMS.map((item) => {
                const isActive = pathname.includes(item.name);
                return (
                  <TouchableOpacity
                    key={item.name}
                    onPress={() => handleNavigation(item.name)}
                    className={`flex-row items-center py-4 border-b border-gray-50 ${isActive ? 'bg-secondary/30 -mx-6 px-6' : ''}`}
                  >
                    <Icon 
                      source={item.icon} 
                      size={24} 
                      color={isActive ? tintColor : '#666'} 
                    />
                    <Text 
                      className={`ml-4 text-base font-bold ${isActive ? 'text-primary' : 'text-gray-600'}`}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Bottom Actions (Sign Out) */}
            {user ? (
              <TouchableOpacity 
                onPress={() => {
                  setSidebarOpen(false);
                  signOut();
                }}
                className="flex-row items-center py-4 mt-4"
              >
                <Icon source="logout" size={24} color="#EF4444" />
                <Text className="ml-4 text-base font-bold text-red-500">Sign Out</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                onPress={() => {
                  setSidebarOpen(false);
                  router.push('/(auth)/sign-in');
                }}
                className="flex-row items-center py-4 mt-4 bg-primary rounded-xl justify-center"
              >
                <Text className="text-white font-bold">Sign In</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}