-- =============================================================================
-- SQL DDL & SEED SCRIPT FOR UTC BACKEND DATABASE (MySQL)
-- Mật khẩu mặc định của tất cả các tài khoản là: 123456
-- Chuỗi mã băm BCrypt của '123456' là: $2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRjD5k1zF3vO5YqFhY1P.j1zRjD5k
-- =============================================================================

CREATE DATABASE IF NOT EXISTS utc_backend_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE utc_backend_db;

-- -----------------------------------------------------------------------------
-- 1. BẢNG ROLES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. BẢNG USERS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_id BIGINT NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. BẢNG CATEGORIES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. BẢNG SUPPLIERS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS suppliers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. BẢNG PRODUCTS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT NOT NULL,
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    is_weighing BOOLEAN DEFAULT FALSE,
    price DECIMAL(15,2) NOT NULL,
    cost_price DECIMAL(15,2) NOT NULL,
    stock_quantity DECIMAL(10,3) NOT NULL DEFAULT 0.000,
    origin VARCHAR(100),
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6. BẢNG GOODS_RECEIPTS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS goods_receipts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    receipt_code VARCHAR(50) NOT NULL UNIQUE,
    supplier_id BIGINT NOT NULL,
    created_by BIGINT NOT NULL,
    total_cost DECIMAL(15,2) NOT NULL,
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_receipts_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    CONSTRAINT fk_receipts_user FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 7. BẢNG GOODS_RECEIPT_DETAILS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS goods_receipt_details (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    receipt_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    batch_number VARCHAR(50),
    exp_date DATE,
    quantity DECIMAL(10,3) NOT NULL,
    import_price DECIMAL(15,2) NOT NULL,
    CONSTRAINT fk_grd_receipt FOREIGN KEY (receipt_id) REFERENCES goods_receipts(id),
    CONSTRAINT fk_grd_product FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 8. BẢNG INVENTORY_TRANSACTIONS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    type VARCHAR(30) NOT NULL,
    quantity_delta DECIMAL(10,3) NOT NULL,
    balance_after DECIMAL(10,3) NOT NULL,
    reference_id VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_inv_product FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 9. BẢNG ORDERS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_code VARCHAR(50) NOT NULL UNIQUE,
    channel VARCHAR(30) NOT NULL DEFAULT 'STORE',
    user_id BIGINT,
    cashier_id BIGINT,
    customer_name VARCHAR(100),
    customer_phone VARCHAR(20),
    shipping_address VARCHAR(255),
    total_amount DECIMAL(15,2) NOT NULL,
    discount_amount DECIMAL(15,2) DEFAULT 0.00,
    final_amount DECIMAL(15,2) NOT NULL,
    paid_amount DECIMAL(15,2) DEFAULT 0.00,
    change_amount DECIMAL(15,2) DEFAULT 0.00,
    payment_method VARCHAR(30) NOT NULL DEFAULT 'CASH',
    payment_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    order_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    is_printed BOOLEAN DEFAULT FALSE,
    printed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_orders_cashier FOREIGN KEY (cashier_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 10. BẢNG ORDER_ITEMS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    quantity DECIMAL(10,3) NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL,
    subtotal DECIMAL(15,2) NOT NULL,
    CONSTRAINT fk_items_order FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_items_product FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 11. BẢNG PASSWORD_RESET_TOKENS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token VARCHAR(100) NOT NULL UNIQUE,
    expiry_date DATETIME NOT NULL,
    CONSTRAINT fk_token_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- INSERT MOCK DATA (DỮ LIỆU MẪU)
-- =============================================================================

-- 1. ROLES
INSERT INTO roles (id, code, name, created_at) VALUES 
(1, 'ADMIN', 'Quản Trị Viên Hệ Thống', NOW()),
(2, 'CASHIER', 'Nhân Viên Thu Ngân', NOW()),
(3, 'STAFF', 'Nhân Viên Kho', NOW()),
(4, 'CUSTOMER', 'Khách Hàng Thành Viên', NOW())
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. USERS (Mật khẩu mặc định: 123456)
INSERT INTO users (id, role_id, username, password_hash, full_name, phone, email, is_active, created_at) VALUES 
(1, 1, 'admin', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRjD5k1zF3vO5YqFhY1P.j1zRjD5k', 'Nguyễn Quản Trị', '0988888888', 'admin@utc.edu.vn', 1, NOW()),
(2, 2, 'thungan01', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRjD5k1zF3vO5YqFhY1P.j1zRjD5k', 'Trần Thị Thu Ngân', '0977777777', 'cashier01@utc.edu.vn', 1, NOW()),
(3, 4, 'khachhang01', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRjD5k1zF3vO5YqFhY1P.j1zRjD5k', 'Lê Văn Mua Hàng', '0966666666', 'customer01@gmail.com', 1, NOW())
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- 3. CATEGORIES
INSERT INTO categories (id, name, slug, description, is_active) VALUES 
(1, 'Sữa & Chế Phẩm Sữa', 'sua-che-pham-sua', 'Các loại sữa tươi, sữa chua, bơ, phô mai tươi', 1),
(2, 'Đồ Uống & Nước Giải Khát', 'do-uong-nuoc-giai-khat', 'Nước ngọt, nước suối, trà xanh, nước tăng lực', 1),
(3, 'Mì Ăn Liền & Thực Phẩm Khô', 'mi-an-lien-thuc-pham-kho', 'Mì gói, hủ tiếu, phở ăn liền, miến dong', 1),
(4, 'Bánh Kẹo & Snack', 'banh-keo-snack', 'Bim bim khoai tây, bánh quy bơ, kẹo dẻo', 1),
(5, 'Gia Vị & Nước Chấm', 'gia-vi-nuoc-cham', 'Nước mắm, dầu ăn, hạt nêm, tương ớt', 1)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 4. SUPPLIERS
INSERT INTO suppliers (id, name, phone, address, is_active) VALUES 
(1, 'Công ty Cổ phần Sữa Việt Nam (Vinamilk)', '02854155555', 'Số 10 Tân Trào, P. Tân Phú, Quận 7, TP. HCM', 1),
(2, 'Tập đoàn Masan Consumer', '02862563862', 'Tầng 12 MPlaza Saigon, 39 Lê Duẩn, Quận 1, TP. HCM', 1),
(3, 'Công ty Cổ phần Acecook Việt Nam', '02838154064', 'Lô II-3, Đường số 11, KCN Tân Bình, Tây Thạnh, Tân Phú, TP. HCM', 1)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 5. PRODUCTS
INSERT INTO products (id, category_id, sku, name, unit, is_weighing, price, cost_price, stock_quantity, origin, image_url, is_active, created_at) VALUES 
(1, 1, 'SP-VNM-1L-001', 'Sữa tươi tiệt trùng Vinamilk 100% Không đường 1L', 'Hộp', 0, 35000.00, 28000.00, 150.000, 'Việt Nam', 'https://res.cloudinary.com/demo/image/upload/v1726000000/products/vinamilk-1l.jpg', 1, NOW()),
(2, 1, 'SP-VNM-180ML-002', 'Lốc 4 hộp Sữa tươi tiệt trùng Vinamilk Có đường 180ml', 'Lốc', 0, 38000.00, 31000.00, 200.000, 'Việt Nam', 'https://res.cloudinary.com/demo/image/upload/v1726000000/products/vinamilk-180ml.jpg', 1, NOW()),
(3, 3, 'SP-ACE-HH-TOMCHUA-003', 'Mì Hảo Hảo tôm chua cay 75g', 'Gói', 0, 4500.00, 3600.00, 500.000, 'Việt Nam', 'https://res.cloudinary.com/demo/image/upload/v1726000000/products/mi-hao-hao.jpg', 1, NOW()),
(4, 3, 'SP-ACE-THUNG-HH-004', 'Thùng 30 gói Mì Hảo Hảo tôm chua cay 75g', 'Thùng', 0, 130000.00, 108000.00, 80.000, 'Việt Nam', 'https://res.cloudinary.com/demo/image/upload/v1726000000/products/thung-hao-hao.jpg', 1, NOW()),
(5, 5, 'SP-MSN-CHINSU-250G-005', 'Tương ớt Chin-su chai 250g', 'Chai', 0, 16000.00, 12500.00, 120.000, 'Việt Nam', 'https://res.cloudinary.com/demo/image/upload/v1726000000/products/tuong-ot-chinsu.jpg', 1, NOW()),
(6, 5, 'SP-MSN-NAMNGU-500ML-006', 'Nước mắm Nam Ngư Đệ Nhị chai 900ml', 'Chai', 0, 32000.00, 25000.00, 90.000, 'Việt Nam', 'https://res.cloudinary.com/demo/image/upload/v1726000000/products/nuoc-mam-nam-ngu.jpg', 1, NOW()),
(7, 2, 'SP-DRK-COCA-320ML-007', 'Nước ngọt Coca Cola lon 320ml', 'Lon', 0, 10000.00, 7800.00, 300.000, 'Việt Nam', 'https://res.cloudinary.com/demo/image/upload/v1726000000/products/coca-cola.jpg', 1, NOW()),
(8, 4, 'SP-SNK-LAYS-CLASSIC-008', 'Snack khoai tây Lay\'s vị tự nhiên Classic 56g', 'Gói', 0, 18000.00, 14000.00, 150.000, 'Việt Nam', 'https://res.cloudinary.com/demo/image/upload/v1726000000/products/lays-classic.jpg', 1, NOW())
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 6. GOODS_RECEIPTS & GOODS_RECEIPT_DETAILS
INSERT INTO goods_receipts (id, receipt_code, supplier_id, created_by, total_cost, created_at) VALUES 
(1, 'PNK-20260901-001', 1, 1, 10400000.00, NOW())
ON DUPLICATE KEY UPDATE total_cost=VALUES(total_cost);

INSERT INTO goods_receipt_details (id, receipt_id, product_id, batch_number, exp_date, quantity, import_price) VALUES 
(1, 1, 1, 'LO-VNM-2026A', DATE_ADD(CURDATE(), INTERVAL 6 MONTH), 150.000, 28000.00),
(2, 1, 2, 'LO-VNM-2026B', DATE_ADD(CURDATE(), INTERVAL 6 MONTH), 200.000, 31000.00)
ON DUPLICATE KEY UPDATE quantity=VALUES(quantity);

-- 7. INVENTORY_TRANSACTIONS
INSERT INTO inventory_transactions (id, product_id, type, quantity_delta, balance_after, reference_id, created_at) VALUES 
(1, 1, 'IMPORT', 150.000, 150.000, 'PNK-20260901-001', NOW()),
(2, 2, 'IMPORT', 200.000, 200.000, 'PNK-20260901-001', NOW())
ON DUPLICATE KEY UPDATE quantity_delta=VALUES(quantity_delta);

-- 8. ORDERS & ORDER_ITEMS
INSERT INTO orders (id, order_code, channel, user_id, cashier_id, customer_name, customer_phone, shipping_address, total_amount, discount_amount, final_amount, paid_amount, change_amount, payment_method, payment_status, order_status, is_printed, printed_at, created_at) VALUES 
(1, 'ORD-20260914-001', 'STORE', 3, 2, 'Lê Văn Mua Hàng', '0966666666', 'Phường Láng Thượng, Đống Đa, Hà Nội', 108000.00, 0.00, 108000.00, 110000.00, 2000.00, 'CASH', 'PAID', 'COMPLETED', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE final_amount=VALUES(final_amount);

INSERT INTO order_items (id, order_id, product_id, product_name, unit, quantity, unit_price, subtotal) VALUES 
(1, 1, 1, 'Sữa tươi tiệt trùng Vinamilk 100% Không đường 1L', 'Hộp', 2.000, 35000.00, 70000.00),
(2, 1, 2, 'Lốc 4 hộp Sữa tươi tiệt trùng Vinamilk Có đường 180ml', 'Lốc', 1.000, 38000.00, 38000.00)
ON DUPLICATE KEY UPDATE subtotal=VALUES(subtotal);
