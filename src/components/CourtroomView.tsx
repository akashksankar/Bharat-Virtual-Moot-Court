import React, { useState, useEffect, useRef } from 'react';
import {
  Gavel,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Hand,
  AlertTriangle,
  FileText,
  BookOpen,
  Award,
  Clock,
  MessageSquare,
  Sparkles,
  LogOut,
  Users,
  Eye,
  Shield,
  Layers,
  Share2,
  Copy,
  UserPlus
} from 'lucide-react';

import { InviteStudentsModal } from './courtroom/InviteStudentsModal';

import {
  Participant,
  CourtroomState,
  CaseRecord,
  EvidenceItem,
  TranscriptSegment,
  ObjectionRecord,
  ArgumentTimerState,
  SpeakingQueueItem,
  StudentEvaluation,
  JudgmentRecord,
  TimelineEvent,
  RoomMessage,
  UserRole
} from '../types';

import { CourtroomLayout } from './courtroom/CourtroomLayout';
import { SpeakingQueue } from './courtroom/SpeakingQueue';
import { StenographerPanel } from './transcript/StenographerPanel';
import { EvidenceManager } from './evidence/EvidenceManager';
import { DocumentViewer } from './evidence/DocumentViewer';
import { CaseSummaryPanel } from './case/CaseSummaryPanel';
import { JudgeControlPanel } from './judge/JudgeControlPanel';
import { ObjectionModal } from './objection/ObjectionModal';
import { EvaluationPanel } from './evaluation/EvaluationPanel';
import { JudgmentEditor } from './judgment/JudgmentEditor';
import { HearingTimeline } from './timeline/HearingTimeline';
import { CourtroomChat } from './chat/CourtroomChat';
import { AICaseAssistant } from './ai/AICaseAssistant';
import { SpeechStenographer } from '../utils/speechRecognition';
import { WebRTCManager } from '../utils/webrtc';

interface CourtroomViewProps {
  roomCode: string;
  currentParticipant: Participant;
  onLeave: () => void;
  onOpenPracticeMode: () => void;
}

