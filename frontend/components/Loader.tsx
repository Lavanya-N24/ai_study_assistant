"use client";

import { motion } from "framer-motion";

export default function Loader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4">
      <div className="relative flex w-12 h-12 items-center justify-center">
        <motion.span
          className="absolute w-full h-full border-4 border-primary/20 border-t-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.span
          className="absolute w-8 h-8 border-4 border-primary/20 border-b-primary rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <p className="text-sm font-medium text-foreground/80 animate-pulse">{text}</p>
    </div>
  );
}
