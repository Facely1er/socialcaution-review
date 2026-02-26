import { useEffect } from 'react';

/**
 * Custom hook for keyboard shortcuts
 * @param {Object} shortcut - The keyboard shortcut configuration
 * @param {string} shortcut.key - The key to press
 * @param {boolean} [shortcut.ctrlKey] - Whether Ctrl key is required
 * @param {boolean} [shortcut.metaKey] - Whether Cmd/Meta key is required
 * @param {boolean} [shortcut.shiftKey] - Whether Shift key is required
 * @param {boolean} [shortcut.altKey] - Whether Alt key is required
 * @param {boolean} [shortcut.preventDefault] - Whether to prevent default behavior
 * @param {Function} callback - Function to call when shortcut is triggered
 * @param {boolean} [enabled=true] - Whether the shortcut is enabled
 */
export const useKeyboardShortcut = (
  shortcut,
  callback,
  enabled = true
) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event) => {
      // Check if all required modifiers match
      const ctrlMatch = shortcut.ctrlKey === undefined || event.ctrlKey === shortcut.ctrlKey;
      const metaMatch = shortcut.metaKey === undefined || event.metaKey === shortcut.metaKey;
      const shiftMatch = shortcut.shiftKey === undefined || event.shiftKey === shortcut.shiftKey;
      const altMatch = shortcut.altKey === undefined || event.altKey === shortcut.altKey;
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

      // If Cmd+K or Ctrl+K (for search)
      const isSearchShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';

      if (keyMatch && ctrlMatch && metaMatch && shiftMatch && altMatch) {
        if (shortcut.preventDefault !== false) {
          event.preventDefault();
        }
        callback();
      } else if (isSearchShortcut && shortcut.key.toLowerCase() === 'k') {
        // Handle Cmd+K / Ctrl+K specifically for cross-platform compatibility
        if (shortcut.preventDefault !== false) {
          event.preventDefault();
        }
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcut, callback, enabled]);
};

/**
 * Hook specifically for search shortcut (Cmd+K / Ctrl+K)
 * @param {Function} onOpen - Function to call when search shortcut is triggered
 * @param {boolean} [enabled=true] - Whether the shortcut is enabled
 */
export const useSearchShortcut = (onOpen, enabled = true) => {
  useKeyboardShortcut(
    { key: 'k', ctrlKey: true, metaKey: true },
    onOpen,
    enabled
  );
};

/**
 * Hook for Escape key
 * @param {Function} onEscape - Function to call when Escape is pressed
 * @param {boolean} [enabled=true] - Whether the shortcut is enabled
 */
export const useEscapeKey = (onEscape, enabled = true) => {
  useKeyboardShortcut(
    { key: 'Escape' },
    onEscape,
    enabled
  );
};

