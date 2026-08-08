import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Plus
} from 'lucide-react';
import { EvidenceItem, UserRole, AdvocateSubRole } from '../../types';

interface EvidenceManagerProps {
  evidenceList: EvidenceItem[];
  activeEvidenceId?: string;
  isJudge: boolean;
  userRole?: UserRole;
  userSubRole?: AdvocateSubRole;
  userName?: string;
  onPresent: (evidenceId: string) => void;
  onSubmitEvidence: (item: EvidenceItem) => void;
}

export const EvidenceManager: React.FC<EvidenceManagerProps> = ({
  evidenceList,
  activeEvidenceId,
  isJudge,
  userRole,
  userSubRole,
  userName = 'Counsel',
  onPresent,
  onSubmitEvidence
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [textContent, setTextContent] = useState('');

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const prefix = userSubRole === 'respondent' ? 'D' : 'P';
    const count = evidenceList.filter((e) => e.submittedByRole === (userSubRole || 'petitioner')).length + 1;
    const exhibitNumber = `EXHIBIT ${prefix}-${String(count).padStart(2, '0')}`;

    const newEvidence: EvidenceItem = {
      id: `exhibit-${Date.now()}`,
      exhibitNumber,
      title: title.trim(),
      submittedBy: userName,
      submittedByRole: userSubRole || 'petitioner',
      fileType: 'pdf',
      description: description.trim() || 'Document submitted during oral arguments.',
      textContent: textContent.trim(),
      status: 'admitted',
      uploadedAt: Date.now()
    };

    onSubmitEvidence(newEvidence);
    setTitle('');
    setDescription('');
    setTextContent('');
    setIsUploading(false);
  };

  return (
    <div className="bg-zinc-950 border border-amber-900/40 rounded-2xl p-5 text-amber-50 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-900/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-950 border border-amber-600/40 flex items-center justify-center text-amber-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-serif font-bold text-amber-100 uppercase tracking-wider">
              EVIDENCE & EXHIBITS
            </h3>
            <p className="text-[10px] text-zinc-400 font-mono">Case Document Docket</p>
          </div>
        </div>

        {!isUploading && (
          <button
            onClick={() => setIsUploading(true)}
            className="bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Submit Exhibit</span>
          </button>
        )}
      </div>

      {/* Exhibit Upload Form Modal/Inline */}
      {isUploading && (
        <form onSubmit={handleUploadSubmit} className="bg-zinc-900 border border-amber-900/40 p-3.5 rounded-xl space-y-3">
          <div className="text-xs font-bold text-amber-200">Submit New Evidence Exhibit</div>

          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Exhibit Title (e.g. Sworn Affidavit of Witness)"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-amber-100 focus:outline-none focus:border-amber-600"
              required
            />
          </div>

          <div>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description & relevance to case facts"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-amber-100 focus:outline-none focus:border-amber-600"
            />
          </div>

          <div>
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Document body text or excerpt content..."
              rows={3}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-amber-100 focus:outline-none focus:border-amber-600"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsUploading(false)}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold px-3 py-1.5 rounded text-xs"
            >
              Submit to Docket
            </button>
          </div>
        </form>
      )}

      {/* Exhibit List */}
      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {evidenceList.length === 0 ? (
          <div className="text-center py-8 text-zinc-500 text-xs italic font-serif">
            No exhibits have been submitted to the court record.
          </div>
        ) : (
          evidenceList.map((ex) => (
            <div
              key={ex.id}
              className={`p-3 rounded-xl border transition-all ${
                activeEvidenceId === ex.id
                  ? 'bg-amber-950/70 border-amber-500 shadow-lg'
                  : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-950 text-amber-300 border border-amber-600/50 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                    {ex.exhibitNumber}
                  </span>
                  <span className="font-bold text-xs text-amber-100">{ex.title}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onPresent(ex.id)}
                    className="bg-amber-900/60 hover:bg-amber-800 text-amber-200 border border-amber-600/40 px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Display</span>
                  </button>
                </div>
              </div>

              <p className="text-xs text-zinc-400 font-serif line-clamp-2">{ex.description}</p>

              <div className="mt-2 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                <span>Submitted by: {ex.submittedBy} ({ex.submittedByRole.toUpperCase()})</span>
                <span className="text-emerald-400 font-bold uppercase">{ex.status}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
