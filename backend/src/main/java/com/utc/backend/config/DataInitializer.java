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
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final GoodsReceiptRepository goodsReceiptRepository;
    private final GoodsReceiptDetailRepository goodsReceiptDetailRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final InventoryTransactionRepository inventoryTransactionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (roleRepository.count() > 0) {
            return; // Data already initialized
        }

        // ==========================================
        // 1. ROLES
        // ==========================================
        Role roleAdmin = roleRepository.save(Role.builder().code("ADMIN").name("Quản Trị Viên Hệ Thống").build());
        Role roleCashier = roleRepository.save(Role.builder().code("CASHIER").name("Nhân Viên Thu Ngân").build());
        Role roleStaff = roleRepository.save(Role.builder().code("STAFF").name("Nhân Viên Kho").build());
        Role roleCustomer = roleRepository.save(Role.builder().code("CUSTOMER").name("Khách Hàng Thành Viên").build());

        // ==========================================
        // 2. USERS (Mật khẩu mặc định: 123456)
        // ==========================================
        String defaultPasswordHash = passwordEncoder.encode("123456");

        User admin = userRepository.save(User.builder()
                .role(roleAdmin)
                .username("admin")
                .passwordHash(defaultPasswordHash)
                .fullName("Nguyễn Quản Trị")
                .phone("0988888888")
                .email("admin@utc.edu.vn")
                .isActive(true)
                .build());

        User cashier = userRepository.save(User.builder()
                .role(roleCashier)
                .username("thungan01")
                .passwordHash(defaultPasswordHash)
                .fullName("Trần Thị Thu Ngân")
                .phone("0977777777")
                .email("cashier01@utc.edu.vn")
                .isActive(true)
                .build());

        User customer = userRepository.save(User.builder()
                .role(roleCustomer)
                .username("khachhang01")
                .passwordHash(defaultPasswordHash)
                .fullName("Lê Văn Mua Hàng")
                .phone("0966666666")
                .email("customer01@gmail.com")
                .isActive(true)
                .build());

        // ==========================================
        // 3. CATEGORIES
        // ==========================================
        Category catMilk = categoryRepository.save(Category.builder()
                .name("Sữa & Chế Phẩm Sữa")
                .slug("sua-che-pham-sua")
                .description("Các loại sữa tươi, sữa chua, bơ, phô mai tươi")
                .isActive(true)
                .build());

        Category catDrink = categoryRepository.save(Category.builder()
                .name("Đồ Uống & Nước Giải Khát")
                .slug("do-uong-nuoc-giai-khat")
                .description("Nước ngọt, nước suối, trà xanh, nước tăng lực")
                .isActive(true)
                .build());

        Category catDryFood = categoryRepository.save(Category.builder()
                .name("Mì Ăn Liền & Thực Phẩm Khô")
                .slug("mi-an-lien-thuc-pham-kho")
                .description("Mì gói, hủ tiếu, phở ăn liền, miến dong")
                .isActive(true)
                .build());

        Category catSnack = categoryRepository.save(Category.builder()
                .name("Bánh Kẹo & Snack")
                .slug("banh-keo-snack")
                .description("Bim bim khoai tây, bánh quy bơ, kẹo dẻo")
                .isActive(true)
                .build());

        Category catSpice = categoryRepository.save(Category.builder()
                .name("Gia Vị & Nước Chấm")
                .slug("gia-vi-nuoc-cham")
                .description("Nước mắm, dầu ăn, hạt nêm, tương ớt")
                .isActive(true)
                .build());

        // ==========================================
        // 4. SUPPLIERS
        // ==========================================
        Supplier supVinamilk = supplierRepository.save(Supplier.builder()
                .name("Công ty Cổ phần Sữa Việt Nam (Vinamilk)")
                .phone("02854155555")
                .address("Số 10 Tân Trào, P. Tân Phú, Quận 7, TP. HCM")
                .isActive(true)
                .build());

        Supplier supMasan = supplierRepository.save(Supplier.builder()
                .name("Tập đoàn Masan Consumer")
                .phone("02862563862")
                .address("Tầng 12 MPlaza Saigon, 39 Lê Duẩn, Quận 1, TP. HCM")
                .isActive(true)
                .build());

        Supplier supAcecook = supplierRepository.save(Supplier.builder()
                .name("Công ty Cổ phần Acecook Việt Nam")
                .phone("02838154064")
                .address("Lô II-3, Đường số 11, KCN Tân Bình, Tây Thạnh, Tân Phú, TP. HCM")
                .isActive(true)
                .build());

        // ==========================================
        // 5. PRODUCTS
        // ==========================================
        Product p1 = productRepository.save(Product.builder()
                .category(catMilk)
                .sku("SP-VNM-1L-001")
                .name("Sữa tươi tiệt trùng Vinamilk 100% Không đường 1L")
                .unit("Hộp")
                .isWeighing(false)
                .price(new BigDecimal("35000.00"))
                .costPrice(new BigDecimal("28000.00"))
                .stockQuantity(new BigDecimal("150.000"))
                .origin("Việt Nam")
                .imageUrl("https://res.cloudinary.com/demo/image/upload/v1726000000/products/vinamilk-1l.jpg")
                .isActive(true)
                .build());

        Product p2 = productRepository.save(Product.builder()
                .category(catMilk)
                .sku("SP-VNM-180ML-002")
                .name("Lốc 4 hộp Sữa tươi tiệt trùng Vinamilk Có đường 180ml")
                .unit("Lốc")
                .isWeighing(false)
                .price(new BigDecimal("38000.00"))
                .costPrice(new BigDecimal("31000.00"))
                .stockQuantity(new BigDecimal("200.000"))
                .origin("Việt Nam")
                .imageUrl("https://res.cloudinary.com/demo/image/upload/v1726000000/products/vinamilk-180ml.jpg")
                .isActive(true)
                .build());

        Product p3 = productRepository.save(Product.builder()
                .category(catDryFood)
                .sku("SP-ACE-HH-TOMCHUA-003")
                .name("Mì Hảo Hảo tôm chua cay 75g")
                .unit("Gói")
                .isWeighing(false)
                .price(new BigDecimal("4500.00"))
                .costPrice(new BigDecimal("3600.00"))
                .stockQuantity(new BigDecimal("500.000"))
                .origin("Việt Nam")
                .imageUrl("https://res.cloudinary.com/demo/image/upload/v1726000000/products/mi-hao-hao.jpg")
                .isActive(true)
                .build());

        Product p4 = productRepository.save(Product.builder()
                .category(catDryFood)
                .sku("SP-ACE-THUNG-HH-004")
                .name("Thùng 30 gói Mì Hảo Hảo tôm chua cay 75g")
                .unit("Thùng")
                .isWeighing(false)
                .price(new BigDecimal("130000.00"))
                .costPrice(new BigDecimal("108000.00"))
                .stockQuantity(new BigDecimal("80.000"))
                .origin("Việt Nam")
                .imageUrl("https://res.cloudinary.com/demo/image/upload/v1726000000/products/thung-hao-hao.jpg")
                .isActive(true)
                .build());

        Product p5 = productRepository.save(Product.builder()
                .category(catSpice)
                .sku("SP-MSN-CHINSU-250G-005")
                .name("Tương ớt Chin-su chai 250g")
                .unit("Chai")
                .isWeighing(false)
                .price(new BigDecimal("16000.00"))
                .costPrice(new BigDecimal("12500.00"))
                .stockQuantity(new BigDecimal("120.000"))
                .origin("Việt Nam")
                .imageUrl("https://res.cloudinary.com/demo/image/upload/v1726000000/products/tuong-ot-chinsu.jpg")
                .isActive(true)
                .build());

        Product p6 = productRepository.save(Product.builder()
                .category(catSpice)
                .sku("SP-MSN-NAMNGU-500ML-006")
                .name("Nước mắm Nam Ngư Đệ Nhị chai 900ml")
                .unit("Chai")
                .isWeighing(false)
                .price(new BigDecimal("32000.00"))
                .costPrice(new BigDecimal("25000.00"))
                .stockQuantity(new BigDecimal("90.000"))
                .origin("Việt Nam")
                .imageUrl("https://res.cloudinary.com/demo/image/upload/v1726000000/products/nuoc-mam-nam-ngu.jpg")
                .isActive(true)
                .build());

        Product p7 = productRepository.save(Product.builder()
                .category(catDrink)
                .sku("SP-DRK-COCA-320ML-007")
                .name("Nước ngọt Coca Cola lon 320ml")
                .unit("Lon")
                .isWeighing(false)
                .price(new BigDecimal("10000.00"))
                .costPrice(new BigDecimal("7800.00"))
                .stockQuantity(new BigDecimal("300.000"))
                .origin("Việt Nam")
                .imageUrl("https://res.cloudinary.com/demo/image/upload/v1726000000/products/coca-cola.jpg")
                .isActive(true)
                .build());

        Product p8 = productRepository.save(Product.builder()
                .category(catSnack)
                .sku("SP-SNK-LAYS-CLASSIC-008")
                .name("Snack khoai tây Lay's vị tự nhiên Classic 56g")
                .unit("Gói")
                .isWeighing(false)
                .price(new BigDecimal("18000.00"))
                .costPrice(new BigDecimal("14000.00"))
                .stockQuantity(new BigDecimal("150.000"))
                .origin("Việt Nam")
                .imageUrl("https://res.cloudinary.com/demo/image/upload/v1726000000/products/lays-classic.jpg")
                .isActive(true)
                .build());

        // ==========================================
        // 6. GOODS RECEIPTS & DETAILS (Phiếu nhập kho)
        // ==========================================
        GoodsReceipt gr1 = goodsReceiptRepository.save(GoodsReceipt.builder()
                .receiptCode("PNK-20260901-001")
                .supplier(supVinamilk)
                .createdBy(admin)
                .totalCost(new BigDecimal("10400000.00"))
                .build());

        goodsReceiptDetailRepository.save(GoodsReceiptDetail.builder()
                .receipt(gr1)
                .product(p1)
                .batchNumber("LO-VNM-2026A")
                .expDate(LocalDate.now().plusMonths(6))
                .quantity(new BigDecimal("150.000"))
                .importPrice(new BigDecimal("28000.00"))
                .build());

        goodsReceiptDetailRepository.save(GoodsReceiptDetail.builder()
                .receipt(gr1)
                .product(p2)
                .batchNumber("LO-VNM-2026B")
                .expDate(LocalDate.now().plusMonths(6))
                .quantity(new BigDecimal("200.000"))
                .importPrice(new BigDecimal("31000.00"))
                .build());

        // Log initial inventory transactions
        inventoryTransactionRepository.save(InventoryTransaction.builder()
                .product(p1)
                .type("IMPORT")
                .quantityDelta(new BigDecimal("150.000"))
                .balanceAfter(new BigDecimal("150.000"))
                .referenceId("PNK-20260901-001")
                .build());

        inventoryTransactionRepository.save(InventoryTransaction.builder()
                .product(p2)
                .type("IMPORT")
                .quantityDelta(new BigDecimal("200.000"))
                .balanceAfter(new BigDecimal("200.000"))
                .referenceId("PNK-20260901-001")
                .build());

        // ==========================================
        // 7. SAMPLE ORDERS (Đơn hàng bán ra)
        // ==========================================
        Order ord1 = orderRepository.save(Order.builder()
                .orderCode("ORD-20260914-001")
                .channel("STORE")
                .user(customer)
                .cashier(cashier)
                .customerName("Lê Văn Mua Hàng")
                .customerPhone("0966666666")
                .shippingAddress("Phường Láng Thượng, Đống Đa, Hà Nội")
                .totalAmount(new BigDecimal("108000.00"))
                .discountAmount(BigDecimal.ZERO)
                .finalAmount(new BigDecimal("108000.00"))
                .paidAmount(new BigDecimal("110000.00"))
                .changeAmount(new BigDecimal("2000.00"))
                .paymentMethod("CASH")
                .paymentStatus("PAID")
                .orderStatus("COMPLETED")
                .isPrinted(true)
                .printedAt(LocalDateTime.now())
                .build());

        orderItemRepository.save(OrderItem.builder()
                .order(ord1)
                .product(p1)
                .productName(p1.getName())
                .unit(p1.getUnit())
                .quantity(new BigDecimal("2.000"))
                .unitPrice(new BigDecimal("35000.00"))
                .subtotal(new BigDecimal("70000.00"))
                .build());

        orderItemRepository.save(OrderItem.builder()
                .order(ord1)
                .product(p2)
                .productName(p2.getName())
                .unit(p2.getUnit())
                .quantity(new BigDecimal("1.000"))
                .unitPrice(new BigDecimal("38000.00"))
                .subtotal(new BigDecimal("38000.00"))
                .build());

        System.out.println("✅ [DataInitializer] Đã khởi tạo thành công tập dữ liệu mẫu (Mock Data) cho Database!");
    }
}
