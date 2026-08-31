import React, { useState } from 'react';
import { Smile, Meh, Frown, ThumbsUp, ThumbsDown, X, Compass } from 'lucide-react';
import { useLearningPath } from '../../context/LearningPathContext';

export const FeedbackWidget: React.FC = () => {
  const { feedbackModalData, setFeedbackModalData, submitFeedback } = useLearningPath();
  const [selectedFeeling, setSelectedFeeling] = useState<'too_difficult' | 'okay' | 'good' | 'too_easy'>('good');
  const [useful, setUseful] = useState<boolean>(true);

  if (!feedbackModalData || !feedbackModalData.isOpen) return null;

  const handleSubmit = () => {
    submitFeedback(selectedFeeling, useful);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white border border-[#E3DED3] rounded-2xl shadow-xl overflow-hidden p-6 space-y-5">
        <button
          onClick={() => setFeedbackModalData(null)}
          className="absolute top-4 right-4 text-[#8E8D88] hover:text-[#262626] p-1.5 rounded-lg hover:bg-[#F1E9DA]/50 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#E6EEE5] border border-[#D3E0D2] flex items-center justify-center text-[#315C43]">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-[#315C43]">
              Curriculum Calibration
            </span>
            <h3 className="text-sm font-serif font-bold text-[#262626]">
              How was this module?
            </h3>
          </div>
        </div>

        <p className="text-xs text-[#6E6E68] leading-relaxed bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E3DED3]">
          Your feedback on <strong>&quot;{feedbackModalData.resourceTitle}&quot;</strong> helps calibrate future topic depth and recommended pace.
        </p>

        {/* Difficulty Selector */}
        <div className="space-y-2">
          <label className="text-xs font-serif font-bold text-[#262626]">Pacing & Difficulty:</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'too_easy', label: 'Very Easy' },
              { id: 'good', label: 'Balanced' },
              { id: 'okay', label: 'Challenging' },
              { id: 'too_difficult', label: 'Too Fast' },
            ].map(item => {
              const isSelected = selectedFeeling === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedFeeling(item.id as any)}
                  className={`p-2.5 rounded-lg border text-center text-xs transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-[#E6EEE5] border-[#315C43] text-[#315C43] font-medium shadow-2xs'
                      : 'bg-[#FAF8F5] border-[#E3DED3] text-[#6E6E68] hover:bg-white hover:text-[#262626]'
                  }`}
                >
                  <span className="text-[11px]">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Was this useful toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-[#E3DED3]">
          <span className="text-xs text-[#6E6E68]">Did this resource clarify the concept?</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setUseful(true)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                useful
                  ? 'bg-[#E6EEE5] border-[#315C43] text-[#315C43]'
                  : 'bg-[#FAF8F5] border-[#E3DED3] text-[#8E8D88]'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => setUseful(false)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                !useful
                  ? 'bg-[#F7F5EF] border-[#B58A52] text-[#B58A52]'
                  : 'bg-[#FAF8F5] border-[#E3DED3] text-[#8E8D88]'
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full py-2.5 rounded-lg bg-[#315C43] hover:bg-[#264935] text-white text-xs font-medium shadow-2xs transition-all cursor-pointer"
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
};

