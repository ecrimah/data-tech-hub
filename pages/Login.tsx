import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signUp } from '../services/mockDatabase';
import { User } from '../types';
import { Loader2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface LoginProps {
  setUser: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ setUser }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let user: User;
      if (isLogin) {
        user = await signIn(formData.email, formData.password);
      } else {
        user = await signUp(formData.email, formData.name, formData.phone);
      }
      setUser(user);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-700">
        
        {/* Left Side: Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center order-2 md:order-1">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">{isLogin ? 'Welcome Back!' : 'Create Account'}</h1>
            <p className="text-slate-500 dark:text-slate-400">
              {isLogin ? 'Enter your details to access your wallet.' : 'Join thousands of Ghanaians enjoying cheap data.'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm text-center border border-red-100 dark:border-red-900/30 animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Full Name</label>
                  <input
                    name="name"
                    required
                    placeholder="Kwame Mensah"
                    className="w-full border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Phone Number</label>
                  <input
                    name="phone"
                    required
                    placeholder="024 XXX XXXX"
                    className="w-full border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email Address</label>
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Password</label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-brand-700 dark:hover:bg-brand-500 transition-all flex justify-center items-center space-x-2 shadow-lg shadow-brand-500/30 hover:-translate-y-1"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><span>{isLogin ? 'Sign In' : 'Get Started'}</span><ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-slate-500 dark:text-slate-400">{isLogin ? "New to Data Tech Hub? " : "Already have an account? "}</span>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-brand-600 dark:text-brand-400 font-bold hover:underline"
            >
              {isLogin ? 'Create Account' : 'Login'}
            </button>
          </div>
          
          {isLogin && (
            <div className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
              <p>Demo Admin: <span className="font-mono">admin@datatechhub.com / admin123</span></p>
              <p>Demo User: <span className="font-mono">user@test.com / password</span></p>
            </div>
          )}
        </div>

        {/* Right Side: Decorative */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-brand-600 to-indigo-700 text-white relative overflow-hidden order-1 md:order-2">
           {/* Abstract Shapes */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-16 -mb-16"></div>
           
           <div className="relative z-10 mt-10">
             <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 shadow-xl border border-white/20">
                <Zap size={32} className="text-white" fill="currentColor" />
             </div>
             <h2 className="text-4xl font-bold leading-tight mb-4">Fastest Data Delivery in Ghana.</h2>
             <p className="text-brand-100 text-lg">Join 10,000+ users saving money on internet bundles every day.</p>
           </div>

           <div className="relative z-10 space-y-4">
              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                <ShieldCheck size={24} className="text-green-300" />
                <div>
                  <h4 className="font-bold text-sm">Secure Payments</h4>
                  <p className="text-xs text-brand-100">Paystack & Mobile Money Certified</p>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};