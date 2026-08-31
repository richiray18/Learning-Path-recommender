import React, { useState } from 'react';
import { LearningPathProvider, useLearningPath } from './context/LearningPathContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { CoursesView } from './components/courses/CoursesView';
import { SkillsView } from './components/skills/SkillsView';
import { ProjectsView } from './components/projects/ProjectsView';
import { AssessmentsView } from './components/assessments/AssessmentsView';
import { ProgressView } from './components/progress/ProgressView';
import { AchievementsView } from './components/achievements/AchievementsView';
import { ProfileView } from './components/profile/ProfileView';
import { SettingsView } from './components/settings/SettingsView';

import { AIOnboardingModal } from './components/onboarding/AIOnboardingModal';
import { AITutorDrawer } from './components/tutor/AITutorDrawer';
import { WhyRecommendedModal } from './components/courses/WhyRecommendedModal';
import { PrerequisiteModal } from './components/roadmap/PrerequisiteModal';
import { QuizModal } from './components/assessments/QuizModal';
import { SkillDeepDiveModal } from './components/skills/SkillDeepDiveModal';
import { FeedbackWidget } from './components/common/FeedbackWidget';
import { AdaptiveNotificationToast } from './components/common/AdaptiveNotificationToast';

const MainLayout: React.FC = () => {
  const { activeTab } = useLearningPath();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (activeTab === 'landing') {
    return (
      <div className="min-h-screen bg-[#F7F5EF] text-[#262626] flex flex-col font-sans">
        <Navbar />
        <main className="flex-1">
          <LandingPage />
        </main>
        <AIOnboardingModal />
        <AITutorDrawer />
        <WhyRecommendedModal />
        <PrerequisiteModal />
        <QuizModal />
        <SkillDeepDiveModal />
        <FeedbackWidget />
        <AdaptiveNotificationToast />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#262626] flex flex-col selection:bg-[#315C43]/20 selection:text-[#315C43] font-sans">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F7F5EF]">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'overview' && <OverviewDashboard />}
            {activeTab === 'roadmap' && <RoadmapView />}
            {activeTab === 'courses' && <CoursesView />}
            {activeTab === 'skills' && <SkillsView />}
            {activeTab === 'projects' && <ProjectsView />}
            {activeTab === 'assessments' && <AssessmentsView />}
            {activeTab === 'progress' && <ProgressView />}
            {activeTab === 'achievements' && <AchievementsView />}
            {activeTab === 'profile' && <ProfileView />}
            {activeTab === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>

      {/* Global Modals, Drawers & Overlays */}
      <AIOnboardingModal />
      <AITutorDrawer />
      <WhyRecommendedModal />
      <PrerequisiteModal />
      <QuizModal />
      <SkillDeepDiveModal />
      <FeedbackWidget />
      <AdaptiveNotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <LearningPathProvider>
      <MainLayout />
    </LearningPathProvider>
  );
}

