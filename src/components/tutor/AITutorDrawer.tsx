import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  BookOpen,
  Send,
  X,
  Compass,
} from 'lucide-react';
import { useLearningPath } from '../../context/LearningPathContext';

export const AITutorDrawer: React.FC = () => {
  const {
    isTutorOpen,
    setIsTutorOpen,
    chatMessages,
    sendChatMessage,
    isChatLoading,
    profile,
  } = useLearningPath();

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Why is Statistics prioritized before ML modeling?',
    'Explain Gini Impurity vs Entropy in simple terms',
    'How do I balance 2 hours/day for this goal?',
    'Recommend a starting dataset for my churn project',
  ];

  useEffect(() => {
    if (isTutorOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isTutorOpen]);

  if (!isTutorOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputVal;
    if (!query.trim() || isChatLoading) return;
    setInputVal('');
    await sendChatMessage(query);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white border-l border-[#E3DED3] shadow-xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4.5 border-b border-[#E3DED3] flex items-center justify-between bg-[#F7F5EF]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#315C43] text-white flex items-center justify-center">
            <Compass className="w-4 h-4 text-[#F1E9DA]" />
          </div>
          <div>
            <span className="text-sm font-serif font-bold text-[#262626]">Mentora Guide</span>
            <p className="text-[11px] text-[#6E6E68]">Learning Companion · {profile.targetRole}</p>
          </div>
        </div>

        <button
          onClick={() => setIsTutorOpen(false)}
          className="text-[#6E6E68] hover:text-[#262626] p-1.5 rounded-lg hover:bg-[#F1E9DA]/50 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#F7F5EF]/60">
        {chatMessages.map(msg => {
          const isGuide = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isGuide ? '' : 'flex-row-reverse'}`}
            >
              {isGuide && (
                <div className="w-7 h-7 rounded-lg bg-[#E6EEE5] border border-[#D3E0D2] flex items-center justify-center text-[#315C43] shrink-0 mt-0.5">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  isGuide
                    ? 'bg-white border border-[#E3DED3] text-[#262626] shadow-2xs'
                    : 'bg-[#315C43] text-white shadow-2xs'
                }`}
              >
                <div className="markdown-body prose prose-xs text-inherit">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
                <span
                  className={`text-[10px] mt-1.5 block ${
                    isGuide ? 'text-[#8E8D88]' : 'text-[#E6EEE5] text-right'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isChatLoading && (
          <div className="flex items-center gap-2 text-xs text-[#315C43] italic bg-white p-3 rounded-xl border border-[#E3DED3] shadow-2xs">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-[#315C43] border-t-transparent animate-spin" />
            <span>Finding the best guidance for you...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Inquiries */}
      <div className="p-3.5 border-t border-[#E3DED3] bg-white space-y-2">
        <div className="text-[11px] font-serif uppercase tracking-wider text-[#6E6E68] font-semibold px-1">
          Questions you might ask
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map(prompt => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="text-left text-[11px] px-2.5 py-1 rounded-lg bg-[#F7F5EF] hover:bg-[#F1E9DA]/60 border border-[#E3DED3] text-[#262626] transition-colors truncate max-w-full cursor-pointer shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-3.5 border-t border-[#E3DED3] bg-[#F7F5EF]">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask about a concept, project, or schedule..."
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            disabled={isChatLoading}
            className="flex-1 bg-white text-xs text-[#262626] placeholder-[#8E8D88] rounded-xl px-3.5 py-2.5 border border-[#E3DED3] focus:outline-none focus:border-[#315C43] shadow-2xs"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isChatLoading}
            className="p-2.5 rounded-xl bg-[#315C43] hover:bg-[#264935] disabled:opacity-40 text-white transition-all shadow-2xs cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

