"use client";

/**
 * MobileDashboard Component
 *
 * Main component for the Roulette Number Tracker app.
 * Provides a mobile-optimized interface for tracking roulette numbers with:
 * - Input field to add numbers (0-36)
 * - Visual grid showing active numbers (top 9 from history)
 * - History queue displaying recent numbers with visual hierarchy
 * - Reset functionality to clear all history
 *
 * Features:
 * - Persistent storage using localStorage
 * - Smooth animations with Framer Motion
 * - Responsive design optimized for mobile
 * - Real-time highlighting of active numbers in the grid
 */

import { useState, useRef } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Header } from "../components/Header";
import { HistoryQueue } from "../components/HistoryQueue";
import { NumberGrid } from "../components/NumberGrid";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function MobileDashboard() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  /**
   * History state - stores the array of entered numbers
   * Uses custom hook for localStorage persistence
   * Automatically loads from localStorage on mount
   */
  const { storedValue: history, setValue: setHistory, isLoaded } = useLocalStorage<number[]>("roulette-history", []);

  /**
   * Input field state - controlled input for number entry
   */
  const [inputValue, setInputValue] = useState("");

  /**
   * Ref for the input field - used for programmatic focus after adding numbers
   */
  const inputRef = useRef<HTMLInputElement>(null);

  // ============================================================================
  // BUSINESS LOGIC FUNCTIONS
  // ============================================================================

  /**
   * handleAdd - Processes user input and adds number to history
   *
   * Validates input:
   * - Must be a valid number
   * - Must be an integer (no decimals)
   * - Must be between 0-36 (inclusive)
   *
   * Updates history:
   * - Adds new number to the beginning of the array
   * - Limits history to last 30 entries to prevent memory issues
   * - Persists to localStorage via setHistory
   *
   * Side effects:
   * - Clears input field
   * - Focuses input field for next entry
   */
  const handleAdd = () => {
    const num = parseInt(inputValue);

    // Input validation
    if (isNaN(num) || num < 0 || num > 36) {
      alert("Please enter a number between 0 and 36");
      return;
    }

    // Check if input is an integer (no decimal points)
    if (parseFloat(inputValue) !== num) {
      alert("Please enter a whole number (no decimals)");
      return;
    }

    // Update history: add to front, keep only last 30 entries
    const newHistory = [num, ...history].slice(0, 30);
    setHistory(newHistory);

    // Reset UI state
    setInputValue("");
    inputRef.current?.focus();
  };

  /**
   * handleAddNumber - Adds a number directly to history (from grid click)
   *
   * Validates input:
   * - Must be between 0-36 (inclusive)
   *
   * Updates history:
   * - Adds new number to the beginning of the array
   * - Limits history to last 30 entries to prevent memory issues
   * - Persists to localStorage via setHistory
   */
  const handleAddNumber = (num: number) => {
    // Input validation
    if (num < 0 || num > 36) {
      alert("Invalid number");
      return;
    }

    // Update history: add to front, keep only last 30 entries
    const newHistory = [num, ...history].slice(0, 30);
    setHistory(newHistory);
  };

  /**
   * handleKeyDown - Handles keyboard input for the number input field
   *
   * Triggers number addition when Enter key is pressed
   * Provides keyboard shortcut for better UX
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAdd();
  };

  /**
   * handleUndo - Removes the most recently added number from history
   *
   * Removes the first element from the history array
   * Recalculates the top 9 numbers for highlighting
   * Only available when history is not empty
   */
  const handleUndo = () => {
    if (history.length > 0) {
      const newHistory = history.slice(1);
      setHistory(newHistory);
    }
  };

  // ============================================================================
  // DERIVED STATE
  // ============================================================================

  /**
   * top9Numbers - Set of numbers that should be visually highlighted
   *
   * Derived from the first 9 numbers in history
   * Uses Set for O(1) lookup performance in the grid
   * Determines which numbers glow in the NumberGrid component
   */
  const top9Numbers = new Set(history.slice(0, 9));

  // ============================================================================
  // LOADING STATE
  // ============================================================================

  /**
   * Loading state guard - prevents hydration mismatch
   *
   * Shows loading screen while localStorage is being read
   * Prevents flash of empty state on initial load
   */
  if (!isLoaded) return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-neutral-500">Loading...</div>;

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-hidden flex flex-col">

      {/* SECTION 1: Header (Input + Button) */}
      <Header
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleAdd={handleAdd}
        handleUndo={handleUndo}
        isUndoDisabled={history.length === 0}
        handleKeyDown={handleKeyDown}
        inputRef={inputRef}
      />

      {/* SECTION 2 & 3: Main Layout (Split Screen) */}
      <div className="flex-1 px-4 py-2 grid grid-cols-12 gap-2 max-w-md mx-auto w-full h-full overflow-hidden">

        {/* LEFT COLUMN: History Queue (Col Span 3) */}
        <HistoryQueue history={history.slice(0, 20)} />

        {/* RIGHT COLUMN: The Grid (Col Span 9) */}
        <NumberGrid top9Numbers={top9Numbers} onNumberClick={handleAddNumber} />

      </div>

      {/* Reset Button at Bottom */}
      <div className="p-4 pb-6">
        <motion.button
          onClick={() => { if(confirm("Reset all history?")) setHistory([]) }}
          className="w-full max-w-md mx-auto bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-xl py-3 font-medium transition-all flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02, backgroundColor: "rgba(239, 68, 68, 0.2)" }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <Trash2 className="w-5 h-5" />
          Reset History
        </motion.button>
      </div>
    </main>
  );
}