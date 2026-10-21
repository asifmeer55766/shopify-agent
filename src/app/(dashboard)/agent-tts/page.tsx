'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function AgentTTSPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(75); // ~1m 15s default until metadata loads
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    // Create real HTML5 Audio element
    const audio = new Audio('/api/tts-briefing/urdu-audio');
    audio.preload = 'auto';

    audio.onloadedmetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(Math.floor(audio.duration));
      }
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

  // Cycle Playback Speed
  const cyclePlaybackRate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const speeds = [1, 1.25, 1.5];
    const nextIndex = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const nextSpeed = speeds[nextIndex];
    setPlaybackRate(nextSpeed);
    audio.playbackRate = nextSpeed;
  };

  // Format mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-[calc(100vh-5.5rem)] flex flex-col justify-center items-center py-6 px-4 relative overflow-hidden">
      {/* Dynamic Keyframe Animations */}
      <style jsx>{`
        @keyframes rippleWave {
          0% {
            transform: scale(0.9);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.35);
            opacity: 0.35;
          }
          100% {
            transform: scale(1.75);
            opacity: 0;
          }
        }
        @keyframes avatarFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        @keyframes mouthTalkLoop {
          0%, 100% {
            height: 4px;
            width: 24px;
            border-radius: 9999px;
          }
          20% {
            height: 18px;
            width: 28px;
            border-radius: 14px;
          }
          40% {
            height: 8px;
            width: 32px;
            border-radius: 9999px;
          }
          60% {
            height: 24px;
            width: 26px;
            border-radius: 16px;
          }
          80% {
            height: 12px;
            width: 30px;
            border-radius: 12px;
          }
        }
        @keyframes eyeGlow {
          0%, 100% {
            opacity: 0.9;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.15);
          }
        }
        @keyframes barPulse1 {
          0%, 100% { height: 12px; }
          50% { height: 48px; }
        }
        @keyframes barPulse2 {
          0%, 100% { height: 20px; }
          50% { height: 64px; }
        }
        @keyframes barPulse3 {
          0%, 100% { height: 8px; }
          50% { height: 36px; }
        }
        @keyframes barPulse4 {
          0%, 100% { height: 24px; }
          50% { height: 56px; }
        }
        .anim-float {
          animation: avatarFloat 4s ease-in-out infinite;
        }
        .anim-mouth {
          animation: mouthTalkLoop 0.45s ease-in-out infinite;
        }
        .anim-eye {
          animation: eyeGlow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Ambient Radial Background Glow when Talking */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-1000 flex items-center justify-center ${isPlaying ? 'opacity-100' : 'opacity-25'
          }`}
      >
        <div className="w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full bg-gradient-to-tr from-emerald-500/15 via-teal-400/20 to-cyan-500/15 blur-3xl transform -translate-y-12" />
      </div>

      {/* Main Full-Page Experience Card */}
      <div className="w-full max-w-3xl bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-sm relative z-10 flex flex-col items-center text-center space-y-8">



        {/* Hero Talking Agent Avatar with Surrounding Visualizer Bars */}
        <div className="relative flex items-center justify-center w-full py-4">

          {/* Left Equalizer Waveform Bars (Large) */}
          <div className="hidden sm:flex items-center gap-1.5 mr-6 h-24">
            <span
              className="w-1.5 rounded-full bg-gradient-to-t from-emerald-500 to-teal-400 transition-all duration-150"
              style={{
                animation: isPlaying ? 'barPulse1 0.6s ease-in-out infinite 0.1s' : 'none',
                height: isPlaying ? undefined : '14px',
              }}
            />
            <span
              className="w-1.5 rounded-full bg-gradient-to-t from-teal-500 to-cyan-400 transition-all duration-150"
              style={{
                animation: isPlaying ? 'barPulse2 0.7s ease-in-out infinite 0.3s' : 'none',
                height: isPlaying ? undefined : '20px',
              }}
            />
            <span
              className="w-1.5 rounded-full bg-gradient-to-t from-cyan-500 to-blue-400 transition-all duration-150"
              style={{
                animation: isPlaying ? 'barPulse3 0.5s ease-in-out infinite 0.2s' : 'none',
                height: isPlaying ? undefined : '10px',
              }}
            />
            <span
              className="w-1.5 rounded-full bg-gradient-to-t from-emerald-500 to-cyan-400 transition-all duration-150"
              style={{
                animation: isPlaying ? 'barPulse4 0.65s ease-in-out infinite 0.4s' : 'none',
                height: isPlaying ? undefined : '16px',
              }}
            />
          </div>

          {/* Central Animated Avatar Container with Concentric Ripple Waves */}
          <div className="relative flex items-center justify-center">

            {/* Concentric Audio Ripple Wave 1 */}
            {isPlaying && (
              <div
                className="absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full border-2 border-emerald-400/40 pointer-events-none"
                style={{ animation: 'rippleWave 2.2s cubic-bezier(0, 0.2, 0.8, 1) infinite' }}
              />
            )}

            {/* Concentric Audio Ripple Wave 2 */}
            {isPlaying && (
              <div
                className="absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full border-2 border-cyan-400/30 pointer-events-none"
                style={{ animation: 'rippleWave 2.2s cubic-bezier(0, 0.2, 0.8, 1) infinite 0.7s' }}
              />
            )}

            {/* Concentric Audio Ripple Wave 3 */}
            {isPlaying && (
              <div
                className="absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full border-2 border-teal-400/20 pointer-events-none"
                style={{ animation: 'rippleWave 2.2s cubic-bezier(0, 0.2, 0.8, 1) infinite 1.4s' }}
              />
            )}

            {/* Main Avatar Body (Much Bigger: 220px to 256px) */}
            <div
              className={`relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full p-1.5 transition-all duration-500 ${isPlaying
                ? 'anim-float bg-gradient-to-tr from-cyan-400 via-emerald-400 to-teal-300 shadow-2xl shadow-emerald-500/30 scale-105'
                : 'bg-gradient-to-tr from-slate-200 via-slate-300 to-slate-200 shadow-lg'
                }`}
            >
              {/* Dark High-Tech Face Screen */}
              <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden border-4 border-white/80 shadow-inner">

                {/* Ambient Screen Grid Texture */}
                <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

                {/* Overhead Headphone Arc */}
                <div
                  className={`absolute top-4 sm:top-5 w-28 sm:w-36 h-12 border-t-4 rounded-t-full transition-all duration-300 ${isPlaying ? 'border-cyan-400 opacity-90' : 'border-slate-600 opacity-40'
                    }`}
                />

                {/* Left & Right Glowing Headphone Ear Cups */}
                <div
                  className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3 sm:w-4 h-10 sm:h-12 rounded-full transition-all duration-300 ${isPlaying ? 'bg-cyan-400 shadow-md shadow-cyan-400/50' : 'bg-slate-700'
                    }`}
                />
                <div
                  className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-3 sm:w-4 h-10 sm:h-12 rounded-full transition-all duration-300 ${isPlaying ? 'bg-cyan-400 shadow-md shadow-cyan-400/50' : 'bg-slate-700'
                    }`}
                />

                {/* Glowing AI Eyes */}
                <div className="relative z-10 flex items-center gap-7 sm:gap-9 mb-4">
                  {/* Left Eye */}
                  <div
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${isPlaying
                      ? 'anim-eye bg-cyan-300 shadow-[0_0_12px_#22d3ee]'
                      : 'bg-slate-400'
                      }`}
                  />
                  {/* Right Eye */}
                  <div
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${isPlaying
                      ? 'anim-eye bg-cyan-300 shadow-[0_0_12px_#22d3ee]'
                      : 'bg-slate-400'
                      }`}
                  />
                </div>

                {/* Dynamic Talking Mouth Animation */}
                <div className="relative z-10 flex items-center justify-center h-8">
                  {isPlaying ? (
                    <div className="anim-mouth bg-gradient-to-r from-cyan-300 via-emerald-300 to-cyan-300 shadow-[0_0_10px_#34d399]" />
                  ) : (
                    <div className="w-6 h-2 rounded-b-full border-b-2 border-slate-400" />
                  )}
                </div>

                {/* Sub-avatar Frequency Wavelet */}
                <div className="absolute bottom-5 sm:bottom-6 flex items-center gap-1 opacity-70">
                  <span className={`w-1 rounded-full bg-cyan-400 ${isPlaying ? 'h-3 animate-pulse' : 'h-1'}`} />
                  <span className={`w-1 rounded-full bg-emerald-400 ${isPlaying ? 'h-5 animate-pulse' : 'h-1.5'}`} />
                  <span className={`w-1 rounded-full bg-teal-400 ${isPlaying ? 'h-3 animate-pulse' : 'h-1'}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Equalizer Waveform Bars (Large) */}
          <div className="hidden sm:flex items-center gap-1.5 ml-6 h-24">
            <span
              className="w-1.5 rounded-full bg-gradient-to-t from-emerald-500 to-cyan-400 transition-all duration-150"
              style={{
                animation: isPlaying ? 'barPulse4 0.65s ease-in-out infinite 0.4s' : 'none',
                height: isPlaying ? undefined : '16px',
              }}
            />
            <span
              className="w-1.5 rounded-full bg-gradient-to-t from-cyan-500 to-blue-400 transition-all duration-150"
              style={{
                animation: isPlaying ? 'barPulse3 0.5s ease-in-out infinite 0.2s' : 'none',
                height: isPlaying ? undefined : '10px',
              }}
            />
            <span
              className="w-1.5 rounded-full bg-gradient-to-t from-teal-500 to-cyan-400 transition-all duration-150"
              style={{
                animation: isPlaying ? 'barPulse2 0.7s ease-in-out infinite 0.3s' : 'none',
                height: isPlaying ? undefined : '20px',
              }}
            />
            <span
              className="w-1.5 rounded-full bg-gradient-to-t from-emerald-500 to-teal-400 transition-all duration-150"
              style={{
                animation: isPlaying ? 'barPulse1 0.6s ease-in-out infinite 0.1s' : 'none',
                height: isPlaying ? undefined : '14px',
              }}
            />
          </div>
        </div>

        {/* Full Interactive Audio Controller Deck */}
        <div className="w-full max-w-xl bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-2xs">

          {/* Scrubber Slider & Timestamp */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 font-medium">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={duration || 75}
              value={currentTime}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="w-full accent-[#046a4e] h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center justify-between gap-3 pt-1">

            {/* Speed Toggle */}
            <button
              onClick={cyclePlaybackRate}
              className="px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition-colors cursor-pointer"
              title="Change Playback Speed"
            >
              {playbackRate}x
            </button>

            {/* Center Controls: Rewind, Play/Pause, Forward */}
            <div className="flex items-center gap-3">
              {/* 15s Rewind */}
              <button
                onClick={() => handleSkip(-15)}
                className="p-2.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition-colors cursor-pointer"
                title="Rewind 15 seconds"
              >
                <span className="text-xs font-bold">↺ 15s</span>
              </button>

              {/* Main Play / Pause Hero Button */}
              <button
                onClick={togglePlayPause}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-md transition-all transform hover:scale-105 active:scale-95 cursor-pointer ${isPlaying
                  ? 'bg-[#046a4e] hover:bg-[#03543e] ring-4 ring-emerald-500/20'
                  : 'bg-[#046a4e] hover:bg-[#03543e]'
                  }`}
                title={isPlaying ? 'Pause' : 'Play Urdu Audio Briefing'}
              >
                {isPlaying ? (
                  <span className="text-base font-bold">❚❚</span>
                ) : (
                  <span className="text-xl font-bold ml-1">▶</span>
                )}
              </button>

              {/* 15s Forward */}
              <button
                onClick={() => handleSkip(15)}
                className="p-2.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition-colors cursor-pointer"
                title="Forward 15 seconds"
              >
                <span className="text-xs font-bold">↻ 15s</span>
              </button>
            </div>

            {/* Mute / Unmute Toggle */}
            <button
              onClick={toggleMute}
              className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition-colors cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              <span className="text-base">{isMuted ? '🔇' : '🔊'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
