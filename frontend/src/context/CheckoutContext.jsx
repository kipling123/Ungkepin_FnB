import { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react';
import { apiClient } from '../services/api';

const CheckoutContext = createContext(null);

/** Satu menu per checkout; badge = jumlah porsi di keranjang (sesuai mockup). */
export function CheckoutProvider({ children }) {
  const [cartDraft, setCartDraft] = useState({ items: [], quantity: 0, product: null });
  const [checkout, setCheckout] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = apiClient.getToken();
      if (token) {
        try {
          const data = await apiClient.verifyToken(token);
          setUser(data.user);
          setIsAuthenticated(true);
        } catch (err) {
          apiClient.clearToken();
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = useCallback(async (phone, fullName) => {
    try {
      const data = await apiClient.login(phone, fullName);
      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (err) {
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    setUser(null);
    setIsAuthenticated(false);
    setCurrentOrder(null);
    setCheckout(null);
    setCartDraft({ items: [], quantity: 0, product: null });
    setIsCartOpen(false);
  }, []);

  const addToCart = useCallback((product) => {
    setCheckout(null);
    setCartDraft((d) => {
      const items = d.items || [];
      const existingIdx = items.findIndex((item) => item.product.id === product.id);
      let newItems;
      if (existingIdx > -1) {
        newItems = items.map((item, idx) =>
          idx === existingIdx ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newItems = [...items, { product, quantity: 1 }];
      }
      const totalQty = newItems.reduce((acc, item) => acc + item.quantity, 0);
      return {
        items: newItems,
        quantity: totalQty,
        product: newItems[0]?.product || null,
      };
    });
  }, []);

  const setCartQuantity = useCallback((productId, qty) => {
    setCartDraft((d) => {
      let targetId = productId;
      let targetQty = qty;

      // Handle legacy signature setCartQuantity(qty)
      if (typeof productId === 'number') {
        targetQty = productId;
        targetId = d.items?.[0]?.product?.id;
      }

      if (!targetId) return d;

      const items = d.items || [];
      const newItems = items
        .map((item) => {
          if (item.product.id === targetId) {
            return { ...item, quantity: Math.max(0, Math.min(99, targetQty)) };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);

      const totalQty = newItems.reduce((acc, item) => acc + item.quantity, 0);
      return {
        items: newItems,
        quantity: totalQty,
        product: newItems[0]?.product || null,
      };
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartDraft({ items: [], quantity: 0, product: null });
    setCheckout(null);
  }, []);

  const saveForSummary = useCallback((payload) => {
    setCheckout(payload);
  }, []);

  const createOrder = useCallback(async (orderData) => {
    try {
      const result = await apiClient.createOrder(orderData);
      setCurrentOrder(result);
      return result;
    } catch (err) {
      throw err;
    }
  }, []);

  const verifyPayment = useCallback(async (orderId, transactionId) => {
    try {
      const result = await apiClient.verifyPayment(orderId, transactionId);
      // Update order status
      setCurrentOrder((prev) => ({
        ...prev,
        paymentStatus: 'COMPLETED',
      }));
      return result;
    } catch (err) {
      throw err;
    }
  }, []);

  const checkPaymentStatus = useCallback(async (orderId) => {
    try {
      const result = await apiClient.checkPaymentStatus(orderId);
      return result;
    } catch (err) {
      throw err;
    }
  }, []);

  const getOrders = useCallback(async () => {
    try {
      const result = await apiClient.getOrders();
      return result.orders;
    } catch (err) {
      throw err;
    }
  }, []);

  const value = useMemo(
    () => ({
      // Cart Open/Close State
      isCartOpen,
      openCart,
      closeCart,
      // Cart
      cartDraft,
      addToCart,
      setCartQuantity,
      clearCart,
      cartSummary: checkout,
      saveForSummary,
      // Auth
      user,
      isAuthenticated,
      loading,
      login,
      logout,
      // Orders
      currentOrder,
      createOrder,
      verifyPayment,
      checkPaymentStatus,
      getOrders,
    }),
    [
      isCartOpen,
      openCart,
      closeCart,
      cartDraft,
      addToCart,
      setCartQuantity,
      clearCart,
      checkout,
      saveForSummary,
      user,
      isAuthenticated,
      loading,
      login,
      logout,
      currentOrder,
      createOrder,
      verifyPayment,
      checkPaymentStatus,
      getOrders,
    ],
  );

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) {
    throw new Error('useCheckout must be used within CheckoutProvider');
  }
  return ctx;
}
