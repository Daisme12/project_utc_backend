package com.utc.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "sku", nullable = false, unique = true, length = 50)
    private String sku;

    @Column(name = "slug", nullable = false, unique = true, length = 200)
    private String slug;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "brand", length = 100)
    private String brand;

    @Column(name = "origin", length = 150)
    private String origin;

    @Column(name = "standard", length = 50)
    private String standard; // vietgap, organic, euchill, oxyfresh

    @Column(name = "unit", nullable = false, length = 30)
    private String unit; // Khay, Hộp, Túi, Kg

    @Column(name = "pack_weight", length = 50)
    private String packWeight; // Khay 300g, Khay 500g, Khay 1kg

    @Column(name = "price", nullable = false, precision = 15, scale = 2)
    private BigDecimal price;

    @Column(name = "original_price", precision = 15, scale = 2)
    private BigDecimal originalPrice;

    @Column(name = "stock_quantity", nullable = false, precision = 12, scale = 3)
    private BigDecimal stockQuantity;

    @Column(name = "is_weighing")
    private Boolean isWeighing;

    @Column(name = "rating", precision = 3, scale = 1)
    private BigDecimal rating;

    @Column(name = "review_count")
    private Integer reviewCount;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "is_featured")
    private Boolean isFeatured;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.isActive == null) {
            this.isActive = true;
        }
        if (this.isWeighing == null) {
            this.isWeighing = false;
        }
        if (this.stockQuantity == null) {
            this.stockQuantity = BigDecimal.ZERO;
        }
        if (this.rating == null) {
            this.rating = BigDecimal.valueOf(5.0);
        }
        if (this.reviewCount == null) {
            this.reviewCount = 0;
        }
        if (this.isFeatured == null) {
            this.isFeatured = false;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
