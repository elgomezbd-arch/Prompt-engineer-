import { useState, useEffect } from "react";
import { X, Key, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
  currentKey: string;
}

export const SettingsModal = ({ isOpen, onClose, onSave, currentKey }: SettingsModalProps) => {
  const [apiKey, setApiKey] = useState(currentKey);

  const handleSave = () => {
    onSave(apiKey);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" id="settings-modal-overlay">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl"
            id="settings-modal-content"
          >
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-zinc-400" />
                <h2 className="text-zinc-100 font-medium tracking-tight">API Settings</h2>
              </div>
              <button
                onClick={onClose}
                className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                id="close-settings-button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-zinc-500 font-semibold flex items-center gap-2">
                  Gemini API Key
                  <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400 lowercase italic normal-case">
                    local storage only
                  </span>
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API Key"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-200 focus:outline-none focus:border-zinc-600 transition-colors font-mono text-sm"
                  id="api-key-input"
                />
                <p className="text-[10px] text-zinc-600 leading-relaxed italic">
                  Your API key is saved only in your browser's local storage and is used directly for Gemini AI requests.
                </p>
              </div>

              <div className="bg-zinc-950/50 border border-zinc-800/50 rounded-lg p-4 flex gap-3 items-start">
                <ShieldCheck className="w-5 h-5 text-emerald-500/60 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs text-zinc-400 font-medium leading-normal">Technical Integrity</p>
                  <p className="text-[10px] text-zinc-500 leading-relaxed">
                    This application uses a client-side approach. Your key never touches our servers. 
                    Manage your keys at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-zinc-400 underline hover:text-zinc-200">Google AI Studio</a>.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={handleSave}
                className="w-full py-3 bg-zinc-100 hover:bg-white text-zinc-950 font-bold rounded-lg transition-all active:scale-[0.98]"
                id="save-api-key-button"
              >
                Save Configuration
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
