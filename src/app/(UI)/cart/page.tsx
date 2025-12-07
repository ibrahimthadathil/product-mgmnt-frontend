import ShoppingCart from '@/components/page-section/cart/shopping-cart';
import React from 'react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <ShoppingCart />
    </div>
  );
};

export default App;