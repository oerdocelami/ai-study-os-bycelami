"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Trash2, Plus } from "lucide-react";

export default function NotesPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchNotes = async () => {
    const { data } = await supabase.from("notes").select("*").order("created_at", { ascending: false });
    setNotes(data || []);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const summarizeNote = async (text: string) => {
    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });

      const data = await res.json();
      console.log("API Response:", data);
      
      if (data.error) {
        alert("Error: " + data.error);
      } else if (data.summary) {
        alert(data.summary);
      } else {
        alert("Unexpected response: " + JSON.stringify(data));
      }
    } catch (err: any) {
      alert("Fetch error: " + err.message);
    }
  };

  const addNote = async () => {
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    await supabase.from("notes").insert({
      title,
      content,
    });
    setTitle("");
    setContent("");
    setLoading(false);
    fetchNotes();
  };

  const deleteNote = async (id: string) => {
    await supabase.from("notes").delete().eq("id", id);
    fetchNotes();
  };

  const generateFlashcards = async (noteId: string, content: string) => {
    try {
      const res = await fetch("/api/ai/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();

      if (data.error) {
        alert("Error: " + data.error);
        return;
      }

      // Save flashcards to database
      for (const card of data.flashcards) {
        await supabase.from("flashcards").insert({
          note_id: noteId,
          question: card.question,
          answer: card.answer,
        });
      }

      alert(`✅ Generated ${data.count} flashcards!`);
    } catch (err: any) {
      alert("Error generating flashcards: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="px-8 pt-12 pb-8 border-b border-slate-700/30">
          <div className="max-w-4xl mx-auto">
            <div className="mb-2 text-sm font-medium text-emerald-400 tracking-wider uppercase">
              Knowledge Base
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-3">
              <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
                My Notes
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              Capture your thoughts, organize ideas, and build your personal knowledge system.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-8 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Input Section */}
            <div className="mb-12 relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-8 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent"></div>
              <div className="relative z-10">
                <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-400" />
                  Create New Note
                </h2>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Note title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-200"
                  />
                  <textarea
                    placeholder="What's on your mind?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-200 resize-none"
                  />
                  <button
                    onClick={addNote}
                    disabled={loading || !title.trim() || !content.trim()}
                    className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                  >
                    {loading ? "Saving..." : "Save Note"}
                  </button>
                </div>
              </div>
            </div>

            {/* Notes Grid */}
            <div className="space-y-4">
              {notes.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-slate-400 text-lg">No notes yet. Create your first note to get started.</p>
                </div>
              ) : (
                notes.map((note, index) => (
                  <div
                    key={note.id}
                    className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-6 hover:border-emerald-500/50 transition-all duration-300 cursor-default transform hover:scale-102 hover:shadow-xl"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="relative z-10 flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-300 transition-colors duration-200">
                          {note.title}
                        </h3>
                        <p className="text-slate-300 leading-relaxed text-sm line-clamp-3">
                          {note.content}
                        </p>
                        {note.created_at && (
                          <p className="text-xs text-slate-500 mt-3">
                            {new Date(note.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => summarizeNote(note.content)}
                        className="flex-shrink-0 p-2 rounded-lg bg-blue-500/30 hover:bg-blue-500 text-white transition-all"
                      >
                        ✨
                      </button>
                      <button
                        onClick={() => generateFlashcards(note.id, note.content)}
                        className="flex-shrink-0 p-2 rounded-lg bg-green-500/30 hover:bg-green-500 text-white transition-all"
                      >
                        🧠
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="flex-shrink-0 p-2 rounded-lg bg-slate-700/30 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all duration-200 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        div[style*="animationDelay"] {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .hover\:scale-102:hover {
          transform: scale(1.02);
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}