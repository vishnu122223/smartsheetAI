import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import quizService from '../../services/quiz.service';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Trophy,
  Target,
  BookOpen,
} from 'lucide-react';

function QuizResultPage() {
  const { quizId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await quizService.getQuizResults(quizId);
        setResults(response);
      } catch {
        toast.error('Failed to fetch quiz results');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [quizId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner label="Loading results" />
      </div>
    );
  }

  if (!results) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-lg text-muted">Quiz results not found.</p>
      </div>
    );
  }

  const {
    data: { quiz, results: detailedResults },
  } = results;
  const score = quiz.score;
  const totalQuestions = detailedResults.length;
  const correctAnswers = detailedResults.filter((r) => r.isCorrect).length;
  const incorrectAnswers = totalQuestions - correctAnswers;

  const getScoreColor = (value) => {
    if (value >= 80) return 'text-gradient';
    if (value >= 60) return 'text-warning';
    return 'text-danger';
  };

  const getScoreMessage = (value) => {
    if (value >= 90) return 'Outstanding!';
    if (value >= 80) return 'Great job!';
    if (value >= 70) return 'Good work!';
    if (value >= 60) return 'Not bad!';
    return 'Keep practicing!';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-5">
        <Link
          to={`/documents/${quiz.document._id}`}
          className="inline-flex items-center gap-2 text-sm link-accent hover:no-underline"
        >
          <ArrowLeft size={16} />
          Back to Document
        </Link>
      </div>

      <PageHeader title={`${quiz.title || 'Quiz'} results`} />

      {/* Score Card */}
      <div className="surface relative overflow-hidden p-8 mb-6">
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-56 w-96 rounded-full bg-accent/25 blur-3xl" />

        <div className="relative z-10 text-center space-y-6">
          <div className="icon-tile mx-auto !w-16 !h-16 !rounded-2xl">
            <Trophy strokeWidth={1.8} className="w-8 h-8 text-gold" />
          </div>

          <div>
            <p className="eyebrow mb-3">Your score</p>
            <div className={`text-6xl font-bold tracking-tight mb-2 ${getScoreColor(score)}`}>
              {score}%
            </div>
            <p className="text-lg font-semibold text-foreground">
              {getScoreMessage(score)}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
            <span className="chip">
              <Target size={12} />
              {totalQuestions} total
            </span>
            <span
              className="chip"
              style={{
                background: 'rgba(52, 211, 153, 0.1)',
                borderColor: 'rgba(52, 211, 153, 0.3)',
                color: '#34D399',
              }}
            >
              <CheckCircle2 size={12} />
              {correctAnswers} correct
            </span>
            <span
              className="chip"
              style={{
                background: 'rgba(248, 113, 113, 0.1)',
                borderColor: 'rgba(248, 113, 113, 0.3)',
                color: '#F87171',
              }}
            >
              <XCircle size={12} />
              {incorrectAnswers} incorrect
            </span>
          </div>
        </div>
      </div>

      {/* Questions Review */}
      <div className="space-y-5">
        <div className="flex items-center gap-2.5 mb-2">
          <BookOpen size={18} className="text-accent" />
          <h3 className="text-lg font-bold tracking-tight">Detailed review</h3>
        </div>

        {detailedResults.map((result, index) => {
          const userAnswerIndex = result.options.findIndex(
            (opt) => opt === result.selectedAnswer
          );
          const correctAnswerIndex =
            typeof result.correctAnswer === 'string' &&
            result.correctAnswer.match(/^O\d+$/)
              ? Number(result.correctAnswer.slice(1)) - 1
              : result.options.indexOf(result.correctAnswer);

          const isCorrect = result.isCorrect;

          return (
            <div key={result.questionIndex} className="surface p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <span className="chip mb-3 inline-flex">Question {index + 1}</span>
                  <h4 className="text-base font-semibold leading-relaxed">
                    {result.question}
                  </h4>
                </div>

                <div
                  className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border ${
                    isCorrect
                      ? 'bg-success/15 border-success/40 text-success'
                      : 'bg-danger/15 border-danger/40 text-danger'
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 strokeWidth={2} className="w-5 h-5" />
                  ) : (
                    <XCircle strokeWidth={2} className="w-5 h-5" />
                  )}
                </div>
              </div>

              <div className="space-y-2.5 mb-4">
                {result.options.map((option, optIndex) => {
                  const isCorrectOption = optIndex === correctAnswerIndex;
                  const isUseranswer = optIndex === userAnswerIndex;
                  const isWrongAnswer = isUseranswer && !isCorrect;

                  return (
                    <div
                      key={optIndex}
                      className={`px-4 py-3 rounded-xl border transition-all duration-200 ${
                        isCorrectOption
                          ? 'bg-success/12 border-success/40'
                          : isWrongAnswer
                            ? 'bg-danger/12 border-danger/40'
                            : 'bg-fill border-hairline'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span
                          className={`text-sm ${
                            isCorrectOption
                              ? 'text-success font-semibold'
                              : isWrongAnswer
                                ? 'text-danger font-semibold'
                                : 'text-foreground/85 font-medium'
                          }`}
                        >
                          {option}
                        </span>
                        <div className="flex items-center gap-2 text-xs font-semibold">
                          {isCorrectOption && (
                            <span className="text-success inline-flex items-center gap-1.5">
                              <CheckCircle2 strokeWidth={2.5} className="w-4 h-4" />
                              Correct
                            </span>
                          )}
                          {isWrongAnswer && (
                            <span className="text-danger inline-flex items-center gap-1.5">
                              <XCircle strokeWidth={2.5} className="w-4 h-4" />
                              Your answer
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              {result.explanation && (
                <div className="p-4 rounded-xl bg-primary/12 border border-primary/30">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <BookOpen strokeWidth={2} className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-accent mb-1">
                        Explanation
                      </p>
                      <p className="text-sm leading-relaxed text-foreground/90">
                        {result.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <Link to={`/documents/${quiz.document._id}`} className="btn btn-primary">
          <ArrowLeft strokeWidth={2} className="w-4 h-4" />
          Return to document
        </Link>
      </div>
    </div>
  );
}

export default QuizResultPage;
