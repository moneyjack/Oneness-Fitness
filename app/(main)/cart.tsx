import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { Icon } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useCart } from '../../context/cart';
import "../../global.css";

export default function CartScreen() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, totalAmount, clearCart } = useCart();

  const handleCheckout = () => {
    Alert.alert('Checkout', `Total: $${totalAmount.toFixed(2)}\n(Feature coming soon!)`, [
      { text: 'OK', onPress: clearCart } // 結帳後清空購物車
    ]);
  };

  if (items.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Icon source="cart-outline" size={80} color="#ddd" />
        <Text className="text-gray-400 mt-4 text-lg">Your cart is empty</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-8">
          <Text className="text-primary font-bold text-lg">Go Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="pt-4 pb-4 px-5 bg-white border-b border-gray-100 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Icon source="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-800">My Cart</Text>
      </View>

      {/* Cart Items */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-5 pb-32"
        renderItem={({ item }) => (
          <View className="bg-white rounded-2xl p-4 mb-4 flex-row items-center shadow-sm border border-gray-100">
            {/* Image */}
            <Image 
              source={{ uri: item.image }} 
              className="w-20 h-20 rounded-xl bg-gray-200" 
              resizeMode="cover"
            />
            
            {/* Details */}
            <View className="flex-1 ml-4 h-20 justify-between">
              <View>
                <Text numberOfLines={1} className="text-base font-bold text-gray-800">{item.title}</Text>
                <Text className="text-gray-500 text-sm">{item.category}</Text>
              </View>
              
              <View className="flex-row justify-between items-center">
                <Text className="text-primary font-bold text-lg">${item.price}</Text>
                
                {/* Quantity Control */}
                <View className="flex-row items-center bg-gray-100 rounded-full">
                  <TouchableOpacity onPress={() => updateQuantity(item.id, -1)} className="p-2">
                    <Icon source="minus" size={16} color="#666" />
                  </TouchableOpacity>
                  <Text className="mx-2 font-bold text-gray-800">{item.quantity}</Text>
                  <TouchableOpacity onPress={() => updateQuantity(item.id, 1)} className="p-2">
                    <Icon source="plus" size={16} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Remove Button */}
            <TouchableOpacity onPress={() => removeItem(item.id)} className="absolute top-2 right-2 p-2">
              <Icon source="close" size={18} color="#ccc" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Footer / Checkout */}
      <View className="absolute bottom-0 left-0 right-0 bg-white p-6 rounded-t-3xl shadow-xl border-t border-gray-100">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-gray-500 text-lg">Total Amount</Text>
          <Text className="text-3xl font-extrabold text-gray-800">${totalAmount.toFixed(2)}</Text>
        </View>
        
        <TouchableOpacity 
          onPress={handleCheckout}
          className="bg-primary py-4 rounded-xl shadow-lg items-center"
        >
          <Text className="text-white text-xl font-bold">Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}