import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DodgeButton from '../components/DodgeButton';
import GlowCard from '../components/GlowCard';
import { createSession } from '../api/sessionApi';

const LandingPage = () => {
  const navigate = useNavigate();
  const [dodgeCount, setDodgeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleDodge = (count) => {
    setDodgeCount(count);
  };

  const handleYes = async () => {
    setIsLoading(true);
    try {
      const session = await createSession(dodgeCount);
      sessionStorage.setItem('hangout_session_id', session.sessionId);
      navigate('/day');
    } catch (error) {
      console.error('Error starting session:', error);
      // Fallback: navigate anyway to let user experience the flow
      sessionStorage.setItem('hangout_session_id', 'temp-local-session');
      navigate('/day');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <GlowCard glowColor="gradient" className="max-w-xl w-full flex flex-col items-center relative overflow-hidden py-10">
        {/* Glow ambient lights */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-8 font-sans leading-tight"
        >
          Will you go to <br />
          <span className="text-neon-gradient font-black">hangout with me?</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 text-sm sm:text-base max-w-sm mb-10"
        >
          Choose wisely. One button works, the other is pretty stubborn. 💫
        </motion.p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full min-h-[60px]">
          <button
            id="yes-button"
            onClick={handleYes}
            disabled={isLoading}
            className="px-8 py-3 w-full sm:w-auto min-h-[44px] text-lg font-bold bg-neon-gradient hover:bg-neon-gradient-hover text-white rounded-xl glow-btn-blue transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50 z-10"
          >
            {isLoading ? 'Loading...' : 'YES! 💖'}
          </button>

          <DodgeButton onDodge={handleDodge} />
        </div>

        {dodgeCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-xs font-mono text-gray-500"
          >
            Evaded: <span className="text-pink-500 font-bold">{dodgeCount}</span> {dodgeCount === 1 ? 'time' : 'times'}
          </motion.div>
        )}
      </GlowCard>
    </div>
  );
};

export default LandingPage;
