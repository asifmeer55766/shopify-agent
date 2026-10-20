'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function AgentTTSPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(75); // ~1m 15s default until metadata loads
  const [isMuted, setIsMuted] = useState(false);
  const [userName, setUserName] = useState('asif');
  const [audioLoaded, setAudioLoaded] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize and load user data
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user?.email) {
          const namePart = data.user.email.split('@')[0];
          setUserName(namePart);
        }
      })
      .catch(() => {});

    // Create real HTML5 Audio element
    const audio = new Audio('/api/tts-briefing/urdu-audio');
    audio.preload = 'auto';

    audio.onloadedmetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(Math.floor(audio.duration));
      }
      setAudioLoaded(true);
    };

    audio.ontimeupdate = () => {
      setCurrentTime(Math.floor(audio.currentTime));
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(Math.floor(audio.duration));
      }
    };

    audio.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Toggle Play / Pause
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => {
        console.warn('Audio play error:', err);
      });
    }
  };

  // Scrub / Seek
  const handleSeek = (newSeconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const clamped = Math.max(0, Math.min(newSeconds, duration));
    audio.currentTime = clamped;
    setCurrentTime(clamped);
  };

  // Skip Forward / Back
  const handleSkip = (deltaSeconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const target = Math.max(0, Math.min(audio.currentTime + deltaSeconds, duration));
    audio.currentTime = target;
    setCurrentTime(target);
  };

  // Toggle Mute
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audio.muted = nextMuted;
  };

  // Format mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      {/* 1. Header Bar matching screenshot */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Daily Business Briefing
          </h1>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#046a4e] border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-[#046a4e]" />
          Live Briefing
        </span>
      </div>

      {/* 2. Main Hero Audio Card (Only this part in full entire page) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-xs relative overflow-hidden transition-all">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Left: Glowing Animated Agent Avatar with Waveforms */}
          <div className="relative flex items-center justify-center shrink-0">
            {/* Left Soundwave Bars */}
            <div className="flex items-center gap-1 mr-3 h-12">
              <span className={`w-1 rounded-full bg-emerald-400 transition-all ${isPlaying ? 'h-6 animate-pulse' : 'h-2'}`} />
              <span className={`w-1 rounded-full bg-teal-400 transition-all ${isPlaying ? 'h-10 animate-pulse' : 'h-4'}`} />
              <span className={`w-1 rounded-full bg-cyan-400 transition-all ${isPlaying ? 'h-8 animate-pulse' : 'h-3'}`} />
              <span className={`w-1 rounded-full bg-emerald-400 transition-all ${isPlaying ? 'h-4 animate-pulse' : 'h-2'}`} />
            </div>

            {/* Glowing Center Avatar Circle */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center bg-gradient-to-tr from-cyan-400 via-emerald-400 to-teal-300 p-1 shadow-lg shadow-emerald-500/15">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center relative overflow-hidden border-2 border-white/60">
                {/* Glowing ring pulse */}
                <div className={`absolute inset-0 bg-emerald-500/20 rounded-full ${isPlaying ? 'animate-ping' : ''}`} />

                {/* Friendly AI Face */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="flex items-center gap-4 mb-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-300" />
                    <span className="w-2 h-2 rounded-full bg-cyan-300" />
                  </div>
                  <div className="w-4 h-2 rounded-b-full border-b-2 border-cyan-300" />
                </div>

                {/* Headphone Arc */}
                <div className="absolute top-2.5 w-16 h-8 border-t-2 border-cyan-300 rounded-t-full opacity-60" />
              </div>
            </div>

            {/* Right Soundwave Bars */}
            <div className="flex items-center gap-1 ml-3 h-12">
              <span className={`w-1 rounded-full bg-emerald-400 transition-all ${isPlaying ? 'h-4 animate-pulse' : 'h-2'}`} />
              <span className={`w-1 rounded-full bg-cyan-400 transition-all ${isPlaying ? 'h-8 animate-pulse' : 'h-3'}`} />
              <span className={`w-1 rounded-full bg-teal-400 transition-all ${isPlaying ? 'h-10 animate-pulse' : 'h-4'}`} />
              <span className={`w-1 rounded-full bg-emerald-400 transition-all ${isPlaying ? 'h-6 animate-pulse' : 'h-2'}`} />
            </div>
          </div>

          {/* Right: Greeting Narrative & Audio Controller */}
          <div className="flex-1 space-y-3.5 text-center md:text-left w-full">
            <div>
              <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                AI AGENT
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Good morning, {userName}!
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
              I&apos;m analyzing your store&apos;s performance and will guide you through today&apos;s key insights. Let&apos;s start with your sales performance.
            </p>

            {/* Audio Controller Bar */}
            <div className="pt-2 flex items-center gap-3.5 w-full">
              {/* Play / Pause Circular Button */}
              <button
                onClick={togglePlayPause}
                className="w-12 h-12 rounded-full bg-[#046a4e] hover:bg-[#03543e] text-white flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                title={isPlaying ? 'Pause' : 'Play Urdu Audio Briefing'}
              >
                {isPlaying ? (
                  <span className="text-sm font-bold">❚❚</span>
                ) : (
                  <span className="text-lg font-bold ml-0.5">▶</span>
                )}
              </button>

              {/* Progress Scrubber Bar */}
              <div className="flex-1 relative flex items-center">
                <input
                  type="range"
                  min={0}
                  max={duration || 75}
                  value={currentTime}
                  onChange={(e) => handleSeek(Number(e.target.value))}
                  className="w-full accent-[#046a4e] h-2 bg-slate-100 rounded-lg cursor-pointer"
                />
              </div>

              {/* Time Indicator */}
              <span className="text-xs font-mono text-slate-500 font-semibold shrink-0">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              {/* 15s Rewind */}
              <button
                onClick={() => handleSkip(-15)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Rewind 15 seconds"
              >
                <span className="text-xs font-bold">↺ 15</span>
              </button>

              {/* 15s Forward */}
              <button
                onClick={() => handleSkip(15)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Forward 15 seconds"
              >
                <span className="text-xs font-bold">↻ 15</span>
              </button>

              {/* Mute / Unmute Volume Toggle */}
              <button
                onClick={toggleMute}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                <span className="text-base">{isMuted ? '🔇' : '🔊'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
