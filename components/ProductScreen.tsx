import React from 'react';
import { MessageCircle, ShoppingCart, Heart, Share2, ChevronLeft, MoreHorizontal, ShieldCheck } from 'lucide-react';
import { Product } from '../types';

interface ProductScreenProps {
  product: Product;
  onOpenChat: () => void;
  onBack: () => void;
}

export const ProductScreen: React.FC<ProductScreenProps> = ({ product, onOpenChat, onBack }) => {
  return (
    <div className="bg-gray-100 min-h-screen pb-20 max-w-2xl mx-auto shadow-2xl relative">
      {/* Navbar */}
      <div className="absolute top-0 w-full flex justify-between p-4 z-10 text-white bg-gradient-to-b from-black/50 to-transparent">
        <button onClick={onBack} className="bg-black/20 p-2 rounded-full backdrop-blur-md"><ChevronLeft className="w-6 h-6" /></button>
        <div className="flex gap-3">
            <button className="bg-black/20 p-2 rounded-full backdrop-blur-md"><Share2 className="w-6 h-6" /></button>
            <button className="bg-black/20 p-2 rounded-full backdrop-blur-md"><MoreHorizontal className="w-6 h-6" /></button>
        </div>
      </div>

      {/* Image */}
      <div className="w-full h-96 bg-white">
        <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
      </div>

      {/* Product Info */}
      <div className="bg-white p-4 mb-2">
        <div className="flex items-baseline gap-2 text-red-600">
            <span className="text-sm font-bold">¥</span>
            <span className="text-3xl font-extrabold">{product.price}</span>
            <span className="text-xs text-gray-400 line-through ml-2">¥{product.originalPrice}</span>
            <span className="ml-auto text-xs text-gray-500">已售 {product.sold}+</span>
        </div>
        
        <h1 className="mt-2 text-lg font-semibold text-gray-800 leading-snug line-clamp-2">
            <span className="bg-red-600 text-white text-xs px-1 rounded mr-1 align-middle">品牌</span>
            {product.title}
        </h1>

        <div className="mt-3 flex flex-wrap gap-2">
            {product.tags.map((tag, i) => (
                <span key={i} className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-sm border border-red-100">{tag}</span>
            ))}
        </div>
      </div>

      {/* Guarantee Section */}
      <div className="bg-white p-3 mb-2 flex justify-between items-center text-xs text-gray-600">
          <div className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-green-600"/> 正品保证</div>
          <div className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-green-600"/> 48小时发货</div>
          <div className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-green-600"/> 退货包运费</div>
          <ChevronLeft className="w-4 h-4 rotate-180 text-gray-300" />
      </div>

      {/* Group Buy Section Mock */}
      <div className="bg-white p-3 mb-2">
          <div className="flex justify-between text-sm mb-2">
              <span className="font-bold">2 人正在拼单</span>
              <span className="text-gray-400 flex items-center">查看更多 <ChevronLeft className="w-4 h-4 rotate-180"/></span>
          </div>
          <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-yellow-200"></div>
                  <span className="text-sm">用户_9238</span>
              </div>
              <div className="flex items-center gap-2">
                  <div className="text-right">
                      <div className="text-xs">还差1人拼成</div>
                      <div className="text-[10px] text-gray-400">剩余 23:59:12</div>
                  </div>
                  <button className="bg-red-600 text-white text-xs px-3 py-1.5 rounded-full">去拼单</button>
              </div>
          </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 w-full max-w-2xl bg-white border-t border-gray-100 flex h-14 items-center z-40">
        <div className="flex-1 flex justify-around text-gray-500 text-[10px]">
            <div className="flex flex-col items-center justify-center cursor-pointer hover:text-red-600">
                <ShoppingCart className="w-5 h-5 mb-0.5" />
                店铺
            </div>
            <div onClick={onOpenChat} className="flex flex-col items-center justify-center cursor-pointer text-gray-700 hover:text-red-600 relative">
                <MessageCircle className="w-5 h-5 mb-0.5" />
                客服
                <span className="absolute top-0 right-3 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            </div>
            <div className="flex flex-col items-center justify-center cursor-pointer hover:text-red-600">
                <Heart className="w-5 h-5 mb-0.5" />
                收藏
            </div>
        </div>
        <div className="flex-[1.5] flex h-full text-white font-medium text-sm">
             <div className="flex-1 bg-orange-400 flex flex-col items-center justify-center cursor-pointer">
                 <span>¥{product.price + 5}</span>
                 <span className="text-[10px] font-normal">单独购买</span>
             </div>
             <div className="flex-1 bg-red-600 flex flex-col items-center justify-center cursor-pointer">
                 <span>¥{product.price}</span>
                 <span className="text-[10px] font-normal">发起拼单</span>
             </div>
        </div>
      </div>
    </div>
  );
};