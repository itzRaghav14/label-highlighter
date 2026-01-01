import { Plus, Undo } from "lucide-react";
import { motion } from "framer-motion";

/**
 * HeaderProps Interface
 *
 * Defines the props required by the Header component
 */
interface HeaderProps {
  /** Current value of the number input field */
  inputValue: string;
  /** Function to update the input field value */
  setInputValue: (value: string) => void;
  /** Function to handle adding a number to history */
  handleAdd: () => void;
  /** Function to handle undoing the last addition */
  handleUndo: () => void;
  /** Whether the undo button should be disabled */
  isUndoDisabled: boolean;
  /** Function to handle keyboard events (Enter key) */
  handleKeyDown: (e: React.KeyboardEvent) => void;
  /** Ref to the input field for programmatic focus */
  inputRef: React.RefObject<HTMLInputElement | null>;
}

/**
 * Header Component
 *
 * Renders the top input section of the app containing:
 * - Number input field (0-36)
 * - Add button with plus icon
 *
 * Features:
 * - Sticky positioning at top of screen
 * - Backdrop blur effect for modern glass-morphism look
 * - Smooth entrance animation
 * - Interactive button with glow effects
 * - Keyboard support (Enter to add)
 * - Mobile-optimized input (inputMode="numeric")
 */
export function Header({ inputValue, setInputValue, handleAdd, handleUndo, isUndoDisabled, handleKeyDown, inputRef }: HeaderProps) {

  return (
    <motion.div
      className="px-6 pt-4 pb-2 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50 border-b border-neutral-800 shadow-2xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex gap-2 max-w-md mx-auto">
        {/* Number Input Field */}
        <motion.input
          ref={inputRef} // Attach ref for programmatic focus
          type="number"
          inputMode="numeric" // Mobile keyboard optimization
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown} // Handle Enter key press
          placeholder="0-36"
          className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-neutral-600"
          whileFocus={{ scale: 1.02 }} // Subtle scale animation on focus
          transition={{ duration: 0.2 }}
        />

        {/* Add Button */}
        <motion.button
          onClick={handleAdd} // Trigger number addition
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 rounded-xl font-bold shadow-[0_0_15px_rgba(79,70,229,0.4)] active:scale-95 transition-all flex items-center justify-center"
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(79,70,229,0.6)" }} // Enhanced glow on hover
          whileTap={{ scale: 0.95 }} // Press feedback
          initial={{ scale: 0.9 }} // Start slightly smaller
          animate={{ scale: 1 }} // Animate to full size
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }} // Spring animation with delay
        >
          <Plus className="w-6 h-6" /> {/* Plus icon from Lucide React */}
        </motion.button>

        {/* Undo Button */}
        <motion.button
          onClick={handleUndo} // Trigger undo
          disabled={isUndoDisabled}
          className={`px-4 rounded-xl font-bold active:scale-95 transition-all flex items-center justify-center ${
            isUndoDisabled
              ? "bg-neutral-700 text-neutral-500 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]"
          }`}
          whileHover={
            !isUndoDisabled
              ? { scale: 1.05, boxShadow: "0 0 20px rgba(239,68,68,0.6)" }
              : {}
          } // Enhanced glow on hover if enabled
          whileTap={!isUndoDisabled ? { scale: 0.95 } : {}} // Press feedback if enabled
          initial={{ scale: 0.9 }} // Start slightly smaller
          animate={{ scale: 1 }} // Animate to full size
          transition={{ delay: 0.3, type: "spring", stiffness: 300 }} // Spring animation with delay
        >
          <Undo className="w-6 h-6" /> {/* Undo icon from Lucide React */}
        </motion.button>
      </div>
    </motion.div>
  );
}