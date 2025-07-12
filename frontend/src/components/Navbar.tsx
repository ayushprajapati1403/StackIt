import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Home, Plus, User, Search, Bell, Settings, LogIn, UserPlus, LogOut } from 'lucide-react';

interface User {
  username: string;
  role: string;
}

interface NavbarProps {
  currentPage: 'home' | 'ask' | 'question' | 'profile' | 'notifications' | 'admin';
  onNavigate: (page: 'home' | 'ask' | 'question' | 'profile' | 'notifications' | 'admin') => void;
  user: User | null;
  onLogin: () => void;
  onSignup: () => void;
  onLogout: () => void;
  unreadCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  user,
  onLogin,
  onSignup,
  onLogout,
  unreadCount = 0
}) => {
  return (
    <motion.nav
      className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate('home')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative">
              <Brain className="w-8 h-8 text-[#1f0d38]" />
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1f0d38]">StackIt</h1>
              <p className="text-xs text-gray-500 -mt-1">Find Your Answers</p>
            </div>
          </motion.div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search questions..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1f0d38] focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-6">
            {user ? (
              <>
                <motion.button
                  onClick={() => onNavigate('home')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${currentPage === 'home'
                    ? 'bg-[#1f0d38] text-white shadow-lg'
                    : 'text-gray-600 hover:text-[#1f0d38] hover:bg-gray-50'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Home</span>
                </motion.button>

                <motion.button
                  onClick={() => onNavigate('ask')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${currentPage === 'ask'
                    ? 'bg-[#1f0d38] text-white shadow-lg'
                    : 'text-gray-600 hover:text-[#1f0d38] hover:bg-gray-50'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Ask</span>
                </motion.button>

                {/* Notification Bell */}
                <motion.button
                  onClick={() => onNavigate('notifications')}
                  className="relative p-2 text-gray-600 hover:text-[#1f0d38] hover:bg-gray-50 rounded-xl transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[1.2rem] h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1.5 shadow-lg">
                      {unreadCount}
                    </span>
                  )}
                </motion.button>

                {/* Settings */}
                {user.role === 'ADMIN' && (
                  <motion.button
                    onClick={() => onNavigate('admin')}
                    className="p-2 text-gray-600 hover:text-[#1f0d38] hover:bg-gray-50 rounded-xl transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Settings className="w-5 h-5" />
                  </motion.button>
                )}

                {/* User Profile */}
                <motion.div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => onNavigate('profile')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-200">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-900">{user.username}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                </motion.div>
                {/* Logout Button */}
                <motion.button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </motion.button>
              </>
            ) : (
              <>
                {/* Login Button */}
                <motion.button
                  onClick={onLogin}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-[#1f0d38] hover:bg-gray-50 rounded-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogIn className="w-5 h-5" />
                  <span className="font-medium">Sign In</span>
                </motion.button>
                {/* Signup Button */}
                <motion.button
                  onClick={onSignup}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1f0d38] text-white rounded-xl transition-all duration-300 hover:bg-[#2d1b4e] shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <UserPlus className="w-5 h-5" />
                  <span className="font-medium">Sign Up</span>
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};