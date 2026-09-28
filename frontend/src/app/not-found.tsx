import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h2 className="text-3xl font-bold tracking-tight">404 - Không tìm thấy trang</h2>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
