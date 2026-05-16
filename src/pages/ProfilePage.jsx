import { useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';

export const ProfilePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-32 flex flex-col">
      <AppHeader />
      
      <div className="flex-1 px-6 pt-8">
        <h1 className="text-[26px] font-black tracking-tight text-gray-900">Profil Saya</h1>
        
        {/* Profile Card */}
        <div className="mt-8 space-y-6 rounded-md border border-gray-100 bg-white p-8 shadow-sm animate-pop-in">
          {/* User Header */}
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-md bg-gradient-to-br from-orange-50 to-orange-100 border-4 border-white shadow-sm flex items-center justify-center">
              <User className="text-[#F27322]" size={36} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nama Lengkap</p>
              <p className="mt-1 text-[18px] font-black text-gray-900 tracking-tight">Pengguna Setia</p>
            </div>
          </div>

          <div className="h-px bg-gray-50 w-full" />
          
          {/* Info Fields */}
          <div className="space-y-4">
            <div className="p-5 rounded-md bg-gray-50/50 border border-gray-50">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nomor WhatsApp</p>
              <p className="mt-2 text-[15px] font-black text-gray-900">+62 812 3456 7890</p>
            </div>
            
            <div className="p-5 rounded-md bg-gray-50/50 border border-gray-50">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Pesanan</p>
              <p className="mt-2 text-[15px] font-black text-gray-900">12 Pesanan Berhasil</p>
            </div>
          </div>

          <div className="h-px bg-gray-50 w-full" />

          {/* Logout Button */}
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 h-12 rounded-md border-2 border-red-100 bg-red-50 font-black text-red-600 transition-all active:scale-95"
          >
            <LogOut size={18} strokeWidth={2.5} />
            <span className="text-[13px]">Keluar Akun</span>
          </button>
        </div>
      </div>
    </div>
  );
};
