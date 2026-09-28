import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f7faf8] dark:bg-[#0c120e] flex flex-col font-sans transition-colors">
      {/* Top green shimmer progress indicator */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-gray-100 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-emerald-500 via-[#195329] to-lime-400 animate-pulse w-full"></div>
      </div>

      {/* Header Placeholder */}
      <div className="w-full bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 animate-pulse" />
            <div className="w-28 h-6 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
          </div>
          <div className="hidden sm:block flex-1 max-w-md h-9 bg-gray-100 dark:bg-zinc-800 rounded-full animate-pulse" />
          <div className="w-24 h-9 bg-gray-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
        </div>
      </div>

      {/* Main Body Skeleton */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-6">
        {/* Top Banner Skeleton */}
        <div className="w-full h-11 bg-emerald-900/10 dark:bg-emerald-950/40 rounded-2xl animate-pulse" />

        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="w-36 h-3 bg-gray-200 dark:bg-zinc-800 rounded-md animate-pulse" />
          <div className="w-64 h-7 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
        </div>

        {/* 2-Column Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-3 h-80 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-4 space-y-3 animate-pulse">
            <div className="w-full h-5 bg-gray-200 dark:bg-zinc-800 rounded-md" />
            <div className="w-3/4 h-4 bg-gray-100 dark:bg-zinc-800 rounded-md" />
            <div className="w-5/6 h-4 bg-gray-100 dark:bg-zinc-800 rounded-md" />
            <div className="w-2/3 h-4 bg-gray-100 dark:bg-zinc-800 rounded-md" />
          </div>

          <div className="lg:col-span-9 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-3.5 space-y-3 animate-pulse"
              >
                <div className="w-full aspect-square bg-gray-100 dark:bg-zinc-800 rounded-2xl" />
                <div className="w-3/4 h-4 bg-gray-200 dark:bg-zinc-800 rounded-md" />
                <div className="w-1/2 h-4 bg-emerald-100 dark:bg-emerald-950/60 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
