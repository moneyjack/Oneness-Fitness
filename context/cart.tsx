import React, { createContext, useContext, useState, ReactNode } from 'react';

// 定義商品型別 (跟你 inventory.tsx 的假資料一致)
type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
};

// 購物車裡的商品，多了一個 quantity (數量)
export type CartItem = Product & { quantity: number };

type CartContextType = {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  totalAmount: number;
  totalItems: number;
};

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalAmount: 0,
  totalItems: 0,
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // 1. 加入購物車
  const addItem = (product: Product) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);
      if (existingItem) {
        // 如果已經有了，數量 +1
        return currentItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // 如果沒有，新增一個
      return [...currentItems, { ...product, quantity: 1 }];
    });
  };

  // 2. 移除商品
  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  // 3. 更新數量 (加減)
  const updateQuantity = (id: string, delta: number) => {
    setItems((currentItems) => {
      return currentItems.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta); // 最少要是 1
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  // 4. 清空購物車
  const clearCart = () => setItems([]);

  // 5. 計算總價
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 6. 計算總數量 (給 Badge 用的)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalAmount, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);