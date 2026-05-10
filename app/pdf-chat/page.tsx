"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Send, MessageCircle, BookOpen } from "lucide-react";

export default function PDFChatPage() {
  const [pdfs, setPdfs] = useState<any[]>([]);
  const [selectedPDF, setSelectedPDF] = useState<any>(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPDFs();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchPDFs = async () => {
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

  const askPDF = async () => {
    if (!selectedPDF || !question.trim()) return;

    setChatLoading(true);
    const userQuestion = question;
    setQuestion("");

    try {
      const res = await fetch("/api/ai/pdf-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userQuestion,
          content: selectedPDF.extracted_text,
        }),
      });

      const data = await res.json();

      if (data.error) {
        alert("Error: " + data.error);
        setChatLoading(false);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          question: userQuestion,
          answer: data.answer,
        },
      ]);
    } catch (error) {
      alert("Failed to get response");
      console.error(error);
    }

    setChatLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askPDF();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <p className="text-white text-lg">Loading PDFs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <div className="px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 border-b border-slate-700/30">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <BookOpen className="w-6 h-6 sm:w-8 h-8 text-amber-400" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
                Chat with PDFs
              </h1>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm md:text-base">
              Ask questions about your uploaded lecture slides
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-4 sm:py-8">
          <div className="max-w-4xl mx-auto">
            {pdfs.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <BookOpen className="w-12 h-12 sm:w-16 h-16 text-slate-600 mx-auto mb-3 sm:mb-4" />
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">No PDFs uploaded</h2>
                <p className="text-slate-400 mb-4 sm:mb-6 text-sm sm:text-base">
                  Upload lecture PDFs first to ask questions
                </p>
                <a
                  href="/upload"
                  className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  Upload PDF
                </a>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {/* PDF Selector */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-4 sm:p-6">
                  <label className="block text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                    Select a Lecture
                  </label>
                  <select
                    value={selectedPDF?.id || ""}
                    onChange={(e) => {
                      const pdf = pdfs.find((p) => p.id === e.target.value);
                      setSelectedPDF(pdf);
                      setMessages([]);
                    }}
                    className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition-all duration-200 text-sm sm:text-base"
                  >
                    <option value="">Select a PDF...</option>
                    {pdfs.map((pdf) => (
                      <option key={pdf.id} value={pdf.id}>
                        {pdf.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Messages */}
                {selectedPDF && (
                  <div className="space-y-4 sm:space-y-6">
                    {messages.length === 0 ? (
                      <div className="text-center py-8 sm:py-12 text-slate-400">
                        <MessageCircle className="w-10 h-10 sm:w-12 h-12 text-slate-600 mx-auto mb-2 sm:mb-3" />
                        <p className="text-sm sm:text-base">Ask a question about "{selectedPDF.name}"</p>
                      </div>
                    ) : (
                      messages.map((msg, idx) => (
                        <div key={idx} className="space-y-3 sm:space-y-4">
                          {/* User Message */}
                          <div className="flex justify-end">
                            <div className="max-w-xs sm:max-w-md md:max-w-2xl bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl rounded-tr-sm p-3 sm:p-4 md:p-6 shadow-lg">
                              <p className="text-white text-sm sm:text-base">{msg.question}</p>
                              <p className="text-amber-100 text-xs mt-2">You</p>
                            </div>
                          </div>

                          {/* AI Message */}
                          <div className="flex justify-start">
                            <div className="max-w-xs sm:max-w-md md:max-w-2xl bg-slate-800/50 border border-slate-700/50 rounded-2xl rounded-tl-sm p-3 sm:p-4 md:p-6 backdrop-blur-xl">
                              <p className="text-slate-200 whitespace-pre-wrap text-sm sm:text-base">{msg.answer}</p>
                              <p className="text-slate-500 text-xs mt-2">AI Response</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        {selectedPDF && (
          <div className="border-t border-slate-700/30 bg-gradient-to-t from-slate-950 to-slate-900/50 backdrop-blur-xl px-4 sm:px-6 md:px-8 py-4 sm:py-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask a question about the lecture..."
                  rows={3}
                  className="flex-1 bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition-all duration-200 resize-none text-sm sm:text-base"
                />
                <button
                  onClick={askPDF}
                  disabled={chatLoading || !question.trim()}
                  className="flex items-center justify-center gap-2 px-4 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed text-sm sm:text-base whitespace-nowrap"
                >
                  {chatLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="hidden sm:inline">Thinking...</span>
                      <span className="sm:hidden">...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 sm:w-5 h-5" />
                      <span className="hidden sm:inline">Send</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}