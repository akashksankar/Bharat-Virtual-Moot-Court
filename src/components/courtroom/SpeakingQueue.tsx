import React from 'react';
import {
  Clock,
  Mic,
  Check,
  X,
  Play,
  Pause,
  RotateCcw,
  UserCheck
} from 'lucide-react';
import { SpeakingQueueItem, ArgumentTimerState, UserRole, AdvocateSubRole } from '../../types';

interface SpeakingQueueProps {
  queue: SpeakingQueueItem[];
  timer: ArgumentTimerState;
  isJudge: boolean;
  onRequestSpeak: () => void;
  onGrantSpeak: (queueItemId: string, action: 'allow' | 'deny') => void;
  onUpdateTimer: (action: 'start' | 'pause' | 'reset', seconds?: number) => void;
  currentUserId?: string;
}

export const SpeakingQueue: React.FC<SpeakingQueueProps> = ({
  queue,
  timer,
  isJudge,
  onRequestSpeak,
  onGrantSpeak,
  onUpdateTimer,
  currentUserId
}) => {
  const formatTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const progressPercent = Math.max(
    0,
    Math.min(100, (timer.remainingSeconds / (timer.durationSeconds || 1)) * 100)
  );

  const isUserInQueue = queue.some(
    (item) => item.participantId === currentUserId && item.status === 'pending'
  );

  return (
    <div className="bg-zinc-950 border border-amber-900/40 rounded-xl p-4 text-amber-50 shadow-xl space-y-4">
      {/* Current Speaker & Active Timer */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-950 border border-amber-600/40 flex items-center justify-center text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                Argument Timer
              </div>
              <div className="text-[11px] text-zinc-400">{timer.modeName}</div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-mono font-bold text-amber-300 tracking-wider">
              {formatTime(timer.remainingSeconds)}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
          <div
            className={`h-full transition-all duration-1000 ${
              timer.remainingSeconds < 30
                ? 'bg-red-500'
                : timer.remainingSeconds < 120
                ? 'bg-amber-400'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Active Speaker Badge */}
        <div className="mt-2 bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 flex items-center justify-between text-xs">
          <span className="text-zinc-400">Active Speaker:</span>
          <span className="font-bold text-amber-200 flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            {timer.currentSpeakerName || 'None'} ({timer.currentSpeakerRole || 'Court'})
          </span>
        </div>

        {/* Judge Timer Controls */}
        {isJudge && (
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={() => onUpdateTimer(timer.isRunning ? 'pause' : 'start')}
              className="flex-1 bg-amber-900/60 hover:bg-amber-800 text-amber-200 border border-amber-600/40 py-1.5 rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              {timer.isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{timer.isRunning ? 'Pause' : 'Start'}</span>
            </button>

            <button
              onClick={() => onUpdateTimer('reset')}
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 p-1.5 rounded transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Speaking Queue List */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            Speaking Queue ({queue.filter((q) => q.status === 'pending').length})
          </span>

          {!isJudge && (
            <button
              onClick={onRequestSpeak}
              disabled={isUserInQueue}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                isUserInQueue
                  ? 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-500 text-zinc-950 shadow-sm'
              }`}
            >
              {isUserInQueue ? 'In Queue' : 'Request to Speak'}
            </button>
          )}
        </div>

        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
          {queue.filter((q) => q.status === 'pending').length === 0 ? (
            <div className="text-[11px] text-zinc-500 italic text-center py-2 bg-zinc-900/50 rounded border border-zinc-800/50">
              No students currently requesting permission to speak.
            </div>
          ) : (
            queue
              .filter((q) => q.status === 'pending')
              .map((item, idx) => (
                <div
                  key={item.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-amber-100">
                      {idx + 1}. {item.participantName}
                    </div>
                    <div className="text-[10px] text-amber-400/80 uppercase font-mono">
                      {item.subRole || item.role}
                    </div>
                  </div>

                  {isJudge && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onGrantSpeak(item.id, 'allow')}
                        className="bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 p-1 rounded transition-colors"
                        title="Allow Speaking"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onGrantSpeak(item.id, 'deny')}
                        className="bg-red-950 hover:bg-red-900 text-red-300 border border-red-700/60 p-1 rounded transition-colors"
                        title="Deny Speaking"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};
