import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeech } from '../hooks/useSpeech';

interface FingerprintScannerProps {
  onComplete: () => void;
}

export const FingerprintScanner = ({ onComplete }: FingerprintScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const { speak } = useSpeech();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsScanning(true);
      speak("Please place your finger on the scanner");
    }, 500);

    return () => clearTimeout(timer);
  }, [speak]);

  useEffect(() => {
    if (!isScanning) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanComplete(true);
          speak("Fingerprint matched. Identity verified. Welcome MD Aasif, Dean of Student Affairs", {
            onComplete: () => {
              setTimeout(() => onComplete(), 1000);
            }
          });
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isScanning, onComplete, speak]);

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-background overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-16 grid-rows-12 w-full h-full">
          {[...Array(192)].map((_, i) => (
            <div key={i} className="border border-lime-green" />
          ))}
        </div>
      </div>

      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-radial from-lime-green/20 via-transparent to-transparent" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        
        {/* Title */}
        <motion.h1 
          className="text-4xl md:text-6xl font-orbitron font-bold text-lime-green biometric-text"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          FINGERPRINT SCANNER
        </motion.h1>

        {/* Scanner pad */}
        <motion.div 
          className="relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className="relative w-64 h-80 md:w-80 md:h-96">
            {/* Scanner base */}
            <div className="w-full h-full bg-card border-4 border-lime-green rounded-3xl lime-glow overflow-hidden">
              
              {/* Fingerprint pattern */}
              <svg 
                className="w-full h-full p-8 text-lime-green opacity-80" 
                viewBox="0 0 200 250"
                fill="none"
              >
                {/* Fingerprint ridges */}
                {[...Array(8)].map((_, i) => (
                  <motion.ellipse
                    key={i}
                    cx="100"
                    cy="125"
                    rx={20 + i * 15}
                    ry={30 + i * 20}
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ 
                      pathLength: scanComplete ? 1 : progress / 100,
                      opacity: isScanning ? 0.7 : 0.3
                    }}
                    transition={{ 
                      duration: 0.3,
                      delay: i * 0.1
                    }}
                  />
                ))}
                
                {/* Central whorl */}
                <motion.circle
                  cx="100"
                  cy="125"
                  r="8"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: scanComplete ? 1 : progress / 100,
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    scale: { duration: 0.5 },
                    opacity: { duration: 2, repeat: Infinity }
                  }}
                />
              </svg>

              {/* Scanning line */}
              {isScanning && !scanComplete && (
                <motion.div
                  className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-lime-green to-transparent"
                  style={{ 
                    filter: 'blur(2px)',
                    boxShadow: '0 0 10px hsl(90 100% 50%)'
                  }}
                  animate={{ 
                    y: [-20, 320, -20],
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              )}

              {/* Success overlay */}
              {scanComplete && (
                <motion.div
                  className="absolute inset-0 bg-lime-green/20 rounded-3xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: 3 }}
                />
              )}
            </div>

            {/* Corner indicators */}
            <div className="absolute -top-3 -left-3 w-6 h-6 border-t-4 border-l-4 border-neon-blue" />
            <div className="absolute -top-3 -right-3 w-6 h-6 border-t-4 border-r-4 border-neon-blue" />
            <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-4 border-l-4 border-neon-blue" />
            <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-4 border-r-4 border-neon-blue" />

            {/* Scanning rings */}
            {isScanning && (
              <>
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-3xl border-2 border-lime-green"
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ 
                      scale: [0.8, 1.3],
                      opacity: [0.8, 0]
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </>
            )}
          </div>
        </motion.div>

        {/* Status display */}
        <div className="text-center space-y-4">
          <motion.div
            className="text-xl md:text-2xl font-mono text-lime-green terminal-text"
            animate={{ opacity: scanComplete ? 1 : [1, 0.6, 1] }}
            transition={{ duration: 1.5, repeat: scanComplete ? 0 : Infinity }}
          >
            {scanComplete ? "MATCH CONFIRMED" : `SCANNING... ${Math.round(progress)}%`}
          </motion.div>
          
          <div className="text-lg font-mono text-muted-foreground">
            {scanComplete ? "Identity verified successfully" : "Keep finger steady on scanner"}
          </div>
        </div>

        {/* Progress bar */}
        <motion.div 
          className="w-80 md:w-96 h-3 bg-muted rounded-full overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-lime-green to-neon-blue"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>

        {/* Data stream effect */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-lime-green/30 font-mono text-xs"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, -100],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "linear"
              }}
            >
              {Math.random().toString(16).substr(2, 8)}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};