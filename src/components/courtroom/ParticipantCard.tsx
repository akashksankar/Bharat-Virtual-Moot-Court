import React, { useEffect, useRef } from 'react';
import {
  Gavel,
  Shield,
  UserCheck,
  Eye,
  Mic,
  MicOff,
  VideoOff,
  Volume2
} from 'lucide-react';
import { Participant, UserRole, AdvocateSubRole } from '../../types';

interface ParticipantCardProps {
  participant: Participant;
  stream?: MediaStream;
  isJudgeBench?: boolean;
  isCourtFloor?: boolean;
}

export const ParticipantCard: React.FC<ParticipantCardProps> = ({
  participant,
  stream,
  isJudgeBench = false,
  isCourtFloor = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const getRoleBadge = (role: UserRole, subRole?: AdvocateSubRole) => {
    switch (role) {
      case 'judge':
        return (
          <span className="bg-emerald-700 text-white border border-emerald-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
            <Gavel className="w-3 h-3 text-amber-300" /> Presiding Judge
          </span>
        );
      case 'admin':
        return (
          <span className="bg-purple-700 text-white border border-purple-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
            <Shield className="w-3 h-3 text-purple-200" /> Court Admin
          </span>
        );
      case 'advocate':
        return (
          <span className="bg-blue-700 text-white border border-blue-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
            <UserCheck className="w-3 h-3 text-blue-200" />
            {subRole === 'petitioner' ? 'Petitioner Counsel' : subRole === 'respondent' ? 'Respondent Counsel' : 'Advocate'}
          </span>
        );
      default:
        return (
          <span className="bg-slate-700 text-slate-100 border border-slate-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <Eye className="w-3 h-3" /> Spectator
          </span>
        );
    }
  };

  return (
    <div
      className={`relative rounded-2xl overflow-hidden border transition-all ${
        participant.isSpeaking
          ? 'border-emerald-500 ring-2 ring-emerald-400/50 shadow-lg shadow-emerald-500/10'
          : isJudgeBench
          ? 'border-emerald-300 bg-white'
          : 'border-slate-200/90 bg-white'
      } ${isJudgeBench ? 'min-h-[160px]' : isCourtFloor ? 'min-h-[180px]' : 'min-h-[140px]'}`}
    >
      {/* Video or Avatar Display */}
      {stream && !participant.isVideoOff ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover absolute inset-0"
        />
      ) : (
        <div className="w-full h-full absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95 p-4 text-center">
          {participant.avatarUrl ? (
            <img
              src={participant.avatarUrl}
              alt={participant.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-emerald-400/60 mb-2 shadow-md"
            />
          ) : (
            <div
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg font-serif font-bold mb-2 shadow-sm ${
                participant.role === 'judge'
                  ? 'bg-emerald-800 text-amber-200 border-emerald-400'
                  : 'bg-slate-800 text-slate-100 border-slate-600'
              }`}
            >
              {participant.name.charAt(0)}
            </div>
          )}

          {participant.isVideoOff && (
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
              <VideoOff className="w-3 h-3" /> Camera Off
            </div>
          )}
        </div>
      )}

      {/* Speaking Active Ripple Overlay */}
      {participant.isSpeaking && (
        <div className="absolute top-2 right-2 bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 animate-pulse shadow-md">
          <Volume2 className="w-3 h-3" /> SPEAKING
        </div>
      )}

      {/* Hand Raised Indicator */}
      {participant.isHandRaised && (
        <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-md">
          ✋ Hand Raised
        </div>
      )}

      {/* Bottom Name & Role Overlay */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2.5 pt-6 flex items-end justify-between">
        <div className="min-w-0 pr-2">
          <div className="text-xs font-bold text-amber-100 truncate flex items-center gap-1.5">
            <span>{participant.name}</span>
          </div>
          <div className="mt-1">{getRoleBadge(participant.role, participant.subRole)}</div>
        </div>

        {/* Mic Indicator Icon */}
        <div className="flex-shrink-0">
          {participant.isMuted ? (
            <div className="p-1 rounded bg-red-950/80 border border-red-800/80 text-red-400" title="Muted">
              <MicOff className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className="p-1 rounded bg-emerald-950/80 border border-emerald-800/80 text-emerald-400" title="Microphone Active">
              <Mic className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
