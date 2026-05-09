"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Send, MessageCircle } from "lucide-react";

export default function ChatPage() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      const { data } = await supabase
        .from("chats")
        .select("*")
        .order("created_at", { ascending: true });

      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
    setPageLoading(false);
  };

  const askAI = async () => {
    if (!question.trim()) return;

    const userQuestion = question;
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userQuestion }),
      });

      const data = await res.json();

      if (data.error) {
        alert("Error: " + data.error);
        setLoading(false);
        return;
      }

      // Save chat to database
      const { error: insertError } = await supabase.from("chats").insert({
        question: userQuestion,
        answer: data.answer,
      });

      if (insertError) {
        console.error("Error saving chat:", insertError);
      }

      // Add to UI
      setMessages((prev) => [
        ...prev,
        {
          question: userQuestion,
          answer: data.answer,
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      alert("Failed to send message");
    }
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askAI();
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <p className="text-white text-lg">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-slate-700/30">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <MessageCircle className="w-8 h-8 text-cyan-400" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                Chat with Notes
              </h1>
            </div>
            <p className="text-slate-400">
              Ask questions about your study material and get AI-powered explanations
            </p>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <MessageCircle className="w-16 h-16 text-slate-600 mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">No messages yet</h2>
                <p className="text-slate-400 max-w-md">
                  Start by asking a question about your notes. The AI will search your study material and provide explanations.
                </p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className="space-y-4">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="max-w-2xl bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl rounded-tr-sm p-6 shadow-lg">
                      <p className="text-white">{msg.question}</p>
                      <p className="text-blue-100 text-xs mt-2">
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {/* AI Message */}
                  <div className="flex justify-start">
                    <div className="max-w-2xl bg-slate-800/50 border border-slate-700/50 rounded-2xl rounded-tl-sm p-6 backdrop-blur-xl">
                      <p className="text-slate-200">{msg.answer}</p>
                      <p className="text-slate-500 text-xs mt-2">AI Response</p>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-700/30 bg-gradient-to-t from-slate-950 to-slate-900/50 backdrop-blur-xl px-8 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-4">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question about your notes... (Shift+Enter for new line)"
                rows={3}
                className="flex-1 bg-slate-800/50 border border-slate-600/50 rounded-xl px-6 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 resize-none"
              />
              <button
                onClick={askAI}
                disabled={loading || !question.trim()}
                className="flex items-center justify-center gap-2 px-8 h-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Thinking...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              💡 Tip: Ask specific questions about concepts from your notes for better answers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}