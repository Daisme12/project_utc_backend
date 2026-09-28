"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Khi pathname hoặc searchParams thay đổi -> kết thúc loading mượt mà
  useEffect(() => {
    if (loading) {
      setProgress(100);
      const timer = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Hiệu ứng thanh tiến trình mượt mà từ 0% -> 85%
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setProgress(25);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 65) return prev + Math.random() * 15;
          if (prev < 85) return prev + Math.random() * 4;
          if (prev < 95) return prev + 0.3;
          return prev;
        });
      }, 180);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Lắng nghe sự kiện click vào các liên kết nội bộ
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      const targetAttr = target.getAttribute("target");

      if (
        href &&
        href.startsWith("/") &&
        !href.startsWith("/#") &&
        !href.startsWith("//") &&
        targetAttr !== "_blank" &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        const currentUrl = window.location.pathname + window.location.search;
        if (href !== currentUrl) {
          setLoading(true);
          setProgress(20);
        }
      }
    };

    window.addEventListener("click", handleClick, { capture: true });
    return () => window.removeEventListener("click", handleClick, { capture: true });
  }, []);

  if (!loading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none">
      {/* Top glowing progress bar */}
      <div
        className="h-[3px] bg-gradient-to-r from-emerald-500 via-[#195329] to-lime-400 shadow-[0_0_12px_rgba(25,83,41,0.9)]"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
          transition:
            progress === 100
              ? "width 150ms ease-out, opacity 300ms ease-in"
              : "width 250ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />

      {/* Floating subtle spinner badge */}
      <div
        className="fixed top-3 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 dark:bg-zinc-900/95 shadow-lg border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-[#195329] dark:text-emerald-400 backdrop-blur-md transition-opacity duration-200"
        style={{ opacity: progress === 100 ? 0 : 1 }}
      >
        <span className="w-3.5 h-3.5 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin inline-block" />
        <span>Đang tải thực phẩm...</span>
      </div>
    </div>
  );
}
