
import React from 'react';
import { Trash2 } from 'lucide-react';

interface ChatHeaderProps {
  onClear: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClear }) => {
  // Embedded SVG for Overseas Gas Logo (Blue Text + Orange Flame/Gas)
  const logoSvg = `data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 80' fill='none'%3E%3Cpath d='M158.5 25 C158.5 25 150 35 150 45 C150 55 158 60 158 60 C158 60 166 55 166 45 C166 35 158.5 25 158.5 25 Z' fill='%23f15a24'/%3E%3Ctext x='10' y='55' font-family='Arial, sans-serif' font-weight='900' font-size='42' fill='%230071bd' letter-spacing='-1'%3EOverseas%3C/text%3E%3Ctext x='150' y='55' font-family='Arial, sans-serif' font-weight='900' font-size='42' fill='%23f15a24' letter-spacing='-1'%3Egas%3C/text%3E%3Cpath d='M160 15 Q150 30 152 45' stroke='%23f15a24' stroke-width='3' fill='none'/%3E%3C/svg%3E`;

  return (
    <header className="bg-[#008069] h-[72px] px-4 flex items-center justify-between shadow-md fixed top-0 w-full z-20 text-white transition-all duration-300">
      <div className="flex items-center gap-3">
        {/* Avatar / Logo Container - Enlarged */}
        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center overflow-hidden p-1 shadow-sm border border-white/20">
            <img 
                src={logoSvg}
                alt="Overseas Gas Logo" 
                className="w-full h-full object-contain transform scale-110"
            />
        </div>
        
        {/* Info */}
        <div className="flex flex-col justify-center">
          <h1 className="font-bold text-lg leading-tight text-white">Ai Agent Planning Department</h1>
          <span className="text-[12px] text-green-100 opacity-90 leading-tight">متاح الآن</span>
        </div>
      </div>

      {/* Actions - Only Functional Ones */}
      <div className="flex items-center gap-2">
        <button 
            onClick={onClear}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
            title="مسح المحادثة"
        >
          <Trash2 size={22} />
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;
