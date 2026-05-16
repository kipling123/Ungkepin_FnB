import { Printer, CheckCircle2, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from '../context/CheckoutContext';
import { formatRp } from '../utils/formatting';
import { AppHeader } from '../components/AppHeader';

export const ReceiptPage = () => {
  const navigate = useNavigate();
  const { cartSummary } = useCheckout();

  const orderId = `UKP-${cartSummary.total % 1000000}`;
  const now = "15 Mei 2026, 10:00";

  // If no data, redirect to menu
  if (!cartSummary || !cartSummary.product) {
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#F7F8FA',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      maxWidth: 480, margin: '0 auto', paddingBottom: 120
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
      <div id="receipt-content" style={{ padding: '20px 24px', overflow: 'hidden' }}>
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
                <span style={{ fontSize: 12, fontWeight: 800, color: '#111827' }}>{orderId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF' }}>TANGGAL</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#111827' }}>{now}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF' }}>PELANGGAN</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#111827' }}>{cartSummary.fullName || 'Pelanggan Setia'}</span>
              </div>
            </div>

            {/* Items */}
            <div style={{ marginBottom: 30 }}>
              <p style={{ margin: '0 0 16px', fontSize: 11, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Rincian Pesanan</p>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#111827' }}>{cartSummary.product.name}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 12, fontWeight: 500, color: '#6B7280' }}>
                    × {cartSummary.quantity}
                  </p>
                </div>
                <span style={{ fontSize: 15, fontWeight: 800, color: '#111827' }}>{formatRp(cartSummary.subtotal)}</span>
              </div>
            </div>

            {/* Billing */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 30 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#6B7280' }}>Subtotal</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{formatRp(cartSummary.subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#6B7280' }}>Ongkir</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{formatRp(cartSummary.deliveryPrice)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#6B7280' }}>Pajak (10%)</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{formatRp(cartSummary.tax)}</span>
              </div>
              
              <div style={{ height: 1.5, background: '#F3F4F6', margin: '8px 0' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 16, fontWeight: 900, color: '#111827' }}>TOTAL</span>
                <span style={{ fontSize: 22, fontWeight: 900, color: '#F27322' }}>{formatRp(cartSummary.total)}</span>
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
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480, background: 'rgba(255,255,255,0.9)',
        backdropBlur: '12px', padding: '16px 24px 32px', zIndex: 100,
        display: 'flex', gap: 12, borderTop: '1px solid #F3F4F6'
      }}>
        <button 
          onClick={() => navigate('/')}
          style={{
            flex: 1, height: 52, borderRadius: 8, background: '#F9FAFB',
            border: '1.5px solid #F3F4F6', color: '#111827', fontSize: 14, fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            cursor: 'pointer'
          }}
        >
          <ChevronLeft size={16} strokeWidth={3} />
          <span>Kembali</span>
        </button>

        <button 
          onClick={handlePrint}
          style={{
            flex: 2, height: 52, borderRadius: 8, background: '#F27322',
            border: 'none', color: '#fff', fontSize: 14, fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 8px 24px rgba(242,115,34,0.25)', cursor: 'pointer'
          }}
        >
          <Printer size={16} strokeWidth={3} />
          <span>Cetak Struk</span>
        </button>
      </div>
    </div>
  );
};
