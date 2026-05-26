import { ShoppingCart } from 'lucide-react';


export const FoodCard = ({
  image,
  name,
  price,
  description,

  sold = 0,
  quota = 50,
  isFeatured = false,
  onAddToCart,
}) => {
  const pct = quota > 0 ? Math.min(100, Math.round((sold / quota) * 100)) : 0;

  return (
    <article className="overflow-hidden bg-white border border-[#F3F4F6] shadow-[0_2px_12px_rgba(0,0,0,0.03)]" style={{ borderRadius: 4 }}>
      <div className="relative aspect-video overflow-hidden">
        <img src={image} alt={name} className="h-full w-full object-cover" loading="lazy" />
        {isFeatured ? (
          <div 
            className="absolute left-2 top-2 bg-[#FFC107] px-2.5 py-1 text-[10px] font-black text-gray-900 shadow-sm"
            style={{ borderRadius: 2 }}
          >
            Terlaris
          </div>
        ) : null}
      </div>

      <div className="px-4 py-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-left text-[15px] font-black text-gray-900 leading-tight tracking-tight">{name}</h3>
          <p className="shrink-0 text-[15px] font-black text-[#f27322] tracking-tighter">{price}</p>
        </div>
        
        <p className="mt-1.5 text-left text-[11.5px] text-gray-400 line-clamp-2 leading-relaxed font-medium">
          {description}
        </p>



        <button 
          className="mt-5 flex h-11 w-full items-center justify-center gap-2 bg-[#f27322] font-black text-white shadow-lg shadow-orange-900/20 transition-all active:scale-[0.97] hover:bg-[#e06416]" 
          style={{ borderRadius: 4 }}
          onClick={onAddToCart}
        >
          <ShoppingCart size={16} strokeWidth={3} />
          <span className="text-[12.5px]">Tambah ke Keranjang</span>
        </button>
      </div>
    </article>
  );
};
