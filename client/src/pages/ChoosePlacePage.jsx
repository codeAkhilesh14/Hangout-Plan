import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlowCard from '../components/GlowCard';
import { Film, ShoppingBag, Trees, Zap, Moon, Check } from 'lucide-react';
import { updateSession } from '../api/sessionApi';

const places = [

  {
    id: 'movie',
    name: 'Watch Cocktail 2 movie',
    description: 'Popcorn & Vibes 🍿',
    icon: Film,
    color: 'pink',
  },
  {
    id: 'shopping',
    name: 'Lajpat Nagar',
    description: 'Shop till we drop 🛍️',
    icon: ShoppingBag,
    color: 'blue',
  },
  {
    id: 'garden',
    name: 'Lodhi Garden',
    description: 'Sunset walk & talks 🌳',
    icon: Trees,
    color: 'pink',
  },
  {
    id: 'gokarting',
    name: 'Go-Karting',
    description: 'Speed & adrenaline 🏎️',
    icon: Zap,
    color: 'blue',
  },
  {
    id: 'binge',
    name: 'Binge Central',
    description: 'Silent chill vibes 🌌',
    icon: Moon,
    color: 'pink',
  },
];

const ChoosePlacePage = () => {
  const navigate = useNavigate();
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const sessionId = sessionStorage.getItem('hangout_session_id');

  const handleSelectPlace = async (placeName) => {
    if (isLoading || selectedPlace) return;
    setSelectedPlace(placeName);
    setIsLoading(true);

    try {
      if (sessionId && sessionId !== 'temp-local-session') {
        await updateSession(sessionId, { place: placeName });
      }
      setTimeout(() => {
        navigate('/time');
      }, 700);
    } catch (error) {
      console.error('Error saving place choice:', error);
      setTimeout(() => {
        navigate('/time');
      }, 700);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8 text-center">
      <div className="max-w-4xl w-full">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-extrabold mb-8 tracking-tight"
        >
          Where do you <span className="text-neon-gradient font-black">want to go?</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place, idx) => {
            const isSelected = selectedPlace === place.name;
            const IconComponent = place.icon;
            
            // Last item can take double columns on tablet but 1 column on desktops
            const gridClass = idx === 4 ? 'md:col-span-2 lg:col-span-1' : '';

            return (
              <GlowCard
                key={place.id}
                glowColor={place.color}
                onClick={() => handleSelectPlace(place.name)}
                delay={idx * 0.05}
                className={`relative overflow-hidden border p-6 flex flex-col items-center justify-between min-h-[180px] cursor-pointer group ${gridClass} ${
                  isSelected
                    ? place.color === 'pink'
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
                        place.color === 'pink' ? 'bg-pink-500 text-white' : 'bg-blue-500 text-white'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                    </motion.div>
                  )}
                </div>

                <div className="flex flex-col items-center justify-center mt-2">
                  <IconComponent className={`w-10 h-10 mb-3 transition-transform duration-300 group-hover:scale-110 ${
                    isSelected 
                      ? place.color === 'pink' ? 'text-pink-400' : 'text-blue-400'
                      : 'text-gray-500 group-hover:text-gray-300'
                  }`} />

                  <h3 className={`text-xl font-bold tracking-wide transition-colors ${
                    isSelected 
                      ? place.color === 'pink' ? 'text-pink-300' : 'text-blue-300'
                      : 'text-gray-300'
                  }`}>
                    {place.name}
                  </h3>
                </div>
                
                <p className="text-sm text-gray-500 mt-3 font-sans">
                  {place.description}
                </p>
              </GlowCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChoosePlacePage;
