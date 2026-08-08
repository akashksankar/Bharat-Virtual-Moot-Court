import {
  CaseRecord,
  EvidenceItem,
  Participant,
  TranscriptSegment,
  ObjectionRecord,
  JudgeQuestion,
  TimelineEvent,
  RoomMessage,
  JudgmentRecord,
  StudentEvaluation
} from '../types';

export const DEMO_CASE: CaseRecord = {
  id: 'case-mc-2026-ind-01',
  caseNumber: 'SLP (Crl.) No. 8421 / 2026',
  caseTitle: 'Akash Sankar & Ors. v. Union of India',
  courtroomName: 'Moot Court Hall 1 — Hon’ble Supreme Court of India',
  judgeName: 'Hon’ble Justice Prof. Anitha Menon',
  date: 'August 8, 2026',
  subject: 'Constitutional Validity of BNS Section 111 & Electronic Record Admissibility under BSA Section 61',
  petitioner: 'Akash Sankar (Represented by Senior Advocate)',
  respondent: 'Union of India (Represented by Additional Solicitor General)',
  caseType: 'Special Leave Petition (Criminal) / National Law Moot Court Final',
  facts:
    'The Petitioner, Akash Sankar, challenges the invocation of Section 111 of the Bharatiya Nyaya Sanhita (BNS), 2023 (Organized Crime), alleging that decentralized digital message routing was improperly categorized as organized crime syndicate activity without prior judicial authorization under Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023. The Respondent, Union of India, contends that BNS Section 111 is a crucial penal instrument to combat national security threats and organized digital syndicates, and that evidence submitted under Bharatiya Sakshya Adhiniyam (BSA), 2023 Section 61 strictly satisfies statutory requirements.',
  issues: [
    'Whether Section 111 of Bharatiya Nyaya Sanhita (BNS), 2023 impermissibly restricts fundamental speech and personal liberty under Articles 19(1)(a) and 21 of the Constitution of India.',
    'Whether electronic record evidence submitted under Bharatiya Sakshya Adhiniyam (BSA), 2023 Section 61 satisfies mandatory certification standards (formerly Section 65B of Indian Evidence Act, 1872).',
    'Whether the transition from IPC Section 120B to BNS Section 111 can be applied to digital broadcasts initiated prior to July 1, 2024.'
  ],
  bnsSections: ['Section 111 (Organized Crime)', 'Section 356 (Defamation)', 'Section 152 (Acts endangering sovereignty)'],
  ipcSections: ['Section 120B (Criminal Conspiracy)', 'Section 499 (Defamation)', 'Section 124A (Sedition - former)'],
  bsaSections: ['Section 61 (Admissibility of Electronic Records)', 'Section 62 (Primary Evidence)'],
  constitutionArticles: ['Article 19(1)(a) (Freedom of Speech)', 'Article 21 (Right to Life & Liberty)', 'Article 32 (Writ Jurisdiction)'],
  petitionerArgumentsSummary:
    'Section 111 of Bharatiya Nyaya Sanhita (BNS), 2023 creates an overbroad dragnet by equating digital speech coordination with syndicate criminality. Under K.S. Puttaswamy v. Union of India and Shreya Singhal v. Union of India, state restrictions on digital communications must pass strict proportionality and narrow tailoring tests.',
  respondentArgumentsSummary:
    'The Union holds a compelling state interest under Article 19(2) to protect national sovereignty and public order. BNS Section 111 targets coordinated digital infrastructure disruption, and the mandatory electronic record certificates under BSA Section 61 guarantee evidentiary authenticity.'
};

