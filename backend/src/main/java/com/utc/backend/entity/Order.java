package com.utc.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_code", nullable = false, unique = true, length = 50)
    private String orderCode;

    @Column(name = "channel", nullable = false, length = 20)
    private String channel; // WEB hoặc POS

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cashier_id")
    private User cashier;

    @Column(name = "customer_name", nullable = false, length = 100)
    private String customerName;

    @Column(name = "customer_phone", length = 20)
    private String customerPhone;

    @Column(name = "shipping_address", length = 255)
    private String shippingAddress;

    @Column(name = "delivery_method", length = 30)
    private String deliveryMethod; // FAST_2H, SCHEDULED, TAKE_AWAY

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @Column(name = "total_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "shipping_fee", precision = 15, scale = 2)
    private BigDecimal shippingFee;

    @Column(name = "final_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal finalAmount;

    @Column(name = "payment_method", nullable = false, length = 30)
    private String paymentMethod; // CASH, VNPAY, MOMO, CARD

    @Column(name = "payment_status", length = 30)
    private String paymentStatus; // PENDING, PAID, FAILED, REFUNDED

    @Column(name = "order_status", nullable = false, length = 30)
    private String orderStatus; // PENDING, CONFIRMED, COMPLETED, CANCELLED

    @Column(name = "is_printed")
    private Boolean isPrinted;

    @Column(name = "printed_at")
    private LocalDateTime printedAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderVoucher> vouchers = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.channel == null) {
            this.channel = "WEB";
        }
        if (this.shippingFee == null) {
            this.shippingFee = BigDecimal.ZERO;
        }
        if (this.isPrinted == null) {
            this.isPrinted = false;
        }
        if (this.orderStatus == null) {
            this.orderStatus = "PENDING";
        }
        if (this.deliveryMethod == null) {
            this.deliveryMethod = "FAST_2H";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
