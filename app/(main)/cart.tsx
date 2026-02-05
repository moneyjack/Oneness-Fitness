// app/(main)/cart.tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { Icon } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useCart } from '../../context/cart';
import ScreenWrapper from '../../components/ScreenWrapper';
import "../../global.css";

export default function CartScreen() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, totalAmount, clearCart } = useCart();

  const handleCheckout = () => {
    Alert.alert('Checkout', `Total: $${totalAmount.toFixed(2)}\n(Transmitting directly to the cosmos...)`, [
      { text: 'OK', onPress: clearCart }
    ]);
  };

  if (items.length === 0) {
    // 空購物車狀態
    return (
      // withHeader={false} 因為這頁自己有返回鍵的 Header
      <ScreenWrapper withHeader={false}> 
        <View className="flex-1 justify-center items-center p-6">
          <TouchableOpacity onPress={() => router.back()} className="absolute top-12 left-6 z-10 bg-black/30 p-2 rounded-full">
            <Icon source="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          
          <Icon source="cart-off" size={100} color="rgba(255,255,255,0.2)" />
          <Text className="text-gray-400 mt-6 text-xl font-medium">Your cosmic cart is empty.</Text>
          <TouchableOpacity onPress={() => router.back()} className="mt-10 bg-primary px-8 py-3 rounded-full">
            <Text className="text-black font-bold text-lg">Explore the Shop</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper withHeader={false}>
      {/* Header (深色透明) */}
      <View className="pt-12 pb-4 px-5 bg-black/30 border-b border-white/10 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4 bg-white/10 p-2 rounded-full">
          <Icon source="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-white tracking-wider">My Cart</Text>
      </View>

      {/* Cart Items */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-5 pb-40"
        renderItem={({ item }) => (
          // 購物車項目卡片 (玻璃擬態)
          <View className="bg-white/10 rounded-2xl p-3 mb-4 flex-row items-center shadow-sm border border-white/10 relative overflow-hidden">
            <Image source={{ uri: item.image }} className="w-24 h-24 rounded-xl bg-gray-900 opacity-90" resizeMode="cover"/>
            
            <View className="flex-1 ml-4 h-24 justify-between py-1">
              <View>
                <Text numberOfLines={1} className="text-lg font-bold text-white">{item.title}</Text>
                <Text className="text-primary text-sm">{item.category}</Text>
              </View>
              
              <View className="flex-row justify-between items-center">
                <Text className="text-white font-bold text-xl">${item.price}</Text>
                
                {/* Quantity Control (深色) */}
                <View className="flex-row items-center bg-black/40 rounded-full border border-white/10">
                  <TouchableOpacity onPress={() => updateQuantity(item.id, -1)} className="p-2">
                    <Icon source="minus" size={16} color="#FFF" />
                  </TouchableOpacity>
                  <Text className="mx-3 font-bold text-primary text-lg">{item.quantity}</Text>
                  <TouchableOpacity onPress={() => updateQuantity(item.id, 1)} className="p-2">
                    <Icon source="plus" size={16} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TouchableOpacity onPress={() => removeItem(item.id)} className="absolute top-3 right-3 bg-black/30 p-1 rounded-full">
              <Icon source="close" size={16} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Footer / Checkout (玻璃擬態) */}
      <View className="absolute bottom-0 left-0 right-0 bg-black/80 p-6 rounded-t-3xl shadow-[0_-5px_15px_rgba(0,0,0,0.5)] border-t border-white/10 backdrop-blur-md pb-10">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-gray-300 text-lg">Total Amount</Text>
          <Text className="text-3xl font-black text-primary">${totalAmount.toFixed(2)}</Text>
        </View>
        
        <TouchableOpacity 
          onPress={handleCheckout}
          className="bg-primary py-4 rounded-2xl shadow-lg items-center"
        >
          <Text className="text-black text-xl font-bold tracking-widest">INITIATE CHECKOUT</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}