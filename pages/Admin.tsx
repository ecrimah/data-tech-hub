import React, { useState, useEffect } from 'react';
import { getOrders, fulfillOrder, getPricePerGb, updatePricePerGb, getReferralsEnabled, setReferralsEnabled } from '../services/supabaseDatabase';
import { User } from '../types';

interface AdminProps {
  user: User | null;
}

const Admin: React.FC<AdminProps> = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [pricePerGb, setPricePerGb] = useState<number>(0);
  const [referralsEnabled, setReferralsEnabledState] = useState<boolean>(false);

  useEffect(() => {
    loadOrders();
    loadSettings();
  }, []);

  const loadOrders = async () => {
    try {
      const fetchedOrders = await getOrders();
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const price = await getPricePerGb();
      setPricePerGb(price);
      const referrals = await getReferralsEnabled();
      setReferralsEnabledState(referrals);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleFulfillOrder = async (orderId: string) => {
    try {
      await fulfillOrder(orderId);
      loadOrders(); // Reload orders after fulfilling
    } catch (error) {
      console.error('Error fulfilling order:', error);
    }
  };

  const handleUpdatePrice = async () => {
    try {
      await updatePricePerGb(pricePerGb);
      alert('Price updated successfully');
    } catch (error) {
      console.error('Error updating price:', error);
    }
  };

  const handleToggleReferrals = async () => {
    try {
      await setReferralsEnabled(!referralsEnabled);
      setReferralsEnabledState(!referralsEnabled);
      alert('Referrals setting updated successfully');
    } catch (error) {
      console.error('Error updating referrals setting:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Orders</h2>
        <div className="space-y-2">
          {orders.map((order) => (
            <div key={order.id} className="border p-4 rounded">
              <p>Order ID: {order.id}</p>
              <p>User: {order.user_id}</p>
              <p>Amount: {order.amount}</p>
              <p>Status: {order.status}</p>
              {order.status === 'pending' && (
                <button
                  onClick={() => handleFulfillOrder(order.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                >
                  Fulfill Order
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Price per GB:</label>
            <input
              type="number"
              value={pricePerGb}
              onChange={(e) => setPricePerGb(Number(e.target.value))}
              className="border p-2 rounded"
            />
            <button
              onClick={handleUpdatePrice}
              className="bg-green-500 text-white px-4 py-2 rounded ml-2"
            >
              Update Price
            </button>
          </div>
          <div>
            <label className="block mb-2">Referrals Enabled:</label>
            <input
              type="checkbox"
              checked={referralsEnabled}
              onChange={handleToggleReferrals}
              className="mr-2"
            />
            {referralsEnabled ? 'Enabled' : 'Disabled'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
