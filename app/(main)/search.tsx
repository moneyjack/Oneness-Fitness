import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import "../../global.css";

const TAGS = ['Yoga', 'HIIT', 'Meditation', 'Pilates', 'Running', 'Diet'];

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');

  return (
    <View className="flex-1 bg-white pt-4 px-5">
      <Text className="text-3xl font-bold text-gray-800 mb-6">Search</Text>

      {/* Search Input */}
      <View className="bg-gray-100 rounded-xl p-4 mb-6 flex-row items-center">
        {/* 這裡可以加放大鏡 Icon */}
        <TextInput 
          placeholder="What are you looking for?"
          placeholderTextColor="#9CA3AF"
          className="flex-1 text-lg ml-2 text-gray-800"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Popular Tags */}
      <View>
        <Text className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">Popular Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-4">
          {TAGS.map((tag, index) => (
            <TouchableOpacity 
              key={index} 
              className="mr-3 bg-secondary px-5 py-2 rounded-full border border-primary/20"
            >
              <Text className="text-primary font-bold">{tag}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Recent / Empty State */}
      <View className="flex-1 justify-center items-center mt-10 opacity-50">
        <View className="w-16 h-16 bg-gray-100 rounded-full mb-4" />
        <Text className="text-gray-400 text-center">
          Type above to search for videos,{'\n'}collections, or events.
        </Text>
      </View>
    </View>
  );
}