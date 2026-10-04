import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import quizService from '../../services/quiz.service';
import PageHeader from '../../components/common/PageHeader.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button.jsx';

function QuizTakePage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [submitting, setSubmitting] = useState(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    setLoading(true);
    const fetchQuiz = async () => {
      try {
        const response = await quizService.getQuizById(quizId);
        if (response.data.userAnswers.length > 0) {
          navigate(`/quizzes/${quizId}/result`);
        }
        setQuiz(response.data);
      } catch (error) {
        toast.error(error.message || 'Failed to fetch quiz');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleOptionChange = (questionId, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    try {
      const formattedAnswers = Object.keys(selectedAnswers).map((questionId) => {
        const question = quiz.questions.find((q) => q._id == questionId);
        const questionIndex = quiz.questions.findIndex((q) => q._id == questionId);
        const optionIndex = selectedAnswers[questionId];
        const selectedAnswer = question.options[optionIndex];
        return { questionIndex, selectedAnswer };
      });

      await quizService.submitQuiz(quizId, formattedAnswers);
      toast.success('Quiz submitted successfully');
      navigate(`/quizzes/${quizId}/result`);
    } catch (error) {
      toast.error(error?.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner label="Loading quiz" />
      </div>
    );
  }

  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="surface p-10 text-center">
          <p className="text-lg font-semibold mb-1">Quiz not found</p>
          <p className="text-sm text-muted">This quiz has no questions.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title={quiz.title || 'Take Quiz'} subtitle="Answer every question you can" />

      {/* Progress */}
      <div className="mb-7">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-sm font-semibold text-foreground">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </span>
          <span className="chip">
            {answeredCount} answered
          </span>
        </div>
        <div className="relative h-2 rounded-full overflow-hidden bg-white/8">
          <div
            style={{ width: `${progress}%` }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-accent to-gold
            rounded-full transition-all duration-500 ease-out"
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="surface relative overflow-hidden p-6 sm:p-7 mb-6">
        <div className="pointer-events-none absolute -top-24 -right-16 h-52 w-52 rounded-full bg-primary/20 blur-3xl" />

        <div className="relative z-10">
          <span className="chip chip-gold mb-4 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            Question {currentQuestionIndex + 1}
          </span>

          <h3 className="text-lg font-semibold mb-6 leading-relaxed">
            {currentQuestion.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestion._id] === index;
              return (
                <label
                  key={index}
                  className={`group flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200
                    ${
                      isSelected
                        ? 'border-accent/70 bg-accent/12 shadow-[0_14px_30px_-18px_rgba(139,92,246,1)]'
                        : 'border-hairline bg-fill hover:border-white/18 hover:bg-fill-strong'
                    }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion._id}`}
                    value={index}
                    checked={isSelected}
                    onChange={() => handleOptionChange(currentQuestion._id, index)}
                    className={`accent-violet-500 ${isSelected ? 'scale-110' : ''} transition-transform duration-200`}
                  />

                  <span
                    className={`ml-4 text-sm transition-colors duration-200 ${
                      isSelected ? 'font-semibold text-foreground' : 'text-foreground/85 group-hover:text-foreground'
                    }`}
                  >
                    {option}
                  </span>

                  {isSelected && (
                    <CheckCircle2 strokeWidth={2.5} className="ml-auto w-5 h-5 text-accent" />
                  )}
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-4 justify-between">
        <button
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0 || submitting}
          className="btn btn-ghost group"
        >
          <ChevronLeft
            strokeWidth={2}
            className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-150"
          />
          Previous
        </button>

        {currentQuestionIndex + 1 === quiz.questions.length ? (
          <Button onClick={handleSubmitQuiz} disabled={submitting} size="lg">
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                <CheckCircle2 strokeWidth={2} />
                Submit quiz
              </>
            )}
          </Button>
        ) : (
          <button onClick={handleNextQuestion} disabled={submitting} className="btn btn-primary group">
            Next
            <ChevronRight
              strokeWidth={2}
              className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150"
            />
          </button>
        )}
      </div>

      {/* Question pagination */}
      <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
        {quiz.questions.map((question, index) => {
          const isAnsweredQuestion = selectedAnswers[question._id] !== undefined;
          const isCurrent = index === currentQuestionIndex;

          return (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              disabled={submitting}
              className={`w-9 h-9 rounded-lg font-semibold text-sm transition-all duration-150 border
                ${
                  isCurrent
                    ? 'bg-gradient-to-br from-primary to-accent border-transparent text-white shadow-[0_10px_22px_-12px_rgba(139,92,246,1)] scale-105'
                    : isAnsweredQuestion
                      ? 'bg-accent/25 border-accent/45 text-foreground'
                      : 'bg-fill border-hairline text-muted hover:border-white/20 hover:text-foreground'
                }`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuizTakePage;
