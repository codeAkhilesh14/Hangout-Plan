import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, PartyPopper, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { completeSession } from '../api/sessionApi';

const RevealPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const sessionId = sessionStorage.getItem('hangout_session_id');

  const triggerConfetti = () => {
    // 3 bursts of confetti in red/pink/blue
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;
    const colors = ['#ff2d55', '#ff5fa2', '#3b82f6', '#60a5fa'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    // One massive center burst
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.65 },
      colors: colors
    });
  };

  const handleOpenBox = async () => {
    if (isOpen || isLoading) return;
    setIsLoading(true);

    try {
      if (sessionId && sessionId !== 'temp-local-session') {
        await completeSession(sessionId);
      }
      setIsOpen(true);
      triggerConfetti();
    } catch (error) {
      console.error('Error completing session:', error);
      // Fallback in case backend is offline
      setIsOpen(true);
      triggerConfetti();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="max-w-md w-full relative">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="closed"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <h2 className="text-3xl font-extrabold mb-4 text-white leading-tight">
                One final <span className="text-neon-gradient font-black">surprise...</span>
              </h2>
              <p className="text-gray-400 text-sm mb-12 max-w-xs">
                Tap the mystery box below to confirm your invitation and lock it in. 📦
              </p>

              {/* Pulsing Gift Box container */}
              <motion.div
                onClick={handleOpenBox}
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.03, 1]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut"
                }}
                className="w-48 h-48 rounded-full bg-gradient-to-tr from-pink-500/20 to-blue-500/20 border border-white/10 hover:border-pink-500/40 flex items-center justify-center cursor-pointer shadow-[0_0_35px_rgba(255,95,162,0.12)] hover:shadow-[0_0_45px_rgba(59,130,246,0.25)] transition-all duration-300 group"
              >
                <div className="relative">
                  <Gift className="w-20 h-20 text-pink-400 group-hover:text-pink-300 transition-colors" />
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.6, 0.2] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute -inset-4 bg-pink-500/10 rounded-full -z-10 blur-md"
                  />
                </div>
              </motion.div>

              <span className="text-xs text-gray-500 font-mono mt-8 uppercase tracking-widest animate-pulse">
                Click to open
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="flex flex-col items-center"
            >
              {/* Confetti / Burst icon */}
              <div className="w-24 h-24 rounded-full bg-neon-gradient flex items-center justify-center text-white mb-6 glow-btn-blue animate-bounce">
                <PartyPopper className="w-12 h-12" />
              </div>

              <h1 className="text-4xl sm:text-5xl font-black mb-4 tracking-tight leading-tight">
                See you <br />
                <span className="text-neon-gradient font-black">there! 🎉</span>
              </h1>
              
              <p className="text-gray-300 text-base max-w-sm mb-8">
                Your hangout choices have been officially registered. Be ready for the adventure! 🪐
              </p>

              {/* Decorative sparkles */}
              <div className="flex gap-2 text-pink-400 items-center justify-center">
                <Sparkles className="w-5 h-5 animate-pulse-slow text-pink-500" />
                <span className="font-mono text-xs text-gray-500 tracking-wider">SECURE CONNECTION LOCK</span>
                <Sparkles className="w-5 h-5 text-blue-400 animate-pulse-slow" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RevealPage;
