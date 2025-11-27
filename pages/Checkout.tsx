import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bundle, Network, User } from '../types';
import { createOrder } from '../services/supabaseDatabase';
import { Loader2, Smartphone, CreditCard, Wallet, AlertCircle } from 'lucide-react';

interface CheckoutProps {
  user: User | null;
}

export const Checkout: React.FC<CheckoutProps> = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { bundle: Bundle; network: Network } | null;

  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'wallet'>('paystack');

  if (!state) {
    return <div className="p-8 text-center text-slate-600 dark:text-slate-400">Invalid checkout session. <button onClick={() => navigate('/')} className="text-brand-600 underline">Go Home</button></div>;
  }

  const { bundle, network } = state;

  const handlePayment = async () => {
    setError('');
    
    if (!phone || phone.length < 10) {
      setError('Please enter a valid Ghana phone number.');
      return;
    }

    if (!user && paymentMethod === 'wallet') {
      setError('You must be logged in to pay with wallet.');
      return;
    }

    setLoading(true);

    try {
      // If user is guest, create a temporary user object for the function
      const orderUser = user || { id: 'guest', email: 'guest@example.com', name: 'Guest', role: 'user', wallet_balance: 0, referral_code: '', created_at: '' } as User;
      
      await createOrder(orderUser, network, bundle.size, phone, paymentMethod);
      
      // Simulate Success
      navigate('/success', { 
        state: { 
          order: { 
            network, 
            bundle_size: `${bundle.size} GB`, 
            amount: bundle.price, 
            phone 
          } 
        } 
      });
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Checkout</h1>
      
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-300">
        {/* Order Summary */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center mb-2 text-slate-900 dark:text-white">
            <span className="text-slate-500 dark:text-slate-400">Package</span>
            <span className="font-bold text-lg">{network} {bundle.size} GB</span>
          </div>
          <div className="flex justify-between items-center text-slate-900 dark:text-white">
            <span className="text-slate-500 dark:text-slate-400">Total Amount</span>
            <span className="font-bold text-2xl text-brand-600 dark:text-brand-400">GH₵ {bundle.price.toFixed(2)}</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-center space-x-2 text-sm">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Phone Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Beneficiary Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Smartphone className="text-slate-400" size={18} />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors"
                placeholder="024 XXX XXXX"
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Please ensure the network matches the phone number.</p>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Payment Method</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentMethod('paystack')}
                className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${
                  paymentMethod === 'paystack' 
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 ring-1 ring-brand-500' 
                    : 'border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <CreditCard className="mb-2" />
                <span className="text-sm font-medium">Paystack / MoMo</span>
              </button>

              <button
                onClick={() => setPaymentMethod('wallet')}
                disabled={!user}
                className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${
                  paymentMethod === 'wallet' 
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 ring-1 ring-brand-500' 
                    : !user ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-800 text-slate-400' : 'border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <Wallet className="mb-2" />
                <span className="text-sm font-medium">Wallet Balance</span>
                {user && <span className="text-xs mt-1">Avail: GH₵ {user.wallet_balance.toFixed(2)}</span>}
              </button>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-700 dark:hover:bg-brand-500 transition-colors disabled:opacity-70 flex justify-center items-center space-x-2 shadow-lg shadow-brand-500/20"
          >
            {loading ? <Loader2 className="animate-spin" /> : <span>Confirm Payment</span>}
          </button>
        </div>
      </div>
    </div>
  );
};