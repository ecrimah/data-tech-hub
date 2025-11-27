import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Network, Bundle, User } from '../types';
import { BUNDLE_SIZES, AVAILABLE_NETWORKS, PROMOTIONS, PRICE_PER_GB } from '../constants';
import { getPricePerGb } from '../services/supabaseDatabase';
import { Zap, Lock, Loader2, ArrowRight, MessageCircle } from 'lucide-react';

interface ShopProps {
  user: User | null;
}

export const Shop: React.FC<ShopProps> = ({ user: _user }) => {
  const navigate = useNavigate();
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(Network.MTN);
  const [currentPricePerGb, setCurrentPricePerGb] = useState<number>(PRICE_PER_GB);
  const [loadingPrice, setLoadingPrice] = useState(true);

  useEffect(() => {
    const fetchPrice = async () => {
      const price = await getPricePerGb();
      setCurrentPricePerGb(price);
      setLoadingPrice(false);
    };
    fetchPrice();
  }, []);

  const handleBuyClick = (bundle: Bundle) => {
    navigate('/checkout', { state: { bundle, network: selectedNetwork } });
  };

  const getNetworkColor = (networkId: string) => {
    switch (networkId) {
      case 'MTN': return 'from-yellow-400 to-yellow-500 text-yellow-950 shadow-yellow-500/20';
      case 'Telecel': return 'from-red-500 to-rose-600 text-white shadow-rose-500/20';
      case 'AT': return 'from-blue-500 to-indigo-600 text-white shadow-blue-500/20';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const getNetworkRing = (networkId: string) => {
    switch(networkId) {
      case 'MTN': return 'ring-yellow-400/50';
      case 'Telecel': return 'ring-red-500/50';
      case 'AT': return 'ring-blue-500/50';
      default: return 'ring-slate-200';
    }
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-6 pb-2">
        <div className="inline-flex items-center space-x-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-brand-200 dark:border-brand-900/30 px-3 py-1 rounded-full shadow-sm mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-semibold text-brand-700 dark:text-brand-300">System Online & Fast</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Superfast Data.<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-purple-600">Unbeatable Prices.</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Instant delivery to all networks in Ghana. Secure payments via Mobile Money or Card. No expiration dates on bundles.
        </p>
      </section>

      {/* Promotions */}
      <section className="grid md:grid-cols-2 gap-6">
        {PROMOTIONS.map(promo => (
          <div key={promo.id} className={`${promo.color} rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300`}>
            <div className="relative z-10">
              <div className="bg-white/20 w-fit px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-sm border border-white/10">Limited Time</div>
              <h3 className="text-3xl font-bold mb-2">{promo.title}</h3>
              <p className="text-white/90 mb-6 text-lg leading-relaxed">{promo.description}</p>
              <div className="flex flex-col items-start gap-2">
                <button className="bg-white text-slate-900 px-6 py-2.5 rounded-full text-sm font-bold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2">
                  <span>View Deal</span>
                  <ArrowRight size={16} />
                </button>
                <div className="inline-flex items-center space-x-1 bg-black/30 dark:bg-white/20 px-3 py-1 rounded-lg backdrop-blur-md">
                   <Lock size={12} className="text-white/80" />
                   <span className="text-[10px] font-bold uppercase tracking-wider text-white">Coming Soon</span>
                </div>
              </div>
            </div>
            {/* Abstract Shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
            <Zap className="absolute -right-6 -bottom-6 text-white/10 w-48 h-48 rotate-12 group-hover:rotate-6 transition-transform duration-500" />
          </div>
        ))}
      </section>

      {/* WhatsApp Community Banner */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg shadow-green-600/20 group">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm border border-white/20 group-hover:scale-110 transition-transform duration-300">
              <MessageCircle size={32} className="text-white fill-white/20" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-1">Join the VIP WhatsApp Group</h3>
              <p className="text-green-50 text-sm md:text-base">Be the first to know about flash sales, giveaways, and get priority support.</p>
            </div>
          </div>
          <a 
            href="https://chat.whatsapp.com/your-invite-link" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white text-green-700 px-8 py-3.5 rounded-full font-bold hover:bg-green-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2 whitespace-nowrap"
          >
            <span>Join Now</span>
            <ArrowRight size={18} />
          </a>
        </div>
        {/* Abstract Pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
      </section>

      {/* Main Shop Area */}
      <div className="space-y-6">
        {/* Network Select Tabs */}
        <div className="flex justify-center sticky top-24 z-30 pointer-events-none">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-lg pointer-events-auto inline-flex">
            {AVAILABLE_NETWORKS.map(net => {
              const isActive = selectedNetwork === net.id;
              return (
                <button
                  key={net.id}
                  onClick={() => setSelectedNetwork(net.id as Network)}
                  className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                    isActive 
                      ? `bg-gradient-to-r ${getNetworkColor(net.id)} shadow-md scale-100` 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {net.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Coming Soon: Airtime */}
        <section className="bg-gradient-to-r from-slate-100 to-white dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between opacity-80 hover:opacity-100 transition-opacity">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="bg-slate-200 dark:bg-slate-700 p-3.5 rounded-xl">
              <Lock className="text-slate-500 dark:text-slate-400" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">Airtime Top-Up</h3>
              <p className="text-slate-500 dark:text-slate-400">Instant airtime purchases coming soon.</p>
            </div>
          </div>
          <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-slate-300 dark:border-slate-700">Coming Soon</span>
        </section>

        {/* Bundles Grid */}
        {loadingPrice ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="animate-spin text-brand-600" size={48} />
            <p className="text-slate-500 font-medium animate-pulse">Fetching latest prices...</p>
          </div>
        ) : (
          <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {BUNDLE_SIZES.map(size => {
              const price = size * currentPricePerGb;
              return (
                <div 
                  key={size} 
                  onClick={() => handleBuyClick({ size, price })}
                  className={`bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 md:p-6 cursor-pointer group relative overflow-hidden border border-transparent hover:border-brand-200 dark:hover:border-slate-600 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-900/10 hover:-translate-y-1 ${size >= 10 ? 'md:col-span-2 lg:col-span-1' : ''}`}
                >
                  {/* Hover Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${getNetworkColor(selectedNetwork)} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  <div className="flex justify-between items-start mb-6">
                    <span className="bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase border border-brand-100 dark:border-brand-800">
                      Non-Expiry
                    </span>
                    <div className={`w-3 h-3 rounded-full ring-2 ${getNetworkRing(selectedNetwork)} ${getNetworkColor(selectedNetwork).split(' ')[0].replace('from-', 'bg-')}`}></div>
                  </div>
                  
                  <div className="space-y-1 relative z-10">
                    <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-baseline gap-1">
                      {size} <span className="text-lg font-semibold text-slate-400">GB</span>
                    </h3>
                    <p className="text-xl font-medium text-slate-600 dark:text-slate-300">
                      GH₵ {price.toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-brand-600 dark:text-brand-400 font-bold text-sm group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
                    <span>Purchase</span>
                    <div className="bg-brand-50 dark:bg-brand-900/20 p-1.5 rounded-full group-hover:scale-110 transition-transform">
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
};