export const CourtroomView: React.FC<CourtroomViewProps> = ({
  roomCode,
  currentParticipant,
  onLeave,
  onOpenPracticeMode
}) => {
  const [activeTab, setActiveTab] = useState<
    'floor' | 'transcript' | 'evidence' | 'case' | 'evaluation' | 'judgment' | 'timeline' | 'chat'
  >('floor');

  // Local state synced via WebSocket
  const [roomState, setRoomState] = useState<CourtroomState>('COURT_OPEN');
  const [participants, setParticipants] = useState<Participant[]>([currentParticipant]);
  const [caseRecord, setCaseRecord] = useState<CaseRecord>({
    caseNumber: 'SLP (Crl.) No. 8421 / 2026',
    caseTitle: 'Akash Sankar & Ors. v. Union of India',
    courtroomName: 'Courtroom No. 1 — Supreme Court of India',
    judgeName: 'Hon’ble Justice Dr. D.Y. Chandrachud (Retd.) / Bench',
    date: 'August 8, 2026',
    subject: 'BNS 2023 Section 111 & BSA Section 61 Electronic Evidence Admissibility',
    petitioner: 'Learned Senior Counsel Akash Sankar',
    respondent: 'Additional Solicitor General of India (Union of India)',
    caseType: 'Constitutional Criminal SLP',
    facts:
      'Special Leave Petition challenging state surveillance and prosecution under Section 111 of Bharatiya Nyaya Sanhita (BNS 2023) for digital speech, alleging breach of Article 19(1)(a) and Article 21 rights.',
    issues: [
      'Whether Section 111 of Bharatiya Nyaya Sanhita (BNS) 2023 infringes Article 19(1)(a) speech protections.',
      'Whether BSA Section 61 electronic certificate standards were satisfied by state investigators.'
    ]
  });

  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([
    {
      id: 'e1',
      exhibitNumber: 'EXHIBIT P-01',
      title: 'Digital Moderation Log & Takedown Order',
      submittedBy: 'Akash Sankar',
      submittedByRole: 'petitioner',
      fileType: 'pdf',
      description: 'Automated notification indicating immediate suppression of petition statement under Section 42-B.',
      status: 'admitted',
      uploadedAt: Date.now() - 3600000
    }
  ]);
  const [activeEvidenceId, setActiveEvidenceId] = useState<string>('e1');

  const [transcript, setTranscript] = useState<TranscriptSegment[]>([
    {
      id: 't1',
      speakerId: 'j1',
      speakerName: 'Prof. Anitha Menon',
      speakerRole: 'judge',
      text: 'Court is now in session for Courtroom 4A. Petitioner counsel may begin oral arguments.',
      timestamp: '10:00:15',
      isFinal: true,
      confidence: 0.98
    }
  ]);

  const [objections, setObjections] = useState<ObjectionRecord[]>([]);
  const [speakingQueue, setSpeakingQueue] = useState<SpeakingQueueItem[]>([]);
  const [timer, setTimer] = useState<ArgumentTimerState>({
    isRunning: true,
    durationSeconds: 600,
    remainingSeconds: 580,
    currentSpeakerName: currentParticipant.name,
    currentSpeakerRole: currentParticipant.subRole || currentParticipant.role,
    modeName: 'Petitioner Opening Argument'
  });

  const [evaluations, setEvaluations] = useState<Record<string, StudentEvaluation>>({});
  const [judgment, setJudgment] = useState<JudgmentRecord | undefined>();
  const [timeline, setTimeline] = useState<TimelineEvent[]>([
    {
      id: 'tl1',
      type: 'state_change',
      title: 'Court Opened',
      description: 'Presiding Judge initialized courtroom proceedings.',
      timestamp: '10:00:00'
    }
  ]);
  const [messages, setMessages] = useState<RoomMessage[]>([]);

  // Local UI toggles
  const [isMuted, setIsMuted] = useState(currentParticipant.isMuted || false);
  const [isVideoOff, setIsVideoOff] = useState(currentParticipant.isVideoOff || false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isObjectionModalOpen, setIsObjectionModalOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isStenographerActive, setIsStenographerActive] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // WebRTC & Speech Recognition
  const wsRef = useRef<WebSocket | null>(null);
  const webrtcRef = useRef<WebRTCManager | null>(null);
  const stenographerRef = useRef<SpeechStenographer | null>(null);
  const [peerStreams, setPeerStreams] = useState<Record<string, MediaStream>>({});

  const isJudge = currentParticipant.role === 'judge';
  const isAdvocate = currentParticipant.role === 'advocate';

  // WebSocket Connection Initialization
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: 'JOIN_ROOM',
          roomCode,
          participant: currentParticipant
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        handleServerMessage(msg);
      } catch (e) {
        console.error('WS Parse Error:', e);
      }
    };

    // Initialize WebRTC
    const webrtc = new WebRTCManager((peerId, stream) => {
      setPeerStreams((prev) => ({ ...prev, [peerId]: stream }));
    }, ws);
    webrtcRef.current = webrtc;

    // Initialize Stenographer
    const stt = new SpeechStenographer();
    stenographerRef.current = stt;

    return () => {
      ws.close();
      webrtc.closeAll();
      stt.stop();
    };
  }, [roomCode]);

  const handleServerMessage = (msg: any) => {
    if (!msg) return;

    if (msg.room) {
      const room = msg.room;
      if (room.state) setRoomState(room.state);
      if (room.participants) setParticipants(room.participants);
      if (room.caseRecord) setCaseRecord(room.caseRecord);
      if (room.evidenceList) setEvidenceList(room.evidenceList);
      if (room.transcript) setTranscript(room.transcript);
      if (room.objections) setObjections(room.objections);
      if (room.speakingQueue) setSpeakingQueue(room.speakingQueue);
      if (room.timer) setTimer(room.timer);
      if (room.evaluations) setEvaluations(room.evaluations);
      if (room.judgment) setJudgment(room.judgment);
      if (room.timeline) setTimeline(room.timeline);
      if (room.messages) setMessages(room.messages);
    }

    switch (msg.type) {
      case 'ROOM_STATE':
        if (msg.state) setRoomState(msg.state);
        if (msg.participants) setParticipants(msg.participants);
        if (msg.caseRecord) setCaseRecord(msg.caseRecord);
        if (msg.evidenceList) setEvidenceList(msg.evidenceList);
        if (msg.transcript) setTranscript(msg.transcript);
        if (msg.objections) setObjections(msg.objections);
        if (msg.speakingQueue) setSpeakingQueue(msg.speakingQueue);
        if (msg.timer) setTimer(msg.timer);
        if (msg.evaluations) setEvaluations(msg.evaluations);
        if (msg.judgment) setJudgment(msg.judgment);
        if (msg.timeline) setTimeline(msg.timeline);
        if (msg.messages) setMessages(msg.messages);
        break;

      case 'SIGNAL': {
        const senderId = msg.senderId || msg.fromParticipantId;
        const signal = msg.signal || msg.signalData;
        if (senderId && signal) {
          webrtcRef.current?.handleSignal(senderId, signal);
        }
        break;
      }

      case 'PARTICIPANT_JOINED':
        if (msg.participant && msg.participant.id) {
          setParticipants((prev) => [...prev.filter((p) => p.id !== msg.participant.id), msg.participant]);
          webrtcRef.current?.createPeerConnection(msg.participant.id);
        }
        break;

      case 'PARTICIPANT_DISCONNECTED':
      case 'PARTICIPANT_LEFT': {
        const pId = msg.participantId || msg.participant?.id;
        if (pId) {
          setParticipants((prev) => prev.filter((p) => p.id !== pId));
          webrtcRef.current?.removePeerConnection(pId);
        }
        break;
      }
    }
  };

  const broadcastMessage = (actionType: string, payload: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: actionType,
          roomCode,
          ...payload
        })
      );
    }
  };

  // Local Controls Toggles
  const handleToggleMic = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    webrtcRef.current?.toggleAudio(!nextMute);
    broadcastMessage('UPDATE_PARTICIPANT', {
      participantId: currentParticipant.id,
      updates: { isMuted: nextMute }
    });
  };

  const handleToggleVideo = () => {
    const nextVideo = !isVideoOff;
    setIsVideoOff(nextVideo);
    webrtcRef.current?.toggleVideo(!nextVideo);
    broadcastMessage('UPDATE_PARTICIPANT', {
      participantId: currentParticipant.id,
      updates: { isVideoOff: nextVideo }
    });
  };

  const handleToggleHand = () => {
    const nextHand = !isHandRaised;
    setIsHandRaised(nextHand);
    broadcastMessage('UPDATE_PARTICIPANT', {
      participantId: currentParticipant.id,
      updates: { isHandRaised: nextHand }
    });
  };

  // Toggle Live Speech Recognition Stenographer
  const handleToggleStenographer = () => {
    if (!stenographerRef.current) return;

    if (isStenographerActive) {
      stenographerRef.current.stop();
      setIsStenographerActive(false);
    } else {
      setIsStenographerActive(true);
      stenographerRef.current.start(
        (result) => {
          if (result.isFinal && result.transcript.trim()) {
            const segment: TranscriptSegment = {
              id: `t-${Date.now()}`,
              speakerId: currentParticipant.id,
              speakerName: currentParticipant.name,
              speakerRole: currentParticipant.role,
              speakerSubRole: currentParticipant.subRole,
              text: result.transcript.trim(),
              timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
              isFinal: true,
              confidence: result.confidence,
              createdAt: Date.now()
            };
            broadcastMessage('ADD_TRANSCRIPT', { segment });
          }
        },
        (err) => console.warn('Stenographer error:', err)
      );
    }
  };

  const activeEvidence = evidenceList.find((e) => e.id === activeEvidenceId);
  const pendingObjections = objections.filter((o) => o.status === 'pending');

  return (
    <div className="min-h-screen aurora-white-bg text-slate-900 flex flex-col justify-between overflow-x-hidden selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. TOP COURTROOM HEADER */}
      <header className="bg-white/90 border-b border-slate-200/90 px-4 py-3 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-300 flex items-center justify-center shadow-xs">
            <Gavel className="w-5 h-5 text-emerald-800" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-slate-900 text-sm">{caseRecord.caseTitle}</span>
              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition-all"
                title="Click to copy or share courtroom code with students"
              >
                <span>{roomCode}</span>
                <Share2 className="w-3 h-3 text-emerald-700" />
              </button>
            </div>
            <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2">
              <span>{caseRecord.courtroomName}</span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold">{caseRecord.judgeName} Presiding</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Header */}
        <div className="hidden lg:flex items-center bg-slate-100/90 border border-slate-200/80 p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('floor')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'floor' ? 'bg-white text-slate-900 border border-slate-300 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Gavel className="w-3.5 h-3.5 text-emerald-600" /> Court Floor
          </button>

          <button
            onClick={() => setActiveTab('transcript')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'transcript' ? 'bg-white text-slate-900 border border-slate-300 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-600" /> Transcript
          </button>

          <button
            onClick={() => setActiveTab('evidence')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'evidence' ? 'bg-white text-slate-900 border border-slate-300 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-600" /> Evidence
          </button>

          <button
            onClick={() => setActiveTab('case')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'case' ? 'bg-white text-slate-900 border border-slate-300 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-600" /> Case Record
          </button>

          {isJudge && (
            <>
              <button
                onClick={() => setActiveTab('evaluation')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'evaluation' ? 'bg-white text-slate-900 border border-slate-300 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-600" /> Evaluation
              </button>

              <button
                onClick={() => setActiveTab('judgment')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'judgment' ? 'bg-white text-slate-900 border border-slate-300 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Gavel className="w-3.5 h-3.5 text-emerald-700" /> Judgment
              </button>
            </>
          )}

          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'timeline' ? 'bg-white text-slate-900 border border-slate-300 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-slate-500" /> Timeline
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'chat' ? 'bg-white text-slate-900 border border-slate-300 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" /> Chat
          </button>
        </div>

        {/* Right Session Status & Exit */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 active:scale-95"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Invite Students</span>
          </button>

          <button
            onClick={onLeave}
            className="bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Leave
          </button>
        </div>
      </header>

      {/* 2. MAIN ACTIVE VIEW CONTENT */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6">
        {activeTab === 'floor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8">
              <CourtroomLayout
                participants={participants}
                peerStreams={peerStreams}
                activeEvidence={activeEvidence}
                state={roomState}
                onSelectEvidence={() => setActiveTab('evidence')}
              />
            </div>

            <div className="lg:col-span-4 space-y-6">
              {isJudge && (
                <JudgeControlPanel
                  state={roomState}
                  pendingObjections={pendingObjections}
                  onUpdateState={(state) => broadcastMessage('UPDATE_STATE', { state })}
                  onIssueQuestion={(q, to) =>
                    broadcastMessage('ADD_TRANSCRIPT', {
                      segment: {
                        id: `q-${Date.now()}`,
                        speakerId: currentParticipant.id,
                        speakerName: currentParticipant.name,
                        speakerRole: 'judge',
                        text: `JUDICIAL INTERROGATION [To ${to}]: ${q}`,
                        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
                        isFinal: true,
                        highlighted: true
                      }
                    })
                  }
                  onRuleObjection={(objId, status) =>
                    broadcastMessage('RULE_OBJECTION', { objectionId: objId, status })
                  }
                  onToggleMuteAll={() => broadcastMessage('MUTE_ALL', {})}
                  onCallSpeaker={(subRole) =>
                    broadcastMessage('UPDATE_TIMER', {
                      timer: {
                        ...timer,
                        currentSpeakerRole: subRole,
                        modeName: `${subRole.toUpperCase()} Oral Argument`
                      }
                    })
                  }
                  onOpenEvaluation={() => setActiveTab('evaluation')}
                  onOpenJudgment={() => setActiveTab('judgment')}
                />
              )}

              <SpeakingQueue
                queue={speakingQueue}
                timer={timer}
                isJudge={isJudge}
                onRequestSpeak={() =>
                  broadcastMessage('REQUEST_SPEAK', {
                    participantId: currentParticipant.id,
                    participantName: currentParticipant.name,
                    role: currentParticipant.role,
                    subRole: currentParticipant.subRole
                  })
                }
                onGrantSpeak={(queueItemId, action) =>
                  broadcastMessage('GRANT_SPEAK', { queueItemId, action })
                }
                onUpdateTimer={(action, seconds) =>
                  broadcastMessage('UPDATE_TIMER', { action, seconds })
                }
                currentUserId={currentParticipant.id}
              />
            </div>
          </div>
        )}

        {activeTab === 'transcript' && (
          <StenographerPanel
            transcript={transcript}
            caseRecord={caseRecord}
            isListening={isStenographerActive}
            onToggleListening={handleToggleStenographer}
            onAddSegment={(text) =>
              broadcastMessage('ADD_TRANSCRIPT', {
                segment: {
                  id: `t-${Date.now()}`,
                  speakerId: currentParticipant.id,
                  speakerName: currentParticipant.name,
                  speakerRole: currentParticipant.role,
                  speakerSubRole: currentParticipant.subRole,
                  text,
                  timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
                  isFinal: true
                }
              })
            }
          />
        )}

        {activeTab === 'evidence' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5">
              <EvidenceManager
                evidenceList={evidenceList}
                activeEvidenceId={activeEvidenceId}
                isJudge={isJudge}
                userRole={currentParticipant.role}
                userSubRole={currentParticipant.subRole}
                userName={currentParticipant.name}
                onPresent={(id) => setActiveEvidenceId(id)}
                onSubmitEvidence={(item) => broadcastMessage('SUBMIT_EVIDENCE', { evidence: item })}
              />
            </div>

            <div className="lg:col-span-7">
              <DocumentViewer evidence={activeEvidence || null} />
            </div>
          </div>
        )}

        {activeTab === 'case' && (
          <CaseSummaryPanel
            caseRecord={caseRecord}
            transcript={transcript}
            evidenceList={evidenceList}
            judgment={judgment}
            onUpdateCaseRecord={(record) =>
              setCaseRecord((prev) => ({ ...prev, ...record }))
            }
          />
        )}

        {activeTab === 'evaluation' && isJudge && (
          <EvaluationPanel
            students={participants}
            caseRecord={caseRecord}
            judgeName={currentParticipant.name}
            evaluations={evaluations}
            onSubmitEvaluation={(evalItem) =>
              broadcastMessage('SUBMIT_EVALUATION', { evaluation: evalItem })
            }
          />
        )}

        {activeTab === 'judgment' && isJudge && (
          <JudgmentEditor
            caseRecord={caseRecord}
            judgment={judgment}
            judgeName={currentParticipant.name}
            onFinalize={(jRecord) => broadcastMessage('FINALIZE_JUDGMENT', { judgment: jRecord })}
          />
        )}

        {activeTab === 'timeline' && <HearingTimeline timeline={timeline} />}

        {activeTab === 'chat' && (
          <CourtroomChat
            messages={messages}
            currentUserId={currentParticipant.id}
            currentUserName={currentParticipant.name}
            currentUserRole={currentParticipant.role}
            onSendMessage={(msg) => broadcastMessage('SEND_CHAT', { message: msg })}
          />
        )}
      </main>

      {/* 3. BOTTOM CONTROL BAR */}
      <footer className="bg-white/95 border-t border-slate-200/90 p-3 sticky bottom-0 z-40 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Hardware & Hand Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleMic}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
                isMuted
                  ? 'bg-red-50 text-red-700 border-red-300'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              }`}
            >
              {isMuted ? <MicOff className="w-4 h-4 text-red-600" /> : <Mic className="w-4 h-4 text-emerald-600" />}
              <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Mic Active'}</span>
            </button>

            <button
              onClick={handleToggleVideo}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
                isVideoOff
                  ? 'bg-red-50 text-red-700 border-red-300'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              }`}
            >
              {isVideoOff ? <VideoOff className="w-4 h-4 text-red-600" /> : <Video className="w-4 h-4 text-emerald-600" />}
              <span className="hidden sm:inline">{isVideoOff ? 'Cam Off' : 'Cam Active'}</span>
            </button>

            <button
              onClick={handleToggleHand}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
                isHandRaised
                  ? 'bg-blue-100 text-blue-900 border-blue-400'
                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Hand className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">{isHandRaised ? 'Hand Raised' : 'Raise Hand'}</span>
            </button>
          </div>

          {/* Action Center Buttons */}
          <div className="flex items-center gap-2">
            {isAdvocate && (
              <button
                onClick={() => setIsObjectionModalOpen(true)}
                className="bg-red-600 hover:bg-red-500 text-white border border-red-500 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
              >
                <AlertTriangle className="w-4 h-4 text-amber-200 animate-pulse" />
                <span>RAISE OBJECTION</span>
              </button>
            )}

            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Share2 className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Invite Students</span>
            </button>

            <button
              onClick={() => setIsAiAssistantOpen(true)}
              className="bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="hidden sm:inline">AI Law Clerk</span>
            </button>

            <button
              onClick={onOpenPracticeMode}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5"
            >
              <Gavel className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Solo Practice</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <InviteStudentsModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        roomCode={roomCode}
        caseTitle={caseRecord.caseTitle}
      />

      {isObjectionModalOpen && (
        <ObjectionModal
          isOpen={isObjectionModalOpen}
          onClose={() => setIsObjectionModalOpen(false)}
          onSubmitObjection={(obj) => broadcastMessage('RAISE_OBJECTION', { objection: obj })}
          userParticipantId={currentParticipant.id}
          userName={currentParticipant.name}
          userSubRole={currentParticipant.subRole || 'petitioner'}
        />
      )}

      {isAiAssistantOpen && (
        <AICaseAssistant
          caseRecord={caseRecord}
          transcript={transcript}
          isOpen={isAiAssistantOpen}
          onClose={() => setIsAiAssistantOpen(false)}
        />
      )}
    </div>
  );
};
