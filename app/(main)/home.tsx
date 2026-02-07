// app/(main)/home.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Platform, ActivityIndicator, ScrollView } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import { useTranslation } from 'react-i18next';
import { userApi } from '../../services/api'; 
import "../../global.css";

export default function HomeScreen() {
  const { i18n } = useTranslation();
  const serifFont = Platform.OS === 'ios' ? 'Georgia' : 'serif';

  // 1. 更新狀態結構，加入 explanation
  const [quoteData, setQuoteData] = useState({ 
    quote: "Connecting to the universe...", 
    by: "LOADING",
    explanation: ""
  });
  const [loading, setLoading] = useState(true);

  const fetchQuote = async () => {
    setLoading(true);
    const data = await userApi.getQuoteOfTheDay();
    
    // 2. 適配新的 JSON 結構
    if (data) {
      // 確保即使回傳陣列也能處理，但主要針對物件
      const content = Array.isArray(data) ? data[0] : data;
      
      setQuoteData({
        quote: content.quote || "Silence is the language of God.",
        by: content.by || "Unknown",
        explanation: content.explanation || ""
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuote();
  }, [i18n.language]);

  return (
    <ScreenWrapper withHeader={true} >
      <View className="flex-1 justify-center items-center px-6 pb-20 pt-10">
        
        {/* 玻璃卡片容器 - 改用 ScrollView 防止內容太長超出螢幕 */}
        <View className="w-full max-h-[80%] bg-black/30 rounded-3xl border border-white/10 backdrop-blur-md overflow-hidden">
          <ScrollView contentContainerStyle={{ padding: 32, alignItems: 'center' }} showsVerticalScrollIndicator={false}>
            
            <View className="w-10 h-[1px] bg-cyan-400/50 mb-6" />

            {loading ? (
               <ActivityIndicator color="#4DC6B9" size="large" />
            ) : (
               <>
                 {/* 金句 */}
                 <Text 
                   style={{ fontFamily: serifFont, lineHeight: 36 }} 
                   className="text-white text-2xl font-light text-center tracking-wide shadow-lg"
                 >
                   "{quoteData.quote}"
                 </Text>

                 {/* 作者 / 出處 */}
                 <Text 
                   style={{ fontFamily: serifFont }}
                   className="text-cyan-400/90 text-center mt-6 text-sm font-bold tracking-[3px] uppercase"
                 >
                   — {quoteData.by}
                 </Text>

                 {/* 分隔線 */}
                 <View className="w-full h-[1px] bg-white/10 my-6" />

                 {/* 每日智慧解釋 (新增的部分) */}
                 {quoteData.explanation ? (
                   <View>
                     <Text className="text-white/40 text-[10px] tracking-[4px] text-center mb-2 uppercase">
                       Daily Wisdom
                     </Text>
                     <Text 
                       style={{ fontFamily: serifFont, lineHeight: 24 }}
                       className="text-gray-300 text-sm font-light text-center tracking-wide leading-6"
                     >
                       {quoteData.explanation}
                     </Text>
                   </View>
                 ) : null}
               </>
            )}

            <View className="w-10 h-[1px] bg-cyan-400/50 mt-8" />
          </ScrollView>
        </View>

        {/* 底部呼吸提示 */}
        <Text className="text-white/30 text-[10px] tracking-[3px] absolute bottom-20 uppercase">
          Breath in • Breath out
        </Text>

      </View>
    </ScreenWrapper>
  );
}