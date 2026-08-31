import React from 'react';
import {
  Award,
  CheckCircle2,
  Lock,
  Flame,
  TrendingUp,
  Star,
  Check,
} from 'lucide-react';
import { useLearningPath } from '../../context/LearningPathContext';

export const AchievementsView: React.FC = () => {
  const { triggerConfetti } = useLearningPath();

  const achievements = [
    {
      id: 'ach-1',
      title: 'Foundation Mastered',
      desc: 'Demonstrated mastery in Python Vectorization, Matrix Algebra & Baseline Statistics.',
      date: 'Earned 3 days ago',
      unlocked: true,
      category: 'Milestone',
      icon: Award,
    },
    {
      id: 'ach-2',
      title: '12-Day Study Habit',
      desc: 'Maintained consistent 1.5h daily learning momentum for 12 consecutive days.',
      date: 'Active',
      unlocked: true,
      category: 'Consistency',
      icon: Flame,
    },
    {
      id: 'ach-3',
      title: 'Checkpoint Acceleration',
      desc: 'Scored 92% on diagnostic evaluation, successfully accelerating timeline milestones.',
      date: 'Earned yesterday',
      unlocked: true,
      category: 'Mastery',
      icon: TrendingUp,
    },
    {
      id: 'ach-4',
      title: 'Churn Prediction Pipeline',
      desc: 'Completed production-ready customer churn prediction model with 88% precision.',
      date: 'In Progress (72%)',
      unlocked: false,
      category: 'Portfolio',
      icon: Star,
    },
    {
      id: 'ach-5',
      title: 'Deep Learning Architectures',
      desc: 'Train your first convolutional neural network & transformer architecture from scratch.',
      date: 'Phase 3 Milestone',
      unlocked: false,
      category: 'Milestone',
      icon: Award,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3DED3]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#E6EEE5] text-[#315C43] border border-[#D3E0D2] text-[10px] font-mono font-medium uppercase tracking-wider">
              Credentials & Milestones
            </span>
            <span className="text-xs text-[#6E6E68]">
              3 of 5 Milestones Achieved
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#262626] mt-1.5">
            Verified Milestones
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E68] mt-1">
            Verifiable milestone records documenting your progression toward professional machine learning engineering.
          </p>
        </div>

        <button
          onClick={triggerConfetti}
          className="px-4 py-2 rounded-lg bg-[#FAF8F5] hover:bg-[#F1E9DA]/50 border border-[#E3DED3] text-[#315C43] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs self-start sm:self-auto"
        >
          <Check className="w-3.5 h-3.5 text-[#315C43]" />
          <span>Celebrate Milestones</span>
        </button>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {achievements.map(ach => {
          const Icon = ach.icon;
          return (
            <div
              key={ach.id}
              className={`p-6 rounded-xl border transition-all flex flex-col justify-between space-y-4 bg-white shadow-2xs ${
                ach.unlocked
                  ? 'border-[#D3E0D2]'
                  : 'border-[#E3DED3] opacity-75'
              }`}
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      ach.unlocked
                        ? 'bg-[#E6EEE5] border border-[#D3E0D2] text-[#315C43]'
                        : 'bg-[#F7F5EF] text-[#8E8D88]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-[#F7F5EF] text-[#6E6E68] border border-[#E3DED3]">
                    {ach.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-serif font-bold text-[#262626]">{ach.title}</h3>
                  <p className="text-xs text-[#6E6E68] mt-1.5 leading-relaxed">{ach.desc}</p>
                </div>
              </div>

              <div className="pt-3.5 border-t border-[#E3DED3] flex items-center justify-between text-xs">
                <span className="text-[#8E8D88] text-[11px] font-mono">{ach.date}</span>
                {ach.unlocked ? (
                  <span className="text-[#315C43] font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Achieved
                  </span>
                ) : (
                  <span className="text-[#8E8D88] flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> In Progress
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

