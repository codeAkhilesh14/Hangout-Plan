import React, { useState, useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';

const AmbientSoundPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef(null);
  const hasStartedRef = useRef(false);

  // Single unified effect: create audio, try autoplay, attach interaction listeners
  useEffect(() => {
    const audio = new Audio('/sounds/romantic.mp3');
    audio.loop = true;
    audio.volume = 0.45;
    audioRef.current = audio;

    const tryPlay = async () => {
      if (hasStartedRef.current) return;
      try {
        await audio.play();
        hasStartedRef.current = true;
        setIsPlaying(true);
        removeListeners();
      } catch (err) {
        // Browser blocked autoplay — listeners will handle it
      }
    };

    const onInteraction = () => {
      if (!hasStartedRef.current) {
        tryPlay();
      }
    };

    const events = ['click', 'keydown', 'touchstart', 'mousedown', 'pointerdown', 'scroll'];

    const addListeners = () => {
      events.forEach(evt => {
        window.addEventListener(evt, onInteraction, { passive: true, once: false });
      });
    };

    const removeListeners = () => {
      events.forEach(evt => {
        window.removeEventListener(evt, onInteraction);
      });
    };

    // Attempt immediate autoplay
    tryPlay().then(() => {
      if (!hasStartedRef.current) {
        // Autoplay was blocked, wait for any interaction
        addListeners();
      }
    });

    return () => {
      audio.pause();
      audio.src = '';
      removeListeners();
    };
  }, []); // runs once on mount

  // Handle manual toggle via heart button
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        hasStartedRef.current = true;
        setIsPlaying(true);
      }).catch(() => {});
    }
  };

  return (
    <div className="relative pointer-events-auto select-none">
      <button
        onClick={togglePlay}
        title={isPlaying ? "Mute Background Music" : "Play Background Music"}
        className={`flex items-center justify-center w-10 h-10 rounded-full glassmorphism border transition-all duration-500 cursor-pointer ${
          isPlaying
            ? 'border-pink-500/40 text-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.3)] bg-pink-500/5'
            : 'border-white/10 text-gray-500 hover:text-gray-300'
        }`}
      >
        <Heart
          className={`w-5 h-5 ${
            isPlaying ? 'fill-pink-500 animate-[pulse_1.2s_infinite]' : 'text-gray-500'
          }`}
        />
      </button>
    </div>
  );
};

export default AmbientSoundPlayer;
