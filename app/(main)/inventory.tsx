import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import { Icon } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useCart } from '../../context/cart';
import "../../global.css";

// 1. 假資料 (Mock Data) - 已換成 Unsplash 真實圖片
const DUMMY_PRODUCTS = [
  { 
    id: '1', 
    title: 'Organic Whey Protein', 
    price: 59.99, 
    category: 'Supplements', 
    // 健身蛋白粉圖片
    image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=500&q=80' 
  },
  { 
    id: '2', 
    title: 'Pro Yoga Mat', 
    price: 85.00, 
    category: 'Gear', 
    // 瑜珈墊圖片
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=500&q=80'
  },
  { 
    id: '3', 
    title: 'Vitamin C Complex', 
    price: 24.50, 
    category: 'Vitamins', 
    // 維他命圖片
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80'
  },
  { 
    id: '4', 
    title: 'Resistance Bands Set', 
    price: 15.99, 
    category: 'Gear', 
    // 阻力帶圖片
    image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=500&q=80'
  },
  { 
    id: '5', 
    title: 'Green Superfood', 
    price: 45.00, 
    category: 'Supplements', 
    // 綠色蔬果粉圖片
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80'
  },
  { 
    id: '6', 
    title: 'Meditation Cushion', 
    price: 35.00, 
    category: 'Wellness', 
    // 冥想坐墊圖片
    image: 'https://images.unsplash.com/photo-1591228127791-8e2eaef098d3?auto=format&fit=crop&w=500&q=80'
  },
];

// 定義所有分類標籤
const CATEGORIES = ['All', 'Supplements', 'Gear', 'Vitamins', 'Wellness'];

export default function ProductsScreen() {
  const router = useRouter();
  const { addItem, totalItems } = useCart();
  // --- 狀態管理 ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  // 排序狀態: 'default' | 'asc' (低到高) | 'desc' (高到低)
  const [sortOrder, setSortOrder] = useState<'default' | 'asc' | 'desc'>('default');

  // --- 核心邏輯：即時過濾與排序 ---
  // 使用 useMemo，只有當相依的變數改變時才會重新計算，效能更好
  const filteredProducts = useMemo(() => {
    let result = [...DUMMY_PRODUCTS];

    // 1. 搜尋過濾 (不分大小寫)
    if (searchQuery) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 2. 分類過濾
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // 3. 價格排序
    if (sortOrder === 'asc') {
      result.sort((a, b) => a.price - b.price); // 低 -> 高
    } else if (sortOrder === 'desc') {
      result.sort((a, b) => b.price - a.price); // 高 -> 低
    }

    return result;
  }, [searchQuery, selectedCategory, sortOrder]);

  // 切換排序模式的函數
  const toggleSort = () => {
    if (sortOrder === 'default') setSortOrder('asc');
    else if (sortOrder === 'asc') setSortOrder('desc');
    else setSortOrder('default');
  };

  // 取得排序按鈕的文字與圖示
  const getSortIcon = () => {
    if (sortOrder === 'asc') return { icon: 'sort-ascending', text: 'Price: Low to High' };
    if (sortOrder === 'desc') return { icon: 'sort-descending', text: 'Price: High to Low' };
    return { icon: 'sort', text: 'Sort' };
  };

  const sortDisplay = getSortIcon();

  return (
    <View className="flex-1 bg-gray-50">
      {/* --- Header --- */}
      <View className="pt-4 px-5 bg-white pb-2">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-3xl font-bold text-gray-800">Shop</Text>
            <Text className="text-gray-500 mt-1">Healthy essentials</Text>
          </View>
         <TouchableOpacity 
            onPress={() => router.push('/(main)/cart')} // 跳轉
            className="bg-gray-100 p-3 rounded-full relative"
            >
            <Icon source="cart-outline" size={24} color="#333" />
            
            {/* 4. 只有當購物車有東西時才顯示紅點數字 */}
            {totalItems > 0 && (
                <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 justify-center items-center border border-white">
                <Text className="text-white text-[10px] font-bold">{totalItems}</Text>
                </View>
            )}
            </TouchableOpacity>
        </View>

        {/* --- 搜尋框 --- */}
        <View className="bg-gray-100 rounded-xl flex-row items-center px-4 py-3 mb-4">
          <Icon source="magnify" size={24} color="#9CA3AF" />
          <TextInput 
            placeholder="Search products..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-3 text-base text-gray-800"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon source="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* --- 分類與排序列 --- */}
        <View>
           {/* 分類 Chips (水平捲動) */}
           <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
             {CATEGORIES.map((cat) => {
               const isActive = selectedCategory === cat;
               return (
                 <TouchableOpacity
                   key={cat}
                   onPress={() => setSelectedCategory(cat)}
                   className={`mr-2 px-4 py-2 rounded-full border ${
                     isActive 
                       ? 'bg-primary border-primary' 
                       : 'bg-white border-gray-200'
                   }`}
                 >
                   <Text className={`font-bold ${isActive ? 'text-white' : 'text-gray-600'}`}>
                     {cat}
                   </Text>
                 </TouchableOpacity>
               );
             })}
           </ScrollView>

           {/* 排序按鈕 */}
           <View className="flex-row justify-end items-center mb-2">
              <TouchableOpacity 
                onPress={toggleSort}
                className="flex-row items-center space-x-1"
              >
                <Text className="text-gray-500 font-medium text-xs mr-1">{sortDisplay.text}</Text>
                <Icon source={sortDisplay.icon} size={20} color="#666" />
              </TouchableOpacity>
           </View>
        </View>
      </View>

      {/* --- 產品列表 --- */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerClassName="p-3 pb-24"
        columnWrapperClassName="justify-between"
        showsVerticalScrollIndicator={false} // ✅ 這裡是 boolean，不用擔心報錯
        renderItem={({ item }) => (
          <TouchableOpacity 
            className="bg-white w-[48%] mb-4 rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            onPress={() => console.log('View product', item.id)}
          >
            {/* Product Image */}
            <View className="h-40 bg-gray-200 relative">
               <Image 
                  source={{ uri: item.image }} 
                  className="w-full h-full" 
                  resizeMode="cover"
               />
               
               {/* 分類標籤 (Category Tag) */}
               <View className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded-md">
                 <Text className="text-white text-[10px] font-bold uppercase tracking-wider">
                   {item.category}
                 </Text>
               </View>
            </View>

            {/* Info */}
            <View className="p-3">
              <Text numberOfLines={1} className="text-base font-bold text-gray-800 mb-1">
                {item.title}
              </Text>
              
              <View className="flex-row justify-between items-center mt-2">
                <Text className="text-primary text-lg font-extrabold">
                  ${item.price.toFixed(2)}
                </Text>
                
                {/* Add Button */}
                <TouchableOpacity 
                  className="bg-secondary p-2 rounded-full active:bg-secondary/70"
                  onPress={() => addItem(item)} // 點擊加入購物車
                >
                  <Icon source="plus" size={20} color="#4DC6B9" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
        // 當搜尋不到東西時顯示
        ListEmptyComponent={
          <View className="pt-10 items-center justify-center">
            <Icon source="emoticon-sad-outline" size={48} color="#ddd" />
            <Text className="text-gray-400 mt-2 font-medium">No products found</Text>
            <TouchableOpacity onPress={() => {setSearchQuery(''); setSelectedCategory('All');}}>
              <Text className="text-primary mt-4 font-bold">Clear Filters</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}