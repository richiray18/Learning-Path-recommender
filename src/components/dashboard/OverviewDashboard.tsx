import React from 'react';
import {
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Target,
  BookOpen,
  FolderGit2,
  Calendar,
  Check,
} from 'lucide-react';
import { useLearningPath } from '../../context/LearningPathContext';

export const OverviewDashboard: React.FC = () => {
  const {
    profile,
    dailyPlan,
    toggleDailyPlanItem,
    skillGaps,
    projects,
    weeklyActivity,
    setActiveTab,
    startCourse,
    setActiveQuiz,
    assessments,
    setSelectedCourseForModal,
    courses,
    setSelectedSkillForDeepDive,
    roadmapPhases,
  } = useLearningPath();

  const decisionTreesCourse = courses.find(c => c.id === 'course-decision-trees') || courses[0];
  const churnProject = projects.find(p => p.id === 'proj-churn-predictor') || projects[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Editorial Greeting Header */}
      <div className="border-b border-[#E3DED3] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#262626] tracking-tight">
            Good day, {profile.name.split(' ')[0]}.
          </h1>
          <p className="text-base text-[#6E6E68] mt-1.5 max-w-2xl font-normal leading-relaxed">
            You&apos;re making good progress toward your goal of becoming a{' '}
            <strong className="text-[#315C43] font-semibold">{profile.targetRole}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E3DED3] text-xs font-medium text-[#6E6E68] shadow-2xs">
            <Calendar className="w-4 h-4 text-[#315C43]" />
            <span>Target: {profile.targetDeadline}</span>
          </div>
          <button
            onClick={() => setActiveTab('roadmap')}
            className="px-3.5 py-1.5 rounded-lg bg-[#FFFFFF] hover:bg-[#F1E9DA]/50 border border-[#E3DED3] text-[#315C43] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <span>Full Learning Path</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Grid Layout: Primary Plan & Guidance (Left) + Journey & Growth (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Today's Plan, Continue Learning, Next Step */}
        <div className="lg:col-span-8 space-y-8">
          {/* 1. TODAY'S PLAN (Checklist) */}
          <section className="p-6 rounded-2xl bg-white border border-[#E3DED3] shadow-xs space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-serif font-bold text-[#262626]">Today&apos;s Plan</h2>
                <p className="text-sm text-[#6E6E68] mt-0.5">Three things to keep you moving forward.</p>
              </div>

              <span className="text-xs text-[#315C43] font-medium bg-[#E6EEE5] px-2.5 py-1 rounded-md border border-[#D3E0D2]">
                {dailyPlan.filter(p => p.completed).length} of {dailyPlan.length} completed
              </span>
            </div>

            <div className="space-y-3">
              {dailyPlan.map(item => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                    item.completed
                      ? 'bg-[#F7F5EF] border-[#E3DED3] opacity-75'
                      : 'bg-white border-[#E3DED3] hover:border-[#66836B] shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <button
                      onClick={() => toggleDailyPlanItem(item.id)}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                        item.completed
                          ? 'bg-[#315C43] border-[#315C43] text-white'
                          : 'border-[#E3DED3] hover:border-[#315C43] text-transparent'
                      }`}
                      aria-label="Toggle task"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-medium truncate ${
                            item.completed ? 'line-through text-[#8E8D88]' : 'text-[#262626]'
                          }`}
                        >
                          {item.title}
                        </span>
                      </div>
                      <div className="text-xs text-[#6E6E68] mt-0.5 flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#8E8D88]" />
                          {item.duration}
                        </span>
                        <span>•</span>
                        <span>{item.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.linkedAssessmentId ? (
                      <button
                        onClick={() => {
                          const quiz = assessments.find(a => a.id === item.linkedAssessmentId);
                          if (quiz) setActiveQuiz(quiz);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#E6EEE5] hover:bg-[#D3E0D2] text-[#315C43] text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>Start</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : item.linkedCourseId ? (
                      <button
                        onClick={() => startCourse(item.linkedCourseId!)}
                        className="px-3 py-1.5 rounded-lg bg-[#315C43] hover:bg-[#264935] text-white text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                      >
                        <span>Continue</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveTab('projects')}
                        className="px-3 py-1.5 rounded-lg bg-[#E6EEE5] hover:bg-[#D3E0D2] text-[#315C43] text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>Open</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 2. CONTINUE LEARNING & YOUR NEXT STEP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Continue Learning Card */}
            <div className="p-6 rounded-2xl bg-white border border-[#E3DED3] shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-[#6E6E68]">
                  Continue Learning
                </span>
                <h3 className="text-lg font-serif font-bold text-[#262626] mt-1.5">
                  Machine Learning Foundations
                </h3>
                <p className="text-xs text-[#6E6E68] mt-1">Decision Trees & Ensembles</p>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#6E6E68]">
                    <span>80% complete</span>
                    <span className="text-[#315C43] font-medium">25m remaining</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#E3DED3] overflow-hidden">
                    <div className="h-full rounded-full bg-[#315C43]" style={{ width: '80%' }} />
                  </div>
                  <p className="text-xs text-[#6E6E68] pt-1">You&apos;re almost finished with this module.</p>
                </div>
              </div>

              <button
                onClick={() => startCourse('course-decision-trees')}
                className="w-full py-2.5 rounded-xl bg-[#315C43] hover:bg-[#264935] text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
              >
                <span>Continue Learning →</span>
              </button>
            </div>

            {/* Your Next Step (Mentor guidance) */}
            <div className="p-6 rounded-2xl bg-[#F1E9DA]/40 border border-[#E3DED3] shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-[#B58A52]">
                  Your Next Step
                </span>
                <h3 className="text-lg font-serif font-bold text-[#262626] mt-1.5">
                  Finish Decision Trees & Ensembles
                </h3>
                <p className="text-xs text-[#6E6E68] mt-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#B58A52]" />
                  <span>25 minutes</span>
                </p>

                <p className="text-xs text-[#484844] mt-3 leading-relaxed">
                  You&apos;re almost done. Completing this module will unlock the next topic in your learning path.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => startCourse('course-decision-trees')}
                  className="flex-1 py-2.5 rounded-xl bg-[#315C43] hover:bg-[#264935] text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <span>Continue</span>
                </button>
                <button
                  onClick={() => {
                    if (decisionTreesCourse) setSelectedCourseForModal(decisionTreesCourse);
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#F7F5EF] border border-[#E3DED3] text-[#6E6E68] hover:text-[#262626] text-xs font-medium transition-colors cursor-pointer shadow-2xs"
                >
                  Details
                </button>
              </div>
            </div>
          </div>

          {/* Active Applied Project */}
          {churnProject && (
            <div className="p-6 rounded-2xl bg-white border border-[#E3DED3] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-[#6E6E68]">
                    Active Project
                  </span>
                  <h3 className="text-lg font-serif font-bold text-[#262626] mt-0.5">
                    {churnProject.title}
                  </h3>
                </div>

                <span className="text-xs px-2.5 py-1 rounded-md bg-[#F1E9DA] text-[#B58A52] border border-[#E3DED3] font-medium">
                  {churnProject.progress}% complete
                </span>
              </div>

              <p className="text-xs text-[#6E6E68] leading-relaxed">
                {churnProject.description}
              </p>

              <div className="w-full h-2 rounded-full bg-[#E3DED3] overflow-hidden">
                <div className="h-full rounded-full bg-[#315C43]" style={{ width: `${churnProject.progress}%` }} />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  {churnProject.skills.map(sk => (
                    <span key={sk} className="px-2 py-0.5 rounded bg-[#F7F5EF] text-[#6E6E68] border border-[#E3DED3] text-[11px]">
                      {sk}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setActiveTab('projects')}
                  className="text-xs font-medium text-[#315C43] hover:text-[#264935] flex items-center gap-1 cursor-pointer"
                >
                  Continue Project →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Journey Timeline, Skill Growth, Weekly Activity */}
        <div className="lg:col-span-4 space-y-8">
          {/* YOUR LEARNING JOURNEY TIMELINE */}
          <div className="p-6 rounded-2xl bg-white border border-[#E3DED3] shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#E3DED3] pb-3">
              <h3 className="text-base font-serif font-bold text-[#262626]">Your Learning Journey</h3>
              <button
                onClick={() => setActiveTab('roadmap')}
                className="text-xs font-medium text-[#315C43] hover:text-[#264935] cursor-pointer"
              >
                View
              </button>
            </div>

            <div className="space-y-4">
              {roadmapPhases.map((phase, idx) => {
                const isDone = phase.status === 'completed';
                const isCurrent = phase.status === 'in_progress';
                return (
                  <div key={phase.id} className="flex items-start gap-3 relative">
                    {/* Vertical connector line */}
                    {idx !== roadmapPhases.length - 1 && (
                      <div
                        className={`absolute left-2.5 top-6 bottom-0 w-0.5 ${
                          isDone ? 'bg-[#315C43]' : 'bg-[#E3DED3]'
                        }`}
                        style={{ height: 'calc(100% + 4px)' }}
                      />
                    )}

                    {/* Step Icon */}
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 z-10 ${
                        isDone
                          ? 'bg-[#315C43] text-white'
                          : isCurrent
                          ? 'bg-[#E6EEE5] text-[#315C43] border-2 border-[#315C43]'
                          : 'bg-[#F7F5EF] text-[#8E8D88] border border-[#E3DED3]'
                      }`}
                    >
                      {isDone ? '✓' : idx + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#262626] truncate">{phase.title}</span>
                        <span className="text-[11px] text-[#6E6E68]">
                          {isDone ? 'Completed' : isCurrent ? 'In Progress' : 'Upcoming'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6E6E68] mt-0.5 line-clamp-1">{phase.timeframe}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* YOUR SKILLS & FOCUS AREA */}
          <div className="p-6 rounded-2xl bg-white border border-[#E3DED3] shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#E3DED3] pb-3">
              <div>
                <h3 className="text-base font-serif font-bold text-[#262626]">Your Skills</h3>
              </div>
              <button
                onClick={() => setActiveTab('skills')}
                className="text-xs font-medium text-[#315C43] hover:text-[#264935] cursor-pointer"
              >
                All Skills
              </button>
            </div>

            <div className="space-y-3.5">
              {skillGaps.slice(0, 5).map(skill => (
                <div key={skill.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#262626]">{skill.name}</span>
                    <span className="text-[#6E6E68] font-medium">{skill.currentLevel}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#E3DED3] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#315C43] transition-all duration-500"
                      style={{ width: `${skill.currentLevel}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Focus Area note */}
            <div className="p-3.5 rounded-xl bg-[#F1E9DA]/50 border border-[#E3DED3] text-xs">
              <span className="font-semibold text-[#B58A52] block mb-0.5">Focus area: Statistics</span>
              <p className="text-[#6E6E68] leading-relaxed">
                Improving this skill will help you move into the next stage of your path.
              </p>
            </div>
          </div>

          {/* WEEKLY ACTIVITY */}
          <div className="p-6 rounded-2xl bg-white border border-[#E3DED3] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E3DED3] pb-3">
              <div>
                <h3 className="text-base font-serif font-bold text-[#262626]">Learning Activity</h3>
                <p className="text-xs text-[#6E6E68] mt-0.5">7h 30m logged this week</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#B58A52] font-semibold bg-[#F1E9DA] px-2 py-0.5 rounded">
                <Flame className="w-3.5 h-3.5 fill-[#B58A52]/20" />
                <span>{profile.currentStreak} days</span>
              </div>
            </div>

            <div className="flex items-end justify-between gap-1.5 h-20 pt-2">
              {weeklyActivity.map(day => {
                const maxMin = 120;
                const heightPercent = Math.min(100, Math.max(15, (day.minutes / maxMin) * 100));
                const isOver = day.minutes >= day.targetMinutes;
                return (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="w-full flex items-end justify-center h-14 bg-[#F7F5EF] rounded-md p-0.5">
                      <div
                        className={`w-full rounded-sm transition-all duration-300 ${
                          isOver ? 'bg-[#315C43]' : 'bg-[#66836B]'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                        title={`${day.day}: ${day.minutes} min`}
                      />
                    </div>
                    <span className="text-[10px] text-[#6E6E68]">{day.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

