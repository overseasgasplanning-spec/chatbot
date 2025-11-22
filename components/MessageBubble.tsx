import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { COLORS } from '../constants';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  // RTL Logic:
  // User (Me) -> Floats Right (start of container in RTL flex? No, User aligns Right)
  // Bot -> Floats Left
  
  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`relative max-w-[85%] sm:max-w-[70%] px-4 py-2 rounded-lg shadow-sm text-sm md:text-base leading-relaxed break-words ${
          isUser ? 'rounded-tr-none' : 'rounded-tl-none'
        }`}
        style={{
          backgroundColor: isUser ? COLORS.userBubble : COLORS.botBubble,
          color: '#111b21', // Dark gray text
        }}
      >
        {/* Tail SVG */}
        <div className={`absolute top-0 ${isUser ? '-right-2' : '-left-2'} w-3 h-3 overflow-hidden`}>
           {/* 
             In RTL:
             User (Right side): Tail points right.
             Bot (Left side): Tail points left.
           */}
           {isUser ? (
             <svg viewBox="0 0 10 10" className="w-full h-full fill-[#D9FDD3]">
                <path d="M0 0 L10 0 L0 10 Z" />
             </svg>
           ) : (
             <svg viewBox="0 0 10 10" className="w-full h-full fill-white">
                <path d="M0 0 L10 0 L10 10 Z" />
             </svg>
           )}
        </div>

        {/* Content */}
        <div className="markdown-body">
            {isUser ? (
                <p className="whitespace-pre-wrap">{message.text}</p>
            ) : (
                <ReactMarkdown 
                    components={{
                        ul: ({node, ...props}) => <ul className="list-disc list-inside my-1" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal list-inside my-1" {...props} />,
                        li: ({node, ...props}) => <li className="mb-1" {...props} />,
                        strong: ({node, ...props}) => <span className="font-bold" {...props} />,
                        p: ({node, ...props}) => <p className="mb-1 last:mb-0" {...props} />
                    }}
                >
                    {message.text}
                </ReactMarkdown>
            )}
        </div>

        {/* Timestamp */}
        <div className={`text-[10px] text-gray-500 mt-1 flex ${isUser ? 'justify-end' : 'justify-start'} items-center gap-1 select-none`}>
            {message.timestamp}
            {isUser && (
                // Simple checkmark simulation
                <span className="text-blue-400">✓✓</span>
            )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;