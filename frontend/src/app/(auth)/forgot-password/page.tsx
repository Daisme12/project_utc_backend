import type { Metadata } from "next";
import Link from "next/link";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Quên mật khẩu | AgriMarket",
  description:
    "Khôi phục mật khẩu tài khoản AgriMarket bằng mã xác thực OTP gửi về email của bạn.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-950/5 border border-gray-100 dark:border-zinc-800 transition-all">
      {/* Nút quay lại đăng nhập */}
      <div>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0f5b28] dark:text-emerald-400 hover:text-[#0b481f] transition-colors"
        >
          <span>←</span>
          <span>Quay lại Đăng nhập</span>
        </Link>
      </div>

      {/* Tiêu đề & Hướng dẫn (Render tĩnh tại Server) */}
      <div className="mt-5">
        <h1 className="text-2xl sm:text-[26px] font-bold text-[#0d2a17] dark:text-white tracking-tight">
          Khôi phục mật khẩu
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Nhập email tài khoản của bạn để nhận mã xác thực (OTP) cấp lại mật khẩu mới.
        </p>
      </div>

      {/* Form tương tác (Client Component) */}
      <ForgotPasswordForm />
    </div>
  );
}
