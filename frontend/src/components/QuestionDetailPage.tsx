import React, { useState, useEffect } from 'react';
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
import { postAnswer } from '../api/answers';
import { postVote } from '../api/votes';
import { postComment, fetchComments } from '../api/comments';

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
  const [comments, setComments] = useState<Record<string, Array<{ id: string; content: string; author: { username: string }; createdAt: string }>>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [commentLoading, setCommentLoading] = useState<Record<string, boolean>>({});
  const [commentError, setCommentError] = useState<Record<string, string | null>>({});
  const [answerLoading, setAnswerLoading] = useState(false);
  const [answerError, setAnswerError] = useState<string | null>(null);
  const [voteLoading, setVoteLoading] = useState<string | null>(null); // answerId being voted
  const [voteError, setVoteError] = useState<string | null>(null);

  // Fetch comments for an answer
  const loadComments = async (answerId: string) => {
    try {
      const data = await fetchComments({ answerId });
      setComments(prev => ({ ...prev, [answerId]: data }));
    } catch {
      setComments(prev => ({ ...prev, [answerId]: [] }));
    }
  };

  // Show/hide comments and fetch if needed
  const handleShowComments = (answerId: string) => {
    if (showComments === answerId) {
      setShowComments(null);
    } else {
      setShowComments(answerId);
      if (!comments[answerId]) {
        loadComments(answerId);
      }
    }
  };

  // Post a comment
  const handlePostComment = async (answerId: string) => {
    setCommentLoading(prev => ({ ...prev, [answerId]: true }));
    setCommentError(prev => ({ ...prev, [answerId]: null }));
    const token = localStorage.getItem('token');
    if (!token) {
      setCommentError(prev => ({ ...prev, [answerId]: 'You must be logged in to comment.' }));
      setCommentLoading(prev => ({ ...prev, [answerId]: false }));
      return;
    }
    try {
      await postComment({ answerId, content: commentInputs[answerId] || '', token });
      setCommentInputs(prev => ({ ...prev, [answerId]: '' }));
      await loadComments(answerId);
    } catch {
      setCommentError(prev => ({ ...prev, [answerId]: 'Failed to post comment.' }));
    } finally {
      setCommentLoading(prev => ({ ...prev, [answerId]: false }));
    }
  };

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
            votes: Array.isArray(ans.votes) ? ans.votes.reduce((sum: number, v: { value?: number }) => sum + (v.value || 0), 0) : 0,
            isAccepted: false,
            comments: [] as never[],
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

  // Post answer handler
  const handlePostAnswer = async () => {
    setAnswerLoading(true);
    setAnswerError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setAnswerError('You must be logged in to post an answer.');
      setAnswerLoading(false);
      return;
    }
    try {
      const answer = await postAnswer({ questionId, content: newAnswer, token });
      setNewAnswer('');
      // Map backend answer to frontend format
      const mappedAnswer = {
        id: answer.id,
        content: typeof answer.content === 'string' ? answer.content : JSON.stringify(answer.content ?? ''),
        author: { username: answer.author?.username ?? '', avatar: '' },
        createdAt: typeof answer.createdAt === 'string' ? answer.createdAt : '',
        votes: Array.isArray(answer.votes) ? answer.votes.reduce((sum: number, v: { value?: number }) => sum + (v.value || 0), 0) : 0,
        isAccepted: false,
        comments: [] as never[],
      };
      setQuestion(prev => prev ? { ...prev, answers: [...prev.answers, mappedAnswer] } : prev);
    } catch {
      setAnswerError('Failed to post answer. Please try again.');
    } finally {
      setAnswerLoading(false);
    }
  };

  // Vote handler
  const handleVote = async (answerId: string, value: 1 | -1) => {
    setVoteLoading(answerId);
    setVoteError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setVoteError('You must be logged in to vote.');
      setVoteLoading(null);
      return;
    }
    try {
      const voteResult = await postVote({ answerId, value, token });
      // Update only the voted answer's votes in local state
      setQuestion(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          answers: prev.answers.map(ans =>
            ans.id === answerId
              ? { ...ans, votes: typeof voteResult.value === 'number' ? voteResult.value : ans.votes + value }
              : ans
          )
        };
      });
    } catch {
      setVoteError('Failed to vote. Please try again.');
    } finally {
      setVoteLoading(null);
    }
  };

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
                      <div
                        className="text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(answer.content)
                        }}
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                          disabled={!!voteLoading}
                          onClick={() => handleVote(answer.id, 1)}
                        >
                          <ArrowUp className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="font-medium">{answer.votes}</span>
                        <button
                          className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                          disabled={!!voteLoading}
                          onClick={() => handleVote(answer.id, -1)}
                        >
                          <ArrowDown className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                      {voteLoading === answer.id && <span className="text-xs text-gray-400">Voting...</span>}
                      {voteError && <span className="text-xs text-red-500">{voteError}</span>}
                      <button
                        onClick={() => handleShowComments(answer.id)}
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
                        {/* List comments */}
                        <div className="mb-4 space-y-2">
                          {(comments[answer.id] || []).length === 0 ? (
                            <div className="text-gray-400 text-sm">No comments yet.</div>
                          ) : (
                            comments[answer.id].map((comment) => (
                              <div key={comment.id} className="flex items-start gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                  <User className="w-4 h-4 text-gray-500" />
                                </div>
                                <div>
                                  <span className="font-semibold text-gray-800 text-sm">{comment.author.username}</span>
                                  <span className="ml-2 text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
                                  <div className="text-gray-700 text-sm mt-1">{typeof comment.content === 'string' ? comment.content : JSON.stringify(comment.content)}</div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                        {/* Add comment form */}
                        <textarea
                          placeholder="Add a comment..."
                          className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#1f0d38] focus:border-transparent"
                          rows={3}
                          value={commentInputs[answer.id] || ''}
                          onChange={e => setCommentInputs(prev => ({ ...prev, [answer.id]: e.target.value }))}
                          disabled={!!commentLoading[answer.id]}
                        />
                        {commentError[answer.id] && <div className="text-red-600 text-sm mt-1">{commentError[answer.id]}</div>}
                        <div className="flex justify-end mt-2">
                          <button
                            className="px-4 py-2 bg-[#1f0d38] text-white rounded-lg hover:bg-[#2d1b4e] transition-colors disabled:opacity-60"
                            onClick={() => handlePostComment(answer.id)}
                            disabled={!!commentLoading[answer.id] || !(commentInputs[answer.id] || '').trim()}
                          >
                            {commentLoading[answer.id] ? 'Posting...' : 'Post Comment'}
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
              {answerError && <div className="text-red-600 font-semibold mb-2">{answerError}</div>}
              <div className="flex justify-end mt-6">
                <motion.button
                  className="bg-gradient-to-r from-[#1f0d38] to-purple-600 hover:from-[#2d1b4e] hover:to-purple-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#1f0d38]/25 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePostAnswer}
                  disabled={answerLoading || !newAnswer.trim()}
                >
                  {answerLoading ? 'Posting...' : (<><Send className="w-5 h-5" />📩 Post Answer</>)}
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