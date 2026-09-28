"use client";

import React, { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginAction, LoginActionResult } from "@/actions/auth";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [state, formAction, isPending] = useActionState<
    LoginActionResult | null,
    FormData
  >(loginAction, null);

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
    <form action={formAction} className="mt-6 space-y-4">
      {/* Hiển thị lỗi nếu có */}
      {state && !state.success && state.message && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs sm:text-sm text-red-600 dark:text-red-400">
          {state.message}
        </div>
      )}

      {/* Trường Số điện thoại hoặc Email */}
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-semibold text-[#112d1b] dark:text-gray-200 mb-2"
        >
          Số điện thoại hoặc Email
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-4 pointer-events-none text-gray-400 dark:text-zinc-500">
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
            id="username"
            name="username"
            type="text"
            required
            placeholder="0912 345 678 hoặc email@domain.com"
            className="w-full rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 pl-12 pr-4 py-4 text-base text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0f5b28] focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Trường Mật khẩu */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="password"
            className="text-sm font-semibold text-[#112d1b] dark:text-gray-200"
          >
            Mật khẩu
          </label>
          <Link
            href="/forgot-password"
            className="text-xs sm:text-sm font-semibold text-[#0f5b28] dark:text-emerald-400 hover:text-[#0b421d] hover:underline transition-colors"
          >
            Quên mật khẩu?
          </Link>
        </div>
        <div className="relative flex items-center">
          <span className="absolute left-4 pointer-events-none text-gray-400 dark:text-zinc-500">
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
            placeholder="••••••••"
            className="w-full rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 pl-12 pr-12 py-4 text-base text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0f5b28] focus:border-transparent transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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

      {/* Tùy chọn Ghi nhớ đăng nhập */}
      <div className="pt-1">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            name="rememberMe"
            value="true"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-5 h-5 rounded-md border border-gray-300 dark:border-zinc-700 peer-checked:bg-[#0f5b28] peer-checked:border-[#0f5b28] flex items-center justify-center transition-all">
            <svg
              className={`w-3.5 h-3.5 text-white transition-opacity ${
                rememberMe ? "opacity-100" : "opacity-0"
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
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Ghi nhớ đăng nhập trên thiết bị này
          </span>
        </label>
      </div>

      {/* Nút Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-4 rounded-2xl bg-[#0f5b28] hover:bg-[#0b481f] active:scale-[0.99] text-white font-semibold text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 hover:shadow-xl hover:shadow-emerald-950/30 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              <span>Đăng Nhập </span>
              <span className="text-lg leading-none font-normal">→</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
