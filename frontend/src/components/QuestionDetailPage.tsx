import React, { useState, useEffect } from 'react';
// @ts-expect-error: DOMPurify may not have types, but is needed for sanitizing HTML
import DOMPurify from 'dompurify';
import { motion } from 'framer-motion';
import {
  ArrowUp,
  ArrowDown,
  MessageCircle,
  CheckCircle,
  Edit,
  Trash2,
  Clock,
  User,
  Send,
  Award,
  Eye,
  ArrowLeft,
} from 'lucide-react';
import { WYSIWYGEditor } from './WYSIWYGEditor';
import { fetchQuestionById } from '../api/questions';

interface Answer {
  id: string;
  content: string;
  author: {
    username: string;
    avatar: string;
  };
  createdAt: string;
  votes: number;
  isAccepted: boolean;
  comments: Comment[];
}

interface Comment {
  id: string;
  content: string;
  author: {
    username: string;
    avatar: string;
  };
  createdAt: string;
}

interface QuestionDetail {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author: {
    username: string;
    avatar: string;
  };
  createdAt: string;
  votes: number;
  views: number;
  answers: Answer[];
  isOwner: boolean;
}

interface QuestionDetailPageProps {
  questionId: string;
}

export const QuestionDetailPage: React.FC<QuestionDetailPageProps> = ({ questionId }) => {
  const [question, setQuestion] = useState<QuestionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newAnswer, setNewAnswer] = useState('');
  const [showComments, setShowComments] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchQuestionById(questionId)
      .then((data: {
        id?: string;
        title?: string;
        description?: string;
        tags?: { name: string }[];
        author?: { username?: string };
        createdAt?: string;
        votes?: number;
        views?: number;
        answers?: {
          id?: string;
          content?: string;
          author?: { username?: string };
          createdAt?: string;
          votes?: { value?: number }[];
          isAccepted?: boolean;
        }[];
        acceptedAnswerId?: string;
      }) => {
        // Map backend data to frontend format
        setQuestion({
          id: typeof data.id === 'string' ? data.id : '',
          title: typeof data.title === 'string' ? data.title : '',
          description: typeof data.description === 'string' ? (data.description ?? '') : JSON.stringify(data.description ?? ''),
          tags: Array.isArray(data.tags) ? (data.tags as { name: string }[]).map((tag) => tag.name) : [],
          author: { username: data.author?.username ?? '', avatar: '' },
          createdAt: typeof data.createdAt === 'string' ? data.createdAt : '',
          votes: typeof data.votes === 'number' ? data.votes : 0,
          views: typeof data.views === 'number' ? data.views : 0,
          answers: Array.isArray(data.answers) ? data.answers.map((ans: { id?: string; content?: string; author?: { username?: string }; createdAt?: string; votes?: { value?: number }[]; isAccepted?: boolean }) => ({
            id: typeof ans.id === 'string' ? ans.id : '',
            content: typeof ans.content === 'string' ? (ans.content ?? '') : JSON.stringify(ans.content ?? ''),
            author: { username: ans.author?.username ?? '', avatar: '' },
            createdAt: typeof ans.createdAt === 'string' ? ans.createdAt : '',
            votes: Array.isArray(ans.votes) ? ans.votes.reduce((sum, v) => sum + (v.value || 0), 0) : 0,
            isAccepted: !!(ans.isAccepted || (data.acceptedAnswerId && ans.id === data.acceptedAnswerId)),
            comments: [] as never[], // Add comment mapping if available
          })) : [],
          isOwner: false, // Set this based on auth if needed
        });
        setError(null);
      })
      .catch((err) => setError(err.message || 'Failed to load question'))
      .finally(() => setLoading(false));
  }, [questionId]);

  const timeAgo = (date: string) => {
    const now = new Date();
    const questionDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - questionDate.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const tagColors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-red-100 text-red-800',
  ];

  if (loading) {
    return <div className="text-center py-12 text-lg text-gray-500">Loading question...</div>;
  }
  if (error || !question) {
    return <div className="text-center py-12 text-lg text-red-500">{error || 'Question not found.'}</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Question Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200"
            >
              {/* Question Header */}
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-3xl font-bold text-gray-900 flex-1 mr-4">
                  {question.title}
                </h1>
                {question.answers.some(a => a.isAccepted) && (
                  <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Solved
                  </div>
                )}
              </div>

              {/* Author Info */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-7 h-7 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{question.author.username}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {timeAgo(question.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {question.views} views
                      </span>
                    </div>
                  </div>
                </div>

                {question.isOwner && (
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-[#1f0d38] hover:bg-gray-50 rounded-xl transition-colors">
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {/* Question Content (WYSIWYG) */}
              <div className="prose max-w-none mb-6">
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(question.description)
                  }}
                />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {question.tags.map((tag, index) => (
                  <span
                    key={tag}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${tagColors[index % tagColors.length]
                      }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Vote Section */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowUp className="w-5 h-5 text-gray-600" />
                  </button>
                  <span className="font-semibold text-lg">{question.votes}</span>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowDown className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Answers Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {question.answers.length} Answer{question.answers.length !== 1 ? 's' : ''}
              </h2>

              <div className="space-y-6">
                {question.answers.map((answer, index) => (
                  <motion.div
                    key={answer.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`border-l-4 pl-6 py-4 ${answer.isAccepted ? 'border-green-500 bg-green-50/50' : 'border-gray-200'
                      }`}
                  >
                    {answer.isAccepted && (
                      <div className="flex items-center gap-2 mb-4">
                        <Award className="w-5 h-5 text-green-600" />
                        <span className="text-green-700 font-semibold">Accepted Answer</span>
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{answer.author.username}</p>
                          <p className="text-sm text-gray-500">{timeAgo(answer.createdAt)}</p>
                        </div>
                      </div>

                      {question.isOwner && !answer.isAccepted && (
                        <button className="flex items-center gap-2 px-3 py-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Accept
                        </button>
                      )}
                    </div>

                    <div className="prose max-w-none mb-4">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {answer.content}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <ArrowUp className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="font-medium">{answer.votes}</span>
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <ArrowDown className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                      <button
                        onClick={() => setShowComments(showComments === answer.id ? null : answer.id)}
                        className="flex items-center gap-2 px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Comment
                      </button>
                    </div>

                    {showComments === answer.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 p-4 bg-gray-50 rounded-xl"
                      >
                        <textarea
                          placeholder="Add a comment..."
                          className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#1f0d38] focus:border-transparent"
                          rows={3}
                        />
                        <div className="flex justify-end mt-2">
                          <button className="px-4 py-2 bg-[#1f0d38] text-white rounded-lg hover:bg-[#2d1b4e] transition-colors">
                            Post Comment
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Answer Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Your Answer</h3>

              <WYSIWYGEditor
                value={newAnswer}
                onChange={setNewAnswer}
                placeholder="Write your answer here... Be specific and provide examples if possible."
                minHeight="200px"
              />

              <div className="flex justify-end mt-6">
                <motion.button
                  className="bg-gradient-to-r from-[#1f0d38] to-purple-600 hover:from-[#2d1b4e] hover:to-purple-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#1f0d38]/25 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-5 h-5" />
                  📩 Post Answer
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Quick Stats */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Asked</span>
                  <span className="font-medium">{timeAgo(question.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Views</span>
                  <span className="font-medium">{question.views}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Answers</span>
                  <span className="font-medium">{question.answers.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Votes</span>
                  <span className="font-medium">{question.votes}</span>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <button className="w-full bg-gradient-to-r from-[#1f0d38] to-purple-600 hover:from-[#2d1b4e] hover:to-purple-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              Back to Questions
            </button>

            {/* Related Questions */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Questions</h3>
              <div className="space-y-3">
                <a href="#" className="block text-[#1f0d38] hover:underline text-sm">
                  How to handle JWT token expiration?
                </a>
                <a href="#" className="block text-[#1f0d38] hover:underline text-sm">
                  React authentication best practices
                </a>
                <a href="#" className="block text-[#1f0d38] hover:underline text-sm">
                  TypeScript with React hooks
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};