import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-paper';
import { useCart } from '../../context/cart';
import ScreenWrapper from '../../components/ScreenWrapper';
import { useTranslation } from 'react-i18next';
import { itemsApi } from '../../services/api'; // 1. 引入 API
import "../../global.css";

const CATEGORIES = ['All', 'Supplements', 'Gear', 'Event'];

export default function ShopScreen() {
  const { t } = useTranslation();
  const { addItem } = useCart();
  
  // 2. 狀態管理：從 API 抓回來的產品
  const [apiProducts, setApiProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // 載入中狀態

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // 3. 關鍵：一進入畫面就去抓資料
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log("🚀 Starting to fetch products...");
      
      // 呼叫 Partner 的 RPC
      const data = await itemsApi.getAllPublishedItems();
      
      console.log("✅ Data received:", data);

      if (data) {
        setApiProducts(data);
      }
    } catch (error) {
      console.error("❌ Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 4. 過濾邏輯 (改成過濾 apiProducts)
  const filteredProducts = useMemo(() => {
    let result = [...apiProducts];
    
    if (searchQuery) {
      result = result.filter(p => 
        // 確保 title 存在才比較 (防止資料庫欄位不一樣)
        (p.title || p.name || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }
    return result;
  }, [searchQuery, selectedCategory, apiProducts]);

  return (
    <ScreenWrapper withHeader={true}>
      
      {/* 5. 如果正在載入，顯示轉圈圈 */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#4DC6B9" />
          <Text className="text-white/50 mt-4 tracking-widest text-xs">CONNECTING TO COSMOS...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          // 確保 key 是 string
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          numColumns={2}
          contentContainerClassName="p-4 pb-40"
          columnWrapperClassName="justify-between"
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View className="mb-6 mt-2">
               <Text className="text-2xl font-light text-white tracking-[4px] text-center mb-6">
                 {t('shop.title')}
               </Text>

               {/* Search Bar */}
               <View className="bg-black/30 rounded-full flex-row items-center px-4 py-3 mb-5 border border-white/10">
                 <Icon source="magnify" size={20} color="rgba(255,255,255,0.5)" />
                 <TextInput 
                   placeholder={t('shop.search')}
                   placeholderTextColor="rgba(255,255,255,0.3)"
                   className="flex-1 ml-3 text-sm text-white font-light"
                   value={searchQuery}
                   onChangeText={setSearchQuery}
                 />
               </View>

               {/* Categories */}
               <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2 pl-1">
                 {CATEGORIES.map((cat) => {
                   const isActive = selectedCategory === cat;
                   return (
                     <TouchableOpacity
                       key={cat}
                       onPress={() => setSelectedCategory(cat)}
                       className={`mr-3 px-5 py-2 rounded-full border ${
                         isActive 
                           ? 'bg-white/10 border-white/40' 
                           : 'bg-transparent border-transparent'
                       }`}
                     >
                       <Text className={`text-xs tracking-wider ${isActive ? 'text-white font-bold' : 'text-gray-400'}`}>
                         {cat}
                       </Text>
                     </TouchableOpacity>
                   );
                 })}
               </ScrollView>
            </View>
          }
          // 如果資料庫是空的
          ListEmptyComponent={
            <View className="items-center py-20">
               <Text className="text-white/30 text-lg">No signals found.</Text>
               <TouchableOpacity onPress={fetchProducts} className="mt-4 p-2 bg-white/10 rounded-lg">
                 <Text className="text-cyan-400 text-xs">Retry Connection</Text>
               </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity 
              className="bg-white/5 w-[48%] mb-4 rounded-2xl overflow-hidden border border-white/10 shadow-sm"
              activeOpacity={0.8}
            >
              <View className="h-40 w-full relative bg-black/40">
                 <Image 
                   // 這裡要看資料庫欄位是 image 還是 image_url，先做個防呆
                   source={{ uri: item.image || item.image_url || 'https://via.placeholder.com/300' }} 
                   className="w-full h-full" 
                   resizeMode="cover" 
                 />
                 <View className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
              </View>

              <View className="p-3 bg-black/20">
                {/* 顯示 title 或 name */}
                <Text numberOfLines={1} className="text-sm font-medium text-white/90 tracking-wide mb-1">
                  {item.title || item.name || 'Unknown Item'}
                </Text>
                
                <View className="flex-row justify-between items-center mt-2">
                  <Text className="text-gray-300 text-xs font-light">
                    ${item.price?.toFixed(2) || '0.00'}
                  </Text>
                  
                  <TouchableOpacity 
                    className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 active:bg-white/20"
                    onPress={() => addItem(item)}
                  >
                    <Text className="text-white text-[10px] font-bold tracking-wider">{t('shop.add')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </ScreenWrapper>
  );
}