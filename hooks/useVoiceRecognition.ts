import { useState, useEffect, useCallback, useRef } from 'react';

// TypeScript definitions for the Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

// FIX: Added 'resultIndex' to the SpeechRecognitionEvent interface to match the API.
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

// FIX: Rewrote the hook to be more robust, prevent memory leaks, and fix a bug
// where manually stopping recognition would cause it to immediately restart.
export const useVoiceRecognition = (onTranscript: (transcript: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isListeningRef = useRef(false);

  // Use a ref for the callback to provide the latest value
  // to the event handlers without needing to re-create them on every render.
  const onTranscriptRef = useRef(onTranscript);
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  // Setup the SpeechRecognition instance and its event listeners once on component mount.
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech Recognition API is not supported in this browser.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        onTranscriptRef.current(finalTranscript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error(`Speech recognition error: ${event.error}`);
      isListeningRef.current = false;
      setIsListening(false); // Ensure we transition out of listening state on error.
    };
    
    recognition.onend = () => {
      // The browser's speech recognition can time out. If the ref indicates we should
      // still be listening, we automatically restart it.
      if (isListeningRef.current) {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;

    // Cleanup function to stop recognition and remove listeners on unmount.
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
      }
    };
  }, []); // Empty dependency array ensures this setup runs only once.

  const toggleListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    const shouldBeListening = !isListeningRef.current;
    isListeningRef.current = shouldBeListening;
    setIsListening(shouldBeListening);

    if (shouldBeListening) {
      recognition.start();
    } else {
      recognition.stop();
    }
  }, []); // This callback is stable and won't change across renders.

  return { isListening, toggleListening, hasRecognitionSupport: !!(window.SpeechRecognition || window.webkitSpeechRecognition) };
};
