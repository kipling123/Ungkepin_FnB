import { ShoppingBasket, ArrowRight, CheckCircle2, Search, Star, ChevronRight, SlidersHorizontal, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FoodCard } from '../components/FoodCard';
import { AppHeader } from '../components/AppHeader';
import { foodProducts } from '../data/foodData';
import { useCheckout } from '../context/CheckoutContext';

const CATEGORIES = ['Semua', 'Ayam', 'Ikan', 'Minuman'];

/* ─── INLINE STYLES ─── */
const s = {
  page: {
    minHeight: '100vh',
    background: '#FAFAF8',
    paddingBottom: 100,
    fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
  },

  /* Header */
  header: {
    background: '#fff',
    padding: '14px 18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '0.5px solid #F0EFE9',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  headerLogo: {
    fontSize: 17,
    fontWeight: 900,
    color: '#E86B2A',
    letterSpacing: '-0.5px',
  },
  iconBtn: {
    width: 34,
    height: 34,
    background: '#F5F4F0',
    border: 'none',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  cartWrap: { position: 'relative' },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 17,
    height: 17,
    background: '#E86B2A',
    borderRadius: '50%',
    border: '2px solid #FAFAF8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 9,
    fontWeight: 800,
    color: '#fff',
  },

  /* Greeting */
  greetSection: { padding: '20px 18px 0' },
  greetRow: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' },
  greetBadge: {
    fontSize: 10,
    fontWeight: 700,
    color: '#E86B2A',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    marginBottom: 4,
  },
  greetTitle: {
    fontSize: 23,
    fontWeight: 900,
    color: '#1A1714',
    letterSpacing: '-0.7px',
    lineHeight: 1.15,
    margin: 0,
  },
  greetSub: {
    fontSize: 13,
    fontWeight: 500,
    color: '#9B978E',
    marginTop: 3,
  },

  /* Search */
  searchWrap: { padding: '14px 18px 0' },
  searchInner: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: '#fff',
    border: '0.5px solid #ECEAE3',
    borderRadius: 14,
    padding: '0 14px',
    height: 44,
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    fontSize: 13,
    fontWeight: 500,
    color: '#1A1714',
    outline: 'none',
    fontFamily: 'inherit',
  },

  /* Banner */
  bannerWrap: { padding: '14px 18px 0' },
  banner: {
    borderRadius: 20,
    background: '#1A1714',
    overflow: 'hidden',
    position: 'relative',
    height: 136,
  },
  bannerBg: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, #1A1714 0%, #2D2118 60%, #3D2B1A 100%)',
  },
  bannerGlow: {
    position: 'absolute',
    right: -20,
    top: -20,
    width: 160,
    height: 160,
    background: 'radial-gradient(circle, rgba(232,107,42,0.22) 0%, transparent 70%)',
    borderRadius: '50%',
  },
  bannerContent: {
    position: 'relative',
    zIndex: 2,
    padding: '20px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
  },
  bannerTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    background: 'rgba(255,255,255,0.08)',
    border: '0.5px solid rgba(255,255,255,0.12)',
    borderRadius: 20,
    padding: '3px 10px',
    marginBottom: 8,
  },
  bannerTagText: {
    fontSize: 9,
    fontWeight: 800,
    color: 'rgba(240,175,110,0.9)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 900,
    color: '#fff',
    letterSpacing: '-0.5px',
    lineHeight: 1.2,
    margin: 0,
  },
  bannerAccent: { color: '#F0A878' },
  bannerBtn: {
    marginTop: 10,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    background: '#E86B2A',
    border: 'none',
    borderRadius: 10,
    padding: '6px 14px',
    fontSize: 11,
    fontWeight: 800,
    color: '#fff',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(232,107,42,0.35)',
  },
  bannerEmoji: {
    fontSize: 56,
    lineHeight: 1,
    opacity: 0.9,
    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.45))',
    userSelect: 'none',
    pointerEvents: 'none',
  },

  /* Stats */
  statsRow: { display: 'flex', gap: 8, padding: '12px 18px 0' },
  statCard: {
    flex: 1,
    background: '#fff',
    border: '0.5px solid #ECEAE3',
    borderRadius: 12,
    padding: '9px 10px',
    display: 'flex',
    alignItems: 'center',
    gap: 7,
  },
  statIcon: {
    width: 28,
    height: 28,
    background: '#FEF0E6',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontSize: 13,
  },
  statTitle: {
    fontSize: 10,
    fontWeight: 800,
    color: '#1A1714',
    lineHeight: 1.2,
    whiteSpace: 'nowrap',
  },
  statSub: {
    fontSize: 9,
    fontWeight: 500,
    color: '#9B978E',
    marginTop: 1,
    whiteSpace: 'nowrap',
  },

  /* Categories */
  catsScroll: {
    display: 'flex',
    gap: 8,
    padding: '16px 18px 0',
    overflowX: 'auto',
    scrollbarWidth: 'none',
  },
  catActive: {
    whiteSpace: 'nowrap',
    border: 'none',
    padding: '7px 18px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
    background: '#E86B2A',
    color: '#fff',
    boxShadow: '0 2px 8px rgba(232,107,42,0.3)',
  },
  catIdle: {
    whiteSpace: 'nowrap',
    border: '0.5px solid #ECEAE3',
    padding: '7px 18px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
    background: '#fff',
    color: '#7A776E',
  },

  /* Section header */
  sectionRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 18px 12px',
  },
  sectionLbl: { display: 'flex', alignItems: 'center', gap: 6 },
  sectionDot: { width: 7, height: 7, background: '#E86B2A', borderRadius: '50%' },
  sectionText: {
    fontSize: 11,
    fontWeight: 800,
    color: '#E86B2A',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  seeAll: {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    fontSize: 11,
    fontWeight: 600,
    color: '#9B978E',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },

  /* Cards list */
  cardsList: { padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 10 },

  /* Toast */
  toastOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(26,23,20,0.25)',
    backdropFilter: 'blur(3px)',
    pointerEvents: 'none',
  },
  toastCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    borderRadius: 28,
    background: '#fff',
    padding: '32px 40px',
    boxShadow: '0 16px 48px rgba(26,23,20,0.18)',
  },
  toastIcon: {
    width: 72,
    height: 72,
    borderRadius: '50%',
    background: '#E86B2A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    boxShadow: '0 6px 20px rgba(232,107,42,0.35)',
  },
  toastTitle: { fontSize: 15, fontWeight: 800, color: '#1A1714', textAlign: 'center' },
  toastSub: {
    fontSize: 12,
    fontWeight: 500,
    color: '#9B978E',
    textAlign: 'center',
    maxWidth: 160,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  /* Empty */
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    padding: '48px 24px',
    textAlign: 'center',
  },

  /* CSS animations as a <style> tag approach via className */
};

