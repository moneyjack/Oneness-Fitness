// app/(main)/shop.tsx
import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import { Icon } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useCart } from '../../context/cart';
import ScreenWrapper from '../../components/ScreenWrapper';
import "../../global.css";

const DUMMY_PRODUCTS = [
  { id: '1', title: 'Whey Protein', price: 59.00, category: 'Supplements', image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=500&q=80' },
  { id: '2', title: 'Yoga Mat', price: 85.00, category: 'Gear', image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=500&q=80' },
  { id: '3', title: 'Vitamin C', price: 24.50, category: 'Vitamins', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80' },
  { id: '4', title: 'Resistance Bands', price: 15.00, category: 'Gear', image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=500&q=80' },
  { id: '5', title: 'Green Superfood', price: 45.00, category: 'Supplements', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80' },
  { id: '6', title: 'Meditation Cushion', price: 35.00, category: 'Wellness', image: 'https://images.unsplash.com/photo-1591228127791-8e2eaef098d3?auto=format&fit=crop&w=500&q=80' },
];

const CATEGORIES = ['All', 'Supplements', 'Gear', 'Event'];

export default function ShopScreen() {
  const { addItem } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = useMemo(() => {
    let result = [...DUMMY_PRODUCTS];
    if (searchQuery) result = result.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
    if (selectedCategory !== 'All') result = result.filter(p => p.category === selectedCategory);
    return result;
  }, [searchQuery, selectedCategory]);

  return (
    <ScreenWrapper withHeader={true}>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        // 底部增加更多空間 (pb-40)，避免被導航列擋住
        contentContainerClassName="p-4 pb-40"
        columnWrapperClassName="justify-between"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="mb-6 mt-2">
             
             <View className="bg-black/30 rounded-full flex-row items-center px-4 py-3 mb-5 border border-white/10">
               <Icon source="magnify" size={20} color="rgba(255,255,255,0.5)" />
               <TextInput 
                 placeholder="Search..."
                 placeholderTextColor="rgba(255,255,255,0.3)"
                 className="flex-1 ml-3 text-sm text-white font-light"
                 value={searchQuery}
                 onChangeText={setSearchQuery}
               />
             </View>

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
             
             <View className="flex-row justify-end px-2 mt-2">
                <Text className="text-white/40 text-[10px] tracking-widest uppercase">Sort by: Nones ⌄</Text>
             </View>
          </View>
        }
        renderItem={({ item }) => (
          // 卡片
          <TouchableOpacity 
            className="bg-white/5 w-[48%] mb-4 rounded-2xl overflow-hidden border border-white/10 shadow-sm"
            activeOpacity={0.8}
            onPress={() => console.log('View product')}
          >
            {/* ✅ 修正：圖片容器高度增加，移除 padding，resizeMode 改為 cover */}
            <View className="h-40 w-full relative">
               <Image 
                 source={{ uri: item.image }} 
                 className="w-full h-full" 
                 resizeMode="cover" // 關鍵：讓圖片填滿
               />
               {/* 圖片上的漸層遮罩，讓下方文字更清楚 */}
               <View className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
            </View>

            {/* 資訊區域 */}
            <View className="p-3 bg-black/20">
              <Text numberOfLines={1} className="text-sm font-medium text-white/90 tracking-wide mb-1">
                {item.title}
              </Text>
              
              <View className="flex-row justify-between items-center mt-2">
                <Text className="text-gray-300 text-xs font-light">
                  ${item.price.toFixed(2)}
                </Text>
                
                <TouchableOpacity 
                  className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 active:bg-white/20"
                  onPress={() => addItem(item)}
                >
                  <Text className="text-white text-[10px] font-bold tracking-wider">ADD</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </ScreenWrapper>
  );
}