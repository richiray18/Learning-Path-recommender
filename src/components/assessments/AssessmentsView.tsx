import React from 'react';
import {
  CheckCircle2,
  Lock,
  ArrowRight,
  CheckSquare,
} from 'lucide-react';
import { useLearningPath } from '../../context/LearningPathContext';

export const AssessmentsView: React.FC = () => {
  const { assessments, setActiveQuiz } = useLearningPath();

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-[#E3DED3] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-[#315C43] bg-[#E6EEE5] px-2.5 py-0.5 rounded border border-[#D3E0D2]">
              Knowledge Benchmarks
            </span>
            <span className="text-xs text-[#6E6E68]">
              {assessments.filter(a => a.completed).length} of {assessments.length} Completed
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#262626] tracking-tight">
            Assessments & Checkpoints
          </h1>
          <p className="text-sm text-[#6E6E68] mt-1 max-w-2xl leading-relaxed">
            Diagnostic quizzes and problem sets to validate comprehension and ensure mastery before advancing.
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="p-5 rounded-2xl bg-white border border-[#E3DED3] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E6EEE5] border border-[#D3E0D2] flex items-center justify-center text-[#315C43] shrink-0">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <span className="font-serif font-bold text-[#262626] block">Competency Testing & Progression</span>
            <span className="text-[#6E6E68] leading-relaxed">
              Demonstrating proficiency (≥80%) allows you to confidently test out of foundational concepts and focus on high-impact advanced topics.
            </span>
          </div>
        </div>
      </div>

      {/* Assessments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments.map(assessment => {
          const isDone = assessment.completed;
          const isLocked = !isDone && assessment.id === 'assess-deep-learning';

          return (
            <div
              key={assessment.id}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 bg-white shadow-xs ${
                isDone
                  ? 'border-[#D3E0D2]'
                  : isLocked
                  ? 'border-[#E3DED3] opacity-75'
                  : 'border-[#315C43]/40'
              }`}
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#F7F5EF] text-[#315C43] border border-[#E3DED3]">
                    {assessment.type}
                  </span>

                  {isDone ? (
                    <span className="text-xs font-medium text-[#315C43] flex items-center gap-1 bg-[#E6EEE5] px-2.5 py-1 rounded-md border border-[#D3E0D2]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Score: {assessment.score}%
                    </span>
                  ) : (
                    <span className="text-xs text-[#B58A52] font-medium bg-[#F1E9DA] px-2.5 py-1 rounded-md border border-[#E3DED3]">
                      Ready
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-serif font-bold text-[#262626]">{assessment.title}</h3>
                  <div className="text-xs text-[#6E6E68] mt-1">
                    {assessment.questionsCount} Multiple-Choice & Scenario Questions
                  </div>
                </div>

                {assessment.aiFeedback && (
                  <div className="p-3.5 rounded-xl bg-[#F7F5EF] border border-[#E3DED3] text-xs text-[#6E6E68] space-y-1">
                    <span className="font-medium text-[#262626] block">Feedback Summary:</span>
                    <p className="text-xs text-[#6E6E68] leading-relaxed">{assessment.aiFeedback}</p>
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-[#E3DED3]">
                {isLocked ? (
                  <div className="text-center py-2 text-xs text-[#8E8D88] flex items-center justify-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Unlocks in later phase</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveQuiz(assessment)}
                    className={`w-full py-2.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isDone
                        ? 'bg-[#F7F5EF] hover:bg-[#F1E9DA]/50 border border-[#E3DED3] text-[#262626]'
                        : 'bg-[#315C43] hover:bg-[#264935] text-white shadow-2xs'
                    }`}
                  >
                    <span>{isDone ? 'Review Assessment' : 'Start Assessment'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

