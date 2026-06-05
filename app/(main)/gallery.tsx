// app/(main)/gallery.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ImageBackground, Modal, ScrollView, Platform } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Icon } from 'react-native-paper';
import ScreenWrapper from '../../components/ScreenWrapper';
import { useTranslation } from 'react-i18next';
import { getSupabasePublicStorageUrl } from '../../lib/supabase';
import "../../global.css";

// 1. 升級資料結構：加入 videos 陣列
const GALLERIES = [
  { 
    id: 'physio', 
    title: 'PHYSIO THERAPY', 
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop', // 物理治療/瑜伽風格封面
    videos: [
      { id: 'v1', title: 'Neck & Shoulder Relief', url: getSupabasePublicStorageUrl('videos', 'physio1.MP4') },
      { id: 'v2', title: 'Lower Back Stretching', url: getSupabasePublicStorageUrl('videos', 'physio2.MP4') },
      { id: 'v3', title: 'Upper Back Stretching', url: getSupabasePublicStorageUrl('videos', 'physio3.MP4') },
      { id: 'v4', title: 'Hip Flexor Stretch', url: getSupabasePublicStorageUrl('videos', 'physio4.MP4') },
      { id: 'v5', title: 'Hamstring Stretch', url: getSupabasePublicStorageUrl('videos', 'physio5.MP4') },
    ]
  },
  { 
    id: '1', 
    title: 'YOGA FLOW', 
    image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?q=80&w=1926&auto=format&fit=crop',
    videos: [] 
  },
  { 
    id: '2', 
    title: 'MEDITATION', 
    image: 'https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=2069&auto=format&fit=crop',
    videos: []
  },
  { 
    id: '3', 
    title: 'SOUND HEALING', 
    image: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=2064&auto=format&fit=crop',
    videos: []
  },
];

export default function GalleryScreen() {
  const { t } = useTranslation();
  const serifFont = Platform.OS === 'ios' ? 'Georgia' : 'serif';

  // 狀態管理：控制目前點開了哪一個系列
  const [selectedGallery, setSelectedGallery] = useState<any | null>(null);

  return (
    <ScreenWrapper withHeader={true}>
      <FlatList
        data={GALLERIES}
        keyExtractor={item => item.id}
        contentContainerClassName="p-5 pb-32"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="mb-6 mt-2">
            <Text className="text-white text-3xl font-light tracking-[4px]">
              {t('menu.gallery') || 'GALLERY'}
            </Text>
            <Text className="text-cyan-400/80 mt-1 tracking-widest text-xs uppercase">
              Visual Journey
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => setSelectedGallery(item)}
            className="mb-8 h-48 rounded-3xl overflow-hidden relative shadow-lg border border-white/10"
          >
            <ImageBackground
              source={{ uri: item.image }}
              className="w-full h-full justify-end"
              resizeMode="cover"
            >
              {/* 漸層遮罩 */}
              <View className="absolute bottom-0 w-full h-full bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              
              <View className="p-6">
                <Text 
                  style={{ fontFamily: serifFont }} 
                  className="text-white text-2xl font-light tracking-widest shadow-sm mb-1"
                >
                  {item.title}
                </Text>
                
                {/* 顯示影片數量 */}
                {item.videos && item.videos.length > 0 ? (
                   <View className="flex-row items-center">
                     <Icon source="play-circle-outline" size={16} color="#4DC6B9" />
                     <Text className="text-cyan-400 text-xs ml-2 tracking-widest uppercase">
                       {item.videos.length} Videos
                     </Text>
                   </View>
                ) : (
                   <Text className="text-white/40 text-[10px] tracking-widest uppercase">
                     Coming Soon
                   </Text>
                )}
              </View>
            </ImageBackground>
          </TouchableOpacity>
        )}
      />

      {/* 🌟 影片播放列表 Modal */}
      <Modal
        visible={!!selectedGallery}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedGallery(null)}
      >
        <View className="flex-1 bg-[#050508]">
          {/* Header 區塊 */}
          <View className="flex-row items-center justify-between px-6 pt-16 pb-4 border-b border-white/10 bg-black/50">
            <Text style={{ fontFamily: serifFont }} className="text-white text-xl font-light tracking-widest">
              {selectedGallery?.title}
            </Text>
            <TouchableOpacity 
              onPress={() => setSelectedGallery(null)}
              className="bg-white/10 p-2 rounded-full border border-white/20"
            >
              <Icon source="close" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* 影片列表區塊 */}
          <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
            {selectedGallery?.videos && selectedGallery.videos.length > 0 ? (
              selectedGallery.videos.map((vid: any, index: number) => (
                <View key={vid.id} className="mb-10 bg-white/5 rounded-3xl overflow-hidden border border-white/10">
                  {/* 標題 */}
                  <View className="p-4 bg-black/40 flex-row items-center">
                    <View className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/50 justify-center items-center mr-3">
                      <Text className="text-cyan-400 text-[10px] font-bold">{index + 1}</Text>
                    </View>
                    <Text className="text-white font-light tracking-wider flex-1">
                      {vid.title}
                    </Text>
                  </View>

                  {/* 影片播放器 */}
                  <View className="w-full aspect-video bg-black relative">
                    <Video
                      source={{ uri: vid.url }}
                      style={{ flex: 1 }}
                      resizeMode={ResizeMode.CONTAIN}
                      useNativeControls={true} // 允許暫停、全螢幕、快進
                      isLooping={false}
                    />
                  </View>
                </View>
              ))
            ) : (
              // 如果該系列沒有影片
              <View className="items-center justify-center py-32">
                 <Icon source="movie-open-outline" size={48} color="rgba(255,255,255,0.2)" />
                 <Text className="text-white/40 mt-4 tracking-widest text-sm text-center">
                   Awakening contents are being prepared.{'\n'}Please check back later.
                 </Text>
              </View>
            )}
            <View className="h-20" /> {/* 底部留白 */}
          </ScrollView>
        </View>
      </Modal>

    </ScreenWrapper>
  );
}
