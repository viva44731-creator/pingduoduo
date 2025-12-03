import React from 'react';
import { Search, ChevronLeft, Truck, Package, MessageSquare } from 'lucide-react';
import { Order } from '../types';

interface OrderScreenProps {
  orders: Order[];
  onOpenSupport: (order: Order) => void;
  onBack: () => void;
}

export const OrderScreen: React.FC<OrderScreenProps> = ({ orders, onOpenSupport, onBack }) => {
  return (
    <div className="bg-gray-100 min-h-screen max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white p-4 flex items-center gap-4 sticky top-0 z-10 border-b border-gray-100">
        <button onClick={onBack}><ChevronLeft className="w-6 h-6 text-gray-600" /></button>
        <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input type="text" placeholder="搜索我的订单" className="bg-transparent text-sm outline-none w-full" />
        </div>
        <button className="text-sm text-gray-600">筛选</button>
      </div>

      {/* Tabs */}
      <div className="bg-white flex justify-around text-sm text-gray-600 border-b border-gray-100 py-3 mb-2">
          <span className="font-bold text-red-600 border-b-2 border-red-600 pb-2 -mb-3.5">全部</span>
          <span>待付款</span>
          <span>待发货</span>
          <span>已发货</span>
          <span>待评价</span>
      </div>

      {/* Order List */}
      <div className="space-y-3 p-3 pb-20">
          {orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                          <span className="font-bold text-sm flex items-center gap-1">官方旗舰店 <ChevronLeft className="w-3 h-3 rotate-180" /></span>
                      </div>
                      <span className={`text-sm ${order.status === '已送达' ? 'text-gray-500' : 'text-orange-500'}`}>
                          {order.status}
                      </span>
                  </div>

                  <div className="flex gap-3 mb-4">
                      <img src={order.product.image} alt={order.product.title} className="w-20 h-20 rounded-md object-cover bg-gray-100" />
                      <div className="flex-1">
                          <h3 className="text-sm font-medium line-clamp-2">{order.product.title}</h3>
                          <div className="text-xs text-gray-400 mt-1">规格: 默认</div>
                          <div className="flex justify-between items-end mt-2">
                              <span className="text-sm font-bold">¥{order.product.price}</span>
                              <span className="text-xs text-gray-500">x1</span>
                          </div>
                      </div>
                  </div>

                  <div className="text-right text-sm mb-3">
                      <span className="text-gray-500">实付: </span>
                      <span className="font-bold">¥{order.product.price}</span>
                  </div>

                  <div className="border-t border-gray-100 pt-3 flex justify-end gap-2">
                       {order.status === '已发货' && (
                           <button onClick={() => onOpenSupport(order)} className="px-3 py-1.5 border border-gray-300 rounded-full text-xs text-gray-600 flex items-center gap-1">
                               <Truck className="w-3 h-3" /> 查看物流
                           </button>
                       )}
                       <button onClick={() => onOpenSupport(order)} className="px-3 py-1.5 border border-red-200 text-red-600 rounded-full text-xs flex items-center gap-1 font-medium">
                           <MessageSquare className="w-3 h-3" /> 申请售后
                       </button>
                       <button className="px-3 py-1.5 bg-red-600 text-white rounded-full text-xs">再次购买</button>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};