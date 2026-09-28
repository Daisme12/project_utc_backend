import type { Metadata } from "next";
import AuthTabs from "@/components/auth/AuthTabs";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Đăng nhập | AgriMarket",
  description:
    "Đăng nhập tài khoản AgriMarket để nhận điểm tích lũy và mã giảm giá hôm nay.",
};

export default function LoginPage() {
  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-950/5 border border-gray-100 dark:border-zinc-800 transition-all">
      {/* Tab Switcher: Đăng nhập / Đăng ký */}
      <AuthTabs activeTab="login" />

      {/* Tiêu đề & Lời chào (Render tĩnh tại Server) */}
      <div className="mt-7">
        <h1 className="text-2xl sm:text-[26px] font-bold text-[#0d2a17] dark:text-white tracking-tight">
          Chào mừng quý khách
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Đăng nhập tài khoản để nhận điểm tích lũy và mã giảm giá hôm nay.
        </p>
      </div>

      {/* Form tương tác (Client Component) */}
      <LoginForm />
    </div>
  );
}
