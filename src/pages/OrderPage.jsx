import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/AppHeader';

export const OrderPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-32 flex flex-col">
      <AppHeader />
      
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center justify-center rounded-[2rem] border border-gray-100 bg-white px-8 py-16 text-center shadow-sm animate-pop-in">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-50 to-orange-100">
              <ShoppingCart size={48} className="text-[#F27322]" strokeWidth={1.5} />
            </div>
            
            <h2 className="mt-6 text-[22px] font-black text-gray-900 tracking-tight">Belum Ada Pesanan</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-gray-400 font-bold">
              Sepertinya Anda belum memesan apapun.<br />Yuk, mulai cari makanan favoritmu!
            </p>
            
            <button 
              onClick={() => navigate('/')}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#F27322] h-14 font-black text-white shadow-lg shadow-orange-200 transition-all active:scale-95"
            >
              <span>Mulai Pesan</span>
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
