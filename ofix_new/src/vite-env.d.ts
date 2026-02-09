/// <reference types="vite/client" />

// Non-standard browser APIs used by voice features.
// We keep these as `any` to avoid blocking migration; tighten later if needed.
interface Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
}
