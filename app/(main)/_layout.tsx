import { Slot, useRouter, usePathname } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // 新增這行
import { Icon } from 'react-native-paper';
import { useAuth } from '../../context/auth';
import "../../global.css";

export default function CustomTabLayout() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const tintColor = '#4DC6B9'; // 主題色
  
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const MENU_ITEMS = [
    { name: 'videos', label: 'VIDEOS', icon: 'play-box-multiple-outline' },
    { name: 'collections', label: 'COLLECTIONS', icon: 'collage' },
    { name: 'search', label: 'SEARCH', icon: 'magnify' },
    { name: 'inventory', label: 'INVENTORY', icon: 'store' },
    { name: 'profile', label: 'PROFILE', icon: 'account' },
  ];

  const handleNavigation = (route: string) => {
    // 如果點的是 Profile 且沒登入，跳去登入頁
    // if (route === 'profile' && !user) {
    //   router.push('/(auth)/sign-in');
    //   return;
    // }
    
    // 這裡用 replace 而不是 push，感覺更像切換 Tab
    // 注意：這裡的路徑要對應你的檔案名稱
    router.replace(`/(main)/${route}` as any);
  };

  // 處理側邊欄導航
  const handleSidebarNavigation = (route: string) => {
    setSidebarOpen(false);
    handleNavigation(route);
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle="dark-content" />

      {/* --- 自定義 Header --- */}
      <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
        <View className="h-16 flex-row items-center justify-between px-4 border-b border-gray-100">
          {/* 左側 Menu 按鈕 */}
          <TouchableOpacity onPress={() => setSidebarOpen(true)}>
            <Icon source="menu" size={28} color="#333" />
          </TouchableOpacity>

          {/* 中間標題 */}
          <Text className="text-xl font-extrabold tracking-widest text-gray-800">
            ONENESS
          </Text>

          {/* 右側佔位 (保持標題置中) */}
          <View style={{ width: 28 }} />
        </View>
      </SafeAreaView>

      {/* --- 主要內容區 (Slot) --- */}
      {/* 這裡會顯示 videos.tsx, profile.tsx 等內容 */}
      <View style={{ flex: 1 }}>
        <Slot />
      </View>

      {/* --- 自定義底部 Tab Bar --- */}
      <SafeAreaView edges={['bottom']} style={{ backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#F3F4F6' }}>
        <View className="flex-row justify-around py-3">
          {MENU_ITEMS.map((item) => {
            // 判斷目前是否在該頁面 (簡易判斷)
            const isActive = pathname.includes(item.name);
            
            return (
              <TouchableOpacity
                key={item.name}
                onPress={() => handleNavigation(item.name)}
                className="items-center justify-center w-16"
              >
                <Icon 
                  source={item.icon} 
                  size={26} 
                  color={isActive ? tintColor : '#9CA3AF'} 
                />
                <Text 
                  style={{ fontSize: 10, marginTop: 4, fontWeight: '600', color: isActive ? tintColor : '#9CA3AF' }}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>


      {/* --- 側邊選單 (Sidebar Modal) --- */}
      <Modal
        visible={isSidebarOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSidebarOpen(false)}
      >
        <View className="flex-1 flex-row">
          <TouchableOpacity 
            className="absolute inset-0 bg-black/50" 
            activeOpacity={1}
            onPress={() => setSidebarOpen(false)}
          />
          <View className="w-3/4 h-full bg-white pt-12 pb-10 px-6 shadow-xl relative z-10">
            <View className="mb-10 flex-row justify-between items-center">
              
            </View>

            <View className="flex-1">
              {MENU_ITEMS.map((item) => {
                const isActive = pathname.includes(item.name);
                return (
                  <TouchableOpacity
                    key={item.name}
                    onPress={() => handleSidebarNavigation(item.name)}
                    className={`flex-row items-center py-4 border-b border-gray-50 ${isActive ? 'bg-secondary/30 -mx-6 px-6' : ''}`}
                  >
                    <Icon source={item.icon} size={24} color={isActive ? tintColor : '#666'} />
                    <Text className={`ml-4 text-base font-bold ${isActive ? 'text-primary' : 'text-gray-600'}`}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {user ? (
              <View>
                <Text className="mb-4 text-gray-500">Hi, {user.user_metadata?.full_name || 'Member'}</Text>
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
              </View>
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