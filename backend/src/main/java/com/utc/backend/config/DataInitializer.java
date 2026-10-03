package com.utc.backend.config;

import com.utc.backend.entity.*;
import com.utc.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final VoucherRepository voucherRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderVoucherRepository orderVoucherRepository;
    private final GoodsReceiptRepository goodsReceiptRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Data already initialized
        }

        // ==========================================
        // 1. USERS (Mật khẩu mặc định: 123456)
        // ==========================================
        String defaultPasswordHash = passwordEncoder.encode("123456");

        User admin = userRepository.save(User.builder()
                .role("ADMIN")
                .username("admin")
                .passwordHash(defaultPasswordHash)
                .fullName("Nguyễn Quản Trị")
                .phone("0988888888")
                .email("admin@utc.edu.vn")
                .accumulatedPoints(500)
                .isActive(true)
                .build());

        User cashier = userRepository.save(User.builder()
                .role("CASHIER")
                .username("thungan01")
                .passwordHash(defaultPasswordHash)
                .fullName("Trần Thị Thu Ngân")
                .phone("0977777777")
                .email("cashier01@utc.edu.vn")
                .accumulatedPoints(100)
                .isActive(true)
                .build());

        User customer1 = userRepository.save(User.builder()
                .role("CUSTOMER")
                .username("khachhang01")
                .passwordHash(defaultPasswordHash)
                .fullName("Lê Văn Mua Hàng")
                .phone("0966666666")
                .email("customer01@gmail.com")
                .accumulatedPoints(250)
                .isActive(true)
                .build());

        User customer2 = userRepository.save(User.builder()
                .role("CUSTOMER")
                .username("khachhang02")
                .passwordHash(defaultPasswordHash)
                .fullName("Hoàng Thị Mai")
                .phone("0912345678")
                .email("customer02@gmail.com")
                .accumulatedPoints(80)
                .isActive(true)
                .build());

        // ==========================================
        // 2. CATEGORIES (Khớp 100% với Frontend Ubofood)
        // ==========================================
        Category catSale = categoryRepository.save(Category.builder()
                .name("Săn Sale Giờ Vàng")
                .slug("san-sale")
                .icon("🔥")
                .description("Ưu đãi sốc giờ vàng mỗi ngày giảm tới 50%")
                .displayOrder(1)
                .isActive(true)
                .build());

        Category catPork = categoryRepository.save(Category.builder()
                .name("Thịt Heo Tươi Mát")
                .slug("thit-heo-tuoi-mat")
                .icon("🥩")
                .description("Thịt heo sạch chuẩn VietGAP bảo quản lạnh 0-4°C")
                .displayOrder(2)
                .isActive(true)
                .build());

        Category catBeef = categoryRepository.save(Category.builder()
                .name("Thịt Bò Úc Chuẩn Mát")
                .slug("thit-bo-uc")
                .icon("🥩")
                .description("Bò Úc nhập khẩu mát nguyên tảng cắt tươi hàng ngày")
                .displayOrder(3)
                .isActive(true)
                .build());

        Category catSeafood = categoryRepository.save(Category.builder()
                .name("Thủy Hải Sản Tươi Sống")
                .slug("thuy-hai-san-tuoi")
                .icon("🦐")
                .description("Hải sản tươi rói giao sống tận nhà")
                .displayOrder(4)
                .isActive(true)
                .build());

        Category catPoultry = categoryRepository.save(Category.builder()
                .name("Trứng & Gia Cầm Thả Vườn")
                .slug("trung-gia-cam")
                .icon("🥚")
                .description("Gà ta thả đồi và trứng gà tươi sạch mỗi sáng")
                .displayOrder(5)
                .isActive(true)
                .build());

        Category catVeg = categoryRepository.save(Category.builder()
                .name("Rau Củ Chuẩn VietGAP")
                .slug("rau-cu-vietgap")
                .icon("🥬")
                .description("Rau củ hữu cơ chuẩn VietGAP hái tươi mỗi sáng")
                .displayOrder(6)
                .isActive(true)
                .build());

        Category catTofu = categoryRepository.save(Category.builder()
                .name("Đậu Hũ & Thực Phẩm Sơ Chế")
                .slug("dau-hu-so-che")
                .icon("🥢")
                .description("Đậu hũ truyền thống và các món ăn sơ chế sẵn tiện lợi")
                .displayOrder(7)
                .isActive(true)
                .build());

        // ==========================================
        // 3. SUPPLIERS (Nhà cung cấp chuỗi nông sản)
        // ==========================================
        Supplier supMeat = supplierRepository.save(Supplier.builder()
                .name("Tập Đoàn Nông Nghiệp Ba Vì Clean Farm")
                .phone("0243888999")
                .address("Huyện Ba Vì, TP. Hà Nội")
                .isActive(true)
                .build());

        Supplier supPork = supplierRepository.save(Supplier.builder()
                .name("Trang Trại Chăn Nuôi Heo Chuẩn VietGAP Hà Nam")
                .phone("0226388776")
                .address("Thị xã Duy Tiên, Tỉnh Hà Nam")
                .isActive(true)
                .build());

        Supplier supMocChau = supplierRepository.save(Supplier.builder()
                .name("Hợp Tác Xã Nông Sản Hữu Cơ Mộc Châu")
                .phone("0212389966")
                .address("Thị trấn Nông trường Mộc Châu, Tỉnh Sơn La")
                .isActive(true)
                .build());

        Supplier supSea = supplierRepository.save(Supplier.builder()
                .name("Vựa Thủy Hải Sản Sạch Cát Bà - Quảng Ninh")
                .phone("0203387799")
                .address("Cảng cá Hạ Long, TP. Hạ Long, Tỉnh Quảng Ninh")
                .isActive(true)
                .build());

        // ==========================================
        // 4. PRODUCTS (16 sản phẩm khớp 100% Frontend Ubofood)
        // ==========================================
        Product p1 = productRepository.save(Product.builder()
                .category(catSale)
                .sku("COMBO-25M")
                .slug("combo-gia-dinh-so-che")
                .name("Combo Gia Đình Sơ Chế Mâm Cơm 25 Phút")
                .brand("UBOFOOD TIỆN LỢI")
                .origin("Ba Vì, Hà Nội")
                .standard("euchill")
                .unit("Khay")
                .packWeight("Khay lớn 1kg")
                .price(BigDecimal.valueOf(182000))
                .originalPrice(BigDecimal.valueOf(215000))
                .stockQuantity(BigDecimal.valueOf(50))
                .isWeighing(false)
                .rating(BigDecimal.valueOf(5.0))
                .reviewCount(312)
                .imageUrl("https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80")
                .isActive(true)
                .build());

        Product p2 = productRepository.save(Product.builder()
                .category(catSale)
                .sku("BOUC-FS500")
                .slug("ba-chi-bo-uc-flash-sale")
                .name("Ba Chỉ Bò Úc Cuộn Nhúng Lẩu Chuẩn Mát")
                .brand("UBOMEAT BÒ ÚC")
                .origin("Nhập khẩu Úc")
                .standard("euchill")
                .unit("Khay")
                .packWeight("Khay 500g")
                .price(BigDecimal.valueOf(89000))
                .originalPrice(BigDecimal.valueOf(135000))
                .stockQuantity(BigDecimal.valueOf(35))
                .isWeighing(false)
                .rating(BigDecimal.valueOf(4.9))
                .reviewCount(189)
                .imageUrl("https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80")
                .isActive(true)
                .build());

        Product p3 = productRepository.save(Product.builder()
                .category(catPork)
                .sku("HEO-SUON-300")
                .slug("suon-than-heo-truyen-thong")
                .name("Sườn Thăn Heo Truyền Thống")
                .brand("UBOMEAT CHUẨN MÁT")
                .origin("Hà Nam")
                .standard("vietgap")
                .unit("Khay")
                .packWeight("Khay 300g")
                .price(BigDecimal.valueOf(71600))
                .originalPrice(BigDecimal.valueOf(78000))
                .stockQuantity(BigDecimal.valueOf(80))
                .isWeighing(false)
                .rating(BigDecimal.valueOf(4.9))
                .reviewCount(128)
                .imageUrl("https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80")
                .isActive(true)
                .build());

        Product p4 = productRepository.save(Product.builder()
                .category(catPork)
                .sku("HEO-BACHI-300")
                .slug("ba-chi-heo-truyen-thong")
                .name("Ba Chỉ Heo Truyền Thống")
                .brand("UBOMEAT CHUẨN MÁT")
                .origin("Hà Nam")
                .standard("euchill")
                .unit("Khay")
                .packWeight("Khay 300g")
                .price(BigDecimal.valueOf(67400))
                .originalPrice(BigDecimal.valueOf(74000))
                .stockQuantity(BigDecimal.valueOf(75))
                .isWeighing(false)
                .rating(BigDecimal.valueOf(5.0))
                .reviewCount(242)
                .imageUrl("https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=600&q=80")
                .isActive(true)
                .build());

        Product p5 = productRepository.save(Product.builder()
                .category(catPork)
                .sku("HEO-XAY-300")
                .slug("thit-xay-heo-truyen-thong")
                .name("Thịt Xay Heo Truyền Thống")
                .brand("UBOMEAT XAY SẠCH")
                .origin("Hà Nam")
                .standard("oxyfresh")
                .unit("Khay")
                .packWeight("Khay 300g")
                .price(BigDecimal.valueOf(53700))
                .originalPrice(BigDecimal.valueOf(58000))
                .stockQuantity(BigDecimal.valueOf(60))
                .isWeighing(false)
                .rating(BigDecimal.valueOf(4.8))
                .reviewCount(96)
                .imageUrl("https://images.unsplash.com/photo-1588347818036-558601350947?auto=format&fit=crop&w=600&q=80")
                .isActive(true)
                .build());

        Product p6 = productRepository.save(Product.builder()
                .category(catPork)
                .sku("HEO-MONGGIO-300")
                .slug("mong-gio-truoc-heo")
                .name("Móng Giò Trước Heo")
                .brand("UBOMEAT CHUẨN MÁT")
                .origin("Hà Nam")
                .standard("vietgap")
                .unit("Khay")
                .packWeight("Khay 300g")
                .price(BigDecimal.valueOf(43500))
                .originalPrice(BigDecimal.valueOf(48000))
                .stockQuantity(BigDecimal.valueOf(45))
                .isWeighing(false)
                .rating(BigDecimal.valueOf(4.7))
                .reviewCount(64)
                .imageUrl("https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80")
                .isActive(true)
                .build());

        Product p7 = productRepository.save(Product.builder()
                .category(catBeef)
                .sku("BO-THAN-300")
                .slug("than-bo-sach-ubomeat")
                .name("Thăn Bò Sạch Ubomeat")
                .brand("UBOMEAT BÒ ÚC")
                .origin("Nhập khẩu Úc")
                .standard("euchill")
                .unit("Khay")
                .packWeight("Khay 300g")
                .price(BigDecimal.valueOf(104900))
                .originalPrice(BigDecimal.valueOf(120000))
                .stockQuantity(BigDecimal.valueOf(40))
                .isWeighing(false)
                .rating(BigDecimal.valueOf(5.0))
                .reviewCount(178)
                .imageUrl("https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80")
                .isActive(true)
                .build());

        Product p8 = productRepository.save(Product.builder()
                .category(catPork)
                .sku("HEO-NACVAI-300")
                .slug("nac-vai-heo-truyen-thong")
                .name("Nạc Vai Heo Truyền Thống")
                .brand("UBOMEAT CHUẨN MÁT")
                .origin("Hà Nam")
                .standard("vietgap")
                .unit("Khay")
                .packWeight("Khay 300g")
                .price(BigDecimal.valueOf(57100))
                .originalPrice(BigDecimal.valueOf(62000))
                .stockQuantity(BigDecimal.valueOf(90))
                .isWeighing(false)
                .rating(BigDecimal.valueOf(4.9))
                .reviewCount(185)
                .imageUrl("https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?auto=format&fit=crop&w=600&q=80")
                .isActive(true)
                .build());

        Product p9 = productRepository.save(Product.builder()
                .category(catPork)
                .sku("HEO-NACDAM-300")
                .slug("nac-dam-heo-truyen-thong")
                .name("Nạc Dăm Heo Truyền Thống")
                .brand("UBOMEAT CHUẨN MÁT")
                .origin("Hà Nam")
                .standard("vietgap")
                .unit("Khay")
                .packWeight("Khay 300g")
                .price(BigDecimal.valueOf(60800))
                .originalPrice(BigDecimal.valueOf(65000))
                .stockQuantity(BigDecimal.valueOf(65))
                .isWeighing(false)
                .rating(BigDecimal.valueOf(4.8))
                .reviewCount(87)
                .imageUrl("https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?auto=format&fit=crop&w=600&q=80")
                .isActive(true)
                .build());

        Product p10 = productRepository.save(Product.builder()
                .category(catPoultry)
                .sku("GA-TRUNGTA-10P")
                .slug("trung-ga-ta-thuan-viet")
                .name("Trứng Gà Ta Thuần Việt")
                .brand("UBOFARM GIA CẦM")
                .origin("Ba Vì, Hà Nội")
                .standard("organic")
                .unit("Hộp")
                .packWeight("Hộp 10 quả")
                .price(BigDecimal.valueOf(42000))
                .originalPrice(BigDecimal.valueOf(46000))
                .stockQuantity(BigDecimal.valueOf(150))
                .isWeighing(false)
                .rating(BigDecimal.valueOf(5.0))
                .reviewCount(210)
                .imageUrl("https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80")
                .isActive(true)
                .build());

        Product p11 = productRepository.save(Product.builder()
                .category(catTofu)
                .sku("DAU-MOQUE-500")
                .slug("dau-mo-tuoi-ngon-que-minh")
                .name("Đậu Mơ Tươi Ngon Quê Mình")
                .brand("UBOFOOD LÀNG NGHỀ")
                .origin("Hà Nội")
                .standard("organic")
                .unit("Hộp")
                .packWeight("Hộp 500g")
                .price(BigDecimal.valueOf(20800))
                .originalPrice(BigDecimal.valueOf(24000))
                .stockQuantity(BigDecimal.valueOf(70))
                .isWeighing(false)
                .rating(BigDecimal.valueOf(4.9))
                .reviewCount(72)
                .imageUrl("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80")
                .isActive(true)
                .build());

        Product p12 = productRepository.save(Product.builder()
                .category(catPoultry)
                .sku("GA-CHANGARX-500")
                .slug("chan-ga-rut-xuong-chuan-ngon-ubomeat")
                .name("Chân Gà Rút Xương Chuẩn Ngon Ubomeat")
                .brand("UBOMEAT GIA CẦM")
                .origin("Hà Nội")
                .standard("vietgap")
                .unit("Khay")
                .packWeight("Khay 500g")
                .price(BigDecimal.valueOf(66700))
                .originalPrice(BigDecimal.valueOf(75000))
                .stockQuantity(BigDecimal.valueOf(55))
                .isWeighing(false)
                .rating(BigDecimal.valueOf(4.7))
                .reviewCount(86)
                .imageUrl("https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80")
                .isActive(true)
                .build());

        Product p13 = productRepository.save(Product.builder()
                .category(catSeafood)
                .sku("CA-HOINAUY-250")
                .slug("ca-hoi-nauy-tuoi-fillet")
                .name("Cá Hồi Na Uy Tươi Fillet")
                .brand("UBOSEAHẢI SẢN")
                .origin("Nhập khẩu Na Uy")
                .standard("euchill")
                .unit("Khay")
                .packWeight("Khay 250g")
                .price(BigDecimal.valueOf(135000))
                .originalPrice(BigDecimal.valueOf(155000))
                .stockQuantity(BigDecimal.valueOf(40))
                .isWeighing(false)
                .rating(BigDecimal.valueOf(5.0))
                .reviewCount(312)
                .imageUrl("https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80")
                .isActive(true)
                .build());

        Product p14 = productRepository.save(Product.builder()
                .category(catSeafood)
                .sku("TOM-THECT-500")
                .slug("tom-the-chan-trang-song")
                .name("Tôm Thẻ Chân Trắng Sống")
                .brand("UBOSEAHẢI SẢN")
                .origin("Quảng Ninh")
                .standard("vietgap")
                .unit("Hộp")
                .packWeight("Hộp 500g")
                .price(BigDecimal.valueOf(115000))
                .originalPrice(BigDecimal.valueOf(130000))
                .stockQuantity(BigDecimal.valueOf(50))
                .isWeighing(false)
                .rating(BigDecimal.valueOf(4.9))
                .reviewCount(167)
                .imageUrl("https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80")
                .isActive(true)
                .build());

        Product p15 = productRepository.save(Product.builder()
                .category(catVeg)
                .sku("RAU-BOXOI-500")
                .slug("cai-bo-xoi-thuy-canh-vietgap")
                .name("Cải Bó Xôi Thủy Canh VietGAP")
                .brand("UBOFARM ĐÀ LẠT")
                .origin("Đà Lạt, Lâm Đồng")
                .standard("vietgap")
                .unit("Túi")
                .packWeight("Túi 500g")
                .price(BigDecimal.valueOf(28000))
                .originalPrice(BigDecimal.valueOf(32000))
                .stockQuantity(BigDecimal.valueOf(100))
                .isWeighing(false)
                .rating(BigDecimal.valueOf(4.9))
                .reviewCount(159)
                .imageUrl("https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80")
                .isActive(true)
                .build());

        Product p16 = productRepository.save(Product.builder()
                .category(catVeg)
                .sku("RAU-CACHUABEEF-500")
                .slug("ca-chua-beef-moc-chau")
                .name("Cà Chua Beef Mộc Châu")
                .brand("UBOFARM MỘC CHÂU")
                .origin("Mộc Châu, Sơn La")
                .standard("organic")
                .unit("Túi")
                .packWeight("Túi 500g")
                .price(BigDecimal.valueOf(32000))
                .originalPrice(BigDecimal.valueOf(38000))
                .stockQuantity(BigDecimal.valueOf(120))
                .isWeighing(false)
                .rating(BigDecimal.valueOf(4.8))
                .reviewCount(143)
                .imageUrl("https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80")
                .isActive(true)
                .build());

        // 30 sản phẩm phong phú thêm vào database
        Product p17 = productRepository.save(Product.builder()
                .category(catBeef).sku("BO-STRIPLOIN-300").slug("than-ngoai-bo-uc-striploin")
                .name("Thăn Ngoại Bò Úc Striploin Cắt Lát").brand("UBOMEAT BÒ ÚC").origin("Nhập khẩu Úc")
                .standard("euchill").unit("Khay").packWeight("Khay 300g").price(BigDecimal.valueOf(139000))
                .originalPrice(BigDecimal.valueOf(155000)).stockQuantity(BigDecimal.valueOf(40)).isWeighing(false)
                .rating(BigDecimal.valueOf(4.9)).reviewCount(112)
                .imageUrl("https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80").isActive(true).build());

        Product p18 = productRepository.save(Product.builder()
                .category(catBeef).sku("BO-RIBEYE-300").slug("dau-than-ngoai-bo-uc-ribeye")
                .name("Đầu Thăn Ngoại Bò Úc Ribeye Hảo Hạng").brand("UBOMEAT BÒ ÚC").origin("Nhập khẩu Úc")
                .standard("euchill").unit("Khay").packWeight("Khay 300g").price(BigDecimal.valueOf(158000))
                .originalPrice(BigDecimal.valueOf(175000)).stockQuantity(BigDecimal.valueOf(35)).isWeighing(false)
                .rating(BigDecimal.valueOf(5.0)).reviewCount(98)
                .imageUrl("https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80").isActive(true).build());

        Product p19 = productRepository.save(Product.builder()
                .category(catBeef).sku("BO-GAUBO-300").slug("gau-bo-uc-gion-cuon-lau")
                .name("Gầu Bò Úc Giòn Cuộn Lẩu Chuẩn Vị").brand("UBOMEAT BÒ ÚC").origin("Nhập khẩu Úc")
                .standard("euchill").unit("Khay").packWeight("Khay 300g").price(BigDecimal.valueOf(95000))
                .originalPrice(BigDecimal.valueOf(110000)).stockQuantity(BigDecimal.valueOf(60)).isWeighing(false)
                .rating(BigDecimal.valueOf(4.8)).reviewCount(145)
                .imageUrl("https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80").isActive(true).build());

        Product p20 = productRepository.save(Product.builder()
                .category(catBeef).sku("BO-DESUON-400").slug("de-suon-bo-uc-rut-xuong")
                .name("Dẻ Sườn Bò Úc Rút Xương Nướng BBQ").brand("UBOMEAT BÒ ÚC").origin("Nhập khẩu Úc")
                .standard("euchill").unit("Khay").packWeight("Khay 400g").price(BigDecimal.valueOf(145000))
                .originalPrice(BigDecimal.valueOf(165000)).stockQuantity(BigDecimal.valueOf(30)).isWeighing(false)
                .rating(BigDecimal.valueOf(4.9)).reviewCount(78)
                .imageUrl("https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80").isActive(true).build());

        Product p21 = productRepository.save(Product.builder()
                .category(catBeef).sku("BO-BAPBO-300").slug("bap-bo-hoa-nhung-dam")
                .name("Bắp Bò Hoa Nhúng Dấm Chuẩn Mát").brand("UBOMEAT BÒ ÚC").origin("Nhập khẩu Úc")
                .standard("euchill").unit("Khay").packWeight("Khay 300g").price(BigDecimal.valueOf(125000))
                .originalPrice(BigDecimal.valueOf(140000)).stockQuantity(BigDecimal.valueOf(45)).isWeighing(false)
                .rating(BigDecimal.valueOf(4.9)).reviewCount(134)
                .imageUrl("https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=600&q=80").isActive(true).build());

        Product p22 = productRepository.save(Product.builder()
                .category(catPork).sku("HEO-SUONNON-400").slug("suon-non-heo-cat-khuc")
                .name("Sườn Non Heo Cắt Khúc Nấu Canh").brand("UBOMEAT CHUẨN MÁT").origin("Hà Nam")
                .standard("vietgap").unit("Khay").packWeight("Khay 400g").price(BigDecimal.valueOf(85000))
                .originalPrice(BigDecimal.valueOf(95000)).stockQuantity(BigDecimal.valueOf(70)).isWeighing(false)
                .rating(BigDecimal.valueOf(4.8)).reviewCount(89)
                .imageUrl("https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80").isActive(true).build());

        Product p23 = productRepository.save(Product.builder()
                .category(catPork).sku("HEO-NACNONG-300").slug("nac-nong-heo-tuoi-gion")
                .name("Nạc Nọng Heo Tươi Giòn Thơm Béo").brand("UBOMEAT CHUẨN MÁT").origin("Hà Nam")
                .standard("vietgap").unit("Khay").packWeight("Khay 300g").price(BigDecimal.valueOf(79000))
                .originalPrice(BigDecimal.valueOf(88000)).stockQuantity(BigDecimal.valueOf(40)).isWeighing(false)
                .rating(BigDecimal.valueOf(5.0)).reviewCount(167)
                .imageUrl("https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=600&q=80").isActive(true).build());

        Product p24 = productRepository.save(Product.builder()
                .category(catPork).sku("HEO-TAIHEO-300").slug("tai-heo-lam-sach-trang")
                .name("Tai Heo Làm Sạch Trắng Tươi").brand("UBOMEAT CHUẨN MÁT").origin("Hà Nam")
                .standard("vietgap").unit("Khay").packWeight("Khay 300g").price(BigDecimal.valueOf(49000))
                .originalPrice(BigDecimal.valueOf(55000)).stockQuantity(BigDecimal.valueOf(50)).isWeighing(false)
                .rating(BigDecimal.valueOf(4.7)).reviewCount(54)
                .imageUrl("https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80").isActive(true).build());

        Product p25 = productRepository.save(Product.builder()
                .category(catPork).sku("HEO-COTLET-350").slug("cot-let-heo-tuoi-mat")
                .name("Cốt Lết Heo Tươi Mát Bản Dày").brand("UBOMEAT CHUẨN MÁT").origin("Hà Nam")
                .standard("vietgap").unit("Khay").packWeight("Khay 350g").price(BigDecimal.valueOf(58000))
                .originalPrice(BigDecimal.valueOf(65000)).stockQuantity(BigDecimal.valueOf(65)).isWeighing(false)
                .rating(BigDecimal.valueOf(4.8)).reviewCount(62)
                .imageUrl("https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?auto=format&fit=crop&w=600&q=80").isActive(true).build());

        Product p26 = productRepository.save(Product.builder()
                .category(catPork).sku("HEO-XUONGONG-500").slug("xuong-ong-heo-ham-nuoc-dung")
                .name("Xương Ống Heo Hầm Nước Dùng Ngọt Thanh").brand("UBOMEAT CHUẨN MÁT").origin("Hà Nam")
                .standard("vietgap").unit("Khay").packWeight("Khay 500g").price(BigDecimal.valueOf(35000))
                .originalPrice(BigDecimal.valueOf(40000)).stockQuantity(BigDecimal.valueOf(80)).isWeighing(false)
                .rating(BigDecimal.valueOf(4.9)).reviewCount(105)
                .imageUrl("https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80").isActive(true).build());

        Product p27 = productRepository.save(Product.builder()
                .category(catPork).sku("HEO-BACHIRUT-300").slug("ba-chi-heo-rut-suon")
                .name("Ba Chỉ Heo Rút Sườn Cuộn Nướng").brand("UBOMEAT CHUẨN MÁT").origin("Hà Nam")
                .standard("vietgap").unit("Khay").packWeight("Khay 300g").price(BigDecimal.valueOf(82000))
                .originalPrice(BigDecimal.valueOf(90000)).stockQuantity(BigDecimal.valueOf(55)).isWeighing(false)
                .rating(BigDecimal.valueOf(4.9)).reviewCount(98)
                .imageUrl("https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=600&q=80").isActive(true).build());

        Product p28 = productRepository.save(Product.builder()
                .category(catPoultry).sku("GA-GATA-CON").slug("ga-ta-tha-doi-ba-vi")
                .name("Gà Ta Thả Đồi Ba Vì Làm Sạch Sẵn").brand("UBOFARM GIA CẦM").origin("Ba Vì, Hà Nội")
                .standard("organic").unit("Con").packWeight("Con 1.3kg").price(BigDecimal.valueOf(185000))
                .originalPrice(BigDecimal.valueOf(210000)).stockQuantity(BigDecimal.valueOf(30)).isWeighing(false)
                .rating(BigDecimal.valueOf(5.0)).reviewCount(176)
                .imageUrl("https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80").isActive(true).build());

        Product p29 = productRepository.save(Product.builder()
                .category(catPoultry).sku("GA-DUIGOCTU-500").slug("dui-ga-goc-tu-tuoi")
                .name("Đùi Gà Góc Tư Tươi Sạch Thảo Mộc").brand("UBOFARM GIA CẦM").origin("Hà Nội")
                .standard("vietgap").unit("Khay").packWeight("Khay 500g").price(BigDecimal.valueOf(52000))
                .originalPrice(BigDecimal.valueOf(60000)).stockQuantity(BigDecimal.valueOf(75)).isWeighing(false)
                .rating(BigDecimal.valueOf(4.8)).reviewCount(84)
                .imageUrl("https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80").isActive(true).build());

        Product p30 = productRepository.save(Product.builder()
                .category(catPoultry).sku("GA-CANHGA-500").slug("canh-ga-giua-tuoi")
                .name("Cánh Gà Giữa Tươi Ngon Chiên Giòn").brand("UBOFARM GIA CẦM").origin("Hà Nội")
                .standard("vietgap").unit("Khay").packWeight("Khay 500g").price(BigDecimal.valueOf(68000))
                .originalPrice(BigDecimal.valueOf(76000)).stockQuantity(BigDecimal.valueOf(60)).isWeighing(false)
                .rating(BigDecimal.valueOf(4.9)).reviewCount(113)
                .imageUrl("https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80").isActive(true).build());

        Product p31 = productRepository.save(Product.builder()
                .category(catPoultry).sku("GA-TRUNGCUT-30P").slug("trung-cut-tuoi-vuon-que")
                .name("Trứng Cút Tươi Vườn Quê Thơm Bùi").brand("UBOFARM GIA CẦM").origin("Ba Vì, Hà Nội")
                .standard("organic").unit("Hộp").packWeight("Hộp 30 quả").price(BigDecimal.valueOf(25000))
                .originalPrice(BigDecimal.valueOf(28000)).stockQuantity(BigDecimal.valueOf(100)).isWeighing(false)
                .rating(BigDecimal.valueOf(4.8)).reviewCount(92)
                .imageUrl("https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80").isActive(true).build());

        Product p32 = productRepository.save(Product.builder()
                .category(catSeafood).sku("HAI-MUCONG-500").slug("muc-ong-tuoi-con-dao")
                .name("Mực Ống Tươi Côn Đảo Cấp Đông Nhanh").brand("UBOSEAHẢI SẢN").origin("Côn Đảo")
                .standard("euchill").unit("Túi").packWeight("Túi 500g").price(BigDecimal.valueOf(145000))
                .originalPrice(BigDecimal.valueOf(165000)).stockQuantity(BigDecimal.valueOf(40)).isWeighing(false)
                .rating(BigDecimal.valueOf(4.9)).reviewCount(138)
                .imageUrl("https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80").isActive(true).build());

        Product p33 = productRepository.save(Product.builder()
                .category(catSeafood).sku("HAI-BACHTUOC-400").slug("bach-tuoc-sua-tuoi")
                .name("Bạch Tuộc Sữa Tươi Giòn Nhúng Dấm").brand("UBOSEAHẢI SẢN").origin("Phan Thiết")
                .standard("vietgap").unit("Khay").packWeight("Khay 400g").price(BigDecimal.valueOf(110000))
                .originalPrice(BigDecimal.valueOf(125000)).stockQuantity(BigDecimal.valueOf(35)).isWeighing(false)
                .rating(BigDecimal.valueOf(4.8)).reviewCount(76)
                .imageUrl("https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80").isActive(true).build());

        Product p34 = productRepository.save(Product.builder()
                .category(catSeafood).sku("HAI-CABASA-500").slug("phi-le-ca-basa-tuoi")
                .name("Phi Lê Cá Basa Tươi Sạch Xuất Khẩu").brand("UBOSEAHẢI SẢN").origin("An Giang")
                .standard("vietgap").unit("Khay").packWeight("Khay 500g").price(BigDecimal.valueOf(48000))
                .originalPrice(BigDecimal.valueOf(55000)).stockQuantity(BigDecimal.valueOf(80)).isWeighing(false)
                .rating(BigDecimal.valueOf(4.7)).reviewCount(88)
                .imageUrl("https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80").isActive(true).build());

        Product p35 = productRepository.save(Product.builder()
                .category(catSeafood).sku("HAI-NGHEU-1000").slug("ngheu-trang-song-ben-tre")
                .name("Nghêu Trắng Sống Bến Tre Béo Ngọt").brand("UBOSEAHẢI SẢN").origin("Bến Tre")
                .standard("vietgap").unit("Túi").packWeight("Túi 1kg").price(BigDecimal.valueOf(39000))
                .originalPrice(BigDecimal.valueOf(45000)).stockQuantity(BigDecimal.valueOf(60)).isWeighing(false)
                .rating(BigDecimal.valueOf(4.8)).reviewCount(95)
                .imageUrl("https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80").isActive(true).build());

        Product p36 = productRepository.save(Product.builder()
                .category(catSeafood).sku("HAI-CUACAMAU-1000").slug("cua-bien-ca-mau")
                .name("Cua Biển Cà Mau Dây Nhỏ Chắc Thịt").brand("UBOSEAHẢI SẢN").origin("Cà Mau")
                .standard("euchill").unit("Hộp").packWeight("Hộp 1kg").price(BigDecimal.valueOf(295000))
                .originalPrice(BigDecimal.valueOf(330000)).stockQuantity(BigDecimal.valueOf(25)).isWeighing(false)
                .rating(BigDecimal.valueOf(5.0)).reviewCount(156)
                .imageUrl("https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80").isActive(true).build());

        Product p37 = productRepository.save(Product.builder()
                .category(catVeg).sku("RAU-SUPLOXANH-400").slug("sup-lo-xanh-thuy-canh")
                .name("Súp Lơ Xanh Thủy Canh VietGAP").brand("UBOFARM ĐÀ LẠT").origin("Đà Lạt, Lâm Đồng")
                .standard("vietgap").unit("Túi").packWeight("Túi 400g").price(BigDecimal.valueOf(24000))
                .originalPrice(BigDecimal.valueOf(28000)).stockQuantity(BigDecimal.valueOf(90)).isWeighing(false)
                .rating(BigDecimal.valueOf(4.9)).reviewCount(104)
                .imageUrl("https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80").isActive(true).build());

        Product p38 = productRepository.save(Product.builder()
                .category(catVeg).sku("RAU-XALACH-300").slug("xa-lach-romaine-huu-co")
                .name("Xà Lách Romaine Hữu Cơ Đà Lạt Giòn Ngọt").brand("UBOFARM ĐÀ LẠT").origin("Đà Lạt")
                .standard("organic").unit("Túi").packWeight("Túi 300g").price(BigDecimal.valueOf(26000))
                .originalPrice(BigDecimal.valueOf(30000)).stockQuantity(BigDecimal.valueOf(85)).isWeighing(false)
                .rating(BigDecimal.valueOf(4.9)).reviewCount(118)
                .imageUrl("https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80").isActive(true).build());

        Product p39 = productRepository.save(Product.builder()
                .category(catVeg).sku("RAU-NAMDUIGA-300").slug("nam-dui-ga-tuoi")
                .name("Nấm Đùi Gà Tươi Chuẩn Hàn Quốc").brand("UBOFARM MỘC CHÂU").origin("Mộc Châu")
                .standard("organic").unit("Gói").packWeight("Gói 300g").price(BigDecimal.valueOf(35000))
                .originalPrice(BigDecimal.valueOf(40000)).stockQuantity(BigDecimal.valueOf(70)).isWeighing(false)
                .rating(BigDecimal.valueOf(4.8)).reviewCount(73)
                .imageUrl("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80").isActive(true).build());

        Product p40 = productRepository.save(Product.builder()
                .category(catVeg).sku("RAU-BIXANH-800").slug("bi-xanh-huu-co-moc-chau")
                .name("Bí Xanh Hữu Cơ Mộc Châu Ngọt Mát").brand("UBOFARM MỘC CHÂU").origin("Mộc Châu, Sơn La")
                .standard("organic").unit("Quả").packWeight("Quả 800g").price(BigDecimal.valueOf(18000))
                .originalPrice(BigDecimal.valueOf(22000)).stockQuantity(BigDecimal.valueOf(95)).isWeighing(false)
                .rating(BigDecimal.valueOf(4.8)).reviewCount(86)
                .imageUrl("https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80").isActive(true).build());

        Product p41 = productRepository.save(Product.builder()
                .category(catVeg).sku("RAU-DAUHALAN-250").slug("dau-ha-lan-tuoi-gion")
                .name("Đậu Hà Lan Tươi Giòn Xào Thịt").brand("UBOFARM ĐÀ LẠT").origin("Đà Lạt")
                .standard("vietgap").unit("Khay").packWeight("Khay 250g").price(BigDecimal.valueOf(32000))
                .originalPrice(BigDecimal.valueOf(36000)).stockQuantity(BigDecimal.valueOf(65)).isWeighing(false)
                .rating(BigDecimal.valueOf(4.7)).reviewCount(59)
                .imageUrl("https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80").isActive(true).build());

        Product p42 = productRepository.save(Product.builder()
                .category(catTofu).sku("DAU-DAUCHIEN-400").slug("dau-hu-chien-vang")
                .name("Đậu Hũ Chiên Vàng Sẵn Tiện Lợi").brand("UBOFOOD LÀNG NGHỀ").origin("Hà Nội")
                .standard("organic").unit("Hộp").packWeight("Hộp 400g").price(BigDecimal.valueOf(16000))
                .originalPrice(BigDecimal.valueOf(19000)).stockQuantity(BigDecimal.valueOf(60)).isWeighing(false)
                .rating(BigDecimal.valueOf(4.9)).reviewCount(110)
                .imageUrl("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80").isActive(true).build());

        Product p43 = productRepository.save(Product.builder()
                .category(catTofu).sku("DAU-TAUHUNON-300").slug("tau-hu-non-min")
                .name("Tàu Hũ Non Mịn Nấu Canh Rong Biển").brand("UBOFOOD LÀNG NGHỀ").origin("Hà Nội")
                .standard("organic").unit("Hộp").packWeight("Hộp 300g").price(BigDecimal.valueOf(14000))
                .originalPrice(BigDecimal.valueOf(17000)).stockQuantity(BigDecimal.valueOf(80)).isWeighing(false)
                .rating(BigDecimal.valueOf(4.8)).reviewCount(78)
                .imageUrl("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80").isActive(true).build());

        Product p44 = productRepository.save(Product.builder()
                .category(catSale).sku("SALE-LAUNAM-800").slug("combo-lau-nam-duong-sinh")
                .name("Combo Lẩu Nấm Dưỡng Sinh Gia Đình Sơ Chế").brand("UBOFOOD TIỆN LỢI").origin("Hà Nội")
                .standard("vietgap").unit("Khay").packWeight("Khay 800g").price(BigDecimal.valueOf(129000))
                .originalPrice(BigDecimal.valueOf(160000)).stockQuantity(BigDecimal.valueOf(40)).isWeighing(false)
                .rating(BigDecimal.valueOf(4.9)).reviewCount(134)
                .imageUrl("https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80").isActive(true).build());

        Product p45 = productRepository.save(Product.builder()
                .category(catSale).sku("SALE-LAUHAISAN-1000").slug("combo-hai-san-tha-lau")
                .name("Combo Hải Sản Thả Lẩu Tươi Thượng Hạng").brand("UBOFOOD TIỆN LỢI").origin("Quảng Ninh")
                .standard("euchill").unit("Khay").packWeight("Khay 1kg").price(BigDecimal.valueOf(199000))
                .originalPrice(BigDecimal.valueOf(245000)).stockQuantity(BigDecimal.valueOf(35)).isWeighing(false)
                .rating(BigDecimal.valueOf(5.0)).reviewCount(167)
                .imageUrl("https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80").isActive(true).build());

        Product p46 = productRepository.save(Product.builder()
                .category(catSale).sku("SALE-CANHCHUA-600").slug("combo-canh-chua-ca-hoi")
                .name("Combo Canh Chua Cá Hồi Đậm Đà Sơ Chế Sẵn").brand("UBOFOOD TIỆN LỢI").origin("Hà Nội")
                .standard("euchill").unit("Khay").packWeight("Khay 600g").price(BigDecimal.valueOf(99000))
                .originalPrice(BigDecimal.valueOf(125000)).stockQuantity(BigDecimal.valueOf(50)).isWeighing(false)
                .rating(BigDecimal.valueOf(4.8)).reviewCount(83)
                .imageUrl("https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80").isActive(true).build());

        // ==========================================
        // 5. VOUCHERS (Khớp các mã ở Header & Cart)
        // ==========================================
        Voucher v1 = voucherRepository.save(Voucher.builder()
                .code("GIAM50K")
                .badge("HOT -50%")
                .title("Giảm 50.000đ cho đơn hàng thực phẩm mát đầu tiên từ 150.000đ")
                .discountType("FIXED_AMOUNT")
                .discountValue(BigDecimal.valueOf(50000))
                .minOrderAmount(BigDecimal.valueOf(150000))
                .startDate(LocalDateTime.now().minusDays(10))
                .endDate(LocalDateTime.now().plusDays(90))
                .isActive(true)
                .build());

        Voucher v2 = voucherRepository.save(Voucher.builder()
                .code("FREESHIP2H")
                .badge("FREESHIP")
                .title("Miễn phí vận chuyển hỏa tốc 2 giờ (-25.000đ) cho đơn từ 150.000đ")
                .discountType("FIXED_AMOUNT")
                .discountValue(BigDecimal.valueOf(25000))
                .minOrderAmount(BigDecimal.valueOf(150000))
                .startDate(LocalDateTime.now().minusDays(10))
                .endDate(LocalDateTime.now().plusDays(90))
                .isActive(true)
                .build());

        Voucher v3 = voucherRepository.save(Voucher.builder()
                .code("UBOMEAT")
                .badge("-20K")
                .title("Giảm 20.000đ trực tiếp khi mua các loại thịt bò Úc & heo mát")
                .discountType("FIXED_AMOUNT")
                .discountValue(BigDecimal.valueOf(20000))
                .minOrderAmount(BigDecimal.valueOf(100000))
                .startDate(LocalDateTime.now().minusDays(10))
                .endDate(LocalDateTime.now().plusDays(90))
                .isActive(true)
                .build());

        Voucher v4 = voucherRepository.save(Voucher.builder()
                .code("UBOCHAOXUAN")
                .badge("-10K")
                .title("Giảm 10.000đ chào bạn mới mua sắm tại Ubofood")
                .discountType("FIXED_AMOUNT")
                .discountValue(BigDecimal.valueOf(10000))
                .minOrderAmount(BigDecimal.ZERO)
                .startDate(LocalDateTime.now().minusDays(10))
                .endDate(LocalDateTime.now().plusDays(90))
                .isActive(true)
                .build());

        // ==========================================
        // 6. GOODS RECEIPTS (Nhập kho thịt mát theo lô)
        // ==========================================
        goodsReceiptRepository.save(GoodsReceipt.builder()
                .receiptCode("GR-20260928-01")
                .supplier(supMeat)
                .createdBy(admin)
                .product(p2)
                .batchNumber("LOT-OXY-8921")
                .expDate(LocalDate.now().plusDays(7))
                .quantity(BigDecimal.valueOf(50))
                .importPrice(BigDecimal.valueOf(65000))
                .totalCost(BigDecimal.valueOf(3250000))
                .note("Nhập thịt bò Úc tươi đóng khay OxyFresh tiêu chuẩn lạnh 0 - 4°C")
                .build());

        goodsReceiptRepository.save(GoodsReceipt.builder()
                .receiptCode("GR-20260928-02")
                .supplier(supPork)
                .createdBy(admin)
                .product(p3)
                .batchNumber("LOT-PORK-3312")
                .expDate(LocalDate.now().plusDays(5))
                .quantity(BigDecimal.valueOf(100))
                .importPrice(BigDecimal.valueOf(52000))
                .totalCost(BigDecimal.valueOf(5200000))
                .note("Nhập sườn thăn heo tươi chuẩn VietGAP nông trại Hà Nam")
                .build());

        goodsReceiptRepository.save(GoodsReceipt.builder()
                .receiptCode("GR-20260928-03")
                .supplier(supSea)
                .createdBy(admin)
                .product(p13)
                .batchNumber("LOT-SALMON-771")
                .expDate(LocalDate.now().plusDays(4))
                .quantity(BigDecimal.valueOf(40))
                .importPrice(BigDecimal.valueOf(98000))
                .totalCost(BigDecimal.valueOf(3920000))
                .note("Nhập cá hồi Na Uy tươi fillet ướp đá lạnh chuyên dụng")
                .build());

        // ==========================================
        // 7. ORDERS & ORDER ITEMS & ORDER VOUCHERS
        // ==========================================
        // Đơn hàng 1: Khách hàng online, đã hoàn thành
        Order order1 = orderRepository.save(Order.builder()
                .orderCode("UBO-WEB-20260928")
                .channel("WEB")
                .user(customer1)
                .customerName("Lê Văn Mua Hàng")
                .customerPhone("0966666666")
                .shippingAddress("Tòa Keangnam Landmark 72, Nam Từ Liêm, Hà Nội")
                .deliveryMethod("FAST_2H")
                .note("Gửi bảo vệ sảnh A, gọi điện trước khi đến 5 phút")
                .totalAmount(BigDecimal.valueOf(253600))
                .shippingFee(BigDecimal.valueOf(25000))
                .finalAmount(BigDecimal.valueOf(203600))
                .paymentMethod("COD")
                .orderStatus("COMPLETED")
                .isPrinted(true)
                .build());

        orderItemRepository.save(OrderItem.builder()
                .order(order1)
                .product(p2)
                .productName(p2.getName())
                .packWeight(p2.getPackWeight())
                .unit(p2.getUnit())
                .quantity(BigDecimal.valueOf(2))
                .unitPrice(p2.getPrice())
                .subtotal(BigDecimal.valueOf(178000))
                .imageUrl(p2.getImageUrl())
                .build());

        orderItemRepository.save(OrderItem.builder()
                .order(order1)
                .product(p3)
                .productName(p3.getName())
                .packWeight(p3.getPackWeight())
                .unit(p3.getUnit())
                .quantity(BigDecimal.valueOf(1))
                .unitPrice(p3.getPrice())
                .subtotal(BigDecimal.valueOf(71600))
                .imageUrl(p3.getImageUrl())
                .build());

        orderVoucherRepository.save(OrderVoucher.builder()
                .order(order1)
                .voucher(v1)
                .voucherCode("GIAM50K")
                .discountAmount(BigDecimal.valueOf(50000))
                .appliedAt(LocalDateTime.now())
                .build());

        orderVoucherRepository.save(OrderVoucher.builder()
                .order(order1)
                .voucher(v2)
                .voucherCode("FREESHIP2H")
                .discountAmount(BigDecimal.valueOf(25000))
                .appliedAt(LocalDateTime.now())
                .build());

        // Đơn hàng 2: Khách hàng online, đang xử lý VNPAY
        Order order2 = orderRepository.save(Order.builder()
                .orderCode("UBO-WEB-20260929")
                .channel("WEB")
                .user(customer2)
                .customerName("Hoàng Thị Mai")
                .customerPhone("0912345678")
                .shippingAddress("Số 15 phố Chùa Láng, Đống Đa, Hà Nội")
                .deliveryMethod("FAST_2H")
                .note("Giao tầng 3 chung cư")
                .totalAmount(BigDecimal.valueOf(250000))
                .shippingFee(BigDecimal.valueOf(25000))
                .finalAmount(BigDecimal.valueOf(250000))
                .paymentMethod("VNPAY")
                .orderStatus("PROCESSING")
                .isPrinted(false)
                .build());

        orderItemRepository.save(OrderItem.builder()
                .order(order2)
                .product(p13)
                .productName(p13.getName())
                .packWeight(p13.getPackWeight())
                .unit(p13.getUnit())
                .quantity(BigDecimal.valueOf(1))
                .unitPrice(p13.getPrice())
                .subtotal(BigDecimal.valueOf(135000))
                .imageUrl(p13.getImageUrl())
                .build());

        orderItemRepository.save(OrderItem.builder()
                .order(order2)
                .product(p14)
                .productName(p14.getName())
                .packWeight(p14.getPackWeight())
                .unit(p14.getUnit())
                .quantity(BigDecimal.valueOf(1))
                .unitPrice(p14.getPrice())
                .subtotal(BigDecimal.valueOf(115000))
                .imageUrl(p14.getImageUrl())
                .build());

        orderVoucherRepository.save(OrderVoucher.builder()
                .order(order2)
                .voucher(v2)
                .voucherCode("FREESHIP2H")
                .discountAmount(BigDecimal.valueOf(25000))
                .appliedAt(LocalDateTime.now())
                .build());

        // Đơn hàng 3: POS bán tại quầy do Thu Ngân thực hiện
        Order order3 = orderRepository.save(Order.builder()
                .orderCode("UBO-POS-1001")
                .channel("POS")
                .user(customer1)
                .cashier(cashier)
                .customerName("Lê Văn Mua Hàng")
                .customerPhone("0966666666")
                .shippingAddress("Mua trực tiếp tại cửa hàng Ubofood Cầu Giấy")
                .deliveryMethod("TAKE_AWAY")
                .note("Khách thanh toán tiền mặt tại quầy")
                .totalAmount(BigDecimal.valueOf(113600))
                .shippingFee(BigDecimal.ZERO)
                .finalAmount(BigDecimal.valueOf(113600))
                .paymentMethod("CASH")
                .orderStatus("COMPLETED")
                .isPrinted(true)
                .build());

        orderItemRepository.save(OrderItem.builder()
                .order(order3)
                .product(p3)
                .productName(p3.getName())
                .packWeight(p3.getPackWeight())
                .unit(p3.getUnit())
                .quantity(BigDecimal.valueOf(1))
                .unitPrice(p3.getPrice())
                .subtotal(BigDecimal.valueOf(71600))
                .imageUrl(p3.getImageUrl())
                .build());

        orderItemRepository.save(OrderItem.builder()
                .order(order3)
                .product(p10)
                .productName(p10.getName())
                .packWeight(p10.getPackWeight())
                .unit(p10.getUnit())
                .quantity(BigDecimal.valueOf(1))
                .unitPrice(p10.getPrice())
                .subtotal(BigDecimal.valueOf(42000))
                .imageUrl(p10.getImageUrl())
                .build());

        System.out.println("✅ [DataInitializer] Đã khởi tạo thành công 16 sản phẩm, 7 danh mục, 4 người dùng, 4 voucher, 4 nhà cung cấp, phiếu nhập và đơn hàng mẫu!");
    }
}
