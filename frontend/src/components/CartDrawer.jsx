import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Plus, Minus, ReceiptText, CheckCircle2, Clock, ChevronRight } from 'lucide-react';
import { useCheckout } from '../context/CheckoutContext';
import { formatRp } from '../utils/formatting';

export const CartDrawer = () => {
  const navigate = useNavigate();
  const {
    isCartOpen,
    closeCart,
    cartDraft,
    setCartQuantity,
    getOrders,
    isAuthenticated,
  } = useCheckout();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const quantity = cartDraft?.quantity || 0;

  // Fetch order history when drawer opens
  useEffect(() => {
    const fetchHistory = async () => {
      if (isCartOpen && isAuthenticated) {
        setLoadingOrders(true);
        try {
          const list = await getOrders();
          setOrders(list || []);
        } catch (err) {
          console.error('Failed fetching orders in drawer:', err);
        } finally {
          setLoadingOrders(false);
        }
      }
    };
    fetchHistory();
  }, [isCartOpen, isAuthenticated, getOrders]);

  if (!isCartOpen) return null;

  const handleOrderClick = (order) => {
    closeCart();
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <style>{`
        .drawer-overlay {
          animation: fadeInOverlay 0.25s ease both;
        }
        .drawer-sheet {
          animation: slideUpDrawer 0.35s cubic-bezier(0.25, 1, 0.5, 1) both;
        }
        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUpDrawer {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>

      {/* Backdrop overlay */}
      <div 
        className="drawer-overlay fixed inset-0 z-[100] bg-black/40 backdrop-blur-[4px] transition-all"
        onClick={closeCart}
      />

      {/* Drawer Container */}
      <div 
        className="drawer-sheet fixed bottom-0 left-0 right-0 z-[101] mx-auto flex h-[82vh] w-full max-w-[390px] flex-col rounded-t-[2.5rem] bg-[#FAFAF8] shadow-[0_-8px_40px_rgba(0,0,0,0.15)] overflow-hidden font-sans border-t border-[#F0EFE9]"
      >
        {/* Notch / Handle */}
        <div className="flex justify-center py-3 flex-shrink-0">
          <div className="h-1.5 w-12 rounded-full bg-gray-200" />
        </div>

        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-[#F27322]">
              <ShoppingBag size={18} strokeWidth={2.5} />
            </div>
            <h2 className="text-[17px] font-black text-gray-900 tracking-tight">Keranjang & Riwayat</h2>
          </div>
          <button 
            onClick={closeCart}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-400 active:scale-90 transition-all"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          
          {/* ── SECTION 1: ACTIVE CART DRAFT ── */}
          <div>
            <div className="flex items-center gap-2 mb-3 px-1">
              <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-bold text-[#F27322]">1</div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">Keranjang Aktif</span>
            </div>

            {(cartDraft.items && cartDraft.items.length > 0) ? (
              <div className="space-y-3">
                {cartDraft.items.map((item) => (
                  <div key={item.product.id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm space-y-3">
                    <div className="flex gap-3 items-center">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-16 h-16 rounded-xl object-cover border border-gray-50 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[13.5px] font-black text-gray-900 leading-snug truncate">{item.product.name}</h3>
                        <p className="text-[11px] font-semibold text-gray-400 mt-0.5 truncate">{item.product.description}</p>
                        <p className="text-[13.5px] font-black text-[#F27322] mt-1">{item.product.price}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                      <span className="text-[12px] font-bold text-gray-500">Jumlah Porsi</span>
                      
                      {/* Quantity selector */}
                      <div className="flex items-center bg-[#F7F8FA] rounded-xl border border-gray-100 overflow-hidden h-9">
                        <button
                          onClick={() => setCartQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-gray-600 active:bg-gray-100 font-bold"
                        >
                          <Minus size={14} strokeWidth={3} />
                        </button>
                        <div className="w-px h-4 bg-gray-200" />
                        <span className="w-10 text-center text-xs font-black text-gray-900 select-none">
                          {item.quantity}
                        </span>
                        <div className="w-px h-4 bg-gray-200" />
                        <button
                          onClick={() => setCartQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-gray-600 active:bg-gray-100 font-bold"
                        >
                          <Plus size={14} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Checkout CTA */}
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/order-data');
                  }}
                  className="w-full h-11 mt-2 rounded-xl bg-[#F27322] font-black text-white text-[12.5px] shadow-md shadow-orange-950/10 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                >
                  <span>Checkout Sekarang</span>
                  <ChevronRight size={16} strokeWidth={2.5} />
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white/50 px-4 py-8 text-center">
                <span className="text-2xl">🍛</span>
                <p className="text-[12px] font-bold text-gray-400 mt-2">Keranjang Anda masih kosong</p>
              </div>
            )}
          </div>

          {/* ── SECTION 2: PLACED ORDERS HISTORY ── */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 text-[10px] font-bold text-[#F27322]">
                  <ReceiptText size={10} strokeWidth={3} />
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">Riwayat Pesanan Anda</span>
              </div>
              {orders.length > 0 && (
                <span className="text-[10px] font-black bg-orange-50 text-[#F27322] px-2 py-0.5 rounded-full">
                  {orders.length} Pesanan
                </span>
              )}
            </div>

            {loadingOrders ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#F27322] mb-2" />
                <p className="text-[11px] font-bold">Memuat riwayat...</p>
              </div>
            ) : !isAuthenticated ? (
              <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center space-y-3">
                <span className="text-3xl block">🔑</span>
                <h4 className="text-[13px] font-black text-gray-900">Belum Masuk Akun</h4>
                <p className="text-[11px] text-gray-400 font-semibold leading-relaxed">
                  Silakan tambah makanan ke keranjang atau masuk untuk melihat riwayat pesanan Anda.
                </p>
              </div>
            ) : orders.length === 0 ? (
              <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center space-y-3">
                <span className="text-3xl block">🍱</span>
                <h4 className="text-[13px] font-black text-gray-900">Belum Ada Pesanan</h4>
                <p className="text-[11px] text-gray-400 font-semibold leading-relaxed">
                  Semua makanan lezat yang Anda pesan sebelumnya akan muncul di daftar ini.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {orders.map((order) => {
                  const isPaid = order.paymentStatus === 'COMPLETED';
                  return (
                    <div
                      key={order.id}
                      onClick={() => handleOrderClick(order)}
                      className="bg-white rounded-xl border border-gray-100 p-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)] active:scale-[0.98] transition-all cursor-pointer space-y-2.5 hover:border-orange-100"
                    >
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-gray-400 uppercase tracking-wide">
                          UKP-{order.id.substring(0, 8).toUpperCase()}
                        </span>
                        <span className={`font-black px-2 py-0.5 rounded-md flex items-center gap-1 ${
                          isPaid ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                        }`}>
                          {isPaid ? <CheckCircle2 size={9} strokeWidth={3} /> : <Clock size={9} strokeWidth={3} />}
                          {isPaid ? 'SELESAI' : 'BELUM BAYAR'}
                        </span>
                      </div>

                      <div className="flex gap-2.5 items-center">
                        <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                          {order.productImage ? (
                            <img src={order.productImage} alt={order.productName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-base">🍱</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[12px] font-black text-gray-900 truncate leading-snug">
                            {order.productName}
                          </h4>
                          <p className="text-[10px] font-bold text-gray-400 mt-0.5">
                            {order.quantity} Porsi • {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-gray-50 text-[11px]">
                        <div>
                          <span className="text-[9px] font-semibold text-gray-400 block uppercase leading-none">Total</span>
                          <span className="font-black text-[#F27322]">
                            {formatRp(order.total)}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5 font-black text-[#F27322] text-[10px]">
                          <span>{isPaid ? 'Lihat Struk' : 'Bayar'}</span>
                          <ChevronRight size={12} strokeWidth={3} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};
