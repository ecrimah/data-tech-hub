import { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Shop } from './pages/Shop';
import { Wallet } from './pages/Wallet';
import Admin from './pages/Admin';
import { Referrals } from './pages/Referrals';
import { Checkout } from './pages/Checkout';
import { Login } from './pages/Login';
import { SupportChat } from './components/SupportChat';
import { getSession } from './services/supabaseDatabase';
import { User } from './types';
import { CheckCircle } from 'lucide-react';

const SuccessPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full mb-4">
        <CheckCircle className="text-green-600 dark:text-green-400 w-16 h-16" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Order Received!</h1>
      <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8">
        Your order has been received by Data Tech Hub. We will deliver it soon (usually within 5 mins).
      </p>
      <a href="#/" className="bg-slate-900 dark:bg-slate-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors">Continue Shopping</a>
    </div>
  );
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const session = await getSession();
      setUser(session);
      setLoading(false);
    };
    init();
  }, []);

  const refreshUser = async () => {
    const session = await getSession();
    setUser(session);
  }

  const handleLogout = () => {
    localStorage.removeItem('dth_current_user');
    setUser(null);
    window.location.hash = '#/';
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-brand-600 bg-slate-50 dark:bg-slate-900">Loading Data Tech Hub...</div>;

  return (
    <HashRouter>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Shop user={user} />} />
          <Route path="/wallet" element={<Wallet user={user} refreshUser={refreshUser} />} />
          <Route path="/referrals" element={<Referrals user={user} />} />
          <Route path="/admin" element={<Admin user={user} />} />
          <Route path="/checkout" element={<Checkout user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
      <SupportChat />
    </HashRouter>
  );
}

export default App;