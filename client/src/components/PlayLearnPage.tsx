import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Sentry from '@sentry/react';
import { 
  Play, 
  BookOpen, 
  Code, 
  Users, 
  Zap, 
  Crown, 
  Star, 
  Trophy, 
  Target, 
  TrendingUp,
  ArrowRight,
  Sparkles,
  Brain,
  Gamepad2,
  Mic,
  Video,
  Globe,
  Settings,
  User,
  LogOut,
  ChevronRight,
  Award,
  Clock,
  BarChart3,
  Loader2,
  AlertCircle,
  CheckCircle,
  Lock,
  Unlock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { hasActiveSubscription } from '../lib/paypal.js';
import { getCurrentUserId, isUserAuthenticated, safeJsonParse } from '../lib/authUtils';
import { supabaseHelpers } from '../lib/apiClient';
import confetti from 'canvas-confetti';

/**
 * Play & Learn Page Component
 * Main hub for educational activities and premium features
 * Integrates with PayPal for subscription management
 */
const PlayLearnPage: React.FC = () => {
  const navigate = useNavigate();

  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userStats, setUserStats] = useState({
    totalProblems: 0,
    accuracy: 0,
    streak: 0,
    achievements: 0,
    recentActivity: []
  });
  const [error, setError] = useState<string | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  /**
   * Initialize page data
   */
  useEffect(() => {
    initializePage();
  }, []);

  /**
   * Initialize page with user data and subscription status
   */
  const initializePage = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check authentication status
      const authStatus = await isUserAuthenticated();
      setIsAuthenticated(authStatus);

      // Check premium subscription with error handling
      await checkPremiumSubscription();

      // Load user statistics if authenticated
      if (authStatus) {
        await loadUserStats();
      } else {
        // Set default stats for non-authenticated users
        setUserStats({
          totalProblems: 0,
          accuracy: 0,
          streak: 0,
          achievements: 0,
          recentActivity: []
        });
      }

    } catch (error) {
      console.error('Failed to initialize page:', error);
      Sentry.captureException(error);
      setError('Failed to load page data. Please refresh and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Check premium subscription status with robust error handling
   */
  const checkPremiumSubscription = async () => {
    try {
      const premiumStatus = await hasActiveSubscription();
      setIsPremium(premiumStatus);
    } catch (error) {
      console.error('Failed to check premium subscription:', error);
      Sentry.captureException(error);
      // Default to non-premium on error
      setIsPremium(false);
    }
  };

  /**
   * Load user statistics with error handling
   */
  const loadUserStats = async () => {
    try {
      const userId = await getCurrentUserId();

      // Only attempt to load stats for authenticated users
      const authStatus = await isUserAuthenticated();
      if (!authStatus) {
        console.log('User not authenticated, skipping stats load');
        return;
      }

      // Load achievements using our API client
      const achievements = await supabaseHelpers.getUserAchievements(userId);

      // Load progress using our API client
      const progress = await supabaseHelpers.getUserProgress(userId);

      // Calculate stats from loaded data
      const totalProblems = progress?.reduce((sum, p) => sum + (p.total_attempted || 0), 0) || 0;
      const totalCorrect = progress?.reduce((sum, p) => sum + (p.total_correct || 0), 0) || 0;
      const accuracy = totalProblems > 0 ? Math.round((totalCorrect / totalProblems) * 100) : 0;
      const maxStreak = progress?.reduce((max, p) => Math.max(max, p.streak_days || 0), 0) || 0;

      setUserStats({
        totalProblems,
        accuracy,
        streak: maxStreak,
        achievements: achievements?.length || 0,
        recentActivity: progress?.slice(0, 5) || []
      });

    } catch (error) {
      console.error('Failed to load user stats:', error);
      Sentry.captureException(error);
      // Set default stats on error
      setUserStats({
        totalProblems: 0,
        accuracy: 0,
        streak: 0,
        achievements: 0,
        recentActivity: []
      });
    }
  };

  /**
   * Handle feature access (all features are free)
   */
  const handleFeatureAccess = (feature: string) => {
    // Navigate to feature - all features are free
    switch (feature) {
      case 'ar-problems':
        navigate('/ar-problems');
        break;
      case 'live-code':
        navigate('/live-code');
        break;
      case 'story-mode':
        navigate('/story-mode');
        break;
      case 'teacher-dashboard':
        navigate('/teacher-dashboard');
        break;
      case 'voice-recognition':
        navigate('/voice-quiz');
        break;
      default:
        console.warn('Unknown feature:', feature);
    }
  };

  /**
   * Handle subscription upgrade (all features are now free)
   */
  const handleUpgrade = () => {
    // Trigger confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // All features are now free - just set premium status
    setIsPremium(true);
    setShowPremiumModal(false);
    setShowSuccessModal(true);
  };

  // Feature cards data
  const features = [
    {
      id: 'basic-learning',
      title: 'Basic Learning',
      description: 'Core educational content and problem solving',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      isPremium: false,
      action: () => navigate('/')
    },
    {
      id: 'ar-problems',
      title: 'AR Problems',
      description: 'Augmented reality problem solving experience',
      icon: Zap,
      color: 'from-purple-500 to-purple-600',
      isPremium: false,
      action: () => handleFeatureAccess('ar-problems')
    },
    {
      id: 'live-code',
      title: 'Live Code',
      description: 'Real-time collaborative coding sessions',
      icon: Code,
      color: 'from-green-500 to-green-600',
      isPremium: false,
      action: () => handleFeatureAccess('live-code')
    },
    {
      id: 'story-mode',
      title: 'Story Mode',
      description: 'Interactive storytelling with AI narration',
      icon: BookOpen,
      color: 'from-pink-500 to-pink-600',
      isPremium: false,
      action: () => handleFeatureAccess('story-mode')
    },
    {
      id: 'teacher-dashboard',
      title: 'Teacher Dashboard',
      description: 'Monitor student progress and assign tasks',
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      isPremium: false,
      action: () => handleFeatureAccess('teacher-dashboard')
    },
    {
      id: 'voice-recognition',
      title: 'Voice Learning',
      description: 'Speech recognition and pronunciation practice',
      icon: Mic,
      color: 'from-teal-500 to-teal-600',
      isPremium: false,
      action: () => handleFeatureAccess('voice-recognition')
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader2 className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
          <p className="text-xl font-semibold text-blue-800">Loading EduSphere AI...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="text-blue-600 mr-3" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">EduSphere AI</h1>
                <p className="text-gray-600">Learn Without Limits</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {isPremium && (
                <div className="flex items-center bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-3 py-1 rounded-full">
                  <Crown className="mr-1" size={16} />
                  <span className="text-sm font-medium">Premium</span>
                </div>
              )}

              <motion.button
                onClick={() => navigate('/login')}
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <User className="mr-2" size={20} />
                {isAuthenticated ? 'Profile' : 'Login'}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="text-red-500 mr-3" size={20} />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <motion.h2
            className="text-4xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Welcome to Your Learning Hub
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Explore interactive learning experiences powered by AI. From basic problem solving to advanced AR experiences.
          </motion.p>
        </div>

        {/* Stats Cards */}
        {isAuthenticated && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Problems Solved', value: userStats.totalProblems, icon: Target, color: 'text-blue-600' },
              { label: 'Accuracy', value: `${userStats.accuracy}%`, icon: TrendingUp, color: 'text-green-600' },
              { label: 'Day Streak', value: userStats.streak, icon: Clock, color: 'text-orange-600' },
              { label: 'Achievements', value: userStats.achievements, icon: Award, color: 'text-purple-600' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="bg-white rounded-xl shadow-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className={`${stat.color}`} size={32} />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className={`h-32 bg-gradient-to-r ${feature.color} flex items-center justify-center relative`}>
                <feature.icon className="text-white" size={48} />
                {feature.isPremium && !isPremium && (
                  <div className="absolute top-3 right-3">
                    <Lock className="text-white" size={20} />
                  </div>
                )}
                {feature.isPremium && isPremium && (
                  <div className="absolute top-3 right-3">
                    <Crown className="text-yellow-300" size={20} />
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>

                <motion.button
                  onClick={() => feature.action()}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center bg-gradient-to-r ${feature.color} text-white hover:shadow-lg`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {feature.isPremium && !isPremium ? (
                    <>
                      <Lock className="mr-2" size={16} />
                      Premium Required
                    </>
                  ) : (
                    <>
                      <Play className="mr-2" size={16} />
                      {feature.isPremium ? 'Access Premium' : 'Start Learning'}
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Premium CTA */}
        {!isPremium && (
          <motion.div
            className="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-center text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Crown className="mx-auto mb-4" size={48} />
            <h3 className="text-3xl font-bold mb-4">Unlock Premium Features</h3>
            <p className="text-xl mb-6 opacity-90">
              Get access to AR problems, live coding, story mode, and advanced analytics
            </p>
            <motion.button
              onClick={handleUpgrade}
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Upgrade to Premium
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Premium Modal */}
      <AnimatePresence>
        {showPremiumModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPremiumModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <Crown className="mx-auto mb-4 text-yellow-500" size={64} />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Premium Feature</h3>
                <p className="text-gray-600 mb-6">
                  This feature requires a premium subscription. Upgrade now to unlock all advanced learning tools.
                </p>
                <div className="space-y-3">
                  <motion.button
                    onClick={handleUpgrade}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Upgrade to Premium
                  </motion.button>
                  <button
                    onClick={() => setShowPremiumModal(false)}
                    className="w-full text-gray-600 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlayLearnPage;