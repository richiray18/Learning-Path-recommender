import React from 'react';
import {
  CheckCircle2,
  Code,
  Award,
  Lock,
} from 'lucide-react';
import { useLearningPath } from '../../context/LearningPathContext';

export const ProjectsView: React.FC = () => {
  const { projects, updateProjectProgress, submitProject } = useLearningPath();

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-[#E3DED3] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-[#315C43] bg-[#E6EEE5] px-2.5 py-0.5 rounded border border-[#D3E0D2]">
              Applied Practice
            </span>
            <span className="text-xs text-[#6E6E68]">
              {projects.filter(p => p.status === 'Completed').length} of {projects.length} Completed
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#262626] tracking-tight">
            Portfolio Projects
          </h1>
          <p className="text-sm text-[#6E6E68] mt-1 max-w-2xl leading-relaxed">
            Substantial, hands-on projects designed to demonstrate tangible mastery to hiring managers and teams.
          </p>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {projects.map((project, idx) => {
          const isDone = project.status === 'Completed';
          const isInProgress = project.status === 'In Progress';
          const isLocked = project.status === 'Locked';

          return (
            <div
              key={project.id}
              className={`p-6 sm:p-7 rounded-2xl border transition-all relative overflow-hidden bg-white shadow-xs ${
                isInProgress
                  ? 'border-[#315C43] ring-1 ring-[#315C43]/20'
                  : isDone
                  ? 'border-[#D3E0D2]'
                  : 'border-[#E3DED3] opacity-80'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                {/* Left info */}
                <div className="space-y-4 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#F7F5EF] text-[#315C43] border border-[#E3DED3]">
                      MILESTONE {idx + 1}
                    </span>
                    <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded-md ${
                        isDone
                          ? 'bg-[#E6EEE5] text-[#315C43] border border-[#D3E0D2]'
                          : isInProgress
                          ? 'bg-[#F1E9DA] text-[#B58A52] border border-[#E3DED3]'
                          : 'bg-[#F7F5EF] text-[#6E6E68]'
                      }`}
                    >
                      {project.status}
                    </span>
                    <span className="text-xs text-[#6E6E68]">
                      Difficulty: {project.difficulty}
                    </span>
                    {project.deadlineDays && isInProgress && (
                      <span className="text-xs text-[#B58A52] font-medium">
                        • Target deadline: {project.deadlineDays} days remaining
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-serif font-bold text-[#262626]">{project.title}</h3>
                    <p className="text-xs sm:text-sm text-[#6E6E68] mt-1 leading-relaxed">{project.description}</p>
                  </div>

                  {/* Impact & Tech Stack Tags */}
                  <div className="space-y-2">
                    <div className="text-xs text-[#6E6E68]">
                      <strong className="text-[#262626]">Learning Objective:</strong> {project.whyRecommended}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {project.skills.map(sk => (
                        <span
                          key={sk}
                          className="px-2.5 py-0.5 rounded-md bg-[#F7F5EF] text-[#315C43] text-xs border border-[#E3DED3] font-mono font-medium"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Step Checklist */}
                  <div className="p-4.5 rounded-xl bg-[#F7F5EF] border border-[#E3DED3] space-y-2.5">
                    <div className="text-xs font-serif font-bold text-[#262626]">Core Deliverables:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      {project.deliverables.map((deliv, dIdx) => (
                        <div key={deliv} className="flex items-center gap-2 text-[#6E6E68]">
                          <CheckCircle2
                            className={`w-3.5 h-3.5 ${
                              isDone || (isInProgress && dIdx < 3) ? 'text-[#315C43]' : 'text-[#A39E93]'
                            }`}
                          />
                          <span className={isDone || (isInProgress && dIdx < 3) ? 'text-[#262626] font-medium' : 'text-[#8E8D88]'}>
                            {deliv}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Progress Card & Action Buttons */}
                <div className="lg:w-72 bg-[#FAF8F5] p-5 rounded-xl border border-[#E3DED3] flex flex-col justify-between space-y-4 shrink-0">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-[#6E6E68]">Completion Status</span>
                      <span className="font-mono font-semibold text-[#315C43]">{project.progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#E3DED3] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#315C43]"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {isInProgress && (
                    <div className="space-y-2">
                      <button
                        onClick={() => updateProjectProgress(project.id, Math.min(100, project.progress + 15))}
                        className="w-full py-2 rounded-lg bg-white hover:bg-[#F1E9DA]/50 border border-[#E3DED3] text-[#262626] text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                      >
                        <Code className="w-3.5 h-3.5 text-[#315C43]" />
                        <span>Log Progress (+15%)</span>
                      </button>

                      <button
                        onClick={() => submitProject(project.id)}
                        className="w-full py-2.5 rounded-lg bg-[#315C43] hover:bg-[#264935] text-white text-xs font-medium shadow-2xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Complete Milestone</span>
                      </button>
                    </div>
                  )}

                  {isDone && (
                    <div className="p-3 rounded-lg bg-[#E6EEE5] border border-[#D3E0D2] text-center text-xs font-medium text-[#315C43] flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verified & Added to Portfolio</span>
                    </div>
                  )}

                  {isLocked && (
                    <div className="p-3 rounded-lg bg-white border border-[#E3DED3] text-center text-xs text-[#8E8D88] flex items-center justify-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Unlocks after previous phase</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

