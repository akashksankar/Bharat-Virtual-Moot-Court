export interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
  confidence: number;
}

export class SpeechStenographer {
  private recognition: any = null;
  private isListening = false;
  private onTranscriptCallback: ((result: SpeechRecognitionResult) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;

  constructor() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        let maxConfidence = 0.95;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          const transcriptText = res[0].transcript;
          if (res[0].confidence) {
            maxConfidence = res[0].confidence;
          }

          if (res.isFinal) {
            finalTranscript += transcriptText;
          } else {
            interimTranscript += transcriptText;
          }
        }

        if (this.onTranscriptCallback) {
          if (finalTranscript.trim().length > 0) {
            this.onTranscriptCallback({
              transcript: finalTranscript.trim(),
              isFinal: true,
              confidence: Math.round(maxConfidence * 100) / 100
            });
          } else if (interimTranscript.trim().length > 0) {
            this.onTranscriptCallback({
              transcript: interimTranscript.trim(),
              isFinal: false,
              confidence: 0.85
            });
          }
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (this.onErrorCallback) {
          this.onErrorCallback(event.error);
        }
      };

      this.recognition.onend = () => {
        // Auto-restart if still intended to listen
        if (this.isListening) {
          try {
            this.recognition.start();
          } catch (e) {
            // ignore
          }
        }
      };
    }
  }

  public isSupported(): boolean {
    return this.recognition !== null;
  }

  public start(
    onTranscript: (result: SpeechRecognitionResult) => void,
    onError?: (error: string) => void
  ) {
    this.onTranscriptCallback = onTranscript;
    this.onErrorCallback = onError || null;
    this.isListening = true;

    if (this.recognition) {
      try {
        this.recognition.start();
      } catch (e) {
        console.warn('Recognition already started or error starting:', e);
      }
    }
  }

  public stop() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
    }
  }
}

export const formatTimestamp = (date = new Date()): string => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};
