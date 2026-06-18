import React, { useEffect, useRef } from 'react';

const StarfieldBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId;
    let stars = [];
    const starCount = 100;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.3 + 0.2,
          color: getRandomColor(),
          alpha: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.05 + 0.01,
          twinkleDirection: Math.random() > 0.5 ? 1 : -1
        });
      }
    };

    const getRandomColor = () => {
      const rand = Math.random();
      if (rand < 0.7) return 'rgba(255, 255, 255, '; // White stars
      if (rand < 0.85) return 'rgba(96, 165, 250, '; // Blue stars
      return 'rgba(255, 95, 162, '; // Pink stars
    };

    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Paint space backdrop dark gradient
      const bgGrad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 10,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
      );
      bgGrad.addColorStop(0, '#0c0d24');
      bgGrad.addColorStop(1, '#05060f');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      stars.forEach(star => {
        // Twinkle opacity oscillation
        star.alpha += star.speed * star.twinkleDirection;
        if (star.alpha > 1) {
          star.alpha = 1;
          star.twinkleDirection = -1;
        } else if (star.alpha < 0.1) {
          star.alpha = 0.1;
          star.twinkleDirection = 1;
        }

        // Slowly drift stars upward
        star.y -= star.speed * 12;
        if (star.y < 0) {
          star.y = canvas.height;
          star.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color + star.alpha + ')';
        ctx.shadowBlur = star.radius * 3;
        ctx.shadowColor = 'rgba(255,255,255,0.3)';
        ctx.fill();
      });
    };

    const animate = () => {
      drawStars();
      animationId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-20 w-full h-full"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default StarfieldBackground;
