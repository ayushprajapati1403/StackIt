import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export const FloatingActionButton: React.FC = () => {
  return (
    <motion.button
      className="fixed bottom-8 right-8 bg-gradient-to-r from-[#1f0d38] to-[#2d1b4e] text-white p-4 rounded-full shadow-2xl hover:shadow-[#1f0d38]/50 transition-all duration-300 z-50"
      whileHover={{ scale: 1.1, rotate: 90 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <Plus className="w-6 h-6" />
      <span className="sr-only">Ask Question</span>
    </motion.button>
  );
};