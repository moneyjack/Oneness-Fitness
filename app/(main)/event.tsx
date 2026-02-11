// app/(main)/event.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, Modal, ScrollView } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import { useTranslation } from 'react-i18next';
import { eventsApi } from '../../services/api';
import { Icon } from 'react-native-paper';
import "../../global.css";

// (倒數計時器組件保持不變)
const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isClosed: false });

  useEffect(() => {
    if (!targetDate) return;

    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isClosed: true });
        return;
      }
      
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isClosed: false
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!targetDate) return null;

  if (timeLeft.isClosed) {
    return (
      <View className="bg-red-900/20 py-3 rounded-xl border border-red-500/30 items-center my-4 backdrop-blur-md">
        <Text className="text-red-400 font-bold tracking-[3px] uppercase text-xs">Registration Closed</Text>
      </View>
    );
  }

  return (
    <View className="my-5 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
      <Text className="text-cyan-400/80 text-[10px] uppercase tracking-[3px] text-center mb-3">
        Time left to register
      </Text>
      <View className="flex-row justify-center space-x-3">
        <View className="items-center">
          <View className="bg-cyan-900/40 w-12 h-12 rounded-lg border border-cyan-500/40 justify-center items-center">
            <Text className="text-cyan-400 font-bold text-lg">{timeLeft.days}</Text>
          </View>
          <Text className="text-white/40 text-[8px] tracking-widest mt-1 uppercase">Days</Text>
        </View>
        <Text className="text-cyan-400/50 text-xl font-bold self-start mt-2">:</Text>
        <View className="items-center">
          <View className="bg-cyan-900/40 w-12 h-12 rounded-lg border border-cyan-500/40 justify-center items-center">
            <Text className="text-cyan-400 font-bold text-lg">{timeLeft.hours.toString().padStart(2, '0')}</Text>
          </View>
          <Text className="text-white/40 text-[8px] tracking-widest mt-1 uppercase">Hrs</Text>
        </View>
        <Text className="text-cyan-400/50 text-xl font-bold self-start mt-2">:</Text>
        <View className="items-center">
          <View className="bg-cyan-900/40 w-12 h-12 rounded-lg border border-cyan-500/40 justify-center items-center">
            <Text className="text-cyan-400 font-bold text-lg">{timeLeft.minutes.toString().padStart(2, '0')}</Text>
          </View>
          <Text className="text-white/40 text-[8px] tracking-widest mt-1 uppercase">Mins</Text>
        </View>
        <Text className="text-cyan-400/50 text-xl font-bold self-start mt-2">:</Text>
        <View className="items-center">
          <View className="bg-cyan-900/40 w-12 h-12 rounded-lg border border-cyan-500/40 justify-center items-center">
            <Text className="text-cyan-400 font-bold text-lg">{timeLeft.seconds.toString().padStart(2, '0')}</Text>
          </View>
          <Text className="text-white/40 text-[8px] tracking-widest mt-1 uppercase">Secs</Text>
        </View>
      </View>
    </View>
  );
};

