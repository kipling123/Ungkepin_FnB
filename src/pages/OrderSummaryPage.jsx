import { CheckCircle2, MapPin, Clock, ChevronLeft, ShoppingBag, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useCheckout } from '../context/CheckoutContext';

const formatRp = (n) => `Rp ${Number(n).toLocaleString('id-ID')}`;

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
              width: 36,
              height: 36,
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 700,
              transition: 'all 0.2s',
              background: step.num < currentStep
                ? '#F27322'
                : step.num === currentStep
                  ? '#F27322'
                  : '#F3F4F6',
              color: step.num <= currentStep ? '#fff' : '#9CA3AF',
              boxShadow: step.num === currentStep ? '0 4px 14px rgba(242,115,34,0.35)' : 'none',
            }}>
              {step.num < currentStep
                ? <CheckCircle2 size={18} strokeWidth={3} />
                : step.num}
            </div>
            <span style={{
              fontSize: 11,
              fontWeight: step.num === currentStep ? 800 : 600,
              color: step.num === currentStep ? '#F27322' : step.num < currentStep ? '#6B7280' : '#D1D5DB',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>{step.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{
              width: 64,
              height: 2,
              margin: '-14px 0 0',
              background: step.num < currentStep
                ? 'linear-gradient(90deg, #F27322, #F27322)'
                : '#E5E7EB',
              borderRadius: 2,
            }} />
          )}
        </div>
      ))}
    </div>
  );
};

