import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Icon } from 'react-native-paper';
import { useRouter } from 'expo-router'; // 1. 引入 Router
import { useAuth } from '../../context/auth'; // 2. 引入 Auth Context (假設路徑正確)
import { SafeAreaView } from 'react-native-safe-area-context';
export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAuth(); // 使用全域登入方法

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>(''); 
  const [password, setPassword] = useState<string>(''); 
  const [loading, setLoading] = useState(false);

  // 判斷表單是否填寫完整
  const isFormValid = email.length > 0 && password.length > 0;

  // 在 sign-in.tsx 裡...

  const handleSignIn = async () => {
    setLoading(true);
    try {
      // 修改這裡：傳入 email 和 password
      const { error } = await signIn(email, password);
      
      if (error) {
        // 如果 Supabase 回傳錯誤 (例如密碼錯誤)
        Alert.alert('Login Failed', error.message);
      } else {
        // 登入成功
        // 注意：因為 AuthContext 裡有監聽器，狀態會自動更新，
        // 這裡只要負責跳轉頁面就好
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/(main)/videos');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // 3. 處理關閉邏輯：回到上一頁
    if (router.canGoBack()) {
      router.back();
    } else {
      // 如果沒有上一頁 (例如直接開啟 App 就在這)，則導向首頁
      router.replace('/(main)/videos');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* 頂部 App Bar - 'X' 關閉按鈕 */}
      <View className="flex-row justify-end items-center px-4 py-4 border-b border-gray-100">
        
        <TouchableOpacity onPress={handleClose} className="p-2">
          <Icon source="close" size={28} color="#333" /> 
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 px-6 pt-4" 
      >
        {/* 標題 */}
        <Text className="text-3xl font-bold text-gray-800 mb-10 mt-2">Sign in</Text>

        {/* 電子郵件輸入框 */}
        <TextInput
          className="border-b border-gray-300 py-3 text-lg text-gray-800 mb-6"
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        {/* 密碼輸入框 */}
        <TextInput
          className="border-b border-gray-300 py-3 text-lg text-gray-800 mb-8" 
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />

        {/* 顯示密碼切換 */}
        <View className="flex-row items-center justify-between mb-10">
          <Text className="text-gray-600 text-base">show password</Text>
          <Switch
            trackColor={{ false: "#E0E0E0", true: "#4DC6B9" }} 
            thumbColor="#FFFFFF"
            ios_backgroundColor="#E0E0E0"
            onValueChange={setShowPassword}
            value={showPassword}
          />
        </View>

        {/* 繼續按鈕 */}
        <TouchableOpacity 
          onPress={handleSignIn}
          disabled={!isFormValid || loading}
          className={`py-4 rounded-lg ${
            isFormValid ? 'bg-primary' : 'bg-gray-300' 
          }`}
        >
          <Text className="text-white text-lg font-bold text-center">
            {loading ? 'Signing in...' : 'Continue'}
          </Text>
        </TouchableOpacity>
        
        {/* 重設密碼 */}
        <TouchableOpacity className="mt-6 self-center">
          <Text className="text-primary text-base font-semibold">Reset password</Text>
        </TouchableOpacity>
        {/* 新增：去註冊頁面的連結 */}
        <View className="flex-row justify-center mt-8">
          <Text className="text-gray-600 text-base">Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
            <Text className="text-primary text-base font-bold">Sign up</Text>
          </TouchableOpacity>
        </View>
        
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}