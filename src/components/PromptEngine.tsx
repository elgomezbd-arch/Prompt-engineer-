import React, { useState, useRef } from "react";
import { Send, Download, Sparkles, MessageSquareQuote, CheckCircle2, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GeminiService } from "../lib/geminiService";
import { Framework, PromptArchitectResult } from "../lib/types";
import { ArchitectSkeleton } from "./Skeleton";

interface PromptEngineProps {
  apiKey: string;
}

type EngineStatus = 'idle' | 'analyzing' | 'clarifying' | 'architecting' | 'completed' | 'error';

export const PromptEngine = ({ apiKey }: PromptEngineProps) => {
  const [input, setInput] = useState("");
  const [clarification, setClarification] = useState("");
  const [status, setStatus] = useState<EngineStatus>('idle');
  const [result, setResult] = useState<PromptArchitectResult | null>(null);
  const [currentFramework, setCurrentFramework] = useState<Framework | null>(null);
  const [missingDetail, setMissingDetail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || !apiKey) return;

    setError(null);
    setStatus('analyzing');

    try {
      const service = new GeminiService(apiKey);
      const analysis = await service.selectFramework(input);
      
      setCurrentFramework(analysis.framework);

      if (analysis.needsClarification) {
        setMissingDetail(analysis.missingDetail || "more context");
        setStatus('clarifying');
      } else {
        await startTransformation(analysis.framework);
      }
    } catch (err) {
      console.error(err);
      setError("Architectural failure. Please check your API key or input.");
      setStatus('error');
    }
  };

  const handleClarify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clarification.trim() || !currentFramework) return;
    await startTransformation(currentFramework, clarification);
  };

  const startTransformation = async (framework: Framework, extraInfo?: string) => {
    setStatus('architecting');
    try {
      const service = new GeminiService(apiKey);
      const transformed = await service.transformPrompt(input, framework, extraInfo);
      setResult(transformed);
      setStatus('completed');
      
      // Scroll to result after a short delay for animation
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      console.error(err);
      setError("Transformation failed. The architect is resting.");
      setStatus('error');
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `architected-prompt-${result.framework.toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setInput("");
    setClarification("");
    setStatus('idle');
    setResult(null);
    setCurrentFramework(null);
    setMissingDetail(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8" id="prompt-engine-container">
      {/* Input Stage */}
      <AnimatePresence mode="wait">
        {(status === 'idle' || status === 'analyzing' || status === 'error') && (
          <motion.div
            key="input-stage"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your basic idea or task..."
                disabled={status === 'analyzing'}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-48 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 transition-all resize-none font-sans text-lg leading-relaxed shadow-inner"
                id="main-idea-input"
              />
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  onClick={() => handleSubmit()}
                  disabled={!input.trim() || status === 'analyzing'}
                  className="bg-zinc-100 hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 p-3 rounded-xl transition-all active:scale-[0.9] flex items-center gap-2 font-bold shadow-lg"
                  id="submit-idea-button"
                >
                  <Send className="w-4 h-4" />
                  {status === 'analyzing' ? 'Analyzing...' : 'Architect Prompt'}
                </button>
              </div>
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-xs font-mono text-center"
              >
                {error}
              </motion.p>
            )}
          </motion.div>
        )}

        {/* Clarification Stage */}
        {status === 'clarifying' && (
          <motion.div
            key="clarification-stage"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 space-y-6 shadow-2xl"
            id="clarification-ui"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-zinc-400">
                <MessageSquareQuote className="w-5 h-5" />
                <span className="text-xs uppercase tracking-widest font-mono">The Architect Needs More</span>
              </div>
              <h3 className="text-xl text-zinc-100 font-medium">
                To give you the best <span className="text-white bg-zinc-800 px-2 rounded font-mono">{currentFramework}</span> structure, could you clarify <span className="text-zinc-300 font-semibold">{missingDetail}</span>?
              </h3>
            </div>
            
            <form onSubmit={handleClarify} className="space-y-4">
              <input
                autoFocus
                value={clarification}
                onChange={(e) => setClarification(e.target.value)}
                placeholder="Type your response here..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-zinc-600 transition-colors"
                id="clarification-input"
              />
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={reset}
                  className="text-zinc-500 hover:text-zinc-300 text-xs font-mono flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Start Over
                </button>
                <button
                  type="submit"
                  disabled={!clarification.trim()}
                  className="bg-zinc-100 hover:bg-white text-zinc-950 px-6 py-2 rounded-lg font-bold transition-all disabled:opacity-50"
                  id="submit-clarification-button"
                >
                  Confirm & Architect
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Loading Stage */}
        {status === 'architecting' && (
          <motion.div
            key="loading-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12"
          >
            <ArchitectSkeleton />
          </motion.div>
        )}

        {/* Result Stage */}
        {status === 'completed' && result && (
          <motion.div
            key="result-stage"
            ref={resultRef}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
            id="result-display"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-emerald-500">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-mono uppercase tracking-widest">Architecture complete</span>
              </div>
              <div className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-tighter border border-zinc-700">
                Framework: {result.framework}
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-4 bg-zinc-950/50 border-b border-zinc-800 flex justify-between items-center">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{result.usage}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(result.final_prompt);
                    // Could add a toast here
                  }}
                  className="text-xs text-zinc-400 hover:text-zinc-100 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3" /> Copy Result
                </button>
              </div>
              <div className="p-6 overflow-x-auto">
                <pre className="text-zinc-300 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {result.final_prompt}
                </pre>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl font-medium transition-colors border border-zinc-700"
                id="download-json-button"
              >
                <Download className="w-4 h-4" /> Download JSON
              </button>
              <button
                onClick={reset}
                className="flex items-center gap-2 px-6 py-3 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl font-bold transition-all shadow-xl"
                id="new-architect-button"
              >
                New Architect
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
