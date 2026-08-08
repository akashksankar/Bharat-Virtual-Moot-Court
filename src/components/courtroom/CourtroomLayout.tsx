import React from 'react';
import { Gavel, Users, FileText, Sparkles, Scale, Shield } from 'lucide-react';
import { Participant, EvidenceItem, CourtroomState } from '../../types';
import { ParticipantCard } from './ParticipantCard';

interface CourtroomLayoutProps {
  participants: Participant[];
  peerStreams: Record<string, MediaStream>;
  activeEvidence?: EvidenceItem;
  state?: CourtroomState;
  onSelectEvidence?: () => void;
}

export const CourtroomLayout: React.FC<CourtroomLayoutProps> = ({
  participants = [],
  peerStreams = {},
  activeEvidence,
  state = 'COURT_OPEN',
  onSelectEvidence
}) => {
  // Categorize participants by courtroom position
  const judges = participants.filter((p) => p.role === 'judge');
  const petitioners = participants.filter(
    (p) => p.role === 'advocate' && p.subRole === 'petitioner'
  );
  const respondents = participants.filter(
    (p) => p.role === 'advocate' && p.subRole === 'respondent'
  );
  const admins = participants.filter((p) => p.role === 'admin');
  const spectators = participants.filter((p) => p.role === 'spectator');

  const activeSpeaker = participants.find((p) => p.isSpeaking);

  return (
    <div className="relative w-full aurora-white-card rounded-2xl border border-slate-200/90 p-4 sm:p-6 overflow-hidden shadow-xl text-slate-900">
      {/* Background Architectural Courtroom Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none"></div>

      {/* State Status Banner Top */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-white/80 border border-slate-200/90 rounded-xl px-4 py-2.5 backdrop-blur-md shadow-xs">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-emerald-700" />
          <span className="text-xs font-serif font-bold tracking-wider text-slate-800 uppercase">
            COURT ARCHITECTURE — SIMULATED PROCEEDINGS
          </span>
        </div>

        <div className="text-xs font-mono text-emerald-900 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-full flex items-center gap-2 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          STATE: <span className="font-bold">{(state || 'COURT_OPEN').replace(/_/g, ' ')}</span>
        </div>
      </div>

      {/* 1. ELEVATED JUDGE'S BENCH (TOP CENTER) */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="bg-gradient-to-b from-emerald-50/80 via-white to-slate-50 border-2 border-emerald-300/90 rounded-2xl p-3 shadow-md relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-700 text-white border border-emerald-500 px-4 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-md">
            <Gavel className="w-3.5 h-3.5 text-amber-300" /> Presiding Judicial Bench
          </div>

          <div className="mt-2 grid grid-cols-1 sm:grid-cols-1 gap-3">
            {judges.length === 0 ? (
              <div className="h-36 bg-slate-50/80 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500 text-xs">
                <Gavel className="w-8 h-8 mb-1 text-slate-400" />
                <span>Waiting for Presiding Judge / Professor to take the bench...</span>
              </div>
            ) : (
              judges.map((j) => (
                <ParticipantCard
                  key={j.id}
                  participant={j}
                  stream={peerStreams[j.id]}
                  isJudgeBench
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* 2. MIDDLE COURT FLOOR: ADVOCATE BENCHES & PODIUM / EVIDENCE DISPLAY */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8 items-start">
        {/* Left Bench: Petitioner / Plaintiff Counsel */}
        <div className="md:col-span-4 aurora-white-panel border border-blue-200/90 rounded-2xl p-3 shadow-sm">
          <div className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2 pb-1 border-b border-blue-200 flex justify-between items-center">
            <span>Petitioner Counsel Bench</span>
            <span className="text-[10px] text-blue-600 font-mono">({petitioners.length})</span>
          </div>

          <div className="space-y-3">
            {petitioners.length === 0 ? (
              <div className="h-32 bg-blue-50/30 rounded-xl border border-dashed border-blue-200 flex items-center justify-center text-slate-400 text-xs">
                No Petitioner Counsel present
              </div>
            ) : (
              petitioners.map((p) => (
                <ParticipantCard
                  key={p.id}
                  participant={p}
                  stream={peerStreams[p.id]}
                />
              ))
            )}
          </div>
        </div>

        {/* Center Podium: Active Speaker Floor & Evidence Presentation Box */}
        <div className="md:col-span-4 aurora-white-panel border border-emerald-200/90 rounded-2xl p-3 shadow-sm text-center flex flex-col min-h-[220px] justify-between">
          <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2 pb-1 border-b border-emerald-200 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Court Floor & Podium
          </div>

          {/* Active Speaker Spotlight */}
          {activeSpeaker ? (
            <div className="mb-3">
              <div className="text-[11px] text-slate-500 mb-1 font-semibold">CURRENTLY ADDRESSING THE BENCH:</div>
              <ParticipantCard
                participant={activeSpeaker}
                stream={peerStreams[activeSpeaker.id]}
                isCourtFloor
              />
            </div>
          ) : (
            <div className="py-4 text-xs text-slate-500 font-serif italic">
              Floor open — Awaiting active speaker argument
            </div>
          )}

          {/* Active Evidence Display Box */}
          <div
            onClick={onSelectEvidence}
            className="cursor-pointer bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-2.5 transition-all text-left shadow-xs"
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-emerald-800 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-emerald-600" /> Active Exhibit
              </span>
              <span className="text-[10px] text-emerald-700 hover:underline font-semibold">View All &rarr;</span>
            </div>
            {activeEvidence ? (
              <div>
                <div className="text-xs font-bold text-slate-900">{activeEvidence.exhibitNumber}: {activeEvidence.title}</div>
                <div className="text-[10px] text-slate-500 truncate">{activeEvidence.description}</div>
              </div>
            ) : (
              <div className="text-[11px] text-slate-400 italic">No exhibit currently displayed</div>
            )}
          </div>
        </div>

        {/* Right Bench: Respondent / Defense Counsel */}
        <div className="md:col-span-4 aurora-white-panel border border-indigo-200/90 rounded-2xl p-3 shadow-sm">
          <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2 pb-1 border-b border-indigo-200 flex justify-between items-center">
            <span>Respondent Counsel Bench</span>
            <span className="text-[10px] text-indigo-600 font-mono">({respondents.length})</span>
          </div>

          <div className="space-y-3">
            {respondents.length === 0 ? (
              <div className="h-32 bg-indigo-50/30 rounded-xl border border-dashed border-indigo-200 flex items-center justify-center text-slate-400 text-xs">
                No Respondent Counsel present
              </div>
            ) : (
              respondents.map((p) => (
                <ParticipantCard
                  key={p.id}
                  participant={p}
                  stream={peerStreams[p.id]}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM GALLERY: ADMIN & SPECTATORS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Court Admin / Clerk Box */}
        <div className="md:col-span-4 aurora-white-panel border border-purple-200/90 rounded-2xl p-3">
          <div className="text-xs font-bold text-purple-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-purple-600" /> Court Clerk / Admin
          </div>
          {admins.length === 0 ? (
            <div className="text-[11px] text-slate-400 italic">No dedicated clerk assigned</div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {admins.map((a) => (
                <ParticipantCard key={a.id} participant={a} stream={peerStreams[a.id]} />
              ))}
            </div>
          )}
        </div>

        {/* Spectator Gallery */}
        <div className="md:col-span-8 aurora-white-panel border border-slate-200/90 rounded-2xl p-3">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-600" /> Spectator Gallery
            </span>
            <span className="text-[10px] text-slate-500">Read-Only Attendees ({spectators.length})</span>
          </div>

          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
            {spectators.length === 0 ? (
              <div className="text-[11px] text-slate-400 italic">No spectators currently in the gallery</div>
            ) : (
              spectators.map((s) => (
                <div
                  key={s.id}
                  className="bg-white border border-slate-200 px-2.5 py-1 rounded-full text-xs text-slate-800 font-medium flex items-center gap-1.5 shadow-xs"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>{s.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
