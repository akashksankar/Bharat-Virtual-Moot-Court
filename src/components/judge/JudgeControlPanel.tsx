import React, { useState } from 'react';
import {
  Gavel,
  Mic,
  MicOff,
  Clock,
  HelpCircle,
  AlertTriangle,
  Play,
  Pause,
  Award,
  Check,
  X,
  FileCheck
} from 'lucide-react';
import { CourtroomState, ObjectionRecord } from '../../types';
import { sfx } from '../../utils/sfx';

interface JudgeControlPanelProps {
  state: CourtroomState;
  pendingObjections: ObjectionRecord[];
  onUpdateState: (newState: CourtroomState) => void;
  onIssueQuestion: (questionText: string, directedTo?: string) => void;
  onRuleObjection: (objectionId: string, status: 'sustained' | 'overruled') => void;
  onToggleMuteAll: () => void;
  onCallSpeaker: (subRole: 'petitioner' | 'respondent') => void;
  onOpenEvaluation: () => void;
  onOpenJudgment: () => void;
}

export const JudgeControlPanel: React.FC<JudgeControlPanelProps> = ({
  state,
  pendingObjections,
  onUpdateState,
  onIssueQuestion,
  onRuleObjection,
  onToggleMuteAll,
  onCallSpeaker,
  onOpenEvaluation,
  onOpenJudgment
}) => {
  const [questionText, setQuestionText] = useState('');
  const [directedTo, setDirectedTo] = useState('Petitioner Counsel');

  const handleSendQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (questionText.trim()) {
      onIssueQuestion(questionText.trim(), directedTo);
      setQuestionText('');
    }
  };

  return (
    <div className="aurora-white-card rounded-2xl p-5 text-slate-900 shadow-xl space-y-5 border border-slate-200">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center justify-center">
            <Gavel className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-serif font-bold text-slate-900 uppercase tracking-wider">
              JUDICIAL BENCH CONTROLS
            </h3>
            <p className="text-[10px] text-emerald-800 font-mono">Presiding Judge Protocol Panel</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sfx.playGavel();
              onUpdateState(state === 'COURT_OPEN' ? 'RECESS' : 'COURT_OPEN');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
              state === 'COURT_OPEN'
                ? 'bg-amber-50 text-amber-900 border border-amber-300'
                : 'bg-emerald-600 text-white border border-emerald-500'
            }`}
          >
            {state === 'COURT_OPEN' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{state === 'COURT_OPEN' ? 'Declare Recess' : 'Open Court'}</span>
          </button>
        </div>
      </div>

      {/* Pending Objections Alert Section */}
      {pendingObjections.length > 0 && (
        <div className="bg-red-50 border border-red-300 p-3.5 rounded-xl space-y-2 animate-pulse shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-red-900">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              OBJECTION RAISED BY {pendingObjections[0].raisedByParticipantName.toUpperCase()}
            </span>
            <span className="bg-red-200 text-red-900 px-2 py-0.5 rounded text-[10px] uppercase font-mono">
              {pendingObjections[0].type}
            </span>
          </div>
          {pendingObjections[0].details && (
            <p className="text-xs text-red-800 font-serif italic">"{pendingObjections[0].details}"</p>
          )}

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => {
                sfx.playGavel();
                onRuleObjection(pendingObjections[0].id, 'sustained');
              }}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 rounded-lg text-xs flex items-center justify-center gap-1 shadow-xs"
            >
              <Check className="w-4 h-4" /> SUSTAIN
            </button>

            <button
              onClick={() => {
                sfx.playGavel();
                onRuleObjection(pendingObjections[0].id, 'overruled');
              }}
              className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-1.5 rounded-lg text-xs flex items-center justify-center gap-1 shadow-xs"
            >
              <X className="w-4 h-4" /> OVERRULE
            </button>
          </div>
        </div>
      )}

      {/* Call Advocate Floor Controls */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Call Advocate to Floor
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              sfx.playCallBell();
              onCallSpeaker('petitioner');
            }}
            className="bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Call Petitioner Counsel
          </button>
          <button
            onClick={() => {
              sfx.playCallBell();
              onCallSpeaker('respondent');
            }}
            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-300 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Call Respondent Counsel
          </button>
        </div>
      </div>

      {/* Interrogate / Ask Judge Question */}
      <form onSubmit={handleSendQuestion} className="space-y-2">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
          Issue Judicial Interrogation Question
        </label>
        <div className="flex gap-2">
          <select
            value={directedTo}
            onChange={(e) => setDirectedTo(e.target.value)}
            className="aurora-white-input rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
          >
            <option value="Petitioner Counsel">Petitioner</option>
            <option value="Respondent Counsel">Respondent</option>
            <option value="All Advocates">Both Counsel</option>
          </select>
          <input
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="e.g. What legal authority supports this assertion?"
            className="flex-1 aurora-white-input rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-colors shadow-xs"
          >
            Ask
          </button>
        </div>
      </form>

      {/* Quick Actions Footer */}
      <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-2">
        <button
          onClick={onOpenEvaluation}
          className="bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
        >
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span>Student Evaluation</span>
        </button>

        <button
          onClick={onOpenJudgment}
          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
        >
          <FileCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>Write Judgment</span>
        </button>
      </div>
    </div>
  );
};
