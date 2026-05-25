import { Clock, Upload, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { AppHeader } from '../components/AppHeader';
import { useCheckout } from '../context/CheckoutContext';
import { formatRp, formatTime } from '../utils/formatting';
import { apiClient } from '../services/api';
import qrisImage from '../assets/WhatsApp Image 2026-05-14 at 18.01.53.jpeg';

const StepIndicator = ({ currentStep }) => {
  const steps = [
    { num: 1, label: 'Data' },
    { num: 2, label: 'Konfirmasi' },
    { num: 3, label: 'Bayar' },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, padding: '20px 24px' }}>
      {steps.map((step, i) => (
        <div key={step.num} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 800,
              background: step.num < currentStep ? '#F27322' : step.num === currentStep ? '#F27322' : '#F3F4F6',
              color: step.num <= currentStep ? '#fff' : '#9CA3AF',
            }}>
              {step.num}
            </div>
            <span style={{
              fontSize: 10, fontWeight: step.num === currentStep ? 800 : 600,
              color: step.num === currentStep ? '#F27322' : '#D1D5DB',
              textTransform: 'uppercase', letterSpacing: '0.05em'
            }}>{step.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{
              width: 50, height: 2, margin: '-16px 4px 0',
              background: step.num < currentStep ? '#F27322' : '#E5E7EB',
            }} />
          )}
        </div>
      ))}
    </div>
  );
};

