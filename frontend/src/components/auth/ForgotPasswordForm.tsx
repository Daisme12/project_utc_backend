"use client";

import React, { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  forgotPasswordAction,
  ForgotPasswordActionResult,
  resetPasswordAction,
  ResetPasswordActionResult,
} from "@/actions/auth";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Hook gửi mã OTP về email
  const [forgotState, forgotFormAction, isForgotPending] = useActionState<
    ForgotPasswordActionResult | null,
    FormData
  >(forgotPasswordAction, null);

  // Hook xác thực OTP và đổi mật khẩu mới
  const [resetState, resetFormAction, isResetPending] = useActionState<
    ResetPasswordActionResult | null,
    FormData
  >(resetPasswordAction, null);

  // Khi gửi OTP thành công -> chuyển sang Bước 2
  useEffect(() => {
    if (forgotState?.success && forgotState.email) {
      setEmail(forgotState.email);
      setStep(2);
    }
  }, [forgotState]);

  // Khi đặt lại mật khẩu thành công -> chuyển về trang đăng nhập
  useEffect(() => {
    if (resetState?.success) {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [resetState, router]);

  return (
    <div className="mt-6">
      {/* ================= BƯỚC 1: NHẬP EMAIL ĐỂ GỬI MÃ OTP ================= */}
      {step === 1 && (
        <form action={forgotFormAction} className="space-y-4">
          {/* Thông báo lỗi nếu có */}
          {forgotState && !forgotState.success && forgotState.message && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs sm:text-sm text-red-600 dark:text-red-400">
              {forgotState.message}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-[#112d1b] dark:text-gray-200 mb-2"
            >
              Địa chỉ Email tài khoản
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
                id="email"
                name="email"
                type="email"
                required
                defaultValue={email}
                placeholder="Nhập email của bạn (vd: abc@gmail.com)"
                className="w-full rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 pl-12 pr-4 py-4 text-base text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0f5b28] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isForgotPending}
              className="w-full py-4 rounded-2xl bg-[#0f5b28] hover:bg-[#0b481f] active:scale-[0.99] text-white font-semibold text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 hover:shadow-xl hover:shadow-emerald-950/30 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isForgotPending ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>Gửi Mã Xác Nhận Về Email</span>
                  <span className="text-lg leading-none font-normal">→</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-2 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0f5b28] dark:text-emerald-400 hover:underline"
            >
              <span>←</span>
              <span>Quay lại trang Đăng nhập</span>
            </Link>
          </div>
        </form>
      )}

      {/* ================= BƯỚC 2: NHẬP MÃ OTP & MẬT KHẨU MỚI ================= */}
      {step === 2 && (
        <form action={resetFormAction} className="space-y-4">
          {/* Thông báo thành công nếu đã đổi mật khẩu */}
          {resetState?.success ? (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-sm text-emerald-800 dark:text-emerald-300 text-center font-medium">
              🎉 {resetState.message}
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                Đang chuyển hướng sang trang Đăng nhập...
              </p>
            </div>
          ) : (
            <>
              {/* Box thông báo đã gửi OTP */}
              <div className="p-3.5 rounded-2xl bg-[#ebf7ee] dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/60 text-xs sm:text-sm text-[#0d4a20] dark:text-emerald-300 flex items-start gap-2.5">
                <span className="text-base leading-none">✉️</span>
                <div>
                  <span>Mã xác thực đã được gửi tới </span>
                  <strong className="font-semibold">{email}</strong>.
                  <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Mã có hiệu lực trong 15 phút. Vui lòng kiểm tra cả mục Spam.
                  </span>
                </div>
              </div>

              {/* Thông báo lỗi nếu có */}
              {resetState && !resetState.success && resetState.message && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs sm:text-sm text-red-600 dark:text-red-400">
                  {resetState.message}
                </div>
              )}

              {/* Email ẩn để submit kèm */}
              <input type="hidden" name="email" value={email} />

              {/* Ô nhập mã xác nhận (OTP/Token) */}
              <div>
                <label
                  htmlFor="resetToken"
                  className="block text-sm font-semibold text-[#112d1b] dark:text-gray-200 mb-2"
                >
                  Mã xác thực OTP / Token
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
                        d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                      />
                    </svg>
                  </span>
                  <input
                    id="resetToken"
                    name="resetToken"
                    type="text"
                    required
                    placeholder="Dán mã xác nhận nhận được từ email"
                    className="w-full rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 pl-12 pr-4 py-3.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0f5b28] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Mật khẩu mới */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-semibold text-[#112d1b] dark:text-gray-200 mb-2"
                >
                  Mật khẩu mới
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
                        d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                      />
                    </svg>
                  </span>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Tối thiểu 6 ký tự"
                    className="w-full rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 pl-12 pr-12 py-3.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0f5b28] focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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

              {/* Nhập lại mật khẩu mới */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-[#112d1b] dark:text-gray-200 mb-2"
                >
                  Nhập lại mật khẩu mới
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
                        d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                      />
                    </svg>
                  </span>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Nhập lại mật khẩu mới"
                    className="w-full rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 pl-12 pr-12 py-3.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0f5b28] focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? (
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

              {/* Nút Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isResetPending}
                  className="w-full py-4 rounded-2xl bg-[#0f5b28] hover:bg-[#0b481f] active:scale-[0.99] text-white font-semibold text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 hover:shadow-xl hover:shadow-emerald-950/30 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isResetPending ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <span>Xác Nhận & Đổi Mật Khẩu Mới</span>
                      <span className="text-lg leading-none font-normal">→</span>
                    </>
                  )}
                </button>
              </div>

              {/* Nút quay lại bước 1 */}
              <div className="pt-2 flex justify-between items-center text-xs sm:text-sm">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium"
                >
                  ← Đổi email khác
                </button>
                <Link
                  href="/login"
                  className="text-[#0f5b28] dark:text-emerald-400 font-semibold hover:underline"
                >
                  Đăng nhập
                </Link>
              </div>
            </>
          )}
        </form>
      )}
    </div>
  );
}
