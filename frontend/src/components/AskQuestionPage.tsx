import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  ChevronRight, 
  Rocket,
  Brain,
  Code,
  Lightbulb,
  X,
  Plus,
  Search
} from 'lucide-react';
import { WYSIWYGEditor } from './WYSIWYGEditor';

interface Tag {
  id: string;
  name: string;
  color: string;
}

const availableTags: Tag[] = [
  { id: '1', name: 'react', color: 'bg-blue-100 text-blue-800' },
  { id: '2', name: 'typescript', color: 'bg-green-100 text-green-800' },
  { id: '3', name: 'javascript', color: 'bg-yellow-100 text-yellow-800' },
  { id: '4', name: 'nodejs', color: 'bg-red-100 text-red-800' },
  { id: '5', name: 'css', color: 'bg-purple-100 text-purple-800' },
  { id: '6', name: 'authentication', color: 'bg-indigo-100 text-indigo-800' },
  { id: '7', name: 'performance', color: 'bg-pink-100 text-pink-800' },
  { id: '8', name: 'hooks', color: 'bg-teal-100 text-teal-800' },
];

export const AskQuestionPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [tagSearch, setTagSearch] = useState('');
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  const filteredTags = availableTags.filter(tag => 
    tag.name.toLowerCase().includes(tagSearch.toLowerCase()) &&
    !selectedTags.find(selected => selected.id === tag.id)
  );

  const addTag = (tag: Tag) => {
    setSelectedTags([...selectedTags, tag]);
    setTagSearch('');
    setShowTagDropdown(false);
  };

  const removeTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter(tag => tag.id !== tagId));
  };

  const handleSubmit = () => {
    console.log({
      title,
      description,
      tags: selectedTags.map(tag => tag.name)
    });
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Floating 3D Objects */}
      <motion.div
        className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-br from-[#1f0d38] to-purple-500 rounded-2xl shadow-lg opacity-20"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 15, 0],
          rotateY: [0, 180, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          transform: 'perspective(1000px) rotateX(15deg)',
        }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <Brain className="w-8 h-8 text-white" />
        </div>
      </motion.div>

      <motion.div
        className="absolute top-40 right-20 w-12 h-12 bg-gradient-to-br from-blue-400 to-[#1f0d38] rounded-full shadow-lg opacity-20"
        animate={{
          y: [0, 25, 0],
          x: [0, -15, 0],
          rotate: [0, -20, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          transform: 'perspective(1000px) rotateX(-10deg)',
        }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <Code className="w-6 h-6 text-white" />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-1/4 w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg shadow-lg opacity-20"
        animate={{
          y: [0, -30, 0],
          rotate: [0, 25, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          transform: 'perspective(1000px) rotateY(20deg)',
        }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <Lightbulb className="w-7 h-7 text-white" />
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Page Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Ask Your Question</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share your knowledge challenge with our community of experts and get the answers you need.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form - Left Side */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
              {/* Title Input */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  Question Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., How to implement JWT auth in Node.js?"
                  className="w-full px-6 py-4 text-xl border-2 border-gray-200 rounded-2xl focus:border-[#1f0d38] focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                />
              </div>

              {/* Rich Text Editor */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  Detailed Description
                </label>
                
                <WYSIWYGEditor
                  value={description}
                  onChange={setDescription}
                  placeholder="Provide detailed information about your question. Include what you've tried, expected results, and any error messages..."
                  minHeight="300px"
                />
              </div>
            </div>
          </motion.div>

          {/* Sidebar - Right Side */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            {/* Tag Selector */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              
              {/* Selected Tags */}
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedTags.map((tag) => (
                    <motion.span
                      key={tag.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`${tag.color} px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2`}
                    >
                      {tag.name}
                      <button
                        onClick={() => removeTag(tag.id)}
                        className="hover:bg-black/10 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.span>
                  ))}
                </div>
              )}

              {/* Tag Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={tagSearch}
                  onChange={(e) => {
                    setTagSearch(e.target.value);
                    setShowTagDropdown(true);
                  }}
                  onFocus={() => setShowTagDropdown(true)}
                  placeholder="Search tags..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1f0d38] focus:outline-none transition-all duration-300"
                />
              </div>

              {/* Tag Dropdown */}
              {showTagDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto"
                >
                  {filteredTags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => addTag(tag)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <span className={`${tag.color} px-2 py-1 rounded-full text-xs font-medium`}>
                        {tag.name}
                      </span>
                    </button>
                  ))}
                  {filteredTags.length === 0 && tagSearch && (
                    <div className="px-4 py-3 text-gray-500 text-center">
                      <p>No matching tags found</p>
                      <button className="text-[#1f0d38] hover:underline mt-1 flex items-center gap-1 mx-auto">
                        <Plus className="w-3 h-3" />
                        Suggest "{tagSearch}" as new tag
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-[#1f0d38] to-purple-600 rounded-3xl shadow-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">💡 Tips for Great Questions</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0"></span>
                  Be specific and clear in your title
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0"></span>
                  Include relevant code examples
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0"></span>
                  Add appropriate tags for visibility
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0"></span>
                  Describe what you've already tried
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Submit Button */}
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <motion.button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-[#1f0d38] to-purple-600 hover:from-[#2d1b4e] hover:to-purple-700 text-white px-12 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#1f0d38]/25 flex items-center gap-3 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Rocket className="w-5 h-5" />
            🚀 Post My Question
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};