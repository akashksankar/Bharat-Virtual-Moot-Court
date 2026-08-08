import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import {
  CourtroomRoomData,
  Participant,
  TranscriptSegment,
  ObjectionRecord,
  JudgeQuestion,
  EvidenceItem,
  StudentEvaluation,
  JudgmentRecord,
  RoomMessage,
  TimelineEvent,
  CourtroomState,
  SpeakingQueueItem
} from './src/types';
import {
  DEMO_CASE,
  DEMO_PARTICIPANTS,
  DEMO_EVIDENCE,
  DEMO_TRANSCRIPT,
  DEMO_OBJECTIONS,
  DEMO_JUDGE_QUESTIONS,
  DEMO_TIMELINE,
  DEMO_MESSAGES,
  DEMO_EVALUATION,
  DEMO_JUDGMENT
} from './src/data/demoData';

const app = express();
app.use(express.json({ limit: '10mb' }));
const httpServer = createServer(app);
const PORT = 3000;

// Gemini API Server Initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

// In-Memory Courtroom State Store
const rooms: Record<string, CourtroomRoomData> = {};

// Helper to initialize or fetch a room
function getOrCreateRoom(roomCode: string): CourtroomRoomData {
  const code = roomCode.toUpperCase().trim();
  if (!rooms[code]) {
    // If demo room or new room
    if (code === 'DEMO-482' || code === 'ABC-482' || code === 'DEMO') {
      rooms[code] = {
        roomCode: code,
        state: 'COURT_OPEN',
        caseRecord: { ...DEMO_CASE },
        participants: [...DEMO_PARTICIPANTS],
        speakingQueue: [],
        activeSpeakerId: 'user-judge-1',
        evidenceList: [...DEMO_EVIDENCE],
        activeEvidenceId: 'exhibit-p1',
        transcript: [...DEMO_TRANSCRIPT],
        objections: [...DEMO_OBJECTIONS],
        judgeQuestions: [...DEMO_JUDGE_QUESTIONS],
        timeline: [...DEMO_TIMELINE],
        messages: [...DEMO_MESSAGES],
        timer: {
          currentSpeakerName: 'Prof. Anitha Menon',
          currentSpeakerRole: 'Judge',
          durationSeconds: 600,
          remainingSeconds: 420,
          isRunning: true,
          modeName: 'Judge Remarks'
        },
        recording: true,
        evaluations: { 'user-petitioner-1': DEMO_EVALUATION },
        judgment: { ...DEMO_JUDGMENT },
        openCourtAudio: true,
        advocateMicsEnabled: true,
        spectatorMicsEnabled: false
      };
    } else {
      rooms[code] = {
        roomCode: code,
        state: 'WAITING',
        caseRecord: {
          id: `case-${Date.now()}`,
          caseNumber: `MC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
          caseTitle: 'Moot Court Appeal',
          courtroomName: `Courtroom ${code}`,
          judgeName: 'Presiding Judge',
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          subject: 'Legal Advocacy & Constitutional Law',
          petitioner: 'Petitioner Counsel',
          respondent: 'Respondent Counsel',
          caseType: 'Moot Court Session',
          facts: 'Case details to be presented by participating counsel.',
          issues: ['Whether procedural requirements were met in the initial proceedings.']
        },
        participants: [],
        speakingQueue: [],
        evidenceList: [],
        transcript: [],
        objections: [],
        judgeQuestions: [],
        timeline: [
          {
            id: `ev-${Date.now()}`,
            title: 'Courtroom Initialized',
            description: `Courtroom ${code} was generated and is waiting for the Judge to open proceedings.`,
            timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
            createdAt: Date.now(),
            type: 'state_change'
          }
        ],
        messages: [],
        timer: {
          durationSeconds: 600,
          remainingSeconds: 600,
          isRunning: false,
          modeName: 'Opening Arguments'
        },
        recording: false,
        evaluations: {},
        openCourtAudio: true,
        advocateMicsEnabled: true,
        spectatorMicsEnabled: false
      };
    }
  }
  return rooms[code];
}

// WebSocket Server for Real-Time Sync & Signaling
const wss = new WebSocketServer({ server: httpServer });

interface ExtendedWebSocket extends WebSocket {
  roomCode?: string;
  participantId?: string;
}

function broadcastToRoom(roomCode: string, payload: any, senderWs?: WebSocket) {
  const code = roomCode.toUpperCase().trim();
  wss.clients.forEach((client) => {
    const extWs = client as ExtendedWebSocket;
    if (extWs.readyState === WebSocket.OPEN && extWs.roomCode === code) {
      if (!senderWs || extWs !== senderWs) {
        extWs.send(JSON.stringify(payload));
      }
    }
  });
}

wss.on('connection', (ws: ExtendedWebSocket) => {
  ws.on('message', (messageData: string) => {
    try {
      const data = JSON.parse(messageData.toString());
      const { type, roomCode, participant } = data;

      if (!roomCode) return;
      const code = roomCode.toUpperCase().trim();
      const room = getOrCreateRoom(code);

      switch (type) {
        case 'JOIN_ROOM': {
          if (!participant || !participant.id) break;
          ws.roomCode = code;
          ws.participantId = participant.id;

          // Check if participant already exists or update
          const existingIdx = room.participants.findIndex((p) => p.id === participant.id);
          if (existingIdx >= 0) {
            room.participants[existingIdx] = { ...room.participants[existingIdx], ...participant, connectionStatus: 'connected' };
          } else {
            room.participants.push({ ...participant, connectionStatus: 'connected' });
          }

          // Add timeline event
          room.timeline.push({
            id: `ev-${Date.now()}`,
            title: `${participant.name} Joined`,
            description: `${participant.name} entered the courtroom as ${participant.role.toUpperCase()}${participant.subRole ? ` (${participant.subRole})` : ''}.`,
            timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
            createdAt: Date.now(),
            type: 'join_leave',
            actorName: participant.name
          });

          // Send current full room state back to joining client
          ws.send(JSON.stringify({ type: 'ROOM_STATE', room }));

          // Broadcast user joined to other room participants
          broadcastToRoom(code, { type: 'PARTICIPANT_JOINED', participant, room }, ws);
          break;
        }

        case 'UPDATE_STATE': {
          const { state } = data;
          if (state) {
            room.state = state as CourtroomState;
            room.timeline.push({
              id: `ev-${Date.now()}`,
              title: `Courtroom State: ${String(state).replace(/_/g, ' ')}`,
              description: `The Judge updated the courtroom state to ${state}.`,
              timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
              createdAt: Date.now(),
              type: 'state_change'
            });
            broadcastToRoom(code, { type: 'STATE_UPDATED', state, room });
          }
          break;
        }

        case 'UPDATE_PARTICIPANT': {
          const participantId = data.participantId || ws.participantId;
          const updates = data.updates || {};
          if (participantId) {
            const target = room.participants.find((p) => p.id === participantId);
            if (target) {
              Object.assign(target, updates);
              broadcastToRoom(code, { type: 'PARTICIPANT_UPDATED', participantId, updates, participant: target, room });
            }
          }
          break;
        }

        case 'SIGNAL': {
          // Relays WebRTC signaling (offer, answer, candidate) to target participant
          const targetParticipantId = data.targetParticipantId || data.targetId;
          const signalData = data.signalData || data.signal;
          const senderId = ws.participantId || data.senderId || data.fromParticipantId;

          if (targetParticipantId) {
            wss.clients.forEach((client) => {
              const extWs = client as ExtendedWebSocket;
              if (
                extWs.readyState === WebSocket.OPEN &&
                extWs.roomCode === code &&
                extWs.participantId === targetParticipantId
              ) {
                extWs.send(
                  JSON.stringify({
                    type: 'SIGNAL',
                    senderId,
                    fromParticipantId: senderId,
                    signal: signalData,
                    signalData
                  })
                );
              }
            });
          }
          break;
        }

        case 'TOGGLE_MUTE': {
          const participantId = data.participantId || ws.participantId;
          const isMuted = data.isMuted ?? data.updates?.isMuted;
          if (participantId) {
            const target = room.participants.find((p) => p.id === participantId);
            if (target) {
              target.isMuted = !!isMuted;
              broadcastToRoom(code, { type: 'PARTICIPANT_MUTED', participantId, isMuted: target.isMuted, room });
            }
          }
          break;
        }

        case 'MUTE_ALL': {
          room.participants.forEach((p) => {
            if (p.role !== 'judge') {
              p.isMuted = true;
            }
          });
          broadcastToRoom(code, { type: 'MUTE_ALL', room });
          break;
        }

        case 'TOGGLE_VIDEO': {
          const participantId = data.participantId || ws.participantId;
          const isVideoOff = data.isVideoOff ?? data.updates?.isVideoOff;
          if (participantId) {
            const target = room.participants.find((p) => p.id === participantId);
            if (target) {
              target.isVideoOff = !!isVideoOff;
              broadcastToRoom(code, { type: 'PARTICIPANT_VIDEO_TOGGLED', participantId, isVideoOff: target.isVideoOff, room });
            }
          }
          break;
        }

        case 'REQUEST_SPEAK': {
          const pId = data.item?.participantId || data.participantId || ws.participantId;
          if (pId) {
            const queueItem = data.item || {
              id: `spk-${Date.now()}`,
              participantId: pId,
              participantName: data.participantName || (room.participants.find((p) => p.id === pId)?.name || 'Advocate'),
              role: data.role || 'advocate',
              subRole: data.subRole,
              status: 'pending',
              requestedAt: Date.now()
            };
            if (!room.speakingQueue.some((q) => q.participantId === pId && q.status === 'pending')) {
              room.speakingQueue.push(queueItem);
              broadcastToRoom(code, { type: 'SPEAKING_QUEUE_UPDATED', queue: room.speakingQueue, room });
            }
          }
          break;
        }

        case 'GRANT_SPEAK': {
          const { queueItemId, action } = data; // 'allow' or 'deny'
          const itemIdx = room.speakingQueue.findIndex((q) => q.id === queueItemId);
          if (itemIdx >= 0) {
            const queueItem = room.speakingQueue[itemIdx];
            if (action === 'allow') {
              queueItem.status = 'speaking';
              room.activeSpeakerId = queueItem.participantId;
              room.participants.forEach((p) => {
                p.isSpeaking = p.id === queueItem.participantId;
                if (p.id === queueItem.participantId) {
                  p.isMuted = false;
                }
              });
              room.timer.currentSpeakerName = queueItem.participantName;
              room.timer.currentSpeakerRole = queueItem.subRole || queueItem.role;
              room.timer.remainingSeconds = room.timer.durationSeconds;
              room.timer.isRunning = true;

              room.timeline.push({
                id: `ev-${Date.now()}`,
                title: `${queueItem.participantName} Granted Floor`,
                description: `${queueItem.participantName} was granted the floor by the Judge.`,
                timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
                createdAt: Date.now(),
                type: 'speaker_change',
                actorName: queueItem.participantName
              });
            } else {
              queueItem.status = 'denied';
            }
            broadcastToRoom(code, { type: 'SPEAKING_GRANTED', queue: room.speakingQueue, room });
          }
          break;
        }

        case 'UPDATE_TIMER': {
          const { action, seconds, currentSpeakerRole, modeName } = data;
          if (action === 'start') room.timer.isRunning = true;
          else if (action === 'pause') room.timer.isRunning = false;
          else if (action === 'reset') {
            room.timer.isRunning = false;
            room.timer.remainingSeconds = seconds || room.timer.durationSeconds;
          } else if (action === 'set_duration' && typeof seconds === 'number') {
            room.timer.durationSeconds = seconds;
            room.timer.remainingSeconds = seconds;
          }
          if (currentSpeakerRole) room.timer.currentSpeakerRole = currentSpeakerRole;
          if (modeName) room.timer.modeName = modeName;

          broadcastToRoom(code, { type: 'TIMER_UPDATED', timer: room.timer, room });
          break;
        }

        case 'RAISE_OBJECTION': {
          const { objection } = data;
          if (objection) {
            room.objections.unshift(objection);
            room.timeline.push({
              id: `ev-${Date.now()}`,
              title: `Objection Raised: ${objection.type}`,
              description: `${objection.raisedByParticipantName} raised an objection on grounds of ${objection.type}.`,
              timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
              createdAt: Date.now(),
              type: 'objection',
              actorName: objection.raisedByParticipantName
            });
            broadcastToRoom(code, { type: 'OBJECTION_RAISED', objection, room });
          }
          break;
        }

        case 'RULE_OBJECTION': {
          const { objectionId, status } = data; // 'sustained' or 'overruled'
          const judgeName = data.judgeName || 'Hon’ble Bench';
          const obj = room.objections.find((o) => o.id === objectionId);
          if (obj) {
            obj.status = status;
            obj.ruledByJudgeName = judgeName;
            room.timeline.push({
              id: `ev-${Date.now()}`,
              title: `Objection ${status.toUpperCase()}`,
              description: `Judge ${judgeName} ruled: Objection ${status}.`,
              timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
              createdAt: Date.now(),
              type: 'ruling',
              actorName: judgeName
            });
            broadcastToRoom(code, { type: 'OBJECTION_RULED', objection: obj, room });
          }
          break;
        }

        case 'ISSUE_QUESTION': {
          const { question } = data;
          if (question) {
            room.judgeQuestions.unshift(question);
            room.timeline.push({
              id: `ev-${Date.now()}`,
              title: 'Judge Interrogation Question',
              description: `Judge asked: "${question.questionText}"`,
              timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
              createdAt: Date.now(),
              type: 'question',
              actorName: question.judgeName
            });
            broadcastToRoom(code, { type: 'QUESTION_ISSUED', question, room });
          }
          break;
        }

        case 'ADD_TRANSCRIPT': {
          const { segment } = data;
          if (segment) {
            room.transcript.push(segment);
            broadcastToRoom(code, { type: 'TRANSCRIPT_ADDED', segment, room });
          }
          break;
        }

        case 'PRESENT_EVIDENCE': {
          const { evidenceId } = data;
          room.activeEvidenceId = evidenceId;
          const ev = room.evidenceList.find((e) => e.id === evidenceId);
          if (ev) {
            room.timeline.push({
              id: `ev-${Date.now()}`,
              title: `${ev.exhibitNumber} Displayed`,
              description: `Exhibit ${ev.exhibitNumber} (${ev.title}) is now displayed on the courtroom floor.`,
              timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
              createdAt: Date.now(),
              type: 'exhibit',
              actorName: ev.submittedBy
            });
          }
          broadcastToRoom(code, { type: 'EVIDENCE_PRESENTED', evidenceId, room });
          break;
        }

        case 'SUBMIT_EVIDENCE': {
          const item = data.evidence || data.item;
          if (item) {
            room.evidenceList.push(item);
            broadcastToRoom(code, { type: 'EVIDENCE_SUBMITTED', item, room });
          }
          break;
        }

        case 'SEND_CHAT':
        case 'SEND_MESSAGE': {
          const message = data.message;
          if (message) {
            room.messages.push(message);
            broadcastToRoom(code, { type: 'MESSAGE_RECEIVED', message, room });
          }
          break;
        }

        case 'SUBMIT_EVALUATION': {
          const { evaluation } = data;
          room.evaluations[evaluation.studentId] = evaluation;
          broadcastToRoom(code, { type: 'EVALUATION_UPDATED', evaluation, room });
          break;
        }

        case 'FINALIZE_JUDGMENT': {
          const { judgment } = data;
          room.judgment = judgment;
          room.state = 'JUDGMENT';
          room.timeline.push({
            id: `ev-${Date.now()}`,
            title: 'Final Judgment Pronounced',
            description: `Presiding Judge finalized and signed the legal opinion: ${judgment.finalDecision}`,
            timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
            createdAt: Date.now(),
            type: 'ruling',
            actorName: judgment.judgeSignature
          });
          broadcastToRoom(code, { type: 'JUDGMENT_FINALIZED', judgment, room });
          break;
        }

        case 'UPDATE_CASE_RECORD': {
          const { caseRecord } = data;
          room.caseRecord = { ...room.caseRecord, ...caseRecord };
          broadcastToRoom(code, { type: 'CASE_RECORD_UPDATED', caseRecord: room.caseRecord, room });
          break;
        }

        default:
          break;
      }
    } catch (err) {
      console.error('Error handling WS message:', err);
    }
  });

  ws.on('close', () => {
    if (ws.roomCode && ws.participantId) {
      const room = rooms[ws.roomCode];
      if (room) {
        const participant = room.participants.find((p) => p.id === ws.participantId);
        if (participant) {
          participant.connectionStatus = 'disconnected';
          room.timeline.push({
            id: `ev-${Date.now()}`,
            title: `${participant.name} Disconnected`,
            description: `${participant.name} left the courtroom session.`,
            timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
            createdAt: Date.now(),
            type: 'join_leave',
            actorName: participant.name
          });
          broadcastToRoom(ws.roomCode, { type: 'PARTICIPANT_DISCONNECTED', participantId: ws.participantId, room });
        }
      }
    }
  });
});

// REST API Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// GET Room state via HTTP
app.get('/api/room/:code', (req, res) => {
  const code = req.params.code.toUpperCase().trim();
  const room = getOrCreateRoom(code);
  res.json(room);
});

// AI Case Summary API
app.post('/api/gemini/summary', async (req, res) => {
  try {
    const { caseRecord, transcript, evidence } = req.body;
    const transcriptText = transcript.map((t: any) => `[${t.speakerName} (${t.speakerRole})]: ${t.text}`).join('\n');
    const evidenceText = evidence.map((e: any) => `${e.exhibitNumber}: ${e.title} - ${e.description}`).join('\n');

    const prompt = `You are a Senior Judicial Clerk analyzing a moot court hearing transcript.
Case Title: ${caseRecord.caseTitle}
Case Number: ${caseRecord.caseNumber}
Facts: ${caseRecord.facts}

Evidence Exhibits:
${evidenceText}

Hearing Transcript:
${transcriptText}

Generate a concise, authoritative legal summary with 3 sections:
1. PETITIONER CORE ARGUMENTS:
2. RESPONDENT CORE ARGUMENTS:
3. JUDGE INQUIRIES & CRITICAL ISSUES:

Keep language legal, professional, and directly rooted in the transcript.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt
    });

    res.json({ summary: response.text });
  } catch (err: any) {
    console.error('Gemini Summary Error:', err);
    res.status(500).json({ error: 'Failed to generate AI summary: ' + err.message });
  }
});

