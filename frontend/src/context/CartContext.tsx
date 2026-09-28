"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  packWeight?: string;
  image?: string;
}

interface GuestCartStorage {
  items: CartItem[];
  updatedAt: number;
  expiresAt: number;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoggedIn: boolean;
  expiresAt: number | null;
  addItem: (
    product: {
      id: number;
      name: string;
      price: number;
      packWeight?: string;
      image?: string;
    },
    qty?: number
  ) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
}

const GUEST_CART_KEY = "ubofood_guest_cart";
// Thời gian tự động reset giỏ hàng khách vãng lai: 24 giờ (tính bằng milliseconds)
const CART_TTL_MS = 24 * 60 * 60 * 1000;

const CartContext = createContext<CartContextType | undefined>(undefined);

// Kiểm tra xem người dùng đã đăng nhập chưa từ Cookie hoặc Storage
function checkIsLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const hasCookieToken = document.cookie
      .split("; ")
      .some((row) => row.startsWith("token="));
    const hasLocalAuth =
      !!localStorage.getItem("token") || !!localStorage.getItem("user");
    return hasCookieToken || hasLocalAuth;
  } catch {
    return false;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // 1. Kiểm tra trạng thái đăng nhập và tải giỏ hàng từ localStorage nếu chưa đăng nhập
  const loadCartFromStorage = useCallback(() => {
    if (typeof window === "undefined") return;

    const loggedIn = checkIsLoggedIn();
    setIsLoggedIn(loggedIn);

    // Nếu người dùng chưa đăng nhập, tải từ localStorage và kiểm tra TTL 24h
    if (!loggedIn) {
      try {
        const raw = localStorage.getItem(GUEST_CART_KEY);
        if (raw) {
          const parsed: GuestCartStorage = JSON.parse(raw);
          const now = Date.now();

          // Kiểm tra xem giỏ hàng đã hết hạn 24 giờ chưa
          if (parsed.expiresAt && now > parsed.expiresAt) {
            // Đã quá 24h -> Tự động reset và dọn dẹp localStorage
            localStorage.removeItem(GUEST_CART_KEY);
            setItems([]);
            setExpiresAt(null);
          } else if (Array.isArray(parsed.items)) {
            // Còn trong thời hạn 24h -> Khôi phục giỏ hàng
            setItems(parsed.items);
            setExpiresAt(parsed.expiresAt || now + CART_TTL_MS);
          }
        }
      } catch (err) {
        console.error("Lỗi khi đọc giỏ hàng từ localStorage:", err);
        localStorage.removeItem(GUEST_CART_KEY);
      }
    }
    setIsInitialized(true);
  }, []);

  // Khởi chạy khi mount
  useEffect(() => {
    loadCartFromStorage();

    // Lắng nghe khi tab active trở lại (focus hoặc đổi tab) để kiểm tra lại thời gian hết hạn 24h
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadCartFromStorage();
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", loadCartFromStorage);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", loadCartFromStorage);
    };
  }, [loadCartFromStorage]);

  // 2. Tự động lưu giỏ hàng vào localStorage với hạn reset 24h khi giỏ hàng thay đổi
  useEffect(() => {
    if (!isInitialized || typeof window === "undefined") return;

    // Chỉ lưu vào localStorage cho khách chưa đăng nhập
    if (!isLoggedIn) {
      if (items.length > 0) {
        const now = Date.now();
        // Thời điểm hết hạn là 24h kể từ lần cập nhật gần nhất
        const newExpiresAt = now + CART_TTL_MS;
        const payload: GuestCartStorage = {
          items,
          updatedAt: now,
          expiresAt: newExpiresAt,
        };
        try {
          localStorage.setItem(GUEST_CART_KEY, JSON.stringify(payload));
          setExpiresAt(newExpiresAt);
        } catch {
          // Xử lý khi vượt dung lượng storage
        }
      } else {
        localStorage.removeItem(GUEST_CART_KEY);
        setExpiresAt(null);
      }
    }
  }, [items, isLoggedIn, isInitialized]);

  // 3. Các hàm thao tác giỏ hàng
  const addItem = (
    product: {
      id: number;
      name: string;
      price: number;
      packWeight?: string;
      image?: string;
    },
    qty = 1
  ) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: qty,
          packWeight: product.packWeight,
          image: product.image,
        },
      ];
    });
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(GUEST_CART_KEY);
    }
    setExpiresAt(null);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        isLoggedIn,
        expiresAt,
        addItem,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
