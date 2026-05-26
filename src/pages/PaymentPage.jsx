import { Clock, Upload, CheckCircle2, ImageIcon } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
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
              {step.num < currentStep ? <CheckCircle2 size={16} strokeWidth={3} /> : step.num}
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
  const fileInputRef = useRef(null);

  const { cartSummary } = useCheckout();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(899); // 14:59

  // Bukti bayar
  const [proofFile, setProofFile] = useState(null);       // File object
  const [proofPreview, setProofPreview] = useState(null); // object URL untuk preview
  const [isUploaded, setIsUploaded] = useState(false);

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) { setLoading(false); return; }
      try {
        const data = await apiClient.getOrder(orderId);
        setOrder(data.order);
      } catch (err) {
        console.error('Gagal memuat pesanan:', err);
        setError('Gagal memuat detail pesanan.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const displayTotal = order?.total ?? cartSummary?.total ?? 0;
  const displaySubtotal = order?.subtotal ?? cartSummary?.subtotal ?? 0;
  const displayDeliveryPrice = order?.deliveryPrice ?? cartSummary?.deliveryPrice ?? 0;

  // Pilih file bukti bayar
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProofFile(file);
    setProofPreview(URL.createObjectURL(file));
    setIsUploaded(true);
  };

  // Konversi file ke base64 agar bisa dikirim via router state
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // Cetak struk — verifikasi backend → kirim ke halaman struk dengan bukti
  const handleCetakStruk = async () => {
    setVerifying(true);
    setError('');
    const targetOrderId = orderId || order?.id;
    if (!targetOrderId) {
      setError('ID pesanan tidak ditemukan.');
      setVerifying(false);
      return;
    }
    try {
      // 1) Verifikasi pembayaran ke backend
      await apiClient.verifyPayment(targetOrderId, `TXN_${Date.now()}`);

      // 2) Convert bukti bayar ke base64 supaya bisa dibawa ke halaman struk
      let proofBase64 = null;
      if (proofFile) {
        proofBase64 = await fileToBase64(proofFile);
      }

      // 3) Navigasi ke halaman struk, bawa bukti bayar & info order
      navigate(`/receipt?orderId=${targetOrderId}`, {
        state: {
          proofImage: proofBase64,
          orderId: targetOrderId,
          total: displayTotal,
        },
      });
    } catch (err) {
      console.error('Gagal memverifikasi:', err);
      setError('Gagal memproses pembayaran. Coba lagi.');
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#F7F8FA', fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}>
        <p style={{ fontWeight: 800, color: '#F27322', fontSize: 16 }}>Memuat informasi pembayaran...</p>
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
        <p style={{ color: '#9CA3AF', fontWeight: 700 }}>Belum ada pesanan aktif</p>
        <button
          onClick={() => navigate('/')}
          style={{
            marginTop: 16, borderRadius: 6, background: '#F27322', border: 'none',
            padding: '10px 24px', fontSize: 14, fontWeight: 900, color: 'white', cursor: 'pointer'
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
      width: '100%', display: 'flex', flexDirection: 'column',
    }}>
      <AppHeader />

      <div style={{ background: '#fff', borderBottom: '1px solid #F3F4F6' }}>
        <StepIndicator currentStep={3} />
      </div>

      <div style={{ padding: '24px 16px 140px', flex: 1 }}>

        {/* ── Judul & Timer ── */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 800, color: '#F27322', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            Menunggu Pembayaran
          </p>
          <h1 style={{ margin: '8px 0 0', fontSize: 'clamp(28px, 8vw, 40px)', fontWeight: 900, color: '#111827', letterSpacing: '-1px' }}>
            {formatRp(displayTotal)}
          </h1>
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#FEF2F2', border: '1px solid #FEE2E2',
              borderRadius: 30, padding: '6px 16px', color: '#EF4444'
            }}>
              <Clock size={14} strokeWidth={3} />
              <span style={{ fontSize: 12, fontWeight: 800 }}>
                Selesaikan dalam <span style={{ fontFamily: 'monospace' }}>{formatTime(timeLeft)}</span>
              </span>
            </div>
          </div>
        </div>

        {/* ── QR Card ── */}
        <div style={{
          background: '#fff', borderRadius: 12, overflow: 'hidden',
          border: '1px solid #F3F4F6', boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          marginBottom: 20
        }}>
          <div style={{
            background: '#F9FAFB', padding: '14px 20px',
            borderBottom: '1px solid #F3F4F6',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 4, height: 16, background: '#F27322', borderRadius: 2 }} />
              <span style={{ fontSize: 11, fontWeight: 800, color: '#111827' }}>QRIS PEMBAYARAN</span>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF' }}>ID: 1026518518</span>
          </div>
          <div style={{ padding: 24, textAlign: 'center' }}>
            <div style={{
              background: '#fff', border: '1.5px solid #F3F4F6',
              borderRadius: 12, padding: 12, marginBottom: 16
            }}>
              <img src={qrisImage} alt="QRIS" style={{ width: '100%', height: 'auto', borderRadius: 8 }} />
            </div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#111827' }}>UNGKEEPIN</h3>
            <p style={{ margin: '4px 0 0', fontSize: 12, fontWeight: 500, color: '#6B7280', lineHeight: 1.5 }}>
              Pindai QR di atas menggunakan aplikasi e-wallet pilihan kamu
            </p>
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div style={{
            background: '#FEE2E2', border: '1px solid #FECACA',
            color: '#DC2626', padding: '12px 16px', borderRadius: 8,
            fontSize: 12, fontWeight: 700, textAlign: 'center', marginBottom: 16
          }}>
            {error}
          </div>
        )}

        {/* ── Hidden File Input ── */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {/* ── Step: Upload Bukti ── */}
        <div style={{
          background: '#fff', borderRadius: 12, border: '1px solid #F3F4F6',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginBottom: 16, overflow: 'hidden'
        }}>
          {/* Header step */}
          <div style={{
            padding: '14px 18px', background: isUploaded ? '#F0FDF4' : '#FFF7F0',
            borderBottom: `1px solid ${isUploaded ? '#BBF7D0' : '#FEE8D4'}`,
            display: 'flex', alignItems: 'center', gap: 10
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: isUploaded ? '#22C55E' : '#F27322',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              {isUploaded
                ? <CheckCircle2 size={15} color="#fff" strokeWidth={3} />
                : <Upload size={14} color="#fff" strokeWidth={3} />}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: isUploaded ? '#15803D' : '#92400E' }}>
                {isUploaded ? 'Bukti Pembayaran Diunggah ✓' : 'Upload Bukti Pembayaran'}
              </p>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 500, color: isUploaded ? '#16A34A' : '#B45309' }}>
                {isUploaded ? 'Foto bukti siap dilampirkan di struk' : 'Foto screenshot / transfer setelah bayar QRIS'}
              </p>
            </div>
          </div>

          {/* Preview foto bukti */}
          {isUploaded && proofPreview ? (
            <div style={{ padding: 16 }}>
              <div style={{
                width: '100%', maxHeight: 200, overflow: 'hidden',
                borderRadius: 8, border: '1.5px dashed #D1D5DB',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#F9FAFB'
              }}>
                <img
                  src={proofPreview}
                  alt="Bukti Bayar"
                  style={{ width: '100%', height: 'auto', maxHeight: 200, objectFit: 'contain' }}
                />
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  marginTop: 10, width: '100%', height: 36, borderRadius: 6,
                  background: '#F3F4F6', border: 'none', fontSize: 12, fontWeight: 700,
                  color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 6
                }}
              >
                <ImageIcon size={13} strokeWidth={2.5} />
                Ganti Foto Bukti
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '100%', height: 60, background: 'transparent', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                cursor: 'pointer', color: '#F27322', fontSize: 14, fontWeight: 800
              }}
            >
              <Upload size={18} strokeWidth={2.5} />
              Pilih Foto Bukti Bayar
            </button>
          )}
        </div>

        {/* ── Ringkasan Biaya ── */}
        <div style={{
          background: '#fff', borderRadius: 12, padding: 20,
          border: '1px solid #F3F4F6', marginBottom: 20,
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#6B7280' }}>Subtotal + Ongkir</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>
              {formatRp(displaySubtotal + displayDeliveryPrice)}
            </span>
          </div>
          <div style={{ height: 1, background: '#F3F4F6', margin: '10px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#111827' }}>Total Pembayaran</span>
            <span style={{ fontSize: 18, fontWeight: 900, color: '#F27322' }}>
              {formatRp(displayTotal)}
            </span>
          </div>
        </div>

      </div>

      {/* ── Sticky Bottom: Tombol Cetak Struk ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid #F3F4F6',
        padding: '12px 16px 20px', zIndex: 50,
      }}>
        {!isUploaded ? (
          <div style={{
            height: 54, borderRadius: 10,
            background: '#F3F4F6',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
          }}>
            <Upload size={18} color="#9CA3AF" strokeWidth={2.5} />
            <span style={{ fontSize: 14, fontWeight: 800, color: '#9CA3AF' }}>
              Upload bukti bayar dulu untuk cetak struk
            </span>
          </div>
        ) : (
          <button
            onClick={handleCetakStruk}
            disabled={verifying}
            style={{
              width: '100%', height: 54, borderRadius: 10,
              background: verifying
                ? '#D1D5DB'
                : 'linear-gradient(135deg, #F27322 0%, #E05E0A 100%)',
              border: 'none', color: '#fff', fontSize: 15, fontWeight: 900,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              boxShadow: verifying ? 'none' : '0 8px 24px rgba(242,115,34,0.35)',
              cursor: verifying ? 'not-allowed' : 'pointer',
              letterSpacing: '-0.2px', transition: 'all 0.2s'
            }}
          >
            {verifying ? (
              <span>Memproses...</span>
            ) : (
              <>
                <CheckCircle2 size={20} strokeWidth={2.5} />
                <span>Cetak Struk</span>
              </>
            )}
          </button>
        )}
        <p style={{
          margin: '8px 0 0', textAlign: 'center',
          fontSize: 10, fontWeight: 700, color: '#9CA3AF',
          textTransform: 'uppercase', letterSpacing: '0.08em'
        }}>
          Struk akan tampil • Konfirmasi ke admin via WhatsApp
        </p>
      </div>
    </div>
  );
};
