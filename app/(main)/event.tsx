// app/(main)/event.tsx
import React from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import "../../global.css";

const PAST_EVENTS = [
  { id: '1', title: 'Full Moon Gathering', date: 'OCT 2023', image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=2070&auto=format&fit=crop' },
  { id: '2', title: 'Beach Sunset Yoga', date: 'SEP 2023', image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=2070&auto=format&fit=crop' },
  { id: '3', title: 'Mountain Retreat', date: 'AUG 2023', image: 'https://images.unsplash.com/photo-1519922639192-e73293ca430e?q=80&w=2072&auto=format&fit=crop' },
];

export default function EventScreen() {
  return (
    <ScreenWrapper withHeader={true}>
      <FlatList
        data={PAST_EVENTS}
        keyExtractor={item => item.id}
        contentContainerClassName="p-5 pb-32"
        ListHeaderComponent={
          <View className="mb-6">
              <Text className="text-white text-3xl font-bold tracking-wider">PAST EVENTS</Text>
              <Text className="text-gray-400 mt-1">Memories from our journey together</Text>
          </View>
        }
        renderItem={({ item }) => (
          // 玻璃擬態活動卡片
          <View className="mb-6 bg-white/10 rounded-3xl overflow-hidden border border-white/10 shadow-sm">
            <Image source={{ uri: item.image }} className="w-full h-48 bg-gray-800" resizeMode="cover" />
            <View className="p-5">
              <Text className="text-primary text-sm font-bold tracking-widest mb-1">{item.date}</Text>
              <Text className="text-white text-xl font-bold">{item.title}</Text>
            </View>
          </View>
        )}
      />
    </ScreenWrapper>
  );
}