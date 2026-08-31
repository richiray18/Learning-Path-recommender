import React from 'react';
import {
  X,
  BookOpen,
  Target,
  TrendingUp,
} from 'lucide-react';
import { useLearningPath } from '../../context/LearningPathContext';

export const SkillDeepDiveModal: React.FC = () => {
  const {
    selectedSkillForDeepDive,
    setSelectedSkillForDeepDive,
    updateSkillLevel,
    setActiveTab,
  } = useLearningPath();

  if (!selectedSkillForDeepDive) return null;

  const skill = selectedSkillForDeepDive;
  const gap = Math.max(0, skill.targetLevel - skill.currentLevel);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white border border-[#E3DED3] rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E3DED3] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E6EEE5] border border-[#D3E0D2] flex items-center justify-center text-[#315C43]">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-medium uppercase tracking-wider text-[#315C43]">
                Competency Breakdown
              </div>
              <h3 className="text-base font-serif font-bold text-[#262626]">{skill.name}</h3>
            </div>
          </div>

          <button
            onClick={() => setSelectedSkillForDeepDive(null)}
            className="text-[#8E8D88] hover:text-[#262626] p-1.5 rounded-lg hover:bg-[#F1E9DA]/50 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Level & Gap Meter */}
          <div className="p-5 rounded-xl bg-[#F7F5EF] border border-[#E3DED3] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-serif font-bold text-[#262626]">Proficiency vs Benchmark</span>
              <span className="text-[#B58A52] font-mono font-medium">
                {gap > 0 ? `${gap}% to Target Goal` : 'Target Achieved'}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-[#6E6E68]">
                <span>Current: {skill.currentLevel}%</span>
                <span>Benchmark: {skill.targetLevel}%</span>
              </div>
              <div className="relative w-full h-2 rounded-full bg-[#E3DED3] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#315C43] transition-all duration-500"
                  style={{ width: `${skill.currentLevel}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#6E6E68] pt-1">
              <span>Domain: <strong className="text-[#262626] font-medium">{skill.category}</strong></span>
              <span>Priority: <strong className="text-[#B58A52] font-medium">{skill.priority}</strong></span>
            </div>
          </div>

          {/* Context Note */}
          <div className="p-4 rounded-xl bg-[#E6EEE5] border border-[#D3E0D2] space-y-1.5">
            <div className="text-xs font-serif font-bold text-[#315C43]">
              Curriculum Relevance
            </div>
            <p className="text-xs text-[#264935] leading-relaxed">
              {skill.whyItMatters}
            </p>
          </div>

          {/* Strategy & Recommended Resources */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E3DED3] space-y-2.5 text-xs">
            <div className="text-[#6E6E68] font-medium">Recommended Learning Approach:</div>
            <div className="flex items-center justify-between text-[#262626] font-medium bg-white p-3.5 rounded-lg border border-[#E3DED3] shadow-2xs">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#315C43]" />
                {skill.aiInsight}
              </span>
              <button
                onClick={() => {
                  setSelectedSkillForDeepDive(null);
                  setActiveTab('courses');
                }}
                className="text-xs text-[#315C43] hover:text-[#264935] font-medium flex items-center gap-1 cursor-pointer shrink-0 ml-3"
              >
                View Modules →
              </button>
            </div>
          </div>

          {/* Practice Action */}
          <div className="p-4 rounded-xl bg-white border border-[#E3DED3] flex items-center justify-between gap-3 shadow-2xs">
            <div>
              <div className="text-xs font-serif font-bold text-[#262626]">Log Practice Session</div>
              <div className="text-xs text-[#6E6E68]">Record hands-on work (+5% proficiency)</div>
            </div>
            <button
              onClick={() => updateSkillLevel(skill.id, 5)}
              className="px-3.5 py-1.5 rounded-lg bg-[#F7F5EF] hover:bg-[#F1E9DA]/50 text-[#315C43] border border-[#E3DED3] text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#315C43]" />
              <span>Log +5%</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E3DED3] bg-[#FAF8F5] flex items-center justify-end">
          <button
            onClick={() => setSelectedSkillForDeepDive(null)}
            className="px-5 py-2 rounded-lg bg-[#315C43] hover:bg-[#264935] text-white text-xs font-medium transition-all cursor-pointer shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

