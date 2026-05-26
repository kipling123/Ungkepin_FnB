import { ShoppingBasket, ArrowRight } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { CheckoutProvider, useCheckout } from './context/CheckoutContext';
import { BottomNavigation } from './components/BottomNavigation';
import { MenuPage } from './pages/MenuPage';
import { OrderDataPage } from './pages/OrderDataPage';
import { OrderSummaryPage } from './pages/OrderSummaryPage';
import { PaymentPage } from './pages/PaymentPage';
import { OrderPage } from './pages/OrderPage';
import { ReceiptPage } from './pages/ReceiptPage';
import { Loader } from './components/Loader';
import './App.css';
import { useState, useEffect } from 'react';

function Shell() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { cartDraft } = useCheckout();
  
  const [isLoading, setIsLoading] = useState(true);
  const [prevPath, setPrevPath] = useState(pathname);
  
  // Adjusting state during render is a valid React pattern for prop-to-state sync
  if (pathname !== prevPath) {
    setIsLoading(true);
    setPrevPath(pathname);
  }

  useEffect(() => {
    // Initial load
    const timer = setTimeout(() => setIsLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading && pathname === prevPath) {
      const timer = setTimeout(() => setIsLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isLoading, pathname, prevPath]);

  const hideNav = ['/order-data', '/order-summary', '/payment', '/receipt'].includes(pathname);
  const showFloatingBar = pathname === '/' && cartDraft.product;

  return (
    <div className="relative mx-auto flex h-screen w-full max-w-[390px] flex-col bg-[#F8F9FA] shadow-[0_0_100px_rgba(0,0,0,0.05)] isolation-auto overflow-hidden">
      <div className="flex-1 overflow-y-auto scroll-smooth">
        {isLoading ? (
          <div className="flex h-full items-center justify-center bg-white/50 backdrop-blur-sm animate-fade-in">
            <Loader />
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<MenuPage />} />
            <Route path="/order-data" element={<OrderDataPage />} />
            <Route path="/order-summary" element={<OrderSummaryPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/receipt" element={<ReceiptPage />} />
          </Routes>
        )}
      </div>

      {/* Global Floating Checkout Bar */}
      {showFloatingBar && (
        <div className="absolute bottom-[72px] left-0 z-50 w-full px-4 pb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button 
            onClick={() => navigate('/order-data')}
            className="flex w-full items-center justify-between rounded bg-[#f27322] p-4 font-bold text-white shadow-[0_8px_30px_rgb(242,115,34,0.3)] transition-all active:scale-95"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-white/20">
                <ShoppingBasket size={22} strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <p className="text-[14px] leading-tight">{cartDraft.quantity} Item Pesanan</p>
                <p className="text-[10px] text-white/70">Sudah siap untuk checkout?</p>
              </div>
            </div>
            <div className="flex items-center gap-2 border-l border-white/20 pl-4 ml-2">
              <span className="text-[14px]">Lanjut</span>
              <ArrowRight size={18} strokeWidth={2.5} />
            </div>
          </button>
        </div>
      )}

      {!hideNav && <BottomNavigation />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <CheckoutProvider>
        <Shell />
      </CheckoutProvider>
    </Router>
  );
}

export default App;
