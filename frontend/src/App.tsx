import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import { HeroSection } from './components/HeroSection';
import { SearchBar } from './components/SearchBar';
import { TagFilter } from './components/TagFilter';
import { QuestionCard } from './components/QuestionCard';
import { FloatingActionButton } from './components/FloatingActionButton';
import { AskQuestionPage } from './components/AskQuestionPage';
import { QuestionDetailPage } from './components/QuestionDetailPage';
import { Navbar } from './components/Navbar';
import { UserProfilePage } from './components/UserProfilePage';
import { NotificationsPage } from './components/NotificationsPage';
import { AdminDashboard } from './components/AdminDashboard';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { fetchTags } from './api/tags';
import { fetchQuestions } from './api/questions';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<'home' | 'ask' | 'question' | 'profile' | 'notifications' | 'admin' | 'login' | 'signup'>('home');
  const [user, setUser] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<any[]>([]);
  const questionsSectionRef = useRef<HTMLDivElement>(null);

  const filteredQuestions = useMemo(() => {
    return questions.filter(question => {
      const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (question.tags && question.tags.some((tag: any) => (tag.name || tag).toLowerCase().includes(searchTerm.toLowerCase())));
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.some(tag => question.tags && question.tags.map((t: any) => t.name || t).includes(tag));
      return matchesSearch && matchesTags;
    });
  }, [questions, searchTerm, selectedTags]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleLogin = (userData: any) => {
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
    setUser(userData);
    setCurrentPage('home');
  };

  const handleSignup = (userData: any) => {
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
    setUser(userData);
    setCurrentPage('home');
  };

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('token');
    setUser(null);
    setCurrentPage('home');
  };

  const navigateToLogin = () => {
    setCurrentPage('login');
  };

  const navigateToSignup = () => {
    setCurrentPage('signup');
  };

  const handleStartExploring = () => setCurrentPage('ask');
  const handleViewQuestions = () => {
    if (questionsSectionRef.current) {
      questionsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      // Optionally decode the token for user info, or just set a dummy user object
      setUser({ token }); // You can expand this with more info if you decode the JWT
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        handleLogout();
      }
    }, 1000); // check every second
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    fetchQuestions()
      .then(data => {
        // Map backend data to frontend format
        setQuestions(data.map((q: any) => ({
          ...q,
          author: { username: q.authorUsername, avatar: null },
          answerCount: q.totalAnswers,
          acceptedAnswerId: q.acceptedAnswerId,
        })));
      })
      .catch(() => setQuestions([]))
      .finally(() => setLoadingQuestions(false));
  }, []);

  useEffect(() => {
    fetchTags()
      .then(data => setAvailableTags(data.map((t: any) => t.name || t)))
      .catch(() => setAvailableTags([]));
  }, []);

  // Show login page
  if (currentPage === 'login') {
    return (
      <LoginPage
        onLogin={handleLogin}
        onNavigateToSignup={navigateToSignup}
      />
    );
  }

  // Show signup page
  if (currentPage === 'signup') {
    return (
      <SignupPage
        onSignup={handleSignup}
        onNavigateToLogin={navigateToLogin}
      />
    );
  }

  // Redirect to login if not authenticated and trying to access protected pages
  if (!user && ['ask', 'question', 'profile', 'notifications', 'admin'].includes(currentPage)) {
    return (
      <LoginPage
        onLogin={handleLogin}
        onNavigateToSignup={navigateToSignup}
      />
    );
  }

  if (currentPage === 'ask') {
    return (
      <div className="min-h-screen bg-white">
        <Navbar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          user={user}
          onLogin={navigateToLogin}
          onSignup={navigateToSignup}
          onLogout={handleLogout}
        />
        <AskQuestionPage />
      </div>
    );
  }

  if (currentPage === 'question') {
    if (!selectedQuestionId) {
      return <div className="text-center py-12 text-lg text-red-500">No question selected.</div>;
    }
    return (
      <div className="min-h-screen bg-white">
        <Navbar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          user={user}
          onLogin={navigateToLogin}
          onSignup={navigateToSignup}
          onLogout={handleLogout}
        />
        <QuestionDetailPage questionId={selectedQuestionId} />
      </div>
    );
  }

  if (currentPage === 'profile') {
    return (
      <div className="min-h-screen bg-white">
        <Navbar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          user={user}
          onLogin={navigateToLogin}
          onSignup={navigateToSignup}
          onLogout={handleLogout}
        />
        <UserProfilePage setCurrentPage={setCurrentPage} />
      </div>
    );
  }

  if (currentPage === 'notifications') {
    return (
      <div className="min-h-screen bg-white">
        <Navbar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          user={user}
          onLogin={navigateToLogin}
          onSignup={navigateToSignup}
          onLogout={handleLogout}
        />
        <NotificationsPage />
      </div>
    );
  }

  if (currentPage === 'admin') {
    return (
      <AdminDashboard />
    );
  }
  return (
    <div className="min-h-screen bg-white">
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        user={user}
        onLogin={navigateToLogin}
        onSignup={navigateToSignup}
        onLogout={handleLogout}
      />

      {/* Show different content based on auth state */}
      {user ? (
        <>
          {/* Hero Section */}
          <HeroSection onStartExploring={handleStartExploring} onViewQuestions={handleViewQuestions} />

          {/* Main Content */}
          <main ref={questionsSectionRef} className="max-w-6xl mx-auto px-4 py-8">
            {/* Search Section */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            </motion.div>

            {/* Tag Filter */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Filter by Tags</h2>
              <TagFilter
                tags={availableTags}
                selectedTags={selectedTags}
                onTagToggle={handleTagToggle}
              />
            </motion.div>

            {/* Results Header */}
            <motion.div
              className="flex justify-between items-center mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <h2 className="text-2xl font-bold text-gray-900">
                Recent Questions
                <span className="text-[#1f0d38] ml-2">({filteredQuestions.length})</span>
              </h2>
            </motion.div>

            {/* Questions Feed */}
            {loadingQuestions ? (
              <div className="text-center py-12 text-lg text-gray-500">Loading questions...</div>
            ) : (
              <div className="space-y-6">
                {filteredQuestions.length > 0 ? (
                  filteredQuestions.map((question, index) => (
                    <div key={question.id} onClick={() => {
                      if (question.id) {
                        setSelectedQuestionId(question.id);
                        setCurrentPage('question');
                      }
                    }}>
                      <QuestionCard
                        question={question}
                        index={index}
                      />
                    </div>
                  ))
                ) : (
                  <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p className="text-gray-500 text-lg">No questions found matching your criteria.</p>
                    <p className="text-gray-400 mt-2">Try adjusting your search or tags.</p>
                  </motion.div>
                )}
              </div>
            )}
          </main>

          {/* Floating Action Button */}
          <div onClick={() => setCurrentPage('ask')}>
            <FloatingActionButton />
          </div>
        </>
      ) : (
        <>
          {/* Hero Section for non-authenticated users */}
          <HeroSection />

          {/* Public content or call-to-action */}
          <main className="max-w-6xl mx-auto px-4 py-8">
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Join StackIt Community
              </h2>
              <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                Connect with thousands of developers, ask questions, share knowledge, and grow together.
              </p>
              <div className="flex gap-4 justify-center">
                <motion.button
                  onClick={navigateToSignup}
                  className="bg-gradient-to-r from-[#1f0d38] to-purple-600 hover:from-[#2d1b4e] hover:to-purple-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started Free
                </motion.button>
                <motion.button
                  onClick={navigateToLogin}
                  className="border-2 border-[#1f0d38] text-[#1f0d38] hover:bg-[#1f0d38] hover:text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign In
                </motion.button>
              </div>
            </motion.div>
          </main>
        </>
      )}

      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-[#1f0d38]/10 rounded-full opacity-20"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 bg-[#1f0d38]/20 rounded-full opacity-30"
          animate={{
            y: [0, 20, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-20 h-20 bg-[#1f0d38]/30 rounded-full opacity-25"
          animate={{
            y: [0, -25, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}

export default App;