export const DEMO_PARTICIPANTS: Participant[] = [
  {
    id: 'user-judge-1',
    name: 'Hon’ble Justice Prof. Anitha Menon',
    role: 'judge',
    isMuted: false,
    isVideoOff: false,
    isSpeaking: true,
    isHandRaised: false,
    connectionStatus: 'connected',
    joinedAt: Date.now() - 3600000,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-petitioner-1',
    name: 'Learned Sr. Adv. Akash Sankar',
    role: 'advocate',
    subRole: 'petitioner',
    isMuted: false,
    isVideoOff: false,
    isSpeaking: false,
    isHandRaised: true,
    connectionStatus: 'connected',
    joinedAt: Date.now() - 3000000,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-respondent-1',
    name: 'Learned ASG Rahul Kumar',
    role: 'advocate',
    subRole: 'respondent',
    isMuted: true,
    isVideoOff: false,
    isSpeaking: false,
    isHandRaised: false,
    connectionStatus: 'connected',
    joinedAt: Date.now() - 2800000,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-admin-1',
    name: 'Court Master & Registrar',
    role: 'admin',
    isMuted: true,
    isVideoOff: true,
    isSpeaking: false,
    isHandRaised: false,
    connectionStatus: 'connected',
    joinedAt: Date.now() - 3600000
  },
  {
    id: 'user-spectator-1',
    name: 'Meera Patel (NLSIU Bengaluru)',
    role: 'spectator',
    isMuted: true,
    isVideoOff: true,
    isSpeaking: false,
    isHandRaised: false,
    connectionStatus: 'connected',
    joinedAt: Date.now() - 1200000
  },
  {
    id: 'user-spectator-2',
    name: 'David Sharma (Faculty of Law, DU)',
    role: 'spectator',
    isMuted: true,
    isVideoOff: true,
    isSpeaking: false,
    isHandRaised: false,
    connectionStatus: 'connected',
    joinedAt: Date.now() - 900000
  }
];

export const DEMO_EVIDENCE: EvidenceItem[] = [
  {
    id: 'exhibit-p1',
    exhibitNumber: 'EXHIBIT P-01',
    title: 'BSA Section 61 Electronic Evidence Certificate & Forensics',
    submittedBy: 'Akash Sankar',
    submittedByRole: 'petitioner',
    fileType: 'pdf',
    description: 'Mandatory certificate under Section 61 of Bharatiya Sakshya Adhiniyam (BSA), 2023 certifying integrity of encrypted message logs and absence of syndicate malware.',
    textContent:
      'CERTIFICATE UNDER SECTION 61(2) OF BHARATIYA SAKSHYA ADHINIYAM (BSA), 2023\n\nI, Dr. V. R. Sharma, Senior Cyber Forensics Examiner, Cyber Crime Cell, New Delhi, do hereby certify:\n1. The digital device (Server Log Ref: DL-2025-998) was operating continuously under lawful custody.\n2. Hash value verification (SHA-256) confirms zero tamper activity during digital transmission.\n3. The flagged transmissions constitute citizen civic advocacy without organized syndicate criminal conspiracy under BNS Section 111.',
    status: 'admitted',
    uploadedAt: Date.now() - 2400000
  },
  {
    id: 'exhibit-p2',
    exhibitNumber: 'EXHIBIT P-02',
    title: 'Statutory Comparative Table: BNS 2023 vs. IPC 1860',
    submittedBy: 'Akash Sankar',
    submittedByRole: 'petitioner',
    fileType: 'text',
    description: 'Analytical comparative memorandum demonstrating overlap between BNS Section 111 and former IPC Section 120B / Unlawful Activities.',
    textContent:
      'COMPARATIVE STATUTORY ANALYSIS TABLE\n\n1. BNS Section 111 (Organized Crime) <---> Former IPC Section 120B (Criminal Conspiracy) + MCOCA Provisions.\n2. BSA Section 61 (Electronic Record Admissibility) <---> Former Indian Evidence Act Section 65B.\n3. BNSS Section 187 (Police Remand Rules) <---> Former CrPC Section 167.\n\nArgument: Retroactive penal imposition of BNS Section 111 to pre-2024 digital archives violates Article 20(1) of the Constitution of India.',
    status: 'admitted',
    uploadedAt: Date.now() - 1800000
  },
  {
    id: 'exhibit-d1',
    exhibitNumber: 'EXHIBIT D-01',
    title: 'Ministry of Home Affairs Threat Assessment Matrix',
    submittedBy: 'Rahul Kumar',
    submittedByRole: 'respondent',
    fileType: 'pdf',
    description: 'Official intelligence evaluation detailing cyber-syndicate network architecture targeting critical state communications under BNS Section 111.',
    textContent:
      'UNION OF INDIA - MINISTRY OF HOME AFFAIRS\nREPORT ON DIGITAL ORGANIZED CRIME SYNDICATES (2025-2026)\n\nExecutive Summary: Organized digital syndicates utilize bot networks to paralyze civic portals. Invocation of BNS Section 111 and BNSS emergency procedures was legally required to neutralize imminent threats to public order.',
    status: 'admitted',
    uploadedAt: Date.now() - 1500000
  }
];

