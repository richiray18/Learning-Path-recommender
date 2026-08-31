import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  Lock,
  ArrowRight,
  BookOpen,
  FolderGit2,
  CheckSquare,
  Award,
  Clock,
  Layers,
  SlidersHorizontal,
} from 'lucide-react';
import { useLearningPath } from '../../context/LearningPathContext';

export const RoadmapView: React.FC = () => {
  const {
    roadmapPhases,
    profile,
    courses,
    projects,
    assessments,
    setSelectedCourseForModal,
    setSelectedPrereqForModal,
    startCourse,
    setActiveQuiz,
    triggerDemoAdaptiveFlow,
  } = useLearningPath();

  const [viewOrientation, setViewOrientation] = useState<'vertical' | 'horizontal'>('vertical');

  const prereqChain = [
    { title: 'Python Foundations', status: 'completed' },
    { title: 'Applied Statistics', status: 'completed' },
    { title: 'Core Machine Learning', status: 'in_progress' },
    { title: 'Deep Learning & Neural Networks', status: 'locked' },
    { title: 'Production MLOps', status: 'locked' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="border-b border-[#E3DED3] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-[#315C43] bg-[#E6EEE5] px-2.5 py-0.5 rounded border border-[#D3E0D2]">
              Structured Curriculum
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#262626] tracking-tight">
            My Learning Path
          </h1>
          <p className="text-sm text-[#6E6E68] mt-1 max-w-2xl leading-relaxed">
            A comprehensive, personalized sequence designed to guide you toward mastering{' '}
            <strong className="text-[#262626]">{profile.targetRole}</strong> by{' '}
            <strong className="text-[#315C43]">{profile.targetDeadline}</strong>.
          </p>
        </div>

        {/* View Switcher & Recalibrate */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={triggerDemoAdaptiveFlow}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#F1E9DA]/50 border border-[#E3DED3] text-[#315C43] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title="Adjust schedule and pacing"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#315C43]" />
            <span>Recalibrate Schedule</span>
          </button>

          <div className="flex items-center bg-[#F1E9DA]/60 border border-[#E3DED3] rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setViewOrientation('vertical')}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                viewOrientation === 'vertical' ? 'bg-white text-[#262626] shadow-2xs' : 'text-[#6E6E68] hover:text-[#262626]'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setViewOrientation('horizontal')}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                viewOrientation === 'horizontal' ? 'bg-white text-[#262626] shadow-2xs' : 'text-[#6E6E68] hover:text-[#262626]'
              }`}
            >
              Grid
            </button>
          </div>
        </div>
      </div>

      {/* Prerequisite Competency Chain */}
      <div className="p-5 rounded-2xl bg-white border border-[#E3DED3] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#315C43]" />
            <h3 className="text-sm font-serif font-bold text-[#262626]">
              Milestone Progression Sequence
            </h3>
          </div>
          <span className="text-xs text-[#6E6E68]">Follow this order to build strong foundations</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
          {prereqChain.map((node, i) => {
            const isCompleted = node.status === 'completed';
            const isCurrent = node.status === 'in_progress';
            return (
              <React.Fragment key={node.title}>
                <button
                  onClick={() => {
                    if (node.status === 'locked') {
                      setSelectedPrereqForModal({
                        lockedTitle: node.title,
                        prereqTitle: prereqChain[i - 1]?.title || 'Foundation',
                        reason: `Complete ${prereqChain[i - 1]?.title} first before transitioning into ${node.title}.`,
                      });
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                    isCompleted
                      ? 'bg-[#E6EEE5] border-[#D3E0D2] text-[#315C43]'
                      : isCurrent
                      ? 'bg-white border-[#315C43] text-[#262626] shadow-xs ring-1 ring-[#315C43]'
                      : 'bg-[#F7F5EF] border-[#E3DED3] text-[#8E8D88] hover:border-[#66836B]'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#315C43]" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-[#315C43]" />
                  ) : (
                    <Lock className="w-3 h-3 text-[#8E8D88]" />
                  )}
                  <span>{node.title}</span>
                </button>
                {i < prereqChain.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-[#A39E93] shrink-0" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Roadmap Phases List */}
      <div
        className={
          viewOrientation === 'horizontal'
            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6'
            : 'space-y-6 relative'
        }
      >
        {roadmapPhases.map(phase => {
          const isDone = phase.status === 'completed';
          const isCurrent = phase.status === 'in_progress';
          const isLocked = phase.status === 'locked';

          const phaseCourses = courses.filter(c => phase.courseIds.includes(c.id));
          const phaseProjects = projects.filter(p => phase.projectIds.includes(p.id));
          const phaseAssessments = assessments.filter(a => phase.assessmentIds.includes(a.id));

          return (
            <div
              key={phase.id}
              className={`rounded-2xl border transition-all relative overflow-hidden bg-white shadow-xs ${
                isCurrent
                  ? 'border-[#315C43] ring-1 ring-[#315C43]/20'
                  : isDone
                  ? 'border-[#D3E0D2]'
                  : 'border-[#E3DED3]'
              }`}
            >
              {/* Top Phase Header */}
              <div
                className={`p-6 border-b ${
                  isCurrent
                    ? 'border-[#D3E0D2] bg-[#E6EEE5]/50'
                    : isDone
                    ? 'border-[#E3DED3] bg-[#F7F5EF]'
                    : 'border-[#E3DED3] bg-[#FAF8F5]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
                        isDone
                          ? 'bg-white text-[#315C43] border border-[#D3E0D2]'
                          : isCurrent
                          ? 'bg-[#315C43] text-white'
                          : 'bg-[#F1E9DA] text-[#6E6E68]'
                      }`}
                    >
                      PHASE {phase.phaseNumber}
                    </span>
                    <span className="text-xs text-[#6E6E68] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#8E8D88]" />
                      {phase.timeframe}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded-md ${
                      isDone
                        ? 'bg-[#E6EEE5] text-[#315C43] border border-[#D3E0D2]'
                        : isCurrent
                        ? 'bg-white text-[#315C43] border border-[#315C43] shadow-2xs'
                        : 'bg-[#F1E9DA] text-[#6E6E68]'
                    }`}
                  >
                    {isDone ? 'Completed' : isCurrent ? 'Active Focus' : isLocked ? 'Locked' : 'Upcoming'}
                  </span>
                </div>

                <h3 className="text-xl font-serif font-bold text-[#262626] mt-2.5">{phase.title}</h3>
                <p className="text-xs text-[#6E6E68] mt-1 leading-relaxed">{phase.description}</p>
              </div>

              {/* Phase Content: Courses, Projects, Assessments & Milestone */}
              <div className="p-6 space-y-5">
                {/* Courses Section */}
                <div className="space-y-3">
                  <div className="text-xs font-serif uppercase tracking-wider text-[#6E6E68] font-bold flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#315C43]" /> Core Modules
                  </div>
                  <div className="grid grid-cols-1 gap-2.5">
                    {phaseCourses.map(course => (
                      <div
                        key={course.id}
                        className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          course.status === 'completed'
                            ? 'bg-[#F7F5EF] border-[#E3DED3]'
                            : course.status === 'in_progress'
                            ? 'bg-white border-[#315C43]/40 shadow-2xs'
                            : 'bg-white border-[#E3DED3]'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[#262626] truncate">{course.title}</span>
                          </div>
                          <div className="text-xs text-[#6E6E68] mt-0.5 flex items-center gap-2">
                            <span>{course.provider}</span>
                            <span>•</span>
                            <span>{course.difficulty}</span>
                            <span>•</span>
                            <span>{course.duration}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setSelectedCourseForModal(course)}
                            className="text-xs text-[#6E6E68] hover:text-[#262626] font-medium px-2 py-1 rounded hover:bg-[#F7F5EF] cursor-pointer"
                          >
                            Overview
                          </button>
                          {course.status === 'completed' ? (
                            <span className="text-xs text-[#315C43] flex items-center gap-1 font-medium bg-[#E6EEE5] px-2.5 py-1 rounded-md border border-[#D3E0D2]">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                            </span>
                          ) : course.status === 'locked' ? (
                            <button
                              onClick={() =>
                                setSelectedPrereqForModal({
                                  lockedTitle: course.title,
                                  prereqTitle: course.prerequisites[0] || 'Previous phase requirements',
                                  reason: course.aiReason,
                                })
                              }
                              className="px-3 py-1.5 rounded-lg bg-[#F1E9DA] text-[#6E6E68] text-xs flex items-center gap-1 hover:bg-[#E3DED3] cursor-pointer"
                            >
                              <Lock className="w-3 h-3" /> Locked
                            </button>
                          ) : (
                            <button
                              onClick={() => startCourse(course.id)}
                              className="px-3 py-1.5 rounded-lg bg-[#315C43] hover:bg-[#264935] text-white text-xs font-medium flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                            >
                              <span>{course.progress > 0 ? `Continue (${course.progress}%)` : 'Start'}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Project Section */}
                {phaseProjects.length > 0 && (
                  <div className="space-y-3 pt-3 border-t border-[#E3DED3]">
                    <div className="text-xs font-serif uppercase tracking-wider text-[#6E6E68] font-bold flex items-center gap-1.5">
                      <FolderGit2 className="w-3.5 h-3.5 text-[#315C43]" /> Milestone Project
                    </div>
                    {phaseProjects.map(proj => (
                      <div
                        key={proj.id}
                        className="p-4 rounded-xl bg-[#F7F5EF] border border-[#E3DED3] flex items-center justify-between gap-3"
                      >
                        <div>
                          <h4 className="text-xs font-medium text-[#262626]">{proj.title}</h4>
                          <p className="text-xs text-[#6E6E68] mt-0.5">{proj.description}</p>
                        </div>
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-md shrink-0 ${
                            proj.status === 'Completed'
                              ? 'bg-[#E6EEE5] text-[#315C43] border border-[#D3E0D2]'
                              : proj.status === 'In Progress'
                              ? 'bg-[#F1E9DA] text-[#B58A52] border border-[#E3DED3]'
                              : 'bg-white text-[#6E6E68] border border-[#E3DED3]'
                          }`}
                        >
                          {proj.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Assessment Section */}
                {phaseAssessments.length > 0 && (
                  <div className="space-y-3 pt-3 border-t border-[#E3DED3]">
                    <div className="text-xs font-serif uppercase tracking-wider text-[#6E6E68] font-bold flex items-center gap-1.5">
                      <CheckSquare className="w-3.5 h-3.5 text-[#315C43]" /> Competency Assessment
                    </div>
                    {phaseAssessments.map(assess => (
                      <div
                        key={assess.id}
                        className="p-4 rounded-xl bg-[#F7F5EF] border border-[#E3DED3] flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-[#262626]">{assess.title}</span>
                            {assess.score && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#E6EEE5] text-[#315C43] font-medium border border-[#D3E0D2]">
                                Score: {assess.score}%
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#6E6E68] mt-0.5">{assess.type} · {assess.questionsCount} questions</p>
                        </div>
                        {assess.completed ? (
                          <span className="text-xs text-[#315C43] font-medium flex items-center gap-1 bg-[#E6EEE5] px-2.5 py-1 rounded-md border border-[#D3E0D2]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Passed
                          </span>
                        ) : (
                          <button
                            onClick={() => setActiveQuiz(assess)}
                            className="px-3 py-1.5 rounded-lg bg-[#E6EEE5] hover:bg-[#D3E0D2] text-[#315C43] border border-[#D3E0D2] text-xs font-medium transition-colors cursor-pointer"
                          >
                            Take Challenge
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Milestone Footer */}
                <div className="pt-3 border-t border-[#E3DED3] flex items-center justify-between bg-[#F1E9DA]/40 p-3.5 rounded-xl border border-[#E3DED3]">
                  <div className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-[#B58A52]" />
                    <div>
                      <span className="text-[10px] text-[#6E6E68] uppercase font-mono block font-medium">Phase Milestone</span>
                      <span className="text-xs font-serif font-bold text-[#262626]">{phase.milestone.title}</span>
                    </div>
                  </div>

                  <span className="text-xs font-medium text-[#315C43] bg-white px-2.5 py-1 rounded-md border border-[#E3DED3]">
                    {phase.milestone.badge}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

