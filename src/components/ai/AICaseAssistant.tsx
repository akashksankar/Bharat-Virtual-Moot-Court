import React, { useState } from 'react';
import { Bot, Send, Sparkles, X, RefreshCw } from 'lucide-react';
import { CaseRecord, TranscriptSegment } from '../../types';

interface AICaseAssistantProps {
  caseRecord: CaseRecord;
  transcript: TranscriptSegment[];
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
}

export const AICaseAssistant: React.FC<AICaseAssistantProps> = ({
  caseRecord,
  transcript,
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: `Greetings, Presiding Judge. I am your AI Law Clerk. I am tracking the live transcript for "${caseRecord.caseTitle}". Ask me to summarize arguments, extract precedent citations, or check unanswered bench questions.`
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const q = (queryText || inputQuery).trim();
    if (!q || loading) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, sender: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, caseRecord, transcript })
      });
      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: data.answer || 'No response generated.'
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('AI Assistant Error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text: 'Error contacting AI Law Clerk service.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (p: string) => {
    handleSend(p);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-zinc-950 border-l border-amber-900/40 p-5 text-amber-50 shadow-2xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-900/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-600/50 flex items-center justify-center text-purple-300">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-serif font-bold text-amber-100 uppercase tracking-wider flex items-center gap-1.5">
              AI LAW CLERK <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            </h3>
            <p className="text-[10px] text-purple-300/80 font-mono">Judicial Assistant & Analysis</p>
          </div>
        </div>

        <button onClick={onClose} className="text-zinc-400 hover:text-amber-200 p-1">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Prompt Chips */}
      <div className="my-3 flex flex-wrap gap-1.5 text-[11px]">
        <button
          onClick={() => handleQuickPrompt("Summarize Petitioner Counsel's core constitutional argument.")}
          className="bg-purple-950/60 hover:bg-purple-900 text-purple-200 border border-purple-700/50 px-2.5 py-1 rounded-full"
        >
          Summarize Petitioner
        </button>

        <button
          onClick={() => handleQuickPrompt("What legal authorities and case precedents have been cited in the transcript?")}
          className="bg-purple-950/60 hover:bg-purple-900 text-purple-200 border border-purple-700/50 px-2.5 py-1 rounded-full"
        >
          Check Precedents
        </button>

        <button
          onClick={() => handleQuickPrompt("List all objections raised and rulings issued.")}
          className="bg-purple-950/60 hover:bg-purple-900 text-purple-200 border border-purple-700/50 px-2.5 py-1 rounded-full"
        >
          List Objections
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-3 rounded-xl border leading-relaxed font-serif ${
              m.sender === 'user'
                ? 'bg-amber-950/80 border-amber-600/50 text-amber-100 ml-6'
                : 'bg-zinc-900 border-zinc-800 text-zinc-200 mr-4'
            }`}
          >
            <div className="text-[10px] font-mono text-purple-300 uppercase mb-1 font-bold">
              {m.sender === 'user' ? 'Judge Inquiry' : 'AI Law Clerk (Academic Analysis)'}
            </div>
            <p className="whitespace-pre-wrap">{m.text}</p>
          </div>
        ))}

        {loading && (
          <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-xs text-purple-300 font-mono animate-pulse flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Analyzing hearing transcript...
          </div>
        )}
      </div>

      {/* Query Input */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="mt-3 pt-3 border-t border-amber-900/30 flex gap-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask AI Law Clerk a case question..."
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-amber-100 focus:outline-none focus:border-purple-500 font-serif"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-purple-700 hover:bg-purple-600 text-white p-2 rounded-lg transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
