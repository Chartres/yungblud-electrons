import React, { useState, useRef, useEffect } from 'react';
import { getTutorResponse } from '../services/geminiService';
import { Send, Sparkles } from 'lucide-react';

export const ChatTutor: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: "Oi! I'm Dom. Welcome to the Electron Underground. Confused about orbitals? Let's sort it out. Ask me anything!" }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const history = messages.map(m => `${m.role}: ${m.text}`);
    const response = await getTutorResponse(userMsg, history);

    setMessages(prev => [...prev, { role: 'bot', text: response }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[500px] border-2 border-yb-pink rounded-xl bg-black overflow-hidden shadow-[0_0_15px_rgba(255,0,127,0.3)]">
      {/* Header */}
      <div className="bg-yb-pink p-3 flex items-center justify-between">
        <h2 className="font-marker text-black text-xl">ASK DOM</h2>
        <Sparkles className="text-black animate-pulse" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[80%] p-3 rounded-lg font-mono text-sm ${
                msg.role === 'user' 
                  ? 'bg-white text-black rounded-tr-none skew-x-[-2deg]' 
                  : 'bg-yb-gray text-yb-pink border border-yb-pink rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-yb-gray text-yb-pink p-3 rounded-lg border border-yb-pink animate-pulse font-mono text-sm">
              Thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-yb-gray border-t border-yb-pink/30 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type here, mate..."
          className="flex-1 bg-black border border-gray-700 text-white p-2 font-mono focus:outline-none focus:border-yb-pink"
        />
        <button 
          onClick={handleSend}
          className="bg-yb-pink text-black p-2 hover:bg-white transition-colors font-bold"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};
