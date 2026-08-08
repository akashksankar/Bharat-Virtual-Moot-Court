import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { ObjectionType, ObjectionRecord, AdvocateSubRole } from '../../types';
import { sfx } from '../../utils/sfx';

interface ObjectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitObjection: (objection: ObjectionRecord) => void;
  userParticipantId: string;
  userName: string;
  userSubRole: AdvocateSubRole;
}

const OBJECTION_TYPES: ObjectionType[] = [
  'Relevance',
  'Hearsay',
  'Leading',
  'Speculation',
  'Argumentative',
  'Improper Question',
  'Other'
];

export const ObjectionModal: React.FC<ObjectionModalProps> = ({
  isOpen,
  onClose,
  onSubmitObjection,
  userParticipantId,
  userName,
  userSubRole
}) => {
  const [selectedType, setSelectedType] = useState<ObjectionType>('Relevance');
  const [details, setDetails] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const objection: ObjectionRecord = {
      id: `obj-${Date.now()}`,
      raisedByParticipantId: userParticipantId,
      raisedByParticipantName: userName,
      raisedByRole: userSubRole,
      type: selectedType,
      details: details.trim(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      status: 'pending',
      createdAt: Date.now()
    };

    sfx.playObjection();
    onSubmitObjection(objection);
    setDetails('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-red-700/60 rounded-2xl max-w-md w-full p-6 text-amber-50 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-amber-200 transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-950 border border-red-600/60 flex items-center justify-center text-red-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-red-200 uppercase tracking-wide">
              Raise Formal Objection
            </h2>
            <p className="text-xs text-zinc-400">Interject proceeding on legal grounds</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-amber-200 uppercase tracking-wider mb-2">
              Grounds of Objection
            </label>
            <div className="grid grid-cols-2 gap-2">
              {OBJECTION_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`p-2.5 rounded-lg border text-xs font-semibold transition-all ${
                    selectedType === type
                      ? 'bg-red-950 border-red-500 text-red-200 shadow-md'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-200 uppercase tracking-wider mb-1">
              Brief Rationale / Reference
            </label>
            <input
              type="text"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="e.g. Counsel is assuming facts not in evidence"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-amber-100 focus:outline-none focus:border-red-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-3 rounded-lg text-xs tracking-wider uppercase transition-colors shadow-lg shadow-red-950/50"
          >
            Transmit Objection to Judge
          </button>
        </form>
      </div>
    </div>
  );
};
