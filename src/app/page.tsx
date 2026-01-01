"use client";

import { useState, useRef } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for Shadcn-like class merging
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function MobileDashboard() {
  // 1. State Management
  const { storedValue: history, setValue: setHistory, isLoaded } = useLocalStorage<number[]>("roulette-history", []);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // 2. Logic: Add Number
  const handleAdd = () => {
    const num = parseInt(inputValue);
    
    if (isNaN(num) || num < 0 || num > 36) {
      alert("Please enter a number between 0 and 36");
      return;
    }

    // Add to top, keep only last 20
    const newHistory = [num, ...history].slice(0, 20);
    setHistory(newHistory);
    setInputValue("");
    inputRef.current?.focus();
  };

  // Logic: Handle "Enter" key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAdd();
  };

  // Logic: Identify "Active" numbers (Top 9 in history)
  // We use a Set for fast lookup.
  const top9Numbers = new Set(history.slice(0, 9));

  // Loading state to prevent hydration mismatch
  if (!isLoaded) return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-neutral-500">Loading...</div>;

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-hidden flex flex-col">
      
      {/* SECTION 1: Header (Input + Button) */}
      <div className="p-4 pt-6 pb-4 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50 border-b border-neutral-800 shadow-2xl">
        <div className="flex gap-3 max-w-md mx-auto">
          <input
            ref={inputRef}
            type="number"
            inputMode="numeric"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="0-36"
            className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-neutral-600"
          />
          <button
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 rounded-xl font-bold shadow-[0_0_15px_rgba(79,70,229,0.4)] active:scale-95 transition-all flex items-center justify-center"
          >
            <Plus className="w-6 h-6" />
          </button>
          
          {/* Reset Button (Optional, small icon) */}
          <button 
            onClick={() => { if(confirm("Clear all?")) setHistory([]) }}
            className="bg-neutral-800 text-neutral-400 px-3 rounded-xl active:bg-red-900/20 active:text-red-500"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* SECTION 2 & 3: Main Layout (Split Screen) */}
      <div className="flex-1 p-2 grid grid-cols-12 gap-2 max-w-md mx-auto w-full h-full overflow-hidden">
        
        {/* LEFT COLUMN: History Queue (Col Span 3) */}
        <div className="col-span-3 flex flex-col gap-2 overflow-y-auto pb-20 no-scrollbar">
          <AnimatePresence initial={false}>
            {history.map((num, index) => {
              const isTop9 = index < 9;
              
              return (
                <div key={`${index}-${num}-${Date.now()}`} className="contents">
                  <motion.div
                    initial={{ opacity: 0, x: -20, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className={cn(
                      "relative flex items-center justify-center h-10 rounded-lg font-mono font-bold text-sm border transition-all duration-300",
                      isTop9 
                        ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]" 
                        : "bg-neutral-900 border-neutral-800 text-neutral-600"
                    )}
                  >
                    {num}
                    {/* Tiny dot for latest item */}
                    {index === 0 && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_5px_#34d399]" />
                    )}
                  </motion.div>
                  
                  {/* The Horizontal Line Separator after the 9th item (index 8) */}
                  {index === 8 && (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="h-0.5 w-full bg-linear-to-r from-transparent via-neutral-700 to-transparent my-1" 
                    />
                  )}
                </div>
              );
            })}
          </AnimatePresence>
          
          {/* Placeholder if empty */}
          {history.length === 0 && (
            <div className="text-center text-[10px] text-neutral-700 mt-10">Empty</div>
          )}
        </div>

        {/* RIGHT COLUMN: The Grid (Col Span 9) */}
        <div className="col-span-9 bg-neutral-900/30 border border-neutral-800 rounded-2xl p-2 h-fit">
          <div className="grid grid-cols-4 gap-1.5">
            
            {/* Box 0: Spans full width (col-span-4) */}
            <NumberBox 
              number={0} 
              isActive={top9Numbers.has(0)} 
              className="col-span-4 h-10" 
            />

            {/* Boxes 1-36 */}
            {Array.from({ length: 36 }, (_, i) => i + 1).map((num) => (
              <NumberBox 
                key={num} 
                number={num} 
                isActive={top9Numbers.has(num)} 
              />
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}

// Sub-component for individual grid boxes
function NumberBox({ number, isActive, className }: { number: number, isActive: boolean, className?: string }) {
  return (
    <div
      className={cn(
        "h-9 flex items-center justify-center rounded-md text-sm font-bold border transition-all duration-300",
        // Active State (Glowy)
        isActive
          ? "bg-indigo-600 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.6)] z-10 scale-105"
          // Inactive State (Outlined)
          : "bg-transparent border-neutral-700 text-neutral-500 hover:border-neutral-500",
        className
      )}
    >
      {number}
    </div>
  );
}