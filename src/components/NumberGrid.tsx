import { motion } from "framer-motion";
import { NumberBox } from "./NumberBox";

/**
 * NumberGridProps Interface
 *
 * Defines the props required by the NumberGrid component
 */
interface NumberGridProps {
  /** Set of numbers that should be visually highlighted as active */
  top9Numbers: Set<number>;
}

/**
 * NumberGrid Component
 *
 * Displays a roulette-style number grid with numbers 0-36.
 * Number 0 spans the full first row, while 1-36 are arranged in a 3-column grid.
 *
 * Features:
 * - Special layout: 0 spans full width, 1-36 in 3 columns
 * - Staggered entrance animations for visual appeal
 * - Active numbers (from top9Numbers) get glow effects
 * - Responsive design with proper spacing
 * - Smooth spring-based animations
 */
export function NumberGrid({ top9Numbers }: NumberGridProps) {
  /**
   * Container animation variants for the entire grid
   * Controls the staggered entrance of all number boxes
   */
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // 50ms delay between each child animation
        delayChildren: 0.3, // Wait 300ms before starting children animations
      },
    },
  };

  /**
   * Individual item animation variants
   * Each number box animates in with a spring effect
   */
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.5, y: 20 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const, // Type assertion for Framer Motion
        stiffness: 400, // Spring stiffness (higher = more bouncy)
        damping: 25, // Spring damping (higher = less bouncy)
      },
    },
  };

  return (
    <motion.div
      className="col-span-9 bg-neutral-900/30 border border-neutral-800 rounded-2xl p-2 h-fit"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Main Grid Container - 3 columns layout */}
      <motion.div
        className="grid grid-cols-3 gap-2"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Box 0: Spans full width (col-span-3) */}
        <motion.div variants={itemVariants}>
          <NumberBox
            number={0}
            isActive={top9Numbers.has(0)}
            className="col-span-3" // Spans all 3 columns of the grid
          />
        </motion.div>

        {/* Boxes 1-36: Regular grid items */}
        {Array.from({ length: 36 }, (_, i) => i + 1).map((num) => (
          <motion.div key={num} variants={itemVariants}>
            <NumberBox
              number={num}
              isActive={top9Numbers.has(num)}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}