"use server";

import { cookies } from "next/headers";
import { AuthResponse } from "@/types/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export interface LoginActionResult {
  success: boolean;
  message?: string;
  data?: AuthResponse;
}

export async function loginAction(
  prevState: unknown,
  formData:
    | FormData
    | { username: string; password: string; rememberMe?: boolean }
): Promise<LoginActionResult> {
  let username = "";
  let password = "";
  let rememberMe = true;

  if (formData instanceof FormData) {
    username = formData.get("username")?.toString() || "";
    password = formData.get("password")?.toString() || "";
    rememberMe =
      formData.get("rememberMe") === "true" ||
      formData.get("rememberMe") === "on";
  } else {
    username = formData.username || "";
    password = formData.password || "";
    rememberMe = formData.rememberMe ?? true;
  }

  // Validate dữ liệu đầu vào
  if (!username.trim()) {
    return { success: false, message: "Vui lòng nhập số điện thoại hoặc email" };
  }
  if (!password) {
    return { success: false, message: "Vui lòng nhập mật khẩu" };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.trim(),
        password,
      }),
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result?.message || "Tên đăng nhập hoặc mật khẩu không chính xác",
      };
    }

    const authData: AuthResponse = result?.data || result;

    // Lưu token vào HttpOnly Cookie tại Server
    if (authData?.accessToken) {
      const cookieStore = await cookies();
      const maxAge = rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 24; // 7 ngày hoặc 1 ngày

      cookieStore.set("token", authData.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge,
      });
    }

    return {
      success: true,
      message: result?.message || "Đăng nhập thành công",
      data: authData,
    };
  } catch (error) {
    console.error("Lỗi khi đăng nhập ở Server:", error);
    return {
      success: false,
      message:
        "Không thể kết nối đến máy chủ backend. Vui lòng kiểm tra lại dịch vụ.",
    };
  }
}

export interface RegisterActionResult {
  success: boolean;
  message?: string;
  data?: AuthResponse;
}

export async function registerAction(
  prevState: unknown,
  formData: FormData
): Promise<RegisterActionResult> {
  const fullName = formData.get("fullName")?.toString()?.trim() || "";
  const username = formData.get("username")?.toString()?.trim() || "";
  const phone = formData.get("phone")?.toString()?.trim() || "";
  const email = formData.get("email")?.toString()?.trim() || "";
  const password = formData.get("password")?.toString() || "";
  const confirmPassword = formData.get("confirmPassword")?.toString() || "";

  if (!fullName) {
    return { success: false, message: "Vui lòng nhập họ và tên" };
  }
  if (!username || username.length < 3) {
    return { success: false, message: "Tên đăng nhập phải có ít nhất 3 ký tự" };
  }
  if (!email) {
    return { success: false, message: "Vui lòng nhập địa chỉ email" };
  }
  if (!password || password.length < 6) {
    return { success: false, message: "Mật khẩu phải có ít nhất 6 ký tự" };
  }
  if (password !== confirmPassword) {
    return { success: false, message: "Mật khẩu xác nhận không khớp" };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName,
        username,
        phone,
        email,
        password,
        roleId: 4, // Role mặc định: CUSTOMER (Khách hàng thành viên)
      }),
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result?.message || "Đăng ký không thành công. Vui lòng thử lại!",
      };
    }

    const authData: AuthResponse = result?.data || result;

    if (authData?.accessToken) {
      const cookieStore = await cookies();
      cookieStore.set("token", authData.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return {
      success: true,
      message: "Đăng ký tài khoản thành công!",
      data: authData,
    };
  } catch (error) {
    console.error("Lỗi khi đăng ký ở Server:", error);
    return {
      success: false,
      message:
        "Không thể kết nối đến máy chủ backend. Vui lòng kiểm tra lại dịch vụ.",
    };
  }
}

export interface ForgotPasswordActionResult {
  success: boolean;
  message?: string;
  email?: string;
}

export async function forgotPasswordAction(
  prevState: unknown,
  formData: FormData
): Promise<ForgotPasswordActionResult> {
  const email = formData.get("email")?.toString()?.trim() || "";

  if (!email) {
    return { success: false, message: "Vui lòng nhập địa chỉ email của bạn" };
  }

  try {
    const res = await fetch(
      `${API_BASE_URL}/auth/forgot-password?email=${encodeURIComponent(email)}`,
      {
        method: "POST",
        cache: "no-store",
      }
    );

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message:
          result?.message ||
          "Không tìm thấy tài khoản với email này hoặc đã có lỗi xảy ra",
      };
    }

    return {
      success: true,
      message:
        result?.message ||
        "Mã xác nhận (OTP) đặt lại mật khẩu đã được gửi đến email của bạn!",
      email,
    };
  } catch (error) {
    console.error("Lỗi khi gửi yêu cầu quên mật khẩu:", error);
    return {
      success: false,
      message: "Không thể kết nối đến máy chủ. Vui lòng thử lại sau.",
    };
  }
}

export interface ResetPasswordActionResult {
  success: boolean;
  message?: string;
}

export async function resetPasswordAction(
  prevState: unknown,
  formData: FormData
): Promise<ResetPasswordActionResult> {
  const email = formData.get("email")?.toString()?.trim() || "";
  const resetToken = formData.get("resetToken")?.toString()?.trim() || "";
  const newPassword = formData.get("newPassword")?.toString() || "";
  const confirmPassword = formData.get("confirmPassword")?.toString() || "";

  if (!email) {
    return { success: false, message: "Thiếu thông tin email" };
  }
  if (!resetToken) {
    return { success: false, message: "Vui lòng nhập mã xác nhận (OTP / Token)" };
  }
  if (!newPassword || newPassword.length < 6) {
    return { success: false, message: "Mật khẩu mới phải có ít nhất 6 ký tự" };
  }
  if (newPassword !== confirmPassword) {
    return { success: false, message: "Mật khẩu xác nhận không khớp" };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        resetToken,
        newPassword,
      }),
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message:
          result?.message ||
          "Mã OTP không hợp lệ hoặc đã hết hạn (chỉ có hiệu lực 15 phút)",
      };
    }

    return {
      success: true,
      message: result?.message || "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.",
    };
  } catch (error) {
    console.error("Lỗi khi đặt lại mật khẩu:", error);
    return {
      success: false,
      message: "Không thể kết nối đến máy chủ. Vui lòng thử lại sau.",
    };
  }
}

export async function logoutAction(): Promise<{ success: boolean; message: string }> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    return {
      success: true,
      message: "Đăng xuất tài khoản thành công!",
    };
  } catch (error) {
    console.error("Lỗi khi đăng xuất:", error);
    return {
      success: false,
      message: "Có lỗi xảy ra khi đăng xuất.",
    };
  }
}

export async function checkAuthAction(): Promise<{
  isLoggedIn: boolean;
  token?: string;
}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    return {
      isLoggedIn: !!token,
      token,
    };
  } catch {
    return {
      isLoggedIn: false,
    };
  }
}



