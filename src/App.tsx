import { useState, useEffect } from "react";
import { Settings, Hexagon, Terminal, Github, Key, Sparkles } from "lucide-react";
import { SettingsModal } from "./components/SettingsModal";
import { PromptEngine } from "./components/PromptEngine";
import { LandingPage } from "./components/LandingPage";
import { motion } from "motion/react";

export default function App() {
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem("invisible_architect_api_key") || "");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem("invisible_architect_api_key", key);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 selection:bg-zinc-700 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden h-screen w-screen opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-800 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-800 rounded-full blur-[120px]" />
      </div>

      <nav className="relative z-10 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0" id="nav-container">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-zinc-100 p-1.5 rounded-lg">
              <Terminal className="w-5 h-5 text-zinc-950" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-white hidden sm:block">
              Invisible Architect
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-zinc-400 hover:text-white transition-colors"
              id="nav-settings-button"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-16 sm:py-24 space-y-24">
        {/* Landing Page Content as Introduction */}
        <LandingPage onLogin={() => {
          const engine = document.getElementById('engine-section');
          engine?.scrollIntoView({ behavior: 'smooth' });
        }} />

        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent w-full" />

        {/* Developer Intro */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center"
          id="top-developer-intro"
        >
          <a 
            href="https://github.com/SharifTawhid" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-4 px-4 py-2 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl hover:border-zinc-700/50 transition-all group"
          >
            <img 
              src="https://github.com/SharifTawhid.png" 
              alt="Sharif Tawhid" 
              className="w-8 h-8 rounded-lg grayscale group-hover:grayscale-0 transition-all shadow-lg"
            />
            <div className="text-left">
              <p className="text-[10px] font-mono tracking-widest uppercase text-zinc-600 group-hover:text-zinc-500 transition-colors">Developer & Maintainer</p>
              <p className="text-xs font-bold text-zinc-400 group-hover:text-zinc-100 transition-colors">Sharif Tawhid</p>
            </div>
          </a>
        </motion.div>

        {/* Hero Section */}
        <section className="text-center space-y-6 max-w-2xl mx-auto" id="hero-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-[10px] uppercase tracking-widest font-bold text-zinc-500"
          >
            <Sparkles className="w-3 h-3" /> AI-Powered Prompt Engineering
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-bold tracking-tighter text-white leading-[1.1]"
          >
            Structure your chaos into <span className="italic text-zinc-400">precision</span>.
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-500 leading-relaxed"
          >
            The Architect evaluates your ideas and automatically selects from 13 professional frameworks to build the perfect AI prompt.
          </motion.p>
        </section>

        {/* Engine Section */}
        <section id="engine-section" className="pt-24">
          {!apiKey ? (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="max-w-md mx-auto p-12 border border-dashed border-zinc-800 rounded-3xl text-center space-y-6 shadow-2xl"
              id="setup-required-container"
            >
              <div className="flex justify-center">
                <div className="p-4 bg-zinc-900 rounded-2xl">
                  <Key className="w-8 h-8 text-zinc-600" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Config Required</h3>
                <p className="text-sm text-zinc-500">Provide your Google AI Studio API key to activate the Architect.</p>
              </div>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="w-full py-3 bg-zinc-100 hover:bg-white text-zinc-950 font-bold rounded-xl transition-all"
                id="setup-key-button"
              >
                Set Up API Key
              </button>
            </motion.div>
          ) : (
            <PromptEngine apiKey={apiKey} />
          )}
        </section>

        {/* Footer */}
        <footer className="pt-24 pb-12 border-t border-zinc-900 flex flex-col sm:flex-row justify-between items-center gap-6" id="footer">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 opacity-40 grayscale">
              <Hexagon className="w-4 h-4" />
              <span className="text-[10px] font-mono tracking-widest uppercase">Invisible Architect v1.0.0</span>
            </div>
            
            <a 
              href="https://github.com/SharifTawhid" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 group"
              id="developer-credit-link"
            >
              <img 
                src="https://github.com/SharifTawhid.png" 
                alt="Sharif Tawhid" 
                className="w-10 h-10 rounded-xl border border-zinc-800 grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:border-zinc-700"
              />
              <div className="flex flex-col">
                <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-600 group-hover:text-zinc-400 transition-colors">Developer & Maintainer</span>
                <span className="text-sm font-bold text-zinc-500 group-hover:text-zinc-100 transition-colors">Sharif Tawhid</span>
              </div>
            </a>
          </div>

          <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest font-bold text-zinc-600">
            <a href="#" className="hover:text-zinc-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Documentation</a>
            <a href="https://github.com/SharifTawhid" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors flex items-center gap-1.5">
              <Github className="w-3 h-3" /> Github
            </a>
          </div>
        </footer>
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveApiKey}
        currentKey={apiKey}
      />
    </div>
  );
}
