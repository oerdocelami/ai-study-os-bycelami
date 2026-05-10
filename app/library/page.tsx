"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { FileText, Eye, Download, Trash2 } from "lucide-react";

export default function LibraryPage() {
  const [pdfs, setPdfs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPDFs = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user.id) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("pdfs")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      setPdfs(data || []);
    } catch (error) {
      console.error("Error fetching PDFs:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPDFs();
  }, []);

  const generatePDFCards = async (pdf: any) => {
    if (!pdf.extracted_text) {
      alert("Text not extracted yet. Please try again in a moment.");
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user.id) {
      alert("Please log in first");
      return;
    }

    try {
      const sentences = pdf.extracted_text.split(".").filter((s: string) => s.trim().length > 0);
      const flashcards = [];

      flashcards.push({
        question: `What is the main topic of "${pdf.name}"?`,
        answer: pdf.extracted_text.slice(0, 150).trim() + "...",
      });

      if (sentences.length > 1) {
        flashcards.push({
          question: "What are the key points from this lecture?",
          answer: sentences.slice(0, 3).join(". ").trim(),
        });
      }

      if (sentences.length > 3) {
        flashcards.push({
          question: "Summarize this PDF in one sentence",
          answer: sentences.slice(0, 2).join(". ").trim(),
        });
      }

      for (const card of flashcards) {
        await supabase.from("flashcards").insert({
          question: card.question,
          answer: card.answer,
          user_id: session.user.id,
        });
      }

      alert(`✅ Generated ${flashcards.length} flashcards from "${pdf.name}"!`);
    } catch (err) {
      alert("Failed to generate flashcards from PDF");
      console.error(err);
    }
  };

  const deletePDF = async (id: string, fileUrl: string) => {
    if (!confirm("Delete this PDF?")) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user.id) return;

    try {
      const filePath = fileUrl.split("/").pop();
      if (filePath) {
        await supabase.storage.from("pdfs").remove([`pdfs/${session.user.id}/${filePath}`]);
      }

      await supabase
        .from("pdfs")
        .delete()
        .eq("id", id)
        .eq("user_id", session.user.id);

      fetchPDFs();
    } catch (error) {
      alert("Error deleting PDF");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 md:pt-12 pb-6 md:pb-8 border-b border-slate-700/30">
          <div className="max-w-6xl mx-auto">
            <div className="mb-2 text-xs sm:text-sm font-medium text-emerald-400 tracking-wider uppercase">
              Study Materials
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-2 sm:mb-3">
              <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
                Lecture Library
              </span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl">
              Manage your uploaded lecture slides and study materials. View, extract text, and generate study tools.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="text-center py-8 sm:py-12">
                <p className="text-slate-400">Loading your library...</p>
              </div>
            ) : pdfs.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <FileText className="w-12 h-12 sm:w-16 h-16 text-slate-600 mx-auto mb-3 sm:mb-4" />
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  Your library is empty
                </h2>
                <p className="text-slate-400 mb-4 sm:mb-6 text-sm sm:text-base">
                  Upload lecture PDFs to get started
                </p>
                <a
                  href="/upload"
                  className="inline-block bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  Upload First PDF
                </a>
              </div>
            ) : (
              <div>
                <div className="mb-4 sm:mb-6 flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    {pdfs.length} {pdfs.length === 1 ? "PDF" : "PDFs"}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {pdfs.map((pdf) => (
                    <div
                      key={pdf.id}
                      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-4 sm:p-6 hover:border-emerald-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="relative z-10">
                        {/* File Icon */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 sm:p-3 bg-emerald-500/20 rounded-lg">
                            <FileText className="w-5 h-5 sm:w-6 h-6 text-emerald-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-slate-400 text-xs">PDF File</p>
                          </div>
                        </div>

                        {/* File Name */}
                        <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 line-clamp-2 group-hover:text-emerald-300 transition-colors">
                          {pdf.name}
                        </h3>

                        {/* File Info */}
                        <div className="space-y-2 mb-4 sm:mb-6">
                          <p className="text-xs text-slate-500">
                            Uploaded: {new Date(pdf.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2 sm:space-y-3">
                          <div className="flex gap-2">
                            <a
                              href={pdf.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-medium py-2 rounded-lg transition-all text-xs sm:text-sm"
                            >
                              <Eye className="w-3 h-3 sm:w-4 h-4" />
                              <span className="hidden sm:inline">View</span>
                              <span className="sm:hidden">View</span>
                            </a>

                            <a
                              href={pdf.file_url}
                              download
                              className="flex-1 flex items-center justify-center gap-2 bg-slate-700/30 hover:bg-slate-600/50 text-slate-300 font-medium py-2 rounded-lg transition-all text-xs sm:text-sm"
                            >
                              <Download className="w-3 h-3 sm:w-4 h-4" />
                              <span className="hidden sm:inline">Download</span>
                              <span className="sm:hidden">Down</span>
                            </a>

                            <button
                              onClick={() => deletePDF(pdf.id, pdf.file_url)}
                              className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => generatePDFCards(pdf)}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-2 rounded-lg transition-all text-xs sm:text-sm"
                          >
                            Generate Flashcards
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}