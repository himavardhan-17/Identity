import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeech } from '../hooks/useSpeech';

interface CountdownTimerProps {
  onComplete: () => void;
}

export const CountdownTimer = ({ onComplete }: CountdownTimerProps) => {
  const [count, setCount] = useState(5);
  const [isActive, setIsActive] = useState(false);
  const { speak } = useSpeech();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActive(true);
      speak("Authentication complete. Redirecting in 5 seconds.", {
        onComplete: () => {
          // Start countdown after announcement completes
          setTimeout(() => setCount(4), 1000);
        }
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [speak]);

  useEffect(() => {
    if (!isActive || count === 5) return;

    if (count > 0) {
      speak(count === 1 ? "one" : count.toString(), {
        onComplete: () => {
          setTimeout(() => setCount(count - 1), 800);
        }
      });
    } else {
      speak("Access granted", {
        onComplete: () => {
          setTimeout(() => onComplete(), 1000);
        }
      });
    }
  }, [count, isActive, onComplete, speak]);

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-background overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        {/* Animated grid */}
        <motion.div 
          className="grid grid-cols-12 grid-rows-8 w-full h-full opacity-10"
          animate={{ 
            rotateX: [0, 5, 0],
            rotateY: [0, 2, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {[...Array(96)].map((_, i) => (
            <motion.div 
              key={i} 
              className="border border-neon-blue"
              animate={{ 
                opacity: [0.1, 0.3, 0.1],
                borderColor: [
                  "hsl(195 100% 50%)",
                  "hsl(90 100% 50%)",
                  "hsl(195 100% 50%)"
                ]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: i * 0.02 
              }}
            />
          ))}
        </motion.div>

        {/* Radial gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-neon-blue/20 via-lime-green/10 to-transparent" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center space-y-12">
        
        {/* Success message */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl md:text-6xl font-orbitron font-bold text-lime-green biometric-text">
            AUTHENTICATION
          </h1>
          <h2 className="text-3xl md:text-5xl font-orbitron font-bold text-neon-blue biometric-text">
            SUCCESSFUL
          </h2>
        </motion.div>

        {/* Success icon */}
        <motion.div
          className="relative"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.5, type: "spring", bounce: 0.3 }}
        >
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-lime-green lime-glow flex items-center justify-center">
            <motion.svg 
              className="w-16 h-16 md:w-20 md:h-20 text-lime-green"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              <motion.path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={3} 
                d="M5 13l4 4L19 7"
              />
            </motion.svg>
          </div>
          
          {/* Pulsing rings */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border-2 border-lime-green"
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ 
                scale: [1, 2],
                opacity: [0.8, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeOut"
              }}
            />
          ))}
        </motion.div>

        {/* Countdown display */}
        <div className="text-center space-y-6">
          <motion.div 
            className="text-2xl md:text-3xl font-mono text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            Redirecting in
          </motion.div>
          
          {/* Large countdown number */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={count}
                className="text-9xl md:text-[12rem] font-orbitron font-black text-neon-blue animate-countdown"
                initial={{ 
                  scale: 0, 
                  rotate: -180, 
                  opacity: 0,
                  filter: "blur(20px)"
                }}
                animate={{ 
                  scale: 1, 
                  rotate: 0, 
                  opacity: 1,
                  filter: "blur(0px)"
                }}
                exit={{ 
                  scale: 2, 
                  opacity: 0,
                  filter: "blur(10px)"
                }}
                transition={{ 
                  duration: 0.6,
                  type: "spring",
                  bounce: 0.4
                }}
                style={{
                  textShadow: `
                    0 0 20px hsl(195 100% 50%),
                    0 0 40px hsl(195 100% 50%),
                    0 0 60px hsl(195 100% 50%)
                  `
                }}
              >
                {count}
              </motion.div>
            </AnimatePresence>
            
            {/* Number glow effect */}
            <motion.div
              className="absolute inset-0 text-9xl md:text-[12rem] font-orbitron font-black text-neon-blue opacity-30"
              animate={{ 
                scale: [1, 1.1, 1],
                filter: [
                  "blur(20px)",
                  "blur(30px)",
                  "blur(20px)"
                ]
              }}
              transition={{ 
                duration: 1, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {count}
            </motion.div>
          </div>
        </div>

        {/* Progress ring */}
        <motion.div 
          className="relative w-24 h-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="hsl(195 100% 50% / 0.2)"
              strokeWidth="4"
              fill="none"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke="hsl(195 100% 50%)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: (6 - count) / 5 }}
              transition={{ duration: 0.5 }}
              style={{
                filter: "drop-shadow(0 0 10px hsl(195 100% 50%))"
              }}
            />
          </svg>
        </motion.div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-lime-green rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, -100],
                x: [0, Math.random() * 40 - 20],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};