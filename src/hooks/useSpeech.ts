import { useCallback, useEffect, useState } from 'react';

interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: string;
  onComplete?: () => void;
}

export const useSpeech = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);

      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices();
        console.log("Available voices:", availableVoices);
        setVoices(availableVoices);
      };

      speechSynthesis.addEventListener('voiceschanged', loadVoices);
      loadVoices();

      return () => {
        speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      };
    }
  }, []);

  const speak = useCallback((text: string, options: SpeechOptions = {}) => {
    if (!isSupported) {
      console.warn('Speech synthesis not supported in this browser.');
      return;
    }

    if (!text) return;

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // 🎤 Event-host style: lively and confident
    utterance.rate = options.rate || 1.1;
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 1.0;

    if (voices.length > 0) {
      let selectedVoice: SpeechSynthesisVoice | undefined;

      // If user specified a voice by name
      if (options.voice) {
        selectedVoice = voices.find(v => v.name === options.voice);
      }

      // 🏴 Prefer London / UK female voice
      if (!selectedVoice) {
        selectedVoice =
          voices.find(v =>
            (v.lang === 'en-GB' || v.lang.startsWith('en-GB')) &&
            v.name.toLowerCase().includes('female')
          ) ||

          // Looser match: any UK English voice
          voices.find(v => v.lang.startsWith('en-GB')) ||

          // Fallback: any English female
          voices.find(v =>
            v.lang.startsWith('en') &&
            v.name.toLowerCase().includes('female')
          ) ||

          // Fallback: any English voice
          voices.find(v => v.lang.startsWith('en')) ||

          // Final fallback
          voices[0];
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('🎙️ Using voice:', selectedVoice.name, '| Lang:', selectedVoice.lang);
      } else {
        console.warn('No UK female voice found. Using fallback.');
      }
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      options.onComplete?.();
    };
    utterance.onerror = (e) => {
      console.error('SpeechSynthesis error:', e.error);
      setIsSpeaking(false);
      options.onComplete?.();
    };

    speechSynthesis.speak(utterance);
  }, [isSupported, voices]);

  const cancel = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return {
    speak,
    cancel,
    isSpeaking,
    isSupported,
    voices,
  };
};
