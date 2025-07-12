import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Users, MessageSquare, Trophy, Sparkles, Code, Lightbulb } from 'lucide-react';

interface HeroSectionProps {
  onStartExploring?: () => void;
  onViewQuestions?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartExploring, onViewQuestions }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#1f0d38] via-[#2d1b4e] to-[#1f0d38] text-white py-20 px-4 min-h-screen flex items-center">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #ffffff 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, #ffffff 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Floating Background Elements */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-40 h-40 bg-pink-500/20 rounded-full blur-xl"
        animate={{
          y: [0, 40, 0],
          x: [0, -25, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="flex items-center gap-3 mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
              >
                <div className="relative">
                  <Brain className="w-12 h-12 text-purple-300" />
                  <motion.div
                    className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-3 h-3 text-yellow-800 m-0.5" />
                  </motion.div>
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold">StackIt</h1>
                  <p className="text-purple-300 text-sm">Where Knowledge Grows</p>
                </div>
              </motion.div>

              <h2 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                Ask, Learn,
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent block">
                  Innovate
                </span>
              </h2>
              <p className="text-xl text-purple-200 mb-8 leading-relaxed">
                Join the most vibrant community of developers, designers, and innovators.
                Get instant answers, share breakthrough insights, and accelerate your learning journey.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-4"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <Users className="w-8 h-8 text-purple-300 mx-auto mb-2" />
                <div className="text-2xl font-bold">15K+</div>
                <div className="text-sm text-purple-300">Active Members</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <MessageSquare className="w-8 h-8 text-purple-300 mx-auto mb-2" />
                <div className="text-2xl font-bold">75K+</div>
                <div className="text-sm text-purple-300">Questions Solved</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <Trophy className="w-8 h-8 text-purple-300 mx-auto mb-2" />
                <div className="text-2xl font-bold">98%</div>
                <div className="text-sm text-purple-300">Success Rate</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-4"
            >
              <button
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 flex items-center gap-2"
                onClick={onStartExploring}
              >
                <Lightbulb className="w-5 h-5" />
                Start Exploring
              </button>
              <button
                className="border-2 border-purple-400 text-purple-300 hover:bg-purple-400 hover:text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center gap-2"
                onClick={onViewQuestions}
              >
                <Code className="w-5 h-5" />
                View Questions
              </button>
            </motion.div>
          </motion.div>

          {/* Right Content - Enhanced 3D Scene */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative h-[600px]"
          >
            {/* Main Hero Images */}
            <div className="relative z-10 h-full">
              <motion.div
                className="absolute top-0 left-0 w-80 h-64 rounded-3xl overflow-hidden shadow-2xl"
                initial={{ scale: 0.8, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <img
                  src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Team collaboration"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1f0d38]/60 to-transparent" />
              </motion.div>

              <motion.div
                className="absolute bottom-0 right-0 w-72 h-56 rounded-3xl overflow-hidden shadow-2xl"
                initial={{ scale: 0.8, rotate: 5 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.7, type: "spring" }}
              >
                <img
                  src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Developer workspace"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1f0d38]/60 to-transparent" />
              </motion.div>
            </div>

            {/* Enhanced 3D Floating Objects */}
            <motion.div
              className="absolute top-16 -left-8 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl shadow-2xl"
              animate={{
                y: [0, -25, 0],
                rotate: [0, 15, 0],
                rotateY: [0, 180, 360],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                transform: 'perspective(1000px) rotateX(15deg) rotateY(-15deg)',
              }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <Brain className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            <motion.div
              className="absolute bottom-20 -right-12 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl shadow-2xl"
              animate={{
                y: [0, 20, 0],
                x: [0, 15, 0],
                rotate: [0, -20, 0],
                rotateX: [0, 360, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                transform: 'perspective(1000px) rotateX(-10deg) rotateY(20deg)',
              }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <MessageSquare className="w-10 h-10 text-white" />
              </div>
            </motion.div>

            <motion.div
              className="absolute top-1/2 -right-16 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-2xl"
              animate={{
                y: [0, -15, 0],
                rotate: [0, 25, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                transform: 'perspective(1000px) rotateX(20deg) rotateY(-10deg)',
              }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            {/* Additional floating particles */}
            <motion.div
              className="absolute top-12 right-12 w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl shadow-lg"
              animate={{
                y: [0, -30, 0],
                scale: [1, 1.3, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
            </motion.div>

            <motion.div
              className="absolute bottom-1/3 -left-6 w-10 h-10 bg-gradient-to-br from-pink-400 to-red-500 rounded-full shadow-lg"
              animate={{
                x: [0, 25, 0],
                y: [0, -20, 0],
                rotate: [0, -180, -360],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </motion.div>

            <motion.div
              className="absolute top-1/3 left-1/4 w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg shadow-lg"
              animate={{
                y: [0, -35, 0],
                x: [0, 20, 0],
                rotateZ: [0, 360, 0],
              }}
              transition={{
                duration: 14,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};