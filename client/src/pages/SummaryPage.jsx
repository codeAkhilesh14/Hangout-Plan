import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ShieldAlert, Sparkles } from 'lucide-react';
import { getSession } from '../api/sessionApi';

const SummaryPage = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const sessionId = sessionStorage.getItem('hangout_session_id');

  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) {
        setIsLoading(false);
        return;
      }
      try {
        const data = await getSession(sessionId);
        setSession(data);
      } catch (error) {
        console.error('Error fetching session details:', error);
        // Local mockup fallback if API/DB is unreachable
        setSession({
          day: 'Saturday',
          place: 'Watch Cocktail 2 movie',
          timeSlot: '6pm – 9pm',
          dodgeCount: 5
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSession();
  }, [sessionId]);

  const handleProceed = () => {
    navigate('/reveal');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-12 h-12 border-4 border-t-pink-500 border-r-blue-500 border-b-indigo-500 border-l-transparent rounded-full animate-spin" />
        <p className="text-gray-400 mt-4 font-mono text-sm">Decoding space frequency...</p>
      </div>
    );
  }

  // Fallbacks in case DB fields are somehow empty
  const day = session?.day || 'Saturday';
  const place = session?.place || 'Lodhi Garden';
  const timeSlot = session?.timeSlot || '5pm – 8pm';
  const dodgeCount = session?.dodgeCount || 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-8 text-center">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold mb-8 tracking-tight text-white leading-tight">
            You're all set — <span className="text-neon-gradient font-black">be ready!</span>
          </h2>
          
          {/* Digital Ticket / Boarding Pass */}
          <div className="relative border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_35px_rgba(255,45,85,0.12)] bg-[#0a0c16]/90 backdrop-blur-md mb-8">
            {/* Ticket Header */}
            <div className="bg-gradient-to-r from-red-950/30 via-pink-950/30 to-blue-950/30 border-b border-white/5 px-6 py-5 flex items-center justify-between text-left">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink-400 font-mono">Invitation Pass</span>
                <h3 className="text-xl font-bold text-white tracking-wide">WEEKEND ADVENTURE</h3>
              </div>
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse-slow" />
            </div>

            {/* Ticket Body */}
            <div className="p-6 text-left space-y-5 relative">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 font-mono">Date / Day</span>
                  <p className="text-lg font-semibold text-gray-200">{day}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 font-mono">Destination</span>
                  <p className="text-lg font-semibold text-gray-200">{place}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 font-mono">Time Window</span>
                  <p className="text-lg font-semibold text-gray-200">{timeSlot}</p>
                </div>
              </div>

              {dodgeCount > 0 && (
                <div className="flex items-center gap-4 border-t border-white/5 pt-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 font-mono">Evasion Defense</span>
                    <p className="text-sm font-semibold text-gray-300">
                      Dodged <span className="text-red-400 font-bold">{dodgeCount}</span> {dodgeCount === 1 ? 'time' : 'times'} before agreeing!
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Ticket Dashed Divider & Cutouts */}
            <div className="relative flex items-center my-1 select-none">
              <div className="absolute left-0 -translate-x-1/2 w-6 h-6 rounded-full bg-[#05060f] border-r border-white/10 z-10" />
              <div className="w-full border-t-2 border-dashed border-white/10 mx-4" />
              <div className="absolute right-0 translate-x-1/2 w-6 h-6 rounded-full bg-[#05060f] border-l border-white/10 z-10" />
            </div>

            {/* Ticket Footer / Barcode */}
            <div className="p-6 bg-white/[0.01] flex flex-col items-center justify-center gap-3 border-t border-white/5">
              <div className="h-10 w-full flex items-center justify-between opacity-35 px-4 select-none pointer-events-none">
                {Array.from({ length: 28 }).map((_, i) => (
                  <div
                    key={i}
                    style={{ width: `${(i % 5 === 0 ? 3.5 : i % 3 === 0 ? 1.5 : i % 2 === 0 ? 2 : 4)}px` }}
                    className="h-full bg-white rounded-sm"
                  />
                ))}
              </div>
              <span className="text-[9px] font-mono tracking-[0.3em] text-gray-500">
                #INV-{sessionId?.slice(0, 8).toUpperCase() || 'LOCAL-1982'}
              </span>
            </div>
          </div>

          <button
            onClick={handleProceed}
            className="w-full py-4 text-lg font-bold bg-neon-gradient hover:bg-neon-gradient-hover text-white rounded-2xl glow-btn-blue transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Claim Invite 🎫
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default SummaryPage;
