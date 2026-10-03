import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PolicySidebar from "@/components/policy/PolicySidebar";
import Link from "next/link";

export default function PolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7faf8] dark:bg-[#0c120e] text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <li>
              <Link href="/" className="hover:text-[#195329] dark:hover:text-emerald-400 transition-colors">
                Trang chủ
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/chinh-sach" className="hover:text-[#195329] dark:hover:text-emerald-400 transition-colors">
                Chính sách & Hỗ trợ
              </Link>
            </li>
          </ol>
        </nav>

        {/* 2-Column Grid: Sidebar + Main Policy Content */}
        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
          <PolicySidebar />

          <section className="flex-1 w-full min-w-0">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-100 dark:border-zinc-800 shadow-xs">
              {children}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
