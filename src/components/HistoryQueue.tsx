import { motion } from "framer-motion";
import { cn } from "../utils/cn";

/**
 * HistoryQueueProps Interface
 *
 * Defines the props required by the HistoryQueue component
 */
interface HistoryQueueProps {
  /** Array of numbers representing the history of entered values */
  history: number[];
}

/**
 * HistoryQueue Component
 *
 * Displays the recent number history in a 2-column grid layout.
 * Shows visual hierarchy with special styling for the top 9 numbers.
 *
 * Features:
 * - 2-column grid layout for compact display
 * - Top 9 numbers get enhanced visual treatment (glow, gradients)
 * - Latest number gets a pulsing dot indicator
 * - Smooth layout animations for adding/removing numbers
 * - First number appears without animation to avoid jarring entrance
 * - Responsive design with proper spacing
 */
export function HistoryQueue({ history }: HistoryQueueProps) {

  return (
    <motion.div
      className="col-span-3 bg-neutral-900/30 border border-neutral-800 rounded-2xl p-2 h-fit"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Main Grid Container */}
      <motion.div
        className="grid grid-cols-2 gap-2"
        layout // Enable layout animations for smooth transitions
      >
        {history.map((num, index) => {
          // Determine visual styling based on position
          const isTop9 = index < 9; // First 9 numbers get special treatment
          const isFirstItem = history.length === 1 && index === 0; // First number ever added

          return (
            <motion.div
              key={`${num}-${index}`} // Unique key combining number and position
              layout // Enable individual item layout animations
              layoutId={`${num}-${index}`} // Consistent layout ID for smooth transitions
              initial={isFirstItem ? false : { // Skip animation for first item
                opacity: 0,
                y: 20,
                scale: 0.8,
                rotateX: -90 // 3D flip entrance effect
              }}
              animate={isFirstItem ? false : { // Skip animation for first item
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0,
              }}
              exit={{ // Exit animation when items are removed
                opacity: 0,
                scale: 0.5,
                rotateY: 180, // 3D flip exit effect
              }}
              transition={isFirstItem ? {} : { // No transition for first item
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              className={cn(
                "relative flex items-center justify-center h-12 rounded-lg font-mono font-bold text-sm border transition-all duration-300 overflow-hidden",
                // Conditional styling based on position
                isTop9
                  ? "bg-gradient-to-br from-emerald-500/30 via-emerald-400/20 to-emerald-600/30 border-emerald-400/60 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.4),0_0_50px_rgba(16,185,129,0.2)]"
                  : "bg-neutral-900 border-neutral-800 text-neutral-600"
              )}
              whileHover={{
                scale: 1.08,
                boxShadow: isTop9 ? "0 0 30px rgba(16,185,129,0.6), 0 0 60px rgba(16,185,129,0.3)" : "0 0 15px rgba(255,255,255,0.1)",
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Multi-layered glow effects for active items */}
              {isTop9 && (
                <>
                  {/* Animated gradient overlay */}
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-400/20 via-transparent to-emerald-400/20"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"], // Shimmer effect
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{ backgroundSize: "200% 200%" }}
                  />

                  {/* Pulsing inner glow */}
                  <motion.div
                    className="absolute inset-0 rounded-lg border border-emerald-300/40"
                    animate={{
                      boxShadow: [
                        "inset 0 0 20px rgba(16,185,129,0.3)",
                        "inset 0 0 40px rgba(16,185,129,0.5)",
                        "inset 0 0 20px rgba(16,185,129,0.3)"
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </>
              )}

              {/* Number display */}
              <span className="relative z-10">{num}</span>

              {/* Tiny dot for latest item */}
              {index === 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399,0_0_16px_#34d399]"
                  animate={{
                    scale: [1, 1.3, 1], // Pulsing scale animation
                    opacity: [1, 0.8, 1] // Pulsing opacity
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Placeholder when history is empty */}
      {history.length === 0 && (
        <motion.div
          className="text-center text-[10px] text-neutral-700 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Empty
        </motion.div>
      )}
    </motion.div>
  );
}