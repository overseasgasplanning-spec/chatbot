export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string; // Display string like "10:30 ص"
}

export interface ChatSession {
  sessionId: string;
  messages: Message[];
}

export interface WebhookPayload {
  question: string;
  sessionId: string;
}

export interface WebhookResponse {
  // n8n responses can vary, but usually return a JSON object/array
  output?: string;
  text?: string; 
  message?: string;
  [key: string]: any;
}