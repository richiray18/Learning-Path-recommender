export interface LearnerProfile {
  name: string;
  avatar: string;
  goal: string;
  targetRole: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  targetDeadline: string; // e.g. "8 months"
  dailyAvailability: string; // e.g. "1.5 hours/day"
  learningStyles: string[]; // ["Hands-on projects", "Interactive exercises", "Video"]
  currentStreak: number;
  overallProgress: number; // 64%
  skillsDevelopedCount: number; // 18
  totalSkillsCount: number; // 30
  targetDate: string;
  weeklyTargetMinutes: number;
  completedActivitiesCount: number;
}

export interface SkillGap {
  id: string;
  name: string;
  category: 'Foundation' | 'Core ML' | 'Advanced' | 'Deployment';
  currentLevel: number; // 0 to 100
  targetLevel: number; // 0 to 100
  priority: 'High' | 'Medium' | 'Low';
  whyItMatters: string;
  aiInsight: string;
  status: 'Critical Gap' | 'Improving' | 'Proficient' | 'Mastered';
}

export interface CourseItem {
  id: string;
  title: string;
  provider: string;
  providerLogo?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  skillsGained: string[];
  matchPercentage: number;
  prerequisites: string[];
  aiReason: string;
  goalAlignmentScore: number; // 1-5
  skillGapScore: number; // 1-5
  prereqFitScore: number; // 1-5
  learningStyleScore: number; // 1-5
  expectedGapReduction: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'locked';
  progress: number;
  rating: number;
  isBookmarked?: boolean;
  phaseId: string;
  description: string;
  topicsCount: number;
  lessons: Array<{ title: string; duration: string; completed: boolean }>;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  status: 'In Progress' | 'Completed' | 'Locked' | 'Up Next';
  progress: number;
  skills: string[];
  deadlineDays: number;
  unlockRequirement?: string;
  whyRecommended: string;
  phaseId: string;
  deliverables: string[];
  repoUrl?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AssessmentItem {
  id: string;
  title: string;
  type: 'Skill Quiz' | 'Knowledge Check' | 'Project Evaluation' | 'Milestone Challenge';
  score?: number;
  completed: boolean;
  questionsCount: number;
  durationMinutes: number;
  targetSkill: string;
  phaseId: string;
  aiFeedback?: string;
  weakAreas?: string[];
  questions: QuizQuestion[];
  unlocked: boolean;
}

export interface RoadmapMilestone {
  title: string;
  badge: string;
  description: string;
  completed: boolean;
  achievedDate?: string;
}

export interface RoadmapPhase {
  id: string;
  phaseNumber: number;
  title: string;
  timeframe: string;
  originalTimeframe?: string;
  status: 'completed' | 'in_progress' | 'upcoming' | 'locked';
  description: string;
  isAdapted?: boolean;
  adaptationNote?: string;
  milestone: RoadmapMilestone;
  courseIds: string[];
  projectIds: string[];
  assessmentIds: string[];
  skills: string[];
}

export interface DailyPlanItem {
  id: string;
  actionType: 'Complete' | 'Practice' | 'Build' | 'Review';
  title: string;
  duration: string;
  progress: number;
  completed: boolean;
  category: string;
  linkedCourseId?: string;
  linkedProjectId?: string;
  linkedAssessmentId?: string;
}

export interface WeeklyActivityLog {
  day: string;
  minutes: number;
  targetMinutes: number;
  topicsLearned: string[];
}

export interface AIInsightNotification {
  id: string;
  iconType: 'sparkles' | 'fire' | 'zap' | 'target' | 'clock';
  title: string;
  description: string;
  timestamp: string;
  badgeText: string;
  actionText?: string;
  actionTab?: string;
}

export interface AdaptationHistory {
  id: string;
  timestamp: string;
  trigger: string;
  reason: string;
  before: string;
  after: string;
  milestoneShift: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedActions?: Array<{ label: string; action: () => void }>;
}

export interface FeedbackRecord {
  id: string;
  resourceTitle: string;
  feeling: 'too_difficult' | 'okay' | 'good' | 'too_easy';
  useful: boolean;
  aiResponseText: string;
  timestamp: string;
}
