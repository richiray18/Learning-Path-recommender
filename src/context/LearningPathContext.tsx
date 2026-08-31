import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  LearnerProfile,
  SkillGap,
  CourseItem,
  ProjectItem,
  AssessmentItem,
  RoadmapPhase,
  DailyPlanItem,
  WeeklyActivityLog,
  AIInsightNotification,
  AdaptationHistory,
  ChatMessage,
} from '../types';
import {
  initialProfile,
  initialSkillGaps,
  initialCourses,
  initialProjects,
  initialAssessments,
  initialRoadmapPhases,
  initialDailyPlan,
  initialWeeklyActivity,
  initialAIInsights,
  initialAdaptationHistory,
} from '../data/initialData';
import {
  dashboardApi,
  skillsApi,
  assessmentsApi,
  feedbackApi,
  tutorApi,
  progressApi,
  learningPathApi,
} from '../api';

interface LearningPathContextType {
  profile: LearnerProfile;
  updateProfile: (updated: Partial<LearnerProfile>) => void;
  skillGaps: SkillGap[];
  updateSkillLevel: (skillId: string, delta: number) => void;
  courses: CourseItem[];
  toggleBookmarkCourse: (courseId: string) => void;
  updateCourseProgress: (courseId: string, progress: number) => void;
  startCourse: (courseId: string) => void;
  projects: ProjectItem[];
  updateProjectProgress: (projectId: string, progress: number) => void;
  submitProject: (projectId: string) => void;
  assessments: AssessmentItem[];
  submitAssessmentQuiz: (assessmentId: string, score: number, userAnswers: number[]) => void;
  roadmapPhases: RoadmapPhase[];
  dailyPlan: DailyPlanItem[];
  toggleDailyPlanItem: (planId: string) => void;
  weeklyActivity: WeeklyActivityLog[];
  aiInsights: AIInsightNotification[];
  dismissInsight: (id: string) => void;
  adaptationHistory: AdaptationHistory[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCourseForModal: CourseItem | null;
  setSelectedCourseForModal: (course: CourseItem | null) => void;
  selectedPrereqForModal: { lockedTitle: string; prereqTitle: string; reason: string } | null;
  setSelectedPrereqForModal: (val: { lockedTitle: string; prereqTitle: string; reason: string } | null) => void;
  activeQuiz: AssessmentItem | null;
  setActiveQuiz: (assessment: AssessmentItem | null) => void;
  feedbackModalData: { resourceTitle: string; isOpen: boolean; courseId?: string } | null;
  setFeedbackModalData: (val: { resourceTitle: string; isOpen: boolean; courseId?: string } | null) => void;
  submitFeedback: (feeling: 'too_difficult' | 'okay' | 'good' | 'too_easy', useful: boolean) => void;
  isTutorOpen: boolean;
  setIsTutorOpen: (isOpen: boolean) => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => Promise<void>;
  isChatLoading: boolean;
  recentAdaptationToast: {
    show: boolean;
    title: string;
    reason: string;
    before: string;
    after: string;
    shift: string;
  } | null;
  dismissAdaptationToast: () => void;
  triggerDemoAdaptiveFlow: () => void;
  onboardingOpen: boolean;
  setOnboardingOpen: (open: boolean) => void;
  completeOnboardingFlow: (data: {
    goal: string;
    experience: 'Beginner' | 'Intermediate' | 'Advanced';
    skills: string[];
    preferences: string[];
    time: string;
    deadline: string;
  }) => Promise<void>;
  darkMode: boolean;
  toggleDarkMode: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedSkillForDeepDive: SkillGap | null;
  setSelectedSkillForDeepDive: (skill: SkillGap | null) => void;
  triggerConfetti: () => void;
}

const LearningPathContext = createContext<LearningPathContextType | undefined>(undefined);

export const LearningPathProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<LearnerProfile>(initialProfile);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>(initialSkillGaps);
  const [courses, setCourses] = useState<CourseItem[]>(initialCourses);
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [assessments, setAssessments] = useState<AssessmentItem[]>(initialAssessments);
  const [roadmapPhases, setRoadmapPhases] = useState<RoadmapPhase[]>(initialRoadmapPhases);
  const [dailyPlan, setDailyPlan] = useState<DailyPlanItem[]>(initialDailyPlan);
  const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivityLog[]>(initialWeeklyActivity);
  const [aiInsights, setAiInsights] = useState<AIInsightNotification[]>(initialAIInsights);
  const [adaptationHistory, setAdaptationHistory] = useState<AdaptationHistory[]>(initialAdaptationHistory);
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [selectedCourseForModal, setSelectedCourseForModal] = useState<CourseItem | null>(null);
  const [selectedPrereqForModal, setSelectedPrereqForModal] = useState<{ lockedTitle: string; prereqTitle: string; reason: string } | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<AssessmentItem | null>(null);
  const [feedbackModalData, setFeedbackModalData] = useState<{ resourceTitle: string; isOpen: boolean; courseId?: string } | null>(null);
  const [isTutorOpen, setIsTutorOpen] = useState<boolean>(false);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [onboardingOpen, setOnboardingOpen] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSkillForDeepDive, setSelectedSkillForDeepDive] = useState<SkillGap | null>(null);

  const [recentAdaptationToast, setRecentAdaptationToast] = useState<{
    show: boolean;
    title: string;
    reason: string;
    before: string;
    after: string;
    shift: string;
  } | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: "Hi Alex! 👋 I'm your **Mentora** learning companion. I'm actively tracking your progress to become a **Machine Learning Engineer**.\n\nYour recent **88% score** in Statistics accelerated your Phase 1 schedule by 5 days. How can I help you tackle today's XGBoost lessons?",
      timestamp: '10:30 AM',
    },
  ]);

  // Initial Sync from Backend API
  useEffect(() => {
    async function loadBackendData() {
      try {
        const [dashData, skillsData, assessData, historyData] = await Promise.allSettled([
          dashboardApi.getDashboard(),
          skillsApi.getSkills(),
          assessmentsApi.getAssessments(),
          tutorApi.getHistory(),
        ]);

        if (dashData.status === 'fulfilled' && dashData.value) {
          const d = dashData.value;
          setProfile(prev => ({
            ...prev,
            overallProgress: d.overall_progress || prev.overallProgress,
            currentStreak: d.current_streak || prev.currentStreak,
            weeklyTargetMinutes: d.weekly_target_minutes || prev.weeklyTargetMinutes,
            goal: d.career_goal || prev.goal,
          }));
        }

        if (historyData.status === 'fulfilled' && historyData.value && historyData.value.length > 0) {
          setChatMessages(historyData.value);
        }
      } catch (err) {
        console.warn('Backend sync note: Loaded with default state fallback', err);
      }
    }

    loadBackendData();
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'],
      });
    } catch (e) {
      console.log('Confetti trigger', e);
    }
  };

  const updateProfile = (updated: Partial<LearnerProfile>) => {
    setProfile(prev => ({ ...prev, ...updated }));
  };

  const updateSkillLevel = (skillId: string, delta: number) => {
    setSkillGaps(prev =>
      prev.map(s => {
        if (s.id === skillId) {
          const newLevel = Math.min(100, Math.max(0, s.currentLevel + delta));
          let newStatus: SkillGap['status'] = s.status;
          if (newLevel >= s.targetLevel) newStatus = 'Mastered';
          else if (newLevel >= 70) newStatus = 'Proficient';
          else if (newLevel >= 40) newStatus = 'Improving';
          return { ...s, currentLevel: newLevel, status: newStatus };
        }
        return s;
      })
    );
  };

  const toggleBookmarkCourse = (courseId: string) => {
    setCourses(prev =>
      prev.map(c => (c.id === courseId ? { ...c, isBookmarked: !c.isBookmarked } : c))
    );
  };

  const updateCourseProgress = (courseId: string, progress: number) => {
    setCourses(prev =>
      prev.map(c => {
        if (c.id === courseId) {
          const isComp = progress >= 100;
          return {
            ...c,
            progress: Math.min(100, progress),
            status: isComp ? 'completed' : progress > 0 ? 'in_progress' : c.status,
          };
        }
        return c;
      })
    );
    // Background async update to backend API
    progressApi.updateProgress(courseId, progress).catch(() => {});
  };

  const startCourse = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    if (course.status === 'locked') {
      setSelectedPrereqForModal({
        lockedTitle: course.title,
        prereqTitle: course.prerequisites[0] || 'Previous Foundation Phase',
        reason: course.aiReason,
      });
      return;
    }

    setCourses(prev =>
      prev.map(c =>
        c.id === courseId && c.status === 'not_started' ? { ...c, status: 'in_progress', progress: 10 } : c
      )
    );

    // Prompt feedback after interacting
    setTimeout(() => {
      setFeedbackModalData({
        resourceTitle: course.title,
        isOpen: true,
        courseId: course.id,
      });
    }, 4000);
  };

  const updateProjectProgress = (projectId: string, progress: number) => {
    setProjects(prev =>
      prev.map(p => {
        if (p.id === projectId) {
          const isDone = progress >= 100;
          return {
            ...p,
            progress: Math.min(100, progress),
            status: isDone ? 'Completed' : 'In Progress',
          };
        }
        return p;
      })
    );
    progressApi.updateProgress(projectId, progress).catch(() => {});
  };

  const submitProject = (projectId: string) => {
    setProjects(prev =>
      prev.map(p => (p.id === projectId ? { ...p, status: 'Completed', progress: 100 } : p))
    );
    triggerConfetti();
    updateSkillLevel('skill-ml', 15);
    updateSkillLevel('skill-py', 5);
    setProfile(prev => ({
      ...prev,
      overallProgress: Math.min(100, prev.overallProgress + 8),
      completedActivitiesCount: prev.completedActivitiesCount + 1,
    }));
    progressApi.updateProgress(projectId, 100).catch(() => {});
  };

  const toggleDailyPlanItem = (planId: string) => {
    setDailyPlan(prev =>
      prev.map(item => {
        if (item.id === planId) {
          const newCompleted = !item.completed;
          if (newCompleted) {
            triggerConfetti();
            setProfile(p => ({
              ...p,
              overallProgress: Math.min(100, p.overallProgress + 2),
              completedActivitiesCount: p.completedActivitiesCount + 1,
            }));
            progressApi.updateProgress(planId, 100, 30).catch(() => {});
          }
          return { ...item, completed: newCompleted, progress: newCompleted ? 100 : item.progress };
        }
        return item;
      })
    );
  };

  const dismissInsight = (id: string) => {
    setAiInsights(prev => prev.filter(ins => ins.id !== id));
  };

  const dismissAdaptationToast = () => {
    setRecentAdaptationToast(null);
  };

  // Dynamic Roadmap Adaptation Engine
  const applyAdaptivePathChange = (triggerReason: string, assessmentScore: number, customNote?: string) => {
    triggerConfetti();

    // 1. Update Roadmap Phase timeframes and add adaptation badges
    setRoadmapPhases(prev =>
      prev.map(phase => {
        if (phase.id === 'phase-2') {
          return {
            ...phase,
            timeframe: 'Weeks 5–8 (Shortened by 2 weeks)',
            isAdapted: true,
            adaptationNote: customNote || `AI compressed Phase 2 by 2 weeks due to ${assessmentScore}% score on Machine Learning challenge!`,
          };
        }
        if (phase.id === 'phase-3') {
          return {
            ...phase,
            status: 'in_progress',
            timeframe: 'Weeks 9–15 (Accelerated)',
            isAdapted: true,
            adaptationNote: 'Deep Learning unlocked ahead of schedule!',
          };
        }
        return phase;
      })
    );

    // 2. Unlock Deep Learning course and projects
    setCourses(prev =>
      prev.map(c => {
        if (c.id === 'course-deep-learning') {
          return { ...c, status: 'not_started', progress: 0 };
        }
        if (c.id === 'course-decision-trees') {
          return { ...c, status: 'completed', progress: 100 };
        }
        return c;
      })
    );

    setProjects(prev =>
      prev.map(p => {
        if (p.id === 'proj-vision-api') {
          return { ...p, status: 'Up Next' };
        }
        return p;
      })
    );

    // 3. Boost skills
    updateSkillLevel('skill-ml', 18);
    updateSkillLevel('skill-stats', 12);
    updateSkillLevel('skill-dl', 10);

    // 4. Update Profile Progress and Timeline
    setProfile(prev => ({
      ...prev,
      overallProgress: Math.min(100, prev.overallProgress + 12),
      skillsDevelopedCount: Math.min(prev.totalSkillsCount, prev.skillsDevelopedCount + 3),
      targetDeadline: '6.8 months (Accelerated from 8 mo)',
    }));

    // 5. Record adaptation in history
    const newAdaptation: AdaptationHistory = {
      id: `adapt-${Date.now()}`,
      timestamp: 'Just now',
      trigger: triggerReason,
      reason: `You scored ${assessmentScore}%! Demonstrated advanced mastery of gradient descent and tree ensembles. Mentora eliminated redundant introductory modules.`,
      before: 'ML Fundamentals → 3.0 weeks',
      after: 'ML Fundamentals → 1.5 weeks',
      milestoneShift: 'Next milestone moved 5 days earlier 🎉',
    };

    setAdaptationHistory(prev => [newAdaptation, ...prev]);

    // 6. Show Toast
    setRecentAdaptationToast({
      show: true,
      title: 'Path Updated by AI',
      reason: `You scored ${assessmentScore}% on your diagnostic. Introductory ML section shortened to 1.5 weeks.`,
      before: 'ML Core: 6 weeks',
      after: 'ML Core: 4 weeks',
      shift: 'Next milestone moved 5 days earlier 🎉',
    });

    // 7. Add AI insight
    setAiInsights(prev => [
      {
        id: `insight-adapt-${Date.now()}`,
        iconType: 'sparkles',
        title: 'Roadmap dynamically accelerated!',
        description: `Your ML Core phase was shortened. Deep Learning is now unlocked early.`,
        timestamp: 'Just now',
        badgeText: 'AI Adaptation',
        actionText: 'View Roadmap',
        actionTab: 'roadmap',
      },
      ...prev,
    ]);
  };

  const submitAssessmentQuiz = async (assessmentId: string, score: number, userAnswers: number[]) => {
    // Send to backend API
    const answersMap: Record<string, number> = {};
    userAnswers.forEach((ans, idx) => {
      answersMap[`q${idx + 1}`] = ans;
    });

    try {
      const result = await assessmentsApi.submitAssessment(assessmentId, answersMap);
      
      setAssessments(prev =>
        prev.map(a => {
          if (a.id === assessmentId) {
            return {
              ...a,
              completed: true,
              score: result.score || score,
              aiFeedback: result.ai_feedback,
            };
          }
          return a;
        })
      );

      if (result.adaptation_triggered) {
        applyAdaptivePathChange(
          `Completed ${assessments.find(a => a.id === assessmentId)?.title || 'Assessment'} with score of ${result.score}%`,
          result.score,
          result.adaptation_reason
        );
      } else {
        triggerConfetti();
        updateSkillLevel('skill-ml', 8);
      }
    } catch (e) {
      // Graceful local execution
      setAssessments(prev =>
        prev.map(a => {
          if (a.id === assessmentId) {
            return {
              ...a,
              completed: true,
              score: score,
              aiFeedback: score >= 80
                ? `Outstanding performance (${score}%)! You demonstrated deep command of algorithmic mechanics, loss gradients, and regularization.`
                : `Good effort (${score}%). We have identified opportunities in precision-recall calibration.`,
            };
          }
          return a;
        })
      );

      if (score >= 80) {
        applyAdaptivePathChange(`Completed Assessment with score of ${score}%`, score);
      } else {
        triggerConfetti();
        updateSkillLevel('skill-ml', 8);
      }
    }
  };

  const triggerDemoAdaptiveFlow = () => {
    applyAdaptivePathChange('Demonstrated 91% score on ML Knowledge Assessment', 91);
  };

  const submitFeedback = async (feeling: 'too_difficult' | 'okay' | 'good' | 'too_easy', useful: boolean) => {
    const resourceTitle = feedbackModalData?.resourceTitle || 'Resource';

    try {
      const res = await feedbackApi.submitFeedback({
        resource_title: resourceTitle,
        difficulty_rating: feeling,
        useful,
      });

      if (res.adaptation_triggered) {
        setRoadmapPhases(prev =>
          prev.map(p => (p.id === 'phase-3' ? { ...p, timeframe: 'Weeks 9–14 (Fast-track)' } : p))
        );
      }

      setChatMessages(prev => [
        ...prev,
        {
          id: `feedback-resp-${Date.now()}`,
          sender: 'ai',
          text: `**Feedback Received for "${resourceTitle}":**\n\n${res.ai_response_text || 'Calibrated pacing to your feedback.'}`,
          timestamp: 'Just now',
        },
      ]);
    } catch (e) {
      let aiResponseText = '';
      if (feeling === 'too_easy') {
        aiResponseText = '⚡ Got it! Increasing the technical difficulty and code depth for your upcoming deep learning exercises.';
        setRoadmapPhases(prev =>
          prev.map(p => (p.id === 'phase-3' ? { ...p, timeframe: 'Weeks 9–14 (Fast-track)' } : p))
        );
      } else if (feeling === 'too_difficult') {
        aiResponseText = '📘 Understood. Adding an interactive visualization primer and diagnostic breakdown before your next project.';
      } else {
        aiResponseText = '🎯 Perfect! Pacing matches your optimal learning velocity.';
      }

      setChatMessages(prev => [
        ...prev,
        {
          id: `feedback-resp-${Date.now()}`,
          sender: 'ai',
          text: `**Feedback Received for "${resourceTitle}":**\n\n${aiResponseText}`,
          timestamp: 'Just now',
        },
      ]);
    }

    setFeedbackModalData(null);
  };

  const sendChatMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const res = await tutorApi.sendMessage(text, {
        goal: profile.goal,
        experience: profile.experienceLevel,
        deadline: profile.targetDeadline,
        timeAvailability: profile.dailyAvailability,
        learningStyle: profile.learningStyles.join(', '),
      });

      setChatMessages(prev => [
        ...prev,
        {
          id: res.message_id || `msg-ai-${Date.now()}`,
          sender: 'ai',
          text: res.text,
          timestamp: res.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      const lower = text.toLowerCase();
      let fallbackText = `Hello! I'm actively tracking your progress toward becoming a **${profile.goal}**. How can I help optimize your study plan today?`;
      if (lower.includes('what is ai') || lower.includes('define ai')) {
        fallbackText = `🤖 **Artificial Intelligence (AI)** is the branch of computer science focused on creating intelligent systems capable of learning, reasoning, solving complex problems, and understanding language.

In your **${profile.goal}** roadmap, you are currently mastering **Supervised Machine Learning & Tree Ensembles**, which form the production backbone of modern enterprise AI applications!`;
      } else if (lower.includes('gini') || lower.includes('entropy')) {
        fallbackText = `📊 **Gini Impurity vs Entropy:** Gini measures split impurity ($1 - \\sum p_i^2$) and is faster to compute, while Entropy ($-\\sum p_i \\log_2 p_i$) measures information gain. Both produce virtually identical trees in XGBoost & Random Forests.`;
      } else if (lower.includes('dataset') || lower.includes('churn')) {
        fallbackText = `💾 **Telco Customer Churn Dataset** is the benchmark for binary classification! Key features include tenure, contract type, and monthly charges. Try using SMOTE for class balance and SHAP for model explainability.`;
      }
      setChatMessages(prev => [
        ...prev,
        {
          id: `msg-ai-${Date.now()}`,
          sender: 'ai',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const completeOnboardingFlow = async (data: {
    goal: string;
    experience: 'Beginner' | 'Intermediate' | 'Advanced';
    skills: string[];
    preferences: string[];
    time: string;
    deadline: string;
  }) => {
    setOnboardingOpen(false);
    triggerConfetti();

    updateProfile({
      goal: data.goal,
      targetRole: data.goal,
      experienceLevel: data.experience,
      targetDeadline: data.deadline,
      dailyAvailability: data.time,
      learningStyles: data.preferences,
      overallProgress: data.experience === 'Beginner' ? 10 : data.experience === 'Intermediate' ? 25 : 45,
      currentStreak: 1,
    });

    try {
      const res = await learningPathApi.generatePath({
        goal: data.goal,
        experience_level: data.experience,
        target_deadline: data.deadline,
      });

      if (res && res.phases && res.phases.length > 0) {
        const extractedPhases: RoadmapPhase[] = res.phases.map((p: any) => ({
          id: p.id || `phase-${p.phaseNumber}`,
          phaseNumber: p.phaseNumber,
          title: p.title,
          timeframe: p.timeframe,
          status: p.status || (p.phaseNumber === 1 ? 'in_progress' : p.phaseNumber === 2 ? 'upcoming' : 'locked'),
          description: p.description,
          milestone: p.milestone || {
            title: `Phase ${p.phaseNumber} Milestone`,
            badge: `${data.goal} Practitioner`,
            description: 'Achieve foundational milestone',
            completed: false,
          },
          courseIds: p.courseIds || [],
          projectIds: p.projectIds || [],
          assessmentIds: p.assessmentIds || [],
          skills: p.skills || [],
        }));
        setRoadmapPhases(extractedPhases);

        setRecentAdaptationToast({
          show: true,
          title: `Custom Pathway Generated: ${data.goal}`,
          reason: `Tailored for ${data.experience} level, ${data.time} availability, and ${data.deadline} timeline.`,
          before: 'Default Curriculum',
          after: `${data.goal} Blueprint`,
          shift: 'Full Path Ready',
        });
      }
    } catch (e) {
      console.log('Path generation fallback', e);
    }

    setActiveTab('overview');
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <LearningPathContext.Provider
      value={{
        profile,
        updateProfile,
        skillGaps,
        updateSkillLevel,
        courses,
        toggleBookmarkCourse,
        updateCourseProgress,
        startCourse,
        projects,
        updateProjectProgress,
        submitProject,
        assessments,
        submitAssessmentQuiz,
        roadmapPhases,
        dailyPlan,
        toggleDailyPlanItem,
        weeklyActivity,
        aiInsights,
        dismissInsight,
        adaptationHistory,
        activeTab,
        setActiveTab,
        selectedCourseForModal,
        setSelectedCourseForModal,
        selectedPrereqForModal,
        setSelectedPrereqForModal,
        activeQuiz,
        setActiveQuiz,
        feedbackModalData,
        setFeedbackModalData,
        submitFeedback,
        isTutorOpen,
        setIsTutorOpen,
        chatMessages,
        sendChatMessage,
        isChatLoading,
        recentAdaptationToast,
        dismissAdaptationToast,
        triggerDemoAdaptiveFlow,
        onboardingOpen,
        setOnboardingOpen,
        completeOnboardingFlow,
        darkMode,
        toggleDarkMode,
        searchQuery,
        setSearchQuery,
        selectedSkillForDeepDive,
        setSelectedSkillForDeepDive,
        triggerConfetti,
      }}
    >
      {children}
    </LearningPathContext.Provider>
  );
};

export const useLearningPath = () => {
  const context = useContext(LearningPathContext);
  if (!context) {
    throw new Error('useLearningPath must be used within a LearningPathProvider');
  }
  return context;
};
