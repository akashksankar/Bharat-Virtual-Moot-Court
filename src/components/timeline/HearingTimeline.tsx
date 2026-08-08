import React from 'react';
import { Clock, Shield, AlertTriangle, FileText, Gavel, UserCheck } from 'lucide-react';
import { TimelineEvent } from '../../types';

interface HearingTimelineProps {
  timeline: TimelineEvent[];
}

export const HearingTimeline: React.FC<HearingTimelineProps> = ({ timeline }) => {
  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'state_change':
        return <Gavel className="w-3.5 h-3.5 text-amber-400" />;
      case 'speaker_change':
        return <UserCheck className="w-3.5 h-3.5 text-blue-400" />;
      case 'exhibit':
        return <FileText className="w-3.5 h-3.5 text-purple-400" />;
      case 'objection':
      case 'ruling':
        return <AlertTriangle className="w-3.5 h-3.5 text-red-400" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  return (
    <div className="bg-zinc-950 border border-amber-900/40 rounded-2xl p-5 text-amber-50 shadow-2xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-amber-900/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-950 border border-amber-600/40 flex items-center justify-center text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-serif font-bold text-amber-100 uppercase tracking-wider">
              HEARING AUDIT TIMELINE
            </h3>
            <p className="text-[10px] text-zinc-400 font-mono">Immutable Procedural Log</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {timeline.length === 0 ? (
          <div className="text-center py-6 text-zinc-500 text-xs italic font-serif">
            No timeline events recorded yet.
          </div>
        ) : (
          timeline
            .slice()
            .reverse()
            .map((ev) => (
              <div key={ev.id} className="flex gap-3 text-xs bg-zinc-900/60 border border-zinc-800 p-2.5 rounded-xl">
                <div className="mt-0.5 p-1 rounded-md bg-zinc-950 border border-zinc-800 flex-shrink-0">
                  {getEventIcon(ev.type)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-amber-200">{ev.title}</span>
                    <span className="text-[10px] font-mono text-zinc-500">{ev.timestamp}</span>
                  </div>
                  <p className="text-zinc-400 font-serif text-[11px] mt-0.5">{ev.description}</p>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};
