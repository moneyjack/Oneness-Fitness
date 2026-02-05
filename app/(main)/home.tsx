import React from 'react';
import { View, Text, Platform } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import { useTranslation } from 'react-i18next'; // 引入 hook
import "../../global.css";

export default function HomeScreen() {
  const { t } = useTranslation(); // 使用 hook
  const serifFont = Platform.OS === 'ios' ? 'Georgia' : 'serif';

  return (
    <ScreenWrapper withHeader={true} >
      <View className="flex-1 justify-center items-center px-8 pb-20">
        <View className="bg-black/20 p-10 rounded-3xl border border-white/10 backdrop-blur-sm items-center">
          <View className="w-10 h-[1px] bg-cyan-400/50 mb-6" />

          {/* 翻譯金句 */}
          <Text 
            style={{ fontFamily: serifFont, lineHeight: 40 }} 
            className="text-white text-2xl font-light text-center tracking-widest shadow-lg"
          >
            "{t('home.quote')}"
          </Text>

          {/* 翻譯作者 */}
          <Text 
            style={{ fontFamily: serifFont }}
            className="text-cyan-400/80 text-center mt-8 text-sm font-bold tracking-[4px] uppercase"
          >
            {t('home.author')}
          </Text>

           <View className="w-10 h-[1px] bg-cyan-400/50 mt-6" />
        </View>

        {/* 翻譯呼吸提示 */}
        <Text className="text-white/30 text-[10px] tracking-[3px] absolute bottom-20 uppercase">
          {t('home.breath')}
        </Text>
      </View>
    </ScreenWrapper>
  );
}