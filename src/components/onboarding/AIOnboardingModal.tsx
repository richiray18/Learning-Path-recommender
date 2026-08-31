import React, { useState, useEffect } from 'react';
import {
  Check,
  ChevronRight,
  Clock,
  Calendar,
  Layers,
  Target,
  Code,
  X,
  Compass,
  Briefcase,
  Terminal,
} from 'lucide-react';
import { useLearningPath } from '../../context/LearningPathContext';

export const AIOnboardingModal: React.FC = () => {
  const { onboardingOpen, setOnboardingOpen, completeOnboardingFlow } = useLearningPath();

  const [step, setStep] = useState<number>(1);
  const [goal, setGoal] = useState<string>('Become a Machine Learning Engineer');
  const [customGoal, setCustomGoal] = useState<string>('');
  const [experience, setExperience] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Python', 'SQL', 'Mathematics']);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([
    'Hands-on projects',
    'Interactive exercises',
  ]);
  const [timeAvailability, setTimeAvailability] = useState<string>('1.5 hours/day');
  const [targetDeadline, setTargetDeadline] = useState<string>('8 months');
  
  // Synthesis animation states
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [synthesisStage, setSynthesisStage] = useState<number>(0);

  const goalPresets = [
    { title: 'Become a Machine Learning Engineer', desc: 'Predictive models, deep neural architectures, and MLOps', icon: Compass },
    { title: 'Become a Full Stack Developer', desc: 'Modern React, Next.js, Node.js, and cloud backends', icon: Code },
    { title: 'Become a Data Analyst', desc: 'SQL, Python analytics, Tableau & business metrics', icon: Target },
    { title: 'Prepare for Technical Interviews', desc: 'Data structures, algorithms, and system design', icon: Terminal },
    { title: 'Learn Cybersecurity & Pen-Testing', desc: 'Network security, cryptography, and defensive ops', icon: Layers },
    { title: 'Build AI & Language Model Systems', desc: 'Embeddings, vector databases, RAG, and production pipelines', icon: Briefcase },
  ];

  const skillOptions = [
    'Python',
    'JavaScript',
    'React',
    'SQL',
    'Statistics',
    'Mathematics',
    'Machine Learning',
    'Deep Learning',
    'Git & GitHub',
    'Cloud (GCP/AWS)',
    'REST APIs',
    'Docker & Linux',
  ];

  const preferenceOptions = [
    'Hands-on projects',
    'Interactive exercises',
    'Visual diagrams & Video',
    'Reading & Documentation',
    'Knowledge Checkpoints',
    'Mentora Learning Guide',
  ];

  const timeOptions = ['30 min/day', '1 hour/day', '1.5 hours/day', '2 hours/day', 'Weekends only (4 hrs/wk)'];
  const deadlineOptions = ['3 months (Intensive)', '6 months (Accelerated)', '8 months (Balanced)', '12 months (Comprehensive)'];

  const synthesisStages = [
    'Evaluating career target competencies...',
    'Assessing baseline proficiency across core technical domains...',
    'Identifying critical skill gaps and prerequisite hierarchies...',
    'Selecting benchmark courses, datasets, and milestone projects...',
    'Structuring adaptive curriculum checkpoints and study schedule...',
  ];

  useEffect(() => {
    if (isSynthesizing) {
      const interval = setInterval(() => {
        setSynthesisStage(prev => {
          if (prev < synthesisStages.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setTimeout(() => {
              completeOnboardingFlow({
                goal: customGoal.trim() || goal,
                experience,
                skills: selectedSkills,
                preferences: selectedPreferences,
                time: timeAvailability,
                deadline: targetDeadline,
              });
              setIsSynthesizing(false);
              setStep(1);
            }, 800);
            return prev;
          }
        });
      }, 700);

      return () => clearInterval(interval);
    }
  }, [isSynthesizing]);

  if (!onboardingOpen) return null;

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const togglePreference = (pref: string) => {
    setSelectedPreferences(prev =>
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  const handleFinish = () => {
    setIsSynthesizing(true);
    setSynthesisStage(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-[#E3DED3] rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E3DED3] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E6EEE5] border border-[#D3E0D2] flex items-center justify-center text-[#315C43]">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-medium uppercase tracking-wider text-[#315C43]">
                Curriculum Setup Guide
              </div>
              <div className="text-sm font-serif font-bold text-[#262626]">
                {isSynthesizing ? 'Structuring Your Learning Plan' : 'Define Your Target & Baseline'}
              </div>
            </div>
          </div>

          {!isSynthesizing && (
            <button
              onClick={() => setOnboardingOpen(false)}
              className="text-[#8E8D88] hover:text-[#262626] p-1.5 rounded-lg hover:bg-[#F1E9DA]/50 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-white">
          {isSynthesizing ? (
            /* Synthesis Loading Screen */
            <div className="py-8 flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-[#E6EEE5] border border-[#D3E0D2] flex items-center justify-center text-[#315C43]">
                <Compass className="w-8 h-8 text-[#315C43] animate-spin" style={{ animationDuration: '4s' }} />
              </div>

              <div>
                <h3 className="text-lg font-serif font-bold text-[#262626]">Curating your personalized curriculum...</h3>
                <p className="text-xs text-[#315C43] mt-1 font-mono">Target: {customGoal || goal}</p>
              </div>

              {/* Progress Steps List */}
              <div className="w-full max-w-md space-y-2.5 text-left bg-[#FAF8F5] p-4 rounded-xl border border-[#E3DED3]">
                {synthesisStages.map((stg, idx) => {
                  const isDone = idx < synthesisStage;
                  const isCurrent = idx === synthesisStage;
                  return (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      {isDone ? (
                        <div className="w-4 h-4 rounded-full bg-[#E6EEE5] text-[#315C43] flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      ) : isCurrent ? (
                        <div className="w-4 h-4 rounded-full border-2 border-[#315C43] border-t-transparent animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-[#E3DED3] shrink-0" />
                      )}
                      <span
                        className={
                          isDone
                            ? 'text-[#8E8D88] line-through'
                            : isCurrent
                            ? 'text-[#262626] font-medium'
                            : 'text-[#8E8D88]'
                        }
                      >
                        {stg}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Multi-step Questionnaire */
            <div>
              {/* Step indicator */}
              <div className="flex items-center justify-between mb-6">
                {[1, 2, 3, 4].map(s => (
                  <div key={s} className="flex items-center flex-1 last:flex-none">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                        step === s
                          ? 'bg-[#315C43] text-white'
                          : step > s
                          ? 'bg-[#E6EEE5] text-[#315C43] border border-[#D3E0D2]'
                          : 'bg-[#F7F5EF] text-[#8E8D88] border border-[#E3DED3]'
                      }`}
                    >
                      {step > s ? <Check className="w-3.5 h-3.5" /> : s}
                    </div>
                    {s < 4 && (
                      <div
                        className={`h-0.5 flex-1 mx-2 ${
                          step > s ? 'bg-[#315C43]/40' : 'bg-[#E3DED3]'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1: Goal */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E3DED3] text-xs text-[#6E6E68] leading-relaxed">
                    <strong className="text-[#262626]">Step 1:</strong> Select your target career outcome or describe a custom technical specialization.
                  </div>

                  <h3 className="text-sm font-serif font-bold text-[#262626] pt-1">Select or Describe Your Target Goal</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {goalPresets.map(preset => {
                      const Icon = preset.icon;
                      const isSelected = goal === preset.title && !customGoal;
                      return (
                        <button
                          key={preset.title}
                          onClick={() => {
                            setGoal(preset.title);
                            setCustomGoal('');
                          }}
                          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#E6EEE5] border-[#315C43] text-[#262626] ring-1 ring-[#315C43]/30'
                              : 'bg-[#FAF8F5] border-[#E3DED3] text-[#6E6E68] hover:bg-white hover:border-[#D3CEBE]'
                          }`}
                        >
                          <div className="flex items-center gap-2 font-serif font-bold text-xs">
                            <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#315C43]' : 'text-[#8E8D88]'}`} />
                            <span className={isSelected ? 'text-[#262626]' : 'text-[#4A4A46]'}>{preset.title}</span>
                          </div>
                          <p className="text-[11px] text-[#6E6E68] mt-1 leading-snug">{preset.desc}</p>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2">
                    <label className="text-xs font-serif font-bold text-[#262626] mb-1.5 block">
                      Or define a custom learning ambition:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Master Reinforcement Learning for Robotics in 6 months"
                      value={customGoal}
                      onChange={e => setCustomGoal(e.target.value)}
                      className="w-full bg-[#FAF8F5] text-xs text-[#262626] placeholder-[#8E8D88] rounded-lg px-3.5 py-2.5 border border-[#E3DED3] focus:border-[#315C43] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Experience & Existing Skills */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E3DED3] text-xs text-[#6E6E68] leading-relaxed">
                    <strong className="text-[#262626]">Step 2:</strong> Outline your current baseline so we can customize prerequisite entry points.
                  </div>

                  <div>
                    <label className="text-xs font-serif font-bold text-[#262626] mb-2 block">
                      Overall Technical Experience
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Beginner', 'Intermediate', 'Advanced'] as const).map(lvl => (
                        <button
                          key={lvl}
                          onClick={() => setExperience(lvl)}
                          className={`py-2.5 px-3 rounded-lg border text-center text-xs font-medium transition-all cursor-pointer ${
                            experience === lvl
                              ? 'bg-[#315C43] text-white border-[#315C43] shadow-2xs'
                              : 'bg-[#FAF8F5] border-[#E3DED3] text-[#6E6E68] hover:text-[#262626] hover:bg-white'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="text-xs font-serif font-bold text-[#262626] mb-2 block">
                      Select tools & skills you have used before:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {skillOptions.map(skill => {
                        const isSelected = selectedSkills.includes(skill);
                        return (
                          <button
                            key={skill}
                            onClick={() => toggleSkill(skill)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
                              isSelected
                                ? 'bg-[#E6EEE5] border-[#315C43] text-[#315C43]'
                                : 'bg-[#FAF8F5] border-[#E3DED3] text-[#6E6E68] hover:text-[#262626] hover:border-[#D3CEBE]'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-[#315C43]" />}
                            <span>{skill}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Learning Preferences */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E3DED3] text-xs text-[#6E6E68] leading-relaxed">
                    <strong className="text-[#262626]">Step 3:</strong> Choose the modalities that fit your learning style best.
                  </div>

                  <div>
                    <label className="text-xs font-serif font-bold text-[#262626] mb-2 block">
                      Preferred Learning Modalities (Select all that apply)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {preferenceOptions.map(pref => {
                        const isSelected = selectedPreferences.includes(pref);
                        return (
                          <button
                            key={pref}
                            onClick={() => togglePreference(pref)}
                            className={`p-3 rounded-lg border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-[#E6EEE5] border-[#315C43] text-[#262626]'
                                : 'bg-[#FAF8F5] border-[#E3DED3] text-[#6E6E68] hover:bg-white'
                            }`}
                          >
                            <span>{pref}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#315C43] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Availability & Deadline */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E3DED3] text-xs text-[#6E6E68] leading-relaxed">
                    <strong className="text-[#262626]">Step 4:</strong> Set your schedule and target timeline for realistic milestones.
                  </div>

                  <div>
                    <label className="text-xs font-serif font-bold text-[#262626] mb-2 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#B58A52]" /> Daily Time Availability
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {timeOptions.map(t => (
                        <button
                          key={t}
                          onClick={() => setTimeAvailability(t)}
                          className={`py-2 px-2.5 rounded-lg border text-center text-xs font-medium transition-all cursor-pointer ${
                            timeAvailability === t
                              ? 'bg-[#315C43] text-white border-[#315C43]'
                              : 'bg-[#FAF8F5] border-[#E3DED3] text-[#6E6E68] hover:text-[#262626]'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="text-xs font-serif font-bold text-[#262626] mb-2 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#315C43]" /> Target Timeline
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {deadlineOptions.map(d => (
                        <button
                          key={d}
                          onClick={() => setTargetDeadline(d.split(' ')[0] + ' ' + d.split(' ')[1])}
                          className={`py-2 px-3 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                            targetDeadline.startsWith(d.split(' ')[0])
                              ? 'bg-[#E6EEE5] border-[#315C43] text-[#315C43] font-medium'
                              : 'bg-[#FAF8F5] border-[#E3DED3] text-[#6E6E68] hover:text-[#262626]'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {!isSynthesizing && (
          <div className="px-6 py-4 border-t border-[#E3DED3] bg-[#FAF8F5] flex items-center justify-between">
            {step > 1 ? (
              <button
                onClick={() => setStep(prev => prev - 1)}
                className="px-4 py-2 text-xs font-medium text-[#6E6E68] hover:text-[#262626] transition-colors cursor-pointer"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                onClick={() => setStep(prev => prev + 1)}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#315C43] hover:bg-[#264935] text-white text-xs font-medium shadow-2xs transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#315C43] hover:bg-[#264935] text-white text-xs font-medium shadow-2xs transition-all cursor-pointer"
              >
                <span>Build Learning Path</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

