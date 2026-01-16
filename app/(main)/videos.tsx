import React, { useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Icon } from 'react-native-paper'; // 引入 Icon 來做全螢幕按鈕
import "../../global.css";

// 使用 Google 穩定的測試影片源
const DUMMY_VIDEOS = [
  { 
    id: '1', 
    title: 'Big Buck Bunny', 
    duration: '10:00', 
    author: 'Blender Foundation',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' 
  },
  { 
    id: '2', 
    title: 'Elephant Dream', 
    duration: '15:00', 
    author: 'Orange',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
  },
];

export default function VideosScreen() {
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const videoRef = useRef<Video>(null);

  const handlePlay = async (id: string) => {
    if (playingVideoId === id) {
      // 如果已經在播，就停止
      setPlayingVideoId(null);
    } else {
      // 切換新影片
      setPlayingVideoId(id);
    }
  };

  // 手動觸發全螢幕的函數
  const triggerFullscreen = async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.presentFullscreenPlayer();
      } catch (error) {
        console.log("Error entering fullscreen:", error);
      }
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="pt-4 pb-4 px-5 bg-white border-b border-gray-100">
        <Text className="text-3xl font-bold text-gray-800">Videos</Text>
        <Text className="text-gray-500 mt-1">Explore our latest content</Text>
      </View>

      <FlatList
        data={DUMMY_VIDEOS}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-5 pb-24"
        renderItem={({ item }) => {
          const isPlaying = playingVideoId === item.id;

          return (
            <View className="mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              
              {/* ⚠️ 關鍵修改：移除了 justify-center items-center，確保 Video 能撐滿 */}
              <View className="h-56 bg-black relative">
                {isPlaying ? (
                  <Video
                    ref={videoRef}
                    // ⚠️ 關鍵修改：直接用 style 強制設定寬高，避免 className 失效
                    style={{ width: '100%', height: '100%' }}
                    source={{ uri: item.videoUrl }}
                    useNativeControls={true} // 開啟原生控制列 (包含全螢幕按鈕)
                    resizeMode={ResizeMode.CONTAIN} 
                    isLooping={false}
                    shouldPlay={true}
                    onError={(e) => console.log("Video Error:", e)}
                  />
                ) : (
                  <TouchableOpacity 
                    className="w-full h-full justify-center items-center bg-gray-200 relative"
                    onPress={() => handlePlay(item.id)}
                    activeOpacity={0.8}
                  >
                     <View className="w-14 h-14 bg-primary/90 rounded-full justify-center items-center shadow-lg z-10">
                        <Icon source="play" size={30} color="white" />
                     </View>
                  </TouchableOpacity>
                )}

                {/* 如果正在播放，顯示一個額外的全螢幕按鈕在角落 (選用) */}
                {isPlaying && (
                  <TouchableOpacity 
                    onPress={triggerFullscreen}
                    className="absolute top-2 right-2 bg-black/50 p-2 rounded-full z-20"
                  >
                    <Icon source="fullscreen" size={24} color="white" />
                  </TouchableOpacity>
                )}
              </View>
              
              <View className="p-4">
                <Text className="text-lg font-bold text-gray-800">{item.title}</Text>
                <View className="flex-row justify-between items-center mt-2">
                  <Text className="text-primary font-semibold">{item.author}</Text>
                  
                  <TouchableOpacity 
                    className={`${isPlaying ? 'bg-red-500' : 'bg-secondary'} px-4 py-2 rounded-full`}
                    onPress={() => handlePlay(item.id)}
                  >
                    <Text className={`${isPlaying ? 'text-white' : 'text-primary'} text-xs font-bold`}>
                        {isPlaying ? 'Close' : 'Watch Now'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}