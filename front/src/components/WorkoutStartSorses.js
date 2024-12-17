import { useRef, useEffect } from 'react';

// משפטי עידוד
export const ENCOURAGEMENT_PHRASES = [
  "כל הכבוד! תמשיך ככה!",
  "אתה עושה עבודה מעולה!",
  "תותח! עוד קצת!",
  "אתה נותן בראש!",
  "וואו, איזה ביצועים!"
];

// הוק לטיפול בשמע
export const useAudio = () => {
  const audioContext = useRef(null);
  const beepSound = useRef(null);

  useEffect(() => {
    // יצירת אודיו קונטקסט
    audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    
    // יצירת צליל ביפ
    const createBeep = (frequency = 880) => {
      const oscillator = audioContext.current.createOscillator();
      const gainNode = audioContext.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.current.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gainNode.gain.value = 0.1;
      
      return { oscillator, gainNode };
    };
    
    beepSound.current = createBeep;
  }, []);

  const playBeep = (duration = 100, frequency = 880) => {
    if (audioContext.current?.state === 'suspended') {
      audioContext.current.resume();
    }
    
    const { oscillator, gainNode } = beepSound.current(frequency);
    
    oscillator.start(audioContext.current.currentTime);
    oscillator.stop(audioContext.current.currentTime + duration / 1000);
    
    setTimeout(() => {
      oscillator.disconnect();
      gainNode.disconnect();
    }, duration + 50);
  };

  const playFinishSound = () => {
    playBeep(150, 880);  // גבוה
    setTimeout(() => playBeep(150, 660), 200);  // בינוני
    setTimeout(() => playBeep(250, 440), 400);  // נמוך
  };

  return { playBeep, playFinishSound };
};

// הוק לטיפול בדיבור
export const useSpeech = () => {
  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }, []);

  const speakText = (text) => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    
    const hebrewVoice = voices.find(voice => 
      voice.lang.includes('he') || 
      voice.name.includes('Hebrew') || 
      voice.name.includes('Microsoft David')
    );

    if (hebrewVoice) {
      utterance.voice = hebrewVoice;
    }

    utterance.lang = 'he-IL';
    utterance.rate = 0.85;
    utterance.pitch = 1.1;
    utterance.volume = 1;

    window.speechSynthesis.onvoiceschanged = () => {
      const updatedVoices = window.speechSynthesis.getVoices();
      const updatedHebrewVoice = updatedVoices.find(voice => 
        voice.lang.includes('he') || 
        voice.name.includes('Hebrew') || 
        voice.name.includes('Microsoft David')
      );
      
      if (updatedHebrewVoice) {
        utterance.voice = updatedHebrewVoice;
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  return { speakText };
};

// פונקציית עזר לפורמט זמן
export const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};