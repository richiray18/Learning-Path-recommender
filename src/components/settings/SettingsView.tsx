import React, { useState } from 'react';
import {
  RotateCcw,
  Sliders,
  HelpCircle,
} from 'lucide-react';
import { useLearningPath } from '../../context/LearningPathContext';

export const SettingsView: React.FC = () => {
  const { setOnboardingOpen } = useLearningPath();

  const [autoAdapt, setAutoAdapt] = useState(true);
  const [deepExplain, setDeepExplain] = useState(true);

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-[#E3DED3]">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#262626]">Preferences & Settings</h1>
        <p className="text-xs sm:text-sm text-[#6E6E68] mt-1">
          Customize adaptive recalculation behavior and rationale annotations across your curriculum.
        </p>
      </div>

      <div className="space-y-4">
        {/* Adaptive Recalculation */}
        <div className="p-6 rounded-xl bg-white border border-[#E3DED3] shadow-2xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E6EEE5] border border-[#D3E0D2] flex items-center justify-center text-[#315C43] shrink-0">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-serif font-bold text-[#262626]">Dynamic Schedule Recalibration</h3>
              <p className="text-xs text-[#6E6E68]">
                Allow the platform to automatically compress or expand timeline milestones based on diagnostic results.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#E3DED3]">
            <span className="text-xs font-medium text-[#262626]">Automatic Timeline Adjustment</span>
            <button
              onClick={() => setAutoAdapt(!autoAdapt)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                autoAdapt ? 'bg-[#315C43]' : 'bg-[#E3DED3]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-2xs transition-transform absolute top-1 ${
                  autoAdapt ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Explainability Settings */}
        <div className="p-6 rounded-xl bg-white border border-[#E3DED3] shadow-2xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F7F5EF] border border-[#E3DED3] flex items-center justify-center text-[#B58A52] shrink-0">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-serif font-bold text-[#262626]">Curriculum Justification Notes</h3>
              <p className="text-xs text-[#6E6E68]">
                Display detailed reasoning and prerequisite connections for every recommended module.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#E3DED3]">
            <span className="text-xs font-medium text-[#262626]">Display &quot;Why Recommended&quot; Details</span>
            <button
              onClick={() => setDeepExplain(!deepExplain)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                deepExplain ? 'bg-[#315C43]' : 'bg-[#E3DED3]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-2xs transition-transform absolute top-1 ${
                  deepExplain ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Quick Reset & Onboarding Launcher */}
        <div className="p-6 rounded-xl bg-white border border-[#E3DED3] shadow-2xs space-y-3">
          <h3 className="text-sm font-serif font-bold text-[#262626]">Curriculum Realignment</h3>
          <p className="text-xs text-[#6E6E68]">
            Need to switch your career target or recalibrate your schedule from scratch? Restart the setup guide.
          </p>
          <button
            onClick={() => setOnboardingOpen(true)}
            className="px-4 py-2 rounded-lg bg-[#FAF8F5] hover:bg-[#F1E9DA]/50 border border-[#E3DED3] text-[#262626] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#315C43]" />
            <span>Restart Setup Guide</span>
          </button>
        </div>
      </div>
    </div>
  );
};

