//https://btbeugrlydlmtiavsyea.supabase.co/storage/v1/object/public/assets/Gemini_Generated_Image_lug4oflug4oflug4.png


// components/ScreenWrapper.tsx
import React, { ReactNode } from 'react';
import { ImageBackground, View, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, ResizeMode } from 'expo-av';
// 1. 引入動畫庫
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const SPACE_BG_IMAGE = 'https://btbeugrlydlmtiavsyea.supabase.co/storage/v1/object/public/assets/Gemini_Generated_Image_lug4oflug4oflug4.png';

type Props = {
  children: ReactNode;
  withHeader?: boolean;
};

export default function ScreenWrapper({ children, withHeader = false }: Props) {
  
  // 2. 定義內容區塊的渲染邏輯，並加上動畫
  const renderContent = () => (
    <View style={{ flex: 1, backgroundColor: 'rgba(5, 10, 20, 0.65)' }}> 
      {/* Animated.View 是關鍵！
         entering={FadeIn.duration(800)}: 設定 800ms 的淡入時間，讓畫面慢慢浮現
         style={{ flex: 1 }}: 確保填滿空間
      */}
      <Animated.View 
        entering={FadeIn.duration(500)} 
        // exiting={FadeOut.duration(300)} // 如果想要離開時也有動畫，可以解開這行，但有時會導致畫面閃爍，建議先保留 Entry 就好
        style={{ flex: 1 }}
      >
        {withHeader ? (
          <View style={{ flex: 1 }}>{children}</View>
        ) : (
          <SafeAreaView style={{ flex: 1 }}>
            {children}
          </SafeAreaView>
        )}
      </Animated.View>
    </View>
  );

  return (
    <ImageBackground
      source={{ uri: SPACE_BG_IMAGE }}
      style={{ flex: 1, width: '100%', height: '100%' }}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />
      {renderContent()}
    </ImageBackground>
  );
}