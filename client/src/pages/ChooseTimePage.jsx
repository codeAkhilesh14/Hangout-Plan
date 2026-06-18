import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlowCard from '../components/GlowCard';
import { Sun, SunDim, Sunset, Moon, Check, Clock } from 'lucide-react';
import { updateSession } from '../api/sessionApi';

const timeSlots = [
  { slot: '9am – 12pm', label: 'Morning Cruise', sub: 'Coffee & clear skies ☕', icon: Sun, color: 'pink' },
  { slot: '2pm – 5pm', label: 'Afternoon Spark', sub: 'Bright daylight vibes ☀️', icon: SunDim, color: 'blue' },
  { slot: '4pm – 6pm', label: 'Golden Hour', sub: 'Chasing sunsets 🌅', icon: Sunset, color: 'pink' },
  { slot: '5pm – 8pm', label: 'Twilight Transition', sub: 'Perfect cooling shift 🌇', icon: Clock, color: 'blue' },
  { slot: '6pm – 9pm', label: 'Night Owl Special', sub: 'Under the neon stars 🌌', icon: Moon, color: 'pink' },
];

const ChooseTimePage = () => {
  const navigate = useNavigate();
  const [selectedTime, setSelectedTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const sessionId = sessionStorage.getItem('hangout_session_id');

  const handleSelectTime = async (timeSlot) => {
    if (isLoading || selectedTime) return;
    setSelectedTime(timeSlot);
    setIsLoading(true);

    try {
      if (sessionId && sessionId !== 'temp-local-session') {
        await updateSession(sessionId, { timeSlot });
      }
      setTimeout(() => {
        navigate('/summary');
      }, 700);
    } catch (error) {
      console.error('Error saving time choice:', error);
      setTimeout(() => {
        navigate('/summary');
      }, 700);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8 text-center">
      <div className="max-w-2xl w-full">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-extrabold mb-8 tracking-tight"
        >
          Pick a <span className="text-neon-gradient font-black">time</span>
        </motion.h2>

        <div className="flex flex-col gap-4">
          {timeSlots.map((time, idx) => {
            const isSelected = selectedTime === time.slot;
            const IconComponent = time.icon;

            return (
              <GlowCard
                key={time.slot}
                glowColor={time.color}
                onClick={() => handleSelectTime(time.slot)}
                delay={idx * 0.05}
                className={`relative overflow-hidden border p-4 md:p-5 flex flex-row items-center justify-between cursor-pointer group ${
                  isSelected
                    ? time.color === 'pink'
                      ? 'border-pink-500 bg-pink-500/10 shadow-[0_0_20px_rgba(255,95,162,0.25)]'
                      : 'border-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.25)]'
                    : 'border-white/5 bg-space-card hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${
                    isSelected
                      ? time.color === 'pink' ? 'bg-pink-500/20 text-pink-400' : 'bg-blue-500/20 text-blue-400'
                      : 'bg-white/5 text-gray-500 group-hover:text-gray-300'
                  }`}>
                    <IconComponent className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  <div className="text-left">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-lg font-bold ${
                        isSelected 
                          ? time.color === 'pink' ? 'text-pink-300' : 'text-blue-300'
                          : 'text-gray-200'
                      }`}>
                        {time.slot}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-400 font-mono">
                        {time.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{time.sub}</p>
                  </div>
                </div>

                <div>
                  {isSelected ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        time.color === 'pink' ? 'bg-pink-500 text-white' : 'bg-blue-500 text-white'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-white/10 group-hover:border-white/30" />
                  )}
                </div>
              </GlowCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChooseTimePage;
