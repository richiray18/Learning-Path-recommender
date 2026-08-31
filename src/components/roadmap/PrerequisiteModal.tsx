import React from 'react';
import { Lock, ArrowRight, Sparkles, X } from 'lucide-react';
import { useLearningPath } from '../../context/LearningPathContext';

export const PrerequisiteModal: React.FC = () => {
  const { selectedPrereqForModal, setSelectedPrereqForModal, setActiveTab } = useLearningPath();

  if (!selectedPrereqForModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1F1D]/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white border border-[#E5E0D8] rounded-2xl shadow-xl overflow-hidden p-6 space-y-4">
        <button
          onClick={() => setSelectedPrereqForModal(null)}
          className="absolute top-4 right-4 text-[#7D8881] hover:text-[#1C1F1D] p-1.5 rounded-lg hover:bg-[#F2EFE8] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Lock Icon & Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FDF4EE] border border-[#F4DDD2] flex items-center justify-center text-[#C86D51]">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C86D51]">
              Prerequisite Dependency
            </span>
            <h3 className="text-base font-serif font-bold text-[#1C1F1D]">{selectedPrereqForModal.lockedTitle}</h3>
          </div>
        </div>

        {/* AI Educational Justification */}
        <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-[#315C43] font-serif font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#315C43]" />
            <span>Mentora Learning Guide</span>
          </div>
          <p className="text-[#4E5651] leading-relaxed">
            {selectedPrereqForModal.reason ||
              `Complete ${selectedPrereqForModal.prereqTitle} first because this foundational topic is essential for understanding cost functions, matrix operations, and error metric distributions.`}
          </p>
        </div>

        {/* Prerequisite Chain Visual */}
        <div className="p-3.5 rounded-xl bg-[#F7F5F0] border border-[#E5E0D8] space-y-2">
          <div className="text-[11px] font-medium text-[#636C66]">Required Completion Sequence:</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-white border border-[#D3E2D8] text-[#315C43] font-semibold shadow-2xs">
              {selectedPrereqForModal.prereqTitle}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#7D8881] shrink-0" />
            <span className="px-2.5 py-1 rounded-lg bg-[#EDE9E1] text-[#7D8881] line-through">
              {selectedPrereqForModal.lockedTitle}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center justify-end gap-2">
          <button
            onClick={() => setSelectedPrereqForModal(null)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#636C66] hover:text-[#1C1F1D] transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              setSelectedPrereqForModal(null);
              setActiveTab('courses');
            }}
            className="px-4 py-2 rounded-xl bg-[#315C43] hover:bg-[#254834] text-white text-xs font-bold shadow-2xs transition-all cursor-pointer"
          >
            Go to Active Coursework
          </button>
        </div>
      </div>
    </div>
  );
};
