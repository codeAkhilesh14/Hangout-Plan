import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import StarfieldBackground from './components/StarfieldBackground';
import LandingPage from './pages/LandingPage';
import ChooseDayPage from './pages/ChooseDayPage';
import ChoosePlacePage from './pages/ChoosePlacePage';
import ChooseTimePage from './pages/ChooseTimePage';
import SummaryPage from './pages/SummaryPage';
import RevealPage from './pages/RevealPage';

const AnimatedRoutes = () => {
  const location = useLocation();

  // Route transition variants
  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 }
  };

  const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.35
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
              <LandingPage />
            </motion.div>
          }
        />
        <Route
          path="/day"
          element={
            <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
              <RequireSession>
                <ChooseDayPage />
              </RequireSession>
            </motion.div>
          }
        />
        <Route
          path="/place"
          element={
            <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
              <RequireSession>
                <ChoosePlacePage />
              </RequireSession>
            </motion.div>
          }
        />
        <Route
          path="/time"
          element={
            <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
              <RequireSession>
                <ChooseTimePage />
              </RequireSession>
            </motion.div>
          }
        />
        <Route
          path="/summary"
          element={
            <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
              <RequireSession>
                <SummaryPage />
              </RequireSession>
            </motion.div>
          }
        />
        <Route
          path="/reveal"
          element={
            <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
              <RequireSession>
                <RevealPage />
              </RequireSession>
            </motion.div>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

// Route guard component to ensure step sequence
const RequireSession = ({ children }) => {
  const sessionId = sessionStorage.getItem('hangout_session_id');
  if (!sessionId) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-pink-500/30 selection:text-pink-200">
      {/* Dynamic Starfield Canvas Background */}
      <StarfieldBackground />
      
      {/* Upper Navigation Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10 relative select-none pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-neon-gradient flex items-center justify-center font-bold text-sm text-white shadow-[0_0_10px_rgba(255,95,162,0.4)]">
            H
          </div>
          <span className="font-extrabold text-sm tracking-widest text-gray-300">HANGOUT</span>
        </div>
        <div className="text-[10px] font-mono tracking-wider text-gray-500 uppercase">
          Status: Online 🟢
        </div>
      </header>

      {/* Main Container Content */}
      <main className="relative z-10 w-full max-w-7xl mx-auto flex-grow flex items-center justify-center">
        <AnimatedRoutes />
      </main>

      {/* Footer copyright */}
      <footer className="w-full py-6 text-center border-t border-white/5 z-10 relative select-none pointer-events-none text-xs text-gray-600 font-mono tracking-wide">
        🌌 SPACE INVITE ENGINE &copy; 2026
      </footer>
    </div>
  );
}

export default App;
