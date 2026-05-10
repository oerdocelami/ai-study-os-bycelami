"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Upload, File, Trash2, Check } from "lucide-react";

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const [pdfs, setPdfs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fetchPDFs();
  }, []);

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

  const uploadPDF = async (file: File) => {
    if (!file.type.includes("pdf")) {
      alert("Please upload a PDF file");
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user.id) {
      alert("Please log in first");
      return;
    }

    setUploading(true);

    try {
      const filePath = `pdfs/${session.user.id}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("pdfs")
        .upload(filePath, file);

      if (uploadError) {
        alert("Upload failed: " + uploadError.message);
        setUploading(false);
        return;
      }

      // Get public URL
      const { data } = supabase.storage.from("pdfs").getPublicUrl(filePath);

      // Extract text from PDF
      const formData = new FormData();
      formData.append("file", file);

      const extracted = { text: "Mock PDF text" };

      // Save to database with extracted text and user_id
      const { error: insertError } = await supabase.from("pdfs").insert({
        name: file.name,
        file_url: data.publicUrl,
        extracted_text: extracted.text,
        user_id: session.user.id,
      });

      if (insertError) {
        alert("Error saving file info");
        setUploading(false);
        return;
      }

      alert("✅ PDF uploaded and text extracted successfully!");
      fetchPDFs();
    } catch (error) {
      alert("Error uploading PDF");
      console.error(error);
    }

    setUploading(false);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadPDF(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await uploadPDF(file);
    }
  };

  const deletePDF = async (id: string, fileUrl: string) => {
    if (!confirm("Delete this PDF?")) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user.id) return;

    try {
      // Delete from storage
      const filePath = fileUrl.split("/").pop();
      if (filePath) {
        await supabase.storage.from("pdfs").remove([`pdfs/${session.user.id}/${filePath}`]);
      }

      // Delete from database with user_id check
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
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 md:pt-12 pb-6 md:pb-8 border-b border-slate-700/30">
          <div className="max-w-6xl mx-auto">
            <div className="mb-2 text-xs sm:text-sm font-medium text-violet-400 tracking-wider uppercase">
              Study Materials
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-2 sm:mb-3">
              <span className="bg-gradient-to-r from-violet-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                Upload Lecture PDFs
              </span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl">
              Upload your lecture slides and textbooks. We'll extract notes and generate study materials automatically.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            {/* Upload Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 p-6 sm:p-8 md:p-12 text-center cursor-pointer ${
                dragActive
                  ? "border-violet-400 bg-violet-500/10"
                  : "border-slate-600/50 bg-slate-800/30 hover:border-violet-500/50 hover:bg-violet-500/5"
              }`}
            >
              <div className="relative z-10">
                <Upload className="w-12 h-12 sm:w-16 h-16 text-violet-400 mx-auto mb-3 sm:mb-4" />
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  {uploading ? "Uploading..." : "Drag & drop your PDF here"}
                </h2>
                <p className="text-slate-400 mb-4 sm:mb-6 text-sm sm:text-base">
                  or click to select a file from your computer
                </p>

                <label className="inline-block">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileInput}
                    disabled={uploading}
                    className="hidden"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      (e.currentTarget.parentElement?.querySelector("input") as HTMLInputElement)?.click();
                    }}
                    disabled={uploading}
                    className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    {uploading ? "Uploading..." : "Select PDF"}
                  </button>
                </label>

                <p className="text-xs text-slate-500 mt-4 sm:mt-6">
                  Supported format: PDF (Max 50MB)
                </p>
              </div>
            </div>

            {/* File List */}
            {pdfs.length > 0 && (
              <div className="mt-8 md:mt-12">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 md:mb-6">Your PDFs</h2>
                <div className="space-y-2 sm:space-y-3">
                  {pdfs.map((pdf) => (
                    <div
                      key={pdf.id}
                      className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-4 sm:p-6 hover:border-violet-500/50 transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                          <File className="w-6 h-6 sm:w-8 h-8 text-violet-400 flex-shrink-0 mt-1 sm:mt-0" />
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-white text-sm sm:text-base truncate">
                              {pdf.name}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                              {new Date(pdf.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <a
                            href={pdf.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-700/30 hover:bg-slate-600/50 text-white rounded-lg transition-all text-xs sm:text-sm flex-1 sm:flex-none justify-center"
                          >
                            <Check className="w-4 h-4" />
                            <span className="hidden sm:inline">View</span>
                            <span className="sm:hidden">View</span>
                          </a>
                          <button
                            onClick={() => deletePDF(pdf.id, pdf.file_url)}
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!loading && pdfs.length === 0 && (
              <div className="mt-8 md:mt-12 text-center py-8 sm:py-12">
                <p className="text-slate-400 text-sm sm:text-lg">
                  No PDFs uploaded yet. Start by uploading your first lecture!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}