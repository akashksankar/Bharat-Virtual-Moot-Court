import jsPDF from 'jspdf';
import {
  CaseRecord,
  TranscriptSegment,
  StudentEvaluation,
  JudgmentRecord,
  EvidenceItem
} from '../types';

export const exportCaseFilePDF = (
  caseRecord: CaseRecord,
  transcript: TranscriptSegment[],
  evidenceList: EvidenceItem[],
  judgment?: JudgmentRecord,
  evaluation?: StudentEvaluation
) => {
  const doc = new jsPDF();
  let y = 20;

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('VIRTUAL COURTROOM - OFFICIAL CASE RECORD', 105, y, { align: 'center' });
  y += 10;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Case No: ${caseRecord.caseNumber}`, 20, y);
  y += 6;
  doc.text(`Title: ${caseRecord.caseTitle}`, 20, y);
  y += 6;
  doc.text(`Court: ${caseRecord.courtroomName}`, 20, y);
  y += 6;
  doc.text(`Presiding Judge: ${caseRecord.judgeName}`, 20, y);
  y += 6;
  doc.text(`Date: ${caseRecord.date}`, 20, y);
  y += 10;

  doc.setLineWidth(0.5);
  doc.line(20, y, 190, y);
  y += 10;

  // Case Facts
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('I. CASE FACTS & OVERVIEW', 20, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const splitFacts = doc.splitTextToSize(caseRecord.facts, 170);
  doc.text(splitFacts, 20, y);
  y += splitFacts.length * 5 + 8;

  // Issues
  if (y > 250) {
    doc.addPage();
    y = 20;
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('II. ISSUES FOR DETERMINATION', 20, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  caseRecord.issues.forEach((issue, idx) => {
    const splitIssue = doc.splitTextToSize(`${idx + 1}. ${issue}`, 170);
    doc.text(splitIssue, 20, y);
    y += splitIssue.length * 5 + 3;
  });
  y += 8;

  // Evidence Exhibits
  if (y > 240) {
    doc.addPage();
    y = 20;
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('III. ADMITTED EVIDENCE EXHIBITS', 20, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  if (evidenceList.length === 0) {
    doc.text('No exhibits submitted.', 20, y);
    y += 8;
  } else {
    evidenceList.forEach((ex) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`${ex.exhibitNumber}: ${ex.title} (${ex.status.toUpperCase()})`, 20, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      const splitDesc = doc.splitTextToSize(`Submitted by: ${ex.submittedBy} | ${ex.description}`, 170);
      doc.text(splitDesc, 20, y);
      y += splitDesc.length * 5 + 4;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
  }
  y += 8;

  // Final Judgment
  if (judgment) {
    if (y > 220) {
      doc.addPage();
      y = 20;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('IV. FINAL JUDGMENT & RULING', 20, y);
    y += 8;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`VERDICT: ${judgment.finalDecision}`, 20, y);
    y += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const splitReasons = doc.splitTextToSize(judgment.reasons, 170);
    doc.text(splitReasons, 20, y);
    y += splitReasons.length * 5 + 8;

    doc.setFont('helvetica', 'bold');
    doc.text(`Signature: ${judgment.judgeSignature}`, 20, y);
    y += 12;
  }

  // Save PDF
  doc.save(`${caseRecord.caseNumber}_Official_Case_Record.pdf`);
};

export const exportTranscriptPDF = (caseRecord: CaseRecord, transcript: TranscriptSegment[]) => {
  const doc = new jsPDF();
  let y = 20;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(`OFFICIAL COURT STENOGRAPHY TRANSCRIPT`, 105, y, { align: 'center' });
  y += 8;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Case No: ${caseRecord.caseNumber} | Title: ${caseRecord.caseTitle}`, 105, y, { align: 'center' });
  y += 10;

  doc.line(20, y, 190, y);
  y += 10;

  doc.setFontSize(10);
  transcript.forEach((seg) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.setFont('helvetica', 'bold');
    const roleLabel = seg.speakerSubRole ? ` [${seg.speakerSubRole.toUpperCase()}]` : ` [${seg.speakerRole.toUpperCase()}]`;
    doc.text(`[${seg.timestamp}] ${seg.speakerName}${roleLabel}:`, 20, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    const splitText = doc.splitTextToSize(seg.text, 170);
    doc.text(splitText, 25, y);
    y += splitText.length * 5 + 4;
  });

  doc.save(`${caseRecord.caseNumber}_Hearing_Transcript.pdf`);
};

export const exportEvaluationPDF = (caseRecord: CaseRecord, evalData: StudentEvaluation) => {
  const doc = new jsPDF();
  let y = 20;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('ACADEMIC MOOT COURT EVALUATION REPORT', 105, y, { align: 'center' });
  y += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Student: ${evalData.studentName} (${evalData.role.toUpperCase()})`, 20, y);
  y += 6;
  doc.text(`Case No: ${caseRecord.caseNumber}`, 20, y);
  y += 6;
  doc.text(`Evaluated By: ${evalData.evaluatedBy}`, 20, y);
  y += 10;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`TOTAL SCORE: ${evalData.totalScore} / ${evalData.maxTotalScore}`, 20, y);
  y += 10;

  doc.line(20, y, 190, y);
  y += 10;

  doc.setFontSize(10);
  Object.entries(evalData.scores).forEach(([cat, score]) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    const catName = (cat || '').replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
    const feedback = evalData.feedbacks[cat] || 'No specific note.';

    doc.setFont('helvetica', 'bold');
    doc.text(`${catName}: ${score} pts`, 20, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    const splitFb = doc.splitTextToSize(`Notes: ${feedback}`, 165);
    doc.text(splitFb, 25, y);
    y += splitFb.length * 5 + 5;
  });

  if (evalData.generalComments) {
    if (y > 240) {
      doc.addPage();
      y = 20;
    }
    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('GENERAL COMMENTS & FEEDBACK:', 20, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    const splitGen = doc.splitTextToSize(evalData.generalComments, 170);
    doc.text(splitGen, 20, y);
  }

  doc.save(`${evalData.studentName}_Evaluation_${caseRecord.caseNumber}.pdf`);
};
