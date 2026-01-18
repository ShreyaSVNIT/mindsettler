import { useEffect, useRef } from "react";

// Focus trap for accessibility
export function useFocusTrap(enabled: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const node = ref.current;
    if (!node) return;

    // Focus first focusable element
    const focusable = node.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length) focusable[0].focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
      }
      if (e.key === "Tab") {
        const focusables = Array.from(focusable);
        const i = focusables.indexOf(document.activeElement as HTMLElement);
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
