import React, { useState, useEffect } from 'react';
import { ProductScreen } from './components/ProductScreen';
import { OrderScreen } from './components/OrderScreen';
import { ChatInterface } from './components/ChatInterface';
import { AdminDashboard } from './components/AdminDashboard';
import { initializeChat } from './services/geminiService';
import { MOCK_PRODUCT, MOCK_ORDERS } from './constants';
import { Message, Order, Product, ViewState } from './types';
import { LayoutDashboard, Smartphone, ShoppingBag } from 'lucide-react';

// Use a fallback key or process.env if available.
// In a real app, this should be securely managed.
const API_KEY = process.env.API_KEY || ''; 

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('product');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatContext, setChatContext] = useState<{ product?: Product; order?: Order }>({});

  useEffect(() => {
    if (API_KEY) {
      initializeChat(API_KEY);
    } else {
        console.warn("API Key is missing. Chat will be in offline mode.");
    }
  }, []);

  const openProductChat = () => {
    // Context switching: User is asking about the current product
    setChatContext({ product: MOCK_PRODUCT });
    setMessages([]); // Optional: Clear old messages or keep history
    setIsChatOpen(true);
  };

  const openOrderChat = (order: Order) => {
    // Context switching: User is asking about a specific order
    setChatContext({ order });
    setMessages([]);
    setIsChatOpen(true);
  };

  // Render content based on current view
  const renderView = () => {
    switch (view) {
      case 'product':
        return (
          <ProductScreen 
            product={MOCK_PRODUCT} 
            onOpenChat={openProductChat} 
            onBack={() => setView('orders')} // Just for demo flow
          />
        );
      case 'orders':
        return (
          <OrderScreen 
            orders={MOCK_ORDERS} 
            onOpenSupport={openOrderChat} 
            onBack={() => setView('product')} 
          />
        );
      case 'admin':
        return <AdminDashboard onBack={() => setView('product')} />;
      default:
        return <div>Error</div>;
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 text-gray-800">
        {!API_KEY && (
            <div className="bg-yellow-500 text-white text-center text-xs p-1 fixed top-0 w-full z-[100]">
                演示模式: 请添加 API_KEY 以启用 AI 功能。
            </div>
        )}
      
      {/* Navigation (Demo Only) */}
      <div className="fixed top-20 right-4 flex flex-col gap-2 z-40 hidden md:flex">
          <button onClick={() => setView('product')} className={`p-3 rounded-full shadow-lg transition ${view === 'product' ? 'bg-red-600 text-white' : 'bg-white text-gray-600'}`} title="商品详情">
              <Smartphone className="w-5 h-5" />
          </button>
          <button onClick={() => setView('orders')} className={`p-3 rounded-full shadow-lg transition ${view === 'orders' ? 'bg-red-600 text-white' : 'bg-white text-gray-600'}`} title="订单列表">
              <ShoppingBag className="w-5 h-5" />
          </button>
          <button onClick={() => setView('admin')} className={`p-3 rounded-full shadow-lg transition ${view === 'admin' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600'}`} title="管理后台">
              <LayoutDashboard className="w-5 h-5" />
          </button>
      </div>

      <div className="pt-2"> {/* Pad for banner */}
        {renderView()}
      </div>

      <ChatInterface 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
        messages={messages}
        setMessages={setMessages}
        activeContext={chatContext}
      />
      
      {/* Mobile Nav Switcher for Demo Purposes */}
      <div className="md:hidden fixed bottom-20 right-4 flex flex-col gap-2 z-30">
        <button onClick={() => setView(view === 'admin' ? 'product' : 'admin')} className="bg-gray-800 text-white p-2 rounded-full shadow-lg text-xs opacity-50 hover:opacity-100">
            {view === 'admin' ? '退出后台' : '后台演示'}
        </button>
         <button onClick={() => setView(view === 'orders' ? 'product' : 'orders')} className="bg-gray-800 text-white p-2 rounded-full shadow-lg text-xs opacity-50 hover:opacity-100">
            {view === 'orders' ? '查看商品' : '查看订单'}
        </button>
      </div>
    </div>
  );
};

export default App;