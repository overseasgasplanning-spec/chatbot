import { WEBHOOK_URL } from '../constants';
import { WebhookPayload } from '../types';

export const sendMessageToWebhook = async (payload: WebhookPayload): Promise<string> => {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`Webhook Error: ${response.status} ${response.statusText}`);
      throw new Error(`API Error: ${response.statusText}`);
    }

    // Check Content-Type to decide how to parse
    const contentType = response.headers.get('content-type');
    
    // Handle JSON Response
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log("Webhook Response Data:", data);

      // Helper to check for valid string in an object
      // n8n users often map the response to keys like 'output', 'text', 'message', 'response'
      const findString = (obj: any): string | undefined => {
        if (!obj) return undefined;
        const candidates = [
            obj.output, 
            obj.text, 
            obj.message, 
            obj.response, 
            obj.answer, 
            obj.reply,
            obj.content
        ];
        return candidates.find(c => typeof c === 'string' && c.trim().length > 0);
      };

      // 1. Handle Array (standard n8n output format)
      if (Array.isArray(data)) {
        if (data.length === 0) return "تم استلام الطلب ولكن لم يتم إرجاع أي بيانات.";
        
        const firstItem = data[0];
        
        // Check direct properties on the first item
        const found = findString(firstItem);
        if (found) return found;
        
        // Sometimes n8n wraps the payload in a 'body' or 'json' property
        if (firstItem.body && typeof firstItem.body === 'object') {
             const foundInBody = findString(firstItem.body);
             if (foundInBody) return foundInBody;
        }
        
        // Fallback: if it's a string array, return string, else stringify JSON
        return typeof firstItem === 'string' ? firstItem : JSON.stringify(firstItem);
      }

      // 2. Handle Object (Direct JSON response)
      if (typeof data === 'object') {
        const found = findString(data);
        if (found) return found;
        return JSON.stringify(data);
      }

      // 3. Handle Primitive
      return String(data);

    } else {
      // Handle Text Response (Respond to Webhook: Text)
      const text = await response.text();
      return text || "تم استلام رد فارغ.";
    }

  } catch (error) {
    console.error("Webhook error:", error);
    return "عذراً، حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى لاحقاً.";
  }
};