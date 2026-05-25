import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCheckout } from "../context/CheckoutContext";

const DELIVERY_FEE = 5000;

const formatRp = (n) => "Rp " + Number(n).toLocaleString("id-ID");

/* ── SVG Icons ── */
const ChevronLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const CartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const ShieldIcon = ({ color = "#F27322", size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const CampusIcon = ({ active }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "#9CA3AF"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const BuildingIcon = ({ active }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "#9CA3AF"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

/* ── Styles as JS object (inline) ── */
const styles = {
  container: {
    background: "#F7F8FA",
    minHeight: "100vh",
    fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
    display: "flex",
    flexDirection: "column",
  },
  phoneBody: {
    flex: 1,
    overflowY: "auto",
    paddingBottom: 100,
  },
};

/* ── Sub-components ── */

function Header({ cartCount, onBack }) {
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "#fff", padding: "14px 18px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      borderBottom: "1px solid #F3F4F6",
    }}>
      <button 
        onClick={onBack}
        style={{
          background: "#F7F8FA", border: "none", borderRadius: 4,
          width: 34, height: 34,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <ChevronLeft />
      </button>
      <div style={{ fontSize: 16, fontWeight: 900, color: "#F27322", letterSpacing: -0.5 }}>
        Ungkeepin
      </div>
      <div style={{
        background: "#F27322", borderRadius: 4,
        width: 34, height: 34,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", cursor: "pointer",
        boxShadow: "0 4px 12px rgba(242,115,34,0.3)",
      }}>
        <CartIcon />
        {cartCount > 0 && (
          <div style={{
            position: "absolute", top: -5, right: -5,
            background: "#EF4444", color: "#fff",
            fontSize: 9, fontWeight: 800,
            borderRadius: "50%", width: 16, height: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid #fff",
          }}>{cartCount}</div>
        )}
      </div>
    </header>
  );
}

function StepperIndicator() {
  const steps = [
    { label: "Data", active: true },
    { label: "Konfirmasi", active: false },
    { label: "Bayar", active: false },
  ];

  return (
    <div style={{
      background: "#fff", borderBottom: "1px solid #F3F4F6",
      padding: "14px 24px",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {steps.map((step, i) => (
        <div key={step.label} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 4,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 800,
              background: step.active ? "#F27322" : "#F3F4F6",
              color: step.active ? "#fff" : "#9CA3AF",
              boxShadow: step.active ? "0 4px 12px rgba(242,115,34,0.4)" : "none",
            }}>{i + 1}</div>
            <span style={{
              fontSize: 9.5, fontWeight: 800,
              textTransform: "uppercase", letterSpacing: "0.08em",
              color: step.active ? "#F27322" : "#D1D5DB",
            }}>{step.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{
              width: 48, height: 2, background: "#E5E7EB",
              borderRadius: 2, marginBottom: 18, flexShrink: 0,
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

function Hero() {
  return (
    <div style={{
      margin: "14px 14px 0",
      borderRadius: 4, overflow: "hidden",
      height: 136, position: "relative",
      background: "linear-gradient(135deg, #1a1a1a 0%, #3d1f00 100%)",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, rgba(242,115,34,0.65) 0%, rgba(0,0,0,0.45) 100%)",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        padding: "20px 22px",
        display: "flex", flexDirection: "column", justifyContent: "center",
      }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: -0.5, lineHeight: 1.2, marginBottom: 6 }}>
          Lengkapi<br />Pesananmu
        </div>
        <div style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.75)" }}>
          Sedikit lagi makananmu sampai!
        </div>
      </div>
      <div style={{
        position: "absolute", right: 18, bottom: 12,
        fontSize: 52, opacity: 0.22, userSelect: "none",
      }}>🍽️</div>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 4,
      border: "1px solid #F3F4F6",
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      marginBottom: 10, overflow: "hidden",
    }}>
      <div style={{ padding: "14px 16px 0", display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#F27322" }} />
        <span style={{
          fontSize: 10.5, fontWeight: 800, color: "#F27322",
          textTransform: "uppercase", letterSpacing: "0.14em",
        }}>{title}</span>
      </div>
      <div style={{ padding: "0 16px 16px" }}>{children}</div>
    </div>
  );
}

function FieldGroup({ label, error, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{
        fontSize: 10.5, fontWeight: 800, color: "#9CA3AF",
        textTransform: "uppercase", letterSpacing: "0.1em",
        marginBottom: 6, display: "block",
      }}>{label}</label>
      {children}
      {error && (
        <div style={{ fontSize: 10.5, fontWeight: 700, color: "#EF4444", marginTop: 4 }}>
          {error}
        </div>
      )}
    </div>
  );
}

/* ── Main Component ── */
export const OrderDataPage = () => {
  const navigate = useNavigate();
  const { cartDraft, saveForSummary, setCartQuantity, login, isAuthenticated, user } = useCheckout();
  
  const [delivery, setDelivery] = useState("campus");
  const [form, setForm] = useState({ fullName: "", whatsapp: "", address: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (!cartDraft.product) {
      navigate('/');
    }
  }, [cartDraft.product, navigate]);

  // Pre-fill form from user profile if logged in
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        fullName: prev.fullName || user.fullName || "",
        whatsapp: prev.whatsapp || (user.phone ? user.phone.replace(/^(\+62|62)/, '') : "") || "",
        address: prev.address || user.address || "",
      }));
    }
  }, [user]);

  if (!cartDraft.product) return null;

  const product = cartDraft.product;
  const quantity = cartDraft.quantity;
  const subtotal = product.priceNumeric * quantity;
  const deliveryFee = delivery === "campus" ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    if (authError) setAuthError("");
  };

  const handleSubmit = async () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Nama lengkap harus diisi";
    if (!form.whatsapp.trim()) newErrors.whatsapp = "Nomor WhatsApp harus diisi";
    if (!form.address.trim()) newErrors.address = "Alamat harus diisi";
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      setAuthError("");
      try {
        // Login/register user if not authenticated
        if (!isAuthenticated) {
          await login(form.whatsapp, form.fullName);
        }

        // Save order summary to context (will be sent to backend in next page)
        saveForSummary({
          product,
          quantity,
          subtotal,
          deliveryType: delivery,
          deliveryPrice: deliveryFee,
          total,
          ...form
        });
        navigate('/order-summary');
      } catch (err) {
        setAuthError(err.message || "Gagal login, silahkan coba lagi");
      } finally {
        setLoading(false);
      }
    }
  };

  const inputStyle = (hasError) => ({
    width: "100%", height: 44,
    borderRadius: 4,
    border: `1.5px solid ${hasError ? "#EF4444" : "#F3F4F6"}`,
    background: "#FAFAFA",
    padding: "0 14px",
    fontSize: 13.5, fontWeight: 500,
    color: "#111827",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
  });

  const textareaStyle = (hasError) => ({
    width: "100%",
    borderRadius: 4,
    border: `1.5px solid ${hasError ? "#EF4444" : "#F3F4F6"}`,
    background: "#FAFAFA",
    padding: "12px 14px",
    fontSize: 13.5, fontWeight: 500,
    color: "#111827",
    outline: "none",
    fontFamily: "inherit",
    resize: "none",
    lineHeight: 1.5,
    boxSizing: "border-box",
  });

  return (
    <div style={styles.container}>
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <div style={styles.phoneBody}>
        <Header cartCount={quantity} onBack={() => navigate('/')} />
        <StepperIndicator />
        <Hero />

        {/* Content */}
        <div style={{ padding: "14px 14px 20px" }}>

          {/* Informasi Pengiriman */}
          <SectionCard title="Informasi Pengiriman">
            {authError && (
              <div style={{
                background: '#FEE2E2', border: '1px solid #FECACA',
                borderRadius: 4, padding: '10px 12px', marginBottom: 12,
                color: '#DC2626', fontSize: 12, fontWeight: 600
              }}>
                {authError}
              </div>
            )}
            <FieldGroup label="Nama Lengkap" error={errors.fullName}>
              <input
                type="text"
                placeholder="Masukkan nama lengkap Anda"
                value={form.fullName}
                onChange={handleChange("fullName")}
                style={inputStyle(!!errors.fullName)}
              />
            </FieldGroup>

            <FieldGroup label="Nomor WhatsApp" error={errors.whatsapp}>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{
                  height: 44, minWidth: 58, borderRadius: 4,
                  border: "1.5px solid #F3F4F6", background: "#F3F4F6",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 800, color: "#374151", flexShrink: 0,
                }}>+62</div>
                <input
                  type="tel"
                  placeholder="812 3456 7890"
                  value={form.whatsapp}
                  onChange={handleChange("whatsapp")}
                  style={{ ...inputStyle(!!errors.whatsapp), flex: 1 }}
                />
              </div>
            </FieldGroup>

            <FieldGroup label="Alamat / Detail Lokasi" error={errors.address}>
              <textarea
                rows={3}
                placeholder="Gedung, Lantai, atau Ciri Lokasi lainnya..."
                value={form.address}
                onChange={handleChange("address")}
                style={textareaStyle(!!errors.address)}
              />
            </FieldGroup>
          </SectionCard>

          {/* Tujuan Pengiriman */}
          <SectionCard title="Tujuan Pengiriman">
            {/* Delivery Options */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { key: "campus", label: "Dalam Kampus", price: "Gratis Ongkir", Icon: CampusIcon },
                { key: "outside", label: "Luar Kampus", price: "Rp 5.000", Icon: BuildingIcon },
              ].map(({ key, label, price, Icon }) => {
                const isActive = delivery === key;
                return (
                  <div
                    key={key}
                    onClick={() => setDelivery(key)}
                    style={{
                      borderRadius: 4,
                      border: `1.5px solid ${isActive ? "#F27322" : "#F3F4F6"}`,
                      padding: "14px 10px",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                      cursor: "pointer",
                      background: isActive ? "#FFF7F0" : "#fff",
                      transition: "all 0.18s",
                      userSelect: "none",
                    }}
                  >
                    <div style={{
                      width: 38, height: 38, borderRadius: 4,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: isActive ? "#F27322" : "#F3F4F6",
                      transition: "background 0.18s",
                    }}>
                      <Icon active={isActive} />
                    </div>
                    <div>
                      <div style={{
                        fontSize: 12.5, fontWeight: 800,
                        color: isActive ? "#111827" : "#9CA3AF",
                        textAlign: "center",
                      }}>{label}</div>
                      <div style={{
                        fontSize: 10.5, fontWeight: 700, textAlign: "center",
                        color: isActive ? "#F27322" : "#D1D5DB",
                      }}>{price}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <hr style={{ border: "none", borderTop: "1px solid #F7F8FA", margin: "14px 0" }} />

            {/* Quantity */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Jumlah Porsi</span>
              <div style={{
                display: "flex", alignItems: "center",
                background: "#F7F8FA", borderRadius: 4,
                border: "1.5px solid #F3F4F6", overflow: "hidden",
              }}>
                <button
                  onClick={() => setCartQuantity(quantity - 1)}
                  style={{
                    width: 36, height: 36, border: "none", background: "transparent",
                    fontSize: 18, fontWeight: 700, color: "#9CA3AF",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    lineHeight: 1,
                  }}
                >−</button>
                <div style={{ width: 1, height: 20, background: "#E5E7EB" }} />
                <div style={{
                  minWidth: 36, textAlign: "center",
                  fontSize: 14, fontWeight: 800, color: "#111827",
                }}>{quantity}</div>
                <div style={{ width: 1, height: 20, background: "#E5E7EB" }} />
                <button
                  onClick={() => setCartQuantity(quantity + 1)}
                  style={{
                    width: 36, height: 36, border: "none", background: "transparent",
                    fontSize: 18, fontWeight: 700, color: "#9CA3AF",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    lineHeight: 1,
                  }}
                >+</button>
              </div>
            </div>
          </SectionCard>

          {/* Ringkasan Harga */}
          <SectionCard title="Ringkasan Harga">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#6B7280" }}>Subtotal</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{formatRp(subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#6B7280" }}>Pengiriman</span>
                {delivery === "campus" ? (
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#16A34A", letterSpacing: "0.04em" }}>GRATIS</span>
                ) : (
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{formatRp(DELIVERY_FEE)}</span>
                )}
              </div>
            </div>

            <div style={{ border: "none", borderTop: "2px dashed #F3F4F6", margin: "14px 0" }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: "#9CA3AF", marginBottom: 2 }}>Estimasi Total</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#111827", letterSpacing: -0.5 }}>
                  {formatRp(total)}
                </div>
              </div>
              <div style={{
                background: "#FFF0E6", borderRadius: 4,
                padding: "6px 12px",
                display: "flex", alignItems: "center", gap: 5,
              }}>
                <ShieldIcon />
                <span style={{ fontSize: 10, fontWeight: 700, color: "#F27322" }}>Aman</span>
              </div>
            </div>
          </SectionCard>

        </div>
      </div>

      {/* Bottom Bar — Sticky */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "linear-gradient(to top, #fff 70%, rgba(255,255,255,0))",
        padding: "10px 16px 18px",
        maxWidth: "100%",
        margin: "0 auto",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%", height: 52, borderRadius: 4,
            background: loading ? "#D1D5DB" : "linear-gradient(135deg, #F27322 0%, #D9620F 100%)",
            border: "none", color: "#fff",
            fontFamily: "inherit", fontSize: 'clamp(13px, 3.5vw, 15px)', fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            boxShadow: loading ? "none" : "0 6px 20px rgba(242,115,34,0.38)",
            cursor: loading ? "not-allowed" : "pointer", letterSpacing: -0.2,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Memproses..." : "Lanjut ke Ringkasan"}
          {!loading && <ArrowRight />}
        </button>
        <div style={{
          marginTop: 10, textAlign: "center",
          fontSize: 10, fontWeight: 700, color: "#9CA3AF",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
          textTransform: "uppercase", letterSpacing: "0.08em",
        }}>
          <CheckIcon />
          Pembayaran Aman &amp; Terenkripsi
        </div>
        </div>
      </div>
    </div>
  );
};
