import React from 'react';
import {
  ArrowRight,
  Target,
  CheckCircle2,
  Lock,
  Compass,
} from 'lucide-react';
import { useLearningPath } from '../../context/LearningPathContext';

export const LandingPage: React.FC = () => {
  const { setOnboardingOpen, setActiveTab } = useLearningPath();

  const handleExploreDemo = () => {
    setActiveTab('overview');
  };

  const handleStartOnboarding = () => {
    setOnboardingOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#262626]">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Top Announcement Tag */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E3DED3] text-[#315C43] text-xs font-medium shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#315C43]" />
            <span>Curriculum Engineering & Dynamic Learning Architecture</span>
          </div>
        </div>

        {/* Hero Title & Subheading */}
        <div className="text-center mt-6 max-w-3xl mx-auto space-y-5">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-[#262626] leading-[1.18]">
            Turn your ambition into a{' '}
            <span className="italic text-[#315C43]">
              structured learning roadmap.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#6E6E68] max-w-2xl mx-auto leading-relaxed">
            Define what you want to achieve. Mentora evaluates your baseline, maps technical skill gaps, and curates a coherent progression of modules, portfolio projects, and milestones that continuously adapts as you learn.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleStartOnboarding}
              className="w-full sm:w-auto px-7 py-3 rounded-lg bg-[#315C43] hover:bg-[#264935] text-white font-medium text-sm shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Build My Learning Path</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleExploreDemo}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white hover:bg-[#FAF8F5] border border-[#E3DED3] text-[#262626] font-medium text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
            >
              <span>Explore Interactive Curriculum</span>
            </button>
          </div>

          {/* Feature Badges */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-[#6E6E68]">
            {['Goal-Driven', 'Transparent Rationale', 'Prerequisite Graph', 'Dynamic Adaptation', 'Milestone Verified'].map(
              badge => (
                <span
                  key={badge}
                  className="px-3 py-1 rounded-md bg-white border border-[#E3DED3] text-[#4A4A46] font-mono text-[11px] shadow-2xs"
                >
                  ✓ {badge}
                </span>
              )
            )}
          </div>
        </div>

        {/* Hero Roadmap Preview Card */}
        <div className="mt-12 relative rounded-2xl bg-white border border-[#E3DED3] p-6 sm:p-8 shadow-xs overflow-hidden">
          {/* Top card header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E3DED3]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E6EEE5] border border-[#D3E0D2] flex items-center justify-center text-[#315C43]">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-serif font-bold text-[#262626]">Alex Morgan&apos;s Active Roadmap</span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#E6EEE5] text-[#315C43] border border-[#D3E0D2] font-medium">
                    8-Month Accelerated Track
                  </span>
                </div>
                <p className="text-xs text-[#6E6E68]">Target Role: Machine Learning Engineer · 1.5h daily study budget</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[11px] text-[#8E8D88]">Overall Progress</div>
                <div className="text-sm font-serif font-bold text-[#315C43]">64% Completed</div>
              </div>
              <div className="w-10 h-10 rounded-lg border border-[#D3E0D2] flex items-center justify-center bg-[#E6EEE5] text-[#315C43] font-medium text-xs font-mono">
                64%
              </div>
            </div>
          </div>

          {/* Interactive Timeline Visual */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            {/* Phase 1: Completed */}
            <div className="p-4.5 rounded-xl bg-[#FAF8F5] border border-[#D3E0D2] relative">
              <div className="flex items-center justify-between text-xs text-[#6E6E68] mb-2">
                <span className="font-mono text-[#315C43] font-medium text-[11px]">PHASE 1</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#E6EEE5] text-[#315C43] flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3 h-3" /> Completed
                </span>
              </div>
              <h4 className="text-xs font-serif font-bold text-[#262626]">Strengthen Foundations</h4>
              <p className="text-[11px] text-[#6E6E68] mt-1">Python Vectorization & Statistics</p>
              <div className="mt-3 pt-2.5 border-t border-[#E3DED3] flex items-center justify-between text-[10px]">
                <span className="text-[#8E8D88]">Milestone:</span>
                <span className="font-medium text-[#315C43]">Foundation Ready</span>
              </div>
            </div>

            {/* Phase 2: In Progress */}
            <div className="p-4.5 rounded-xl bg-[#E6EEE5]/50 border-2 border-[#315C43] relative shadow-2xs">
              <div className="flex items-center justify-between text-xs text-[#6E6E68] mb-2">
                <span className="font-mono text-[#315C43] font-medium text-[11px]">PHASE 2</span>
                <span className="text-[10px] text-[#315C43] font-medium font-mono">Weeks 5–10</span>
              </div>
              <h4 className="text-xs font-serif font-bold text-[#262626]">Machine Learning Core</h4>
              <p className="text-[11px] text-[#6E6E68] mt-1">Supervised Learning & Churn Project</p>
              <div className="mt-3 pt-2.5 border-t border-[#D3E0D2] flex items-center justify-between text-[10px]">
                <span className="text-[#8E8D88]">Milestone:</span>
                <span className="font-medium text-[#315C43]">ML Ready (2 tasks left)</span>
              </div>
            </div>

            {/* Phase 3: Deep Learning */}
            <div className="p-4.5 rounded-xl bg-[#FAF8F5] border border-[#E3DED3] relative">
              <div className="flex items-center justify-between text-xs text-[#6E6E68] mb-2">
                <span className="font-mono text-[#8E8D88] text-[11px]">PHASE 3</span>
                <span className="text-[10px] text-[#8E8D88] font-mono">Weeks 11–18</span>
              </div>
              <h4 className="text-xs font-serif font-bold text-[#4A4A46]">Deep Learning & Transformers</h4>
              <p className="text-[11px] text-[#8E8D88] mt-1">PyTorch, CNNs & Image API</p>
              <div className="mt-3 pt-2.5 border-t border-[#E3DED3] flex items-center justify-between text-[10px]">
                <span className="text-[#8E8D88]">Prerequisite:</span>
                <span className="text-[#B58A52] flex items-center gap-1 font-medium">
                  <Lock className="w-2.5 h-2.5" /> Requires Phase 2
                </span>
              </div>
            </div>

            {/* Phase 4: Production MLOps */}
            <div className="p-4.5 rounded-xl bg-[#FAF8F5] border border-[#E3DED3] relative">
              <div className="flex items-center justify-between text-xs text-[#6E6E68] mb-2">
                <span className="font-mono text-[#8E8D88] text-[11px]">PHASE 4</span>
                <span className="text-[10px] text-[#8E8D88] font-mono">Weeks 19–26</span>
              </div>
              <h4 className="text-xs font-serif font-bold text-[#4A4A46]">Production ML & Deployment</h4>
              <p className="text-[11px] text-[#8E8D88] mt-1">Docker, FastAPI & Cloud Pipelines</p>
              <div className="mt-3 pt-2.5 border-t border-[#E3DED3] flex items-center justify-between text-[10px]">
                <span className="text-[#8E8D88]">Capstone:</span>
                <span className="font-medium text-[#315C43]">Professional Ready</span>
              </div>
            </div>
          </div>

          {/* Curriculum Note Banner */}
          <div className="mt-5 p-4 rounded-xl bg-[#FAF8F5] border border-[#E3DED3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-[#6E6E68]">
              <Target className="w-4 h-4 text-[#315C43] shrink-0" />
              <span>
                <strong className="text-[#262626]">Curriculum Note:</strong> Highest-priority competency vector is <strong>Statistics</strong>. Mastering this first accelerates ML evaluation comprehension by 35%.
              </span>
            </div>
            <button
              onClick={handleExploreDemo}
              className="text-xs font-medium text-[#315C43] hover:text-[#264935] flex items-center gap-1 shrink-0 cursor-pointer"
            >
              Open Full Dashboard →
            </button>
          </div>
        </div>
      </section>

      {/* 4-Step "How It Works" Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-[#E3DED3]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-mono uppercase tracking-wider text-[#315C43] font-medium">Curriculum Engineering</h2>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#262626] mt-2">How Mentora Crafts Your Journey</h3>
          <p className="text-xs sm:text-sm text-[#6E6E68] mt-2">
            Continuous personalization that replaces rigid static curricula with coherent, responsive learning plans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {/* Step 01 */}
          <div className="p-6 rounded-xl bg-white border border-[#E3DED3] shadow-2xs space-y-3">
            <div className="w-8 h-8 rounded-lg bg-[#E6EEE5] border border-[#D3E0D2] text-[#315C43] font-mono font-medium flex items-center justify-center text-xs">
              01
            </div>
            <h4 className="text-sm font-serif font-bold text-[#262626]">Define your ambition</h4>
            <p className="text-xs text-[#6E6E68] leading-relaxed">
              Describe your target career role, project aspirations, or timeline deadline.
            </p>
          </div>

          {/* Step 02 */}
          <div className="p-6 rounded-xl bg-white border border-[#E3DED3] shadow-2xs space-y-3">
            <div className="w-8 h-8 rounded-lg bg-[#F7F5EF] border border-[#E3DED3] text-[#B58A52] font-mono font-medium flex items-center justify-center text-xs">
              02
            </div>
            <h4 className="text-sm font-serif font-bold text-[#262626]">Map baseline skills</h4>
            <p className="text-xs text-[#6E6E68] leading-relaxed">
              We evaluate your proficiency, map skill gaps, and compute prerequisite dependencies.
            </p>
          </div>

          {/* Step 03 */}
          <div className="p-6 rounded-xl bg-white border border-[#E3DED3] shadow-2xs space-y-3">
            <div className="w-8 h-8 rounded-lg bg-[#E6EEE5] border border-[#D3E0D2] text-[#315C43] font-mono font-medium flex items-center justify-center text-xs">
              03
            </div>
            <h4 className="text-sm font-serif font-bold text-[#262626]">Receive your roadmap</h4>
            <p className="text-xs text-[#6E6E68] leading-relaxed">
              Modules, hands-on projects, and milestones structured in optimal pedagogical sequence.
            </p>
          </div>

          {/* Step 04 */}
          <div className="p-6 rounded-xl bg-white border border-[#E3DED3] shadow-2xs space-y-3">
            <div className="w-8 h-8 rounded-lg bg-[#F7F5EF] border border-[#E3DED3] text-[#B58A52] font-mono font-medium flex items-center justify-center text-xs">
              04
            </div>
            <h4 className="text-sm font-serif font-bold text-[#262626]">Learn → Evaluate → Adapt</h4>
            <p className="text-xs text-[#6E6E68] leading-relaxed">
              Your timeline dynamically recalibrates based on verified diagnostic checkpoint mastery.
            </p>
          </div>
        </div>
      </section>

      {/* Highlights Box */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E3DED3] shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#315C43] font-medium">
                Structured for Deep Mastery
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#262626]">
                Experience dynamic, transparent learning pathways
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6E68]">
                Enjoy personalized roadmap generation, clear rationale justifications, interactive evaluations, and responsive timeline adjustments.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleExploreDemo}
                className="px-6 py-3 rounded-lg bg-[#315C43] hover:bg-[#264935] text-white font-medium text-xs shadow-2xs flex items-center gap-2 cursor-pointer transition-all"
              >
                <span>Launch Interactive Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

