# 🚀 UTC Backend - Spring Boot 3 RESTful API

Dự án Backend hoàn chỉnh được xây dựng trên nền tảng **Spring Boot 3 (Java 21)** tuân thủ nghiêm ngặt theo mô hình **Layered Architecture (Kiến trúc phân lớp chuẩn doanh nghiệp)**, tích hợp sẵn hệ thống phân quyền JWT, cổng thanh toán trực tuyến VNPAY Sandbox, dịch vụ lưu trữ hình ảnh Cloudinary và gửi mail thông báo Gmail SMTP.

---

## 📋 Mục lục
- [1. Tính năng nổi bật](#1-tính-năng-nổi-bật)
- [2. Công nghệ sử dụng](#2-công-nghệ-sử-dụng)
- [3. Cấu trúc thư mục dự án](#3-cấu-trúc-thư-mục-dự-án)
- [4. Mô hình Cơ sở dữ liệu (Database Schema)](#4-mô-hình-cơ-sở-dữ-liệu-database-schema)
- [5. Hướng dẫn cài đặt & Khởi chạy](#5-hướng-dẫn-cài-đặt--khởi-chạy)
- [6. Tài liệu API & Kiểm thử](#6-tài-liệu-api--kiểm-thử)
- [7. Tài khoản dùng thử mặc định](#7-tài-khoản-dùng-thử-mặc-định)

---

## 🌟 1. Tính năng nổi bật

* 🔐 **Xác thực & Phân quyền (Authentication & Authorization):**
  * Đăng ký, Đăng nhập, Cấp JWT Token (HMAC-SHA256), Refresh Token.
  * Đổi mật khẩu, Quên mật khẩu qua email OTP bảo mật.
  * Phân quyền Role-based (`ROLE_ADMIN`, `ROLE_STAFF`, `ROLE_CUSTOMER`).
* 📦 **Quản lý Sản phẩm & Danh mục (Catalog Management):**
  * Phân trang, tìm kiếm sản phẩm đa tiêu chí, lọc theo danh mục / khoảng giá.
* 🏬 **Quản lý Kho & Nhập hàng (Inventory & Goods Receipt):**
  * Nhập hàng từ Nhà cung cấp (`GoodsReceipt`), tự động cập nhật số lượng tồn kho.
  * Ghi nhật ký biến động kho chi tiết (`InventoryTransaction`).
* 🛒 **Quản lý Đơn hàng & Bán hàng (Order Management):**
  * Tạo đơn hàng (`Order`, `OrderItem`), tự động kiểm tra và trừ tồn kho, tính tổng tiền.
* 💳 **Cổng Thanh toán Trực tuyến VNPAY Sandbox:**
  * Sinh URL thanh toán quét mã QR / thẻ ngân hàng, xử lý IPN & Callback cập nhật trạng thái đơn hàng.
* ☁️ **Lưu trữ ảnh mây Cloudinary (Signed Mode):**
  * Tải ảnh sản phẩm trực tiếp từ Backend lên Cloudinary với thư mục riêng biệt `project-utc/`.
* 🛡️ **Bắt lỗi toàn cục (Global Exception Handling):**
  * Bắt và chuẩn hóa 11 nhóm mã lỗi hệ thống theo chuẩn `ApiResponse<T>`.

---

## 🛠️ 2. Công nghệ sử dụng

| Công nghệ | Phiên bản | Mô tả |
| :--- | :--- | :--- |
| **Java** | 21 LTS | Ngôn ngữ chính, tận dụng Record DTO, Pattern Matching |
| **Spring Boot** | 3.4.3 | Framework phát triển ứng dụng Java hàng đầu |
| **Spring Security** | 6.x | Bảo mật hệ thống, mã hóa BCrypt, phân quyền Endpoint |
| **JJWT (io.jsonwebtoken)** | 0.12.6 | Xử lý sinh và giải mã JSON Web Token |
| **Spring Data JPA / Hibernate** | 6.x | Tầng ORM giao tiếp CSDL, tối ưu EntityGraph chống N+1 |
| **H2 Database** | In-Memory | Cơ sở dữ liệu chạy ngầm phục vụ test nhanh không cần cài đặt |
| **MySQL Server** | 8.x | Cơ sở dữ liệu quan hệ cho môi trường Production |
| **Cloudinary SDK** | 1.39.0 | Tích hợp tải và quản lý media đám mây |
| **SpringDoc OpenAPI / Swagger UI** | 2.8.5 | Tự động sinh tài liệu API trực quan |
| **Lombok** | 1.18.36 | Giảm boilerplate code (`@Getter`, `@Setter`, `@Builder`...) |

---

## 📁 3. Cấu trúc thư mục dự án

```text
src/main/java/com/utc/backend/
├── common/             # Các lớp dùng chung (ApiResponse, PagedResponse, AppConstants, Utils)
├── config/             # Cấu hình Spring (Security, JWT, CORS, OpenAPI, Cloudinary, VnPay, DataInitializer)
├── controller/         # REST Controllers tiếp nhận Request từ Client (12 Controllers)
├── dto/                # Java 21 Record Data Transfer Objects có Jakarta Validation
├── entity/             # JPA Entities ánh xạ bảng CSDL (11 Entities)
├── exception/          # Bắt lỗi toàn cục @RestControllerAdvice & Custom Exceptions
├── mapper/             # Chuyển đổi 2 chiều giữa Entity và DTO
├── repository/         # Tầng giao tiếp Database mở rộng JpaRepository
├── service/            # Interfaces định nghĩa nghiệp vụ
│   └── impl/           # Hiện thực hóa nghiệp vụ (Business Logic Implementations)
└── SpringServerApplication.java
```

---

## 🗄️ 4. Mô hình Cơ sở dữ liệu (Database Schema)

Hệ thống bao gồm **11 thực thể (bảng CSDL)** liên kết chặt chẽ:
1. `roles`: Lưu trữ vai trò người dùng (`ROLE_ADMIN`, `ROLE_STAFF`, `ROLE_CUSTOMER`).
2. `users`: Tài khoản, thông tin cá nhân và liên kết quyền.
3. `categories`: Danh mục phân loại sản phẩm.
4. `suppliers`: Nhà cung cấp hàng hóa.
5. `products`: Thông tin sản phẩm, giá bán, số lượng tồn kho.
6. `goods_receipts`: Phiếu nhập kho hàng hóa từ nhà cung cấp.
7. `goods_receipt_details`: Chi tiết từng mặt hàng và đơn giá nhập trong phiếu nhập.
8. `inventory_transactions`: Lịch sử biến động xuất/nhập/điều chỉnh tồn kho.
9. `orders`: Đơn đặt hàng của khách hàng.
10. `order_items`: Chi tiết từng món hàng trong đơn hàng.
11. `password_reset_tokens`: Mã OTP / Token phục vụ khôi phục mật khẩu.

---

## 🚀 5. Hướng dẫn cài đặt & Khởi chạy

### Yêu cầu môi trường
* **JDK 21** trở lên.
* **Maven 3.9+** (hoặc dùng Maven tích hợp sẵn trong IDE IntelliJ / VS Code / Eclipse).

### Bước 1: Clone dự án
```bash
git clone git@github.com:Daisme12/project_utc_backend.git
cd project_utc_backend
```

### Bước 2: Khởi chạy dự án
* **Cách 1: Chạy trực tiếp qua IDE:** Mở thư mục dự án trong IntelliJ IDEA và bấm **Run ▶️** tại file `SpringServerApplication.java`.
* **Cách 2: Chạy qua lệnh Maven:**
```bash
mvn spring-boot:run
```

> **Ghi chú về Database:** 
> * Mặc định hệ thống khởi chạy với **H2 In-Memory Database** (không cần cài thêm MySQL), tự động nạp dữ liệu mẫu ban đầu qua `DataInitializer`.
> * Để chuyển sang chạy **MySQL thật**: Bật MySQL Server (port 3306), tạo CSDL `utc_backend_db` và chạy với profile `mysql`:
> ```bash
> mvn spring-boot:run -Dspring-boot.run.profiles=mysql
> ```

---

## 📑 6. Tài liệu API & Kiểm thử

### 1. Swagger UI trực quan
Sau khi chạy dự án, mở trình duyệt và truy cập:
👉 **[http://localhost:8080/api/swagger-ui.html](http://localhost:8080/api/swagger-ui.html)**

* Hỗ trợ nút **Authorize 🔓** để dán JWT Bearer Token và test trực tiếp các API bảo mật.

### 2. Postman Collection
* Import trực tiếp file [`postman_collection.json`](./postman_collection.json) vào Postman để kiểm thử 12 module API đầy đủ kịch bản Request / Response mẫu.

### 3. REST Client (.http)
* Mở file [`src/test/http/api-test.http`](./src/test/http/api-test.http) hoặc [`api-test.http`](./api-test.http) trong VS Code / IntelliJ để bấm Send Request nhanh.

---

## 👤 7. Tài khoản dùng thử mặc định (Auto-Seeded)

Hệ thống đã tự động tạo sẵn các tài khoản demo khi khởi chạy:

| Vai trò | Email | Mật khẩu | Quyền hạn |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin@utc.edu.vn` | `123456` | Toàn quyền hệ thống, quản lý User, Kho, Đơn hàng |
| **Nhân viên (Staff)** | `staff@utc.edu.vn` | `123456` | Quản lý sản phẩm, đơn hàng và lập phiếu nhập kho |
| **Khách hàng (Customer)** | `user@utc.edu.vn` | `123456` | Xem sản phẩm, đặt hàng, thanh toán VNPAY |

---

## 📄 Bản quyền
Phát triển bởi dự án UTC Backend - 2026.
