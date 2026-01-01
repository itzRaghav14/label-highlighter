import { motion } from "framer-motion";
import { cn } from "../utils/cn";

/**
 * NumberBoxProps Interface
 *
 * Defines the props required by the NumberBox component
 */
interface NumberBoxProps {
  /** The number to display in the box */
  number: number;
  /** Whether this number should be visually highlighted as active */
  isActive: boolean;
  /** Additional CSS classes to apply */
  className?: string;
  /** Callback when the number is clicked */
  onClick?: (number: number) => void;
}

/**
 * NumberBox Component
 *
 * Individual number display box for the roulette grid.
 * Shows different visual states for active vs inactive numbers.
 *
 * Features:
 * - Active state: Indigo glow with pulsing animation and scaling
 * - Inactive state: Neutral styling with subtle hover effects
 * - Smooth transitions between states
 * - Responsive design with consistent sizing
 * - Accessibility-friendly with proper contrast
 */
export function NumberBox({ number, isActive, className, onClick }: NumberBoxProps) {
  return (
    <motion.div
      className={cn(
        "h-9 flex items-center justify-center rounded-md text-sm font-bold border transition-all duration-300 cursor-pointer",
        // Conditional styling based on active state
        // Active State (Glowy)
        isActive
          ? "bg-indigo-600 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.6)] z-10"
          : // Inactive State (Outlined)
            "bg-transparent border-neutral-700 text-neutral-500 hover:border-neutral-500",
        className // Allow additional custom classes
      )}
      onClick={() => onClick?.(number)}
      animate={isActive ? {
        scale: [1, 1.08, 1.02], // Pulsing scale animation
        boxShadow: [
          "0 0 15px rgba(99,102,241,0.6)", // Start glow
          "0 0 25px rgba(99,102,241,0.8)", // Peak glow
          "0 0 15px rgba(99,102,241,0.6)"  // Return to start
        ]
      } : {
        scale: 1, // Reset to normal scale
        boxShadow: "0 0 0px rgba(99,102,241,0)" // Remove glow
      }}
      transition={{
        duration: 0.8, // Animation duration
        ease: "easeInOut", // Smooth easing
        repeat: isActive ? Infinity : 0, // Infinite repeat only when active
        repeatType: "reverse" // Reverse direction for smooth loop
      }}
      whileHover={{
        scale: isActive ? 1.08 : 1.02, // Enhanced hover scale
        transition: { duration: 0.2 } // Quick hover response
      }}
    >
      {number}
    </motion.div>
  );
}