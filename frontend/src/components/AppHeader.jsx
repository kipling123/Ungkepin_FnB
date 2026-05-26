import { Menu, ShoppingBag, ChevronLeft } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCheckout } from '../context/CheckoutContext';

export function AppHeader() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { cartDraft } = useCheckout();
  const count = cartDraft?.quantity || 0;
  
  const isCheckout = ['/order-data', '/order-summary', '/payment'].includes(pathname);

  return (
    <header className="sticky top-0 z-50 flex h-[72px] w-full items-center justify-between border-b border-gray-50 bg-white/90 backdrop-blur-lg px-6 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
      {isCheckout ? (
        <button
          onClick={() => navigate(-1)}
          className="flex h-11 w-11 items-center justify-center bg-gray-50 text-gray-700 active:scale-90 transition-all"
          style={{ borderRadius: 8 }}
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
        </button>
      ) : (
        <button
          className="flex h-11 w-11 items-center justify-center bg-gray-50 text-[#F27322] active:scale-90 transition-all"
          style={{ borderRadius: 8 }}
        >
          <Menu size={20} strokeWidth={2.5} />
        </button>
      )}

      <h1 className="text-[22px] font-black tracking-tight text-[#F27322]">Ungkeepin</h1>

      <Link
        to={cartDraft?.product ? '/order-data' : '/'}
        onClick={(e) => {
          if (!cartDraft?.product) {
            e.preventDefault();
            alert("Keranjang belanja Anda masih kosong. Silakan pilih menu terlebih dahulu!");
            navigate('/');
          }
        }}
        className="relative flex h-11 w-11 items-center justify-center bg-[#F27322] text-white shadow-lg shadow-orange-100 active:scale-90 transition-all"
        style={{ borderRadius: 8 }}
      >
        <ShoppingBag size={18} strokeWidth={2.5} />
        {count > 0 ? (
          <span 
            key={count}
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white ring-2 ring-white shadow-sm"
          >
            {count}
          </span>
        ) : null}
      </Link>
    </header>
  );
}
