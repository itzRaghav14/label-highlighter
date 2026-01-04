import { motion } from "framer-motion";
import { NumberBox } from "./NumberBox";

/**
 * NumberGridProps Interface
 *
 * Defines the props required by the NumberGrid component
 */
interface NumberGridProps {
  /** Set of numbers that should be visually highlighted as active (emerald) */
  top9Numbers: Set<number>;
  /** Set of numbers to be highlighted in red */
  redNumbers: Set<number>;
  /** Set of numbers to be highlighted in indigo */
  indigoNumbers: Set<number>;
  /** Callback when a number is clicked */
  onNumberClick?: (number: number) => void;
}

/**
 * NumberGrid Component
 *
 * Displays a roulette-style number grid with numbers 0-36.
 * Number 0 spans the full first row, while 1-36 are arranged in a 3-column grid.
 *
 * Features:
 * - Multi-color highlighting (red, indigo, emerald)
 * - Special layout: 0 spans full width, 1-36 in 3 columns
 * - Staggered entrance animations for visual appeal
 * - Responsive design with proper spacing
 * - Smooth spring-based animations
 */
export function NumberGrid({
  top9Numbers,
  redNumbers,
  indigoNumbers,
  onNumberClick,
}: NumberGridProps) {
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

  /**
   * Determines the highlight props for a given number based on precedence.
   * Precedence: Red > Indigo > Emerald (top 9)
   * @param num The number to check
   * @returns Props for NumberBox (isActive, highlightColor)
   */
  const getHighlightProps = (num: number) => {
    if (redNumbers.has(num)) {
      return { isActive: true, highlightColor: "red" as const };
    }
    if (indigoNumbers.has(num)) {
      return { isActive: true, highlightColor: "indigo" as const };
    }
    if (top9Numbers.has(num)) {
      return { isActive: true, highlightColor: "emerald" as const };
    }
    return { isActive: false };
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
        <motion.div variants={itemVariants} className="col-span-3">
          <NumberBox
            number={0}
            {...getHighlightProps(0)}
            onClick={onNumberClick}
          />
        </motion.div>

        {/* Boxes 1-36: Regular grid items */}
        {Array.from({ length: 36 }, (_, i) => i + 1).map((num) => (
          <motion.div key={num} variants={itemVariants}>
            <NumberBox
              number={num}
              {...getHighlightProps(num)}
              onClick={onNumberClick}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}