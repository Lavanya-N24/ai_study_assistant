"use client";

import { useState, useRef } from "react";
import { UploadCloud, CheckCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../services/api";
import { historyService } from "../services/historyService";

export default function FileUpload() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (f: File) => {
    if (f.type !== "application/pdf") {
      setErrorMessage("Please upload a valid PDF file.");
      setUploadState('error');
      setFile(null);
      return;
    }
    setFile(f);
    setUploadState('idle');
    setErrorMessage("");
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploadState('uploading');
    try {
      await api.uploadPDF(file);
      setUploadState('success');
      await historyService.addActivity({
          title: `Uploaded Note: ${file.name}`,
          type: 'upload',
          score: (file.size / 1024 / 1024).toFixed(2) + ' MB'
      });
    } catch (error: any) {
      setUploadState('error');
      setErrorMessage(error?.message || "Failed to upload file.");
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <form
        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl transition-all duration-300 ${
          dragActive 
            ? "border-themePurple-500 bg-themePurple-50 scale-[1.02]" 
            : "border-slate-300 bg-white hover:bg-slate-50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          onChange={handleChange}
          className="hidden"
        />
        
        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center pointer-events-none"
            >
              <div className="w-16 h-16 mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <UploadCloud className="w-8 h-8 text-primary" />
              </div>
              <p className="mb-2 text-lg font-medium text-foreground">
                Drag & Drop your PDF here
              </p>
              <p className="text-sm text-foreground/50">
                or click to browse from your computer
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="selected"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center w-full px-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 mb-4 rounded-xl bg-card border border-border w-full flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 bg-primary/20 rounded-lg shrink-0">
                    <UploadCloud className="w-5 h-5 text-primary" />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                    <p className="text-xs text-foreground/50">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button 
                  onClick={() => setFile(null)}
                  className="p-1 hover:bg-white/10 rounded-md transition-colors shrink-0"
                >
                  <X className="w-4 h-4 text-foreground/70" />
                </button>
              </div>

              {uploadState === 'idle' && (
                <button
                  type="button"
                  onClick={handleUpload}
                  className="glow-btn px-6 py-2.5 bg-primary text-white rounded-lg font-medium transition-all"
                >
                  Upload File
                </button>
              )}

              {uploadState === 'uploading' && (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                  <p className="text-sm text-primary animate-pulse">Uploading...</p>
                </div>
              )}

              {uploadState === 'success' && (
                <div className="flex flex-col items-center gap-2 text-green-400">
                  <CheckCircle className="w-8 h-8" />
                  <p className="text-sm font-medium">Upload successful!</p>
                </div>
              )}

              {uploadState === 'error' && (
                <p className="text-sm text-red-500 font-medium text-center mt-2">{errorMessage}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
