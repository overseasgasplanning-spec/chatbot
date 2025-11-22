
import React, { useState, useRef } from 'react';
import { Send, Mic } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSend(text);
      setText('');
      // Keep focus on mobile implies keyboard stays open
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <div className="bg-[#F0F2F5] px-2 md:px-4 py-2 flex items-center justify-center w-full fixed bottom-0 right-0 left-0 z-10 min-h-[60px] pb-[max(env(safe-area-inset-bottom),8px)]">
      <form onSubmit={handleSubmit} className="flex w-full max-w-3xl items-center gap-2">
        <div className="flex-1 bg-white rounded-3xl px-4 py-2.5 shadow-sm border border-gray-100 flex items-center">
            <input
                ref={inputRef}
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="اكتب رسالة..."
                className="flex-1 outline-none bg-transparent text-gray-800 text-base placeholder:text-gray-500 text-right"
                disabled={disabled}
                dir="auto"
            />
        </div>
        
        <button
            type="submit"
            disabled={!text.trim() || disabled}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-full transition-all duration-200 flex items-center justify-center shadow-md flex-shrink-0 ${
                text.trim() ? 'bg-[#008069] hover:bg-[#006f5b]' : 'bg-[#008069] hover:bg-[#006f5b]'
            }`}
        >
            {text.trim() ? (
                <Send size={20} className="text-white ml-0.5" /> 
            ) : (
                <Mic size={20} className="text-white" />
            )}
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
