"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ChevronLeft, ChevronRight, RotateCcw, Trash2 } from "lucide-react";

export default function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchFlashcards = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user.id) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("flashcards")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
      setFlashcards(data || []);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const deleteCard = async (id: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user.id) return;

    await supabase
      .from("flashcards")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id);
    fetchFlashcards();
  };

  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const resetDeck = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <p className="text-white text-lg">Loading flashcards...</p>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="relative z-10 text-center">
          <p className="text-white text-xl mb-4">No flashcards yet</p>
          <p className="text-slate-400">Go to Notes and click 🧠 to generate flashcards</p>
        </div>
      </div>
    );
  }

  const current = flashcards[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 md:pt-12 pb-6 md:pb-8 border-b border-slate-700/30">
          <div className="max-w-2xl mx-auto">
            <div className="mb-2 text-xs sm:text-sm font-medium text-purple-400 tracking-wider uppercase">
              Study Mode
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-2 sm:mb-3">
              <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-red-300 bg-clip-text text-transparent">
                Flashcards
              </span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base md:text-lg">
              Card {currentIndex + 1} of {flashcards.length}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12">
          <div className="max-w-2xl mx-auto">
            {/* Card */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full mb-6 sm:mb-8 cursor-pointer"
            >
              <div
                className={`w-full bg-gradient-to-br backdrop-blur-xl border rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center shadow-2xl min-h-64 sm:min-h-80 transition-all duration-300 ${
                  isFlipped
                    ? "from-indigo-600/30 to-purple-600/30 border-indigo-500/50"
                    : "from-purple-600/30 to-pink-600/30 border-purple-500/50"
                }`}
              >
                {isFlipped ? (
                  <div className="text-center">
                    <p className="text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4">Answer</p>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                      {current.answer}
                    </h2>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4">Question</p>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                      {current.question}
                    </h2>
                  </div>
                )}
                <p className="text-slate-500 mt-6 sm:mt-8 text-xs sm:text-sm">Click to flip</p>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-4 sm:space-y-6">
              {/* Navigation */}
              <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
                <button
                  onClick={prevCard}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white hover:border-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 h-5" />
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </button>

                <button
                  onClick={resetDeck}
                  className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white hover:border-purple-500/50 transition-all text-sm sm:text-base"
                >
                  <RotateCcw className="w-4 h-4 sm:w-5 h-5" />
                  <span className="hidden sm:inline">Restart</span>
                  <span className="sm:hidden">Reset</span>
                </button>

                <button
                  onClick={nextCard}
                  disabled={currentIndex === flashcards.length - 1}
                  className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white hover:from-purple-600 hover:to-pink-600 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed transition-all text-sm sm:text-base"
                >
                  <span className="hidden sm:inline">Next</span>
                  <span className="sm:hidden">Next</span>
                  <ChevronRight className="w-4 h-4 sm:w-5 h-5" />
                </button>
              </div>

              {/* Delete Card */}
              <div className="flex justify-center">
                <button
                  onClick={() => deleteCard(current.id)}
                  className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-slate-800/50 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/10 hover:border-red-500/50 transition-all text-sm sm:text-base"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Card
                </button>
              </div>

              {/* Stats */}
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 sm:p-6 text-center">
                <p className="text-slate-400 mb-2 text-sm sm:text-base">Progress</p>
                <div className="w-full bg-slate-700/50 rounded-full h-2 mb-4">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentIndex + 1) / flashcards.length) * 100}%`,
                    }}
                  ></div>
                </div>
                <p className="text-white font-semibold text-sm sm:text-base">
                  {currentIndex + 1} / {flashcards.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}