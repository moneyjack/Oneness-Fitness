import React from 'react';
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { Icon } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/auth';
import ScreenWrapper from '../../components/ScreenWrapper';
import { useTranslation } from 'react-i18next'; // 引入
import "../../global.css";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { t, i18n } = useTranslation(); // 取得 i18n 實例
  const router = useRouter();
  const serifFont = Platform.OS === 'ios' ? 'Georgia' : 'serif';

  // 切換語言的函數
  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(nextLang);
  };

  if (!user) {
    router.replace('/(auth)/sign-in');
    return null;
  }

  return (
    <ScreenWrapper withHeader={true}>
      <View className="flex-1 p-6 pb-32">
        {/* Avatar Area */}
        <View className="items-center bg-white/5 p-8 rounded-3xl border border-white/10 mb-8 shadow-lg">
          <View className="w-24 h-24 bg-black/40 rounded-full mb-4 border border-cyan-500/30 justify-center items-center">
            <Icon source="account-circle" size={60} color="#4DC6B9" />
          </View>
          <Text style={{ fontFamily: serifFont }} className="text-2xl font-light text-white tracking-widest">
            {user.user_metadata?.full_name || 'Traveler'}
          </Text>
          <Text className="text-white/40 mt-1 text-xs tracking-wider">{user.email}</Text>
        </View>

        {/* Settings Options */}
        <View className="bg-white/5 rounded-2xl overflow-hidden border border-white/10">
          
          {/* 一般選項 (使用 map 渲染) */}
          {[
            { icon: 'cog-outline', label: t('profile.settings') },
            { icon: 'history', label: t('profile.history') },
            { icon: 'help-circle-outline', label: t('profile.support') },
          ].map((item, index) => (
            <TouchableOpacity 
              key={index}
              className="flex-row items-center p-5 border-b border-white/5 active:bg-white/5"
            >
              <Icon source={item.icon} size={22} color="rgba(255,255,255,0.6)" />
              <Text style={{ fontFamily: serifFont }} className="text-white/90 font-light ml-4 text-base flex-1 tracking-wide">
                {item.label}
              </Text>
              <Icon source="chevron-right" size={18} color="#666" />
            </TouchableOpacity>
          ))}

          {/* 🔥 語言切換按鈕 (特別獨立出來) */}
          <TouchableOpacity 
            onPress={toggleLanguage}
            className="flex-row items-center p-5 active:bg-white/5"
          >
            <Icon source="earth" size={22} color="#4DC6B9" />
            <Text style={{ fontFamily: serifFont }} className="text-white/90 font-light ml-4 text-base flex-1 tracking-wide">
              {t('profile.language')}
            </Text>
            {/* 顯示目前語言 */}
            <View className="bg-white/10 px-2 py-1 rounded border border-white/10 mr-2">
                <Text className="text-cyan-400 text-xs font-bold">
                    {i18n.language === 'en' ? 'EN' : '中'}
                </Text>
            </View>
            <Icon source="swap-horizontal" size={18} color="#666" />
          </TouchableOpacity>

        </View>

        {/* Sign Out Button */}
        <TouchableOpacity 
          onPress={signOut}
          className="mt-8 flex-row items-center justify-center bg-red-500/10 border border-red-500/30 p-4 rounded-xl active:bg-red-500/20"
        >
          <Icon source="logout" size={20} color="#FF6B6B" />
          <Text style={{ fontFamily: serifFont }} className="text-red-400 font-medium text-base ml-2 tracking-widest">
            {t('menu.logout')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}