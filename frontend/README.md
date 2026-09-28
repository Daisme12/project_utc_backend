This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

frontend/src/
├── app/                        # Next.js App Router (Routing & Layouts)
│   ├── (auth)/                 # Route Group dành cho Authentication (Không dính Header/Footer chung nếu muốn)
│   │   ├── login/
│   │   │   └── page.tsx        # Trang Đăng nhập (/login)
│   │   └── register/
│   │       └── page.tsx        # Trang Đăng ký (/register)
│   │
│   ├── (main)/                 # Route Group chính (Tự động có Header & Footer)
│   │   ├── layout.tsx          # Layout bao gồm Header & Footer
│   │   ├── page.tsx            # Trang chủ Home (/)
│   │   └── cart/
│   │       └── page.tsx        # Trang Giỏ hàng (/cart)
│   │
│   ├── api/                    # API Route Handlers (Backend endpoints / Proxy)
│   │   └── auth/
│   │       ├── logout/
│   │       │   └── route.ts    # API Xử lý Logout (Clear cookie/session)
│   │       └── me/
│   │           └── route.ts    # API Lấy thông tin user hiện tại
│   │
│   ├── globals.css             # Style toàn cục (Tailwind/CSS)
│   ├── layout.tsx              # Root Layout (Chứa HTML, Body, Providers)
│   ├── loading.tsx             # Loading UI chung cho toàn bộ ứng dụng
│   └── not-found.tsx           # Trang 404 Not Found
│
├── components/                 # React Components
│   ├── layout/                 # Layout Components
│   │   ├── Header.tsx          # Thanh Header / Navigation
│   │   ├── Footer.tsx          # Thanh Footer
│   │   ├── Navbar.tsx          # Các liên kết điều hướng
│   │   └── UserMenu.tsx        # Dropdown Avatar, nút Logout
│   ├── auth/                   # Components xử lý Auth
│   │   ├── LoginForm.tsx       # Form Đăng nhập
│   │   └── LogoutButton.tsx    # Nút bấm Logout (Client Component)
│   ├── cart/                   # Components cho Giỏ hàng
│   │   ├── CartItem.tsx        # Mỗi phần tử sản phẩm trong giỏ
│   │   ├── CartSummary.tsx     # Tóm tắt đơn hàng & Tổng tiền
│   │   └── CartCheckoutBtn.tsx # Nút Thanh toán
│   └── ui/                     # UI Components tái sử dụng (Button, Input, Modal...)
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Spinner.tsx
│
├── actions/                    # Server Actions (Xử lý form, auth ở Server)
│   ├── auth.ts                 # Action login, logout, refresh token
│   └── cart.ts                 # Action thêm/xóa/sửa giỏ hàng
│
├── hooks/                      # Custom React Hooks
│   ├── useAuth.ts              # Hook quản lý trạng thái đăng nhập
│   └── useCart.ts              # Hook quản lý giỏ hàng ở Client
│
├── lib/                        # Khởi tạo thư viện thứ 3 (Axios/Fetch instance, Auth options)
│   ├── api-client.ts           # Fetch / Axios wrapper có kèm JWT Token
│   └── utils.ts                # Helper functions (Format currency, CN classnames...)
│
├── services/                   # Tầng gọi API Backend (Service Layer)
│   ├── auth.service.ts
│   ├── cart.service.ts
│   └── product.service.ts
│
└── types/                      # TypeScript Definitions
    ├── auth.ts                 # Type User, Token, LoginRequest
    └── cart.ts                 # Type CartItem, CartResponse