
import React from 'react';
import { Link } from 'react-router-dom';
import { Play, BarChart2, Trash2, Award } from 'lucide-react';
import moment from 'moment';

const QuizCard = ({ quiz, onDelete }) => {
  return (
    <div className="group relative bg-white border border-gray-300 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-200">

      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(quiz);
        }}
        className="absolute top-4 right-4 p-2 rounded-lg text-gray-500 hover:text-white hover:bg-red-500 opacity-0 group-hover:opacity-100 transition"
      >
        <Trash2 className="w-5 h-5" />
      </button>

      <div className="space-y-4">

        {/* Score Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-sm font-semibold">
          <Award className="w-4 h-4" />
          Score: {quiz?.score || 0}
        </div>

        {/* Title */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
            {quiz.title || `Quiz - ${moment(quiz.createdAt).format('MMM D, YYYY')}`}
          </h3>
          <p className="text-sm text-gray-500">
            Created {moment(quiz.createdAt).format('MMM D, YYYY')}
          </p>
        </div>

        {/* Questions */}
        <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
          <div className="px-3 py-1 rounded-lg bg-gray-100 text-gray-800 font-medium text-sm">
            {quiz.questions.length} {quiz.questions.length === 1 ? 'Question' : 'Questions'}
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="mt-5">
        {quiz?.userAnswers?.length > 0 ? (
          <Link to={`/quizzes/${quiz._id}`}>
            <button className="w-full h-11 rounded-lg font-semibold bg-gray-900 text-white hover:bg-gray-800 transition flex items-center justify-center gap-2">
              <BarChart2 size={16} />
              View Results
            </button>
          </Link>
        ) : (
          <Link to={`/quizzes/${quiz._id}`}>
            <button className="w-full h-11 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-500 transition flex items-center justify-center gap-2">
              <Play size={16} />
              Start Quiz
            </button>
          </Link>
        )}
      </div>

    </div>
  );
};

export default QuizCard;