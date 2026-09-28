import type { Metadata } from "next";
import AuthTabs from "@/components/auth/AuthTabs";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Đăng ký thành viên mới | AgriMarket",
  description:
    "Đăng ký tài khoản thành viên AgriMarket để nhận ngay ưu đãi và tích điểm khi mua sắm hôm nay.",
};

export default function RegisterPage() {
  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-3xl p-5 sm:p-6 shadow-xl shadow-emerald-950/5 border border-gray-100 dark:border-zinc-800 transition-all">
      {/* Tab Switcher: Đăng nhập / Đăng ký */}
      <AuthTabs activeTab="register" />

      {/* Tiêu đề & Lời chào (Render tĩnh tại Server) */}
      <div className="mt-4">
        <h1 className="text-xl sm:text-2xl font-bold text-[#0d2a17] dark:text-white tracking-tight">
          Tạo tài khoản mới
        </h1>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Đăng ký thành viên AgriMarket để nhận ngay ưu đãi và tích điểm.
        </p>
      </div>

      {/* Form tương tác (Client Component) */}
      <RegisterForm />
    </div>
  );
}