export const PaymentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  const { cartSummary } = useCheckout();
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(899); // 14:59

  // Fetch order details from database
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }
      try {
        const data = await apiClient.getOrder(orderId);
        setOrder(data.order);
        setPayment(data.payment);
      } catch (err) {
        console.error("Gagal memuat pesanan:", err);
        setError("Gagal memuat detail pesanan.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const displayTotal = order ? order.total : (cartSummary ? cartSummary.total : 0);
  const displaySubtotal = order ? order.subtotal : (cartSummary ? cartSummary.subtotal : 0);
  const displayDeliveryPrice = order ? order.deliveryPrice : (cartSummary ? cartSummary.deliveryPrice : 0);

  const handleUploadProof = async () => {
    setVerifying(true);
    setError("");
    const targetOrderId = orderId || (order ? order.id : null);
    if (!targetOrderId) {
      setError("ID pesanan tidak ditemukan.");
      setVerifying(false);
      return;
    }
    try {
      // Call backend to verify the payment
      await apiClient.verifyPayment(targetOrderId, `TXN_${Date.now()}`);
      // Navigate to receipt
      navigate(`/receipt?orderId=${targetOrderId}`);
    } catch (err) {
      console.error("Gagal memverifikasi pembayaran:", err);
      setError("Gagal memproses pembayaran. Coba lagi.");
    } finally {
      setVerifying(false);
    }
  };

  const handleWhatsAppConfirm = () => {
    const targetOrderId = orderId || (order ? order.id : null);
    const amount = formatRp(displayTotal);
    const formattedId = targetOrderId ? targetOrderId.substring(0, 8).toUpperCase() : "";
    const text = encodeURIComponent(`Halo Ungkeepin! Saya ingin konfirmasi pembayaran untuk pesanan *UKP-${formattedId}* sebesar *${amount}*.\n\nMohon segera diproses ya. Terima kasih!`);
    window.open(`https://wa.me/6281234567890?text=${text}`, '_blank');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#F7F8FA', fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontWeight: 800, color: '#F27322', fontSize: 16 }}>Memuat informasi pembayaran...</p>
        </div>
      </div>
    );
  }

  if (!order && (!cartSummary || !cartSummary.product)) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', background: 'white', padding: 24, textAlign: 'center',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}>
        <p className="text-gray-400 font-bold">Belum ada pesanan aktif</p>
        <button 
          onClick={() => navigate('/')}
          style={{
            marginTop: 16, borderRadius: 6, background: '#F27322', border: 'none',
            padding: '10px 24px', fontSize: 14, fontWeight: 900, color: 'white',
            cursor: 'pointer'
          }}
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
      display: 'flex',
      flexDirection: 'column',
    }}>
      <AppHeader />

      <div style={{ background: '#fff', borderBottom: '1px solid #F3F4F6' }}>
        <StepIndicator currentStep={3} />
      </div>

      <div style={{ padding: '24px 16px 120px', flex: 1 }} className="animate-fade-in">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 800, color: '#F27322', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Menunggu Pembayaran</p>
          <h1 style={{ margin: '8px 0 0', fontSize: 'clamp(28px, 8vw, 40px)', fontWeight: 900, color: '#111827', letterSpacing: '-1px' }}>
            {formatRp(displayTotal)}
          </h1>

          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#FEF2F2', border: '1px solid #FEE2E2',
              borderRadius: 30, padding: '6px 16px', color: '#EF4444'
            }}>
              <Clock size={14} strokeWidth={3} className="animate-pulse" />
              <span style={{ fontSize: 12, fontWeight: 800 }}>
                Selesaikan dalam <span style={{ fontFamily: 'monospace' }}>{formatTime(timeLeft)}</span>
              </span>
            </div>
          </div>
        </div>

        {/* QR Card */}
        <div style={{
          background: '#fff', borderRadius: 8, overflow: 'hidden',
          border: '1px solid #F3F4F6', boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          marginBottom: 24
        }}>
          <div style={{
            background: '#F9FAFB', padding: '14px 20px',
            borderBottom: '1px solid #F3F4F6',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 4, height: 16, background: '#F27322', borderRadius: 2 }} />
              <span style={{ fontSize: 11, fontWeight: 800, color: '#111827', tracking: '0.05em' }}>QRIS PEMBAYARAN</span>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF' }}>ID: 1026518518</span>
          </div>

          <div style={{ padding: 24, textAlign: 'center' }}>
            <div style={{
              background: '#fff', border: '1.5px solid #F3F4F6',
              borderRadius: 12, padding: 12, marginBottom: 20
            }}>
              <img
                src={qrisImage}
                alt="QRIS"
                style={{ width: '100%', height: 'auto', borderRadius: 8 }}
              />
            </div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#111827' }}>UNGKEEPIN</h3>
            <p style={{ margin: '4px 0 0', fontSize: 12, fontWeight: 500, color: '#6B7280', lineHeight: 1.5 }}>
              Pindai QR di atas menggunakan aplikasi e-wallet pilihan kamu
            </p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            background: '#FEE2E2', border: '1px solid #FEE2E2',
            color: '#EF4444', padding: '12px 16px', borderRadius: 8,
            fontSize: 12, fontWeight: 700, textAlign: 'center', marginBottom: 20
          }}>
            {error}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24, maxWidth: 480, margin: '0 auto' }}>
          <button 
            onClick={handleUploadProof}
            disabled={verifying}
            style={{
              height: 54, borderRadius: 8, background: verifying ? '#D1D5DB' : '#22C55E',
              border: 'none', color: '#fff', fontSize: 15, fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              boxShadow: verifying ? 'none' : '0 8px 20px rgba(34,197,94,0.2)',
              cursor: verifying ? 'not-allowed' : 'pointer'
            }}
          >
            <Upload size={18} strokeWidth={3} />
            <span>{verifying ? 'Memverifikasi...' : 'Upload Bukti Bayar'}</span>
          </button>

          <button 
            onClick={handleWhatsAppConfirm}
            style={{
              height: 54, borderRadius: 8, background: '#fff',
              border: '2px solid #F3F4F6', color: '#22C55E', fontSize: 15, fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              cursor: 'pointer'
            }}
          >
            <MessageCircle size={18} strokeWidth={3} />
            <span>Konfirmasi WhatsApp</span>
          </button>
        </div>

        {/* Billing Summary */}
        <div style={{
          background: '#fff', borderRadius: 8, padding: 20,
          border: '1px solid #F3F4F6'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#6B7280' }}>Subtotal + Ongkir</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>
              {formatRp(displaySubtotal + displayDeliveryPrice)}
            </span>
          </div>
          <div style={{ height: 1, background: '#F3F4F6', margin: '12px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#111827' }}>Total Pembayaran</span>
            <span style={{ fontSize: 18, fontWeight: 900, color: '#F27322' }}>
              {formatRp(displayTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
