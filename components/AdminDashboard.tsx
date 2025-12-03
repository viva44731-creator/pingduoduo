import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, MessageSquare, Clock, ThumbsUp } from 'lucide-react';

const data = [
  { name: '周一', queries: 4000, handover: 240 },
  { name: '周二', queries: 3000, handover: 139 },
  { name: '周三', queries: 2000, handover: 980 },
  { name: '周四', queries: 2780, handover: 390 },
  { name: '周五', queries: 1890, handover: 480 },
  { name: '周六', queries: 2390, handover: 380 },
  { name: '周日', queries: 3490, handover: 430 },
];

const sentimentData = [
  { name: '正面', value: 70 },
  { name: '中性', value: 20 },
  { name: '负面', value: 10 },
];

const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

export const AdminDashboard: React.FC<{onBack: () => void}> = ({onBack}) => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">智能客服数据看板</h1>
                <p className="text-gray-500 text-sm">多多客服机器人实时指标监控</p>
            </div>
            <button onClick={onBack} className="bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50">返回应用</button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><MessageSquare className="w-6 h-6"/></div>
                <div>
                    <div className="text-sm text-gray-500">总咨询量</div>
                    <div className="text-2xl font-bold">24,592</div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="p-3 bg-red-100 text-red-600 rounded-lg"><Users className="w-6 h-6"/></div>
                <div>
                    <div className="text-sm text-gray-500">转人工率</div>
                    <div className="text-2xl font-bold">4.2%</div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-lg"><ThumbsUp className="w-6 h-6"/></div>
                <div>
                    <div className="text-sm text-gray-500">满意度评分</div>
                    <div className="text-2xl font-bold">4.8/5.0</div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><Clock className="w-6 h-6"/></div>
                <div>
                    <div className="text-sm text-gray-500">平均响应时间</div>
                    <div className="text-2xl font-bold">0.8s</div>
                </div>
            </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px]">
                <h3 className="font-bold text-gray-800 mb-6">对话量 vs 转人工量</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Legend iconType="circle" />
                    <Bar dataKey="queries" fill="#4F46E5" radius={[4, 4, 0, 0]} name="自动解决" />
                    <Bar dataKey="handover" fill="#EF4444" radius={[4, 4, 0, 0]} name="人工处理" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px]">
                <h3 className="font-bold text-gray-800 mb-6">用户情感分析</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                        data={sentimentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        >
                        {sentimentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
};