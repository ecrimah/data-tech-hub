import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Order, UserRole, DeliveryStatus } from '../types';
import { getOrders, fulfillOrder, getPricePerGb, updatePricePerGb, getReferralsEnabled, setReferralsEnabled } from '../services/mockDatabase';
import { CheckCircle, Clock, Search, RefreshCw, Settings, Save, ToggleLeft, ToggleRight, Gift } from 'lucide-react';

interface AdminProps {
  user: User | null;
}

export const Admin: React.FC<AdminProps> = ({ user }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'delivered'>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [newPrice, setNewPrice] = useState<number | string>('');
  const [referralsEnabled, setReferralsEnabledState] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    if (!user || user.role !== UserRole.ADMIN) {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    setLoading(true);
    const [ordersData, priceData, referralsData] = await Promise.all([
      getOrders(),
      getPricePerGb(),
      getReferralsEnabled()
    ]);
    setOrders(ordersData);
    setCurrentPrice(priceData);
    setNewPrice(priceData);
    setReferralsEnabledState(referralsData);
    setLoading(false);
  };

  const handleFulfill = async (orderId: string) => {
    await fulfillOrder(orderId);
    fetchData(); // Refresh
  };

  const handleUpdatePrice = async () => {
    const price = parseFloat(newPrice.toString());
    if (isNaN(price) || price <= 0) {
      alert("Please enter a valid positive price.");
      return;
    }
    setSavingSettings(true);
    await updatePricePerGb(price);
    setCurrentPrice(price);
    setSavingSettings(false);
    alert("Bundle pricing updated successfully!");
  };

  const handleToggleReferrals = async () => {
    setSavingSettings(true);
    const newState = !referralsEnabled;
    await setReferralsEnabled(newState);
    setReferralsEnabledState(newState);
    setSavingSettings(false);
  };

  const filteredOrders = orders.filter(o => {
    const matchesFilter = filter === 'all' || 
      (filter === 'pending' && o.delivery_status === DeliveryStatus.PENDING) ||
      (filter === 'delivered' && o.delivery_status === DeliveryStatus.DELIVERED);
    
    const matchesSearch = o.phone.includes(search) || o.payment_ref.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage orders and platform settings.</p>
        </div>
        <button onClick={fetchData} className="p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors">
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Content: Orders */}
        <div className="lg:col-span-3 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
              <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase">Pending Orders</h3>
              <p className="text-3xl font-bold text-amber-500">{orders.filter(o => o.delivery_status === DeliveryStatus.PENDING).length}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
              <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase">Total Revenue</h3>
              <p className="text-3xl font-bold text-green-600">GH₵ {orders.reduce((acc, o) => acc + o.amount, 0).toFixed(2)}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
              <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase">Total Orders</h3>
              <p className="text-3xl font-bold text-brand-600 dark:text-brand-400">{orders.length}</p>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 transition-colors">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by phone or reference..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-colors"
              />
            </div>
            <div className="flex space-x-2">
              {(['all', 'pending', 'delivered'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    filter === f 
                      ? 'bg-brand-600 text-white' 
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm transition-colors">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-100 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4">Reference</th>
                    <th className="px-6 py-4">Customer / Phone</th>
                    <th className="px-6 py-4">Detail</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">No orders found.</td>
                    </tr>
                  ) : (
                    filteredOrders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-300">{order.payment_ref}</td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900 dark:text-white">{order.phone}</div>
                          <div className="text-xs text-slate-400">{new Date(order.created_at).toLocaleTimeString()}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            order.network === 'MTN' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          }`}>
                            {order.network}
                          </span>
                          <span className="ml-2 text-slate-700 dark:text-slate-300">{order.bundle_size}</span>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-200">GH₵ {order.amount.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          {order.delivery_status === DeliveryStatus.DELIVERED ? (
                            <span className="flex items-center text-green-600 dark:text-green-400 space-x-1">
                              <CheckCircle size={14} />
                              <span>Delivered</span>
                            </span>
                          ) : (
                            <span className="flex items-center text-amber-500 space-x-1">
                              <Clock size={14} />
                              <span>Pending</span>
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {order.delivery_status === DeliveryStatus.PENDING && (
                            <button 
                              onClick={() => handleFulfill(order.id)}
                              className="bg-brand-600 text-white px-3 py-1.5 rounded-md text-xs hover:bg-brand-700 dark:hover:bg-brand-500 transition-colors"
                            >
                              Mark Done
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar: Settings */}
        <div className="space-y-6">
          {/* Pricing Config */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
            <div className="flex items-center space-x-2 mb-4 text-slate-800 dark:text-white">
              <Settings size={20} />
              <h2 className="font-bold">Pricing</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price per GB (GHS)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.1"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-500 outline-none transition-colors"
                  />
                  <div className="absolute right-3 top-2 text-sm text-slate-400">GHS</div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Currently active: <strong>{currentPrice.toFixed(2)} GHS</strong></p>
              </div>

              <button 
                onClick={handleUpdatePrice}
                disabled={savingSettings}
                className="w-full bg-slate-900 dark:bg-slate-700 text-white py-2 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors flex items-center justify-center space-x-2"
              >
                 {savingSettings ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                 <span>Update Pricing</span>
              </button>
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
            <div className="flex items-center space-x-2 mb-4 text-slate-800 dark:text-white">
              <Gift size={20} />
              <h2 className="font-bold">Features</h2>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-700 dark:text-slate-300">Referral Program</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Users can invite friends</p>
              </div>
              <button 
                onClick={handleToggleReferrals}
                disabled={savingSettings}
                className={`text-2xl transition-colors ${referralsEnabled ? 'text-green-500' : 'text-slate-300 dark:text-slate-600'}`}
              >
                {referralsEnabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};