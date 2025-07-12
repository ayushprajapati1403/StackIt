import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  MessageCircle, 
  Tag, 
  Shield, 
  TrendingUp, 
  Calendar, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Check, 
  X, 
  Crown, 
  UserMinus, 
  AlertTriangle,
  Activity,
  Clock,
  ArrowUp,
  ArrowDown,
  Settings
} from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  joinedAt: string;
  totalPosts: number;
  avatar: string;
}

interface Question {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  answerCount: number;
  votes: number;
  solved: boolean;
  acceptedAnswerId?: string;
}

interface Answer {
  id: string;
  content: string;
  author: string;
  questionTitle: string;
  votes: number;
  createdAt: string;
}

interface Comment {
  id: string;
  content: string;
  author: string;
  linkedType: 'Question' | 'Answer';
  linkedTitle: string;
  createdAt: string;
}

interface Tag {
  id: string;
  name: string;
  usageCount: number;
  approved: boolean;
  createdAt: string;
}

interface AdminStats {
  totalUsers: number;
  totalQuestions: number;
  totalAnswers: number;
  totalComments: number;
  totalTags: number;
  totalVotes: number;
  todayQuestions: number;
  todayAnswers: number;
  userGrowth: number;
  questionGrowth: number;
}

// Mock data
const mockStats: AdminStats = {
  totalUsers: 1247,
  totalQuestions: 3892,
  totalAnswers: 8734,
  totalComments: 2156,
  totalTags: 156,
  totalVotes: 15432,
  todayQuestions: 23,
  todayAnswers: 67,
  userGrowth: 12.5,
  questionGrowth: 8.3
};

const mockUsers: User[] = [
  {
    id: '1',
    username: 'alexdev',
    email: 'alex@example.com',
    role: 'ADMIN',
    joinedAt: '2024-01-15',
    totalPosts: 45,
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  },
  {
    id: '2',
    username: 'sarah_codes',
    email: 'sarah@example.com',
    role: 'USER',
    joinedAt: '2024-02-20',
    totalPosts: 23,
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  },
  {
    id: '3',
    username: 'mike_react',
    email: 'mike@example.com',
    role: 'USER',
    joinedAt: '2024-03-10',
    totalPosts: 67,
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  }
];

const mockQuestions: Question[] = [
  {
    id: '1',
    title: 'How to implement authentication in React?',
    author: 'sarah_codes',
    createdAt: '2024-03-15',
    answerCount: 5,
    votes: 23,
    solved: true,
    acceptedAnswerId: 'ans1'
  },
  {
    id: '2',
    title: 'Best practices for state management',
    author: 'mike_react',
    createdAt: '2024-03-14',
    answerCount: 3,
    votes: 18,
    solved: false
  }
];

const mockAnswers: Answer[] = [
  {
    id: 'ans1',
    content: 'You can use libraries like Auth0 or implement JWT tokens...',
    author: 'alexdev',
    questionTitle: 'How to implement authentication in React?',
    votes: 15,
    createdAt: '2024-03-15'
  },
  {
    id: 'ans2',
    content: 'For state management, I recommend using Redux Toolkit...',
    author: 'sarah_codes',
    questionTitle: 'Best practices for state management',
    votes: 12,
    createdAt: '2024-03-14'
  }
];

const mockComments: Comment[] = [
  {
    id: 'com1',
    content: 'Great explanation! This helped me a lot.',
    author: 'mike_react',
    linkedType: 'Answer',
    linkedTitle: 'How to implement authentication in React?',
    createdAt: '2024-03-15'
  },
  {
    id: 'com2',
    content: 'Could you provide more examples?',
    author: 'sarah_codes',
    linkedType: 'Question',
    linkedTitle: 'Best practices for state management',
    createdAt: '2024-03-14'
  }
];

