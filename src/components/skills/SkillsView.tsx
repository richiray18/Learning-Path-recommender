import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Sliders,
  TrendingUp,
  Target,
} from 'lucide-react';
import { useLearningPath } from '../../context/LearningPathContext';

export const SkillsView: React.FC = () => {
  const {
    skillGaps,
    updateSkillLevel,
    setSelectedSkillForDeepDive,
    searchQuery,
  } = useLearningPath();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const categories = ['all', 'Foundation', 'Core ML', 'Advanced', 'Deployment'];

  const filteredSkills = skillGaps.filter(s => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!s.name.toLowerCase().includes(q) && !s.category.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (categoryFilter !== 'all' && s.category !== categoryFilter) return false;
    if (priorityFilter !== 'all' && s.priority !== priorityFilter) return false;
    return true;
  });

  const masteredCount = skillGaps.filter(s => s.currentLevel >= s.targetLevel).length;
  const inProgressCount = skillGaps.length - masteredCount;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="border-b border-[#E3DED3] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-[#315C43] bg-[#E6EEE5] px-2.5 py-0.5 rounded border border-[#D3E0D2]">
              Competency Assessment
            </span>
            <span className="text-xs text-[#6E6E68]">
              {masteredCount} Mastered · {inProgressCount} Developing
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#262626] tracking-tight">Skills & Competency Gap</h1>
          <p className="text-sm text-[#6E6E68] mt-1 max-w-2xl leading-relaxed">
            Detailed evaluation of your current skill levels compared to industry standards for <strong>Machine Learning Engineer</strong>.
          </p>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1 bg-[#F1E9DA]/60 border border-[#E3DED3] p-1 rounded-xl text-xs">
          {[
            { id: 'all', label: 'All Priorities' },
            { id: 'High', label: 'High' },
            { id: 'Medium', label: 'Medium' },
            { id: 'Low', label: 'Low' },
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setPriorityFilter(p.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                priorityFilter === p.id
                  ? 'bg-white text-[#262626] shadow-2xs'
                  : 'text-[#6E6E68] hover:text-[#262626]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
              categoryFilter === cat
                ? 'bg-[#315C43] text-white'
                : 'bg-white text-[#6E6E68] border border-[#E3DED3] hover:text-[#262626] hover:border-[#66836B]'
            }`}
          >
            {cat === 'all' ? 'All Skill Areas' : `${cat}`}
          </button>
        ))}
      </div>

      {/* Visual Competency Comparison Overview Banner */}
      <div className="p-6 rounded-2xl bg-white border border-[#E3DED3] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#315C43]" />
            <h3 className="text-sm font-serif font-bold text-[#262626]">
              Benchmark Proficiency Summary
            </h3>
          </div>
          <span className="text-xs text-[#6E6E68]">Green = Current Proficiency · Amber = Target Goal</span>
        </div>

        {/* Visual Multi-Bar Stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {skillGaps.map(skill => {
            const isMastered = skill.currentLevel >= skill.targetLevel;
            const gap = Math.max(0, skill.targetLevel - skill.currentLevel);

            return (
              <div
                key={skill.id}
                onClick={() => setSelectedSkillForDeepDive(skill)}
                className="p-4 rounded-xl bg-[#F7F5EF] border border-[#E3DED3] hover:border-[#315C43]/40 transition-all cursor-pointer space-y-2.5 group"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-[#262626] group-hover:text-[#315C43] transition-colors">
                      {skill.name}
                    </span>
                    <span className="text-[11px] text-[#8E8D88]">({skill.category})</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-[#315C43] font-semibold">{skill.currentLevel}%</span>
                    <span className="text-[#A39E93]">/</span>
                    <span className="text-[#6E6E68]">{skill.targetLevel}%</span>
                  </div>
                </div>

                <div className="relative w-full h-2 rounded-full bg-[#E3DED3] overflow-hidden">
                  {/* Target marker */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-[#B58A52] rounded-full z-10"
                    style={{ left: `${skill.targetLevel}%` }}
                  />
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isMastered ? 'bg-[#315C43]' : 'bg-[#66836B]'
                    }`}
                    style={{ width: `${skill.currentLevel}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-[#6E6E68]">
                  <span>
                    {isMastered ? (
                      <span className="text-[#315C43] font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Target Achieved
                      </span>
                    ) : (
                      <span>Gap: <strong className="text-[#B58A52]">{gap}%</strong> to goal</span>
                    )}
                  </span>
                  <span className="text-[#315C43] group-hover:underline font-medium">Details →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Skill Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSkills.map(skill => {
          const isMastered = skill.currentLevel >= skill.targetLevel;

          return (
            <div
              key={skill.id}
              className="p-6 rounded-2xl bg-white border border-[#E3DED3] shadow-xs hover:border-[#66836B] transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3.5">
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-md ${
                      skill.priority === 'High'
                        ? 'bg-[#F1E9DA] text-[#B58A52] border border-[#E3DED3]'
                        : skill.priority === 'Medium'
                        ? 'bg-[#E6EEE5] text-[#315C43] border border-[#D3E0D2]'
                        : 'bg-[#F7F5EF] text-[#6E6E68] border border-[#E3DED3]'
                    }`}
                  >
                    {skill.priority} Priority
                  </span>

                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded ${
                      isMastered
                        ? 'bg-[#E6EEE5] text-[#315C43] border border-[#D3E0D2]'
                        : skill.currentLevel >= 60
                        ? 'bg-[#E6EEE5] text-[#315C43]'
                        : 'bg-[#F1E9DA] text-[#6E6E68]'
                    }`}
                  >
                    {skill.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-serif font-bold text-[#262626] group-hover:text-[#315C43] transition-colors">
                    {skill.name}
                  </h3>
                  <div className="text-xs text-[#6E6E68] mt-0.5">{skill.category}</div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#6E6E68]">Proficiency</span>
                    <span className="text-[#262626] font-medium">
                      {skill.currentLevel}% <span className="text-[#8E8D88] font-normal">/ {skill.targetLevel}%</span>
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#E3DED3] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isMastered ? 'bg-[#315C43]' : 'bg-[#66836B]'
                      }`}
                      style={{ width: `${skill.currentLevel}%` }}
                    />
                  </div>
                </div>

                <p className="text-xs text-[#6E6E68] leading-relaxed line-clamp-2">{skill.whyItMatters}</p>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-[#E3DED3] flex items-center justify-between">
                <button
                  onClick={() => updateSkillLevel(skill.id, 5)}
                  className="px-2.5 py-1 rounded-lg bg-[#F7F5EF] hover:bg-[#F1E9DA]/50 border border-[#E3DED3] text-[#315C43] text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  title="Update proficiency progress"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-[#315C43]" />
                  <span>Log Practice (+5%)</span>
                </button>

                <button
                  onClick={() => setSelectedSkillForDeepDive(skill)}
                  className="text-xs font-medium text-[#315C43] hover:text-[#264935] flex items-center gap-1 cursor-pointer"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

