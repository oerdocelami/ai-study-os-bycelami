"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";

export default function PomodoroPage() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
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
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 md:pt-12 pb-6 md:pb-8 border-b border-slate-700/30">
          <div className="max-w-2xl mx-auto">
            <div className="mb-2 text-xs sm:text-sm font-medium text-red-400 tracking-wider uppercase">
              Focus Timer
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-2 sm:mb-3">
              <span className="bg-gradient-to-r from-red-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent">
                Pomodoro Timer
              </span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base md:text-lg">
              Stay focused with the Pomodoro technique: 25 min work, 5 min break
            </p>
          </div>
        </div>

        {/* Timer Display */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-12">
          <div className="w-full max-w-md">
            {/* Timer Circle */}
            <div className="relative mb-8 sm:mb-12">
              <svg className="w-full aspect-square" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="rgba(148, 163, 184, 0.2)"
                  strokeWidth="8"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke={sessionType === "work" ? "#ef4444" : "#10b981"}
                  strokeWidth="8"
                  strokeDasharray={`${(progress / 100) * 565} 565`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                  style={{ transform: "rotate(-90deg)", transformOrigin: "100px 100px" }}
                />
              </svg>

              {/* Time Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl sm:text-6xl md:text-7xl font-bold text-white">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-sm sm:text-base text-slate-400 mt-2 sm:mt-4">
                  {sessionType === "work" ? "Focus Time" : "Break Time"}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex gap-3 sm:gap-4 justify-center">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-4 h-4 sm:w-5 h-5" />
                      <span className="hidden sm:inline">Pause</span>
                      <span className="sm:hidden">Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 sm:w-5 h-5" />
                      <span className="hidden sm:inline">Start</span>
                      <span className="sm:hidden">Start</span>
                    </>
                  )}
                </button>

                <button
                  onClick={resetSession}
                  className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-slate-700/50 hover:bg-slate-600/50 text-white font-semibold rounded-lg transition-all duration-200 text-sm sm:text-base"
                >
                  <RotateCcw className="w-4 h-4 sm:w-5 h-5" />
                  <span className="hidden sm:inline">Reset</span>
                  <span className="sm:hidden">Reset</span>
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-slate-700/50 hover:bg-slate-600/50 text-white font-semibold rounded-lg transition-all duration-200"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 sm:w-5 h-5" />
                  ) : (
                    <Volume2 className="w-4 h-4 sm:w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Stats */}
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 sm:p-6 text-center">
                <p className="text-slate-400 mb-2 text-xs sm:text-sm">Sessions Completed</p>
                <p className="text-3xl sm:text-4xl font-bold text-red-400">{sessionsCompleted}</p>
              </div>

              {/* Tips */}
              <div className="bg-slate-800/20 border border-slate-700/30 rounded-xl p-4 sm:p-6">
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  💡 <strong>Tip:</strong> {sessionType === "work"
                    ? "Stay focused! Avoid distractions during work sessions."
                    : "Take a break! Stretch and hydrate during your break."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}