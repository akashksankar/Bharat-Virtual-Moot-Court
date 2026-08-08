import React, { useState } from 'react';
import { Gavel, Save, Download, Lock, CheckCircle2 } from 'lucide-react';
import { JudgmentRecord, CaseRecord } from '../../types';

interface JudgmentEditorProps {
  caseRecord: CaseRecord;
  judgment?: JudgmentRecord;
  judgeName: string;
  onFinalize: (judgment: JudgmentRecord) => void;
}

export const JudgmentEditor: React.FC<JudgmentEditorProps> = ({
  caseRecord,
  judgment,
  judgeName,
  onFinalize
}) => {
  const [facts, setFacts] = useState(
    judgment?.facts || caseRecord.facts
  );
  const [issues, setIssues] = useState(
    judgment?.issues || caseRecord.issues.join('\n')
  );
  const [submissions, setSubmissions] = useState(
    judgment?.submissions ||
      'Learned Senior Counsel for the Petitioners submitted that Section 111 of Bharatiya Nyaya Sanhita (BNS), 2023 impermissibly restricts fundamental speech and liberty under Articles 19(1)(a) and 21. Learned ASG for the Union contended that state security under Article 19(2) justifies BNS Section 111 and that electronic evidence under BSA Section 61 strictly binds the parties.'
  );
  const [analysis, setAnalysis] = useState(
    judgment?.analysis ||
      'Applying the five-prong constitutional proportionality test laid down in K.S. Puttaswamy (9-Judge Bench) and Shreya Singhal v. Union of India, the Court holds that fundamental digital speech cannot be subjected to blanket criminal syndicate charges without clear statutory definition and pre-deprivation procedural oversight under BNSS 2023.'
  );
  const [findings, setFindings] = useState(
    judgment?.findings ||
      'Section 111 of BNS 2023 as applied to non-syndicate digital advocacy violates Article 19(1)(a). Electronic record certificates tendered under Section 61 of Bharatiya Sakshya Adhiniyam (BSA), 2023 satisfy mandatory statutory threshold.'
  );
  const [finalDecision, setFinalDecision] = useState(
    judgment?.finalDecision || 'SPECIAL LEAVE PETITION ALLOWED — JUDGMENT FOR THE PETITIONERS'
  );
  const [reasons, setReasons] = useState(
    judgment?.reasons ||
      'The invocation of BNS Section 111 against the Petitioners is hereby QUASHED. The Union of India is directed to issue standardized BNSS Section 187 enforcement protocols protecting citizen rights under Article 19(1)(a) and Article 21.'
  );

  const [isFinalized, setIsFinalized] = useState(judgment?.isFinalized || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const record: JudgmentRecord = {
      caseNumber: caseRecord.caseNumber,
      caseTitle: caseRecord.caseTitle,
      facts,
      issues,
      submissions,
      analysis,
      findings,
      finalDecision,
      reasons,
      isFinalized: true,
      finalizedAt: Date.now(),
      judgeSignature: `${judgeName}, Presiding Judge`
    };

    setIsFinalized(true);
    onFinalize(record);
  };

  return (
    <div className="bg-zinc-950 border border-amber-900/40 rounded-2xl p-6 text-amber-50 shadow-2xl space-y-5 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-amber-900/30">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-950 border border-amber-600/40 flex items-center justify-center text-amber-400">
            <Gavel className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-amber-100">Judicial Opinion & Verdict Editor</h2>
            <p className="text-xs text-zinc-400">Formulate official court ruling and legal reasons</p>
          </div>
        </div>

        {isFinalized && (
          <span className="bg-emerald-950 text-emerald-400 border border-emerald-700/60 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> VERDICT PRONOUNCED
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 font-serif text-xs">
        <div className="grid grid-cols-2 gap-3 bg-zinc-900 border border-zinc-800 p-3 rounded-xl font-mono text-[11px]">
          <div>
            <span className="text-zinc-500">Case No:</span>{' '}
            <span className="text-amber-200 font-bold">{caseRecord.caseNumber}</span>
          </div>
          <div>
            <span className="text-zinc-500">Title:</span>{' '}
            <span className="text-amber-200 font-bold">{caseRecord.caseTitle}</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-amber-200 font-sans uppercase tracking-wider mb-1">
            I. FACTS OF THE CASE
          </label>
          <textarea
            value={facts}
            onChange={(e) => setFacts(e.target.value)}
            disabled={isFinalized}
            rows={3}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-amber-100 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-amber-200 font-sans uppercase tracking-wider mb-1">
            II. ISSUES FOR DETERMINATION
          </label>
          <textarea
            value={issues}
            onChange={(e) => setIssues(e.target.value)}
            disabled={isFinalized}
            rows={2}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-amber-100 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-amber-200 font-sans uppercase tracking-wider mb-1">
            III. SUBMISSIONS & ARGUMENTS
          </label>
          <textarea
            value={submissions}
            onChange={(e) => setSubmissions(e.target.value)}
            disabled={isFinalized}
            rows={3}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-amber-100 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-amber-200 font-sans uppercase tracking-wider mb-1">
            IV. JUDICIAL ANALYSIS & APPLICATION OF LAW
          </label>
          <textarea
            value={analysis}
            onChange={(e) => setAnalysis(e.target.value)}
            disabled={isFinalized}
            rows={3}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-amber-100 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-amber-200 font-sans uppercase tracking-wider mb-1">
            V. FINAL VERDICT / RULING
          </label>
          <input
            type="text"
            value={finalDecision}
            onChange={(e) => setFinalDecision(e.target.value)}
            disabled={isFinalized}
            className="w-full bg-amber-950/80 border border-amber-600/50 font-bold rounded-lg p-3 text-amber-200 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-amber-200 font-sans uppercase tracking-wider mb-1">
            VI. DECREE & OPERATIVE ORDER
          </label>
          <textarea
            value={reasons}
            onChange={(e) => setReasons(e.target.value)}
            disabled={isFinalized}
            rows={3}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-amber-100 focus:outline-none"
          />
        </div>

        {!isFinalized && (
          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider font-sans transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>Pronounce Verdict & Lock Judgment</span>
          </button>
        )}
      </form>
    </div>
  );
};
