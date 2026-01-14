import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Icon } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/auth';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

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
      // 1. 這裡我們要同時接收 data 和 error
      const { data, error } = await signUp(email, password, name);

      if (error) {
        Alert.alert('Registration Failed', error.message);
        return;
      }

      // 2. 判斷是否已經自動登入 (Confirm Email 關閉時會跑進這裡)
      if (data?.session) {
        // 不需要 Alert，直接進首頁
        router.replace('/(main)/videos'); 
      } else {
        // 3. 沒有 Session，代表需要 Email 驗證 (Confirm Email 開啟時會跑進這裡)
        Alert.alert(
          'Success', 
          'Please check your email to verify your account.', 
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }
      
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* 頂部導航：返回按鈕 */}
      <View className="flex-row items-center px-4 py-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Icon source="arrow-left" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 px-6 pt-4" 
      >
        <Text className="text-3xl font-bold text-gray-800 mb-8 mt-2">Create Account</Text>

        {/* 名字輸入框 */}
        <TextInput
          className="border-b border-gray-300 py-3 text-lg text-gray-800 mb-6"
          placeholder="Full Name"
          placeholderTextColor="#9CA3AF"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          className="border-b border-gray-300 py-3 text-lg text-gray-800 mb-6"
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          className="border-b border-gray-300 py-3 text-lg text-gray-800 mb-10" 
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity 
          onPress={handleSignUp}
          disabled={loading}
          className={`py-4 rounded-lg ${loading ? 'bg-gray-400' : 'bg-primary'}`}
        >
          <Text className="text-white text-lg font-bold text-center">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}