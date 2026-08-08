import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Download,
  FileText,
  User,
  Calendar,
  Scale
} from 'lucide-react';
import { CaseRecord, TranscriptSegment, EvidenceItem, JudgmentRecord } from '../../types';
import { exportCaseFilePDF } from '../../utils/pdfExport';

interface CaseSummaryPanelProps {
  caseRecord: CaseRecord;
  transcript: TranscriptSegment[];
  evidenceList: EvidenceItem[];
  judgment?: JudgmentRecord;
  onUpdateCaseRecord: (record: Partial<CaseRecord>) => void;
}

export const CaseSummaryPanel: React.FC<CaseSummaryPanelProps> = ({
  caseRecord,
  transcript,
  evidenceList,
  judgment,
  onUpdateCaseRecord
}) => {
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const handleGenerateAiSummary = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/gemini/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseRecord, transcript, evidence: evidenceList })
      });
      const data = await res.json();
      if (data.summary) {
        onUpdateCaseRecord({ aiSummary: data.summary });
      }
    } catch (err) {
      console.error('Failed to generate AI summary:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="bg-zinc-950 border border-amber-900/40 rounded-2xl p-6 text-amber-50 shadow-2xl space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-amber-900/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-950 text-amber-300 border border-amber-600/50 px-2.5 py-0.5 rounded text-xs font-bold font-mono">
              {caseRecord.caseNumber}
            </span>
            <span className="text-xs text-amber-400 font-serif font-bold uppercase tracking-wider">
              OFFICIAL CASE RECORD & SUMMARY
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-amber-100">{caseRecord.caseTitle}</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateAiSummary}
            disabled={isGeneratingAi}
            className="bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-purple-600/40 px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>{isGeneratingAi ? 'Synthesizing...' : 'Draft AI Summary'}</span>
          </button>

          <button
            onClick={() => exportCaseFilePDF(caseRecord, transcript, evidenceList, judgment)}
            className="bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold px-3.5 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Case File PDF</span>
          </button>
        </div>
      </div>

      {/* Case Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 text-xs font-serif">
        <div>
          <div className="text-zinc-500 uppercase font-mono text-[10px]">Courtroom</div>
          <div className="font-bold text-amber-200 mt-0.5">{caseRecord.courtroomName}</div>
        </div>

        <div>
          <div className="text-zinc-500 uppercase font-mono text-[10px]">Presiding Judge</div>
          <div className="font-bold text-amber-200 mt-0.5">{caseRecord.judgeName}</div>
        </div>

        <div>
          <div className="text-zinc-500 uppercase font-mono text-[10px]">Date</div>
          <div className="font-bold text-amber-200 mt-0.5">{caseRecord.date}</div>
        </div>

        <div>
          <div className="text-zinc-500 uppercase font-mono text-[10px]">Subject</div>
          <div className="font-bold text-amber-200 mt-0.5">{caseRecord.subject}</div>
        </div>
      </div>

      {/* Case Facts */}
      <div>
        <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-amber-400" /> I. FACTS OF THE CASE
        </h3>
        <p className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 text-sm font-serif leading-relaxed text-zinc-300">
          {caseRecord.facts}
        </p>
      </div>

      {/* Issues Framed */}
      <div>
        <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Scale className="w-4 h-4 text-amber-400" /> II. ISSUES FOR JUDICIAL DETERMINATION
        </h3>
        <div className="space-y-2">
          {caseRecord.issues.map((issue, idx) => (
            <div key={idx} className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-3 text-xs font-serif text-amber-100 flex gap-2">
              <span className="font-bold text-amber-400">{idx + 1}.</span>
              <span>{issue}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Draft Legal Summary (If generated) */}
      {caseRecord.aiSummary && (
        <div className="bg-purple-950/40 border border-purple-600/50 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
            <Sparkles className="w-4 h-4" /> AI-ASSISTED JUDICIAL CASE SUMMARY
          </div>
          <div className="text-xs font-serif leading-relaxed text-purple-100 whitespace-pre-wrap">
            {caseRecord.aiSummary}
          </div>
        </div>
      )}
    </div>
  );
};
