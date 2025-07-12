import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Rocket,
  Brain,
  Code,
  Lightbulb,
  X,
  Plus,
  Search
} from 'lucide-react';
import { WYSIWYGEditor } from './WYSIWYGEditor';
import { postQuestion } from '../api/questions';
import { suggestTags } from '../api/tags';

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

interface AskQuestionPageProps {
  setCurrentPage: (page: 'home' | 'ask' | 'question' | 'profile' | 'notifications' | 'admin' | 'login' | 'signup') => void;
}

export const AskQuestionPage: React.FC<AskQuestionPageProps> = ({ setCurrentPage }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);
  const [tagSearch, setTagSearch] = useState('');
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const handleSuggestTags = async () => {
    setSuggestLoading(true);
    setSuggestError(null);
    try {
      const tags = await suggestTags({ title, description });
      setSuggestedTags(tags);
    } catch (err) {
      setSuggestError((err as { message?: string }).message || 'Failed to suggest tags');
      setSuggestedTags([]);
    } finally {
      setSuggestLoading(false);
    }
  };

  const handleAddSuggestedTag = (tagName: string) => {
    if (!selectedTags.find(t => t.name === tagName)) {
      setSelectedTags([...selectedTags, { id: tagName, name: tagName, color: '' }]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSuccess(null);
    setError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to post a question.');
      setLoading(false);
      return;
    }
    try {
      await postQuestion({
        title,
        description,
        tags: selectedTags.map(tag => tag.name),
        token
      });
      setSuccess('Question posted successfully!');
      setTitle('');
      setDescription('');
      setSelectedTags([]);
      setTimeout(() => {
        setCurrentPage('home');
      }, 1500);
    } catch {
      setError('Failed to post question. Please try again.');
    } finally {
      setLoading(false);
    }
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

      {/* Toast notification */}
      {success && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 text-lg font-semibold animate-fade-in">
          {success}
        </div>
      )}

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
              <h2 className="block text-lg font-semibold text-gray-900 mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedTags.map(tag => (
                  <span key={tag.id} className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {tag.name}
                    <button onClick={() => removeTag(tag.id)} className="ml-2 text-blue-600 hover:text-blue-900">&times;</button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={tagSearch}
                    onChange={e => setTagSearch(e.target.value)}
                    onFocus={() => setShowTagDropdown(true)}
                    placeholder="Search or add tags..."
                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1f0d38]"
                  />
                  {showTagDropdown && filteredTags.length > 0 && (
                    <div className="absolute z-10 bg-white border rounded-xl shadow-lg mt-1 w-full max-h-40 overflow-y-auto">
                      {filteredTags.map(tag => (
                        <div
                          key={tag.id}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                          onClick={() => addTag(tag)}
                        >
                          {tag.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="px-4 py-2 bg-gradient-to-r from-[#1f0d38] to-purple-600 text-white rounded-xl font-semibold hover:from-[#2d1b4e] hover:to-purple-700 transition-all duration-300 disabled:opacity-60"
                  onClick={handleSuggestTags}
                  disabled={suggestLoading || !title || !description}
                >
                  {suggestLoading ? 'Suggesting...' : 'Suggest Tags (AI)'}
                </button>
              </div>
              {suggestError && <div className="text-red-600 mb-2">{suggestError}</div>}
              {suggestedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-sm text-gray-600 mr-2">Suggestions:</span>
                  {suggestedTags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                      onClick={() => handleAddSuggestedTag(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
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
          {success && <div className="mb-4 text-green-600 font-semibold">{success}</div>}
          {error && <div className="mb-4 text-red-600 font-semibold">{error}</div>}
          <motion.button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-[#1f0d38] to-purple-600 hover:from-[#2d1b4e] hover:to-purple-700 text-white px-12 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#1f0d38]/25 flex items-center gap-3 mx-auto disabled:opacity-60 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? (
              <span>Posting...</span>
            ) : (
              <>
                <Rocket className="w-5 h-5" />
                🚀 Post My Question
              </>
            )}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};