const mockTags: Tag[] = [
  {
    id: 'tag1',
    name: 'react',
    usageCount: 234,
    approved: true,
    createdAt: '2024-01-01'
  },
  {
    id: 'tag2',
    name: 'javascript',
    usageCount: 456,
    approved: true,
    createdAt: '2024-01-01'
  },
  {
    id: 'tag3',
    name: 'authentication',
    usageCount: 89,
    approved: false,
    createdAt: '2024-03-10'
  }
];

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [answers, setAnswers] = useState<Answer[]>(mockAnswers);
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [tags, setTags] = useState<Tag[]>(mockTags);
  const [stats, setStats] = useState<AdminStats>(mockStats);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{type: string, id: string} | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = (type: string, id: string) => {
    setDeleteTarget({type, id});
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    
    switch (deleteTarget.type) {
      case 'user':
        setUsers(users.filter(u => u.id !== deleteTarget.id));
        break;
      case 'question':
        setQuestions(questions.filter(q => q.id !== deleteTarget.id));
        break;
      case 'answer':
        setAnswers(answers.filter(a => a.id !== deleteTarget.id));
        break;
      case 'comment':
        setComments(comments.filter(c => c.id !== deleteTarget.id));
        break;
      case 'tag':
        setTags(tags.filter(t => t.id !== deleteTarget.id));
        break;
    }
    
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const toggleUserRole = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? {...user, role: user.role === 'ADMIN' ? 'USER' : 'ADMIN'}
        : user
    ));
  };

  const toggleTagApproval = (tagId: string) => {
    setTags(tags.map(tag => 
      tag.id === tagId 
        ? {...tag, approved: !tag.approved}
        : tag
    ));
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, color: 'text-blue-400' },
    { id: 'users', label: 'Users', icon: Users, color: 'text-green-400' },
    { id: 'questions', label: 'Questions', icon: MessageSquare, color: 'text-purple-400' },
    { id: 'answers', label: 'Answers', icon: MessageCircle, color: 'text-orange-400' },
    { id: 'comments', label: 'Comments', icon: MessageCircle, color: 'text-pink-400' },
    { id: 'tags', label: 'Tags', icon: Tag, color: 'text-indigo-400' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 text-white p-6">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <p className="text-purple-200 text-sm">System Control</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-white/20 backdrop-blur-sm border border-white/30' 
                      : 'hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${item.color}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  Dashboard Overview
                </h2>
                <p className="text-slate-600">Monitor your platform's key metrics and activity</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Total Users</p>
                      <p className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                    </div>
                    <Users className="w-8 h-8 text-purple-200" />
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    <span>+{stats.userGrowth}% this month</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-indigo-100">Questions</p>
                      <p className="text-3xl font-bold">{stats.totalQuestions.toLocaleString()}</p>
                    </div>
                    <MessageSquare className="w-8 h-8 text-indigo-200" />
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    <span>+{stats.questionGrowth}% this month</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-violet-100">Answers</p>
                      <p className="text-3xl font-bold">{stats.totalAnswers.toLocaleString()}</p>
                    </div>
                    <MessageCircle className="w-8 h-8 text-violet-200" />
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <Activity className="w-4 h-4 mr-1" />
                    <span>{stats.todayAnswers} today</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-fuchsia-500 to-purple-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-fuchsia-100">Comments</p>
                      <p className="text-3xl font-bold">{stats.totalComments.toLocaleString()}</p>
                    </div>
                    <MessageCircle className="w-8 h-8 text-fuchsia-200" />
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Active discussions</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Tags</p>
                      <p className="text-3xl font-bold">{stats.totalTags}</p>
                    </div>
                    <Tag className="w-8 h-8 text-blue-200" />
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>Categorized content</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-pink-100">Total Votes</p>
                      <p className="text-3xl font-bold">{stats.totalVotes.toLocaleString()}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-pink-200" />
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    <span>Community engagement</span>
                  </div>
                </div>
              </div>

              {/* Today's Activity */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-purple-100">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Today's Activity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-800">{stats.todayQuestions}</p>
                      <p className="text-slate-600">New Questions</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-800">{stats.todayAnswers}</p>
                      <p className="text-slate-600">New Answers</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    User Management
                  </h2>
                  <p className="text-slate-600">Manage user accounts and permissions</p>
                </div>
                <div className="flex space-x-3">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-purple-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-purple-50 border-b border-purple-100">
                      <tr>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700">User</th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700">Email</th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700">Role</th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700">Joined</th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700">Posts</th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-purple-50 hover:bg-purple-50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              <img
                                src={user.avatar}
                                alt={user.username}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <span className="font-medium text-slate-800">{user.username}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-slate-600">{user.email}</td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              user.role === 'ADMIN' 
                                ? 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-slate-600">{user.joinedAt}</td>
                          <td className="py-4 px-6 text-slate-600">{user.totalPosts}</td>
                          <td className="py-4 px-6">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => toggleUserRole(user.id)}
                                className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all"
                                title={user.role === 'ADMIN' ? 'Demote to User' : 'Promote to Admin'}
                              >
                                <Crown className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete('user', user.id)}
                                className="p-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all"
                                title="Delete User"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Questions Tab */}
          {activeTab === 'questions' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  Question Management
                </h2>
                <p className="text-slate-600">Monitor and moderate community questions</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-purple-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-purple-50 border-b border-purple-100">
                      <tr>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700">Question</th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700">Author</th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700">Created</th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700">Answers</th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700">Votes</th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700">Status</th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {questions.map((question) => (
                        <tr key={question.id} className="border-b border-purple-50 hover:bg-purple-50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="max-w-xs">
                              <p className="font-medium text-slate-800 truncate">{question.title}</p>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-slate-600">{question.author}</td>
                          <td className="py-4 px-6 text-slate-600">{question.createdAt}</td>
                          <td className="py-4 px-6 text-slate-600">{question.answerCount}</td>
                          <td className="py-4 px-6 text-slate-600">{question.votes}</td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              question.solved 
                                ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700' 
                                : 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700'
                            }`}>
                              {question.solved ? 'Solved' : 'Open'}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex space-x-2">
                              <button className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete('question', question.id)}
                                className="p-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Answers Tab */}
          {activeTab === 'answers' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  Answer Management
                </h2>
                <p className="text-slate-600">Review and moderate community answers</p>
              </div>

              <div className="grid gap-6">
                {answers.map((answer) => (
                  <motion.div
                    key={answer.id}
                    className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-purple-100"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <p className="text-slate-800 mb-2">{answer.content}</p>
                        <div className="flex items-center space-x-4 text-sm text-slate-600">
                          <span>By {answer.author}</span>
                          <span>•</span>
                          <span>{answer.createdAt}</span>
                          <span>•</span>
                          <span className="text-purple-600 font-medium">{answer.questionTitle}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-slate-600">
                          <TrendingUp className="w-4 h-4" />
                          <span>{answer.votes}</span>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete('answer', answer.id)}
                            className="p-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  Comment Management
                </h2>
                <p className="text-slate-600">Monitor community discussions and comments</p>
              </div>

              <div className="grid gap-4">
                {comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-purple-100"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-slate-800 mb-2">{comment.content}</p>
                        <div className="flex items-center space-x-3 text-sm text-slate-600">
                          <span>By {comment.author}</span>
                          <span>•</span>
                          <span>{comment.createdAt}</span>
                          <span>•</span>
                          <span className="text-purple-600">{comment.linkedTitle}</span>
                          <span className="px-2 py-1 bg-slate-100 rounded-full text-xs">
                            {comment.linkedType}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete('comment', comment.id)}
                        className="p-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Tags Tab */}
          {activeTab === 'tags' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Tag Management
                  </h2>
                  <p className="text-slate-600">Organize and moderate content tags</p>
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all">
                  <Plus className="w-4 h-4" />
                  <span>Add Tag</span>
                </button>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-purple-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-purple-50 border-b border-purple-100">
                      <tr>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700">Tag Name</th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700">Usage Count</th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700">Status</th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700">Created</th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tags.map((tag) => (
                        <tr key={tag.id} className="border-b border-purple-50 hover:bg-purple-50 transition-colors">
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 rounded-full text-sm font-medium">
                              {tag.name}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-slate-600">{tag.usageCount}</td>
                          <td className="py-4 px-6">
                            <button
                              onClick={() => toggleTagApproval(tag.id)}
                              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                                tag.approved 
                                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 hover:from-green-200 hover:to-emerald-200' 
                                  : 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 hover:from-yellow-200 hover:to-orange-200'
                              }`}
                            >
                              {tag.approved ? 'Approved' : 'Pending'}
                            </button>
                          </td>
                          <td className="py-4 px-6 text-slate-600">{tag.createdAt}</td>
                          <td className="py-4 px-6">
                            <div className="flex space-x-2">
                              <button className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete('tag', tag.id)}
                                className="p-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Confirm Deletion</h3>
                  <p className="text-slate-600">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete this {deleteTarget?.type}? This will permanently remove it from the system.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};