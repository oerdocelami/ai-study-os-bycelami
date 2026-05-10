"use client";

import { ArrowRight, BookOpen, Brain, BarChart3, Zap, Clock, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-20 border-b border-slate-700/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              StudyOS
            </span>
          </div>
          <Link href="/login">
            <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold transition-all">
              Sign In
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-24">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30">
              <span className="text-sm text-blue-300 font-semibold">🎓 AI-Powered Learning</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                Study Smarter, Not Harder
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8">
              AI-powered notes, instant flashcards, Pomodoro timer, and intelligent PDF analysis. Master any subject faster.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <button className="group px-8 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold flex items-center gap-2 transition-all transform hover:scale-105">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <button className="px-8 py-4 rounded-lg border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white font-semibold transition-all">
                Learn More
              </button>
            </div>
          </div>

          {/* Hero Image/Dashboard Preview */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-4 sm:p-6 md:p-8 max-w-4xl mx-auto mb-16 sm:mb-20">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
            <div className="relative z-10">
              <div className="bg-slate-900/80 rounded-lg p-4 sm:p-8 border border-slate-700/50">
                <div className="space-y-4">
                  <div className="h-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded w-1/3"></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="h-24 bg-blue-500/10 rounded border border-blue-500/20"></div>
                    <div className="h-24 bg-purple-500/10 rounded border border-purple-500/20"></div>
                  </div>
                  <div className="h-12 bg-slate-800 rounded w-full"></div>
                </div>
              </div>
              <p className="text-center text-slate-400 text-sm mt-4">Dashboard Preview</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Powerful Features for Deep Learning
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
              Everything you need to study effectively and retain information longer
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* AI Notes */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-6 sm:p-8 hover:border-blue-500/50 transition-all transform hover:scale-105 hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <BookOpen className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Smart Notes</h3>
                <p className="text-slate-400 text-sm sm:text-base">
                  Create notes and let AI summarize key concepts instantly
                </p>
              </div>
            </div>

            {/* AI Flashcards */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-6 sm:p-8 hover:border-purple-500/50 transition-all transform hover:scale-105 hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <Zap className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Instant Flashcards</h3>
                <p className="text-slate-400 text-sm sm:text-base">
                  Generate flashcards from notes with one click
                </p>
              </div>
            </div>

            {/* Pomodoro Timer */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-6 sm:p-8 hover:border-red-500/50 transition-all transform hover:scale-105 hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <Clock className="w-8 h-8 text-red-400 mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Pomodoro Timer</h3>
                <p className="text-slate-400 text-sm sm:text-base">
                  Stay focused with scientifically-proven study intervals
                </p>
              </div>
            </div>

            {/* PDF Analysis */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-6 sm:p-8 hover:border-green-500/50 transition-all transform hover:scale-105 hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <Brain className="w-8 h-8 text-green-400 mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">PDF Chat</h3>
                <p className="text-slate-400 text-sm sm:text-base">
                  Ask questions about lecture slides and get instant answers
                </p>
              </div>
            </div>

            {/* Analytics */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-6 sm:p-8 hover:border-yellow-500/50 transition-all transform hover:scale-105 hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <BarChart3 className="w-8 h-8 text-yellow-400 mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Progress Tracking</h3>
                <p className="text-slate-400 text-sm sm:text-base">
                  Track your study streaks, sessions, and total learning time
                </p>
              </div>
            </div>

            {/* AI Chat */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-6 sm:p-8 hover:border-cyan-500/50 transition-all transform hover:scale-105 hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <MessageCircle className="w-8 h-8 text-cyan-400 mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">AI Tutor</h3>
                <p className="text-slate-400 text-sm sm:text-base">
                  Ask questions anytime and get personalized explanations
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Start free, upgrade when you need more
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-2xl mx-auto">
            {/* Free Plan */}
            <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Free</h3>
              <p className="text-slate-400 mb-6">Get started with the basics</p>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-6">
                $0<span className="text-lg text-slate-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8 text-slate-300 text-sm sm:text-base">
                <li>✓ Unlimited notes</li>
                <li>✓ Flashcard generation</li>
                <li>✓ Pomodoro timer</li>
                <li>✓ Study tracking</li>
              </ul>
              <Link href="/login">
                <button className="w-full py-3 rounded-lg border border-slate-600 hover:border-slate-500 text-white font-semibold transition-all">
                  Get Started
                </button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-blue-500/50 p-6 sm:p-8 ring-2 ring-blue-500/30 transform md:scale-105 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold">
                POPULAR
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Pro</h3>
              <p className="text-slate-300 mb-6">Power up your learning</p>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-6">
                $9<span className="text-lg text-slate-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8 text-slate-300 text-sm sm:text-base">
                <li>✓ Everything in Free</li>
                <li>✓ PDF analysis with AI</li>
                <li>✓ Advanced analytics</li>
                <li>✓ Priority support</li>
              </ul>
              <button className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold transition-all">
                Coming Soon
              </button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-blue-500/30 p-8 sm:p-12 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Study Smarter?
              </h2>
              <p className="text-slate-300 text-base sm:text-lg mb-8">
                Start learning with AI-powered tools today. No credit card required.
              </p>
              <Link href="/login">
                <button className="px-8 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold flex items-center gap-2 mx-auto transition-all transform hover:scale-105">
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700/30 backdrop-blur-xl mt-16 sm:mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 text-center text-slate-400 text-sm">
            <p>© 2024 StudyOS. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}