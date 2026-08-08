import React from 'react';
import {
  Gavel,
  Shield,
  UserCheck,
  Clock,
  FileText,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Copy,
  Check,
  LogOut,
  Bot,
  BarChart2,
  BookOpen,
  Scale,
  Sparkles
} from 'lucide-react';
import { CourtroomState, UserRole, AdvocateSubRole, Participant } from '../types';
import { sfx } from '../utils/sfx';

interface NavbarProps {
  roomCode?: string;
  state?: CourtroomState;
  currentUser?: Participant | null;
  onLeave?: () => void;
  onOpenCaseRecord?: () => void;
  onOpenStenographer?: () => void;
  onOpenAssistant?: () => void;
  onOpenAnalytics?: () => void;
  onOpenJoin?: () => void;
  onOpenCreate?: () => void;
  onOpenPractice?: () => void;
  onToggleMic?: () => void;
  onToggleVideo?: () => void;
  isMuted?: boolean;
  isVideoOff?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  roomCode = '',
  state = 'COURT_OPEN',
  currentUser = null,
  onLeave,
  onOpenCaseRecord,
  onOpenStenographer,
  onOpenAssistant,
  onOpenAnalytics,
  onOpenJoin,
  onOpenCreate,
  onOpenPractice,
  onToggleMic,
  onToggleVideo,
  isMuted = false,
  isVideoOff = false
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStateBadge = (st: CourtroomState | string) => {
    switch (st) {
      case 'COURT_OPEN':
        return (
          <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 animate-pulse shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> COURT IN SESSION
          </span>
        );
      case 'JUDGE_SPEAKING':
        return (
          <span className="bg-amber-950/80 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
            <Gavel className="w-3.5 h-3.5 text-amber-400" /> HON’BLE BENCH SPEAKING
          </span>
        );
      case 'ADVOCATE_SPEAKING':
        return (
          <span className="bg-emerald-900/90 text-white border border-emerald-400/50 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
            <Mic className="w-3.5 h-3.5 text-emerald-300" /> ADVOCATE SUBMITTING
          </span>
        );
      case 'EVIDENCE_PRESENTATION':
        return (
          <span className="bg-teal-950/80 text-teal-300 border border-teal-500/40 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
            <FileText className="w-3.5 h-3.5 text-teal-400" /> BSA EXHIBIT DISPLAY
          </span>
        );
      case 'RECESS':
        return (
          <span className="bg-slate-900/80 text-slate-300 border border-slate-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> COURT IN RECESS
          </span>
        );
      case 'JUDGMENT':
        return (
          <span className="bg-amber-950/90 text-amber-200 border border-amber-400/60 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
            <Gavel className="w-3.5 h-3.5 text-amber-300" /> JUDGMENT PRONOUNCEMENT
          </span>
        );
      default:
        return (
          <span className="bg-slate-900/80 text-slate-400 border border-slate-700 px-3 py-1 rounded-full text-xs font-bold">
            WAITING FOR BENCH
          </span>
        );
    }
  };

  const getRoleBadge = (role?: UserRole, subRole?: AdvocateSubRole) => {
    if (!role) return null;
    if (role === 'judge') {
      return (
        <span className="bg-emerald-950 text-amber-300 border border-emerald-500/50 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase flex items-center gap-1">
          <Gavel className="w-3 h-3 text-amber-400" /> Hon’ble Judge
        </span>
      );
    }
    if (role === 'admin') {
      return (
        <span className="bg-slate-800 text-slate-200 border border-slate-600 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase flex items-center gap-1">
          <Shield className="w-3 h-3 text-emerald-400" /> Registrar / Admin
        </span>
      );
    }
    if (role === 'advocate') {
      const subLabel = subRole === 'petitioner' ? 'Petitioner Counsel' : subRole === 'respondent' ? 'Respondent Counsel' : 'Advocate';
      return (
        <span className="bg-emerald-900/80 text-emerald-200 border border-emerald-500/40 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase flex items-center gap-1">
          <UserCheck className="w-3 h-3 text-emerald-400" /> {subLabel}
        </span>
      );
    }
    return (
      <span className="bg-slate-900 text-slate-400 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
        Spectator
      </span>
    );
  };

