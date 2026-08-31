import React, { useState } from 'react';
import {
  Target,
  Clock,
  Calendar,
  Edit2,
  Save,
  RotateCcw,
} from 'lucide-react';
import { useLearningPath } from '../../context/LearningPathContext';

export const ProfileView: React.FC = () => {
  const { profile, updateProfile, setOnboardingOpen, triggerConfetti } = useLearningPath();

  const [isEditing, setIsEditing] = useState(false);
  const [goal, setGoal] = useState(profile.goal);
  const [dailyAvail, setDailyAvail] = useState(profile.dailyAvailability);
  const [targetDeadline, setTargetDeadline] = useState(profile.targetDeadline);

  const handleSave = () => {
    updateProfile({
      goal,
      dailyAvailability: dailyAvail,
      targetDeadline,
    });
    setIsEditing(false);
    triggerConfetti();
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3DED3]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#262626]">Learner Profile</h1>
          <p className="text-xs sm:text-sm text-[#6E6E68] mt-1">
            Manage your career targets, study schedule parameters, and learning preferences.
          </p>
        </div>

        <button
          onClick={() => setOnboardingOpen(true)}
          className="px-4 py-2 rounded-lg bg-[#FAF8F5] hover:bg-[#F1E9DA]/50 border border-[#E3DED3] text-[#315C43] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#315C43]" />
          <span>Reconfigure Target Goal</span>
        </button>
      </div>

      {/* Profile Card */}
      <div className="p-6 rounded-xl bg-white border border-[#E3DED3] shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-[#E3DED3]">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-18 h-18 rounded-xl object-cover ring-1 ring-[#D3E0D2]"
          />
          <div className="text-center sm:text-left space-y-1.5">
            <h2 className="text-xl font-serif font-bold text-[#262626]">{profile.name}</h2>
            <p className="text-xs text-[#6E6E68] font-mono">alex.morgan@learning.edu</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-0.5">
              <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-[#F7F5EF] text-[#6E6E68] border border-[#E3DED3]">
                Baseline: {profile.experienceLevel}
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-[#E6EEE5] text-[#315C43] border border-[#D3E0D2] font-medium">
                {profile.overallProgress}% Curriculum Completed
              </span>
            </div>
          </div>
        </div>

        {/* Goal Parameters */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-serif font-bold text-[#262626]">Career Goal & Schedule</h3>
            <button
              onClick={() => {
                if (isEditing) handleSave();
                else setIsEditing(true);
              }}
              className="text-xs font-medium text-[#315C43] hover:text-[#264935] flex items-center gap-1.5 cursor-pointer"
            >
              {isEditing ? (
                <>
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </>
              ) : (
                <>
                  <Edit2 className="w-3.5 h-3.5" /> Edit Parameters
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E3DED3] space-y-1.5">
              <span className="text-xs text-[#6E6E68] flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[#315C43]" /> Target Career Goal
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={goal}
                  onChange={e => setGoal(e.target.value)}
                  className="w-full bg-white border border-[#D3CEBE] rounded-lg px-2.5 py-1.5 text-xs text-[#262626] focus:outline-none focus:border-[#315C43]"
                />
              ) : (
                <div className="text-xs font-medium text-[#262626]">{profile.goal}</div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E3DED3] space-y-1.5">
              <span className="text-xs text-[#6E6E68] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#B58A52]" /> Daily Study Availability
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={dailyAvail}
                  onChange={e => setDailyAvail(e.target.value)}
                  className="w-full bg-white border border-[#D3CEBE] rounded-lg px-2.5 py-1.5 text-xs text-[#262626] focus:outline-none focus:border-[#315C43]"
                />
              ) : (
                <div className="text-xs font-medium text-[#262626]">{profile.dailyAvailability}</div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E3DED3] space-y-1.5">
              <span className="text-xs text-[#6E6E68] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#315C43]" /> Target Timeline
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={targetDeadline}
                  onChange={e => setTargetDeadline(e.target.value)}
                  className="w-full bg-white border border-[#D3CEBE] rounded-lg px-2.5 py-1.5 text-xs text-[#262626] focus:outline-none focus:border-[#315C43]"
                />
              ) : (
                <div className="text-xs font-medium text-[#262626]">{profile.targetDeadline}</div>
              )}
            </div>
          </div>
        </div>

        {/* Learning Preferences */}
        <div className="space-y-2.5 pt-2 border-t border-[#E3DED3]">
          <h3 className="text-xs font-serif font-bold text-[#262626]">Preferred Learning Modalities</h3>
          <div className="flex flex-wrap gap-2">
            {profile.learningStyles.map(style => (
              <span
                key={style}
                className="px-3 py-1 rounded-lg bg-[#E6EEE5] border border-[#D3E0D2] text-[#315C43] text-xs font-medium"
              >
                ✓ {style}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

