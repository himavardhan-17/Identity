import { motion } from 'framer-motion';

interface SACLogoProps {
  className?: string;
}

export const SACLogo = ({ className = '' }: SACLogoProps) => {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <motion.div
        className="relative z-10"
        animate={{ 
          scale: [1, 1.05, 1],
          filter: [
            "drop-shadow(0 0 10px hsl(195 100% 50%))",
            "drop-shadow(0 0 20px hsl(195 100% 50%)) drop-shadow(0 0 30px hsl(90 100% 50%))",
            "drop-shadow(0 0 10px hsl(195 100% 50%))"
          ]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <img 
          src="/lovable-uploads/90534ee6-d66b-4564-8e69-a776dba993b7.png" 
          alt="SAC Logo" 
          className="w-24 h-24 md:w-32 md:h-32 object-contain"
        />
      </motion.div>
      
      {/* Rotating glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'conic-gradient(from 0deg, transparent, hsl(195 100% 50%), transparent)',
          filter: 'blur(8px)',
        }}
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      />
      
      {/* Pulsing base glow */}
      <motion.div
        className="absolute inset-0 rounded-full bg-neon-blue opacity-20"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        style={{ filter: 'blur(15px)' }}
      />
    </motion.div>
  );
};