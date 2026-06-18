import React, { useState, useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';

const AmbientSoundPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [interactionTriggered, setInteractionTriggered] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Load romantic song
    const audio = new Audio('/sounds/romantic.mp3');
    audio.loop = true;
    audio.volume = 0.45; // pleasant background volume
    audioRef.current = audio;

    // Check if the user previously paused it
    const wasPlaying = localStorage.getItem('hangout_romantic_playing') !== 'false';

    const startAudioOnInteraction = async () => {
      if (interactionTriggered) return;
      try {
        if (wasPlaying && audioRef.current) {
          await audioRef.current.play();
          setIsPlaying(true);
        }
      } catch (err) {
        console.log('Autoplay deferred until active user interaction:', err);
      } finally {
        setInteractionTriggered(true);
        window.removeEventListener('click', startAudioOnInteraction);
        window.removeEventListener('keydown', startAudioOnInteraction);
      }
    };

    // Try to autoplay immediately
    if (wasPlaying) {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // If blocked, wait for user interaction
          window.addEventListener('click', startAudioOnInteraction);
          window.addEventListener('keydown', startAudioOnInteraction);
        });
    }

    return () => {
      audio.pause();
      window.removeEventListener('click', startAudioOnInteraction);
      window.removeEventListener('keydown', startAudioOnInteraction);
    };
  }, []);

  // Sync play/pause state
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch(err => {
        console.log('Audio playback blocked:', err);
        setIsPlaying(false);
      });
      localStorage.setItem('hangout_romantic_playing', 'true');
    } else {
      audioRef.current.pause();
      localStorage.setItem('hangout_romantic_playing', 'false');
    }
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
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
