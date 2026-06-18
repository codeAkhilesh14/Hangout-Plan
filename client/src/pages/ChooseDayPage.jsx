import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlowCard from '../components/GlowCard';
import { Calendar, Check } from 'lucide-react';
import { updateSession } from '../api/sessionApi';

const ChooseDayPage = () => {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const sessionId = sessionStorage.getItem('hangout_session_id');

  const handleSelectDay = async (day) => {
    if (isLoading || selectedDay) return;
    setSelectedDay(day);
    setIsLoading(true);

    try {
      if (sessionId && sessionId !== 'temp-local-session') {
        await updateSession(sessionId, { day });
      }
      // Brief delay for the selection animation to feel premium
      setTimeout(() => {
        navigate('/place');
      }, 700);
    } catch (error) {
      console.error('Error saving day choice:', error);
      setTimeout(() => {
        navigate('/place');
      }, 700);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="max-w-2xl w-full">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-extrabold mb-8 tracking-tight"
        >
          Pick a <span className="text-neon-gradient font-black">day</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['Saturday', 'Sunday'].map((day) => {
            const isSelected = selectedDay === day;
            return (
              <GlowCard
                key={day}
                glowColor={day === 'Saturday' ? 'pink' : 'blue'}
                onClick={() => handleSelectDay(day)}
                className={`relative overflow-hidden border p-8 flex flex-col items-center justify-center min-h-[200px] cursor-pointer group ${
                  isSelected
                    ? day === 'Saturday'
                      ? 'border-pink-500 bg-pink-500/10 shadow-[0_0_25px_rgba(255,95,162,0.25)]'
                      : 'border-blue-500 bg-blue-500/10 shadow-[0_0_25px_rgba(59,130,246,0.25)]'
                    : 'border-white/5 bg-space-card hover:border-white/20'
                }`}
              >
                <div className="absolute top-4 right-4">
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        day === 'Saturday' ? 'bg-pink-500 text-white' : 'bg-blue-500 text-white'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                    </motion.div>
                  )}
                </div>

                <Calendar className={`w-12 h-12 mb-4 transition-transform duration-300 group-hover:scale-110 ${
                  isSelected 
                    ? day === 'Saturday' ? 'text-pink-400' : 'text-blue-400'
                    : 'text-gray-500 group-hover:text-gray-300'
                }`} />

                <h3 className={`text-2xl font-bold tracking-wide transition-colors ${
                  isSelected 
                    ? day === 'Saturday' ? 'text-pink-300' : 'text-blue-300'
                    : 'text-gray-300'
                }`}>
                  {day}
                </h3>
                
                <p className="text-xs text-gray-500 mt-2 font-mono">
                  {day === 'Saturday' ? 'Weekend Kickoff 🚀' : 'Sunday Funday 🪐'}
                </p>
              </GlowCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChooseDayPage;
