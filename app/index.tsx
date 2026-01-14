// app/index.tsx (Hardcoded Demo)
import { Redirect, Stack } from 'expo-router';
import React, { FC } from 'react';
import { ActivityIndicator, View ,Text} from 'react-native';
//import { useAuth } from '../hooks/useAuth'; // 假設您有一個管理認證狀態的 Hook
// ----------------------------------------------------
// ⚠️ 硬編碼區域 (HARDCODE SECTION)
// ---------------------------------------------------
const IS_LOADING: boolean = true;   // 模擬 App 初始載入時間 (例如 1 秒)
// ----------------------------------------------------

const IndexPage: FC = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(IS_LOADING);

  // 模擬應用程式啟動時的初始檢查時間
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 模擬載入 1000 毫秒 (1 秒)
    
    // 清理函數
    return () => clearTimeout(timer);
  }, []);

  // 1. 顯示載入畫面
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4DC6B9" /> 
        <Text className="mt-4 text-gray-500">檢查登入狀態...</Text>
      </View>
    );
  }

  return <Redirect href="/(main)/videos" />; 
};

export default IndexPage;