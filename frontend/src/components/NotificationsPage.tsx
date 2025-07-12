import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  MessageCircle, 
  AtSign, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  Check,
  X,
  Filter,
  Search,
  MoreVertical,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'answered' | 'commented' | 'mentioned' | 'accepted' | 'voted';
  message: string;
  createdAt: string;
  isRead: boolean;
  metadata: {
    questionId?: string;
    answerId?: string;
    userId?: string;
    username?: string;
  };
  avatar?: string;
}

// Mock data - replace with actual API calls
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'answered',
    message: '@sarahcode answered your question: "How to implement JWT authentication?"',
    createdAt: '2024-01-15T10:30:00Z',
    isRead: false,
    metadata: { questionId: 'q1', userId: 'u2', username: 'sarahcode' },
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: '2',
    type: 'commented',
    message: '@mikejs commented on your answer about React hooks',
    createdAt: '2024-01-15T09:15:00Z',
    isRead: false,
    metadata: { answerId: 'a1', userId: 'u3', username: 'mikejs' },
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: '3',
    type: 'mentioned',
    message: '@emmaweb mentioned you in an answer about CSS Grid layouts',
    createdAt: '2024-01-15T08:45:00Z',
    isRead: true,
    metadata: { answerId: 'a2', userId: 'u4', username: 'emmaweb' },
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: '4',
    type: 'accepted',
    message: '@alexdev accepted your answer about Node.js performance optimization',
    createdAt: '2024-01-14T22:20:00Z',
    isRead: true,
    metadata: { answerId: 'a3', userId: 'u1', username: 'alexdev' },
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: '5',
    type: 'voted',
    message: '5 people upvoted your answer about TypeScript generics',
    createdAt: '2024-01-14T18:30:00Z',
    isRead: true,
    metadata: { answerId: 'a4' }
  },
  {
    id: '6',
    type: 'commented',
    message: '@rachelreact commented on your question about async operations',
    createdAt: '2024-01-14T15:10:00Z',
    isRead: true,
    metadata: { questionId: 'q2', userId: 'u5', username: 'rachelreact' },
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: '7',
    type: 'answered',
    message: '@davidstyles answered your question: "CSS Grid vs Flexbox comparison"',
    createdAt: '2024-01-14T12:45:00Z',
    isRead: true,
    metadata: { questionId: 'q3', userId: 'u6', username: 'davidstyles' },
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  }
];

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'answered' | 'commented' | 'mentioned'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const timeAgo = (date: string) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'answered':
        return <MessageCircle className="w-5 h-5" />;
      case 'commented':
        return <MessageCircle className="w-5 h-5" />;
      case 'mentioned':
        return <AtSign className="w-5 h-5" />;
      case 'accepted':
        return <CheckCircle className="w-5 h-5" />;
      case 'voted':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'answered':
        return 'bg-blue-100 text-blue-600';
      case 'commented':
        return 'bg-yellow-100 text-yellow-600';
      case 'mentioned':
        return 'bg-purple-100 text-purple-600';
      case 'accepted':
        return 'bg-green-100 text-green-600';
      case 'voted':
        return 'bg-pink-100 text-pink-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const markAllAsRead = async () => {
    // API call: POST /api/notifications/mark-read
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    
    // Redirect based on metadata
    if (notification.metadata.questionId) {
      // Navigate to question
      console.log('Navigate to question:', notification.metadata.questionId);
    } else if (notification.metadata.answerId) {
      // Navigate to answer
      console.log('Navigate to answer:', notification.metadata.answerId);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !notification.isRead) ||
                         notification.type === filter;
    
    const matchesSearch = notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const filterOptions = [
    { value: 'all', label: 'All', count: notifications.length },
    { value: 'unread', label: 'Unread', count: unreadCount },
    { value: 'answered', label: 'Answered', count: notifications.filter(n => n.type === 'answered').length },
    { value: 'commented', label: 'Comments', count: notifications.filter(n => n.type === 'commented').length },
    { value: 'mentioned', label: 'Mentions', count: notifications.filter(n => n.type === 'mentioned').length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-200"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
              >
                <div className="p-3 bg-gradient-to-br from-[#1f0d38] to-purple-600 rounded-2xl">
                  <Bell className="w-8 h-8 text-white" />
                </div>
                {unreadCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    {unreadCount}
                  </motion.div>
                )}
              </motion.div>
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600">
                  {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {unreadCount > 0 && (
                <motion.button
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-green-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Check className="w-5 h-5" />
                  Mark all as read
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl p-6 mb-8 border border-gray-200"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1f0d38] focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto">
              {filterOptions.map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() => setFilter(option.value as any)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${
                    filter === option.value
                      ? 'bg-[#1f0d38] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {option.label}
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    filter === option.value
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {option.count}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Notifications List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden"
        >
          {filteredNotifications.length > 0 ? (
            <div className="divide-y divide-gray-100">
              <AnimatePresence>
                {filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`relative p-6 hover:bg-gray-50 transition-all duration-300 cursor-pointer group ${
                      !notification.isRead ? 'bg-blue-50/30' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {/* Unread Indicator */}
                    {!notification.isRead && (
                      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}

                    <div className="flex items-start gap-4 ml-4">
                      {/* Icon */}
                      <div className={`p-2 rounded-xl ${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Avatar */}
                      {notification.avatar && (
                        <img
                          src={notification.avatar}
                          alt="User"
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                        />
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-gray-900 leading-relaxed ${
                          !notification.isRead ? 'font-semibold' : 'font-medium'
                        }`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {timeAgo(notification.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {!notification.isRead && (
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Mark as read"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                        )}
                        
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Delete notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>

                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-12 text-center"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try adjusting your search terms' : 'You\'re all caught up!'}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Stats Footer */}
        {filteredNotifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-500">
              Showing {filteredNotifications.length} of {notifications.length} notifications
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};