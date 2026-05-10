"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { BookOpen, Zap, Clock, ArrowRight, Play } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const [notesCount, setNotesCount] = useState(0);
  const [flashcardsCount, setFlashcardsCount] = useState(0);
  const [sessionsCount, setSessionsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [startingSession, setStartingSession] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user.id) {
          setLoading(false);
          return;
        }

        const { count: notesCount } = await supabase
          .from("notes")
          .select("*", { count: "exact", head: true })
          .eq("user_id", session.user.id);

        const { count: cardsCount } = await supabase
          .from("flashcards")
          .select("*", { count: "exact", head: true })
          .eq("user_id", session.user.id);

        const { count: sessionsCount } = await supabase
          .from("study_sessions")
          .select("*", { count: "exact", head: true })
          .eq("user_id", session.user.id);

        setNotesCount(notesCount || 0);
        setFlashcardsCount(cardsCount || 0);
        setSessionsCount(sessionsCount || 0);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const startSession = async (type: "notes" | "flashcards") => {
    setStartingSession(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user.id) {
        alert("Please log in first");
        return;
      }

      const { error } = await supabase.from("study_sessions").insert({
        type,
        duration: 25,
        completed: false,
        user_id: session.user.id,
      });

      if (error) {
        alert("Error starting session: " + error.message);
        return;
      }

      setSessionsCount((prev) => prev + 1);

      if (type === "notes") {
        window.location.href = "/notes";
      } else {
        window.location.href = "/flashcards";
      }
    } catch (err) {
      alert("Failed to start session");
    }
    setStartingSession(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 md:pt-12 pb-6 md:pb-8 border-b border-slate-700/30">
          <div className="max-w-6xl mx-auto">
            <div className="mb-2 text-xs sm:text-sm font-medium text-blue-400 tracking-wider uppercase">
              Welcome Back
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-2 sm:mb-3">
              <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                Study Hub
              </span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl">
              Your centralized learning dashboard. Create notes, generate flashcards, and track your progress.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8 md:mb-12">
              {/* Notes Card */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-6 sm:p-8 hover:border-blue-500/50 transition-all duration-300 cursor-default transform hover:scale-105 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-white">Total Notes</h3>
                    <BookOpen className="w-5 h-5 sm:w-6 h-6 text-blue-400" />
                  </div>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent mb-2">
                    {loading ? "..." : notesCount}
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    {notesCount === 1 ? "1 note" : `${notesCount} notes`} created
                  </p>
                </div>
              </div>

              {/* Flashcards Card */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-6 sm:p-8 hover:border-purple-500/50 transition-all duration-300 cursor-default transform hover:scale-105 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-white">Flashcards</h3>
                    <Zap className="w-5 h-5 sm:w-6 h-6 text-purple-400" />
                  </div>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent mb-2">
                    {loading ? "..." : flashcardsCount}
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    {flashcardsCount === 1 ? "1 card" : `${flashcardsCount} cards`} to study
                  </p>
                </div>
              </div>

              {/* Study Sessions Card */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-6 sm:p-8 hover:border-green-500/50 transition-all duration-300 cursor-default transform hover:scale-105 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-white">Sessions</h3>
                    <Clock className="w-5 h-5 sm:w-6 h-6 text-green-400" />
                  </div>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent mb-2">
                    {loading ? "..." : sessionsCount}
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    {sessionsCount === 1 ? "1 session" : `${sessionsCount} sessions`} tracked
                  </p>
                </div>
              </div>

              {/* Study Time Card */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-6 sm:p-8 hover:border-cyan-500/50 transition-all duration-300 cursor-default transform hover:scale-105 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-white">Total Time</h3>
                    <Clock className="w-5 h-5 sm:w-6 h-6 text-cyan-400" />
                  </div>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent mb-2">
                    {loading ? "..." : Math.floor((sessionsCount * 25) / 60)}h
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    {(sessionsCount * 25) % 60}m of focused study
                  </p>
                </div>
              </div>
            </div>

            {/* Start Study Session */}
            <div className="mb-8 md:mb-12">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 md:mb-6">Start Study Session</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Study Notes */}
                <button
                  onClick={() => startSession("notes")}
                  disabled={startingSession || notesCount === 0}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600/20 to-blue-700/20 backdrop-blur-xl border border-blue-500/30 p-6 md:p-8 hover:border-blue-500/50 transition-all duration-300 cursor-pointer transform hover:scale-102 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="text-left">
                      <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">Study Notes</h3>
                      <p className="text-sm sm:text-base text-slate-300">
                        {notesCount === 0
                          ? "No notes yet"
                          : `Review ${notesCount} ${notesCount === 1 ? "note" : "notes"}`}
                      </p>
                    </div>
                    <Play className="w-5 h-5 sm:w-6 h-6 text-blue-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                  </div>
                </button>

                {/* Study Flashcards */}
                <button
                  onClick={() => startSession("flashcards")}
                  disabled={startingSession || flashcardsCount === 0}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600/20 to-purple-700/20 backdrop-blur-xl border border-purple-500/30 p-6 md:p-8 hover:border-purple-500/50 transition-all duration-300 cursor-pointer transform hover:scale-102 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="text-left">
                      <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">Study Flashcards</h3>
                      <p className="text-sm sm:text-base text-slate-300">
                        {flashcardsCount === 0
                          ? "No flashcards yet"
                          : `Review ${flashcardsCount} ${flashcardsCount === 1 ? "card" : "cards"}`}
                      </p>
                    </div>
                    <Play className="w-5 h-5 sm:w-6 h-6 text-purple-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                  </div>
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mb-8 md:mb-12">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 md:mb-6">Quick Access</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                <Link href="/notes">
                  <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-4 sm:p-6 hover:border-blue-500/50 transition-all duration-300 cursor-pointer transform hover:scale-102 hover:shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm sm:text-base font-semibold text-white">Create Note</h3>
                        <p className="text-xs text-slate-400 mt-1">Add new content</p>
                      </div>
                      <ArrowRight className="w-4 h-4 sm:w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                    </div>
                  </div>
                </Link>

                <Link href="/flashcards">
                  <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-4 sm:p-6 hover:border-purple-500/50 transition-all duration-300 cursor-pointer transform hover:scale-102 hover:shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm sm:text-base font-semibold text-white">View Flashcards</h3>
                        <p className="text-xs text-slate-400 mt-1">Review cards</p>
                      </div>
                      <ArrowRight className="w-4 h-4 sm:w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors flex-shrink-0" />
                    </div>
                  </div>
                </Link>

                <Link href="/pomodoro">
                  <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-4 sm:p-6 hover:border-red-500/50 transition-all duration-300 cursor-pointer transform hover:scale-102 hover:shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm sm:text-base font-semibold text-white">Pomodoro Timer</h3>
                        <p className="text-xs text-slate-400 mt-1">Focus timer</p>
                      </div>
                      <ArrowRight className="w-4 h-4 sm:w-5 h-5 text-slate-400 group-hover:text-red-400 transition-colors flex-shrink-0" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Info Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800/30 to-slate-900/30 backdrop-blur-xl border border-slate-700/50 p-6 sm:p-8">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-700/10 to-transparent"></div>
              <div className="relative z-10">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">🎯 How It Works</h3>
                <p className="text-slate-300 text-xs sm:text-sm md:text-base mb-2 sm:mb-3">
                  1. Create or review notes → 2. Generate flashcards with 🧠 → 3. Study with our flashcard app → 4. Use Pomodoro timer to stay focused
                </p>
                <p className="text-slate-400 text-xs sm:text-sm">
                  Every study session is tracked. Track your progress and build sustainable learning habits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}