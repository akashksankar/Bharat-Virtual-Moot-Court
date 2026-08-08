import React, { useState } from 'react';
import { Award, Save, Download, CheckCircle2, UserCheck } from 'lucide-react';
import { StudentEvaluation, CaseRecord, AdvocateSubRole, Participant } from '../../types';
import { exportEvaluationPDF } from '../../utils/pdfExport';

interface EvaluationPanelProps {
  students: Participant[];
  caseRecord: CaseRecord;
  judgeName: string;
  evaluations: Record<string, StudentEvaluation>;
  onSubmitEvaluation: (evaluation: StudentEvaluation) => void;
}

const CATEGORIES = [
  { key: 'legalKnowledge', name: 'Legal Knowledge & Concepts', max: 20 },
  { key: 'argumentStructure', name: 'Argument Structure & Logic', max: 15 },
  { key: 'useOfAuthorities', name: 'Use of Legal Authorities / Precedents', max: 15 },
  { key: 'courtroomEtiquette', name: 'Courtroom Etiquette & Deference', max: 10 },
  { key: 'responsiveness', name: 'Responsiveness to Judicial Questions', max: 15 },
  { key: 'evidenceHandling', name: 'Evidence & Exhibit Handling', max: 10 },
  { key: 'persuasiveness', name: 'Oratorical Persuasiveness', max: 15 },
  { key: 'timeManagement', name: 'Time Pacing & Management', max: 10 }
];

export const EvaluationPanel: React.FC<EvaluationPanelProps> = ({
  students,
  caseRecord,
  judgeName,
  evaluations,
  onSubmitEvaluation
}) => {
  const advocateStudents = students.filter((s) => s.role === 'advocate');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    advocateStudents[0]?.id || ''
  );

  const selectedStudent = advocateStudents.find((s) => s.id === selectedStudentId);

  const existingEval = selectedStudentId ? evaluations[selectedStudentId] : null;

  const [scores, setScores] = useState<Record<string, number>>(
    existingEval?.scores || {
      legalKnowledge: 16,
      argumentStructure: 12,
      useOfAuthorities: 12,
      courtroomEtiquette: 9,
      responsiveness: 12,
      evidenceHandling: 8,
      persuasiveness: 12,
      timeManagement: 8
    }
  );

  const [feedbacks, setFeedbacks] = useState<Record<string, string>>(
    existingEval?.feedbacks || {}
  );

  const [generalComments, setGeneralComments] = useState<string>(
    existingEval?.generalComments || ''
  );

  const calculateTotal = (): number => {
    return Object.values(scores).reduce<number>((acc, curr) => acc + (Number(curr) || 0), 0);
  };

  const handleScoreChange = (catKey: string, value: number, max: number) => {
    const val = Math.max(0, Math.min(max, value));
    setScores((prev) => ({ ...prev, [catKey]: val }));
  };

  const handleFeedbackChange = (catKey: string, note: string) => {
    setFeedbacks((prev) => ({ ...prev, [catKey]: note }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    const evaluation: StudentEvaluation = {
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      role: selectedStudent.subRole || 'petitioner',
      scores,
      feedbacks,
      totalScore: calculateTotal(),
      maxTotalScore: 110,
      generalComments,
      evaluatedAt: Date.now(),
      evaluatedBy: judgeName
    };

    onSubmitEvaluation(evaluation);
  };

  return (
    <div className="bg-zinc-950 border border-amber-900/40 rounded-2xl p-6 text-amber-50 shadow-2xl space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-amber-900/30">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-950 border border-amber-600/40 flex items-center justify-center text-amber-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-amber-100">Student Academic Evaluation</h2>
            <p className="text-xs text-zinc-400">Moot court oral advocacy assessment rubric</p>
          </div>
        </div>

        {existingEval && (
          <button
            onClick={() => exportEvaluationPDF(caseRecord, existingEval)}
            className="bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report PDF</span>
          </button>
        )}
      </div>

      {/* Select Advocate Student */}
      <div>
        <label className="block text-xs font-semibold text-amber-200 uppercase tracking-wider mb-2">
          Select Advocate Student
        </label>
        <div className="grid grid-cols-2 gap-2">
          {advocateStudents.length === 0 ? (
            <div className="text-xs text-zinc-500 italic py-2">No advocate students currently in session.</div>
          ) : (
            advocateStudents.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setSelectedStudentId(s.id);
                  if (evaluations[s.id]) {
                    setScores(evaluations[s.id].scores);
                    setFeedbacks(evaluations[s.id].feedbacks);
                    setGeneralComments(evaluations[s.id].generalComments);
                  }
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedStudentId === s.id
                    ? 'bg-amber-950 border-amber-500 text-amber-200 shadow-md'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="text-xs font-bold">{s.name}</div>
                <div className="text-[10px] text-amber-400/80 uppercase">
                  {s.subRole === 'petitioner' ? 'Petitioner Counsel' : 'Respondent Counsel'}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {selectedStudent && (
        <form onSubmit={handleSave} className="space-y-5">
          {/* Rubric Score Matrix */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-amber-300 pb-1 border-b border-zinc-800">
              <span>Rubric Categories</span>
              <span className="text-amber-400 text-sm font-mono font-bold">
                TOTAL SCORE: {calculateTotal()} / 110 PTS
              </span>
            </div>

            {CATEGORIES.map((cat) => (
              <div key={cat.key} className="bg-zinc-900/80 border border-zinc-800 p-3 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-100">{cat.name}</span>
                  <div className="flex items-center gap-1 font-mono">
                    <input
                      type="number"
                      min={0}
                      max={cat.max}
                      value={scores[cat.key] || 0}
                      onChange={(e) => handleScoreChange(cat.key, parseInt(e.target.value) || 0, cat.max)}
                      className="w-12 bg-zinc-950 border border-amber-900/40 rounded px-1.5 py-0.5 text-center text-xs font-bold text-amber-200 focus:outline-none"
                    />
                    <span className="text-zinc-500">/ {cat.max} pts</span>
                  </div>
                </div>

                <input
                  type="text"
                  value={feedbacks[cat.key] || ''}
                  onChange={(e) => handleFeedbackChange(cat.key, e.target.value)}
                  placeholder={`Specific notes for ${cat.name}...`}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-amber-100 focus:outline-none"
                />
              </div>
            ))}
          </div>

          {/* General Comments */}
          <div>
            <label className="block text-xs font-semibold text-amber-200 uppercase tracking-wider mb-1">
              General Faculty Observations & Feedback
            </label>
            <textarea
              value={generalComments}
              onChange={(e) => setGeneralComments(e.target.value)}
              rows={3}
              placeholder="Overall feedback regarding courtroom poise, response under interrogation, and legal analysis..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs text-amber-100 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Evaluation & Lock Grade</span>
          </button>
        </form>
      )}
    </div>
  );
};
