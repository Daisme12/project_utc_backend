"use client";

import React, { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerAction, RegisterActionResult } from "@/actions/auth";

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [state, formAction, isPending] = useActionState<
    RegisterActionResult | null,
    FormData
  >(registerAction, null);

  useEffect(() => {
    if (state?.success) {
      if (state.data?.user) {
        localStorage.setItem("user", JSON.stringify(state.data.user));
      } else {
        localStorage.setItem("user", JSON.stringify({ fullName: "Nguyễn Văn A" }));
      }
      if (state.data?.accessToken) {
        localStorage.setItem("token", state.data.accessToken);
      }
      window.dispatchEvent(new Event("auth-change"));
      router.push("/");
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="mt-4 space-y-3.5">
      {/* Thông báo lỗi nếu có từ server */}
      {state && !state.success && state.message && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs sm:text-sm text-red-600 dark:text-red-400">
          {state.message}
        </div>
      )}

      {/* Hàng 1: Họ và tên + Tên đăng nhập */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="fullName"
            className="block text-xs sm:text-sm font-semibold text-[#112d1b] dark:text-gray-200 mb-1.5"
          >
            Họ và tên
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 pointer-events-none text-gray-400 dark:text-zinc-500">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </span>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              placeholder="Nguyễn Văn An"
              className="w-full rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 pl-11 pr-3.5 py-3.5 text-sm sm:text-base text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0f5b28] focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="username"
            className="block text-xs sm:text-sm font-semibold text-[#112d1b] dark:text-gray-200 mb-1.5"
          >
            Tên đăng nhập
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 pointer-events-none text-gray-400 dark:text-zinc-500">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </span>
            <input
              id="username"
              name="username"
              type="text"
              required
              placeholder="nguyenvanan"
              className="w-full rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 pl-11 pr-3.5 py-3.5 text-sm sm:text-base text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0f5b28] focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Hàng 2: Số điện thoại + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="phone"
            className="block text-xs sm:text-sm font-semibold text-[#112d1b] dark:text-gray-200 mb-1.5"
          >
            Số điện thoại
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 pointer-events-none text-gray-400 dark:text-zinc-500">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                />
              </svg>
            </span>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="0912 345 678"
              className="w-full rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 pl-11 pr-3.5 py-3.5 text-sm sm:text-base text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0f5b28] focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-xs sm:text-sm font-semibold text-[#112d1b] dark:text-gray-200 mb-1.5"
          >
            Địa chỉ Email
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 pointer-events-none text-gray-400 dark:text-zinc-500">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
            </span>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="email@domain.com"
              className="w-full rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 pl-11 pr-3.5 py-3.5 text-sm sm:text-base text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0f5b28] focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Hàng 3: Mật khẩu */}
      <div>
        <label
          htmlFor="password"
          className="block text-xs sm:text-sm font-semibold text-[#112d1b] dark:text-gray-200 mb-1.5"
        >
          Mật khẩu
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-3.5 pointer-events-none text-gray-400 dark:text-zinc-500">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
          </span>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="Tối thiểu 6 ký tự"
            className="w-full rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 pl-11 pr-11 py-3.5 text-sm sm:text-base text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0f5b28] focus:border-transparent transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Điều khoản dịch vụ */}
      <div className="pt-0.5">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-4 h-4 rounded border border-gray-300 dark:border-zinc-700 peer-checked:bg-[#0f5b28] peer-checked:border-[#0f5b28] flex items-center justify-center transition-all flex-shrink-0">
            <svg
              className={`w-3 h-3 text-white transition-opacity ${
                agreeTerms ? "opacity-100" : "opacity-0"
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Tôi đồng ý với{" "}
            <Link
              href="/terms"
              className="text-[#0f5b28] dark:text-emerald-400 font-medium hover:underline"
            >
              Điều khoản
            </Link>{" "}
            &{" "}
            <Link
              href="/privacy"
              className="text-[#0f5b28] dark:text-emerald-400 font-medium hover:underline"
            >
              Chính sách bảo mật
            </Link>
          </span>
        </label>
      </div>

      {/* Nút Submit */}
      <div className="pt-1.5">
        <button
          type="submit"
          disabled={isPending || !agreeTerms}
          className="w-full py-3.5 rounded-2xl bg-[#0f5b28] hover:bg-[#0b481f] active:scale-[0.99] text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-emerald-950/20 hover:shadow-lg transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              <span>Đăng Ký Vào Ubofood</span>
              <span className="text-base leading-none font-normal">→</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
