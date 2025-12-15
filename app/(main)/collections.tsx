import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import "../../global.css";

const COLLECTIONS = [
  { id: '1', name: 'Favorites', count: 12 },
  { id: '2', name: 'Daily Routine', count: 5 },
  { id: '3', name: 'Mindfulness', count: 8 },
  { id: '4', name: 'Cardio', count: 15 },
  { id: '5', name: 'Stretching', count: 7 },
  { id: '6', name: 'Nutrition', count: 3 },
];

export default function CollectionsScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      <View className="pt-4 pb-4 px-5">
        <Text className="text-3xl font-bold text-gray-800">Collections</Text>
        <Text className="text-gray-500">Curated just for you</Text>
      </View>

      <FlatList
        data={COLLECTIONS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerClassName="p-3 pb-24"
        columnWrapperClassName="justify-between" 
        renderItem={({ item }) => (
          <TouchableOpacity 
            className="bg-white w-[48%] aspect-square mb-4 rounded-2xl p-4 justify-between shadow-sm border border-gray-100"
          >
            <View className="w-10 h-10 rounded-full bg-secondary justify-center items-center">
              {/* 這裡可以放 Icon */}
              <Text className="text-primary font-bold text-lg">{item.name.charAt(0)}</Text>
            </View>
            
            <View>
              <Text className="text-lg font-bold text-gray-800">{item.name}</Text>
              <Text className="text-gray-400 text-sm">{item.count} items</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}