export const DEMO_TRANSCRIPT: TranscriptSegment[] = [
  {
    id: 't-1',
    speakerId: 'user-judge-1',
    speakerName: 'Hon’ble Justice Prof. Anitha Menon',
    speakerRole: 'judge',
    text: 'Satyameva Jayate. The Moot Court Bench of the Hon’ble Supreme Court of India is now in session in Special Leave Petition (Criminal) No. 8421 of 2026. Learned Senior Counsel for the Petitioner, you may commence your submissions on the validity of BNS Section 111.',
    timestamp: '10:00:05',
    createdAt: Date.now() - 1200000,
    isFinal: true,
    confidence: 0.98
  },
  {
    id: 't-2',
    speakerId: 'user-petitioner-1',
    speakerName: 'Learned Sr. Adv. Akash Sankar',
    speakerRole: 'advocate',
    speakerSubRole: 'petitioner',
    text: 'May it please your Lordships. My name is Akash Sankar, appearing alongside co-counsel for the Petitioners. Today, we invoke Article 32 and SLP jurisdiction to protect fundamental rights guaranteed under Articles 19(1)(a) and 21 of the Constitution. Section 111 of the Bharatiya Nyaya Sanhita (BNS), 2023 impermissibly Criminalizes legitimate public advocacy by treating digital message networks as "Organized Crime Syndicates".',
    timestamp: '10:00:22',
    createdAt: Date.now() - 1180000,
    isFinal: true,
    confidence: 0.96
  },
  {
    id: 't-3',
    speakerId: 'user-judge-1',
    speakerName: 'Hon’ble Justice Prof. Anitha Menon',
    speakerRole: 'judge',
    text: 'Learned Counsel, let me pause you there. How do you respond to the Union’s submission that BNS Section 111 contains adequate statutory safeguards under Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023, and that state security falls strictly under Article 19(2) reasonable restrictions?',
    timestamp: '10:01:10',
    createdAt: Date.now() - 1100000,
    isFinal: true,
    confidence: 0.99
  },
  {
    id: 't-4',
    speakerId: 'user-petitioner-1',
    speakerName: 'Learned Sr. Adv. Akash Sankar',
    speakerRole: 'advocate',
    speakerSubRole: 'petitioner',
    text: 'My Lord, under the landmark ruling of Shreya Singhal v. Union of India and K.S. Puttaswamy v. Union of India, any state restriction must pass the constitutional test of proportionality. Section 111 of BNS lacks a clear definition of "digital syndicate support", causing a severe chilling effect. Furthermore, our Exhibit P-01 certificate under Bharatiya Sakshya Adhiniyam (BSA) Section 61 proves there was no illicit cyber conspiracy.',
    timestamp: '10:01:38',
    createdAt: Date.now() - 1050000,
    isFinal: true,
    confidence: 0.95,
    highlighted: true
  },
  {
    id: 't-5',
    speakerId: 'user-respondent-1',
    speakerName: 'Learned ASG Rahul Kumar',
    speakerRole: 'advocate',
    speakerSubRole: 'respondent',
    text: 'Objection, Your Lordship! Learned Counsel for the Petitioner is misconstruing the scope of BSA Section 61. Exhibit P-01 covers local device logs but omits primary syndicate server nodes under BSA Section 62.',
    timestamp: '10:02:15',
    createdAt: Date.now() - 1000000,
    isFinal: true,
    confidence: 0.94
  },
  {
    id: 't-6',
    speakerId: 'user-judge-1',
    speakerName: 'Hon’ble Justice Prof. Anitha Menon',
    speakerRole: 'judge',
    text: 'Objection overruled, Learned ASG. Counsel for the Petitioner is entitled to rely on the BSA Section 61 certificate admitted into evidence. You may address server node primary evidence during Union arguments.',
    timestamp: '10:02:30',
    createdAt: Date.now() - 980000,
    isFinal: true,
    confidence: 0.99
  }
];