  return (
    <header className="bg-slate-950/80 border-b border-emerald-500/20 text-slate-100 px-4 py-2.5 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md shadow-xl">
      {/* Brand & Room Info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-900/80 text-amber-300 border border-emerald-500/40 flex items-center justify-center shadow-md">
            <Scale className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-serif font-bold text-white tracking-wide flex items-center gap-1.5">
                BHARAT VIRTUAL COURTROOM
              </h1>
              <span className="hidden sm:inline bg-emerald-900/80 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-500/40">
                BNS 2023 & IPC
              </span>
            </div>
            <p className="text-[10px] text-emerald-400/90 font-medium tracking-wider uppercase flex items-center gap-1">
              <span>Moot Court & Legal Education</span>
              <span className="text-amber-400">●</span>
              <span className="text-slate-400 font-serif italic">Satyameva Jayate</span>
            </p>
          </div>
        </div>

        {/* Room Code Badge */}
        {roomCode && (
          <div className="hidden sm:flex items-center gap-2 glass-pill px-3 py-1 rounded-lg text-xs border-emerald-500/30">
            <span className="text-slate-400 font-mono text-[11px]">COURT CODE:</span>
            <span className="font-mono font-bold text-emerald-300 tracking-wider">{roomCode}</span>
            <button
              onClick={handleCopyCode}
              className="text-slate-400 hover:text-emerald-300 transition-colors ml-1 p-0.5"
              title="Copy Room Code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}

        {/* Courtroom State Badge */}
        {roomCode && <div className="hidden md:block">{getStateBadge(state)}</div>}
      </div>

      {/* Center Actions / Quick Tools (if inside courtroom) */}
      {roomCode ? (
        <div className="flex items-center gap-2">
          {onOpenCaseRecord && (
            <button
              onClick={() => {
                sfx.playToggle(true);
                onOpenCaseRecord();
              }}
              className="glass-card hover:bg-slate-800 text-slate-200 border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden lg:inline">Case Record & BNS</span>
            </button>
          )}

          {onOpenStenographer && (
            <button
              onClick={() => {
                sfx.playToggle(true);
                onOpenStenographer();
              }}
              className="glass-card hover:bg-slate-800 text-slate-200 border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden lg:inline">Stenography</span>
            </button>
          )}

          {onOpenAssistant && (
            <button
              onClick={() => {
                sfx.playCallBell();
                onOpenAssistant();
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 border border-emerald-400 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
            >
              <Bot className="w-3.5 h-3.5 text-slate-950" />
              <span className="hidden lg:inline">Nyaya AI Clerk</span>
            </button>
          )}

          {onOpenAnalytics && (
            <button
              onClick={() => {
                sfx.playToggle(true);
                onOpenAnalytics();
              }}
              className="glass-card hover:bg-slate-800 text-slate-200 border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden lg:inline">Analytics</span>
            </button>
          )}
        </div>
      ) : (
        /* Top Navigation Links for Landing View */
        <div className="flex items-center gap-2">
          {onOpenJoin && (
            <button
              onClick={() => {
                sfx.playJoinChime();
                onOpenJoin();
              }}
              className="glass-card hover:bg-slate-800 text-emerald-300 border-emerald-500/30 px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Join Courtroom</span>
            </button>
          )}

          {onOpenCreate && (
            <button
              onClick={() => {
                sfx.playGavel();
                onOpenCreate();
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 border border-emerald-400 px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
            >
              <Gavel className="w-3.5 h-3.5 text-amber-950" />
              <span>Create Courtroom</span>
            </button>
          )}

          {onOpenPractice && (
            <button
              onClick={() => {
                sfx.playCallBell();
                onOpenPractice();
              }}
              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Student Practice (AI Judge)</span>
            </button>
          )}
        </div>
      )}

      {/* Right Controls & Current User Badge (if inside courtroom) */}
      {roomCode && (
        <div className="flex items-center gap-3">
          {currentUser && (
            <div className="hidden sm:flex items-center gap-2 glass-pill px-2.5 py-1 rounded-xl border-emerald-500/30">
              <div className="w-7 h-7 rounded-full bg-emerald-900 text-amber-300 border border-emerald-500/50 flex items-center justify-center font-bold text-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white leading-none">{currentUser.name}</div>
                <div className="mt-0.5">{getRoleBadge(currentUser.role, currentUser.subRole)}</div>
              </div>
            </div>
          )}

          {/* Media Hardware Quick Toggles */}
          {currentUser && currentUser.role !== 'spectator' && (
            <div className="flex items-center gap-1 glass-pill p-1 rounded-lg border-slate-700">
              <button
                onClick={() => {
                  sfx.playToggle(!isMuted);
                  if (onToggleMic) onToggleMic();
                }}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  isMuted
                    ? 'bg-rose-950/80 text-rose-300 border border-rose-500/50'
                    : 'bg-emerald-950/80 text-emerald-300 hover:bg-emerald-900 border border-emerald-500/50'
                }`}
                title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                onClick={() => {
                  sfx.playToggle(!isVideoOff);
                  if (onToggleVideo) onToggleVideo();
                }}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  isVideoOff
                    ? 'bg-rose-950/80 text-rose-300 border border-rose-500/50'
                    : 'bg-emerald-950/80 text-emerald-300 hover:bg-emerald-900 border border-emerald-500/50'
                }`}
                title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
              >
                {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
              </button>
            </div>
          )}

          {/* Leave Court Button */}
          {onLeave && (
            <button
              onClick={() => {
                sfx.playGavel();
                onLeave();
              }}
              className="bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-500/40 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Court</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
