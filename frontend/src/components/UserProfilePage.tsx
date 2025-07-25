import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Brain,
  MessageCircle,
  Bell,
  Edit,
  Settings,
  Trash2,
  ExternalLink,
  ArrowUp,
  Clock,
  Shield,
  Award,
  Eye,
  ChevronRight,
  Plus,
  X,
  CheckCircle
} from 'lucide-react';
import { fetchUserProfile, fetchUserQuestions, fetchUserAnswers, fetchUserComments } from '../api/users';
import { updateQuestion, deleteQuestion } from '../api/questions';
import { deleteAnswer, acceptAnswer } from '../api/answers';
import { deleteComment } from '../api/comments';

interface UserProfilePageProps {
  setCurrentPage: (page: string) => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ setCurrentPage }) => {
  const [activeTab, setActiveTab] = useState<'questions' | 'answers' | 'comments'>('questions');
  const [userProfile, setUserProfile] = useState<{
    id: string;
    username: string;
    email: string;
    avatar: string;
    role: 'USER' | 'ADMIN';
    joinDate?: string;
    createdAt?: string;
    stats?: {
      questionsAsked: number;
      answersGiven: number;
      unreadNotifications: number;
      totalVotes: number;
      acceptedAnswers: number;
    };
    totalQuestions?: number;
    totalAnswers?: number;
  } | null>(null);
  const [userQuestions, setUserQuestions] = useState<Array<{
    id: string;
    title: string;
    createdAt: string;
    tags: Array<string | { id?: string; name: string }>;
    answerCount: number;
    votes: number;
    isOwner?: boolean;
    description?: any;
  }>>([]);
  const [userAnswers, setUserAnswers] = useState<Array<{
    id: string;
    content: string;
    questionTitle: string;
    questionId: string;
    createdAt: string;
    votes: number;
    isAccepted: boolean;
  }>>([]);
  const [userComments, setUserComments] = useState<Array<{
    id: string;
    content: string;
    relatedTitle: string;
    relatedId: string;
    relatedType: 'question' | 'answer';
    createdAt: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editQuestion, setEditQuestion] = useState<null | (typeof userQuestions[number])>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const openEditModal = (question: typeof userQuestions[number]) => {
    setEditQuestion(question);
    setEditTitle(question.title);
    setEditDescription(
      typeof question.description === 'string'
        ? question.description
        : question.description
          ? JSON.stringify(question.description, null, 2)
          : ''
    );
    setEditTags(Array.isArray(question.tags) ? question.tags.map((t) => (typeof t === 'string' ? t : t.name)) : []);
    setEditModalOpen(true);
    setEditError(null);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditQuestion(null);
    setEditTitle('');
    setEditDescription('');
    setEditTags([]);
    setEditError(null);
  };

  const handleEditSubmit = async () => {
    if (!editQuestion) return;
    setEditLoading(true);
    setEditError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setEditError('Not authenticated');
      setEditLoading(false);
      return;
    }
    try {
      let descriptionToSend: any = editDescription;
      try {
        // Try to parse as JSON for rich content
        descriptionToSend = JSON.parse(editDescription);
      } catch {
        // If not valid JSON, send as string
        descriptionToSend = editDescription;
      }
      const updated = await updateQuestion({
        id: editQuestion.id,
        title: editTitle,
        description: descriptionToSend,
        tags: editTags,
        token
      });
      setUserQuestions(prev => prev.map(q => q.id === updated.id ? { ...q, ...updated } : q));
      closeEditModal();
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'message' in err) {
        setEditError((err as { message?: string }).message || 'Failed to update question');
      } else {
        setEditError('Failed to update question');
      }
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await deleteQuestion({ id, token });
      setUserQuestions(prev => prev.filter(q => q.id !== id));
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'message' in err) {
        alert((err as { message?: string }).message || 'Failed to delete question');
      } else {
        alert('Failed to delete question');
      }
    }
  };

  const handleDeleteAnswer = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    if (!window.confirm('Are you sure you want to delete this answer?')) return;
    try {
      await deleteAnswer({ id, token });
      setUserAnswers(prev => prev.filter(a => a.id !== id));
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'message' in err) {
        alert((err as { message?: string }).message || 'Failed to delete answer');
      } else {
        alert('Failed to delete answer');
      }
    }
  };

  const handleAcceptAnswer = async (answerId: string, questionId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await acceptAnswer({ questionId, answerId, token });
      setUserAnswers(prev => prev.map(a => a.id === answerId ? { ...a, isAccepted: true } : a));
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'message' in err) {
        alert((err as { message?: string }).message || 'Failed to accept answer');
      } else {
        alert('Failed to accept answer');
      }
    }
  };

  const handleDeleteComment = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await deleteComment({ id, token });
      setUserComments(prev => prev.filter(c => c.id !== id));
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'message' in err) {
        alert((err as { message?: string }).message || 'Failed to delete comment');
      } else {
        alert('Failed to delete comment');
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([
      fetchUserProfile(token),
      fetchUserQuestions(token),
      fetchUserAnswers(token),
      fetchUserComments(token)
    ])
      .then(([profile, questions, answers, comments]) => {
        setUserProfile({
          id: profile.id,
          username: profile.username,
          email: profile.email,
          avatar: profile.avatar || '',
          role: profile.role,
          createdAt: profile.createdAt,
          totalQuestions: profile.totalQuestions,
          totalAnswers: profile.totalAnswers,
          // Add more fields if backend provides them
        });
        setUserQuestions(questions);
        setUserAnswers(answers);
        setUserComments(comments);
        setError(null);
      })
      .catch((err: unknown) => {
        if (typeof err === 'object' && err !== null && 'message' in err) {
          setError((err as { message?: string }).message || 'Failed to load user data');
        } else {
          setError('Failed to load user data');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const timeAgo = (date: string) => {
    const now = new Date();
    const itemDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - itemDate.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo ago`;
  };

  const formatJoinDate = (date: string | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const tagColors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-red-100 text-red-800',
    'bg-yellow-100 text-yellow-800',
    'bg-indigo-100 text-indigo-800',
  ];

  const tabs = [
    { id: 'questions', label: 'My Questions', count: userQuestions.length },
    { id: 'answers', label: 'My Answers', count: userAnswers.length },
    { id: 'comments', label: 'My Comments', count: userComments.length },
  ];

  if (loading) {
    return <div className="text-center py-12 text-lg text-gray-500">Loading profile...</div>;
  }
  if (error || !userProfile) {
    return <div className="text-center py-12 text-lg text-red-500">{error || 'User not found.'}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-200"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* User Info */}
            <div className="flex items-center gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <img
                  src={userProfile.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(userProfile.username)}
                  alt={userProfile.username}
                  className="w-24 h-24 rounded-full object-cover border-4 border-[#1f0d38]"
                />
                {userProfile.role === 'ADMIN' && (
                  <div className="absolute -top-2 -right-2 bg-yellow-500 text-white p-1 rounded-full">
                    <Shield className="w-4 h-4" />
                  </div>
                )}
              </motion.div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{userProfile.username}</h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${userProfile.role === 'ADMIN'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                    }`}>
                    {userProfile.role}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>Member since {formatJoinDate(userProfile.createdAt || userProfile.joinDate)}</span>
                </div>

                {/* Stats Badges */}
                <div className="flex flex-wrap gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl"
                  >
                    <Brain className="w-5 h-5" />
                    <span className="font-semibold">{userProfile.totalQuestions ?? userProfile.stats?.questionsAsked ?? 0}</span>
                    <span className="text-sm">Questions</span>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-semibold">{userProfile.totalAnswers ?? userProfile.stats?.answersGiven ?? 0}</span>
                    <span className="text-sm">Answers</span>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-xl cursor-pointer"
                    onClick={() => {/* Navigate to notifications */ }}
                  >
                    <Bell className="w-5 h-5" />
                    <span className="font-semibold">{userProfile.stats?.unreadNotifications ?? 0}</span>
                    <span className="text-sm">Notifications</span>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-xl"
                  >
                    <Award className="w-5 h-5" />
                    <span className="font-semibold">{userProfile.stats?.acceptedAnswers ?? 0}</span>
                    <span className="text-sm">Accepted</span>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-[#1f0d38] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-[#2d1b4e]"
              >
                <Edit className="w-5 h-5" />
                Edit Profile
              </motion.button>

              {userProfile.role === 'ADMIN' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/admin'}
                  className="flex items-center gap-2 bg-yellow-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-yellow-600"
                >
                  <Settings className="w-5 h-5" />
                  Admin Panel
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden"
            >
              {/* Tab Headers */}
              <div className="flex border-b border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-300 ${activeTab === tab.id
                      ? 'bg-[#1f0d38] text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Questions Tab */}
                {activeTab === 'questions' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    {userQuestions.map((question, index) => (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold text-gray-900 hover:text-[#1f0d38] cursor-pointer flex-1 mr-4">
                            {question.title}
                          </h3>
                          <div className="flex gap-2">
                            <button
                              className="p-2 text-gray-600 hover:text-[#1f0d38] hover:bg-gray-100 rounded-lg transition-colors"
                              onClick={() => openEditModal(question)}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              onClick={() => handleDeleteQuestion(question.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-2">
                          {(question.tags || []).map((tag: string | { id?: string; name: string }, tagIndex: number) => {
                            let key: string | number = tagIndex;
                            let label: string = '';
                            if (typeof tag === 'string') {
                              label = tag;
                              key = tag + '-' + tagIndex;
                            } else if (tag && typeof tag === 'object') {
                              label = tag.name;
                              key = (tag.id ?? tag.name) + '-' + tagIndex;
                            }
                            return (
                              <span
                                key={key}
                                className={`px-3 py-1 rounded-full text-xs font-medium ${tagColors[tagIndex % tagColors.length]}`}
                              >
                                {label}
                              </span>
                            );
                          })}
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {timeAgo(question.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              {question.answerCount} answers
                            </span>
                            <span className="flex items-center gap-1">
                              <ArrowUp className="w-4 h-4" />
                              {question.votes} votes
                            </span>
                          </div>
                          <button className="flex items-center gap-1 text-[#1f0d38] hover:underline">
                            View <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Answers Tab */}
                {activeTab === 'answers' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    {userAnswers.map((answer, index) => (
                      <motion.div
                        key={answer.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 ${answer.isAccepted ? 'border-green-300 bg-green-50/50' : 'border-gray-200'}`}
                      >
                        {answer.isAccepted && (
                          <div className="flex items-center gap-2 mb-4">
                            <Award className="w-5 h-5 text-green-600" />
                            <span className="text-green-700 font-semibold">Accepted Answer</span>
                          </div>
                        )}

                        <div className="mb-4">
                          <h4 className="text-lg font-semibold text-[#1f0d38] hover:underline cursor-pointer mb-2">
                            {answer.questionTitle}
                          </h4>
                          <p className="text-gray-700 line-clamp-3">
                            {typeof answer.content === 'string' ? answer.content : JSON.stringify(answer.content)}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {timeAgo(answer.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <ArrowUp className="w-4 h-4" />
                              {answer.votes} votes
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button className="flex items-center gap-1 text-[#1f0d38] hover:underline">
                              View Question <ExternalLink className="w-3 h-3" />
                            </button>
                            {!answer.isAccepted && (
                              <button
                                className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                                onClick={() => handleAcceptAnswer(answer.id, answer.questionId)}
                              >
                                <CheckCircle className="w-4 h-4" /> Accept
                              </button>
                            )}
                            <button
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              onClick={() => handleDeleteAnswer(answer.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Comments Tab */}
                {activeTab === 'comments' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    {userComments.map((comment, index) => (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <p className="text-gray-700 flex-1 mr-4">
                            {comment.content}
                          </p>
                          <button className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            onClick={() => handleDeleteComment(comment.id)}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {timeAgo(comment.createdAt)}
                            </span>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                              {comment.relatedType}
                            </span>
                          </div>
                          <button className="flex items-center gap-1 text-[#1f0d38] hover:underline">
                            View {comment.relatedType} <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-sm text-gray-600">
                            On: <span className="font-medium text-gray-900">{comment.relatedTitle}</span>
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Quick Stats */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Votes</span>
                  <span className="font-bold text-[#1f0d38]">{userProfile.stats?.totalVotes ?? 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Accepted Answers</span>
                  <span className="font-bold text-green-600">{userProfile.stats?.acceptedAnswers ?? 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Questions Asked</span>
                  <span className="font-bold text-blue-600">{userProfile.stats?.questionsAsked ?? 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Answers Given</span>
                  <span className="font-bold text-purple-600">{userProfile.stats?.answersGiven ?? 0}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors"
                  onClick={() => setCurrentPage('ask')}>
                  <Plus className="w-5 h-5 text-[#1f0d38]" />
                  <span>Ask New Question</span>
                  <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors"
                  onClick={() => setCurrentPage('notifications')}>
                  <Bell className="w-5 h-5 text-[#1f0d38]" />
                  <span>View Notifications</span>
                  <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors"
                  onClick={() => setCurrentPage('home')}>
                  <Eye className="w-5 h-5 text-[#1f0d38]" />
                  <span>Browse Questions</span>
                  <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                </button>
              </div>
            </div>

            {/* Achievement Badge */}
            <div className="bg-gradient-to-br from-[#1f0d38] to-purple-600 rounded-3xl shadow-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-8 h-8 text-yellow-400" />
                <div>
                  <h3 className="font-bold">Top Contributor</h3>
                  <p className="text-sm opacity-90">This month</p>
                </div>
              </div>
              <p className="text-sm opacity-90">
                You're in the top 10% of contributors this month! Keep up the great work.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Edit Question Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              onClick={closeEditModal}
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-6">Edit Question</h2>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1f0d38]"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1f0d38] min-h-[100px]"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Tags (comma separated)</label>
              <input
                type="text"
                value={editTags.join(', ')}
                onChange={e => setEditTags(e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1f0d38]"
              />
            </div>
            {editError && <div className="text-red-600 mb-2">{editError}</div>}
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-6 py-2 rounded-xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
                onClick={closeEditModal}
                disabled={editLoading}
              >Cancel</button>
              <button
                className="px-6 py-2 rounded-xl bg-[#1f0d38] text-white font-semibold hover:bg-[#2d1b4e] disabled:opacity-60"
                onClick={handleEditSubmit}
                disabled={editLoading}
              >{editLoading ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};