import { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react';
import { apiClient } from '../services/api';

const CheckoutContext = createContext(null);

/** Satu menu per checkout; badge = jumlah porsi di keranjang (sesuai mockup). */
export function CheckoutProvider({ children }) {
  const [cartDraft, setCartDraft] = useState({ product: null, quantity: 0 });
  const [checkout, setCheckout] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

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
    setCartDraft({ product: null, quantity: 0 });
  }, []);

  const addToCart = useCallback((product) => {
    setCheckout(null);
    setCartDraft((d) => {
      if (!d.product || d.product.id !== product.id) {
        return { product, quantity: 1 };
      }
      return { ...d, quantity: d.quantity + 1 };
    });
  }, []);

  const setCartQuantity = useCallback((qty) => {
    setCartDraft((d) => (d.product ? { ...d, quantity: Math.max(1, Math.min(99, qty)) } : d));
  }, []);

  const clearCart = useCallback(() => {
    setCartDraft({ product: null, quantity: 0 });
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
