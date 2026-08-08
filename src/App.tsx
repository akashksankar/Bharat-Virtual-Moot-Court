import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { JoinModal } from './components/JoinModal';
import { CreateRoomModal } from './components/CreateRoomModal';
import { CourtroomView } from './components/CourtroomView';
import { StudentPracticeMode } from './components/practice/StudentPracticeMode';
import { Participant, CaseRecord } from './types';
import { DEMO_CASE } from './data/demoData';

export function App() {
  const [viewState, setViewState] = useState<'landing' | 'courtroom' | 'practice'>('landing');
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [roomCode, setRoomCode] = useState('DEMO-482');

  const [currentParticipant, setCurrentParticipant] = useState<Participant>({
    id: 'user-demo-1',
    name: 'Akash Sankar',
    role: 'advocate',
    subRole: 'petitioner',
    isMuted: false,
    isVideoOff: false,
    isSpeaking: false,
    isHandRaised: false,
    connectionStatus: 'connected',
    joinedAt: Date.now()
  });

  const handleJoinRoom = (participantData: Partial<Participant>, code: string) => {
    setCurrentParticipant((prev) => ({ ...prev, ...participantData }));
    setRoomCode(code);
    setIsJoinModalOpen(false);
    setViewState('courtroom');
  };

  const handleCreateRoom = (
    caseData: Partial<CaseRecord>,
    hostName: string,
    hostRole: 'judge' | 'admin' = 'judge'
  ) => {
    const newCode = `SLP-${Math.floor(100 + Math.random() * 900)}`;
    setRoomCode(newCode);

    setCurrentParticipant({
      id: `${hostRole}-${Date.now()}`,
      name: hostName,
      role: hostRole,
      isMuted: false,
      isVideoOff: false,
      isSpeaking: false,
      isHandRaised: false,
      connectionStatus: 'connected',
      joinedAt: Date.now()
    });

    setIsCreateModalOpen(false);
    setViewState('courtroom');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200 selection:text-emerald-900 antialiased">
      {viewState === 'landing' && (
        <>
          <Navbar
            onOpenJoin={() => setIsJoinModalOpen(true)}
            onOpenCreate={() => setIsCreateModalOpen(true)}
            onOpenPractice={() => setViewState('practice')}
          />
          <LandingPage
            onOpenJoin={() => setIsJoinModalOpen(true)}
            onOpenCreate={() => setIsCreateModalOpen(true)}
            onOpenPractice={() => setViewState('practice')}
          />
        </>
      )}

      {viewState === 'courtroom' && (
        <CourtroomView
          roomCode={roomCode}
          currentParticipant={currentParticipant}
          onLeave={() => setViewState('landing')}
          onOpenPracticeMode={() => setViewState('practice')}
        />
      )}

      {viewState === 'practice' && (
        <StudentPracticeMode onExit={() => setViewState('landing')} />
      )}

      {/* Entry Modals */}
      <JoinModal
        initialRoomCode={roomCode}
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onJoin={handleJoinRoom}
      />

      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateRoom}
      />
    </div>
  );
}

export default App;
