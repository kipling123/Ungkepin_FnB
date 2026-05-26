import { Printer, CheckCircle2, ChevronLeft } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCheckout } from '../context/CheckoutContext';
import { formatRp } from '../utils/formatting';
import { AppHeader } from '../components/AppHeader';
import { apiClient } from '../services/api';

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" style={{ marginRight: 6 }}>
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.858.002-2.634-1.023-5.11-2.884-6.974C16.526 1.909 14.058.882 11.996.882c-5.44 0-9.863 4.42-9.867 9.858-.001 1.77.462 3.5 1.34 5.025l-1.096 4.007 4.116-1.08c1.512.82 3.19 1.253 4.858 1.254zm11.233-7.653c-.307-.154-1.82-.9-2.102-1.002-.281-.102-.486-.154-.69.154-.204.307-.792.998-.97 1.196-.179.199-.358.224-.665.07-.307-.154-1.3-.479-2.477-1.529-.918-.818-1.536-1.83-1.716-2.138-.179-.307-.019-.473.135-.626.138-.138.307-.358.46-.537.154-.179.204-.307.307-.512.102-.205.051-.384-.025-.537-.077-.154-.69-1.664-.946-2.278-.25-.6-.523-.518-.717-.528-.184-.01-.397-.012-.61-.012-.213 0-.56.08-.853.4-.293.32-1.12 1.096-1.12 2.67 0 1.575 1.147 3.1 1.301 3.3.154.205 2.257 3.447 5.467 4.834.763.33 1.359.527 1.823.674.767.244 1.467.21 2.02.127.618-.093 1.82-.743 2.076-1.46.256-.717.256-1.33.179-1.46-.076-.13-.281-.205-.589-.359z"/>
  </svg>
);

