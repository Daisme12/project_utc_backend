package com.utc.backend.repository;

import com.utc.backend.entity.Order;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    @EntityGraph(attributePaths = {"user", "cashier"})
    Optional<Order> findByOrderCode(String orderCode);

    boolean existsByOrderCode(String orderCode);

    @EntityGraph(attributePaths = {"user", "cashier"})
    List<Order> findByUserId(Long userId);

    @EntityGraph(attributePaths = {"user", "cashier"})
    List<Order> findByCashierId(Long cashierId);

    @EntityGraph(attributePaths = {"user", "cashier"})
    List<Order> findByOrderStatus(String orderStatus);
}
