import React, { useState } from 'react';
import { X, Copy, Check, Share2, Users, Sparkles, Link as LinkIcon, Gavel, UserCheck } from 'lucide-react';
import { sfx } from '../../utils/sfx';

interface InviteStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomCode: string;
  caseTitle: string;
}

export const InviteStudentsModal: React.FC<InviteStudentsModalProps> = ({
  isOpen,
  onClose,
  roomCode,
  caseTitle
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const inviteUrl = `${window.location.origin}?room=${roomCode}`;

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    sfx.playCallBell();
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    sfx.playCallBell();
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="aurora-white-card rounded-2xl max-w-lg w-full p-6 text-slate-900 shadow-2xl relative border border-emerald-300/80">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-slate-900">Invite Students to Courtroom</h2>
            <p className="text-xs text-slate-600 font-medium">Share code or link with advocate student participants</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Case Info Banner */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 text-xs">
            <div className="text-[10px] uppercase font-mono font-bold text-emerald-800 tracking-wider">Active Cause Title</div>
            <div className="font-serif font-bold text-slate-900 text-sm">{caseTitle}</div>
          </div>

          {/* Room Code Card */}
          <div className="aurora-white-panel p-4 rounded-xl space-y-2 border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Courtroom Invitation Code
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-3 font-mono font-bold text-xl text-emerald-700 text-center tracking-widest shadow-inner">
                {roomCode}
              </div>
              <button
                onClick={copyCode}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-3 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md active:scale-95"
              >
                {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>

          {/* Shareable Link Card */}
          <div className="aurora-white-panel p-4 rounded-xl space-y-2 border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Direct Access Web Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={inviteUrl}
                className="flex-1 aurora-white-input rounded-xl px-3 py-2 text-xs font-mono text-slate-700"
              />
              <button
                onClick={copyLink}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <LinkIcon className="w-4 h-4" />}
                <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Joining Guide */}
          <div className="border-t border-slate-200 pt-3 space-y-2">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-600" /> Student Joining Instructions
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-blue-50/80 border border-blue-200 text-blue-900">
                <div className="font-bold flex items-center gap-1 mb-0.5 text-blue-800">
                  <UserCheck className="w-3.5 h-3.5" /> Petitioner Counsel
                </div>
                <div className="text-[11px] text-blue-700">Presents constitutional challenge & oral arguments</div>
              </div>

              <div className="p-2.5 rounded-lg bg-indigo-50/80 border border-indigo-200 text-indigo-900">
                <div className="font-bold flex items-center gap-1 mb-0.5 text-indigo-800">
                  <UserCheck className="w-3.5 h-3.5" /> Respondent Counsel
                </div>
                <div className="text-[11px] text-indigo-700">Defends state statutes & statutory provisions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
