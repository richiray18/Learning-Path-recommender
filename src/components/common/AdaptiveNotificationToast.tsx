import React from 'react';
import { ArrowRight, X, Sliders } from 'lucide-react';
import { useLearningPath } from '../../context/LearningPathContext';

export const AdaptiveNotificationToast: React.FC = () => {
  const { recentAdaptationToast, dismissAdaptationToast, setActiveTab } = useLearningPath();

  if (!recentAdaptationToast || !recentAdaptationToast.show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in slide-in-from-bottom-5 duration-300">
      <div className="p-5 rounded-xl bg-white border border-[#E3DED3] shadow-lg text-[#262626] space-y-3">
        {/* Header with badge and close */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#315C43]" />
            <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-[#315C43] flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#315C43]" />
              {recentAdaptationToast.title}
            </span>
          </div>

          <button
            onClick={dismissAdaptationToast}
            className="text-[#8E8D88] hover:text-[#262626] p-1 rounded-md hover:bg-[#F1E9DA]/50 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Reason */}
        <p className="text-xs text-[#6E6E68] leading-relaxed">
          {recentAdaptationToast.reason}
        </p>

        {/* Before vs After & Shift */}
        <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E3DED3] space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-[11px] text-[#6E6E68]">
            <span className="line-through text-[#8E8D88]">{recentAdaptationToast.before}</span>
            <span className="text-[#315C43] font-medium">{recentAdaptationToast.after}</span>
          </div>
          <div className="text-[11px] text-[#315C43] font-medium pt-0.5">
            {recentAdaptationToast.shift}
          </div>
        </div>

        {/* View Roadmap button */}
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            onClick={() => {
              dismissAdaptationToast();
              setActiveTab('roadmap');
            }}
            className="px-4 py-2 rounded-lg bg-[#315C43] hover:bg-[#264935] text-white text-xs font-medium shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>View Updated Curriculum</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

