import { Utensils, ReceiptText } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useCheckout } from '../context/CheckoutContext';

export const BottomNavigation = () => {
  const { pathname } = useLocation();
  const { cartDraft } = useCheckout();

  const ordersRoute = ['/order', '/order-data', '/order-summary', '/payment'].includes(pathname);
  const orderHref = cartDraft.product ? '/order-data' : '/order';

  const navItems = [
    { name: 'MENU', icon: Utensils, path: '/', isActive: pathname === '/' },
    {
      name: 'PESANAN',
      icon: ReceiptText,
      path: orderHref,
      isActive: ordersRoute && pathname !== '/',
    },
  ];

  return (
    <nav className="w-full border-t border-gray-50 bg-white/95 backdrop-blur-md shrink-0 shadow-[0_-2px_15px_rgba(0,0,0,0.02)]">
      <div className="flex h-[80px] items-center justify-around px-6">
        {navItems.map(({ name, icon: Icon, path, isActive }) => (
          <Link
            key={name}
            to={path}
            className="group relative flex flex-1 flex-col items-center justify-center gap-1.5 transition-all"
          >
            <div className={`flex h-11 w-11 items-center justify-center transition-all ${isActive ? 'bg-orange-50 text-[#F27322] shadow-sm' : 'text-gray-300 group-hover:text-gray-400'}`} style={{ borderRadius: 10 }}>
              <Icon
                size={22}
                strokeWidth={isActive ? 3 : 2.5}
              />
            </div>
            <span
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
                isActive ? 'text-[#F27322]' : 'text-gray-300'
              }`}
            >
              {name}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
};