export const ReceiptPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderIdParam = searchParams.get('orderId');
  const redirectingRef = useRef(false);

  const { cartSummary } = useCheckout();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch order details from database
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderIdParam) {
        setLoading(false);
        return;
      }
      try {
        const data = await apiClient.getOrder(orderIdParam);
        setOrder(data.order);
      } catch (err) {
        console.error("Gagal memuat struk:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderIdParam]);

  const displayTotal = order ? order.total : (cartSummary ? cartSummary.total : 0);
  const displaySubtotal = order ? order.subtotal : (cartSummary ? cartSummary.subtotal : 0);
  const displayDeliveryPrice = order ? order.deliveryPrice : (cartSummary ? cartSummary.deliveryPrice : 0);
  const displayProductName = order ? order.productName : (cartSummary?.product ? cartSummary.product.name : "");
  const displayQuantity = order ? order.quantity : (cartSummary ? cartSummary.quantity : 0);
  const displayFullName = order ? order.fullName : (cartSummary ? cartSummary.fullName : "");

  const displayOrderId = orderIdParam 
    ? `UKP-${orderIdParam.substring(0, 8).toUpperCase()}` 
    : (order?.id ? `UKP-${order.id.substring(0, 8).toUpperCase()}` : "UKP-00000000");

  const displayDate = order?.createdAt 
    ? new Date(order.createdAt).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : new Date().toLocaleString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

  // Generate WhatsApp message and redirect manually
  const handleWhatsApp = () => {
    const phoneNumber = import.meta.env.VITE_ADMIN_WHATSAPP || '6281903967518';
    
    let itemsDetailsText = "";
    if (displayProductName.includes(' + ')) {
      itemsDetailsText = displayProductName.split(' + ').map(item => `• ${item}`).join('\n');
    } else {
      itemsDetailsText = `${displayProductName}\n  × ${displayQuantity}   ${formatRp(displaySubtotal)}`;
    }

    const text = `=============================\n        *UNGKEEPIN*\n   Cita Rasa Nusantara\n=============================\n*ID PESANAN:* ${displayOrderId}\n*TANGGAL:* ${displayDate}\n*PELANGGAN:* ${displayFullName || 'Pelanggan Setia'}\n-----------------------------\n*Rincian Pesanan:*\n${itemsDetailsText}\n-----------------------------\n*Subtotal:* ${formatRp(displaySubtotal)}\n*Ongkir:* ${formatRp(displayDeliveryPrice)}\n-----------------------------\n*TOTAL:* ${formatRp(displayTotal)}\n=============================\n\nSaya telah melakukan pembayaran. Berikut konfirmasi struk belanja saya.`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.location.href = whatsappUrl;
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#F7F8FA', fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}>
        <p style={{ fontWeight: 800, color: '#F27322' }}>Memuat struk pesanan...</p>
      </div>
    );
  }

  // If no data, redirect to menu
  if (!order && (!cartSummary || !cartSummary.product)) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-white p-6 text-center">
        <p className="text-gray-400 font-bold">Belum ada struk untuk ditampilkan</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 rounded-md bg-[#F27322] px-6 py-2 text-sm font-black text-white"
        >
          Kembali ke Menu
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#F7F8FA',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      maxWidth: '100%',
      width: '100%',
      margin: '0 auto',
      paddingBottom: 120,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* CSS for printing */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #receipt-paper, #receipt-paper * { visibility: visible; }
          #receipt-paper { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }

        @keyframes paper-feed {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(0); opacity: 1; }
        }

        @keyframes paper-jitter {
          0%, 100% { margin-left: 0; }
          25% { margin-left: 0.5px; }
          75% { margin-left: -0.5px; }
        }

        .printer-slot {
          background: #2D3748;
          height: 16px;
          width: 100%;
          border-radius: 6px 6px 0 0;
          position: relative;
          z-index: 20;
          box-shadow: inset 0 -4px 10px rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.2);
        }
        
        .printer-slot::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          width: 96%;
          height: 8px;
          background: #0F172A;
          border-radius: 10px;
        }

        .animate-paper-feed {
          /* Slow, step-like animation to mimic thermal printer */
          animation: 
            paper-feed 5s steps(60, end) forwards,
            paper-jitter 0.1s infinite;
        }

        .jagged-edge {
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.05));
        }
      `}</style>

      <div className="no-print">
        <AppHeader />
        <div style={{ padding: '24px 20px 0', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#DCFCE7', color: '#15803D',
            padding: '8px 16px', borderRadius: 30, marginBottom: 16
          }}>
            <CheckCircle2 size={16} strokeWidth={3} />
            <span style={{ fontSize: 13, fontWeight: 800 }}>Pembayaran Berhasil!</span>
          </div>
        </div>
      </div>

      {/* Main Receipt Content with Printer Effect */}
      <div id="receipt-content" style={{ padding: '20px 16px', overflow: 'hidden', flex: 1 }}>
        {/* Printer Slot Mockup */}
        <div className="no-print printer-slot" />

        <div id="receipt-paper" className="animate-paper-feed jagged-edge" style={{
          background: '#fff', 
          borderRadius: '0 0 4px 4px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          position: 'relative',
          overflow: 'hidden',
          zIndex: 10
        }}>
          {/* Top Jagged Edge Decoration */}
          <div style={{ 
            height: 8, width: '100%', 
            background: 'repeating-linear-gradient(90deg, #F27322 0px, #F27322 10px, #E05A10 10px, #E05A10 20px)' 
          }} />

          <div style={{ padding: '40px 30px' }}>
            {/* Logo */}
            <div style={{ textAlign: 'center', marginBottom: 30 }}>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: '#F27322', letterSpacing: '-1px' }}>UNGKEEPIN</h2>
              <p style={{ margin: '4px 0 0', fontSize: 11, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Cita Rasa Nusantara</p>
            </div>

            {/* Order Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 30, padding: '15px 0', borderTop: '1.5px dashed #F3F4F6', borderBottom: '1.5px dashed #F3F4F6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF' }}>ID PESANAN</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#111827' }}>{displayOrderId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF' }}>TANGGAL</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#111827' }}>{displayDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF' }}>PELANGGAN</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#111827' }}>{displayFullName || 'Pelanggan Setia'}</span>
              </div>
            </div>

            {/* Items */}
            <div style={{ marginBottom: 30 }}>
              <p style={{ margin: '0 0 16px', fontSize: 11, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Rincian Pesanan</p>
              {displayProductName.split(' + ').map((itemStr, idx) => {
                const match = itemStr.match(/(.*)\s\((\d+)x\)$/);
                const name = match ? match[1] : itemStr;
                const qty = match ? match[2] : (displayProductName.includes(' + ') ? '' : displayQuantity);
                
                return (
                  <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: idx < displayProductName.split(' + ').length - 1 ? 12 : 0 }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#111827' }}>{name}</p>
                      {qty && (
                        <p style={{ margin: '2px 0 0', fontSize: 12, fontWeight: 500, color: '#6B7280' }}>
                          × {qty}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTop: '1px dashed #F3F4F6' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#9CA3AF' }}>Subtotal Item</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: '#111827' }}>{formatRp(displaySubtotal)}</span>
              </div>
            </div>

            {/* Billing */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 30 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#6B7280' }}>Subtotal</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{formatRp(displaySubtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#6B7280' }}>Ongkir</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{formatRp(displayDeliveryPrice)}</span>
              </div>
              
              <div style={{ height: 1.5, background: '#F3F4F6', margin: '8px 0' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 16, fontWeight: 900, color: '#111827' }}>TOTAL</span>
                <span style={{ fontSize: 22, fontWeight: 900, color: '#F27322' }}>{formatRp(displayTotal)}</span>
              </div>
            </div>

            {/* Footer Message */}
            <div style={{ textAlign: 'center', marginTop: 40, borderTop: '1.5px dashed #F3F4F6', paddingTop: 30 }}>
              <div style={{ 
                width: 80, height: 80, 
                background: '#F9FAFB', border: '1px solid #F3F4F6', 
                borderRadius: 8, margin: '0 auto 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 40
              }}>
                🍱
              </div>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#111827' }}>Selamat Menikmati!</p>
              <p style={{ margin: '4px 0 0', fontSize: 12, fontWeight: 500, color: '#6B7280' }}>Terima kasih telah memesan di Ungkeepin</p>
              <p style={{ marginTop: 24, fontSize: 9, fontWeight: 700, color: '#D1D5DB', textTransform: 'uppercase', letterSpacing: '0.1em' }}>www.ungkepin.com</p>
            </div>
          </div>

          {/* Bottom Jagged Edge Decoration */}
          <div style={{ 
            height: 10, width: '100%', 
            background: 'repeating-linear-gradient(45deg, #fff, #fff 10px, #F3F4F6 10px, #F3F4F6 20px)',
            opacity: 0.5
          }} />
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="no-print" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(12px)', padding: '16px 16px 20px', zIndex: 100,
        borderTop: '1px solid #F3F4F6',
        maxWidth: '480px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        {/* Row 1: Kirim Konfirmasi ke WA */}
        <button 
          onClick={handleWhatsApp}
          style={{
            width: '100%', height: 50, borderRadius: 8, background: '#22C55E',
            border: 'none', color: '#fff', fontSize: '14px', fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 8px 24px rgba(34,197,94,0.25)', cursor: 'pointer', minHeight: 50
          }}
        >
          <WhatsAppIcon />
          <span>Kirim Konfirmasi ke WA</span>
        </button>

        {/* Row 2: Kembali & Simpan PDF */}
        <div style={{ display: 'flex', gap: 10, width: '100%' }}>
          <button 
            onClick={() => navigate('/')}
            style={{
              flex: 1, height: 46, borderRadius: 8, background: '#F9FAFB',
              border: '1.5px solid #E5E7EB', color: '#4B5563', fontSize: '13px', fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              cursor: 'pointer', minHeight: 46
            }}
          >
            <ChevronLeft size={15} strokeWidth={3} />
            <span>Kembali</span>
          </button>

          <button 
            onClick={handlePrint}
            style={{
              flex: 1.2, height: 46, borderRadius: 8, background: '#FFF7F0',
              border: '1.5px solid #FEE8D4', color: '#F27322', fontSize: '13px', fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              cursor: 'pointer', minHeight: 46
            }}
          >
            <Printer size={15} strokeWidth={3} />
            <span>Simpan PDF / Cetak</span>
          </button>
        </div>
      </div>
    </div>
  );
};
