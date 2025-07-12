import React from 'react';
import { motion } from 'framer-motion';

interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({ tags, selectedTags, onTagToggle }) => {
  const tagColors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-red-100 text-red-800',
    'bg-yellow-100 text-yellow-800',
    'bg-indigo-100 text-indigo-800',
    'bg-pink-100 text-pink-800',
    'bg-teal-100 text-teal-800',
  ];

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {tags.map((tag, index) => {
        const isSelected = selectedTags.includes(tag);
        const colorClass = tagColors[index % tagColors.length];
        
        return (
          <motion.button
            key={tag}
            onClick={() => onTagToggle(tag)}
            className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              isSelected 
                ? 'bg-[#1f0d38] text-white shadow-lg scale-105' 
                : `${colorClass} hover:scale-105`
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tag}
          </motion.button>
        );
      })}
    </div>
  );
};