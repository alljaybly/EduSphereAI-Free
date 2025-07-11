import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Zap, Shield, Check } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;

  const features = [
    'Unlimited AI-generated content',
    'Advanced voice recognition',
    'AR learning experiences',
    'Real-time collaboration',
    'Interactive story mode',
    'All subjects and grade levels',
    'Offline access capabilities'
  ];

  const handleExplore = () => {
    onSuccess?.();
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center">
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Star size={32} />
              </motion.div>
              <h2 className="text-3xl font-bold mb-2">All Features Unlocked!</h2>
              <p className="text-blue-100">Enjoy everything EduSphere AI has to offer</p>
            </div>
          </div>

          {/* Features List */}
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
                What's Available for Free:
              </h3>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center text-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Check className="text-green-500 mr-3 flex-shrink-0" size={16} />
                    <span className="text-gray-700">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Features Highlight */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
                Why Choose EduSphere AI?
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                    <Zap className="text-blue-600" size={24} />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">AI-Powered Learning</h4>
                  <p className="text-gray-600 text-sm">
                    Advanced AI generates personalized content and adapts to your learning style
                  </p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
                    <Star className="text-purple-600" size={24} />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">All Features Free</h4>
                  <p className="text-gray-600 text-sm">
                    Access AR experiences, voice recognition, and collaborative tools at no cost
                  </p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                    <Shield className="text-green-600" size={24} />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Safe & Secure</h4>
                  <p className="text-gray-600 text-sm">
                    Child-safe learning environment with privacy protection
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <motion.button
              onClick={handleExplore}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Learning Now!
            </motion.button>

            {/* Footer */}
            <div className="text-center text-gray-600 text-sm mt-4">
              <p>No payment required. All features are completely free!</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentModal;