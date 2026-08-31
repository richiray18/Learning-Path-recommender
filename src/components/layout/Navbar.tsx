import React, { useState } from 'react';
import {
  Compass,
  Flame,
  Bell,
  Search,
  BookOpen,
  ChevronRight,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { useLearningPath } from '../../context/LearningPathContext';

export const Navbar: React.FC = () => {
  const {
    profile,
    activeTab,
    setActiveTab,
    setIsTutorOpen,
    searchQuery,
    setSearchQuery,
    aiInsights,
    triggerDemoAdaptiveFlow,
    setOnboardingOpen,
  } = useLearningPath();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'overview': return 'Overview';
      case 'roadmap': return 'My Learning Path';
      case 'courses': return 'Courses';
      case 'skills': return 'Skills';
      case 'projects': return 'Projects';
      case 'assessments': return 'Assessments';
      case 'progress': return 'Progress';
      case 'achievements': return 'Achievements';
      case 'profile': return 'Profile';
      case 'settings': return 'Settings';
      default: return tab;
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-[#E3DED3] bg-[#F7F5EF]/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Brand & Breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-2.5 group text-left focus:outline-none cursor-pointer"
        >
          {/* Path + Leaf icon mark */}
          <div className="w-8 h-8 rounded-lg bg-[#315C43] text-[#F7F5EF] flex items-center justify-center shadow-xs group-hover:bg-[#264935] transition-all">
            <Compass className="w-4 h-4 text-[#F1E9DA]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold tracking-tight text-[#262626] text-lg">Mentora</span>
            </div>
            <p className="text-[11px] text-[#6E6E68] -mt-0.5 hidden sm:block">Your Learning Companion</p>
          </div>
        </button>

        {activeTab !== 'landing' && (
          <div className="hidden md:flex items-center gap-2 text-xs text-[#6E6E68] pl-4 border-l border-[#E3DED3]">
            <span className="font-medium text-[#262626]">{getTabLabel(activeTab)}</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#A39E93]" />
            <span className="text-[#315C43] font-medium truncate max-w-[200px]">{profile.goal}</span>
          </div>
        )}
      </div>

      {/* Global Search Bar */}
      {activeTab !== 'landing' && (
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#A39E93] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search courses, skills, topics, projects..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white text-sm text-[#262626] placeholder-[#A39E93] rounded-lg pl-9 pr-4 py-1.5 border border-[#E3DED3] focus:outline-none focus:border-[#315C43] focus:ring-1 focus:ring-[#315C43] transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A39E93] hover:text-[#262626] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Right Controls & Quick Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Tools menu for plan recalibration and goal updates */}
        <div className="relative">
          <button
            onClick={() => setShowActionsMenu(!showActionsMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-white border border-[#E3DED3] text-[#6E6E68] hover:text-[#262626] hover:bg-[#F1E9DA]/40 transition-colors shadow-2xs cursor-pointer"
            title="Learning path options"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#6E6E68]" />
            <span className="hidden sm:inline">Path Options</span>
          </button>

          {showActionsMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-[#E3DED3] shadow-md p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-[#6E6E68] border-b border-[#F1E9DA]">
                Plan Management
              </div>
              <button
                onClick={() => {
                  setShowActionsMenu(false);
                  triggerDemoAdaptiveFlow();
                }}
                className="w-full text-left px-2.5 py-2 text-xs text-[#262626] hover:bg-[#F7F5EF] rounded-lg flex items-center gap-2 mt-1 cursor-pointer"
              >
                <div className="w-6 h-6 rounded bg-[#E6EEE5] text-[#315C43] flex items-center justify-center font-medium">
                  ↺
                </div>
                <div>
                  <div className="font-medium text-[#262626]">Recalibrate Plan</div>
                  <div className="text-[10px] text-[#6E6E68]">Update pacing & milestone order</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setShowActionsMenu(false);
                  setOnboardingOpen(true);
                }}
                className="w-full text-left px-2.5 py-2 text-xs text-[#262626] hover:bg-[#F7F5EF] rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <div className="w-6 h-6 rounded bg-[#F1E9DA] text-[#B58A52] flex items-center justify-center font-medium">
                  ✎
                </div>
                <div>
                  <div className="font-medium text-[#262626]">Update Learning Goal</div>
                  <div className="text-[10px] text-[#6E6E68]">Adjust target role or schedule</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Streak Counter */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F1E9DA]/60 border border-[#E3DED3] text-[#B58A52] text-xs font-semibold">
          <Flame className="w-3.5 h-3.5 text-[#B58A52] fill-[#B58A52]/20" />
          <span>{profile.currentStreak}d streak</span>
        </div>

        {/* Ask Mentora / Learning Guide Button */}
        <button
          onClick={() => setIsTutorOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#315C43] hover:bg-[#264935] text-white text-xs font-medium shadow-2xs transition-all cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#F1E9DA]" />
          <span className="hidden sm:inline">Ask Mentora</span>
        </button>

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-[#6E6E68] hover:text-[#262626] hover:bg-[#F1E9DA]/40 border border-transparent hover:border-[#E3DED3] transition-colors cursor-pointer"
            title="Notes and updates"
          >
            <Bell className="w-4 h-4" />
            {aiInsights.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#315C43]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white border border-[#E3DED3] shadow-md p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#E3DED3]">
                <div className="flex items-center gap-1.5 text-xs font-medium text-[#262626]">
                  <span className="font-serif font-bold text-sm text-[#262626]">Updates & Notes</span>
                </div>
                <span className="text-[11px] text-[#6E6E68]">{aiInsights.length} new</span>
              </div>
              <div className="mt-2 space-y-2 max-h-72 overflow-y-auto pr-1">
                {aiInsights.map(insight => (
                  <div
                    key={insight.id}
                    className="p-2.5 rounded-lg bg-[#F7F5EF] border border-[#E3DED3] hover:border-[#66836B] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-medium text-[#262626]">{insight.title}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#E6EEE5] text-[#315C43] border border-[#E3DED3] shrink-0 font-medium">
                        {insight.badgeText.replace(/AI/g, 'Path')}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6E6E68] mt-1 leading-relaxed">{insight.description}</p>
                    {insight.actionText && (
                      <button
                        onClick={() => {
                          setShowNotifications(false);
                          if (insight.actionTab) setActiveTab(insight.actionTab);
                        }}
                        className="mt-2 text-[11px] font-medium text-[#315C43] hover:text-[#264935] flex items-center gap-1 cursor-pointer"
                      >
                        {insight.actionText} →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Button */}
        <button
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-2 pl-2 border-l border-[#E3DED3] focus:outline-none group cursor-pointer"
        >
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-8 h-8 rounded-full object-cover border border-[#E3DED3] group-hover:border-[#315C43] transition-all"
          />
          <div className="hidden xl:block text-left">
            <div className="text-xs font-medium text-[#262626] group-hover:text-[#315C43] transition-colors">
              {profile.name}
            </div>
            <div className="text-[10px] text-[#6E6E68]">{profile.overallProgress}% Completed</div>
          </div>
        </button>
      </div>
    </header>
  );
};

