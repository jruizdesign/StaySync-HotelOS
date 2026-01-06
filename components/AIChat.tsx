
import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Loader2,
  ChevronDown,
  Bot,
  User,
  RefreshCw
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const SYSTEM_PROMPT = `You are Lumina AI, the elite concierge and operational advisor for Lumina HMS (Hotel Management System). 
Your personality is professional, highly efficient, and encouraging.
You have expertise in:
1. Revenue Management (RevPAR, ADR optimization)
2. Guest Relations (VIP handling, DNR protocols)
3. Staff Efficiency (Shift optimization, break tracking)
4. Multi-tenant property operations.

When users ask questions, provide actionable insights specific to hotel management. If they ask about features, mention things like the DNR Sentinel, the Automated Billing Vault, or the Staff Tracker.`;

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: "Welcome to Lumina Intelligence. I'm your operational concierge. How can I help you optimize your property today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [
          ...messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.7,
        }
      });

      const aiText = response.text || "I'm having trouble connecting to the Lumina neural network. Please try again.";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Operational error detected. Please verify your system connectivity." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-96 h-[550px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-300">
          {/* Header */}
          <div className="p-6 bg-slate-900 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Lumina Concierge</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Intelligence</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${m.role === 'user'
                    ? 'bg-blue-600 text-white shadow-md rounded-tr-none'
                    : 'bg-white border border-slate-200 text-slate-700 shadow-sm rounded-tl-none'
                  }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-blue-600" />
                  <span className="text-xs text-slate-400 font-medium">Lumina is thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-6 bg-white border-t border-slate-100 shrink-0">
            <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-2xl">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Lumina anything..."
                className="flex-1 bg-transparent border-none outline-none px-3 text-sm font-medium text-slate-700 placeholder:text-slate-400"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="p-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex items-center gap-3 px-6 py-4 rounded-[2rem] shadow-2xl transition-all duration-300 active:scale-90 ${isOpen ? 'bg-slate-900 text-white w-16 h-16' : 'bg-blue-600 text-white'
          }`}
      >
        <div className="absolute inset-0 rounded-[2rem] bg-blue-400/20 animate-ping group-hover:block hidden"></div>
        {isOpen ? (
          <ChevronDown size={28} className="mx-auto" />
        ) : (
          <>
            <MessageSquare size={24} />
            <span className="font-bold text-sm">Lumina Concierge</span>
          </>
        )}
      </button>
    </div>
  );
};

export default AIChat;