export default function EventScreen() {
  const { t } = useTranslation();
  
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await eventsApi.getEvents({
        page_number: 1,
        page_size: 10,
        sort_by: "event_date",
        sort_order: "asc"
      });

      if (data && data.events) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error("❌ Fetch events failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🌟 新增：處理按讚邏輯
  const handleToggleLike = async (eventId: string) => {
    // 1. 先在前端即時更新 UI (樂觀更新 Optimistic UI)，讓使用者感覺超順暢
    setEvents(currentEvents => 
      currentEvents.map(evt => {
        if (evt.id === eventId) {
          const wasLiked = evt.is_liked;
          return {
            ...evt,
            is_liked: !wasLiked,
            likes_count: wasLiked ? Math.max(0, evt.likes_count - 1) : evt.likes_count + 1
          };
        }
        return evt;
      })
    );

    // 同步更新 Popup 裡面的狀態 (如果 Modal 正在打開)
    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent((prev: any) => ({
        ...prev,
        is_liked: !prev.is_liked,
        likes_count: prev.is_liked ? Math.max(0, prev.likes_count - 1) : prev.likes_count + 1
      }));
    }

    // 2. 呼叫 Partner 的 API
    const responseData = await eventsApi.toggleEventLike(eventId);
    
    // 3. 幫你把 Partner 說的 "some data" 印出來檢查
    console.log("🌟 Toggle Like API Response:", responseData);
    
    // (如果後端回傳失敗，我們可以在這裡把前端的愛心「退回原狀」，但一般情況下上面的樂觀更新就夠了)
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  const formatDeadline = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <ScreenWrapper withHeader={true}>
      
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#4DC6B9" />
          <Text className="text-white/50 mt-4 tracking-widest text-xs">SCANNING EVENTS...</Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          contentContainerClassName="p-5 pb-32"
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View className="mb-6 mt-2">
                <Text className="text-white text-3xl font-light tracking-[4px]">
                  {t('menu.event') || 'EVENTS'}
                </Text>
                <Text className="text-cyan-400/80 mt-1 tracking-widest text-xs uppercase">
                  Join the cosmic gathering
                </Text>
            </View>
          }
          renderItem={({ item }) => {
            const tagsArray = item.tags ? item.tags.split(',').map((t: string) => t.trim()) : [];

            return (
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => setSelectedEvent(item)}
                className="mb-8 bg-white/5 rounded-3xl overflow-hidden border border-white/10 shadow-lg backdrop-blur-sm"
              >
                <View className="w-full h-40 relative bg-black/60">
                  {/* 🌟 修改：讀取 Partner 新加的 item.image */}
                  <Image 
                    source={{ uri: item.image || 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800' }} 
                    className="w-full h-full opacity-60" 
                    resizeMode="cover" 
                  />
                  <View className="absolute bottom-0 w-full h-full bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  
                  <View className="absolute top-4 left-4 flex-row flex-wrap gap-2">
                    {tagsArray.slice(0, 2).map((tag: string, index: number) => (
                      <View key={index} className="bg-white/20 px-2 py-1 rounded border border-white/30 backdrop-blur-md">
                        <Text className="text-white text-[10px] font-bold uppercase tracking-wider">{tag}</Text>
                      </View>
                    ))}
                  </View>

                  <View className="absolute top-4 right-4 bg-black/60 px-3 py-1.5 rounded-full border border-cyan-500/30">
                    <Text className="text-cyan-400 font-bold text-xs tracking-wider">
                      {item.price_hkd === 0 ? 'FREE' : `HKD $${item.price_hkd}`}
                    </Text>
                  </View>
                </View>

                <View className="p-5 bg-black/40">
                  <View className="flex-row justify-between items-start mb-2">
                    <View>
                      <Text className="text-cyan-400 text-xs font-bold tracking-widest uppercase">
                        {item.event_date ? formatEventDate(item.event_date) : 'TBA'}
                      </Text>
                      {item.registration_deadline && (
                        <Text className="text-amber-400/80 text-[10px] font-medium tracking-wider mt-1">
                          Registration Closes: {formatDeadline(item.registration_deadline)}
                        </Text>
                      )}
                    </View>
                    
                    {/* 🌟 修改：變成可點擊的按鈕，根據 is_liked 切換樣式 */}
                    <TouchableOpacity 
                      onPress={(e) => {
                        e.stopPropagation(); // 防止點擊愛心時，觸發整個卡片的 Popup
                        handleToggleLike(item.id);
                      }}
                      className="flex-row items-center bg-white/5 px-2 py-1 rounded-full border border-white/10 active:bg-white/10 z-10"
                    >
                      <Icon 
                        source={item.is_liked ? "heart" : "heart-outline"} 
                        size={12} 
                        color={item.is_liked ? "#FF6B6B" : "rgba(255,255,255,0.5)"} 
                      />
                      <Text className={`text-[10px] ml-1 font-bold ${item.is_liked ? 'text-[#FF6B6B]' : 'text-white/80'}`}>
                        {item.likes_count || 0}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  
                  <Text className="text-white text-xl font-light tracking-wide mb-3">
                    {item.title}
                  </Text>

                  {item.quote && (
                    <View className="bg-white/5 p-3 rounded-xl border-l-2 border-cyan-500/50 mb-4">
                      <Text className="text-gray-300 text-xs font-light italic leading-5">
                        "{item.quote.quote}"
                      </Text>
                    </View>
                  )}

                  <View className="flex-row items-center justify-between mt-2 pt-4 border-t border-white/10">
                    <View className="flex-row items-center flex-1">
                      <Icon source="map-marker-outline" size={16} color="rgba(77, 198, 185, 0.8)" />
                      <Text className="text-white/60 text-xs ml-2 tracking-wider flex-1" numberOfLines={1}>
                        {item.location?.name || 'Secret Location'}
                      </Text>
                    </View>
                    <Icon source="arrow-right" size={20} color="#4DC6B9" />
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}

      {/* Popup Modal */}
      <Modal 
        visible={!!selectedEvent} 
        transparent={true} 
        animationType="fade" 
        onRequestClose={() => setSelectedEvent(null)}
      >
        <View className="flex-1 justify-center items-center px-6">
          <TouchableOpacity 
            className="absolute inset-0 bg-black/80" 
            activeOpacity={1} 
            onPress={() => setSelectedEvent(null)}
          />
          
          {selectedEvent && (
            <View className="w-full max-h-[85%] bg-[#0a0a0f] rounded-3xl border border-white/20 overflow-hidden shadow-2xl">
              
              <TouchableOpacity 
                onPress={() => setSelectedEvent(null)} 
                className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-full border border-white/10"
              >
                <Icon source="close" size={20} color="#FFF" />
              </TouchableOpacity>

              <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                <View className="w-full h-56 bg-black relative">
                  {/* 🌟 Modal 也同步換成 item.image */}
                  <Image 
                    source={{ uri: selectedEvent.image || 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800' }} 
                    className="w-full h-full opacity-50" 
                    resizeMode="cover" 
                  />
                  <View className="absolute bottom-0 w-full h-2/3 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
                  
                  {/* 🌟 在大圖右下角也加入按讚按鈕 */}
                  <TouchableOpacity 
                    onPress={() => handleToggleLike(selectedEvent.id)}
                    className="absolute bottom-4 right-4 bg-black/50 px-3 py-2 rounded-full border border-white/10 flex-row items-center backdrop-blur-md"
                  >
                     <Icon 
                        source={selectedEvent.is_liked ? "heart" : "heart-outline"} 
                        size={16} 
                        color={selectedEvent.is_liked ? "#FF6B6B" : "rgba(255,255,255,0.7)"} 
                      />
                      <Text className={`ml-2 font-bold ${selectedEvent.is_liked ? 'text-[#FF6B6B]' : 'text-white'}`}>
                        {selectedEvent.likes_count || 0}
                      </Text>
                  </TouchableOpacity>
                </View>

                <View className="p-6 -mt-4">
                  <View className="bg-cyan-500/20 self-start px-3 py-1 rounded-full border border-cyan-500/30 mb-3 backdrop-blur-md">
                    <Text className="text-cyan-400 text-[10px] font-bold tracking-widest uppercase">
                      {selectedEvent.event_date ? formatEventDate(selectedEvent.event_date) : 'TBA'}
                    </Text>
                  </View>

                  <Text className="text-white text-2xl font-light tracking-wide mb-4">
                    {selectedEvent.title}
                  </Text>

                  <Text className="text-gray-400 text-sm leading-6 mb-2 font-light">
                    {selectedEvent.description || "The detailed cosmic information for this event will be revealed soon. Prepare your spirit for an awakening journey."}
                  </Text>

                  <CountdownTimer targetDate={selectedEvent.registration_deadline} />

                  <TouchableOpacity 
                    disabled={new Date(selectedEvent.registration_deadline).getTime() - new Date().getTime() <= 0}
                    className={`w-full py-4 rounded-xl items-center mb-4 ${
                      new Date(selectedEvent.registration_deadline).getTime() - new Date().getTime() <= 0
                      ? 'bg-gray-800 border border-gray-600'
                      : 'bg-cyan-500/10 border border-cyan-500/50 active:bg-cyan-500/30'
                    }`}
                  >
                    <Text className={`font-bold tracking-[3px] uppercase ${
                      new Date(selectedEvent.registration_deadline).getTime() - new Date().getTime() <= 0
                      ? 'text-gray-500'
                      : 'text-cyan-400'
                    }`}>
                      {new Date(selectedEvent.registration_deadline).getTime() - new Date().getTime() <= 0 ? 'Closed' : 'Reserve Spot'}
                    </Text>
                  </TouchableOpacity>
                  
                </View>
              </ScrollView>
            </View>
          )}
        </View>
      </Modal>

    </ScreenWrapper>
  );
}