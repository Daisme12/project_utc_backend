package com.utc.backend.repository;

import com.utc.backend.entity.OrderVoucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderVoucherRepository extends JpaRepository<OrderVoucher, Long> {
    List<OrderVoucher> findByOrderId(Long orderId);
}