const STATS = [
  { icon: '🚀', title: '30 menit', sub: 'Pengiriman' },
  { icon: '⭐', title: '4.9 / 5.0', sub: 'Rating Menu' },
  { icon: '🍽️', title: '2 Menu', sub: 'Tersedia' },
];

export const MenuPage = () => {
  const navigate = useNavigate();
  const { cartDraft, addToCart } = useCheckout();
  const [addedItem, setAddedItem] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedItem(product.name);
  };

  useEffect(() => {
    if (addedItem) {
      const t = setTimeout(() => setAddedItem(null), 1800);
      return () => clearTimeout(t);
    }
  }, [addedItem]);

  const cartCount = cartDraft?.quantity || 0;

  const filteredProducts = foodProducts.filter((p) => {
    const matchCat = activeCategory === 'Semua' || p.category === activeCategory;
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        .menu-page * { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; -webkit-tap-highlight-color: transparent; }
        .cats-scroll::-webkit-scrollbar { display: none; }
        .food-card-wrap { transition: transform 0.15s ease; }
        .food-card-wrap:active { transform: scale(0.985); }
        .cat-btn { transition: all 0.15s ease; }
        .cat-btn:active { transform: scale(0.94); }
        .icon-btn:active { transform: scale(0.93); }
        .search-focused { border-color: rgba(232,107,42,0.4) !important; box-shadow: 0 0 0 3px rgba(232,107,42,0.1) !important; }
        @keyframes toastIn { 0% { opacity:0; transform:scale(0.8) translateY(12px); } 70% { transform:scale(1.04) translateY(-2px); } 100% { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .toast-overlay-anim { animation: fadeIn 0.18s ease both; }
        .toast-card-anim { animation: toastIn 0.42s cubic-bezier(0.34,1.56,0.64,1) both; }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .slide-up { animation: slideUp 0.35s cubic-bezier(0.22,1,0.36,1) both; }
        .d1 { animation-delay: 0.04s; }
        .d2 { animation-delay: 0.08s; }
        .d3 { animation-delay: 0.13s; }
        .d4 { animation-delay: 0.18s; }
        .d5 { animation-delay: 0.23s; }
      `}</style>

      <div className="menu-page" style={s.page}>

        {/* ── Toast ── */}
        {addedItem && (
          <div className="toast-overlay-anim" style={s.toastOverlay}>
            <div className="toast-card-anim" style={s.toastCard}>
              <div style={s.toastIcon}>
                <CheckCircle2 size={36} strokeWidth={2.5} />
              </div>
              <div>
                <p style={s.toastTitle}>Berhasil ditambahkan! 🎉</p>
                <p style={s.toastSub}>{addedItem}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Sticky Header ── */}
        <div style={s.header}>
          <button
            className="icon-btn"
            style={s.iconBtn}
            onClick={() => navigate(-1)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A4740" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span style={s.headerLogo}>Ungkeepin</span>
          <div style={s.cartWrap}>
            <button
              className="icon-btn"
              style={s.iconBtn}
              onClick={() => {
                if (cartDraft?.product) {
                  navigate('/order-data');
                } else {
                  setAddedItem("Keranjang masih kosong");
                }
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A4740" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </button>
            {cartCount > 0 && (
              <div style={s.cartBadge}>{cartCount > 9 ? '9+' : cartCount}</div>
            )}
          </div>
        </div>

        {/* ── Greeting ── */}
        <div className="slide-up" style={s.greetSection}>
          <div style={s.greetRow}>
            <div>
              <p style={s.greetBadge}>Selamat Datang 👋</p>
              <h1 style={s.greetTitle}>Halo, Ungkeepin!</h1>
              <p style={s.greetSub}>Mau makan apa hari ini?</p>
            </div>
          </div>
        </div>

        {/* ── Search ── */}
        <div className="slide-up d1" style={s.searchWrap}>
          <div
            className={searchFocused ? 'search-focused' : ''}
            style={s.searchInner}
          >
            <Search size={15} color={searchFocused ? '#E86B2A' : '#C8C5BC'} strokeWidth={2.5} />
            <input
              style={s.searchInput}
              placeholder="Cari menu favoritmu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                style={{ background: '#ECEAE3', border: 'none', borderRadius: '50%', width: 18, height: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#7A776E', flexShrink: 0 }}
              >
                ✕
              </button>
            ) : (
              <SlidersHorizontal size={14} color="#C8C5BC" strokeWidth={2} />
            )}
          </div>
        </div>

        {/* ── Hero Banner ── */}
        <div className="slide-up d2" style={s.bannerWrap}>
          <div style={s.banner}>
            <div style={s.bannerBg} />
            <div style={s.bannerGlow} />
            <div style={s.bannerContent}>
              <div>
                <div style={s.bannerTag}>
                  <Flame size={8} color="rgba(240,175,110,0.9)" fill="rgba(240,175,110,0.9)" />
                  <span style={s.bannerTagText}>Pre-Order Sekarang</span>
                </div>
                <h2 style={s.bannerTitle}>
                  Cita Rasa<br />
                  <span style={s.bannerAccent}>Nusantara</span>
                </h2>
                <button style={s.bannerBtn}>
                  Pesan Sekarang
                  <ArrowRight size={10} strokeWidth={3} />
                </button>
              </div>
              <div style={s.bannerEmoji}>🍛</div>
            </div>
          </div>
        </div>

        {/* ── Stats Strip ── */}
        <div className="slide-up d3" style={s.statsRow}>
          {STATS.map((stat) => (
            <div key={stat.title} style={s.statCard}>
              <div style={s.statIcon}>{stat.icon}</div>
              <div>
                <p style={s.statTitle}>{stat.title}</p>
                <p style={s.statSub}>{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Categories ── */}
        <div className="slide-up d4 cats-scroll" style={s.catsScroll}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className="cat-btn"
              style={activeCategory === cat ? s.catActive : s.catIdle}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Section Header ── */}
        <div className="slide-up d5" style={s.sectionRow}>
          <div style={s.sectionLbl}>
            <div style={s.sectionDot} />
            <span style={s.sectionText}>Menu Hari Ini</span>
          </div>
          <button style={s.seeAll}>
            Lihat Semua
            <ChevronRight size={12} strokeWidth={2.5} />
          </button>
        </div>

        {/* ── Food Cards ── */}
        <div style={s.cardsList}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, idx) => (
              <div
                key={product.id}
                className="food-card-wrap slide-up"
                style={{ animationDelay: `${0.22 + idx * 0.05}s` }}
              >
                <FoodCard
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  description={product.description}
                  category={product.category}
                  status={product.status}
                  sold={product.sold}
                  quota={product.quota}
                  isFeatured={product.isFeatured}
                  onAddToCart={() => handleAddToCart(product)}
                />
              </div>
            ))
          ) : (
            <div style={s.empty}>
              <span style={{ fontSize: 44 }}>😔</span>
              <p style={{ fontSize: 15, fontWeight: 800, color: '#1A1714', margin: 0 }}>Menu tidak ditemukan</p>
              <p style={{ fontSize: 12, color: '#9B978E', fontWeight: 500, margin: 0 }}>
                Coba kata kunci lain atau pilih kategori berbeda
              </p>
            </div>
          )}
        </div>

      </div>
    </>
  );
};
