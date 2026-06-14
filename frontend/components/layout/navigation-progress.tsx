"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const PROGRESS_STEP = 18;

function isInternalNavigation(target: HTMLAnchorElement | null) {
  if (!target) {
    return false;
  }

  const href = target.getAttribute("href");

  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }

  return target.origin === window.location.origin && target.pathname !== window.location.pathname;
}

export function NavigationProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const hideTimerRef = useRef<number | null>(null);
  const stepTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const clearTimers = () => {
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }

      if (stepTimerRef.current) {
        window.clearTimeout(stepTimerRef.current);
        stepTimerRef.current = null;
      }
    };

    const startProgress = () => {
      clearTimers();
      setVisible(true);
      setProgress((current) => (current > 0 ? current : PROGRESS_STEP));

      stepTimerRef.current = window.setTimeout(() => {
        setProgress((current) => (current < 70 ? 70 : current));
      }, 250);
    };

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target instanceof Element ? event.target.closest("a") : null;

      if (target instanceof HTMLAnchorElement && isInternalNavigation(target)) {
        startProgress();
      }
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
      clearTimers();
    };
  }, []);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setProgress(100);

    const hideTimer = window.setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 200);

    return () => {
      window.clearTimeout(hideTimer);
    };
  }, [pathname, visible]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 right-0 top-0 z-[60] h-1 overflow-hidden bg-transparent"
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-primary transition-[width,opacity] duration-300 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          width: `${progress}%`
        }}
      />
    </div>
  );
}
