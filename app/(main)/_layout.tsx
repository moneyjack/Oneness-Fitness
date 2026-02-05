// app/(main)/_layout.tsx
import { Slot, useRouter, usePathname } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient'; // 1. 引入漸層套件
import { useAuth } from '../../context/auth';
import { useCart } from '../../context/cart';
import '../../i18n';
import { useTranslation } from 'react-i18next'
import "../../global.css";

export default function CustomTabLayout() {
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const MENU_ITEMS = [
    { name: 'home', i18nKey: 'menu.home', icon: 'home-variant-outline' },
    { name: 'gallery', i18nKey: 'menu.gallery', icon: 'image-filter-hdr' },
    { name: 'event', i18nKey: 'menu.event', icon: 'calendar-star' },
    { name: 'shop', i18nKey: 'menu.shop', icon: 'shopping-outline' },
    { name: 'profile', i18nKey: 'menu.profile', icon: 'account-circle-outline' },
  ];
  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(nextLang);
  };
  const handleNavigation = (route: string) => {
    router.replace(`/(main)/${route}` as any);
  };

  // 定義統一的質感字體樣式 (Serif 襯線體)
  const serifFont = Platform.OS === 'ios' ? 'Georgia' : 'serif';

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar barStyle="light-content" />

      {/* --- 2. 漸層 Header (解決文字重疊問題) --- */}
      <View className="absolute top-0 w-full z-50">
        <LinearGradient
            // 顏色：從 90% 黑 -> 80% 黑 -> 透明
            colors={['rgba(0,0,0,1)', 'rgba(0,0,0,0.9)', 'transparent']}
            style={{ paddingTop: 0, paddingBottom: 20, width: '100%' }}
        >
          <SafeAreaView edges={['top']} className="bg-transparent">
            <View className="h-16 flex-row items-center justify-between px-6">
              
              {/* Menu Icon */}
              <TouchableOpacity onPress={() => setSidebarOpen(true)}>
                <Icon source="menu" size={24} color="#FFF" />
              </TouchableOpacity>

              {/* Logo: 使用 Serif 字體 + 超寬字距 */}
              <Text 
                style={{ fontFamily: serifFont }} 
                className="text-xl font-light tracking-[6px] text-white shadow-lg"
              >
                ONENESS
              </Text>

              {/* Cart Icon */}
              <TouchableOpacity onPress={() => router.push('/(main)/cart')} className="relative p-2">
                  <Icon source="cart-outline" size={24} color="#FFF" />
                  {totalItems > 0 && (
                    <View className="absolute top-0 right-0 bg-cyan-500 rounded-full w-4 h-4 justify-center items-center">
                      <Text className="text-black text-[8px] font-bold">{totalItems}</Text>
                    </View>
                  )}
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>

      {/* 內容區 */}
      <View style={{ flex: 1, marginTop: 60 }}>
        <Slot />
      </View>

      {/* --- 底部導航 (同樣加上微弱漸層，提升質感) --- */}
      <View className="absolute bottom-0 w-full z-50">
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,1)']}
            style={{ width: '100%' }}
          >
            <SafeAreaView edges={['bottom']} className="pt-2 pb-2 border-t border-white/5">
              <View className="flex-row justify-around items-center pt-2">
                {MENU_ITEMS.map((item) => {
                  const isActive = pathname.includes(item.name);
                  return (
                   <TouchableOpacity
                      key={item.name}
                      onPress={() => handleNavigation(item.name)}
                      className="items-center justify-center w-16 py-1"
                      activeOpacity={0.7}
                    >
                      <Icon source={item.icon} size={22} color={isActive ? '#4DC6B9' : 'rgba(255,255,255,0.4)'} />
                      <Text 
                        style={{ fontFamily: serifFont }}
                        className={`text-[10px] mt-1 tracking-widest uppercase ${isActive ? 'text-cyan-400 font-bold' : 'text-white/40'}`}
                      >
                        {/* 5. 這裡使用 t() 函數 */}
                        {t(item.i18nKey)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </SafeAreaView>
          </LinearGradient>
      </View>

      {/* Sidebar (側邊選單也改字體) */}
      <Modal visible={isSidebarOpen} transparent={true} animationType="fade" onRequestClose={() => setSidebarOpen(false)}>
        <View className="flex-1 flex-row">
          <TouchableOpacity className="absolute inset-0 bg-black/80" activeOpacity={1} onPress={() => setSidebarOpen(false)}/>
          
          <SafeAreaView className="w-2/3 h-full bg-[#050508] border-r border-white/10" edges={['top', 'bottom']}>
            <View className="p-8 h-full flex justify-between">
                
                {/* 上半部：導航選單 */}
                <View>
                  <Text style={{ fontFamily: serifFont }} className="text-white/30 text-xs tracking-[4px] mb-10 text-center">
                    {t('menu.navigation')}
                  </Text>

                  {MENU_ITEMS.map((item) => (
                    <TouchableOpacity
                      key={item.name}
                      onPress={() => { setSidebarOpen(false); handleNavigation(item.name); }}
                      className="py-5 border-b border-white/5"
                    >
                      <Text style={{ fontFamily: serifFont }} className="text-white/80 text-lg font-light tracking-widest ml-2">
                         {t(item.i18nKey)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* 下半部：功能按鈕區 (語言 + 登出) */}
                <View className="gap-y-4"> {/* 使用 gap-y-4 讓按鈕之間有間距 */}
                  
                  {/* 🌍 新增：語言切換按鈕 */}
                  <TouchableOpacity 
                    onPress={toggleLanguage} 
                    className="py-4 border border-white/10 rounded-full flex-row items-center justify-center active:bg-white/5"
                  >
                    <Icon source="earth" size={16} color="rgba(255,255,255,0.5)" />
                    <Text style={{ fontFamily: serifFont }} className="text-white/50 text-xs font-medium tracking-[2px] uppercase ml-2">
                      {i18n.language === 'en' ? 'English' : '中文'}
                    </Text>
                  </TouchableOpacity>

                  {/* 🚪 登出按鈕 */}
                  <TouchableOpacity 
                    onPress={() => { setSidebarOpen(false); signOut(); }} 
                    className="py-4 border border-white/10 rounded-full flex-row items-center justify-center active:bg-red-900/20 active:border-red-900/50"
                  >
                    <Icon source="logout" size={16} color="rgba(255,255,255,0.5)" />
                    <Text style={{ fontFamily: serifFont }} className="text-white/50 text-xs font-medium tracking-[2px] uppercase ml-2">
                      {t('menu.logout')}
                    </Text>
                  </TouchableOpacity>
                </View>

            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}