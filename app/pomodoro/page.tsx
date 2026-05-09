"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";

export default function PomodoroPage() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState<"work" | "break">("work");
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const WORK_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;
  const LONG_BREAK_TIME = 15 * 60;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      playSound();
      if (sessionType === "work") {
        setSessionsCompleted((prev) => prev + 1);
        const isLongBreak = (sessionsCompleted + 1) % 4 === 0;
        setSessionType("break");
        setTimeLeft(isLongBreak ? LONG_BREAK_TIME : BREAK_TIME);
      } else {
        setSessionType("work");
        setTimeLeft(WORK_TIME);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, sessionType, sessionsCompleted]);

  const playSound = () => {
    if (!isMuted) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const resetSession = () => {
    setIsRunning(false);
    setTimeLeft(WORK_TIME);
    setSessionType("work");
    setSessionsCompleted(0);
  };

  const progress = sessionType === "work"
    ? 100 - (timeLeft / WORK_TIME) * 100
    : 100 - (timeLeft / BREAK_TIME) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-red-500/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="px-8 pt-12 pb-8 border-b border-slate-700/30">
          <div className="max-w-2xl mx-auto">
            <div className="mb-2 text-sm font-medium text-red-400 tracking-wider uppercase">
              Focus Timer
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-3">
              <span className="bg-gradient-to-r from-red-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent">
                Pomodoro Timer
              </span>
            </h1>
            <p className="text-slate-400 text-lg">
              Stay focused with the Pomodoro Technique. 25 min work + 5 min break.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-8 py-12">
          <div className="max-w-2xl mx-auto">
            {/* Timer Circle */}
            <div className="mb-12 flex justify-center">
              <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Background Circle */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl"></div>

                {/* Progress Circle */}
                <svg className="absolute inset-0 w-full h-full" style={{ transform: "rotate(-90deg)" }}>
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeDasharray={`${(progress / 100) * 754} 754`}
                    style={{ transition: "stroke-dasharray 1s linear" }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={sessionType === "work" ? "#ef4444" : "#10b981"} />
                      <stop offset="100%" stopColor={sessionType === "work" ? "#f97316" : "#34d399"} />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Timer Text */}
                <div className="relative z-10 text-center">
                  <p className="text-slate-400 text-sm mb-2 uppercase tracking-wider">
                    {sessionType === "work" ? "Work Time" : "Break Time"}
                  </p>
                  <p className="text-6xl font-bold text-white font-mono">{formatTime(timeLeft)}</p>
                  <p className="text-slate-400 text-sm mt-2">
                    Session {sessionsCompleted + 1}
                  </p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4 justify-center mb-12">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`flex items-center gap-2 px-8 py-4 rounded-lg font-semibold transition-all ${
                  isRunning
                    ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                    : "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Start
                  </>
                )}
              </button>

              <button
                onClick={resetSession}
                className="flex items-center gap-2 px-8 py-4 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white hover:border-slate-600/50 transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="flex items-center gap-2 px-6 py-4 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white hover:border-slate-600/50 transition-all"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 text-center">
                <p className="text-slate-400 mb-2">Sessions Today</p>
                <p className="text-4xl font-bold text-red-400">{sessionsCompleted}</p>
              </div>

              <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 text-center">
                <p className="text-slate-400 mb-2">Focus Time</p>
                <p className="text-4xl font-bold text-orange-400">
                  {Math.floor((sessionsCompleted * 25) / 60)}h {(sessionsCompleted * 25) % 60}m
                </p>
              </div>

              <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 text-center">
                <p className="text-slate-400 mb-2">Current Streak</p>
                <p className="text-4xl font-bold text-yellow-400">{sessionsCompleted % 4}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}