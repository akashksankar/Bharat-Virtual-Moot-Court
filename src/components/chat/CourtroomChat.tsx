import React, { useState } from 'react';
import { MessageSquare, Send, Hash, Shield, Lock } from 'lucide-react';
import { RoomMessage, UserRole } from '../../types';

interface CourtroomChatProps {
  messages: RoomMessage[];
  currentUserId: string;
  currentUserName: string;
  currentUserRole: UserRole;
  onSendMessage: (msg: RoomMessage) => void;
}

export const CourtroomChat: React.FC<CourtroomChatProps> = ({
  messages,
  currentUserId,
  currentUserName,
  currentUserRole,
  onSendMessage
}) => {
  const [activeChannel, setActiveChannel] = useState<'courtroom' | 'judge-advocate' | 'admin' | 'evidence'>('courtroom');
  const [inputText, setInputText] = useState('');

  const filteredMessages = messages.filter((m) => m.channel === activeChannel);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const msg: RoomMessage = {
      id: `msg-${Date.now()}`,
      channel: activeChannel,
      senderId: currentUserId,
      senderName: currentUserName,
      senderRole: currentUserRole,
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    };

    onSendMessage(msg);
    setInputText('');
  };

  return (
    <div className="bg-zinc-950 border border-amber-900/40 rounded-2xl p-4 text-amber-50 shadow-2xl flex flex-col h-[500px]">
      {/* Channels Bar */}
      <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl mb-3 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveChannel('courtroom')}
          className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-all ${
            activeChannel === 'courtroom' ? 'bg-amber-950 text-amber-300 border border-amber-600/50' : 'text-zinc-400 hover:text-amber-200'
          }`}
        >
          <Hash className="w-3.5 h-3.5" /> courtroom
        </button>

        <button
          onClick={() => setActiveChannel('judge-advocate')}
          className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-all ${
            activeChannel === 'judge-advocate' ? 'bg-amber-950 text-amber-300 border border-amber-600/50' : 'text-zinc-400 hover:text-amber-200'
          }`}
        >
          <Lock className="w-3.5 h-3.5" /> judge-advocate
        </button>

        <button
          onClick={() => setActiveChannel('evidence')}
          className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-all ${
            activeChannel === 'evidence' ? 'bg-amber-950 text-amber-300 border border-amber-600/50' : 'text-zinc-400 hover:text-amber-200'
          }`}
        >
          <Hash className="w-3.5 h-3.5" /> evidence
        </button>

        <button
          onClick={() => setActiveChannel('admin')}
          className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-all ${
            activeChannel === 'admin' ? 'bg-amber-950 text-amber-300 border border-amber-600/50' : 'text-zinc-400 hover:text-amber-200'
          }`}
        >
          <Shield className="w-3.5 h-3.5" /> admin
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 font-serif text-xs">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 italic text-[11px]">
            No messages posted in #{activeChannel}.
          </div>
        ) : (
          filteredMessages.map((m) => (
            <div key={m.id} className="bg-zinc-900/80 border border-zinc-800 p-2.5 rounded-xl">
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span className="font-bold text-amber-300">
                  {m.senderName} ({m.senderRole.toUpperCase()})
                </span>
                <span className="text-zinc-500">{m.timestamp}</span>
              </div>
              <p className="text-zinc-200">{m.text}</p>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="mt-3 pt-3 border-t border-amber-900/30 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Message #${activeChannel}...`}
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-amber-100 focus:outline-none focus:border-amber-600 font-serif"
        />
        <button
          type="submit"
          className="bg-amber-600 hover:bg-amber-500 text-zinc-950 p-2 rounded-lg transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
