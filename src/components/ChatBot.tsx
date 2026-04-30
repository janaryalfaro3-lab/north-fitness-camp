import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Loader2, Dumbbell } from 'lucide-react';
import { chatWithGemini } from '../services/gemini';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hi! I'm Norfit, your North Fitness Camp assistant. 💪 How can I help you crush your fitness goals today? Kaya natin 'yan!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    'What are your programs?',
    'Meet the coaches',
    'Membership prices',
    'Personal Training rates'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string = input) => {
    const messageToSend = text.trim();
    if (!messageToSend || isLoading) return;

    const userMessage: Message = { role: 'user', content: messageToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const response = await chatWithGemini([...messages, userMessage]);
    
    setMessages(prev => [...prev, { role: 'model', content: response || "I'm not sure how to answer that. 💪" }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 w-[420px] max-w-[calc(100vw-2rem)] h-[650px] max-h-[calc(100vh-160px)] bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary p-6 flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center rotate-3 shadow-lg">
                  <Dumbbell className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-display font-bold uppercase tracking-tighter text-lg">Norfit AI</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-lime-400 rounded-full animate-pulse" />
                    <span className="text-[10px] text-white/70 font-bold uppercase tracking-widest">Always Active</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-2"
              >
                <X size={24} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 cyber-grid opacity-30 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white ml-auto rounded-tr-none shadow-lg shadow-primary/10' 
                      : 'bg-white/5 text-gray-200 mr-auto rounded-tl-none border border-white/10'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {messages.length === 1 && !isLoading && (
                <div className="pt-4 space-y-2">
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest ml-1 mb-3">Suggested Topics:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedPrompts.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(prompt)}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-400 hover:border-primary hover:text-primary transition-all text-left"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 text-gray-400 p-4 rounded-2xl rounded-tl-none border border-white/10 flex items-center gap-2">
                    <Loader2 className="animate-spin" size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest">Nag-iisip...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-black/40 border-t border-white/5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about fitness..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors placeholder:text-gray-600"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim()}
                  className="bg-primary text-white p-3 rounded-xl hover:bg-white hover:text-primary transition-all shadow-lg hover:shadow-primary/20 disabled:opacity-50"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(255,0,0,0.4)] hover:shadow-[0_0_50px_rgba(255,0,0,0.6)] transition-all transform hover:-translate-y-2 group"
      >
        {isOpen ? <X size={28} /> : <Dumbbell size={28} className="group-hover:rotate-[15deg] transition-transform" />}
      </button>
    </div>
  );
};
