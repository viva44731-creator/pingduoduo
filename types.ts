export enum MessageSender {
  Bot = 'bot',
  User = 'user',
  System = 'system'
}

export interface Message {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: Date;
  type?: 'text' | 'image' | 'order-card' | 'product-card';
  metaData?: any; 
}

export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  image: string;
  sold: number;
  stock: number;
  tags: string[];
}

export interface Order {
  id: string;
  product: Product;
  status: '已发货' | '待付款' | '已送达' | '已退款' | '待发货'; // Updated to Chinese status
  date: string;
  trackingNumber?: string;
}

export type ViewState = 'product' | 'orders' | 'admin';

export interface ChatState {
  isOpen: boolean;
  messages: Message[];
  isTyping: boolean;
  context: 'general' | 'product' | 'order';
  contextId?: string; // ID of the product or order being discussed
}