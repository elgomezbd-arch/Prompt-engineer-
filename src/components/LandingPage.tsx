import { LogIn, Sparkles, Zap, Shield, Cpu, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

interface LandingPageProps {
  onLogin: () => void;
}

export const LandingPage = ({ onLogin }: LandingPageProps) => {
  const frameworks = [
    "Standard", "Reasoning", "RACE", "CARE", "APE", "CREATE", 
    "TAG", "CREO", "RISE", "PAIN", "COAST", "ROSES", "RESEE"
  ];

  return (
    <div className="space-y-32" id="landing-page">
      {/* Hero Section */}
      <section className="text-center space-y-8 pt-12" id="landing-hero">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-500/80"
        >
          <Sparkles className="w-3.5 h-3.5" /> Next-Gen Prompt Engineering
        </motion.div>
        
        <div className="space-y-6 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-8xl font-bold tracking-tighter text-white leading-[0.9]"
          >
            Stop writing prompts. <br />
            Start <span className="text-zinc-600 italic">Architecting</span>.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed"
          >
            The Invisible Architect evaluates your raw ideas and automatically structures them using 13 industry-standard frameworks for professional AI outputs.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center pt-4"
        >
          <button
            onClick={onLogin}
            className="group flex items-center gap-3 px-8 py-4 bg-zinc-100 hover:bg-white text-zinc-950 rounded-2xl font-bold text-lg transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] active:scale-95"
            id="landing-cta-button"
          >
            <LogIn className="w-5 h-5" />
            Get Started Now
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4" id="landing-features">
        <div className="p-8 bg-zinc-900/30 border border-zinc-800/50 rounded-3xl space-y-4">
          <div className="p-3 bg-zinc-800 w-fit rounded-xl">
            <Cpu className="w-6 h-6 text-zinc-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Invisible Logic</h3>
          <p className="text-sm text-zinc-500 leading-relaxed">
            No dropdowns or complexity. Our AI analyzes your intent and chooses the optimal structure in the background.
          </p>
        </div>

        <div className="p-8 bg-zinc-900/30 border border-zinc-800/50 rounded-3xl space-y-4">
          <div className="p-3 bg-zinc-800 w-fit rounded-xl">
            <Zap className="w-6 h-6 text-zinc-400" />
          </div>
          <h3 className="text-xl font-bold text-white">13 Frameworks</h3>
          <p className="text-sm text-zinc-500 leading-relaxed">
            From RACE to PAIN, we use specialized cognitive structures to ensure every prompt is precise and actionable.
          </p>
        </div>

        <div className="p-8 bg-zinc-900/30 border border-zinc-800/50 rounded-3xl space-y-4">
          <div className="p-3 bg-zinc-800 w-fit rounded-xl">
            <Shield className="w-6 h-6 text-zinc-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Privacy First</h3>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Your API keys are stored locally in your browser. We never see your data or your configurations.
          </p>
        </div>
      </section>

      {/* Marquee/Frameworks Section */}
      <section className="space-y-8" id="landing-frameworks">
        <div className="text-center space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-[0.4em] text-zinc-600">Supported Architectures</h4>
        </div>
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
          {frameworks.map((fw) => (
            <span 
              key={fw}
              className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-400"
            >
              {fw}
            </span>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="pt-20 text-center pb-20" id="landing-final-cta">
        <div className="p-12 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-[3rem] space-y-8 max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-white">Ready to change how <br/> you talk to AI?</h3>
          <button
            onClick={onLogin}
            className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold transition-all border border-zinc-700"
          >
            Authenticate with Google
          </button>
        </div>
      </section>
    </div>
  );
};
