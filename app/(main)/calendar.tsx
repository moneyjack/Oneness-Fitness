import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import "../../global.css";

const EVENTS = [
  { id: '1', date: '12', month: 'DEC', title: 'Live Yoga Session', time: '10:00 AM', status: 'upcoming' },
  { id: '2', date: '14', month: 'DEC', title: 'Nutrition Webinar', time: '02:00 PM', status: 'upcoming' },
  { id: '3', date: '18', month: 'DEC', title: 'Community Meetup', time: '06:00 PM', status: 'pending' },
  { id: '4', date: '25', month: 'DEC', title: 'Christmas Special', time: '09:00 AM', status: 'upcoming' },
];

export default function CalendarScreen() {
  return (
    <View className="flex-1 bg-white">
      <View className="pt-4 pb-4 px-5 bg-primary rounded-b-[30px] shadow-sm mb-4">
        <Text className="text-3xl font-bold text-white">Calendar</Text>
        <Text className="text-white/80 mt-1">Your upcoming schedule</Text>
      </View>

      <FlatList
        data={EVENTS}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-5 pb-24"
        renderItem={({ item }) => (
          <View className="flex-row mb-6 items-center">
            {/* Date Badge */}
            <View className="bg-secondary w-16 h-16 rounded-2xl justify-center items-center mr-4 border border-primary/20 shadow-sm">
              <Text className="text-primary font-extrabold text-xl">{item.date}</Text>
              <Text className="text-primary/70 text-xs font-bold">{item.month}</Text>
            </View>

            {/* Event Details */}
            <TouchableOpacity className="flex-1 bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex-row justify-between items-center">
              <View>
                <Text className="text-lg font-bold text-gray-800">{item.title}</Text>
                <Text className="text-gray-500 text-sm mt-1">⏰ {item.time}</Text>
              </View>
              {item.status === 'upcoming' && (
                <View className="w-3 h-3 rounded-full bg-primary" />
              )}
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}