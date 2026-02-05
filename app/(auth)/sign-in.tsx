// app/(auth)/sign-in.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Icon } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/auth';
import ScreenWrapper from '../../components/ScreenWrapper'; // ✅ 引入背景
import "../../global.css";

export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [loading, setLoading] = useState(false);

  const isFormValid = email.length > 0 && password.length > 0;

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        Alert.alert('Login Failed', error.message);
      } else {
        if (router.canGoBack()) router.back();
        else router.replace('/(main)/home');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    // ✅ 使用 ScreenWrapper 包裹，withHeader={false} 讓我們自己控制排版
    <ScreenWrapper withHeader={false}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 px-6 justify-center"
      >
        {/* Close Button */}
        <TouchableOpacity 
          onPress={() => router.canGoBack() ? router.back() : router.replace('/(main)/home')} 
          className="absolute top-4 right-4 z-10 bg-white/10 p-2 rounded-full"
        >
          <Icon source="close" size={24} color="#FFF" /> 
        </TouchableOpacity>

        {/* 標題 */}
        <View className="mb-10 items-center">
          <Icon source="rocket-launch-outline" size={60} color="#4DC6B9" />
          <Text className="text-4xl font-bold text-white mt-4 tracking-wider">Welcome Back</Text>
          <Text className="text-gray-400 mt-2">Sign in to continue your journey</Text>
        </View>

        {/* Form Container (玻璃質感) */}
        <View className="bg-white/10 p-6 rounded-3xl border border-white/20 backdrop-blur-md">
          
          {/* Email */}
          <View className="mb-6">
            <Text className="text-gray-300 mb-2 text-sm font-bold uppercase tracking-wider">Email</Text>
            <TextInput
              className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-lg"
              placeholder="user@example.com"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Password */}
          <View className="mb-6">
            <Text className="text-gray-300 mb-2 text-sm font-bold uppercase tracking-wider">Password</Text>
            <TextInput
              className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-lg"
              placeholder="••••••••"
              placeholderTextColor="#666"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Toggle Password */}
          <View className="flex-row items-center justify-between mb-8">
            <Text className="text-gray-400 text-sm">Show Password</Text>
            <Switch
              trackColor={{ false: "#555", true: "#4DC6B9" }} 
              thumbColor="#FFF"
              ios_backgroundColor="#555"
              onValueChange={setShowPassword}
              value={showPassword}
            />
          </View>

          {/* Button */}
          <TouchableOpacity 
            onPress={handleSignIn}
            disabled={!isFormValid || loading}
            className={`py-4 rounded-xl shadow-lg flex-row justify-center items-center ${
              isFormValid ? 'bg-primary' : 'bg-gray-600 opacity-50' 
            }`}
          >
            {loading && <View className="mr-2"><Icon source="loading" size={18} color="#000"/></View>}
            <Text className="text-black text-lg font-bold tracking-widest">
              {loading ? 'WARPING IN...' : 'SIGN IN'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer Actions */}
        <View className="mt-8 flex-row justify-between items-center px-2">
            <TouchableOpacity onPress={() => console.log('Reset Password')}>
               <Text className="text-gray-400 text-sm">Forgot Password?</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
               <Text className="text-primary font-bold text-sm">Create Account</Text>
            </TouchableOpacity>
        </View>
        
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}