export const PRICE_PER_GB = 6; // GHS
export const CURRENCY = 'GHS';

export const BUNDLE_SIZES = [
  1, 2, 3, 4, 5, 6, 8, 10, 15, 20, 25, 30, 40, 50, 100
];

export const AVAILABLE_NETWORKS = [
  { id: 'MTN', name: 'MTN', color: 'bg-yellow-400 text-yellow-900' },
  { id: 'Telecel', name: 'Telecel (Voda)', color: 'bg-red-500 text-white' },
  { id: 'AT', name: 'AT (AirtelTigo)', color: 'bg-blue-500 text-white' },
];

export const PROMOTIONS = [
  {
    id: 'flash-sale',
    title: 'Flash Sale!',
    description: 'Get 10% bonus on all MTN bundles today.',
    color: 'bg-gradient-to-r from-pink-500 to-rose-500'
  },
  {
    id: 'new-user',
    title: 'New Here?',
    description: 'Use code DATAHUB for free 500MB on your first order.',
    color: 'bg-gradient-to-r from-indigo-500 to-purple-500'
  }
];