import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  X,
  Award,
  HelpCircle,
  CheckSquare,
} from 'lucide-react';
import { useLearningPath } from '../../context/LearningPathContext';

export const QuizModal: React.FC = () => {
  const { activeQuiz, setActiveQuiz, submitAssessmentQuiz } = useLearningPath();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qIdx: number]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);

  if (!activeQuiz) return null;

  const quiz = activeQuiz;
  const questions = quiz.questions || [];
  const currentQ = questions[currentQuestionIndex];

  const handleSelectOption = (optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optIdx,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate score
      let correct = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) {
          correct += 1;
        }
      });
      const scorePercent = Math.round((correct / questions.length) * 100);
      setFinalScore(scorePercent);
      setIsSubmitted(true);
    }
  };

  const handleFinishAndApply = () => {
    submitAssessmentQuiz(
      quiz.id,
      finalScore,
      questions.map((_, i) => selectedAnswers[i] ?? -1)
    );
    setActiveQuiz(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white border border-[#E3DED3] rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E3DED3] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E6EEE5] border border-[#D3E0D2] flex items-center justify-center text-[#315C43]">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-medium uppercase tracking-wider text-[#315C43]">
                {quiz.type} Checkpoint
              </div>
              <h3 className="text-base font-serif font-bold text-[#262626]">{quiz.title}</h3>
            </div>
          </div>

          <button
            onClick={() => setActiveQuiz(null)}
            className="text-[#8E8D88] hover:text-[#262626] p-1.5 rounded-lg hover:bg-[#F1E9DA]/50 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {!isSubmitted ? (
            /* Active Quiz Question */
            <div className="space-y-4">
              {/* Question progress counter */}
              <div className="flex items-center justify-between text-xs text-[#6E6E68]">
                <span>
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span className="font-mono text-[#315C43] font-medium">
                  Pass Target: 80%
                </span>
              </div>

              <div className="w-full h-1.5 rounded-full bg-[#E3DED3] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#315C43] transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              {currentQ && (
                <div className="space-y-4 pt-2">
                  <h4 className="text-lg font-serif font-bold text-[#262626] leading-snug">
                    {currentQ.question}
                  </h4>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {currentQ.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(optIdx)}
                          className={`w-full p-4 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-[#E6EEE5] border-[#315C43] text-[#262626] ring-1 ring-[#315C43]/30'
                              : 'bg-[#FAF8F5] border-[#E3DED3] text-[#262626] hover:bg-white hover:border-[#66836B]'
                          }`}
                        >
                          <span>{opt}</span>
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] shrink-0 ${
                              isSelected
                                ? 'border-[#315C43] bg-[#315C43] text-white'
                                : 'border-[#D3E0D2]'
                            }`}
                          >
                            {isSelected && '✓'}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Results & Path Adaptation Trigger */
            <div className="space-y-5 py-2 text-center">
              <div className="w-14 h-14 rounded-xl bg-[#E6EEE5] border border-[#D3E0D2] mx-auto flex items-center justify-center text-[#315C43]">
                <Award className="w-7 h-7 text-[#315C43]" />
              </div>

              <div>
                <span className="text-xs font-mono font-medium uppercase tracking-wider text-[#6E6E68]">
                  Assessment Complete
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#262626] mt-1">
                  You scored <span className="text-[#315C43]">{finalScore}%</span>
                </h3>
              </div>

              {finalScore >= 80 ? (
                <div className="p-4 rounded-xl bg-[#E6EEE5] border border-[#D3E0D2] text-left space-y-2">
                  <div className="flex items-center gap-2 text-[#315C43] text-xs font-serif font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Curriculum Acceleration Unlocked</span>
                  </div>
                  <p className="text-xs text-[#264935] leading-relaxed">
                    Having demonstrated proficiency above 80%, your roadmap schedule is automatically adjusted to advance directly to higher-tier practical modules.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#F7F5EF] border border-[#E3DED3] text-left space-y-2">
                  <div className="flex items-center gap-2 text-[#B58A52] text-xs font-serif font-bold">
                    <HelpCircle className="w-4 h-4" />
                    <span>Review Recommended</span>
                  </div>
                  <p className="text-xs text-[#6E6E68] leading-relaxed">
                    We suggest revisiting the core reference materials in this domain before moving ahead to project deliverables.
                  </p>
                </div>
              )}

              {/* Question Breakdown with Explanations */}
              <div className="text-left space-y-3 pt-2">
                <div className="text-xs font-serif font-bold text-[#262626]">
                  Question Review & Pedagogical Explanations
                </div>
                {questions.map((q, idx) => {
                  const userAnswer = selectedAnswers[idx];
                  const isCorrect = userAnswer === q.correctIndex;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E3DED3] text-xs space-y-1.5"
                    >
                      <div className="flex items-start gap-2.5">
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-[#315C43] shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-[#B58A52] shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className="font-medium text-[#262626]">{q.question}</span>
                          <div className="text-[#6E6E68] mt-0.5">
                            Correct: <span className="text-[#315C43] font-medium">{q.options[q.correctIndex]}</span>
                          </div>
                          <p className="text-xs text-[#6E6E68] mt-1 leading-relaxed">{q.explanation}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="px-6 py-4 border-t border-[#E3DED3] bg-[#FAF8F5] flex items-center justify-between">
          {!isSubmitted ? (
            <>
              <button
                onClick={() => setActiveQuiz(null)}
                className="px-4 py-2 text-xs font-medium text-[#6E6E68] hover:text-[#262626] transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                disabled={selectedAnswers[currentQuestionIndex] === undefined}
                onClick={handleNext}
                className="px-5 py-2.5 rounded-lg bg-[#315C43] hover:bg-[#264935] disabled:opacity-50 text-white text-xs font-medium shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>{currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Submit Assessment'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <button
              onClick={handleFinishAndApply}
              className="w-full py-2.5 rounded-lg bg-[#315C43] hover:bg-[#264935] text-white text-xs font-medium shadow-2xs transition-all cursor-pointer"
            >
              Save Results & Update Roadmap
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

