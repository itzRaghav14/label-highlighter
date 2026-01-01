import { useState, useEffect } from "react";

/**
 * useLocalStorage Hook
 *
 * A custom React hook for persisting state in localStorage with SSR safety.
 * Handles hydration mismatches and provides loading state.
 *
 * @template T - The type of value to store
 * @param key - The localStorage key to use for persistence
 * @param initialValue - The initial value to use if no stored value exists
 * @returns Object containing storedValue, setValue function, and isLoaded boolean
 *
 * Features:
 * - SSR-safe: Works with Next.js server-side rendering
 * - Hydration-safe: Prevents hydration mismatches
 * - Type-safe: Maintains TypeScript types throughout
 * - Error handling: Gracefully handles localStorage errors
 * - Functional updates: Supports both direct values and updater functions
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  /**
   * storedValue - The current value stored in both state and localStorage
   * Initialized with initialValue for SSR compatibility
   */
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  /**
   * isInitialized - Tracks whether we've successfully loaded from localStorage
   * Prevents hydration mismatches by indicating when client-side data is ready
   */
  const [isInitialized, setIsInitialized] = useState(false);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  /**
   * Effect to load initial value from localStorage
   * Runs only on the client after first render to avoid SSR issues
   */
  useEffect(() => {
    try {
      // Attempt to retrieve stored value from localStorage
      const item = window.localStorage.getItem(key);
      if (item) {
        // Parse and set the stored value if it exists
        setStoredValue(JSON.parse(item));
      }
      // Note: If no item exists, we keep the initialValue
    } catch (error) {
      // Handle any localStorage errors (quota exceeded, corrupted data, etc.)
      console.log(error);
    }

    // Mark initialization as complete
    setIsInitialized(true);
  }, [key]); // Re-run if key changes (though unlikely in practice)

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  /**
   * setValue - Updates both React state and localStorage
   *
   * Supports both direct values and functional updates (like useState setter)
   * Handles serialization to JSON and localStorage persistence
   *
   * @param value - New value or updater function
   */
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Resolve the value (handle functional updates)
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Update React state
      setStoredValue(valueToStore);

      // Persist to localStorage (with SSR check)
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // Handle localStorage errors (quota exceeded, etc.)
      console.log(error);
    }
  };

  // ============================================================================
  // RETURN VALUE
  // ============================================================================

  /**
   * Return object with stored value, setter function, and loading state
   * isLoaded indicates when it's safe to use storedValue (prevents hydration issues)
   */
  return { storedValue, setValue, isLoaded: isInitialized };
}