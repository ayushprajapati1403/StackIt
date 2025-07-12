import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ArrowUp, CheckCircle, Clock, User } from 'lucide-react';
import { Question } from '../types/Question';

interface QuestionCardProps {
  question: Question;
  index: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, index }) => {
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
    'bg-yellow-100 text-yellow-800',
    'bg-indigo-100 text-indigo-800',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, shadow: "0 20px 40px rgba(0,0,0,0.1)" }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      <div className="flex justify-between items-start mb-4">
        <motion.h3
          className="text-xl font-bold text-gray-900 hover:text-[#1f0d38] cursor-pointer transition-colors duration-200 flex-1 mr-4"
          whileHover={{ scale: 1.02 }}
        >
          {question.title}
        </motion.h3>

        {question.acceptedAnswerId && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
          >
            <CheckCircle className="w-3 h-3" />
            Solved
          </motion.div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {question.tags.map((tag: any, tagIndex: number) => (
          <span
            key={tag.id || tag.name || tagIndex}
            className={`px-3 py-1 rounded-full text-xs font-medium ${tagColors[tagIndex % tagColors.length]}`}
          >
            {typeof tag === 'string' ? tag : tag.name}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="w-5 h-5 text-gray-500" />
          </div>
          <span className="text-sm font-medium text-gray-700">
            {question.author?.username || 'User'}
          </span>
        </div>

        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <Clock className="w-4 h-4" />
          {timeAgo(question.createdAt)}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            className="flex items-center gap-1 text-gray-600"
            whileHover={{ scale: 1.1 }}
          >
            <ArrowUp className="w-4 h-4" />
            <span className="text-sm font-medium">{question.votes}</span>
          </motion.div>

          <motion.div
            className="flex items-center gap-1 text-gray-600"
            whileHover={{ scale: 1.1 }}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{question.answerCount}</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};