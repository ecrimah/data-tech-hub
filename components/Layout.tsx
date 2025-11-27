import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Wifi, Wallet, ShoppingBag, LogOut, LayoutDashboard, Gift, Sun, Moon } from 'lucide-react';
import { User, UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Theme Logic
  useEffect(() => {
    const storedTheme = localStorage.getItem('dth_theme');
    if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
      localStorage.setItem('dth_theme', 'dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('dth_theme', 'light');
    }
  };

  const isActive = (path: string) => location.pathname === path 
    ? 'text-brand-600 dark:text-brand-400 font-semibold bg-brand-50 dark:bg-brand-900/30' 
    : 'text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-50 dark:hover:bg-slate-800/50';

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
    <Link
      to={to}
      onClick={() => setIsMobileMenuOpen(false)}
      className={`flex items-center space-x-2 px-4 py-2.5 rounded-full transition-all duration-200 ${isActive(to)}`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300 overflow-x-hidden relative">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-200/30 dark:bg-brand-900/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200/30 dark:bg-purple-900/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-pink-200/30 dark:bg-pink-900/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header 
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-slate-200/50 dark:border-slate-800/50 py-2' 
            : 'bg-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform">
              <Wifi size={22} className="stroke-[2.5px]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-none tracking-tight">Data Tech Hub</h1>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-brand-600 dark:text-brand-400 mt-0.5">Premium Vending</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-1.5 rounded-full border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
            <NavItem to="/" icon={ShoppingBag} label="Shop" />
            <NavItem to="/wallet" icon={Wallet} label="Wallet" />
            <NavItem to="/referrals" icon={Gift} label="Referrals" />
            {user?.role === UserRole.ADMIN && (
              <NavItem to="/admin" icon={LayoutDashboard} label="Admin" />
            )}
          </nav>

          {/* User / Auth / Theme */}
          <div className="hidden md:flex items-center space-x-3">
            <button 
              onClick={toggleTheme}
              className="p-2.5 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700 shadow-sm hover:shadow"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {user ? (
              <div className="flex items-center pl-4 space-x-3 border-l border-slate-200 dark:border-slate-800">
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{user.name.split(' ')[0]}</p>
                  <p className="text-xs font-mono text-brand-600 dark:text-brand-400">GH₵ {user.wallet_balance.toFixed(2)}</p>
                </div>
                <button 
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-full font-semibold hover:shadow-lg hover:shadow-slate-500/20 hover:-translate-y-0.5 transition-all">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center space-x-2 md:hidden">
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 backdrop-blur rounded-lg"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button 
              className="p-2 text-slate-800 dark:text-white bg-white/50 dark:bg-slate-800/50 backdrop-blur rounded-lg border border-slate-200 dark:border-slate-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white dark:bg-slate-900 pt-24 px-6 animate-fade-in-up md:hidden">
          <nav className="flex flex-col space-y-2">
            <NavItem to="/" icon={ShoppingBag} label="Shop" />
            <NavItem to="/wallet" icon={Wallet} label="Wallet" />
            <NavItem to="/referrals" icon={Gift} label="Referrals" />
            {user?.role === UserRole.ADMIN && (
              <NavItem to="/admin" icon={LayoutDashboard} label="Admin Dashboard" />
            )}
          </nav>
          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
            {user ? (
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
                  <p className="text-brand-600 dark:text-brand-400 font-bold">GH₵ {user.wallet_balance.toFixed(2)}</p>
                </div>
                <button onClick={onLogout} className="text-sm text-red-500 font-medium px-4 py-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  Sign Out
                </button>
              </div>
            ) : (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full bg-brand-600 text-white text-center py-4 rounded-xl font-bold shadow-lg shadow-brand-500/30">
                Sign In / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 relative z-10 mt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-10 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                <div className="w-6 h-6 bg-brand-600 rounded flex items-center justify-center text-white">
                   <Wifi size={14} />
                </div>
                <span className="font-bold text-slate-900 dark:text-white">Data Tech Hub</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Empowering Ghana with seamless connectivity.</p>
            </div>
            <div className="flex space-x-6 text-sm text-slate-500 dark:text-slate-400">
              <a href="#" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Support</a>
            </div>
          </div>
          <div className="mt-8 text-center text-xs text-slate-400 dark:text-slate-600 border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
            &copy; {new Date().getFullYear()} Data Tech Hub Ghana. Built with ❤️ in Accra.
          </div>
        </div>
      </footer>
    </div>
  );
};