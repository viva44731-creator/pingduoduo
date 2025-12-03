import { Product, Order } from './types';

export const MOCK_PRODUCT: Product = {
  id: 'p123',
  title: '夏季纯棉T恤透气男女同款宽松版型 Ins潮牌',
  price: 9.99,
  originalPrice: 25.00,
  image: 'https://picsum.photos/400/400',
  sold: 4500,
  stock: 120,
  tags: ['退货包运费', '极速退款', '全场包邮']
};

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-998811',
    status: '已发货',
    date: '2023-10-25',
    trackingNumber: 'SF1234567890',
    product: { ...MOCK_PRODUCT, title: '无线蓝牙降噪耳机 超长续航', image: 'https://picsum.photos/400/401', price: 29.99 }
  },
  {
    id: 'ORD-776655',
    status: '已送达',
    date: '2023-10-15',
    product: { ...MOCK_PRODUCT, title: '北欧风陶瓷咖啡杯套装 精致礼盒', image: 'https://picsum.photos/400/402', price: 15.50 }
  }
];