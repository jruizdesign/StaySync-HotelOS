import React, { useState, useRef, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Loader2,
  ChevronDown,
  Bot,
  User,
  Wrench,
  AlertTriangle,
  ClipboardList
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { toolDefinitions, executeTool } from '../lib/ai-tools';

const SYSTEM_PROMPT = `You are StaySync AI, the elite operational concierge for hotel staff.
Your goal is to assist with real-time property management.

You have access to REAL-TIME tools to fetch data. ALWAYS use these tools when asked about:
- Occupancy, revenue, or room stats (use get_property_stats)
- Guests owing money or arrears (use list_guests_with_arrears)
- Room status updates (use check_room_status)

If the user asks about maintenance or other actions you can't perform yet, explain what you WOULD do if you had the tool, or guide them to the UI.
Be concise, professional, and data-driven.
If you need the Property ID and it wasn't provided, ask for it, but usually it is injected.`;

const AIChat: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string, type?: 'tool_log' }[]>([
    { role: 'model', text: "StableSync Operational Concierge online. Accessing property data streams..." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    // Optimistically update UI
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

      // Build conversation history for the API
      // Filter out tool logs which are UI only
      const validHistory = messages
        .filter(m => m.type !== 'tool_log')
        .map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

      // Add the new user message
      let currentContents = [
        ...validHistory,
        { role: 'user', parts: [{ text: userMessage }] }
      ];

      // Initial Call
      let response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: currentContents,
        config: {
          systemInstruction: SYSTEM_PROMPT + (propertyId ? `\nActive Property ID: ${propertyId}` : ''),
          tools: [{ functionDeclarations: toolDefinitions }]
        }
      });

      // Handle function calls loop
      let part = response.candidates?.[0]?.content?.parts?.[0] as any;

      while (part?.functionCall) {
        const { name, args } = part.functionCall;

        // UI Feedback
        setMessages(prev => [...prev, { role: 'model', text: `Executing: ${name}...`, type: 'tool_log' }]);

        // Inject propertyId
        const toolArgs = { ...args, propertyId: args.propertyId || propertyId };

        // Execute
        const toolResult = await executeTool(name, toolArgs);

        // Append interaction to history (Model Call + Function Response)
        // 1. Model's Function Call
        currentContents.push({
          role: 'model',
          parts: [{ functionCall: { name, args } } as any]
        });

        // 2. The Result
        currentContents.push({
          role: 'tool', // SDK v0.1+ uses 'tool' or 'function' depending on version. @google/genai uses 'tool' role usually.
          parts: [{
            functionResponse: {
              name: name,
              response: { result: toolResult } // SDK expects wrapped response usually
            }
          } as any]
        });

        // Call AI again with updated history
        response = await ai.models.generateContent({
          model: 'gemini-2.0-flash-exp',
          contents: currentContents,
          config: {
            systemInstruction: SYSTEM_PROMPT + (propertyId ? `\nActive Property ID: ${propertyId}` : ''),
            tools: [{ functionDeclarations: toolDefinitions }]
          }
        });

        part = response.candidates?.[0]?.content?.parts?.[0] as any;
      }

      // Final Text Response
      const aiText = part?.text || "Operation complete.";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);

    } catch (error: any) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: `System Error: ${error.message || 'Connection interrupted.'}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!propertyId && !isOpen) return null; // Only show on dashboard pages logically, or let it handle global

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end print:hidden">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-96 h-[600px] bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-300">
          {/* Header */}
          <div className="p-5 bg-slate-900 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Concierge AI</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{propertyId ? 'Live Data Connected' : 'System Ready'}</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${m.type === 'tool_log'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 font-mono text-xs py-2'
                  : m.role === 'user'
                    ? 'bg-blue-600 text-white shadow-md rounded-tr-none'
                    : 'bg-white border border-slate-200 text-slate-700 shadow-sm rounded-tl-none'
                  }`}>

                  {m.type === 'tool_log' && <Wrench size={12} className="inline mr-2 mb-0.5" />}
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-blue-600" />
                  <span className="text-xs text-slate-400 font-medium">Processing request...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-slate-100 shrink-0 mb-safe">
            <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-2xl">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about occupancy, pending bills..."
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
            <span className="font-bold text-sm hidden md:block">Concierge</span>
            <span className="font-bold text-sm md:hidden"><Bot size={24} /></span>
          </>
        )}
      </button>
    </div>
  );
};

export default AIChat;
