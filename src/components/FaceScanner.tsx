import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import { useSpeech } from '../hooks/useSpeech';

interface FaceScannerProps {
  onComplete: () => void;
}

export const FaceScanner = ({ onComplete }: FaceScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const webcamRef = useRef<Webcam>(null);
  const { speak } = useSpeech();

  useEffect(() => {
    // Start scanning after component mounts
    const timer = setTimeout(() => {
      setIsScanning(true);
      speak("Please position your face within the scanning frame");
    }, 1000);

    return () => clearTimeout(timer);
  }, [speak]);

  useEffect(() => {
    if (!isScanning) return;

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          // Trigger flash effect
          setShowFlash(true);
          speak("Face captured successfully. Proceeding to second stage of authentication", {
            onComplete: () => {
              setTimeout(() => {
                setShowFlash(false);
                onComplete();
              }, 500);
            }
          });
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isScanning, onComplete, speak]);

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-background overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-radial from-neon-blue/10 via-transparent to-transparent" />
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        
        {/* Title */}
        <motion.h1 
          className="text-4xl md:text-6xl font-orbitron font-bold text-neon-blue biometric-text"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          FACIAL RECOGNITION
        </motion.h1>

        {/* Scanning frame */}
        <motion.div 
          className="relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className="relative w-80 h-80 md:w-96 md:h-96">
            {/* Webcam */}
            <Webcam
              ref={webcamRef}
              className="w-full h-full object-cover rounded-full"
              videoConstraints={{
                width: 640,
                height: 640,
                facingMode: "user"
              }}
            />
            
            {/* Scanning overlay */}
            <div className="absolute inset-0 rounded-full border-4 border-neon-blue neon-glow">
              {/* Corner brackets */}
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-lime-green" />
              <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-lime-green" />
              <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-lime-green" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-lime-green" />
            </div>

            {/* Scanning rings */}
            {isScanning && (
              <>
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full border-2 border-neon-blue"
                    initial={{ scale: 0, opacity: 0.8 }}
                    animate={{ 
                      scale: [0, 1.5],
                      opacity: [0.8, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.6,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </>
            )}
          </div>
        </motion.div>

        {/* Status and countdown */}
        <div className="text-center space-y-4">
          <motion.div
            className="text-xl md:text-2xl font-mono text-lime-green terminal-text"
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {isScanning ? `SCANNING... ${countdown}` : "INITIALIZING CAMERA..."}
          </motion.div>
          
          <div className="text-lg font-mono text-muted-foreground">
            Position your face within the frame
          </div>
        </div>

        {/* Progress bar */}
        {isScanning && (
          <motion.div 
            className="w-80 md:w-96 h-2 bg-muted rounded-full overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-neon-blue to-lime-green"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 5, ease: "linear" }}
            />
          </motion.div>
        )}
      </div>

      {/* Flash effect */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            className="flash-effect"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          />
        )}
      </AnimatePresence>

      {/* Grid background effect */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-20 grid-rows-20 w-full h-full">
          {[...Array(400)].map((_, i) => (
            <div key={i} className="border border-neon-blue" />
          ))}
        </div>
      </div>
    </div>
  );
};