export const DEMO_OBJECTIONS: ObjectionRecord[] = [
  {
    id: 'obj-1',
    raisedByParticipantId: 'user-respondent-1',
    raisedByParticipantName: 'Learned ASG Rahul Kumar',
    raisedByRole: 'respondent',
    type: 'Relevance',
    details: 'Scope of BSA Section 61 certificate versus BSA Section 62 primary server node evidence.',
    timestamp: '10:02:15',
    status: 'overruled',
    ruledByJudgeName: 'Hon’ble Justice Prof. Anitha Menon',
    createdAt: Date.now() - 1000000
  }
];

export const DEMO_JUDGE_QUESTIONS: JudgeQuestion[] = [
  {
    id: 'jq-1',
    judgeName: 'Hon’ble Justice Prof. Anitha Menon',
    directedTo: 'Petitioner Counsel',
    questionText: 'How does the doctrine of proportionality under Puttaswamy apply when contrasting BNS Section 111 with former IPC Section 120B and Special Acts?',
    timestamp: '10:01:10',
    isAnswered: true,
    answerText: 'Petitioner cited Shreya Singhal (2015) 5 SCC 1 and Anuradha Bhasin v. Union of India regarding digital speech restrictions.',
    createdAt: Date.now() - 1100000
  }
];

export const DEMO_TIMELINE: TimelineEvent[] = [
  {
    id: 'ev-1',
    title: 'Supreme Court Bench Assembled',
    description: 'Hon’ble Justice Prof. Anitha Menon declared Moot Court Session officially in session.',
    timestamp: '10:00:05',
    createdAt: Date.now() - 1200000,
    type: 'state_change',
    actorName: 'Hon’ble Justice Prof. Anitha Menon'
  },
  {
    id: 'ev-2',
    title: 'Petitioner Counsel Called',
    description: 'Learned Senior Counsel Akash Sankar granted 15 minutes floor for SLP arguments.',
    timestamp: '10:00:22',
    createdAt: Date.now() - 1180000,
    type: 'speaker_change',
    actorName: 'Akash Sankar'
  },
  {
    id: 'ev-3',
    title: 'Bench Interrogative Issued',
    description: 'Hon’ble Bench questioned proportionality of BNS Section 111 under Article 19(2).',
    timestamp: '10:01:10',
    createdAt: Date.now() - 1100000,
    type: 'question',
    actorName: 'Hon’ble Justice Prof. Anitha Menon'
  },
  {
    id: 'ev-4',
    title: 'BSA Section 61 Exhibit Tendered',
    description: 'Exhibit P-01 (Electronic Record Certificate u/s 61 BSA 2023) displayed on Courtroom Floor.',
    timestamp: '10:01:38',
    createdAt: Date.now() - 1050000,
    type: 'exhibit',
    actorName: 'Akash Sankar'
  },
  {
    id: 'ev-5',
    title: 'Objection Raised by Union Counsel',
    description: 'ASG Rahul Kumar objected on BSA Section 61 vs Section 62 evidentiary grounds.',
    timestamp: '10:02:15',
    createdAt: Date.now() - 1000000,
    type: 'objection',
    actorName: 'Rahul Kumar'
  },
  {
    id: 'ev-6',
    title: 'Objection Overruled',
    description: 'Bench overruled Union objection; Petitioner argument permitted to proceed.',
    timestamp: '10:02:30',
    createdAt: Date.now() - 980000,
    type: 'ruling',
    actorName: 'Hon’ble Justice Prof. Anitha Menon'
  }
];

export const DEMO_MESSAGES: RoomMessage[] = [
  {
    id: 'm-1',
    channel: 'courtroom',
    senderId: 'user-admin-1',
    senderName: 'Court Master & Registrar',
    senderRole: 'admin',
    text: 'Welcome to the Hon’ble Supreme Court Virtual Moot Court Hall 1. All proceedings follow official Indian Moot Court timing rules.',
    timestamp: '09:58:00'
  },
  {
    id: 'm-2',
    channel: 'judge-advocate',
    senderId: 'user-judge-1',
    senderName: 'Hon’ble Justice Prof. Anitha Menon',
    senderRole: 'judge',
    text: 'Learned Counsel, kindly ensure all citations cross-reference both Bharatiya Nyaya Sanhita (BNS) 2023 and former IPC 1860 provisions.',
    timestamp: '09:59:15'
  }
];

