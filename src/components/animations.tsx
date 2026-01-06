"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

// 1. Simple Fade In (slides up slightly)
export function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }} // Custom spring-like ease
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 2. Stagger Container (Orchestrates the children)
export const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // 100ms delay between each item
    },
  },
} satisfies Variants;

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } },
} satisfies Variants;
