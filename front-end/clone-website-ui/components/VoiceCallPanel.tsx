'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, PhoneOff, Volume2 } from 'lucide-react';
import { speakArabic, stopSpeaking } from '@/utils/speak';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface VoiceCallPanelProps {
  onClose: () => void;
  onSendMessage?: (message: string) => Promise<string>;
}

// VAD Configuration - EXACT as specified
const VAD_CONFIG = {
  fftSize: 2048,
  smoothingTimeConstant: 0.8,
  voiceThreshold: 5,
  silenceDuration: 1000,
  maxRecordingTime: 6000,
};

// MediaRecorder Configuration - EXACT as specified
const MEDIA_RECORDER_CONFIG = {
  mimeType: 'audio/webm;codecs=opus',
  audioBitsPerSecond: 128000,
};

const AUDIO_CONSTRAINTS = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
};

export default function VoiceCallPanel({
  onClose,
  onSendMessage,
}: VoiceCallPanelProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastSpeakTimeRef = useRef<number>(Date.now());

  // Initialize greeting when component mounts
  useEffect(() => {
    console.log('═══════════════════════════════════════════');
    console.log('🎬 [VoiceCall] Component mounted - Starting initialization');
    console.log('═══════════════════════════════════════════');
    
    const greeting = 'مرحباً، أنا عون، مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟';
    setMessages([
      {
        role: 'assistant',
        content: greeting,
        timestamp: new Date(),
      },
    ]);

    console.log('🔊 [VoiceCall] Starting greeting TTS');
    console.log('📝 [VoiceCall] Greeting text:', greeting);
    
    // Speak greeting - wait longer before starting recording
    setIsSpeaking(true);
    console.log('🎤 [VoiceCall] isSpeaking set to TRUE');
    
    speakArabic(greeting, () => {
      console.log('✅ [VoiceCall] Greeting TTS finished');
      setIsSpeaking(false);
      console.log('🎤 [VoiceCall] isSpeaking set to FALSE');
      
      // Wait 1 second after greeting ends before starting recording
      console.log('⏰ [VoiceCall] Waiting 1000ms before starting recording...');
      setTimeout(() => {
        console.log('🎙️ [VoiceCall] Timeout done - calling startRecording()');
        startRecording();
      }, 1000);
    }).catch((err) => {
      console.error('❌ [VoiceCall] Greeting TTS failed:', err);
      setIsSpeaking(false);
      console.log('🎤 [VoiceCall] isSpeaking set to FALSE (after error)');
      
      // Still try to start recording after delay
      setTimeout(() => {
        console.log('🎙️ [VoiceCall] Starting recording after error...');
        startRecording();
      }, 1000);
    });

    return () => {
      console.log('🛑 [VoiceCall] Component unmounting - cleanup');
      cleanup();
    };
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    stopRecording();
    stopSpeaking();

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    if (recordingTimerRef.current) {
      clearTimeout(recordingTimerRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  }, []);

  // VAD - Voice Activity Detection
  const checkVoiceActivity = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate average amplitude
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    setAudioLevel(average);

    // Voice detected
    if (average > VAD_CONFIG.voiceThreshold) {
      lastSpeakTimeRef.current = Date.now();
      
      // Clear silence timer
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    } else {
      // Silence detected
      const silenceDuration = Date.now() - lastSpeakTimeRef.current;
      
      if (silenceDuration >= VAD_CONFIG.silenceDuration && !silenceTimerRef.current) {
        // Stop recording after silence
        stopRecording();
      }
    }

    animationFrameRef.current = requestAnimationFrame(checkVoiceActivity);
  }, []);

  // Start recording
  const startRecording = useCallback(async () => {
    console.log('───────────────────────────────────────────');
    console.log('▶️ [Recording] startRecording() called');
    console.log('🎤 [Recording] Current isSpeaking:', isSpeaking);
    console.log('📊 [Recording] Current isRecording:', isRecording);
    
    try {
      // Don't start recording if already speaking
      if (isSpeaking) {
        console.warn('⚠️ [Recording] Cannot start - still speaking!');
        console.log('🔴 [Recording] BLOCKED: isSpeaking is TRUE');
        return;
      }

      if (isRecording) {
        console.warn('⚠️ [Recording] Already recording!');
        return;
      }

      console.log('✅ [Recording] Checks passed - proceeding...');
      setError(null);
      
      // Stop any playing audio first
      console.log('🔇 [Recording] Calling stopSpeaking()...');
      stopSpeaking();
      console.log('✅ [Recording] stopSpeaking() done');
      
      // Get user media with enhanced echo cancellation
      console.log('🎤 [Recording] Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
          channelCount: 1,
        },
      });
      console.log('✅ [Recording] Microphone access granted');
      
      streamRef.current = stream;

      // Setup audio context for VAD
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = VAD_CONFIG.fftSize;
      analyserRef.current.smoothingTimeConstant = VAD_CONFIG.smoothingTimeConstant;
      source.connect(analyserRef.current);

      // Setup media recorder
      const mediaRecorder = new MediaRecorder(stream, MEDIA_RECORDER_CONFIG);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm;codecs=opus',
        });
        
        // Send to STT only if blob has data
        if (audioBlob.size > 0) {
          await processAudio(audioBlob);
        }
      };

      // Start recording
      console.log('🎙️ [Recording] Starting MediaRecorder...');
      mediaRecorder.start();
      setIsRecording(true);
      console.log('✅ [Recording] MediaRecorder started - isRecording set to TRUE');
      lastSpeakTimeRef.current = Date.now();

      // Start VAD
      console.log('👂 [Recording] Starting Voice Activity Detection...');
      checkVoiceActivity();

      // Max recording time
      console.log(`⏱️ [Recording] Setting max recording time: ${VAD_CONFIG.maxRecordingTime}ms`);
      recordingTimerRef.current = setTimeout(() => {
        console.log('⏰ [Recording] Max time reached - stopping...');
        stopRecording();
      }, VAD_CONFIG.maxRecordingTime);

      // Update recording time
      const startTime = Date.now();
      const timer = setInterval(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          setRecordingTime(Date.now() - startTime);
        } else {
          clearInterval(timer);
        }
      }, 100);

    } catch (err) {
      console.error('Failed to start recording:', err);
      setError('فشل الوصول إلى الميكروفون');
    }
  }, [checkVoiceActivity, isSpeaking]);

  // Stop recording
  const stopRecording = useCallback(() => {
    console.log('───────────────────────────────────────────');
    console.log('⏹️ [Recording] stopRecording() called');
    console.log('📊 [Recording] Current isRecording:', isRecording);
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      console.log('🛑 [Recording] Stopping MediaRecorder...');
      mediaRecorderRef.current.stop();
      console.log('✅ [Recording] MediaRecorder stopped');
    } else {
      console.log('ℹ️ [Recording] MediaRecorder not recording or null');
    }
    
    if (streamRef.current) {
      console.log('🔇 [Recording] Stopping audio tracks...');
      streamRef.current.getTracks().forEach((track) => track.stop());
      console.log('✅ [Recording] Audio tracks stopped');
    }
    
    if (animationFrameRef.current) {
      console.log('⏹️ [Recording] Canceling animation frame...');
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (recordingTimerRef.current) {
      console.log('⏹️ [Recording] Clearing recording timer...');
      clearTimeout(recordingTimerRef.current);
    }
    
    if (silenceTimerRef.current) {
      console.log('⏹️ [Recording] Clearing silence timer...');
      clearTimeout(silenceTimerRef.current);
    }

    setIsRecording(false);
    console.log('✅ [Recording] isRecording set to FALSE');
    setRecordingTime(0);
    setAudioLevel(0);
  }, [isRecording]);

  // Process audio (STT → Chat → TTS)
  const processAudio = useCallback(async (audioBlob: Blob) => {
    console.log('═══════════════════════════════════════════');
    console.log('🔄 [Process] Starting audio processing');
    console.log('📦 [Process] Audio blob size:', audioBlob.size, 'bytes');
    
    try {
      // Step 1: Speech-to-Text
      console.log('📝 [STT] Step 1: Speech-to-Text');
      const formData = new FormData();
      formData.append('audio', audioBlob);

      console.log('🌐 [STT] Sending request to /api/voice...');
      const sttResponse = await fetch('/api/voice', {
        method: 'POST',
        body: formData,
      });

      console.log('📡 [STT] Response status:', sttResponse.status);
      
      if (!sttResponse.ok) {
        throw new Error('Failed to transcribe audio');
      }

      const { text: userText } = await sttResponse.json();
      console.log('✅ [STT] Transcription successful');
      console.log('📝 [STT] User text:', userText);
      
      // Add user message
      const userMessage: Message = {
        role: 'user',
        content: userText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // Step 2: Get AI response
      console.log('🤖 [AI] Step 2: Getting AI response');
      let aiResponse: string;
      if (onSendMessage) {
        console.log('📞 [AI] Using custom onSendMessage callback');
        aiResponse = await onSendMessage(userText);
      } else {
        console.log('🌐 [AI] Using default /api/chat endpoint');
        const chatResponse = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userText }),
        });
        
        console.log('📡 [AI] Response status:', chatResponse.status);
        
        if (!chatResponse.ok) {
          throw new Error('Failed to get AI response');
        }
        
        const chatData = await chatResponse.json();
        aiResponse = chatData.response;
      }

      console.log('✅ [AI] Got AI response');
      console.log('💬 [AI] Response:', aiResponse);

      // Add AI message
      const aiMessage: Message = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      console.log('✅ [AI] Message added to chat');

      // Step 3: Text-to-Speech
      console.log('🔊 [TTS] Step 3: Text-to-Speech');
      
      // Make sure recording is stopped before speaking
      console.log('🛑 [TTS] Stopping any recording...');
      stopRecording();
      console.log('✅ [TTS] Recording stopped');
      
      console.log('🎤 [TTS] Setting isSpeaking to TRUE');
      setIsSpeaking(true);
      console.log('🔊 [TTS] Calling speakArabic()...');
      
      await speakArabic(aiResponse, () => {
        console.log('✅ [TTS] Audio finished playing');
        console.log('🎤 [TTS] Setting isSpeaking to FALSE');
        setIsSpeaking(false);
        
        // Wait longer after TTS ends before starting recording
        console.log('⏰ [TTS] Waiting 1500ms before next recording...');
        setTimeout(() => {
          console.log('🎙️ [TTS] Timeout done - calling startRecording()');
          startRecording();
        }, 1500);
      });

    } catch (err) {
      console.error('Error processing audio:', err);
      setError('حدث خطأ في معالجة الصوت');
      setIsSpeaking(false);
      
      // Retry recording after longer delay
      setTimeout(() => {
        if (!isSpeaking) {
          startRecording();
        }
      }, 2000);
    }
  }, [onSendMessage, startRecording, stopRecording, isSpeaking]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00663D] to-[#004A2C] text-white p-6 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Volume2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">مكالمة صوتية مع عون</h2>
              <p className="text-sm text-white/80">المساعد الذكي للخدمات الحكومية</p>
            </div>
          </div>
          <button
            onClick={() => {
              cleanup();
              onClose();
            }}
            className="w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl p-4 ${
                  message.role === 'user'
                    ? 'bg-[#00663D] text-white'
                    : 'bg-white text-gray-800 border-2 border-gray-200'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p
                  className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString('ar-SA', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="px-6 py-3 bg-red-50 border-t border-red-200">
            <p className="text-sm text-red-600 text-center">{error}</p>
          </div>
        )}

        {/* Controls */}
        <div className="p-6 bg-gray-50 rounded-b-2xl border-t border-gray-200">
          <div className="flex flex-col items-center gap-4">
            {/* Mic Button */}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isSpeaking}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                  : isSpeaking
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-[#00663D] hover:bg-[#004A2C] hover:scale-110'
              } shadow-lg`}
            >
              {isRecording ? (
                <MicOff className="w-8 h-8 text-white" />
              ) : (
                <Mic className="w-8 h-8 text-white" />
              )}
            </button>

            {/* Status */}
            <div className="text-center">
              {isSpeaking && (
                <p className="text-sm font-medium text-[#00663D]">جاري التحدث...</p>
              )}
              {isRecording && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-red-600">جاري التسجيل...</p>
                  <p className="text-xs text-gray-500">
                    {(recordingTime / 1000).toFixed(1)}s / {VAD_CONFIG.maxRecordingTime / 1000}s
                  </p>
                  {/* Audio Level Indicator */}
                  <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00663D] transition-all duration-100"
                      style={{ width: `${Math.min(100, (audioLevel / 50) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
              {!isRecording && !isSpeaking && (
                <p className="text-sm text-gray-500">اضغط على الميكروفون للتحدث</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