// AI Hearing Analysis Endpoint
app.post('/api/gemini/analysis', async (req, res) => {
  try {
    const { transcript, objections, judgeQuestions } = req.body;
    const transcriptText = transcript.map((t: any) => `[${t.timestamp}] ${t.speakerName} (${t.speakerRole}): ${t.text}`).join('\n');

    const prompt = `Analyze this courtroom hearing transcript as an expert legal educator:
Transcript:
${transcriptText}

Provide structured feedback:
- Strongest Arguments
- Weakest / Unsupported Arguments
- Key Legal Precedents Referenced or Omitted
- Student Performance Insights

Return response as clean, structured legal education analysis.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt
    });

    res.json({ analysis: response.text });
  } catch (err: any) {
    console.error('Gemini Analysis Error:', err);
    res.status(500).json({ error: 'Failed to generate analysis: ' + err.message });
  }
});

// AI Case Assistant for Judge
app.post('/api/gemini/assistant', async (req, res) => {
  try {
    const { query, caseRecord, transcript } = req.body;
    const transcriptText = transcript.map((t: any) => `[${t.speakerName}]: ${t.text}`).join('\n');

    const prompt = `You are an AI Law Clerk assisting Presiding Judge ${caseRecord.judgeName} in the case "${caseRecord.caseTitle}".
Case Facts: ${caseRecord.facts}
Transcript History:
${transcriptText}

Answer the Judge's query clearly and concisely based strictly on the case facts and transcript:
Judge Query: "${query}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt
    });

    res.json({ answer: response.text });
  } catch (err: any) {
    console.error('Gemini Assistant Error:', err);
    res.status(500).json({ error: 'Failed to query assistant: ' + err.message });
  }
});

