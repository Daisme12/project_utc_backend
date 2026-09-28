package com.utc.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 2. Khóa ngoại role_id (bigint NN) trỏ đến bảng Role
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @Column(name = "username", nullable = false, unique = true, length = 50)
    private String username;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    // 6. phone (varchar(15), Unique)
    @Column(name = "phone", unique = true, length = 15)
    private String phone;

    // 7. email (varchar(100), Unique)
    @Column(name = "email", unique = true, length = 100)
    private String email;

    // 8. is_active (boolean)
    @Column(name = "is_active")
    private Boolean isActive;

    // 9. created_at (timestamp)
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Tự động gán thời gian tạo khi thêm mới record
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.isActive == null) {
            this.isActive = true; // Mặc định kích hoạt tài khoản
        }
    }
}
