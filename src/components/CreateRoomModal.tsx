import React, { useState } from 'react';
import { Gavel, X, Sparkles } from 'lucide-react';
import { CaseRecord } from '../types';
import { sfx } from '../utils/sfx';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (caseRecord: Partial<CaseRecord>, hostName: string, hostRole: 'judge' | 'admin') => void;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  isOpen,
  onClose,
  onCreate
}) => {
  const [hostName, setHostName] = useState('Hon’ble Justice Dr. D.Y. Chandrachud (Retd.)');
  const [hostRole, setHostRole] = useState<'judge' | 'admin'>('judge');
  const [caseTitle, setCaseTitle] = useState('Akash Sankar & Ors. v. Union of India');
  const [courtroomName, setCourtroomName] = useState('Supreme Court of India — Courtroom No. 1');
  const [subject, setSubject] = useState('BNS Section 111, Article 19(1)(a) & Privacy Rights');
  const [facts, setFacts] = useState(
    'Special Leave Petition challenging state surveillance and prosecution under Section 111 of Bharatiya Nyaya Sanhita (BNS 2023) for digital speech on social media networks, alleging breach of Article 19(1)(a) and Article 21 rights.'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const caseRecord: Partial<CaseRecord> = {
      caseNumber: `SLP (Crl.) No. ${Math.floor(1000 + Math.random() * 9000)} / 2026`,
      caseTitle,
      courtroomName,
      judgeName: hostRole === 'judge' ? hostName : 'Hon’ble Supreme Court Bench',
      date: new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' }),
      subject,
      petitioner: 'Learned Senior Counsel Akash Sankar',
      respondent: 'Additional Solicitor General of India',
      caseType: 'Constitutional Criminal SLP',
      facts,
      issues: [
        'Whether Section 111 of BNS 2023 infringes Article 19(1)(a) speech protections.',
        'Whether BSA Section 61 electronic certificate standards were satisfied by state investigators.'
      ]
    };

    sfx.playGavel();
    onCreate(caseRecord, hostName, hostRole);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-modal rounded-2xl max-w-xl w-full p-6 text-slate-100 shadow-2xl relative border border-emerald-500/30">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-emerald-300 transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-900 text-amber-300 border border-emerald-500/50 flex items-center justify-center shadow-md">
            <Gavel className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-white">Create New Courtroom</h2>
            <p className="text-xs text-slate-300">Initialize Indian law moot case parameters for student advocates</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Host Role Choice: Judge vs Admin */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Creator / Host Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setHostRole('judge');
                  if (hostName.includes('Court Master') || hostName.includes('Registrar')) {
                    setHostName('Hon’ble Justice Dr. D.Y. Chandrachud (Retd.)');
                  }
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  hostRole === 'judge'
                    ? 'bg-emerald-600 text-slate-950 border-emerald-400 font-bold shadow-md'
                    : 'glass-card border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Gavel className="w-4 h-4 text-slate-950" />
                <span>Presiding Judge / Bench</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setHostRole('admin');
                  setHostName('Court Master & Registrar');
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  hostRole === 'admin'
                    ? 'bg-emerald-600 text-slate-950 border-emerald-400 font-bold shadow-md'
                    : 'glass-card border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Court Registrar / Admin</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              {hostRole === 'judge' ? 'Presiding Judge / Bench Name' : 'Court Administrator / Registrar Name'}
            </label>
            <input
              type="text"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm text-white font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Case Cause Title
            </label>
            <input
              type="text"
              value={caseTitle}
              onChange={(e) => setCaseTitle(e.target.value)}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm font-semibold text-emerald-300"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Courtroom Bench / Bench Name
              </label>
              <input
                type="text"
                value={courtroomName}
                onChange={(e) => setCourtroomName(e.target.value)}
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Subject & Laws
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Case Proposition & Facts
            </label>
            <textarea
              value={facts}
              onChange={(e) => setFacts(e.target.value)}
              rows={3}
              className="w-full glass-input rounded-xl p-3 text-sm text-slate-200"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 border border-emerald-400 hover:scale-[1.01] active:scale-[0.99]"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Initialize Courtroom & Generate Code</span>
          </button>
        </form>
      </div>
    </div>
  );
};
