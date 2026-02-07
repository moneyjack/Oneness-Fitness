// app/(auth)/sign-up.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Icon } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/auth';
import ScreenWrapper from '../../components/ScreenWrapper';
import "../../global.css";

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, signInWithGoogle } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await signUp(email, password, name);
      if (error) {
        Alert.alert('Registration Failed', error.message);
        return;
      }
      if (data?.session) {
        router.replace('/(main)/home'); 
      } else {
        Alert.alert('Success', 'Please check your email to verify your account.', [{ text: 'OK', onPress: () => router.back() }]);
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper withHeader={false}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 px-6 justify-center"
      >
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="absolute top-4 left-4 z-10 bg-white/10 p-2 rounded-full"
        >
          <Icon source="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>

        <View className="mb-8 ml-2">
          <Text className="text-3xl font-bold text-white tracking-wider">Create Account</Text>
          <Text className="text-primary mt-1 text-lg">Join the Oneness</Text>
        </View>

        <View className="bg-white/10 p-6 rounded-3xl border border-white/20 backdrop-blur-md">
          {/* Inputs */}
          {[
            { label: 'Full Name', val: name, set: setName, place: 'Your Name', type: 'default', secure: false },
            { label: 'Email', val: email, set: setEmail, place: 'user@example.com', type: 'email-address', secure: false },
            { label: 'Password', val: password, set: setPassword, place: 'Create a password', type: 'default', secure: true },
          ].map((item, index) => (
            <View key={index} className="mb-5">
              <Text className="text-gray-300 mb-2 text-xs font-bold uppercase tracking-wider">{item.label}</Text>
              <TextInput
                className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-lg"
                placeholder={item.place}
                placeholderTextColor="#666"
                keyboardType={item.type as any}
                secureTextEntry={item.secure}
                autoCapitalize="none"
                value={item.val}
                onChangeText={item.set}
              />
            </View>
          ))}

          <TouchableOpacity 
            onPress={handleSignUp}
            disabled={loading}
            className={`py-4 mt-2 rounded-xl shadow-lg items-center ${loading ? 'bg-gray-600' : 'bg-primary'}`}
          >
             <Text className="text-black text-lg font-bold tracking-widest">
               {loading ? 'CREATING...' : 'SIGN UP'}
             </Text>
          </TouchableOpacity>
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-[1px] bg-white/10" />
            <Text className="mx-4 text-white/30 text-xs uppercase tracking-widest">Or continue with</Text>
            <View className="flex-1 h-[1px] bg-white/10" />
          </View>

          {/* 🌟 新增：Google 登入按鈕 (玻璃質感) */}
          <TouchableOpacity 
            onPress={() => signInWithGoogle()}
            className="flex-row items-center justify-center bg-white/5 border border-white/10 p-4 rounded-xl active:bg-white/10"
          >
            {/* 這裡用 Google 的 icon，如果沒有圖，可以用 Icon 'google' */}
            <Icon source="google" size={20} color="#FFF" /> 
            <Text className="text-white font-bold ml-3 tracking-wide">Google</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}