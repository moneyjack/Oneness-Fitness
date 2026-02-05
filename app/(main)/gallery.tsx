// app/(main)/gallery.tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import "../../global.css";

const GALLERIES = [
  { id: '1', title: 'YOGA FLOW', image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?q=80&w=1926&auto=format&fit=crop' },
  { id: '2', title: 'MEDITATION', image: 'https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=2069&auto=format&fit=crop' },
  { id: '3', title: 'SOUND HEALING', image: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=2064&auto=format&fit=crop' },
  { id: '4', title: 'BREATHWORK', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2031&auto=format&fit=crop' },
];

export default function GalleryScreen() {
  return (
    <ScreenWrapper withHeader={true}>
      <FlatList
        data={GALLERIES}
        keyExtractor={item => item.id}
        contentContainerClassName="p-5 pb-32" // 底部留空給 Tab Bar
        ListHeaderComponent={
          <Text className="text-white text-3xl font-bold mb-6 tracking-wider">GALLERY</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity className="mb-6 h-56 rounded-3xl overflow-hidden relative shadow-xl border border-white/20">
            <ImageBackground
              source={{ uri: item.image }}
              className="w-full h-full justify-end"
              resizeMode="cover"
            >
               {/* 圖片上的漸層遮罩 */}
              <View className="h-1/2 justify-end bg-gradient-to-t from-black/80 to-transparent p-6">
                <Text className="text-white text-2xl font-black tracking-widest shadow-sm">
                  {item.title}
                </Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        )}
      />
    </ScreenWrapper>
  );
}