export const OrderSummaryPage = () => {
  const navigate = useNavigate();
  const { cartSummary } = useCheckout();

  if (!cartSummary || !cartSummary.product) return null;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F7F8FA',
      fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
      maxWidth: 480,
      margin: '0 auto',
      position: 'relative',
    }}>

      {/* Header */}
      <div style={{
        background: '#fff',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #F3F4F6',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <button onClick={() => navigate(-1)} style={{
          background: '#F7F8FA',
          border: 'none',
          borderRadius: 4,
          width: 38,
          height: 38,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#374151',
        }}>
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>
        <span style={{ fontSize: 17, fontWeight: 800, color: '#F27322', letterSpacing: '-0.3px' }}>
          Ungkeepin
        </span>
        <div style={{
          background: '#F27322',
          borderRadius: 4,
          width: 38,
          height: 38,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          cursor: 'pointer',
        }}>
          <ShoppingBag size={18} color="#fff" strokeWidth={2.5} />
          <span style={{
            position: 'absolute',
            top: -6,
            right: -6,
            background: '#EF4444',
            color: '#fff',
            fontSize: 10,
            fontWeight: 800,
            borderRadius: 4,
            width: 18,
            height: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #fff',
          }}>2</span>
        </div>
      </div>

      {/* Step Indicator */}
      <div style={{ background: '#fff', borderBottom: '1px solid #F3F4F6' }}>
        <StepIndicator currentStep={2} />
      </div>

      <div style={{ padding: '20px 20px 120px' }}>

        {/* Availability Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
          border: '1.5px solid #FDE68A',
          borderRadius: 4,
          padding: '12px 16px',
          marginBottom: 20,
        }}>
          <div style={{
            background: '#F59E0B',
            borderRadius: 4,
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <CheckCircle2 size={15} color="#fff" strokeWidth={3} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#92400E', letterSpacing: '-0.1px' }}>
              Kuota tersedia!
            </p>
            <p style={{ margin: 0, fontSize: 11.5, fontWeight: 500, color: '#B45309' }}>
              Siap untuk pengiriman segera
            </p>
          </div>
        </div>

        {/* Product Card */}
        <div style={{
          background: '#fff',
          borderRadius: 4,
          border: '1px solid #F3F4F6',
          overflow: 'hidden',
          marginBottom: 16,
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        }}>
          {/* Card Header */}
          <div style={{
            background: '#FFF7F0',
            padding: '10px 16px',
            borderBottom: '1px solid #FEE8D4',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: 2, background: '#F27322' }} />
            <span style={{ fontSize: 11, fontWeight: 800, color: '#F27322', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              Pesananmu
            </span>
          </div>

          <div style={{ padding: 16, display: 'flex', gap: 14, alignItems: 'center' }}>
            {/* Product Image */}
            <div style={{
              width: 88,
              height: 88,
              borderRadius: 4,
              overflow: 'hidden',
              flexShrink: 0,
              border: '1px solid #F3F4F6',
              background: '#F9FAFB',
            }}>
              <img
                src={cartSummary.product.image}
                alt={cartSummary.product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Product Info */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#111827', letterSpacing: '-0.2px', lineHeight: 1.3 }}>
                {cartSummary.product.name}
              </h3>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 500, color: '#9CA3AF' }}>
                {cartSummary.product.summaryNote || 'Level 3 • Nasi Putih • Es Teh Manis'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                <span style={{
                  background: '#F3F4F6',
                  color: '#6B7280',
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: 4,
                }}>
                  × {cartSummary.quantity}
                </span>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#111827' }}>
                  {formatRp(cartSummary.subtotal)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {/* Destination */}
          <div style={{
            background: '#fff',
            borderRadius: 4,
            border: '1px solid #F3F4F6',
            padding: 16,
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 4,
              background: '#FFF0E6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
            }}>
              <MapPin size={18} color="#F27322" strokeWidth={2.5} />
            </div>
            <p style={{ margin: '0 0 2px', fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tujuan</p>
            <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 800, color: '#111827' }}>
              {cartSummary.address}
            </p>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: '#9CA3AF' }}>Lantai 2</p>
          </div>

          {/* ETA */}
          <div style={{
            background: '#fff',
            borderRadius: 4,
            border: '1px solid #F3F4F6',
            padding: 16,
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 4,
              background: '#FFF0E6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
            }}>
              <Clock size={18} color="#F27322" strokeWidth={2.5} />
            </div>
            <p style={{ margin: '0 0 2px', fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Estimasi</p>
            <p style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 800, color: '#111827' }}>
              15 – 20 Menit
            </p>
            <span style={{
              background: '#DCFCE7',
              color: '#15803D',
              fontSize: 10,
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: 4,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>
              ⚡ Cepat Saji
            </span>
          </div>
        </div>

        {/* Billing Card */}
        <div style={{
          background: '#fff',
          borderRadius: 4,
          border: '1px solid #F3F4F6',
          overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          marginBottom: 16,
        }}>
          <div style={{ padding: '20px 20px 0' }}>
            <p style={{ margin: '0 0 16px', fontSize: 12, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              Rincian Pembayaran
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Subtotal', value: formatRp(cartSummary.subtotal), valueStyle: { color: '#374151', fontWeight: 700 } },
                {
                  label: 'Biaya Pengiriman',
                  value: cartSummary.deliveryPrice === 0 ? 'GRATIS' : formatRp(cartSummary.deliveryPrice),
                  valueStyle: { color: cartSummary.deliveryPrice === 0 ? '#16A34A' : '#374151', fontWeight: 800 }
                },
                { label: 'Pajak (10%)', value: formatRp(cartSummary.tax), valueStyle: { color: '#374151', fontWeight: 700 } },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#6B7280' }}>{row.label}</span>
                  <span style={{ fontSize: 14, ...row.valueStyle }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dashed divider */}
          <div style={{ margin: '20px 0', borderTop: '2px dashed #F3F4F6' }} />

          <div style={{
            padding: '0 20px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#9CA3AF' }}>Total Pembayaran</p>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#111827', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
                {formatRp(cartSummary.total)}
              </p>
            </div>
            <div style={{
              background: '#FFF7F0',
              borderRadius: 4,
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}>
              <Shield size={14} color="#F27322" strokeWidth={2.5} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#F27322' }}>Aman & Terpercaya</span>
            </div>
          </div>
        </div>

        {/* Terms */}
        <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 500, color: '#9CA3AF', marginBottom: 0, lineHeight: 1.6 }}>
          Dengan membayar, Anda menyetujui{' '}
          <span style={{ color: '#374151', fontWeight: 700, textDecoration: 'underline', textDecorationColor: '#D1D5DB', textUnderlineOffset: 3, cursor: 'pointer' }}>
            Syarat & Ketentuan
          </span>
        </p>
      </div>

      {/* Bottom Pay Button — sticky */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        background: 'linear-gradient(to top, #fff 80%, transparent)',
        padding: '16px 20px 28px',
        zIndex: 20,
      }}>
        <button
          onClick={() => navigate('/payment')}
          style={{
            width: '100%',
            height: 58,
            borderRadius: 4,
            background: 'linear-gradient(135deg, #F27322 0%, #E05E0A 100%)',
            border: 'none',
            color: '#fff',
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: '-0.2px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: '0 8px 24px rgba(242,115,34,0.4)',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(242,115,34,0.3)'; }}
          onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(242,115,34,0.4)'; }}
        >
          <Shield size={18} strokeWidth={2.5} />
          Bayar Sekarang · {formatRp(cartSummary.total)}
        </button>
      </div>
    </div>
  );
};
