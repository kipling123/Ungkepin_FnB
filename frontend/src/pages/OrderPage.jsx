import { ShoppingCart, ArrowRight, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AppHeader } from '../components/AppHeader';
import { useCheckout } from '../context/CheckoutContext';
import { formatRp } from '../utils/formatting';

export const OrderPage = () => {
  const navigate = useNavigate();
  const { getOrders, isAuthenticated } = useCheckout();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        const data = await getOrders();
        setOrders(data || []);
      } catch (err) {
        console.error("Gagal mengambil riwayat pesanan:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [getOrders, isAuthenticated]);

  const handleOrderClick = (order) => {
    if (order.paymentStatus === 'COMPLETED') {
      navigate(`/receipt?orderId=${order.id}`);
    } else {
      navigate(`/payment?orderId=${order.id}`);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-32 flex flex-col font-sans">
      <AppHeader />
      
      <div className="flex-1 px-4 py-6 max-w-[390px] mx-auto w-full">
        <h2 className="text-lg font-black text-gray-800 mb-4 px-2">Riwayat Pesanan</h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F27322] mb-3"></div>
            <p className="text-xs font-bold">Memuat riwayat...</p>
          </div>
        ) : !isAuthenticated || orders.length === 0 ? (
          <div className="w-full">
            <div className="flex flex-col items-center justify-center rounded-[2rem] border border-gray-100 bg-white px-8 py-16 text-center shadow-sm animate-pop-in">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-50 to-orange-100">
                <ShoppingCart size={48} className="text-[#F27322]" strokeWidth={1.5} />
              </div>
              
              <h2 className="mt-6 text-[22px] font-black text-gray-900 tracking-tight">Belum Ada Pesanan</h2>
              <p className="mt-3 text-[13px] leading-relaxed text-gray-400 font-bold">
                {!isAuthenticated 
                  ? "Silakan lakukan pemesanan terlebih dahulu untuk melihat riwayat pesanan Anda." 
                  : "Sepertinya Anda belum memesan apapun.\nYuk, mulai cari makanan favoritmu!"}
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
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => {
              const isPaid = order.paymentStatus === 'COMPLETED';
              return (
                <div 
                  key={order.id}
                  onClick={() => handleOrderClick(order)}
                  className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm active:scale-[0.98] transition-all cursor-pointer flex flex-col gap-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      UKP-{order.id.substring(0, 8).toUpperCase()}
                    </span>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-md flex items-center gap-1 ${
                      isPaid 
                        ? 'bg-green-50 text-green-600' 
                        : 'bg-yellow-50 text-yellow-600'
                    }`}>
                      {isPaid ? <CheckCircle2 size={10} strokeWidth={3} /> : <Clock size={10} strokeWidth={3} />}
                      {isPaid ? 'SELESAI' : 'BELUM BAYAR'}
                    </span>
                  </div>

                  <div className="flex gap-3 items-center">
                    <div className="w-14 h-14 rounded-lg bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                      {order.productImage ? (
                        <img src={order.productImage} alt={order.productName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-xl">🍱</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[14px] font-black text-gray-900 truncate leading-snug">
                        {order.productName}
                      </h4>
                      <p className="text-[11px] font-bold text-gray-400 mt-0.5">
                        {order.quantity} Porsi • {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-50 pt-3 flex justify-between items-center mt-1">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 block uppercase">Total Harga</span>
                      <span className="text-[14px] font-black text-[#F27322] leading-tight">
                        {formatRp(order.total)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-black text-[#F27322]">
                      <span>{isPaid ? 'Lihat Struk' : 'Bayar Sekarang'}</span>
                      <ChevronRight size={14} strokeWidth={3} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
