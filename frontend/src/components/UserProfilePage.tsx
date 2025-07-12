import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
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
  Tag,
  Shield,
  Award,
  Eye,
  ChevronRight,
  Plus
} from 'lucide-react';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar: string;
  role: 'USER' | 'ADMIN';
  joinDate: string;
  stats: {
    questionsAsked: number;
    answersGiven: number;
    unreadNotifications: number;
    totalVotes: number;
    acceptedAnswers: number;
  };
}

interface UserQuestion {
  id: string;
  title: string;
  createdAt: string;
  tags: string[];
  answerCount: number;
  votes: number;
  isOwner: boolean;
}

interface UserAnswer {
  id: string;
  content: string;
  questionTitle: string;
  questionId: string;
  createdAt: string;
  votes: number;
  isAccepted: boolean;
}

interface UserComment {
  id: string;
  content: string;
  relatedTitle: string;
  relatedId: string;
  relatedType: 'question' | 'answer';
  createdAt: string;
}

// Mock data - replace with actual API calls
const mockUserProfile: UserProfile = {
  id: '1',
  username: 'alexdev',
  email: 'alex@example.com',
  avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
  role: 'ADMIN',
  joinDate: '2024-05-15T10:30:00Z',
  stats: {
    questionsAsked: 24,
    answersGiven: 67,
    unreadNotifications: 5,
    totalVotes: 342,
    acceptedAnswers: 23
  }
};

const mockUserQuestions: UserQuestion[] = [
  {
    id: '1',
    title: 'How to implement authentication in React with TypeScript?',
    createdAt: '2024-01-15T10:30:00Z',
    tags: ['react', 'typescript', 'authentication'],
    answerCount: 5,
    votes: 24,
    isOwner: true
  },
  {
    id: '2',
    title: 'Best practices for state management in large React applications',
    createdAt: '2024-01-14T08:15:00Z',
    tags: ['react', 'state-management', 'redux'],
    answerCount: 8,
    votes: 42,
    isOwner: true
  }
];

const mockUserAnswers: UserAnswer[] = [
  {
    id: '1',
    content: 'You can implement automatic token refresh using an interceptor. Here\'s a complete solution that ensures seamless user experience...',
    questionTitle: 'JWT token refresh mechanism in Node.js',
    questionId: 'q1',
    createdAt: '2024-01-15T11:15:00Z',
    votes: 18,
    isAccepted: true
  },
  {
    id: '2',
    content: 'Another approach is to use React Query with automatic retries. This library handles token refresh automatically...',
    questionTitle: 'React authentication best practices',
    questionId: 'q2',
    createdAt: '2024-01-14T12:30:00Z',
    votes: 12,
    isAccepted: false
  }
];

const mockUserComments: UserComment[] = [
  {
    id: '1',
    content: 'Great solution! I would also recommend adding error handling for network failures.',
    relatedTitle: 'How to handle API errors in React?',
    relatedId: 'q3',
    relatedType: 'question',
    createdAt: '2024-01-13T14:20:00Z'
  },
  {
    id: '2',
    content: 'This approach worked perfectly for my use case. Thanks for the detailed explanation!',
    relatedTitle: 'TypeScript generic constraints explained',
    relatedId: 'a5',
    relatedType: 'answer',
    createdAt: '2024-01-12T16:45:00Z'
  }
];

export const UserProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'questions' | 'answers' | 'comments'>('questions');
  const [userProfile] = useState<UserProfile>(mockUserProfile);
  const [userQuestions] = useState<UserQuestion[]>(mockUserQuestions);
  const [userAnswers] = useState<UserAnswer[]>(mockUserAnswers);
  const [userComments] = useState<UserComment[]>(mockUserComments);

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

  const formatJoinDate = (date: string) => {
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
                  src={userProfile.avatar}
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
                  <span>Member since {formatJoinDate(userProfile.joinDate)}</span>
                </div>

                {/* Stats Badges */}
                <div className="flex flex-wrap gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl"
                  >
                    <Brain className="w-5 h-5" />
                    <span className="font-semibold">{userProfile.stats.questionsAsked}</span>
                    <span className="text-sm">Questions</span>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-semibold">{userProfile.stats.answersGiven}</span>
                    <span className="text-sm">Answers</span>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-xl cursor-pointer"
                    onClick={() => {/* Navigate to notifications */ }}
                  >
                    <Bell className="w-5 h-5" />
                    <span className="font-semibold">{userProfile.stats.unreadNotifications}</span>
                    <span className="text-sm">Notifications</span>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-xl"
                  >
                    <Award className="w-5 h-5" />
                    <span className="font-semibold">{userProfile.stats.acceptedAnswers}</span>
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
                    onClick={() => setActiveTab(tab.id as any)}
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
                            <button className="p-2 text-gray-600 hover:text-[#1f0d38] hover:bg-gray-100 rounded-lg transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {question.tags.map((tag, tagIndex) => (
                            <span
                              key={tag}
                              className={`px-3 py-1 rounded-full text-xs font-medium ${tagColors[tagIndex % tagColors.length]
                                }`}
                            >
                              {tag}
                            </span>
                          ))}
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
                        className={`border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 ${answer.isAccepted ? 'border-green-300 bg-green-50/50' : 'border-gray-200'
                          }`}
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
                            {answer.content}
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
                          <button className="flex items-center gap-1 text-[#1f0d38] hover:underline">
                            View Question <ExternalLink className="w-3 h-3" />
                          </button>
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
                          <button className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
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
                  <span className="font-bold text-[#1f0d38]">{userProfile.stats.totalVotes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Accepted Answers</span>
                  <span className="font-bold text-green-600">{userProfile.stats.acceptedAnswers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Questions Asked</span>
                  <span className="font-bold text-blue-600">{userProfile.stats.questionsAsked}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Answers Given</span>
                  <span className="font-bold text-purple-600">{userProfile.stats.answersGiven}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors">
                  <Plus className="w-5 h-5 text-[#1f0d38]" />
                  <span>Ask New Question</span>
                  <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors">
                  <Bell className="w-5 h-5 text-[#1f0d38]" />
                  <span>View Notifications</span>
                  <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors">
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
    </div>
  );
};