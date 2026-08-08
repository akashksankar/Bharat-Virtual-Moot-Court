import React, { useState, useEffect, useRef } from 'react';
import {
  Gavel,
  Mic,
  MicOff,
  Send,
  Clock,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Volume2,
  VolumeX,
  Award
} from 'lucide-react';
import { CaseRecord, AdvocateSubRole } from '../../types';
import { DEMO_CASE } from '../../data/demoData';
import { SpeechStenographer } from '../../utils/speechRecognition';

interface StudentPracticeModeProps {
  onExit: () => void;
}

interface Exchange {
  id: string;
  sender: 'student' | 'judge';
  text: string;
  timestamp: string;
}

export const StudentPracticeMode: React.FC<StudentPracticeModeProps> = ({ onExit }) => {
  const [caseRecord] = useState<CaseRecord>(DEMO_CASE);
  const [studentRole, setStudentRole] = useState<AdvocateSubRole>('petitioner');
  const [studentName, setStudentName] = useState('Akash Sankar');
  const [exchanges, setExchanges] = useState<Exchange[]>([
    {
      id: 'e1',
      sender: 'judge',
      text: 'Satyameva Jayate. Moot Court Practice Session initialized before the Hon’ble Supreme Court Practice Bench. Counsel for the Petitioner, you have 10 minutes. You may begin your oral submissions on BNS Section 111 and BSA Section 61.',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false })
    }
  ]);

  const [inputSpeech, setInputSpeech] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);
  const [stenographer] = useState(() => new SpeechStenographer());
  const [timerSeconds, setTimerSeconds] = useState(600);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [loadingJudge, setLoadingJudge] = useState(false);

  // Helper for SpeechSynthesis Text-to-Speech
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window) || !isTtsEnabled) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*_#~`]/g, ''); // strip markdown
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      const voices = window.speechSynthesis.getVoices();
      const targetVoice = voices.find(
        (v) => v.lang.includes('en-IN') || v.lang.includes('en-GB') || v.lang.includes('en-US') || v.lang.startsWith('en')
      );
      if (targetVoice) utterance.voice = targetVoice;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  };

  useEffect(() => {
    // Initial welcome speech on load
    if (isTtsEnabled && exchanges.length > 0 && exchanges[0].sender === 'judge') {
      speakText(exchanges[0].text);
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const toggleListening = () => {
    if (isListening) {
      stenographer.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      if (!isTimerRunning) setIsTimerRunning(true);
      stenographer.start(
        (res) => {
          if (res.isFinal) {
            setInputSpeech((prev) => (prev ? prev + ' ' + res.transcript : res.transcript));
          }
        },
        (err) => console.warn('Practice speech error:', err)
      );
    }
  };

  const handleSubmitArgument = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputSpeech.trim() || loadingJudge) return;

    const text = inputSpeech.trim();
    setInputSpeech('');
    if (isListening) {
      stenographer.stop();
      setIsListening(false);
    }

    const studentExchange: Exchange = {
      id: `ex-${Date.now()}`,
      sender: 'student',
      text,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
    };

    setExchanges((prev) => [...prev, studentExchange]);
    setLoadingJudge(true);

    try {
      const historyPayload = exchanges.map((ex) => ({
        sender: ex.sender,
        text: ex.text
      }));

      const res = await fetch('/api/gemini/practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userSpeech: text,
          studentRole,
          history: historyPayload,
          caseRecord
        })
      });
      const data = await res.json();

      const judgeText = data.judgeResponse || 'Counsel, please address the core constitutional standing of your claim.';
      const judgeExchange: Exchange = {
        id: `judge-${Date.now()}`,
        sender: 'judge',
        text: judgeText,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
      };

      setExchanges((prev) => [...prev, judgeExchange]);
      speakText(judgeText);
    } catch (err) {
      console.error('Practice mode error:', err);
    } finally {
      setLoadingJudge(false);
    }
  };

  const formatTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-amber-50 p-6 flex flex-col max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-amber-900/40">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-amber-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="inline-flex items-center gap-1.5 text-purple-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> AI JUDGE STUDENT PRACTICE MODE
            </div>
            <h1 className="text-xl font-serif font-bold text-amber-100">
              Solo Argument Practice — {caseRecord.caseTitle}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const newTts = !isTtsEnabled;
              setIsTtsEnabled(newTts);
              if (!newTts && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
              isTtsEnabled
                ? 'bg-purple-950 text-purple-200 border-purple-500/50 shadow-md hover:bg-purple-900'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
            }`}
            title="Toggle AI Judge Voice Text-To-Speech"
          >
            {isTtsEnabled ? <Volume2 className="w-4 h-4 text-purple-300" /> : <VolumeX className="w-4 h-4" />}
            <span>{isTtsEnabled ? 'AI Voice ON' : 'AI Voice Muted'}</span>
          </button>

          <div className="bg-zinc-900 border border-amber-900/40 px-3.5 py-1.5 rounded-xl font-mono text-xs flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-zinc-400">REMAINING:</span>
            <span className="font-bold text-amber-300 text-sm">{formatTime(timerSeconds)}</span>
          </div>
        </div>
      </div>

      {/* Main Practice Stage Grid */}
      <div className="grid md:grid-cols-12 gap-6 flex-1">
        {/* Left Courtroom Bench Visualization */}
        <div className="md:col-span-5 bg-zinc-900/80 border border-amber-900/40 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="bg-gradient-to-b from-amber-950/90 to-zinc-950 border border-amber-600/50 rounded-xl p-4 text-center mb-4 shadow-xl">
              <div className="w-16 h-16 rounded-full bg-amber-900 border-2 border-amber-500 mx-auto mb-2 flex items-center justify-center text-amber-200 font-serif font-bold text-xl shadow-lg">
                <Gavel className="w-8 h-8 text-amber-300" />
              </div>
              <div className="font-serif font-bold text-amber-100 text-sm">Hon’ble Justice Prof. Anitha Menon (AI Bench)</div>
              <div className="text-[10px] text-amber-400 uppercase font-mono mt-0.5">
                Presiding Practice Bench
              </div>
            </div>

            {/* Case Facts Reference Card */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-xs font-serif leading-relaxed space-y-2">
              <div className="font-bold text-amber-300 font-sans uppercase tracking-wider text-[11px]">
                Case Issues Reference
              </div>
              <p className="text-zinc-300">{caseRecord.facts}</p>
            </div>
          </div>

          <div className="text-center text-xs text-zinc-500 font-mono italic">
            Speak orally using microphone or type your arguments below. The AI Judge will interrogate your claims in real time.
          </div>
        </div>

        {/* Right Interactive Transcript & Input */}
        <div className="md:col-span-7 bg-zinc-900/80 border border-amber-900/40 rounded-2xl p-5 flex flex-col justify-between h-[550px]">
          {/* Exchanges List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
            {exchanges.map((ex) => (
              <div
                key={ex.id}
                className={`p-3.5 rounded-xl border text-xs leading-relaxed font-serif ${
                  ex.sender === 'judge'
                    ? 'bg-amber-950/80 border-amber-600/60 text-amber-100 mr-6'
                    : 'bg-blue-950/80 border-blue-600/60 text-blue-100 ml-6'
                }`}
              >
                <div className="flex justify-between text-[10px] font-mono mb-1 font-bold">
                  <span className={ex.sender === 'judge' ? 'text-amber-300' : 'text-blue-300'}>
                    {ex.sender === 'judge' ? 'Hon’ble Justice Prof. Anitha Menon (AI BENCH)' : `${studentName} (ADVOCATE)`}
                  </span>
                  <span className="text-zinc-500">{ex.timestamp}</span>
                </div>
                <p>{ex.text}</p>
              </div>
            ))}

            {loadingJudge && (
              <div className="bg-amber-950/40 border border-amber-600/40 p-3 rounded-xl text-xs text-amber-300 font-mono animate-pulse flex items-center gap-2">
                <Gavel className="w-4 h-4 text-amber-400 animate-bounce" />
                Hon’ble Presiding Bench is formulating a legal inquiry...
              </div>
            )}
          </div>

          {/* Student Oral / Text Input Area */}
          <form onSubmit={handleSubmitArgument} className="mt-4 pt-3 border-t border-amber-900/30 space-y-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isListening
                    ? 'bg-red-950 text-red-300 border-red-600 animate-pulse'
                    : 'bg-zinc-950 text-emerald-400 border-zinc-800 hover:bg-zinc-900'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isListening ? 'Stop Mic' : 'Speak Mic'}</span>
              </button>

              <input
                type="text"
                value={inputSpeech}
                onChange={(e) => setInputSpeech(e.target.value)}
                placeholder="Type or speak your oral argument..."
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-amber-100 focus:outline-none focus:border-amber-500 font-serif"
              />

              <button
                type="submit"
                disabled={loadingJudge || !inputSpeech.trim()}
                className="bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold px-4 py-2.5 rounded-lg text-xs transition-colors flex items-center gap-1"
              >
                <span>Present</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
