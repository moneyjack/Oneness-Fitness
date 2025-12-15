import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import "../../global.css"; // 確保路徑正確指向 global.css

const DUMMY_VIDEOS = [
  { id: '1', title: 'Yoga for Beginners', duration: '15:00', author: 'Sarah' },
  { id: '2', title: 'Full Body HIIT', duration: '25:30', author: 'Mike' },
  { id: '3', title: 'Morning Meditation', duration: '10:00', author: 'Emma' },
  { id: '4', title: 'Core Strength', duration: '20:00', author: 'John' },
  { id: '5', title: 'Sleep Music', duration: '45:00', author: 'App Team' },
];

export default function VideosScreen() {
  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="pt-4 pb-4 px-5 bg-white border-b border-gray-100">
        <Text className="text-3xl font-bold text-gray-800">Videos</Text>
        <Text className="text-gray-500 mt-1">Explore our latest content</Text>
      </View>

      {/* Video List */}
      <FlatList
        data={DUMMY_VIDEOS}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-5 pb-24" // pb-24 防止被 TabBar 擋住
        renderItem={({ item }) => (
          <TouchableOpacity className="mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Thumbnail Placeholder */}
            <View className="h-48 bg-gray-200 justify-center items-center relative">
               {/* 模擬播放按鈕 */}
               <View className="w-12 h-12 bg-primary/80 rounded-full justify-center items-center">
                  <View className="w-0 h-0 border-l-[10px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1" />
               </View>
               <View className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded">
                 <Text className="text-white text-xs font-bold">{item.duration}</Text>
               </View>
            </View>
            
            {/* Content */}
            <View className="p-4">
              <Text className="text-lg font-bold text-gray-800">{item.title}</Text>
              <View className="flex-row justify-between items-center mt-2">
                <Text className="text-primary font-semibold">Instructor: {item.author}</Text>
                <TouchableOpacity className="bg-secondary px-3 py-1 rounded-full">
                  <Text className="text-primary text-xs font-bold">Watch Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}