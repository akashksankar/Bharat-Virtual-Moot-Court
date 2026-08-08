export type UserRole = 'judge' | 'admin' | 'advocate' | 'spectator';

export type AdvocateSubRole = 'petitioner' | 'respondent' | 'prosecution' | 'defense';

export type CourtroomState =
  | 'WAITING'
  | 'COURT_OPEN'
  | 'JUDGE_SPEAKING'
  | 'ADVOCATE_SPEAKING'
  | 'EVIDENCE_PRESENTATION'
  | 'RECESS'
  | 'DELIBERATION'
  | 'JUDGMENT'
  | 'CLOSED';

export type ObjectionType =
  | 'Relevance'
  | 'Hearsay'
  | 'Leading'
  | 'Speculation'
  | 'Argumentative'
  | 'Improper Question'
  | 'Other';

export type ObjectionStatus = 'pending' | 'sustained' | 'overruled';

export interface Participant {
  id: string;
  name: string;
  role: UserRole;
  subRole?: AdvocateSubRole;
  isMuted: boolean;
  isVideoOff: boolean;
  isSpeaking: boolean;
  isHandRaised: boolean;
  connectionStatus: 'connected' | 'connecting' | 'reconnecting' | 'disconnected';
  joinedAt: number;
  avatarUrl?: string;
  peerId?: string;
}

export interface SpeakingQueueItem {
  id: string;
  participantId: string;
  participantName: string;
  role: UserRole;
  subRole?: AdvocateSubRole;
  requestedAt: number;
  status: 'pending' | 'speaking' | 'completed' | 'denied';
}

export interface CaseRecord {
  id: string;
  caseNumber: string;
  caseTitle: string;
  courtroomName: string;
  judgeName: string;
  date: string;
  subject: string;
  petitioner: string;
  respondent: string;
  caseType: string;
  facts: string;
  issues: string[];
  bnsSections?: string[];
  ipcSections?: string[];
  bsaSections?: string[];
  constitutionArticles?: string[];
  petitionerArgumentsSummary?: string;
  respondentArgumentsSummary?: string;
  aiSummary?: string;
  finalDecision?: string;
}

export interface EvidenceItem {
  id: string;
  exhibitNumber: string; // e.g. EXHIBIT P-01
  title: string;
  submittedBy: string;
  submittedByRole: AdvocateSubRole | UserRole;
  fileType: 'pdf' | 'image' | 'text' | 'docx';
  fileUrl?: string;
  textContent?: string;
  description: string;
  status: 'pending' | 'admitted' | 'rejected';
  isPresenting?: boolean;
  uploadedAt: number;
}

export interface TranscriptSegment {
  id: string;
  speakerId: string;
  speakerName: string;
  speakerRole: UserRole;
  speakerSubRole?: AdvocateSubRole;
  text: string;
  timestamp: string; // HH:MM:SS
  createdAt: number;
  isFinal: boolean;
  confidence?: number;
  highlighted?: boolean;
}

export interface ObjectionRecord {
  id: string;
  raisedByParticipantId: string;
  raisedByParticipantName: string;
  raisedByRole: AdvocateSubRole;
  type: ObjectionType;
  details?: string;
  timestamp: string;
  status: ObjectionStatus;
  ruledByJudgeName?: string;
  createdAt: number;
}

export interface JudgeQuestion {
  id: string;
  judgeName: string;
  directedTo?: string; // Participant name or 'Petitioner' / 'Respondent'
  questionText: string;
  timestamp: string;
  isAnswered: boolean;
  answerText?: string;
  createdAt: number;
}

export interface EvaluationCategory {
  key: string;
  name: string;
  maxScore: number;
  score: number;
  feedback: string;
}

export interface StudentEvaluation {
  studentId: string;
  studentName: string;
  role: AdvocateSubRole;
  scores: Record<string, number>;
  feedbacks: Record<string, string>;
  totalScore: number;
  maxTotalScore: number;
  generalComments: string;
  evaluatedAt: number;
  evaluatedBy: string;
}

export interface RoomMessage {
  id: string;
  channel: 'courtroom' | 'judge-advocate' | 'admin' | 'evidence';
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  createdAt: number;
  type: 'state_change' | 'speaker_change' | 'exhibit' | 'objection' | 'question' | 'ruling' | 'join_leave';
  actorName?: string;
}

export interface JudgmentRecord {
  caseNumber: string;
  caseTitle: string;
  facts: string;
  issues: string;
  submissions: string;
  analysis: string;
  findings: string;
  finalDecision: string;
  reasons: string;
  isFinalized: boolean;
  finalizedAt?: number;
  judgeSignature: string;
}

export interface ArgumentTimerState {
  currentSpeakerName?: string;
  currentSpeakerRole?: string;
  durationSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  modeName: string; // e.g. "Petitioner Opening Argument"
}

export interface CourtroomRoomData {
  roomCode: string;
  state: CourtroomState;
  caseRecord: CaseRecord;
  participants: Participant[];
  speakingQueue: SpeakingQueueItem[];
  activeSpeakerId?: string;
  evidenceList: EvidenceItem[];
  activeEvidenceId?: string;
  transcript: TranscriptSegment[];
  objections: ObjectionRecord[];
  judgeQuestions: JudgeQuestion[];
  timeline: TimelineEvent[];
  messages: RoomMessage[];
  timer: ArgumentTimerState;
  recording: boolean;
  evaluations: Record<string, StudentEvaluation>;
  judgment?: JudgmentRecord;
  openCourtAudio: boolean;
  advocateMicsEnabled: boolean;
  spectatorMicsEnabled: boolean;
}
