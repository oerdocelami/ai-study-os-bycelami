"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Flame, Clock, Zap, TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sessionsByType, setSessionsByType] = useState({ notes: 0, flashcards: 0 });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("study_sessions")
        .select("*")
        .order("created_at", { ascending: false });

      setSessions(data || []);

      // Calculate total minutes
      const minutes =
        data?.reduce((acc, session) => acc + (session.minutes || 25), 0) || 0;
      setTotalMinutes(minutes);

      // Calculate streak
      const uniqueDays = new Set(
        data?.map((s) => new Date(s.created_at).toDateString()) || []
      );
      setStreak(uniqueDays.size);

      // Count by type
      const notes = data?.filter((s) => s.type === "notes").length || 0;
      const flashcards = data?.filter((s) => s.type === "flashcards").length || 0;
      setSessionsByType({ notes, flashcards });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
    setLoading(false);
  };

  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-red-500/20 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="px-8 pt-12 pb-8 border-b border-slate-700/30">
          <div className="max-w-6xl mx-auto">
            <div className="mb-2 text-sm font-medium text-orange-400 tracking-wider uppercase">
              Your Progress
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-3">
              <span className="bg-gradient-to-r from-orange-300 via-red-300 to-yellow-300 bg-clip-text text-transparent">
                Analytics
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              Track your study habits and build consistency with our analytics dashboard.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-8 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              {/* Streak Card */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600/20 to-orange-600/20 backdrop-blur-xl border border-red-500/30 p-8 hover:border-red-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Daily Streak</h3>
                    <Flame className="w-6 h-6 text-red-400" />
                  </div>
                  <p className="text-5xl font-bold text-red-400 mb-2">
                    {loading ? "..." : streak}
                  </p>
                  <p className="text-slate-400 text-sm">
                    {streak === 1 ? "day" : "days"} of study
                  </p>
                </div>
              </div>

              {/* Total Time Card */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-600/20 to-yellow-600/20 backdrop-blur-xl border border-orange-500/30 p-8 hover:border-orange-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Study Time</h3>
                    <Clock className="w-6 h-6 text-orange-400" />
                  </div>
                  <p className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent mb-2">
                    {loading ? "..." : `${hours}h ${mins}m`}
                  </p>
                  <p className="text-slate-400 text-sm">
                    {totalMinutes} total minutes
                  </p>
                </div>
              </div>

              {/* Sessions Card */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-purple-500/30 p-8 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Sessions</h3>
                    <Zap className="w-6 h-6 text-purple-400" />
                  </div>
                  <p className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent mb-2">
                    {loading ? "..." : sessions.length}
                  </p>
                  <p className="text-slate-400 text-sm">
                    study sessions completed
                  </p>
                </div>
              </div>

              {/* Productivity Card */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-xl border border-green-500/30 p-8 hover:border-green-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Avg. Per Day</h3>
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  </div>
                  <p className="text-5xl font-bold text-green-400 mb-2">
                    {loading ? "..." : Math.round(totalMinutes / (streak || 1))}
                  </p>
                  <p className="text-slate-400 text-sm">
                    minutes per day
                  </p>
                </div>
              </div>
            </div>

            {/* Session Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {/* Notes Sessions */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold text-white mb-6">Sessions by Type</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-300">Notes Sessions</span>
                        <span className="text-2xl font-bold text-blue-400">
                          {loading ? "..." : sessionsByType.notes}
                        </span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              sessions.length > 0
                                ? (sessionsByType.notes / sessions.length) * 100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-300">Flashcard Sessions</span>
                        <span className="text-2xl font-bold text-purple-400">
                          {loading ? "..." : sessionsByType.flashcards}
                        </span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-purple-400 h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              sessions.length > 0
                                ? (sessionsByType.flashcards / sessions.length) * 100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Motivational Card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold text-white mb-4">Keep It Up! 🎯</h3>
                  <div className="space-y-3 text-slate-300">
                    {streak > 0 && (
                      <p>
                        ✅ You have a <span className="text-red-400 font-bold">{streak}-day</span> streak going! Keep studying daily to maintain it.
                      </p>
                    )}
                    {sessions.length >= 10 && (
                      <p>
                        ✅ You've completed <span className="text-purple-400 font-bold">{sessions.length}</span> sessions! That's amazing consistency.
                      </p>
                    )}
                    {totalMinutes >= 300 && (
                      <p>
                        ✅ You've studied for over <span className="text-orange-400 font-bold">{hours} hours</span>! You're on your way to mastery.
                      </p>
                    )}
                    {sessions.length === 0 && (
                      <p>
                        Start your first study session to begin tracking your progress!
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Sessions */}
            {sessions.length > 0 && (
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-8">
                <h3 className="text-xl font-semibold text-white mb-6">Recent Sessions</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {sessions.slice(0, 10).map((session, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-all"
                    >
                      <div>
                        <p className="text-white font-medium capitalize">
                          {session.type === "notes" ? "📝 Notes" : "⚡ Flashcards"}
                        </p>
                        <p className="text-slate-400 text-sm">
                          {new Date(session.created_at).toLocaleDateString()}{" "}
                          {new Date(session.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">
                          {session.minutes || 25} min
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover\:scale-105:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}