export const DEMO_EVALUATION: StudentEvaluation = {
  studentId: 'user-petitioner-1',
  studentName: 'Learned Sr. Adv. Akash Sankar',
  role: 'petitioner',
  scores: {
    legalKnowledge: 19,
    argumentStructure: 18,
    useOfAuthorities: 18,
    courtroomEtiquette: 15,
    responsiveness: 18,
    evidenceHandling: 14,
    persuasiveness: 18,
    timeManagement: 9
  },
  feedbacks: {
    legalKnowledge: 'Thorough mastery of BNS Section 111, IPC 120B, and Article 19(1)(a) jurisprudence.',
    argumentStructure: 'Exemplary division of constitutional vs evidentiary issues under BSA Section 61.',
    useOfAuthorities: 'Excellent invocation of Puttaswamy, Shreya Singhal, and Anuradha Bhasin precedent.',
    courtroomEtiquette: 'Impeccable deference to the Hon’ble Bench ("May it please your Lordships").',
    responsiveness: 'Answered Bench interrogatives directly with statutory accuracy.',
    evidenceHandling: 'Properly tendered BSA Section 61 certificate and met objection smoothly.',
    persuasiveness: 'Articulate oral delivery with poised advocate demeanor.',
    timeManagement: 'Paced well within the allocated 15-minute slot.'
  },
  totalScore: 129,
  maxTotalScore: 130,
  generalComments: 'Exceptional performance in Indian Constitutional & Criminal Law. Demonstrated clear understanding of BNS 2023 provisions and Supreme Court oral advocacy.',
  evaluatedAt: Date.now() - 300000,
  evaluatedBy: 'Hon’ble Justice Prof. Anitha Menon'
};

export const DEMO_JUDGMENT: JudgmentRecord = {
  caseNumber: 'SLP (Crl.) No. 8421 / 2026',
  caseTitle: 'Akash Sankar & Ors. v. Union of India',
  facts:
    'This Special Leave Petition arises out of the invocation of Section 111 of Bharatiya Nyaya Sanhita (BNS), 2023 against decentralized digital communications. Petitioners allege violation of Articles 19(1)(a) and 21 of the Constitution of India.',
  issues:
    '1. Does Section 111 of Bharatiya Nyaya Sanhita (BNS), 2023 suffer from constitutional overbreadth under Article 19(1)(a) and Article 21?\n2. Does electronic evidence tendered under BSA Section 61 satisfy the threshold for judicial admissibility without primary server node production?',
  submissions:
    'Learned Senior Counsel for Petitioner submitted that BNS Section 111 lacks narrow tailoring and creates an impermissible chilling effect on digital speech. Learned ASG for the Union submitted that state security under Article 19(2) justifies BNS Section 111 enforcement.',
  analysis:
    'Applying the five-prong proportionality test articulated in K.S. Puttaswamy (9-Judge Bench) and Shreya Singhal, this Court holds that fundamental freedom of speech in digital spaces cannot be curtailed without narrow statutory precision. While state security is a legitimate objective under Article 19(2), applying BNS Section 111 without prior judicial warrant or clear syndicate definitions exceeds constitutional bounds.',
  findings:
    'Section 111 of BNS 2023 as applied to non-syndicate citizen communications is unconstitutional. Electronic evidence tendered with a valid BSA Section 61 certificate is fully admissible in law.',
  finalDecision: 'SPECIAL LEAVE PETITION ALLOWED. JUDGMENT FOR THE PETITIONERS.',
  reasons:
    'The invocation of BNS Section 111 against Petitioners is QUASHED. The Union is directed to frame clear procedural guidelines under BNSS Section 187 to protect constitutional rights under Article 19(1)(a) and Article 21.',
  isFinalized: true,
  finalizedAt: Date.now() - 100000,
  judgeSignature: 'Hon’ble Justice Prof. Anitha Menon, Presiding Bench'
};

