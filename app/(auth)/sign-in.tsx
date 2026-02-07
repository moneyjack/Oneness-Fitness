// app/(auth)/sign-in.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/auth';
import ScreenWrapper from '../../components/ScreenWrapper';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import "../../global.css";

export default function AuthScreen() {
  const router = useRouter();
  const { signIn, signUp, signInWithGoogle, user } = useAuth();

  // 1. 狀態管理
  const [isLoginMode, setIsLoginMode] = useState(true); //用來切換 登入/註冊 模式
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [name, setName] = useState(''); // 只有註冊模式需要
  const [loading, setLoading] = useState(false);

  // 2. 自動跳轉 (監聽 user)
  useEffect(() => {
    if (user) {
      router.replace('/(main)/home');
    }
  }, [user]);

  // 3. 統一處理送出
  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isLoginMode) {
        // --- 登入模式 ---
        const { error } = await signIn(email, password);
        if (error) Alert.alert('Login Failed', error.message);
      } else {
        // --- 註冊模式 ---
        if (!name) {
          Alert.alert('Error', 'Please enter your name');
          setLoading(false);
          return;
        }
        const { data, error } = await signUp(email, password, name);
        if (error) {
          Alert.alert('Registration Failed', error.message);
        } else if (!data.session) {
          Alert.alert('Success', 'Please check your email to verify your account.');
          setIsLoginMode(true); // 註冊完自動切回登入
        }
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper withHeader={false} >

      {/* 🌟 新增：右上角的關閉按鈕 (回到首頁) */}
      <TouchableOpacity 
        onPress={() => router.replace('/(main)/home')} 
        className="absolute top-12 right-6 z-50 bg-white/10 p-2 rounded-full border border-white/20 active:bg-white/20 backdrop-blur-md"
      >
        <Icon source="close" size={24} color="#FFF" /> 
      </TouchableOpacity>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center px-8"
      >
        {/* --- 標題區 --- */}
        <View className="items-center mb-10">
          <View className="w-20 h-20 bg-white/10 rounded-full items-center justify-center border border-white/20 mb-4 shadow-lg backdrop-blur-md">
            <Icon source="orbit" size={40} color="#4DC6B9" />
          </View>
          <Text className="text-4xl font-light text-white tracking-[6px] shadow-black/50 shadow-lg">
            ONENESS
          </Text>
          <Text className="text-white/40 mt-2 tracking-widest text-xs uppercase">
            {isLoginMode ? "Journey Back to Self" : "Begin Your Awakening"}
          </Text>
        </View>

        {/* --- 主卡片 (玻璃擬態) --- */}
        <View className="bg-black/40 p-6 rounded-3xl border border-white/10 backdrop-blur-md">
          
          {/* 🌟 1. Google 登入 (最顯眼) */}
          <TouchableOpacity 
            onPress={() => signInWithGoogle()}
            className="flex-row items-center justify-center bg-white text-black py-4 rounded-xl shadow-lg active:opacity-90 mb-6"
          >
            <Icon source="google" size={20} color="#000" />
            <Text className="text-black font-bold ml-3 text-base tracking-wide">
              Continue with Google
            </Text>
          </TouchableOpacity>

          {/* 分隔線 */}
          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-[1px] bg-white/10" />
            <Text className="mx-4 text-white/20 text-[10px] uppercase tracking-widest">Or via Email</Text>
            <View className="flex-1 h-[1px] bg-white/10" />
          </View>

          {/* 🌟 2. Email 表單 (根據模式切換) */}
          <View>
            {/* 只有註冊模式才顯示 Name */}
            {!isLoginMode && (
              <Animated.View entering={FadeIn} exiting={FadeOut}>
                <TextInput
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-base mb-4"
                  placeholder="Full Name"
                  placeholderTextColor="#666"
                  value={name}
                  onChangeText={setName}
                />
              </Animated.View>
            )}

            <TextInput
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-base mb-4"
              placeholder="Email"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-base mb-6"
              placeholder="Password"
              placeholderTextColor="#666"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {/* 送出按鈕 */}
            <TouchableOpacity 
              onPress={handleSubmit}
              disabled={loading}
              className="bg-cyan-500/20 border border-cyan-500/50 py-4 rounded-xl items-center active:bg-cyan-500/30"
            >
              {loading ? (
                <ActivityIndicator color="#4DC6B9" />
              ) : (
                <Text className="text-cyan-400 font-bold tracking-[2px] uppercase">
                  {isLoginMode ? 'Enter Cosmos' : 'Join the Stars'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

        </View>

        {/* --- 底部切換 (Toggle) --- */}
        <View className="mt-8 flex-row justify-center">
          <Text className="text-gray-400 text-sm">
            {isLoginMode ? "New directly from stardust? " : "Already have an account? "}
          </Text>
          <TouchableOpacity onPress={() => setIsLoginMode(!isLoginMode)}>
            <Text className="text-cyan-400 font-bold text-sm underline decoration-cyan-400 ml-1">
              {isLoginMode ? "Create Account" : "Sign In"}
            </Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}