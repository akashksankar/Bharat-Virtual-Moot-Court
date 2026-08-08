import React, { useState, useEffect, useRef } from 'react';
import {
  Gavel,
  Shield,
  UserCheck,
  Eye,
  Video,
  VideoOff,
  Mic,
  MicOff,
  X,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { UserRole, AdvocateSubRole, Participant } from '../types';
import { sfx } from '../utils/sfx';

interface JoinModalProps {
  initialRoomCode?: string;
  isOpen: boolean;
  onClose: () => void;
  onJoin: (participantData: Partial<Participant>, roomCode: string) => void;
}

export const JoinModal: React.FC<JoinModalProps> = ({
  initialRoomCode = '',
  isOpen,
  onClose,
  onJoin
}) => {
  const [roomCode, setRoomCode] = useState(initialRoomCode || 'DEMO-482');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('advocate');
  const [subRole, setSubRole] = useState<AdvocateSubRole>('petitioner');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [error, setError] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCameraPreview();
    } else {
      stopCameraPreview();
    }
    return () => {
      stopCameraPreview();
    };
  }, [isOpen]);

  const startCameraPreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera/mic preview error:', err);
    }
  };

  const stopCameraPreview = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleToggleMic = () => {
    setIsMuted(!isMuted);
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = isMuted; // toggling
      });
    }
  };

  const handleToggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = isVideoOff; // toggling
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your real display name before entering the courtroom.');
      return;
    }
    if (!roomCode.trim()) {
      setError('Please enter a valid Courtroom Code.');
      return;
    }

    stopCameraPreview();

    const participantData: Partial<Participant> = {
      id: `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: name.trim(),
      role,
      subRole: role === 'advocate' ? subRole : undefined,
      isMuted,
      isVideoOff,
      isSpeaking: false,
      isHandRaised: false,
      connectionStatus: 'connected',
      joinedAt: Date.now()
    };

    sfx.playJoinChime();
    onJoin(participantData, roomCode.toUpperCase().trim());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-modal rounded-2xl max-w-xl w-full p-6 text-slate-100 shadow-2xl relative overflow-hidden border border-emerald-500/30">
        {/* Close button */}
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
            <h2 className="text-xl font-serif font-bold text-white">Enter Virtual Courtroom</h2>
            <p className="text-xs text-slate-300">Provide your verified display name and courtroom identity</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-900 px-3.5 py-2.5 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Room Code */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Courtroom Code
            </label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="e.g. SLP-842"
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-emerald-300 uppercase tracking-widest"
              required
            />
          </div>

          {/* Real Display Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Your Real Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="e.g. Akash Sankar or Prof. Anitha Menon"
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm text-white"
              required
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Courtroom Role
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setRole('advocate')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  role === 'advocate'
                    ? 'bg-emerald-950/80 border-emerald-500/60 text-white font-bold shadow-md'
                    : 'glass-card border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <UserCheck className="w-4 h-4 mb-1 text-emerald-400" />
                <div className="text-xs font-bold">Advocate</div>
                <div className="text-[10px] text-slate-400">Lawyer / Counsel</div>
              </button>

              <button
                type="button"
                onClick={() => setRole('judge')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  role === 'judge'
                    ? 'bg-emerald-950/80 border-emerald-500/60 text-white font-bold shadow-md'
                    : 'glass-card border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <Gavel className="w-4 h-4 mb-1 text-amber-400" />
                <div className="text-xs font-bold">Judge</div>
                <div className="text-[10px] text-slate-400">Faculty / Bench</div>
              </button>

              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  role === 'admin'
                    ? 'bg-emerald-950/80 border-emerald-500/60 text-white font-bold shadow-md'
                    : 'glass-card border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <Shield className="w-4 h-4 mb-1 text-emerald-400" />
                <div className="text-xs font-bold">Admin</div>
                <div className="text-[10px] text-slate-400">Court Registrar</div>
              </button>

              <button
                type="button"
                onClick={() => setRole('spectator')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  role === 'spectator'
                    ? 'bg-emerald-950/80 border-emerald-500/60 text-white font-bold shadow-md'
                    : 'glass-card border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <Eye className="w-4 h-4 mb-1 text-slate-400" />
                <div className="text-xs font-bold">Spectator</div>
                <div className="text-[10px] text-slate-400">Read-Only</div>
              </button>
            </div>
          </div>

          {/* Advocate Subrole Selection */}
          {role === 'advocate' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Advocate Side
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSubRole('petitioner')}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                    subRole === 'petitioner'
                      ? 'bg-emerald-600 text-slate-950 border-emerald-400 font-bold'
                      : 'glass-card text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  Petitioner / Plaintiff Counsel
                </button>
                <button
                  type="button"
                  onClick={() => setSubRole('respondent')}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                    subRole === 'respondent'
                      ? 'bg-emerald-600 text-slate-950 border-emerald-400 font-bold'
                      : 'glass-card text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  Respondent / Union Counsel
                </button>
              </div>
            </div>
          )}

          {/* Video Preview & Media Checks */}
          <div className="glass-card rounded-xl p-3 border-slate-700">
            <div className="text-xs font-bold text-slate-300 mb-2 flex justify-between items-center">
              <span>Hardware Preview</span>
              <span className="text-[10px] text-slate-400 font-medium">Check Camera & Microphone</span>
            </div>

            <div className="relative aspect-video bg-slate-950 rounded-lg overflow-hidden border border-slate-800 mb-3 flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : 'block'}`}
              />
              {isVideoOff && (
                <div className="flex flex-col items-center text-slate-400 text-xs">
                  <VideoOff className="w-8 h-8 mb-1 text-slate-500" />
                  <span>Camera Preview Disabled</span>
                </div>
              )}

              {/* Hardware Quick Toggles Overlay */}
              <div className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1 rounded-lg">
                <button
                  type="button"
                  onClick={handleToggleMic}
                  className={`p-1.5 rounded transition-colors ${
                    isMuted ? 'bg-rose-950 text-rose-300 border border-rose-500/40' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleToggleVideo}
                  className={`p-1.5 rounded transition-colors ${
                    isVideoOff ? 'bg-rose-950 text-rose-300 border border-rose-500/40' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 border border-emerald-400 hover:scale-[1.01] active:scale-[0.99]"
          >
            <Gavel className="w-4 h-4 text-slate-950" />
            <span>Enter Courtroom Now</span>
          </button>
        </form>
      </div>
    </div>
  );
};
