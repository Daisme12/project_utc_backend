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
