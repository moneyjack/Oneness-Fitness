// context/auth.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  name: string;
}

type AuthContextType = {
  user: User | null;
  signIn: () => void;
  signOut: () => void;
};

// 定義 Context
const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: () => {},
  signOut: () => {},
});

// Provider 組件
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // 模擬：App 啟動時檢查一次 (只會在 App 剛開時跑一次，不會在切換頁面時跑)
  useEffect(() => {
    // 這裡檢查 AsyncStorage 或 API
    console.log("App 啟動：檢查登入狀態...");
    // 假設沒登入
    setUser(null); 
  }, []);

  const signIn = () => setUser({ name: "User" });
  const signOut = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook 方便調用
export const useAuth = () => useContext(AuthContext);