import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const CheckoutContext = createContext(null);

/** Satu menu per checkout; badge = jumlah porsi di keranjang (sesuai mockup). */
export function CheckoutProvider({ children }) {
  const [cartDraft, setCartDraft] = useState({ product: null, quantity: 0 });
  const [checkout, setCheckout] = useState(null);

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

  const value = useMemo(
    () => ({
      cartDraft,
      addToCart,
      setCartQuantity,
      clearCart,
      cartSummary: checkout,
      saveForSummary,
    }),
    [cartDraft, addToCart, setCartQuantity, clearCart, checkout, saveForSummary],
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
