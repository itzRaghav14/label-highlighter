import { Plus, Undo } from "lucide-react";
import { motion } from "framer-motion";

/**
 * HighlightInputRowProps Interface
 */
interface HighlightInputRowProps {
  color: "red" | "indigo";
  values: string[];
  onChange: (color: "red" | "indigo", index: number, value: string) => void;
}

/**
 * HighlightInputRow Component
 * Renders a row of 4 styled input fields for highlighting numbers.
 */
const HighlightInputRow = ({ color, values, onChange }: HighlightInputRowProps) => {
  const colorClasses = {
    red: "focus:ring-red-500 border-red-500/30",
    indigo: "focus:ring-indigo-500 border-indigo-500/30",
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      {values.map((value, index) => (
        <input
          key={index}
          type="number"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(color, index, e.target.value)}
          placeholder="-"
          className={`w-full bg-neutral-900 border rounded-lg px-2 py-1 text-center text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-neutral-600 ${colorClasses[color]}`}
        />
      ))}
    </div>
  );
};

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
  /** Values for the red highlight inputs */
  redInputs: string[];
  /** Values for the indigo highlight inputs */
  indigoInputs: string[];
  /** Handler for changes in highlight inputs */
  onHighlightChange: (color: "red" | "indigo", index: number, value: string) => void;
}

/**
 * Header Component
 *
 * Renders the top input section of the app containing:
 * - Highlight number inputs
 * - Main number input field (0-36)
 * - Add and Undo buttons
 *
 * Features:
 * - Sticky positioning at top of screen
 * - Backdrop blur effect for modern glass-morphism look
 * - Smooth entrance animation
 * - Interactive button with glow effects
 * - Keyboard support (Enter to add)
 * - Mobile-optimized input (inputMode="numeric")
 */
export function Header({
  inputValue,
  setInputValue,
  handleAdd,
  handleUndo,
  isUndoDisabled,
  handleKeyDown,
  inputRef,
  redInputs,
  indigoInputs,
  onHighlightChange,
}: HeaderProps) {
  return (
    <motion.div
      className="px-6 pt-4 pb-4 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50 border-b border-neutral-800 shadow-2xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-md mx-auto flex flex-col gap-3">
        {/* Highlight Input Rows */}
        <div className="flex flex-col gap-2">
          <HighlightInputRow color="red" values={redInputs} onChange={onHighlightChange} />
          <HighlightInputRow color="indigo" values={indigoInputs} onChange={onHighlightChange} />
        </div>

        {/* Main Input Row */}
        <div className="flex gap-2">
          {/* Number Input Field */}
          <motion.input
            ref={inputRef} // Attach ref for programmatic focus
            type="number"
            inputMode="numeric" // Mobile keyboard optimization
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown} // Handle Enter key press
            placeholder="0-36"
            className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-neutral-600"
            whileFocus={{ scale: 1.02 }} // Subtle scale animation on focus
            transition={{ duration: 0.2 }}
          />

          {/* Add Button */}
          <motion.button
            onClick={handleAdd} // Trigger number addition
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 rounded-xl font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)] active:scale-95 transition-all flex items-center justify-center"
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(16,185,129,0.6)" }}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          >
            <Plus className="w-6 h-6" />
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
            whileHover={!isUndoDisabled ? { scale: 1.05, boxShadow: "0 0 20px rgba(239,68,68,0.6)" } : {}}
            whileTap={!isUndoDisabled ? { scale: 0.95 } : {}}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
          >
            <Undo className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}