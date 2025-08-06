import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeech } from '../hooks/useSpeech';
import { SACLogo } from '../components/SACLogo';
import { FaceScanner } from '../components/FaceScanner';
import { FingerprintScanner } from '../components/FingerprintScanner';
import { CountdownTimer } from '../components/CountdownTimer';

type AuthStep = 'welcome' | 'face' | 'fingerprint' | 'countdown' | 'launch' | 'complete';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<AuthStep>('welcome');

  const nextStep = () => {
    switch (currentStep) {
      case 'welcome':
        setCurrentStep('face');
        break;
      case 'face':
        setCurrentStep('fingerprint');
        break;
      case 'fingerprint':
        setCurrentStep('countdown');
        break;
      case 'countdown':
        setCurrentStep('launch');
        break;
      case 'launch':
        setCurrentStep('complete');
        break;
    }
  };

  // ✅ ONLY WelcomeScreen has the video background
  const WelcomeScreen = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* 🔥 Video Background */}
      <video
        className="fixed top-0 left-0 w-full h-full object-cover z-[-2]"
        src="/main.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      {/* Optional overlay for visibility */}
      <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-[-1]" />

      {/* Grid background animation */}
      <div className="absolute inset-0 opacity-5 z-10">
        <div className="grid grid-cols-20 grid-rows-15 w-full h-full">
          {[...Array(300)].map((_, i) => (
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
                duration: 3, 
                repeat: Infinity, 
                delay: i * 0.01 
              }}
            />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-20 text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <h1 className="text-6xl md:text-8xl font-orbitron font-black text-neon-blue mb-6 biometric-text">
            SAC WEB LAUNCH
          </h1>
          <h2 className="text-5xl md:text-7xl font-orbitron font-black text-lime-green mb-8 biometric-text">
            AUTHENTICATION
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-neon-blue to-lime-green mx-auto mb-8 neon-glow" />
          <p className="text-xl md:text-2xl font-mono text-muted-foreground max-w-2xl">
            Advanced Security System
          </p>
        </motion.div>

        <motion.button
          className="px-12 py-6 bg-gradient-to-r from-neon-blue to-lime-green text-black font-orbitron font-bold text-xl rounded-xl neon-glow hover:scale-105 transition-transform duration-300"
          onClick={nextStep}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          INITIALIZE SCAN
        </motion.button>

        {/* Floating data particles */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-neon-blue/30 font-mono text-xs"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, -150],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: "linear"
              }}
            >
              {Math.random().toString(16).substr(2, 6).toUpperCase()}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const LaunchScreen = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-lime-green/20 via-transparent to-transparent z-10" />
      <div className="text-center space-y-12 z-20 relative">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl md:text-7xl font-orbitron font-black text-lime-green biometric-text mb-8">
            WELCOME Dr. M D ASIF
          </h1>
          <h2 className="text-3xl md:text-5xl font-orbitron font-bold text-neon-blue biometric-text mb-12">
            DEAN Student Affairs  
          </h2>
          <p className="text-xl md:text-2xl font-mono text-muted-foreground mb-16">
            Waiting for your order to launch web
          </p>
        </motion.div>

        <motion.button
          className="px-16 py-8 bg-gradient-to-r from-lime-green to-neon-blue text-black font-orbitron font-bold text-2xl rounded-xl neon-glow hover:scale-105 transition-transform duration-300"
          onClick={nextStep}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          LAUNCH WEB
        </motion.button>
      </div>
    </div>
  );

  const CompleteScreen = () => {
    const { speak } = useSpeech();

    useEffect(() => {
      const timer = setTimeout(() => {
        speak("Web launched successfully. Redirecting to SAC portal", {
          onComplete: () => {
            setTimeout(() => {
              window.location.href = "https://sac.example.com";
            }, 2000);
          }
        });
      }, 1000);

      return () => clearTimeout(timer);
    }, [speak]);

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
        <div className="text-center space-y-8 z-20 relative">
          <motion.h1 
            className="text-6xl md:text-8xl font-orbitron font-black text-lime-green biometric-text"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: "spring", bounce: 0.3 }}
          >
            WEB LAUNCHED
          </motion.h1>
          <motion.div
            className="w-32 h-32 rounded-full border-4 border-lime-green mx-auto flex items-center justify-center lime-glow"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <svg className="w-16 h-16 text-lime-green" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </motion.div>
          <motion.p 
            className="text-xl font-mono text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Redirecting to SAC Portal...
          </motion.p>
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      {/* SAC Logo - Global Background */}
      <div className="fixed inset-0 flex items-center justify-center opacity-10 z-0 pointer-events-none">
        <SACLogo className="scale-[3]" />
      </div>

      {/* AnimatePresence handles transitions between screens */}
      <AnimatePresence mode="wait">
        {currentStep === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <WelcomeScreen />
          </motion.div>
        )}

        {currentStep === 'face' && (
          <motion.div
            key="face"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.7 }}
          >
            <FaceScanner onComplete={nextStep} />
          </motion.div>
        )}

        {currentStep === 'fingerprint' && (
          <motion.div
            key="fingerprint"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.7 }}
          >
            <FingerprintScanner onComplete={nextStep} />
          </motion.div>
        )}

        {currentStep === 'countdown' && (
          <motion.div
            key="countdown"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.7 }}
          >
            <CountdownTimer onComplete={nextStep} />
          </motion.div>
        )}

        {currentStep === 'launch' && (
          <motion.div
            key="launch"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.7 }}
          >
            <LaunchScreen />
          </motion.div>
        )}

        {currentStep === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <CompleteScreen />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
