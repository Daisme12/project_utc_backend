import Link from "next/link";

interface AuthTabsProps {
  activeTab: "login" | "register";
}

export default function AuthTabs({ activeTab }: AuthTabsProps) {
  return (
    <div className="bg-[#e4f4e7] dark:bg-emerald-950/40 p-1.5 rounded-full flex items-center">
      <Link
        href="/login"
        className={`flex-1 py-2.5 px-4 text-center text-sm font-semibold rounded-full transition-all ${
          activeTab === "login"
            ? "bg-white dark:bg-zinc-800 text-[#123e1f] dark:text-emerald-300 shadow-sm"
            : "text-[#2c5237] dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-200"
        }`}
      >
        Đăng nhập
      </Link>
      <Link
        href="/register"
        className={`flex-1 py-2.5 px-4 text-center text-sm font-semibold rounded-full transition-all ${
          activeTab === "register"
            ? "bg-white dark:bg-zinc-800 text-[#123e1f] dark:text-emerald-300 shadow-sm"
            : "text-[#2c5237] dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-200"
        }`}
      >
        Đăng ký thành viên mới
      </Link>
    </div>
  );
}
