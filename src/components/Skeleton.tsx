import { motion } from "motion/react";

export const Skeleton = () => {
  return (
    <div className="space-y-4 w-full" id="loading-skeleton">
      <motion.div
        className="h-4 bg-zinc-800 rounded w-3/4"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="h-20 bg-zinc-800 rounded w-full"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
      />
      <motion.div
        className="h-4 bg-zinc-800 rounded w-1/2"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      />
    </div>
  );
};

export const ArchitectSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-12" id="architect-skeleton">
      <motion.div
        className="w-16 h-16 border-4 border-zinc-800 border-t-zinc-400 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.p
        className="text-zinc-500 font-mono text-sm tracking-widest uppercase"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Architecting...
      </motion.p>
    </div>
  );
};
