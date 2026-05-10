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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user.id) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("study_sessions")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      setSessions(data || []);

      const minutes =
        data?.reduce((acc, s) => acc + (s.minutes || 25), 0) || 0;
      setTotalMinutes(minutes);

      const uniqueDays = new Set(
        data?.map((s) => new Date(s.created_at).toDateString()) || []
      );
      setStreak(uniqueDays.size);

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
        <div className="px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 md:pt-12 pb-6 md:pb-8 border-b border-slate-700/30">
          <div className="max-w-6xl mx-auto">
            <div className="mb-2 text-xs sm:text-sm font-medium text-orange-400 tracking-wider uppercase">
              Your Progress
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-2 sm:mb-3">
              <span className="bg-gradient-to-r from-orange-300 via-red-300 to-yellow-300 bg-clip-text text-transparent">
                Analytics
              </span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl">
              Track your study habits and build consistency with our analytics dashboard.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-slate-400">Loading analytics...</p>
              </div>
            ) : (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 md:mb-12">
                  {/* Streak */}
                  <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-4 sm:p-6 hover:border-red-500/50 transition-all">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm sm:text-base font-semibold text-white">Streak</h3>
                        <Flame className="w-5 h-5 sm:w-6 h-6 text-red-400" />
                      </div>
                      <p className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-300 bg-clip-text text-transparent">
                        {streak}
                      </p>
                      <p className="text-slate-400 text-xs sm:text-sm">days</p>
                    </div>
                  </div>

                  {/* Total Minutes */}
                  <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-4 sm:p-6 hover:border-blue-500/50 transition-all">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm sm:text-base font-semibold text-white">Total Time</h3>
                        <Clock className="w-5 h-5 sm:w-6 h-6 text-blue-400" />
                      </div>
                      <p className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                        {hours}h {mins}m
                      </p>
                      <p className="text-slate-400 text-xs sm:text-sm">focused study</p>
                    </div>
                  </div>

                  {/* Sessions Count */}
                  <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-4 sm:p-6 hover:border-purple-500/50 transition-all">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm sm:text-base font-semibold text-white">Sessions</h3>
                        <Zap className="w-5 h-5 sm:w-6 h-6 text-purple-400" />
                      </div>
                      <p className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
                        {sessions.length}
                      </p>
                      <p className="text-slate-400 text-xs sm:text-sm">completed</p>
                    </div>
                  </div>

                  {/* Average */}
                  <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-4 sm:p-6 hover:border-green-500/50 transition-all">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm sm:text-base font-semibold text-white">Avg/Day</h3>
                        <TrendingUp className="w-5 h-5 sm:w-6 h-6 text-green-400" />
                      </div>
                      <p className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                        {streak > 0 ? Math.round(totalMinutes / streak) : 0}m
                      </p>
                      <p className="text-slate-400 text-xs sm:text-sm">per day</p>
                    </div>
                  </div>
                </div>

                {/* Breakdown */}
                {sessions.length > 0 && (
                  <div className="mb-8 md:mb-12">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 md:mb-6">Session Breakdown</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {/* Notes Sessions */}
                      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-white text-sm sm:text-base">Note Sessions</h3>
                          <span className="text-blue-400 font-bold text-lg sm:text-xl">{sessionsByType.notes}</span>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all"
                            style={{
                              width: `${sessions.length > 0
                                ? (sessionsByType.notes / sessions.length) * 100
                                : 0
                                }%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Flashcard Sessions */}
                      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-white text-sm sm:text-base">Flashcard Sessions</h3>
                          <span className="text-purple-400 font-bold text-lg sm:text-xl">{sessionsByType.flashcards}</span>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-pink-400 h-2 rounded-full transition-all"
                            style={{
                              width: `${sessions.length > 0
                                ? (sessionsByType.flashcards / sessions.length) * 100
                                : 0
                                }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recent Sessions */}
                {sessions.length > 0 && (
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 md:mb-6">Recent Sessions</h2>
                    <div className="space-y-2 sm:space-y-3">
                      {sessions.slice(0, 5).map((session) => (
                        <div
                          key={session.id}
                          className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-3 sm:p-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-white text-xs sm:text-sm capitalize">
                                {session.type} session
                              </p>
                              <p className="text-slate-400 text-xs">
                                {new Date(session.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-blue-400 text-sm sm:text-base">
                                {session.minutes || 25}m
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {sessions.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-slate-400 mb-4">No sessions yet. Start studying to see your analytics!</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}