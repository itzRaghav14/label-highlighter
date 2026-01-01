import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn (Class Names) Utility Function
 *
 * A utility function that combines clsx and tailwind-merge for optimal Tailwind CSS class handling.
 * Safely merges Tailwind classes without conflicts and removes duplicates.
 *
 * @param inputs - Variable number of class values (strings, arrays, objects, etc.)
 * @returns A single string of merged, conflict-free Tailwind classes
 *
 * Features:
 * - Merges conflicting Tailwind classes (e.g., "text-red-500 text-blue-500" → "text-blue-500")
 * - Handles conditional classes via objects: { "bg-red-500": isError }
 * - Supports arrays of classes
 * - Removes duplicate classes
 * - Type-safe with ClassValue type from clsx
 *
 * Usage examples:
 * cn("bg-red-500", "text-white") → "bg-red-500 text-white"
 * cn("text-red-500", condition && "text-blue-500") → "text-blue-500" (if condition true)
 * cn("p-4", { "bg-red-500": isError, "bg-green-500": !isError }) → "p-4 bg-red-500" (if isError)
 */
export function cn(...inputs: ClassValue[]) {
  // First, clsx handles conditional classes and arrays
  // Then, twMerge resolves Tailwind-specific conflicts
  return twMerge(clsx(inputs));
}