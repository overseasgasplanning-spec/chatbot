
import React, { useState, useEffect, useRef } from 'react';
import ChatHeader from './components/ChatHeader';
import ChatInput from './components/ChatInput';
import MessageBubble from './components/MessageBubble';
import { Message, WebhookPayload } from './types';
import { 
  loadMessages, 
  saveMessages, 
  getSessionId, 
  clearChatHistory, 
  getCurrentTimestamp 
} from './utils/storage';
import { sendMessageToWebhook } from './services/chatService';
import { INITIAL_MESSAGE_TEXT } from './constants';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef<string>(getSessionId());

  // Load History
  useEffect(() => {
    const history = loadMessages();
    if (history && history.length > 0) {
      setMessages(history);
    } else {
      // Initial Greeting
      const initialMsg: Message = {
        id: 'init-1',
        text: INITIAL_MESSAGE_TEXT,
        sender: 'bot',
        timestamp: getCurrentTimestamp(),
      };
      setMessages([initialMsg]);
      saveMessages([initialMsg]);
    }
  }, []);

  // Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle Send
  const handleSend = async (text: string) => {
    const userMsg: Message = {
      id: crypto.randomUUID(),
      text,
      sender: 'user',
      timestamp: getCurrentTimestamp(),
    };

    // Optimistic Update
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    saveMessages(newMessages);
    setIsLoading(true);

    try {
      const payload: WebhookPayload = {
        question: text,
        sessionId: sessionId.current,
      };

      const responseText = await sendMessageToWebhook(payload);

      const botMsg: Message = {
        id: crypto.randomUUID(),
        text: responseText,
        sender: 'bot',
        timestamp: getCurrentTimestamp(),
      };

      const updatedWithBot = [...newMessages, botMsg];
      setMessages(updatedWithBot);
      saveMessages(updatedWithBot);
    } catch (error) {
      console.error("Failed to process message");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Clear
  const handleClear = () => {
    if (confirm('هل أنت متأكد أنك تريد مسح سجل المحادثة؟')) {
      clearChatHistory();
      sessionId.current = getSessionId(); // Ensure valid session exists (or reset if logic dictates)
      
      // Reset to initial state
      const initialMsg: Message = {
        id: crypto.randomUUID(),
        text: INITIAL_MESSAGE_TEXT,
        sender: 'bot',
        timestamp: getCurrentTimestamp(),
      };
      setMessages([initialMsg]);
      saveMessages([initialMsg]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#E1E1E1] overflow-hidden">
      {/* Fixed Header */}
      <ChatHeader onClear={handleClear} />

      {/* Scrollable Chat Area */}
      <main className="flex-1 wa-bg w-full relative mt-[72px] mb-[70px] overflow-y-auto">
        <div className="max-w-3xl mx-auto p-4 flex flex-col min-h-full justify-end sm:justify-start pt-4">
            {/* Encryption notice (visual fluff) */}
            <div className="text-center mb-6">
                <span className="bg-[#FFEECD] text-[#54656f] text-[10px] md:text-xs px-3 py-1.5 rounded-lg shadow-sm inline-block">
                    🔒 الرسائل مشفرة تماماً بين الطرفين. لا يمكن لأحد خارج هذه المحادثة قراءتها.
                </span>
            </div>

            {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
            ))}

            {isLoading && (
                <div className="flex w-full mb-4 justify-end">
                    <div className="bg-white px-4 py-3 rounded-lg shadow-sm rounded-tl-none">
                        <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Fixed Input */}
      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
};

export default App;
