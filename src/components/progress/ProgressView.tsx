import React from 'react';
import {
  TrendingUp,
  CheckCircle2,
  Flame,
  Calendar,
  Sliders,
} from 'lucide-react';
import { useLearningPath } from '../../context/LearningPathContext';

export const ProgressView: React.FC = () => {
  const {
    profile,
    adaptationHistory,
    weeklyActivity,
    triggerDemoAdaptiveFlow,
  } = useLearningPath();

  const totalStudyMinutes = weeklyActivity.reduce((acc, d) => acc + d.minutes, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3DED3]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#E6EEE5] text-[#315C43] border border-[#D3E0D2] text-[10px] font-mono font-medium uppercase tracking-wider">
              Study Velocity
            </span>
            <span className="text-xs text-[#6E6E68]">
              {totalStudyMinutes} Minutes Logged This Week
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#262626] mt-1.5">
            Progress Analytics & Adjustment Log
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E68] mt-1">
            Transparent records of how your learning schedule adjusts dynamically based on completed checkpoints.
          </p>
        </div>

        <button
          onClick={triggerDemoAdaptiveFlow}
          className="px-4 py-2 rounded-lg bg-[#FAF8F5] hover:bg-[#F1E9DA]/50 border border-[#E3DED3] text-[#315C43] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs self-start sm:self-auto"
        >
          <Sliders className="w-3.5 h-3.5 text-[#315C43]" />
          <span>Simulate Timeline Adjustment</span>
        </button>
      </div>

      {/* Progress Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-white border border-[#E3DED3] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#6E6E68]">
            <span>Overall Roadmap Progress</span>
            <TrendingUp className="w-4 h-4 text-[#315C43]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#262626]">{profile.overallProgress}%</div>
          <div className="w-full h-2 rounded-full bg-[#E3DED3] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#315C43]"
              style={{ width: `${profile.overallProgress}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E3DED3] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#6E6E68]">
            <span>Active Study Habit</span>
            <Flame className="w-4 h-4 text-[#B58A52]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#262626]">{profile.currentStreak} Days</div>
          <p className="text-xs text-[#6E6E68]">Consistent daily study momentum</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E3DED3] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#6E6E68]">
            <span>Activities Completed</span>
            <CheckCircle2 className="w-4 h-4 text-[#315C43]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#262626]">
            {profile.completedActivitiesCount} Lessons & Projects
          </div>
          <p className="text-xs text-[#6E6E68]">Across foundational and core phases</p>
        </div>
      </div>

      {/* Path Adaptation History */}
      <div className="p-6 rounded-xl bg-white border border-[#E3DED3] shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E6EEE5] border border-[#D3E0D2] flex items-center justify-center text-[#315C43]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-serif font-bold text-[#262626]">Schedule Adjustment History</h3>
              <p className="text-xs text-[#6E6E68]">Audit log of responsive schedule and milestone recalibrations</p>
            </div>
          </div>
          <span className="text-xs font-mono text-[#315C43] font-medium">
            {adaptationHistory.length} Recorded Adjustments
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {adaptationHistory.map(item => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E3DED3] space-y-2.5 text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-[#262626] font-mono text-[11px]">
                  Trigger: {item.trigger}
                </span>
                <span className="text-[10px] text-[#8E8D88] font-mono">{item.timestamp}</span>
              </div>

              <p className="text-[#6E6E68] leading-relaxed">{item.reason}</p>

              <div className="p-3 rounded-lg bg-white border border-[#E3DED3] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] shadow-2xs">
                <div className="text-[#6E6E68]">
                  <span className="line-through text-[#8E8D88] mr-2">{item.before}</span>
                  <span className="text-[#315C43] font-medium">{item.after}</span>
                </div>
                <span className="text-[#315C43] font-medium">{item.milestoneShift}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

