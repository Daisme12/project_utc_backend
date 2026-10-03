-- =============================================================================
-- SQL DDL & SEED SCRIPT FOR UBOFOOD DATABASE (MySQL) - 9 TABLES STANDARDIZED
-- =============================================================================

CREATE DATABASE IF NOT EXISTS utc_backend_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE utc_backend_db;

-- -----------------------------------------------------------------------------
-- 1. BẢNG USERS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(100) UNIQUE,
    avatar_url VARCHAR(500),
    role VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER',
    accumulated_points INT DEFAULT 0,
    reset_token VARCHAR(100),
    reset_token_expiry DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. BẢNG CATEGORIES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(120) NOT NULL UNIQUE,
    icon VARCHAR(50),
    description TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. BẢNG PRODUCTS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT NOT NULL,
    sku VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(200) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    brand VARCHAR(100),
    origin VARCHAR(150),
    standard VARCHAR(50) DEFAULT 'vietgap',
    unit VARCHAR(30) NOT NULL DEFAULT 'Khay',
    pack_weight VARCHAR(50),
    price DECIMAL(15,2) NOT NULL,
    original_price DECIMAL(15,2),
    stock_quantity DECIMAL(12,3) NOT NULL DEFAULT 0.000,
    is_weighing BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,1) DEFAULT 5.0,
    review_count INT DEFAULT 0,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. BẢNG VOUCHERS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vouchers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    badge VARCHAR(50),
    title VARCHAR(150) NOT NULL,
    discount_type VARCHAR(20) NOT NULL,
    discount_value DECIMAL(15,2) NOT NULL,
    min_order_amount DECIMAL(15,2) DEFAULT 0.00,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. BẢNG ORDERS (Hợp nhất Web + POS Quầy)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_code VARCHAR(50) NOT NULL UNIQUE,
    channel VARCHAR(20) NOT NULL DEFAULT 'WEB',
    user_id BIGINT,
    cashier_id BIGINT,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20),
    shipping_address VARCHAR(255),
    delivery_method VARCHAR(30) DEFAULT 'FAST_2H',
    note TEXT,
    total_amount DECIMAL(15,2) NOT NULL,
    shipping_fee DECIMAL(15,2) DEFAULT 0.00,
    final_amount DECIMAL(15,2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL DEFAULT 'COD',
    payment_status VARCHAR(30) DEFAULT 'PENDING',
    order_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    is_printed BOOLEAN DEFAULT FALSE,
    printed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_orders_cashier FOREIGN KEY (cashier_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6. BẢNG ORDER_VOUCHERS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_vouchers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    voucher_id BIGINT,
    voucher_code VARCHAR(50) NOT NULL,
    discount_amount DECIMAL(15,2) NOT NULL,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ov_order FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_ov_voucher FOREIGN KEY (voucher_id) REFERENCES vouchers(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 7. BẢNG ORDER_ITEMS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    pack_weight VARCHAR(50),
    unit VARCHAR(30) NOT NULL,
    quantity DECIMAL(12,3) NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL,
    subtotal DECIMAL(15,2) NOT NULL,
    image_url VARCHAR(500),
    CONSTRAINT fk_items_order FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_items_product FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 8. BẢNG SUPPLIERS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS suppliers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 9. BẢNG GOODS_RECEIPTS (Nhập kho thịt mát theo lô kiểm định)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS goods_receipts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    receipt_code VARCHAR(50) NOT NULL UNIQUE,
    supplier_id BIGINT NOT NULL,
    created_by BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    batch_number VARCHAR(50),
    exp_date DATE,
    quantity DECIMAL(12,3) NOT NULL,
    import_price DECIMAL(15,2) NOT NULL,
    total_cost DECIMAL(15,2) NOT NULL,
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_receipts_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    CONSTRAINT fk_receipts_user FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT fk_receipts_product FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- INSERT MOCK DATA
-- =============================================================================

-- 1. USERS (Mật khẩu mặc định: 123456)
INSERT INTO users (id, username, password_hash, full_name, phone, email, role, accumulated_points, is_active, created_at) VALUES 
(1, 'admin', '$2a$10$a8YC5ko8sh2fsn8vcqtxQucHp61.fhSue8NIlfQf/69x/vzoNpB2m', 'Nguyễn Quản Trị', '0988888888', 'admin@utc.edu.vn', 'ADMIN', 500, 1, NOW()),
(2, 'thungan01', '$2a$10$a8YC5ko8sh2fsn8vcqtxQucHp61.fhSue8NIlfQf/69x/vzoNpB2m', 'Trần Thị Thu Ngân', '0977777777', 'cashier01@utc.edu.vn', 'CASHIER', 100, 1, NOW()),
(3, 'khachhang01', '$2a$10$a8YC5ko8sh2fsn8vcqtxQucHp61.fhSue8NIlfQf/69x/vzoNpB2m', 'Lê Văn Mua Hàng', '0966666666', 'customer01@gmail.com', 'CUSTOMER', 250, 1, NOW()),
(4, 'khachhang02', '$2a$10$a8YC5ko8sh2fsn8vcqtxQucHp61.fhSue8NIlfQf/69x/vzoNpB2m', 'Hoàng Thị Mai', '0912345678', 'customer02@gmail.com', 'CUSTOMER', 80, 1, NOW())
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- 2. CATEGORIES (7 Danh mục đồng bộ Frontend)
INSERT INTO categories (id, name, slug, icon, description, display_order, is_active, created_at) VALUES 
(1, 'Săn Sale Giờ Vàng', 'san-sale', '🔥', 'Ưu đãi sốc giờ vàng mỗi ngày giảm tới 50%', 1, 1, NOW()),
(2, 'Thịt Heo Tươi Mát', 'thit-heo-tuoi-mat', '🥩', 'Thịt heo sạch chuẩn VietGAP bảo quản lạnh 0-4°C', 2, 1, NOW()),
(3, 'Thịt Bò Úc Chuẩn Mát', 'thit-bo-uc', '🥩', 'Bò Úc nhập khẩu mát nguyên tảng cắt tươi hàng ngày', 3, 1, NOW()),
(4, 'Thủy Hải Sản Tươi Sống', 'thuy-hai-san-tuoi', '🦐', 'Hải sản tươi rói giao sống tận nhà', 4, 1, NOW()),
(5, 'Trứng & Gia Cầm Thả Vườn', 'trung-gia-cam', '🥚', 'Gà ta thả đồi và trứng gà tươi sạch mỗi sáng', 5, 1, NOW()),
(6, 'Rau Củ Chuẩn VietGAP', 'rau-cu-vietgap', '🥬', 'Rau củ hữu cơ chuẩn VietGAP hái tươi mỗi sáng', 6, 1, NOW()),
(7, 'Đậu Hũ & Thực Phẩm Sơ Chế', 'dau-hu-so-che', '🥢', 'Đậu hũ truyền thống và các món ăn sơ chế sẵn tiện lợi', 7, 1, NOW())
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 3. PRODUCTS (16 Sản phẩm chuẩn hóa Frontend)
INSERT INTO products (id, category_id, sku, slug, name, brand, origin, standard, unit, pack_weight, price, original_price, stock_quantity, is_weighing, rating, review_count, image_url, is_active, created_at) VALUES 
(1, 1, 'COMBO-25M', 'combo-gia-dinh-so-che', 'Combo Gia Đình Sơ Chế Mâm Cơm 25 Phút', 'UBOFOOD TIỆN LỢI', 'Ba Vì, Hà Nội', 'euchill', 'Khay', 'Khay lớn 1kg', 182000, 215000, 50, 0, 5.0, 312, 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(2, 1, 'BOUC-FS500', 'ba-chi-bo-uc-flash-sale', 'Ba Chỉ Bò Úc Cuộn Nhúng Lẩu Chuẩn Mát', 'UBOMEAT BÒ ÚC', 'Nhập khẩu Úc', 'euchill', 'Khay', 'Khay 500g', 89000, 135000, 35, 0, 4.9, 189, 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(3, 2, 'HEO-SUON-300', 'suon-than-heo-truyen-thong', 'Sườn Thăn Heo Truyền Thống', 'UBOMEAT CHUẨN MÁT', 'Hà Nam', 'vietgap', 'Khay', 'Khay 300g', 71600, 78000, 80, 0, 4.9, 128, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(4, 2, 'HEO-BACHI-300', 'ba-chi-heo-truyen-thong', 'Ba Chỉ Heo Truyền Thống', 'UBOMEAT CHUẨN MÁT', 'Hà Nam', 'euchill', 'Khay', 'Khay 300g', 67400, 74000, 75, 0, 5.0, 242, 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(5, 2, 'HEO-XAY-300', 'thit-xay-heo-truyen-thong', 'Thịt Xay Heo Truyền Thống', 'UBOMEAT XAY SẠCH', 'Hà Nam', 'oxyfresh', 'Khay', 'Khay 300g', 53700, 58000, 60, 0, 4.8, 96, 'https://images.unsplash.com/photo-1588347818036-558601350947?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(6, 2, 'HEO-MONGGIO-300', 'mong-gio-truoc-heo', 'Móng Giò Trước Heo', 'UBOMEAT CHUẨN MÁT', 'Hà Nam', 'vietgap', 'Khay', 'Khay 300g', 43500, 48000, 45, 0, 4.7, 64, 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(7, 3, 'BO-THAN-300', 'than-bo-sach-ubomeat', 'Thăn Bò Sạch Ubomeat', 'UBOMEAT BÒ ÚC', 'Nhập khẩu Úc', 'euchill', 'Khay', 'Khay 300g', 104900, 120000, 40, 0, 5.0, 178, 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(8, 2, 'HEO-NACVAI-300', 'nac-vai-heo-truyen-thong', 'Nạc Vai Heo Truyền Thống', 'UBOMEAT CHUẨN MÁT', 'Hà Nam', 'vietgap', 'Khay', 'Khay 300g', 57100, 62000, 90, 0, 4.9, 185, 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(9, 2, 'HEO-NACDAM-300', 'nac-dam-heo-truyen-thong', 'Nạc Dăm Heo Truyền Thống', 'UBOMEAT CHUẨN MÁT', 'Hà Nam', 'vietgap', 'Khay', 'Khay 300g', 60800, 65000, 65, 0, 4.8, 87, 'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(10, 5, 'GA-TRUNGTA-10P', 'trung-ga-ta-thuan-viet', 'Trứng Gà Ta Thuần Việt', 'UBOFARM GIA CẦM', 'Ba Vì, Hà Nội', 'organic', 'Hộp', 'Hộp 10 quả', 42000, 46000, 150, 0, 5.0, 210, 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(11, 7, 'DAU-MOQUE-500', 'dau-mo-tuoi-ngon-que-minh', 'Đậu Mơ Tươi Ngon Quê Mình', 'UBOFOOD LÀNG NGHỀ', 'Hà Nội', 'organic', 'Hộp', 'Hộp 500g', 20800, 24000, 70, 0, 4.9, 72, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(12, 5, 'GA-CHANGARX-500', 'chan-ga-rut-xuong-chuan-ngon-ubomeat', 'Chân Gà Rút Xương Chuẩn Ngon Ubomeat', 'UBOMEAT GIA CẦM', 'Hà Nội', 'vietgap', 'Khay', 'Khay 500g', 66700, 75000, 55, 0, 4.7, 86, 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(13, 4, 'CA-HOINAUY-250', 'ca-hoi-nauy-tuoi-fillet', 'Cá Hồi Na Uy Tươi Fillet', 'UBOSEAHẢI SẢN', 'Nhập khẩu Na Uy', 'euchill', 'Khay', 'Khay 250g', 135000, 155000, 40, 0, 5.0, 312, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(14, 4, 'TOM-THECT-500', 'tom-the-chan-trang-song', 'Tôm Thẻ Chân Trắng Sống', 'UBOSEAHẢI SẢN', 'Quảng Ninh', 'vietgap', 'Hộp', 'Hộp 500g', 115000, 130000, 50, 0, 4.9, 167, 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(15, 6, 'RAU-BOXOI-500', 'cai-bo-xoi-thuy-canh-vietgap', 'Cải Bó Xôi Thủy Canh VietGAP', 'UBOFARM ĐÀ LẠT', 'Đà Lạt, Lâm Đồng', 'vietgap', 'Túi', 'Túi 500g', 28000, 32000, 100, 0, 4.9, 159, 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(16, 6, 'RAU-CACHUABEEF-500', 'ca-chua-beef-moc-chau', 'Cà Chua Beef Mộc Châu', 'UBOFARM MỘC CHÂU', 'Mộc Châu, Sơn La', 'organic', 'Túi', 'Túi 500g', 32000, 38000, 120, 0, 4.8, 143, 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(17, 3, 'BO-STRIPLOIN-300', 'than-ngoai-bo-uc-striploin', 'Thăn Ngoại Bò Úc Striploin Cắt Lát', 'UBOMEAT BÒ ÚC', 'Nhập khẩu Úc', 'euchill', 'Khay', 'Khay 300g', 139000, 155000, 40, 0, 4.9, 112, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(18, 3, 'BO-RIBEYE-300', 'dau-than-ngoai-bo-uc-ribeye', 'Đầu Thăn Ngoại Bò Úc Ribeye Hảo Hạng', 'UBOMEAT BÒ ÚC', 'Nhập khẩu Úc', 'euchill', 'Khay', 'Khay 300g', 158000, 175000, 35, 0, 5.0, 98, 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(19, 3, 'BO-GAUBO-300', 'gau-bo-uc-gion-cuon-lau', 'Gầu Bò Úc Giòn Cuộn Lẩu Chuẩn Vị', 'UBOMEAT BÒ ÚC', 'Nhập khẩu Úc', 'euchill', 'Khay', 'Khay 300g', 95000, 110000, 60, 0, 4.8, 145, 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(20, 3, 'BO-DESUON-400', 'de-suon-bo-uc-rut-xuong', 'Dẻ Sườn Bò Úc Rút Xương Nướng BBQ', 'UBOMEAT BÒ ÚC', 'Nhập khẩu Úc', 'euchill', 'Khay', 'Khay 400g', 145000, 165000, 30, 0, 4.9, 78, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(21, 3, 'BO-BAPBO-300', 'bap-bo-hoa-nhung-dam', 'Bắp Bò Hoa Nhúng Dấm Chuẩn Mát', 'UBOMEAT BÒ ÚC', 'Nhập khẩu Úc', 'euchill', 'Khay', 'Khay 300g', 125000, 140000, 45, 0, 4.9, 134, 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(22, 2, 'HEO-SUONNON-400', 'suon-non-heo-cat-khuc', 'Sườn Non Heo Cắt Khúc Nấu Canh', 'UBOMEAT CHUẨN MÁT', 'Hà Nam', 'vietgap', 'Khay', 'Khay 400g', 85000, 95000, 70, 0, 4.8, 89, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(23, 2, 'HEO-NACNONG-300', 'nac-nong-heo-tuoi-gion', 'Nạc Nọng Heo Tươi Giòn Thơm Béo', 'UBOMEAT CHUẨN MÁT', 'Hà Nam', 'vietgap', 'Khay', 'Khay 300g', 79000, 88000, 40, 0, 5.0, 167, 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(24, 2, 'HEO-TAIHEO-300', 'tai-heo-lam-sach-trang', 'Tai Heo Làm Sạch Trắng Tươi', 'UBOMEAT CHUẨN MÁT', 'Hà Nam', 'vietgap', 'Khay', 'Khay 300g', 49000, 55000, 50, 0, 4.7, 54, 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(25, 2, 'HEO-COTLET-350', 'cot-let-heo-tuoi-mat', 'Cốt Lết Heo Tươi Mát Bản Dày', 'UBOMEAT CHUẨN MÁT', 'Hà Nam', 'vietgap', 'Khay', 'Khay 350g', 58000, 65000, 65, 0, 4.8, 62, 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(26, 2, 'HEO-XUONGONG-500', 'xuong-ong-heo-ham-nuoc-dung', 'Xương Ống Heo Hầm Nước Dùng Ngọt Thanh', 'UBOMEAT CHUẨN MÁT', 'Hà Nam', 'vietgap', 'Khay', 'Khay 500g', 35000, 40000, 80, 0, 4.9, 105, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(27, 2, 'HEO-BACHIRUT-300', 'ba-chi-heo-rut-suon', 'Ba Chỉ Heo Rút Sườn Cuộn Nướng', 'UBOMEAT CHUẨN MÁT', 'Hà Nam', 'vietgap', 'Khay', 'Khay 300g', 82000, 90000, 55, 0, 4.9, 98, 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(28, 5, 'GA-GATA-CON', 'ga-ta-tha-doi-ba-vi', 'Gà Ta Thả Đồi Ba Vì Làm Sạch Sẵn', 'UBOFARM GIA CẦM', 'Ba Vì, Hà Nội', 'organic', 'Con', 'Con 1.3kg', 185000, 210000, 30, 0, 5.0, 176, 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(29, 5, 'GA-DUIGOCTU-500', 'dui-ga-goc-tu-tuoi', 'Đùi Gà Góc Tư Tươi Sạch Thảo Mộc', 'UBOFARM GIA CẦM', 'Hà Nội', 'vietgap', 'Khay', 'Khay 500g', 52000, 60000, 75, 0, 4.8, 84, 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(30, 5, 'GA-CANHGA-500', 'canh-ga-giua-tuoi', 'Cánh Gà Giữa Tươi Ngon Chiên Giòn', 'UBOFARM GIA CẦM', 'Hà Nội', 'vietgap', 'Khay', 'Khay 500g', 68000, 76000, 60, 0, 4.9, 113, 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(31, 5, 'GA-TRUNGCUT-30P', 'trung-cut-tuoi-vuon-que', 'Trứng Cút Tươi Vườn Quê Thơm Bùi', 'UBOFARM GIA CẦM', 'Ba Vì, Hà Nội', 'organic', 'Hộp', 'Hộp 30 quả', 25000, 28000, 100, 0, 4.8, 92, 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(32, 4, 'HAI-MUCONG-500', 'muc-ong-tuoi-con-dao', 'Mực Ống Tươi Côn Đảo Cấp Đông Nhanh', 'UBOSEAHẢI SẢN', 'Côn Đảo', 'euchill', 'Túi', 'Túi 500g', 145000, 165000, 40, 0, 4.9, 138, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(33, 4, 'HAI-BACHTUOC-400', 'bach-tuoc-sua-tuoi', 'Bạch Tuộc Sữa Tươi Giòn Nhúng Dấm', 'UBOSEAHẢI SẢN', 'Phan Thiết', 'vietgap', 'Khay', 'Khay 400g', 110000, 125000, 35, 0, 4.8, 76, 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(34, 4, 'HAI-CABASA-500', 'phi-le-ca-basa-tuoi', 'Phi Lê Cá Basa Tươi Sạch Xuất Khẩu', 'UBOSEAHẢI SẢN', 'An Giang', 'vietgap', 'Khay', 'Khay 500g', 48000, 55000, 80, 0, 4.7, 88, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(35, 4, 'HAI-NGHEU-1000', 'ngheu-trang-song-ben-tre', 'Nghêu Trắng Sống Bến Tre Béo Ngọt', 'UBOSEAHẢI SẢN', 'Bến Tre', 'vietgap', 'Túi', 'Túi 1kg', 39000, 45000, 60, 0, 4.8, 95, 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(36, 4, 'HAI-CUACAMAU-1000', 'cua-bien-ca-mau', 'Cua Biển Cà Mau Dây Nhỏ Chắc Thịt', 'UBOSEAHẢI SẢN', 'Cà Mau', 'euchill', 'Hộp', 'Hộp 1kg', 295000, 330000, 25, 0, 5.0, 156, 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(37, 6, 'RAU-SUPLOXANH-400', 'sup-lo-xanh-thuy-canh', 'Súp Lơ Xanh Thủy Canh VietGAP', 'UBOFARM ĐÀ LẠT', 'Đà Lạt, Lâm Đồng', 'vietgap', 'Túi', 'Túi 400g', 24000, 28000, 90, 0, 4.9, 104, 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(38, 6, 'RAU-XALACH-300', 'xa-lach-romaine-huu-co', 'Xà Lách Romaine Hữu Cơ Đà Lạt Giòn Ngọt', 'UBOFARM ĐÀ LẠT', 'Đà Lạt', 'organic', 'Túi', 'Túi 300g', 26000, 30000, 85, 0, 4.9, 118, 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(39, 6, 'RAU-NAMDUIGA-300', 'nam-dui-ga-tuoi', 'Nấm Đùi Gà Tươi Chuẩn Hàn Quốc', 'UBOFARM MỘC CHÂU', 'Mộc Châu', 'organic', 'Gói', 'Gói 300g', 35000, 40000, 70, 0, 4.8, 73, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(40, 6, 'RAU-BIXANH-800', 'bi-xanh-huu-co-moc-chau', 'Bí Xanh Hữu Cơ Mộc Châu Ngọt Mát', 'UBOFARM MỘC CHÂU', 'Mộc Châu, Sơn La', 'organic', 'Quả', 'Quả 800g', 18000, 22000, 95, 0, 4.8, 86, 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(41, 6, 'RAU-DAUHALAN-250', 'dau-ha-lan-tuoi-gion', 'Đậu Hà Lan Tươi Giòn Xào Thịt', 'UBOFARM ĐÀ LẠT', 'Đà Lạt', 'vietgap', 'Khay', 'Khay 250g', 32000, 36000, 65, 0, 4.7, 59, 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(42, 7, 'DAU-DAUCHIEN-400', 'dau-hu-chien-vang', 'Đậu Hũ Chiên Vàng Sẵn Tiện Lợi', 'UBOFOOD LÀNG NGHỀ', 'Hà Nội', 'organic', 'Hộp', 'Hộp 400g', 16000, 19000, 60, 0, 4.9, 110, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(43, 7, 'DAU-TAUHUNON-300', 'tau-hu-non-min', 'Tàu Hũ Non Mịn Nấu Canh Rong Biển', 'UBOFOOD LÀNG NGHỀ', 'Hà Nội', 'organic', 'Hộp', 'Hộp 300g', 14000, 17000, 80, 0, 4.8, 78, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(44, 1, 'SALE-LAUNAM-800', 'combo-lau-nam-duong-sinh', 'Combo Lẩu Nấm Dưỡng Sinh Gia Đình Sơ Chế', 'UBOFOOD TIỆN LỢI', 'Hà Nội', 'vietgap', 'Khay', 'Khay 800g', 129000, 160000, 40, 0, 4.9, 134, 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(45, 1, 'SALE-LAUHAISAN-1000', 'combo-hai-san-tha-lau', 'Combo Hải Sản Thả Lẩu Tươi Thượng Hạng', 'UBOFOOD TIỆN LỢI', 'Quảng Ninh', 'euchill', 'Khay', 'Khay 1kg', 199000, 245000, 35, 0, 5.0, 167, 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80', 1, NOW()),
(46, 1, 'SALE-CANHCHUA-600', 'combo-canh-chua-ca-hoi', 'Combo Canh Chua Cá Hồi Đậm Đà Sơ Chế Sẵn', 'UBOFOOD TIỆN LỢI', 'Hà Nội', 'euchill', 'Khay', 'Khay 600g', 99000, 125000, 50, 0, 4.8, 83, 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80', 1, NOW())
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 4. VOUCHERS
INSERT INTO vouchers (id, code, badge, title, discount_type, discount_value, min_order_amount, start_date, end_date, is_active, created_at) VALUES 
(1, 'GIAM50K', 'HOT -50%', 'Giảm 50.000đ cho đơn hàng thực phẩm mát đầu tiên từ 150.000đ', 'FIXED_AMOUNT', 50000, 150000, NOW() - INTERVAL 10 DAY, NOW() + INTERVAL 90 DAY, 1, NOW()),
(2, 'FREESHIP2H', 'FREESHIP', 'Miễn phí vận chuyển hỏa tốc 2 giờ (-25.000đ) cho đơn từ 150.000đ', 'FIXED_AMOUNT', 25000, 150000, NOW() - INTERVAL 10 DAY, NOW() + INTERVAL 90 DAY, 1, NOW()),
(3, 'UBOMEAT', '-20K', 'Giảm 20.000đ trực tiếp khi mua các loại thịt bò Úc & heo mát', 'FIXED_AMOUNT', 20000, 100000, NOW() - INTERVAL 10 DAY, NOW() + INTERVAL 90 DAY, 1, NOW()),
(4, 'UBOCHAOXUAN', '-10K', 'Giảm 10.000đ chào bạn mới mua sắm tại Ubofood', 'FIXED_AMOUNT', 10000, 0, NOW() - INTERVAL 10 DAY, NOW() + INTERVAL 90 DAY, 1, NOW())
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 5. SUPPLIERS
INSERT INTO suppliers (id, name, phone, address, is_active, created_at) VALUES 
(1, 'Tập Đoàn Nông Nghiệp Ba Vì Clean Farm', '0243888999', 'Huyện Ba Vì, TP. Hà Nội', 1, NOW()),
(2, 'Trang Trại Chăn Nuôi Heo Chuẩn VietGAP Hà Nam', '0226388776', 'Thị xã Duy Tiên, Tỉnh Hà Nam', 1, NOW()),
(3, 'Hợp Tác Xã Nông Sản Hữu Cơ Mộc Châu', '0212389966', 'Thị trấn Nông trường Mộc Châu, Tỉnh Sơn La', 1, NOW()),
(4, 'Vựa Thủy Hải Sản Sạch Cát Bà - Quảng Ninh', '0203387799', 'Cảng cá Hạ Long, TP. Hạ Long, Tỉnh Quảng Ninh', 1, NOW())
ON DUPLICATE KEY UPDATE name=VALUES(name);

