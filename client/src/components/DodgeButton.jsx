import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

const captions = [
  "Nope 😏",
  "Try again!",
  "Not happening",
  "Yeah... no",
  "Nice try! 😜",
  "Dream on",
  "No way!",
  "Nuh-uh 🚫",
  "Error: 403",
  "Click YES instead"
];

const DodgeButton = ({ onDodge }) => {
  const placeholderRef = useRef(null);
  const buttonRef = useRef(null);
  
  const [isDodged, setIsDodged] = useState(false);
  const [coords, setCoords] = useState(null);
  const [caption, setCaption] = useState("No 🙅");
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const [, setDodgeCount] = useState(0);

  // Keep refs to avoid stale closures in event listeners
  const onDodgeRef = useRef(onDodge);
  useEffect(() => {
    onDodgeRef.current = onDodge;
  }, [onDodge]);

  const isDodgedRef = useRef(isDodged);
  useEffect(() => {
    isDodgedRef.current = isDodged;
  }, [isDodged]);

  // Position the portal button at the placeholder's page coordinates on mount/resize (if not dodged)
  useLayoutEffect(() => {
    const updatePosition = () => {
      if (placeholderRef.current && !isDodgedRef.current) {
        const rect = placeholderRef.current.getBoundingClientRect();
        setCoords({ 
          x: rect.left + window.scrollX, 
          y: rect.top + window.scrollY 
        });
      }
    };

    updatePosition();
    // Double requestAnimationFrame ensures layout has settled on all devices
    const handle = requestAnimationFrame(() => {
      requestAnimationFrame(updatePosition);
    });

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    return () => {
      cancelAnimationFrame(handle);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, []);

  const dodge = useCallback(() => {
    const buttonEl = buttonRef.current;
    if (!buttonEl) return;

    const btnWidth = buttonEl.offsetWidth;
    const btnHeight = buttonEl.offsetHeight;

    const yesBtn = document.getElementById('yes-button');
    const yesRect = yesBtn ? yesBtn.getBoundingClientRect() : null;

    let newX, newY;
    let attempts = 0;
    const padding = 20;

    do {
      // Keep within the current viewport bounds but relative to page scroll
      newX = padding + Math.random() * (window.innerWidth - btnWidth - padding * 2) + window.scrollX;
      newY = padding + Math.random() * (window.innerHeight - btnHeight - padding * 2) + window.scrollY;
      attempts++;

      if (!yesRect) break;
      const buffer = 50;
      const yesPageLeft = yesRect.left + window.scrollX;
      const yesPageTop = yesRect.top + window.scrollY;
      const overlapX = newX + btnWidth > yesPageLeft - buffer && newX < yesPageLeft + yesRect.width + buffer;
      const overlapY = newY + btnHeight > yesPageTop - buffer && newY < yesPageTop + yesRect.height + buffer;
      if (!overlapX || !overlapY) break;
    } while (attempts < 50);

    setCoords({ x: newX, y: newY });
    setIsDodged(true);
    setRotation((Math.random() - 0.5) * 20);
    setScale(prev => Math.max(0.6, prev - 0.04));
    setCaption(captions[Math.floor(Math.random() * captions.length)]);
    setDodgeCount(prev => {
      const next = prev + 1;
      onDodgeRef.current?.(next);
      return next;
    });
  }, []);

  const dodgeRef = useRef(dodge);
  useEffect(() => {
    dodgeRef.current = dodge;
  }, [dodge]);

  // Proximity detection listener for mouse and touch interactions
  useEffect(() => {
    const checkProximity = (clientX, clientY) => {
      const btn = buttonRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const distance = Math.hypot(
        clientX - (rect.left + rect.width / 2),
        clientY - (rect.top + rect.height / 2)
      );

      // Trigger dodge if pointer/finger is within 85px of the button center
      if (distance < 85) {
        dodgeRef.current();
      }
    };

    const handleMouseMove = (e) => {
      checkProximity(e.clientX, e.clientY);
    };

    const handleTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        checkProximity(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        checkProximity(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const handleTouchStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dodgeRef.current();
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dodgeRef.current();
  };

  const handlePointerOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dodgeRef.current();
  };

  const buttonStyle = {
    position: 'absolute',
    left: coords ? `${coords.x}px` : '0px',
    top: coords ? `${coords.y}px` : '0px',
    transform: `rotate(${rotation}deg) scale(${scale})`,
    transition: isDodged
      ? 'left 0.2s cubic-bezier(0.25, 1, 0.5, 1), top 0.2s cubic-bezier(0.25, 1, 0.5, 1), transform 0.25s ease'
      : 'none',
    opacity: coords ? 1 : 0,
    zIndex: 9999,
    userSelect: 'none',
    touchAction: 'none',
    cursor: 'default',
  };

  return (
    <>
      {/* Invisible placeholder next to the YES button to reserve space in flow */}
      <div 
        ref={placeholderRef}
        className="px-6 py-2.5 min-w-[110px] min-h-[44px] invisible pointer-events-none" 
        aria-hidden="true" 
      />
      
      {/* Render the button at the top-level of document.body using a React Portal */}
      {coords && createPortal(
        <button
          ref={buttonRef}
          id="no-button"
          style={buttonStyle}
          onTouchStart={handleTouchStart}
          onPointerDown={handlePointerDown}
          onPointerOver={handlePointerOver}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="px-6 py-2.5 min-w-[110px] min-h-[44px] bg-red-900/40 hover:bg-red-800/60 text-red-200 border border-red-500/40 rounded-xl glow-btn-red font-medium select-none"
        >
          {caption}
        </button>,
        document.body
      )}
    </>
  );
};

export default DodgeButton;
