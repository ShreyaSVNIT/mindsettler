import { useEffect, useRef } from "react";

// Focus trap for accessibility
export function useFocusTrap(enabled: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const node = ref.current;
    if (!node) return;

    // Prefer focusing an input/textarea first (better UX for chat modals).
    const queryFocusable = () =>
      Array.from(
        node.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      );

    const tryFocus = () => {
      const firstInput = node.querySelector<HTMLInputElement | HTMLTextAreaElement>('input, textarea, [contenteditable]');
      if (firstInput) {
        firstInput.focus();
        return true;
      }

      // Fallback: focus the first focusable element (buttons/links/etc.)
      const focusable = queryFocusable();
      if (focusable.length) {
        focusable[0].focus();
        return true;
      }
      return false;
    };

    // Try immediately, then once more shortly after to account for animations/mount timing.
    if (!tryFocus()) {
      const id = window.setTimeout(() => tryFocus(), 50);
      return () => window.clearTimeout(id);
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
      }
      if (e.key === "Tab") {
        const focusables = queryFocusable();
        const active = document.activeElement as HTMLElement | null;
        const i = active ? focusables.indexOf(active) : -1;
        if (e.shiftKey && i === 0) {
          e.preventDefault();
          focusables[focusables.length - 1].focus();
        } else if (!e.shiftKey && i === focusables.length - 1) {
          e.preventDefault();
          focusables[0].focus();
        }
      }
    }
    node.addEventListener("keydown", handleKeyDown);
    return () => node.removeEventListener("keydown", handleKeyDown);
  }, [enabled, close]);

  return ref;
}
