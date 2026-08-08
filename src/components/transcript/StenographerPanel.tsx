import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Search,
  Pause,
  Play,
  Download,
  Copy,
  Check,
  Edit2,
  Bookmark,
  Sparkles,
  Mic,
  Volume2
} from 'lucide-react';
import { TranscriptSegment, CaseRecord } from '../../types';
import { exportTranscriptPDF } from '../../utils/pdfExport';

interface StenographerPanelProps {
  transcript: TranscriptSegment[];
  caseRecord: CaseRecord;
  isListening: boolean;
  onToggleListening: () => void;
  onAddSegment: (text: string) => void;
}

export const StenographerPanel: React.FC<StenographerPanelProps> = ({
  transcript,
  caseRecord,
  isListening,
  onToggleListening,
  onAddSegment
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const [copied, setCopied] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [manualInput, setManualInput] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript, autoScroll]);

  const filteredTranscript = transcript.filter(
    (t) =>
      t.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.speakerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyTranscript = () => {
    const text = transcript
      .map((t) => `[${t.timestamp}] ${t.speakerName} (${t.speakerRole}): ${t.text}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onAddSegment(manualInput.trim());
      setManualInput('');
    }
  };

  return (
    <div className="bg-zinc-950 border border-amber-900/40 rounded-2xl p-5 text-amber-50 shadow-2xl flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-900/30 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-950 border border-amber-600/40 flex items-center justify-center text-amber-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-serif font-bold text-amber-100 uppercase tracking-wider flex items-center gap-2">
              LIVE STENOGRAPHY TRANSCRIPT
            </h3>
            <p className="text-[10px] text-zinc-400 font-mono">Court Reporter Records</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Live Speech Stenographer */}
          <button
            onClick={onToggleListening}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              isListening
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/50 animate-pulse'
                : 'bg-zinc-900 text-zinc-400 border border-zinc-700'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{isListening ? 'Stenographer Active' : 'Start Speech STT'}</span>
          </button>

          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`p-1.5 rounded-lg border transition-colors ${
              autoScroll ? 'bg-amber-950/80 border-amber-600/50 text-amber-300' : 'bg-zinc-900 border-zinc-700 text-zinc-400'
            }`}
            title={autoScroll ? 'Auto-scroll Enabled' : 'Auto-scroll Paused'}
          >
            {autoScroll ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={handleCopyTranscript}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-amber-200 transition-colors"
            title="Copy Text"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={() => exportTranscriptPDF(caseRecord, transcript)}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-amber-300 hover:bg-zinc-800 transition-colors"
            title="Export PDF"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="my-3 relative flex-shrink-0">
        <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search transcript by keyword or speaker name..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-amber-100 placeholder-zinc-500 focus:outline-none focus:border-amber-600"
        />
      </div>

      {/* Transcript List Scroll Box */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-amber-900/40"
      >
        {filteredTranscript.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 text-xs italic font-serif">
            No transcript records available yet. Spoken arguments will automatically appear here.
          </div>
        ) : (
          filteredTranscript.map((seg) => (
            <div
              key={seg.id}
              className={`p-3 rounded-xl border text-xs leading-relaxed transition-all ${
                seg.highlighted
                  ? 'bg-amber-950/60 border-amber-500/80 text-amber-100'
                  : !seg.isFinal
                  ? 'bg-zinc-900/40 border-zinc-800/50 text-zinc-400 italic'
                  : 'bg-zinc-900/80 border-zinc-800/80 text-zinc-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1 text-[11px] font-mono">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <span className="text-zinc-500">[{seg.timestamp}]</span>
                  <span>{seg.speakerName}</span>
                  <span className="text-[10px] text-amber-400/80 uppercase">
                    ({seg.speakerSubRole || seg.speakerRole})
                  </span>
                </span>

                {seg.confidence && (
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {Math.round(seg.confidence * 100)}% accuracy
                  </span>
                )}
              </div>

              <p className="font-serif text-sm">{seg.text}</p>
            </div>
          ))
        )}
      </div>

      {/* Manual Stenographer Text Entry */}
      <form onSubmit={handleManualSubmit} className="mt-3 pt-3 border-t border-amber-900/30 flex gap-2 flex-shrink-0">
        <input
          type="text"
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
          placeholder="Manual stenographer entry / court note..."
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-amber-100 focus:outline-none focus:border-amber-600"
        />
        <button
          type="submit"
          className="bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold px-4 py-2 rounded-lg text-xs transition-colors"
        >
          Add Record
        </button>
      </form>
    </div>
  );
};
