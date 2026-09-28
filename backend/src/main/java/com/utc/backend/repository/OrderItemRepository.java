package com.utc.backend.repository;

import com.utc.backend.entity.OrderItem;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @EntityGraph(attributePaths = {"product"})
    List<OrderItem> findByOrderId(Long orderId);

    @EntityGraph(attributePaths = {"order", "product"})
    List<OrderItem> findByProductId(Long productId);
}
