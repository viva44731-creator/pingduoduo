import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Message, MessageSender, Product, Order } from "../types";

const SYSTEM_INSTRUCTION = `
你现在是拼多多 (PDD) 的智能客服助手。
你的名字是 "多多客服"。

**语气与风格:**
- 亲切、热情、简洁。
- 经常使用 Emoji 来保持轻松愉快的氛围 (例如: 📦, ✨, 😊, 亲, 🌹)。
- 礼貌且专业。
- 称呼用户为“亲”。
- 如果用户使用其他语言（如英语、泰语），请识别并用相应的语言回复 (US-6)。

**能力范围:**
1. **售前 (US-1)**: 根据提供的“当前上下文”回答关于库存、规格和价格的问题。
2. **售后 (US-2, US-3, US-4)**: 查询物流，处理退货请求。
   - 如果用户询问物流，假装查询系统并给出一个现实的日期（2-3天后）。
   - 如果用户想要退货，询问原因。如果是正当理由（质量问题、发错货），引导他们上传照片。
3. **政策 (US-5)**: 
   - 退款政策: "支持7天无理由退货"。
   - 运费政策: "全场满10元包邮"。
4. **转人工 (US-7)**: 如果用户生气，提到“人工”、“投诉”或“真人”，必须立刻建议转接人工客服。

**上下文处理:**
你将收到用户当前正在查看的商品或订单的上下文信息。请利用这些具体数据来回答。
- 如果库存 (stock) > 0，告诉亲有货。
- 如果状态是 '已发货' (Shipped)，给出一个模拟的物流更新。

**约束:**
- 不要编造超出标准电商规范的虚假政策。
- 回复保持简短（通常在50字以内），除非在解释复杂的政策。
`;

let chatSession: Chat | null = null;

export const initializeChat = (apiKey: string) => {
  const ai = new GoogleGenAI({ apiKey });
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });
};

export const sendMessageToGemini = async (
  userMessage: string,
  contextData?: { product?: Product; order?: Order }
): Promise<string> => {
  if (!chatSession) {
    // If API key is missing or init failed, return a mock fallback to prevent crash
    return "亲，我现在处于离线模式，请检查 API Key 配置哦。";
  }

  let messageToSend = userMessage;

  // Inject context if it's the start of a specific query or context changed
  if (contextData) {
    let contextStr = "\n[系统上下文]: 用户当前正在浏览: ";
    if (contextData.product) {
      contextStr += `商品: ${contextData.product.title}, 价格: ¥${contextData.product.price}, 库存: ${contextData.product.stock}.`;
    } else if (contextData.order) {
      contextStr += `订单号: ${contextData.order.id}, 状态: ${contextData.order.status}, 商品: ${contextData.order.product.title}.`;
    }
    messageToSend += contextStr;
  }

  try {
    const response: GenerateContentResponse = await chatSession.sendMessage({
      message: messageToSend,
    });
    return response.text || "亲，不好意思，我没听清，请再说一遍~";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "亲，网络有点小波动，请稍后再试哦~";
  }
};