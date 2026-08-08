import React, { useState } from 'react';
import {
  FileText,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Search,
  Check
} from 'lucide-react';
import { EvidenceItem } from '../../types';

interface DocumentViewerProps {
  evidence: EvidenceItem | null;
  onClose?: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ evidence, onClose }) => {
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 8;
  const [searchTerm, setSearchTerm] = useState('');

  if (!evidence) {
    return (
      <div className="bg-zinc-950 border border-amber-900/40 rounded-2xl p-8 text-center text-zinc-500 font-serif text-sm">
        <FileText className="w-12 h-12 mx-auto mb-2 text-amber-600/30" />
        No exhibit selected for presentation display.
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 border border-amber-900/40 rounded-2xl p-5 text-amber-50 shadow-2xl flex flex-col h-[580px]">
      {/* Top Viewer Control Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-900/30 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-950 text-amber-300 border border-amber-600/50 px-2 py-0.5 rounded text-xs font-bold font-mono">
              {evidence.exhibitNumber}
            </span>
            <h3 className="text-sm font-serif font-bold text-amber-100">{evidence.title}</h3>
          </div>
          <p className="text-[10px] text-zinc-400 mt-0.5">
            Submitted by: <span className="text-amber-200">{evidence.submittedBy}</span> ({evidence.submittedByRole.toUpperCase()})
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setZoom(Math.max(60, zoom - 15))}
              className="p-1 hover:text-amber-300 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] text-zinc-300">{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(200, zoom + 15))}
              className="p-1 hover:text-amber-300 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Page Navigation */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="p-1 hover:text-amber-300 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] text-zinc-300">
              Page {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              className="p-1 hover:text-amber-300 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {onClose && (
            <button onClick={onClose} className="text-zinc-400 hover:text-amber-200 p-1">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Document Content Paper Canvas */}
      <div className="flex-1 overflow-auto p-4 my-3 bg-zinc-900/50 rounded-xl border border-zinc-800 flex justify-center scrollbar-thin">
        <div
          className="bg-amber-50 text-zinc-900 p-8 rounded-sm shadow-2xl transition-all font-serif max-w-2xl w-full text-xs leading-relaxed space-y-4"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
        >
          <div className="border-b-2 border-zinc-900 pb-2 flex justify-between items-center text-[11px] font-bold tracking-widest uppercase">
            <span>OFFICIAL COURT EXHIBIT NO. {evidence.exhibitNumber}</span>
            <span>PAGE {currentPage} OF {totalPages}</span>
          </div>

          <div className="text-center font-bold text-base uppercase text-zinc-900 my-2">
            {evidence.title}
          </div>

          <div className="whitespace-pre-wrap font-serif text-sm leading-relaxed text-zinc-800">
            {evidence.textContent ||
              `IN THE VIRTUAL COURTROOM
IN RE: MOOT COURT CASE PROCEEDINGS

SUBMITTED EVIDENCE EXHIBIT DOCUMENT

1. STATEMENT OF AUTHENTICITY:
The document hereby presented under Exhibit ${evidence.exhibitNumber} represents authentic documentary proof in support of the party's arguments.

2. EVIDENTIARY RECORD SUMMARY:
${evidence.description}

3. SPECIFIC STATUTORY / FACTUAL RATIONALE:
Under applicable evidentiary rules, this exhibit demonstrates direct material relevance to the constitutional issues framed for judicial determination in Page ${currentPage} of the record.`}
          </div>

          <div className="pt-6 border-t border-zinc-300 text-[10px] text-zinc-500 font-mono flex justify-between">
            <span>FILED IN COURTROOM RECORD</span>
            <span>VERIFIED BY CLERK</span>
          </div>
        </div>
      </div>
    </div>
  );
};
