import React from 'react';
import {
  Sparkles,
  Target,
  Brain,
  Clock,
  CheckCircle2,
  ArrowRight,
  X,
  Zap,
} from 'lucide-react';
import { useLearningPath } from '../../context/LearningPathContext';

export const WhyRecommendedModal: React.FC = () => {
  const { selectedCourseForModal, setSelectedCourseForModal, startCourse } = useLearningPath();

  if (!selectedCourseForModal) return null;

  const course = selectedCourseForModal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1F1D]/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white border border-[#E5E0D8] rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E5E0D8] flex items-center justify-between bg-[#FAF9F6]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EAF1EC] border border-[#D3E2D8] flex items-center justify-center text-[#315C43]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#315C43]">
                Explainable Recommendation Reasoning
              </div>
              <h3 className="text-sm font-serif font-bold text-[#1C1F1D]">Why was this recommended for you?</h3>
            </div>
          </div>

          <button
            onClick={() => setSelectedCourseForModal(null)}
            className="text-[#7D8881] hover:text-[#1C1F1D] p-1.5 rounded-lg hover:bg-[#F2EFE8] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Target Course Highlight */}
          <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-serif font-bold text-[#1C1F1D]">{course.title}</span>
                <span className="text-xs text-[#636C66]">by {course.provider}</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#EAF1EC] text-[#315C43] font-mono text-xs font-bold border border-[#D3E2D8]">
                {course.matchPercentage}% AI Match
              </span>
            </div>
            <p className="text-xs text-[#4E5651] leading-relaxed">{course.description}</p>
          </div>

          {/* 4 Explainability Vectors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* 1. Career Goal Alignment */}
            <div className="p-3.5 rounded-xl bg-white border border-[#E5E0D8] space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#315C43]">
                <Target className="w-3.5 h-3.5 text-[#315C43]" />
                <span>Career Goal Alignment</span>
              </div>
              <p className="text-xs text-[#5C645F] leading-relaxed">
                Directly targets the core algorithm requirements required by 88% of target machine learning job postings.
              </p>
            </div>

            {/* 2. Skill Level Calibration */}
            <div className="p-3.5 rounded-xl bg-white border border-[#E5E0D8] space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#315C43]">
                <Brain className="w-3.5 h-3.5 text-[#315C43]" />
                <span>Skill Calibration</span>
              </div>
              <p className="text-xs text-[#5C645F] leading-relaxed">
                Bridges the exact gap between your baseline proficiency and target milestone competency.
              </p>
            </div>

            {/* 3. Time Budget Fit */}
            <div className="p-3.5 rounded-xl bg-white border border-[#E5E0D8] space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#C86D51]">
                <Clock className="w-3.5 h-3.5 text-[#C86D51]" />
                <span>Time Budget Fit</span>
              </div>
              <p className="text-xs text-[#5C645F] leading-relaxed">
                Duration is {course.duration}, structured into bite-sized 20–30 min modules matching your study schedule.
              </p>
            </div>

            {/* 4. Learning Style Optimization */}
            <div className="p-3.5 rounded-xl bg-white border border-[#E5E0D8] space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#C86D51]">
                <Zap className="w-3.5 h-3.5 text-[#C86D51]" />
                <span>Learning Style Fit</span>
              </div>
              <p className="text-xs text-[#5C645F] leading-relaxed">
                High ratio of hands-on notebooks and visual problem splits matching your preferred practical mode.
              </p>
            </div>
          </div>

          {/* Prerequisite & Unlocked Next Steps */}
          <div className="p-4 rounded-xl bg-[#EAF1EC] border border-[#D3E2D8] space-y-2">
            <div className="text-xs font-serif font-bold text-[#1C1F1D]">Prerequisite & Milestone Progression:</div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-[#315C43] font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Prerequisites satisfied: Foundation modules complete</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#2F593E] font-semibold">
                <span>Unlocks: Applied Project Phase</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Alternative Resources Considered by AI */}
          <div className="space-y-2 pt-2 border-t border-[#EAE6DF]">
            <div className="text-xs font-serif font-bold uppercase tracking-wider text-[#636C66]">
              Alternative Options Evaluated
            </div>
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-[#FAF9F6] border border-[#E5E0D8] text-xs flex items-center justify-between">
                <div>
                  <span className="text-[#1C1F1D] font-semibold">MIT 6.036 Introduction to Machine Learning</span>
                  <span className="text-[#636C66] text-[11px] block">Higher theoretical math rigor, but slower time to hands-on implementation.</span>
                </div>
                <span className="text-[10px] text-[#7D8881] font-mono">82% match</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#FAF9F6] border border-[#E5E0D8] text-xs flex items-center justify-between">
                <div>
                  <span className="text-[#1C1F1D] font-semibold">Fast.ai Practical Deep Learning for Coders</span>
                  <span className="text-[#636C66] text-[11px] block">Top-down code focus, but skips essential heuristic tree concepts.</span>
                </div>
                <span className="text-[10px] text-[#7D8881] font-mono">86% match</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#E5E0D8] bg-[#FAF9F6] flex items-center justify-between">
          <button
            onClick={() => setSelectedCourseForModal(null)}
            className="px-4 py-2 text-xs font-semibold text-[#636C66] hover:text-[#1C1F1D] transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={() => {
              startCourse(course.id);
              setSelectedCourseForModal(null);
            }}
            className="px-5 py-2.5 rounded-xl bg-[#315C43] hover:bg-[#254834] text-white text-xs font-bold shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>Start Learning Course</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
