import React, { useState } from 'react';
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Star,
  Clock,
  ArrowRight,
  CheckCircle2,
  Lock,
  Info,
} from 'lucide-react';
import { useLearningPath } from '../../context/LearningPathContext';

export const CoursesView: React.FC = () => {
  const {
    courses,
    toggleBookmarkCourse,
    startCourse,
    setSelectedCourseForModal,
    setSelectedPrereqForModal,
    searchQuery,
  } = useLearningPath();

  const [statusFilter, setStatusFilter] = useState<'all' | 'in_progress' | 'bookmarked' | 'completed'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredCourses = courses.filter(c => {
    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchProvider = c.provider.toLowerCase().includes(q);
      const matchSkill = c.skillsGained.some(s => s.toLowerCase().includes(q));
      if (!matchTitle && !matchProvider && !matchSkill) return false;
    }

    // Status filter
    if (statusFilter === 'in_progress' && c.status !== 'in_progress') return false;
    if (statusFilter === 'bookmarked' && !c.isBookmarked) return false;
    if (statusFilter === 'completed' && c.status !== 'completed') return false;

    // Difficulty filter
    if (difficultyFilter !== 'all' && c.difficulty !== difficultyFilter) return false;

    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="border-b border-[#E3DED3] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-[#315C43] bg-[#E6EEE5] px-2.5 py-0.5 rounded border border-[#D3E0D2]">
              Curated Library
            </span>
            <span className="text-xs text-[#6E6E68]">
              {courses.filter(c => c.status === 'completed').length} of {courses.length} Completed
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#262626] tracking-tight">Courses & Modules</h1>
          <p className="text-sm text-[#6E6E68] mt-1 max-w-2xl leading-relaxed">
            Carefully evaluated learning materials sequenced to build your capabilities systematically.
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1 bg-[#F1E9DA]/60 border border-[#E3DED3] p-1 rounded-xl text-xs">
          {[
            { id: 'all', label: 'All Modules' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'bookmarked', label: 'Saved' },
            { id: 'completed', label: 'Completed' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === f.id
                  ? 'bg-white text-[#262626] shadow-2xs'
                  : 'text-[#6E6E68] hover:text-[#262626]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {difficulties.map(diff => (
          <button
            key={diff}
            onClick={() => setDifficultyFilter(diff)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
              difficultyFilter === diff
                ? 'bg-[#315C43] text-white'
                : 'bg-white text-[#6E6E68] border border-[#E3DED3] hover:text-[#262626] hover:border-[#66836B]'
            }`}
          >
            {diff === 'all' ? 'All Experience Levels' : `${diff} Level`}
          </button>
        ))}
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCourses.map(course => {
          const isDone = course.status === 'completed';
          const isInProgress = course.status === 'in_progress';
          const isLocked = course.status === 'locked';

          return (
            <div
              key={course.id}
              className={`rounded-2xl border transition-all flex flex-col justify-between overflow-hidden relative group bg-white shadow-xs ${
                isInProgress
                  ? 'border-[#315C43] ring-1 ring-[#315C43]/20'
                  : isDone
                  ? 'border-[#D3E0D2]'
                  : isLocked
                  ? 'border-[#E3DED3] opacity-80'
                  : 'border-[#E3DED3] hover:border-[#66836B]'
              }`}
            >
              {/* Course Card Top */}
              <div className="p-6 space-y-3.5">
                {/* Badges & Bookmark */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#E6EEE5] text-[#315C43] font-medium border border-[#D3E0D2]">
                    {course.matchPercentage}% Relevance
                  </span>

                  <button
                    onClick={() => toggleBookmarkCourse(course.id)}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      course.isBookmarked
                        ? 'bg-[#F1E9DA] border-[#E3DED3] text-[#B58A52]'
                        : 'border-[#E3DED3] text-[#8E8D88] hover:text-[#262626] hover:bg-[#F7F5EF]'
                    }`}
                    title={course.isBookmarked ? 'Remove Bookmark' : 'Bookmark Course'}
                  >
                    {course.isBookmarked ? (
                      <BookmarkCheck className="w-3.5 h-3.5" />
                    ) : (
                      <Bookmark className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Title & Provider */}
                <div>
                  <div className="text-xs text-[#6E6E68] font-medium">{course.provider}</div>
                  <h3 className="text-base font-serif font-bold text-[#262626] mt-0.5 group-hover:text-[#315C43] transition-colors">
                    {course.title}
                  </h3>
                </div>

                <p className="text-xs text-[#6E6E68] line-clamp-2 leading-relaxed">{course.description}</p>

                {/* Metadata Row */}
                <div className="flex items-center gap-3 text-xs text-[#6E6E68] pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#8E8D88]" /> {course.duration}
                  </span>
                  <span>•</span>
                  <span>{course.difficulty}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-[#B58A52]">
                    <Star className="w-3 h-3 fill-[#B58A52] text-[#B58A52]" /> {course.rating}
                  </span>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {course.skillsGained.map(sk => (
                    <span
                      key={sk}
                      className="px-2 py-0.5 rounded-md bg-[#F7F5EF] text-[#6E6E68] text-[10px] border border-[#E3DED3]"
                    >
                      {sk}
                    </span>
                  ))}
                </div>

                {/* Progress bar if started */}
                {course.progress > 0 && (
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-xs text-[#6E6E68] mb-1">
                      <span>Progress</span>
                      <span className="font-medium text-[#315C43]">{course.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#E3DED3] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#315C43]"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Course Card Footer Actions */}
              <div className="px-6 py-3.5 bg-[#FAF8F5] border-t border-[#E3DED3] flex items-center justify-between">
                <button
                  onClick={() => setSelectedCourseForModal(course)}
                  className="text-xs font-medium text-[#6E6E68] hover:text-[#262626] flex items-center gap-1 cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Curriculum Fit</span>
                </button>

                {isDone ? (
                  <span className="text-xs text-[#315C43] font-medium flex items-center gap-1 bg-[#E6EEE5] px-2.5 py-1 rounded-md border border-[#D3E0D2]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                  </span>
                ) : isLocked ? (
                  <button
                    onClick={() =>
                      setSelectedPrereqForModal({
                        lockedTitle: course.title,
                        prereqTitle: course.prerequisites[0] || 'Prerequisite topic',
                        reason: course.aiReason,
                      })
                    }
                    className="px-3 py-1.5 rounded-lg bg-[#F1E9DA] hover:bg-[#E3DED3] text-[#6E6E68] text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Locked</span>
                  </button>
                ) : (
                  <button
                    onClick={() => startCourse(course.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#315C43] hover:bg-[#264935] text-white text-xs font-medium shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>{course.progress > 0 ? 'Resume' : 'Start'}</span>
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