// Student Practice Mode - AI Judge Simulation
app.post('/api/gemini/practice', async (req, res) => {
  try {
    const { userSpeech, studentRole, history, caseRecord } = req.body;

    const historyFormatted = (history || [])
      .map((h: any) => `${h.sender.toUpperCase()}: ${h.text}`)
      .join('\n');

    const prompt = `You are simulating Presiding Judge Hon’ble Justice Prof. Anitha Menon in a realistic Indian moot court competition (Supreme Court of India / NLU Division).
Case Title: ${caseRecord.caseTitle}
Case Issues: ${caseRecord.issues.join('; ')}
Relevant Laws: BNS 2023, IPC 1860, BNSS 2023, BSA 2023 & Indian Constitution Articles 19(1)(a) and 21.
Student Role: ${studentRole.toUpperCase()} COUNSEL

Dialogue History:
${historyFormatted}

Student Counsel's Latest Argument:
"${userSpeech}"

Respond as Hon’ble Presiding Judge:
1. Act with judicial authority, dignified Indian court etiquette ("Learned Counsel"), and sharp legal inquiry.
2. Ask a precise legal question on BNS 2023, BSA Section 61 electronic evidence certificates, or Supreme Court precedents (e.g. Shreya Singhal, Puttaswamy).
3. Keep response under 90 words so it sounds like a live spoken Bench intervention.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt
    });

    res.json({ judgeResponse: response.text });
  } catch (err: any) {
    console.error('Gemini Practice Error:', err);
    res.status(500).json({ error: 'Failed to process practice mode: ' + err.message });
  }
});

// Serve Vite in Development or Static Files in Production
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Virtual Courtroom server listening on port http://0.0.0.0:${PORT}`);
  });
}

start();
