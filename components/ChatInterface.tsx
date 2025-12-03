import React, { useState, useEffect, useRef } from 'react';
import { Message, MessageSender, Product, Order } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { X, Send, Paperclip, Minimize2, User, Bot, Headphones, Image as ImageIcon } from 'lucide-react';

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  activeContext?: { product?: Product; order?: Order };
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  isOpen,
  onClose,
  messages,
  setMessages,
  activeContext
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isTransferring, setIsTransferring] = useState(false);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, isTyping]);

  // Initial greeting based on context
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialMsg: Message = {
        id: 'init-1',
        text: activeContext?.product 
          ? `亲，您看中这款【${activeContext.product.title}】了吗？我可以帮您查库存或介绍规格哦！🛍️`
          : activeContext?.order
          ? `亲，看到您在咨询订单 ${activeContext.order.id}，是想查询物流还是申请退换货呢？📦`
          : "欢迎来到拼多多官方客服！亲，今天有什么可以帮您的？",
        sender: MessageSender.Bot,
        timestamp: new Date(),
      };
      setMessages([initialMsg]);
    }
  }, [isOpen, activeContext]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSend = async (text: string = inputValue) => {
    if (!text.trim()) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      text: text,
      sender: MessageSender.User,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Simulate network delay for realism
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const responseText = await sendMessageToGemini(text, activeContext);
      
      const newBotMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: MessageSender.Bot,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newBotMsg]);
    } catch (error) {
       // Error handled in service, generic fallback here if needed
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickReply = (text: string) => {
    handleSend(text);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a fake URL for the image
      const imageUrl = URL.createObjectURL(file);
      const newMsg: Message = {
        id: Date.now().toString(),
        text: "已发送图片",
        sender: MessageSender.User,
        timestamp: new Date(),
        type: 'image',
        metaData: { src: imageUrl }
      };
      setMessages(prev => [...prev, newMsg]);
      
      // Bot response to image
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: "亲，图片收到了，我正在帮您核实问题。🕵️‍♀️",
          sender: MessageSender.Bot,
          timestamp: new Date()
        }]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const transferToHuman = () => {
    setIsTransferring(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: "正在为您转接高级专员... (预计等待: 2分钟)",
        sender: MessageSender.System,
        timestamp: new Date()
      }]);
      setIsTransferring(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 right-0 md:bottom-6 md:right-6 w-full md:w-[400px] h-[90vh] md:h-[600px] bg-white md:rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 overflow-hidden font-sans">
      {/* Header */}
      <div className="bg-red-600 p-4 text-white flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
             <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">多多客服</h3>
            <span className="text-xs text-red-100 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              在线
            </span>
          </div>
        </div>
        <div className="flex gap-2">
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition">
                <Minimize2 className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.sender === MessageSender.User ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === MessageSender.System ? (
               <div className="w-full text-center text-xs text-gray-400 my-2 italic">
                 {msg.text}
               </div>
            ) : (
                <div className={`flex max-w-[80%] gap-2 ${msg.sender === MessageSender.User ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.sender === MessageSender.User ? 'bg-indigo-100' : 'bg-red-100'}`}>
                    {msg.sender === MessageSender.User ? <User className="w-5 h-5 text-indigo-600" /> : <Bot className="w-5 h-5 text-red-600" />}
                </div>
                
                <div className={`flex flex-col gap-1 ${msg.sender === MessageSender.User ? 'items-end' : 'items-start'}`}>
                    {msg.type === 'image' ? (
                        <div className="rounded-xl overflow-hidden border-2 border-indigo-200">
                            <img src={msg.metaData?.src} alt="Upload" className="w-32 h-32 object-cover" />
                        </div>
                    ) : (
                        <div
                        className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                            msg.sender === MessageSender.User
                            ? 'bg-indigo-600 text-white rounded-tr-none'
                            : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                        }`}
                        >
                        {msg.text}
                        </div>
                    )}
                    <span className="text-[10px] text-gray-400">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
                </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start gap-2">
             <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                 <Bot className="w-5 h-5 text-red-600" />
             </div>
             <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 flex items-center gap-1 shadow-sm">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions (Smart Chips) */}
      {!isTyping && (
        <div className="px-4 py-2 bg-gray-50 flex gap-2 overflow-x-auto scrollbar-hide border-t border-gray-100">
            {activeContext?.product ? (
                <>
                    <button onClick={() => handleQuickReply("这件还有货吗？")} className="whitespace-nowrap px-3 py-1 bg-white border border-red-200 text-red-600 rounded-full text-xs font-medium hover:bg-red-50 transition">📦 有货吗</button>
                    <button onClick={() => handleQuickReply("现在有优惠吗？")} className="whitespace-nowrap px-3 py-1 bg-white border border-red-200 text-red-600 rounded-full text-xs font-medium hover:bg-red-50 transition">💰 有优惠吗</button>
                    <button onClick={() => handleQuickReply("什么时候能发货？")} className="whitespace-nowrap px-3 py-1 bg-white border border-red-200 text-red-600 rounded-full text-xs font-medium hover:bg-red-50 transition">🚚 发货时间</button>
                </>
            ) : activeContext?.order ? (
                <>
                    <button onClick={() => handleQuickReply("我的快递到哪了？")} className="whitespace-nowrap px-3 py-1 bg-white border border-indigo-200 text-indigo-600 rounded-full text-xs font-medium hover:bg-indigo-50 transition">📍 物流进度</button>
                    <button onClick={() => handleQuickReply("我要申请退货。")} className="whitespace-nowrap px-3 py-1 bg-white border border-indigo-200 text-indigo-600 rounded-full text-xs font-medium hover:bg-indigo-50 transition">↩️ 我要退货</button>
                </>
            ) : (
                <>
                    <button onClick={() => handleQuickReply("查看最近订单")} className="whitespace-nowrap px-3 py-1 bg-white border border-gray-200 text-gray-600 rounded-full text-xs font-medium hover:bg-gray-100 transition">查看订单</button>
                    <button onClick={() => handleQuickReply("退款政策是什么？")} className="whitespace-nowrap px-3 py-1 bg-white border border-gray-200 text-gray-600 rounded-full text-xs font-medium hover:bg-gray-100 transition">退款政策</button>
                </>
            )}
             <button onClick={transferToHuman} disabled={isTransferring} className="whitespace-nowrap px-3 py-1 bg-white border border-gray-300 text-gray-600 rounded-full text-xs font-medium hover:bg-gray-100 flex items-center gap-1">
                <Headphones className="w-3 h-3" /> 人工客服
             </button>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
            <button onClick={() => fileInputRef.current?.click()} className="text-gray-400 hover:text-gray-600 transition">
                <ImageIcon className="w-5 h-5" />
            </button>
            <input 
               type="file" 
               className="hidden" 
               ref={fileInputRef} 
               accept="image/*"
               onChange={handleFileUpload}
            />
            
            <input
                type="text"
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                placeholder={isTransferring ? "等待人工客服接入..." : "输入消息..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={isTransferring}
            />
            
            <button 
                onClick={() => handleSend()} 
                disabled={!inputValue.trim() || isTransferring}
                className={`p-1.5 rounded-full transition ${inputValue.trim() ? 'bg-red-600 text-white shadow-sm hover:bg-red-700' : 'bg-gray-300 text-white cursor-not-allowed'}`}
            >
                <Send className="w-4 h-4" />
            </button>
        </div>
        <div className="text-[10px] text-gray-400 text-center mt-2">
            AI智能回复。如遇复杂问题，请请求人工客服。
        </div>
      </div>
    </div>
  );
};