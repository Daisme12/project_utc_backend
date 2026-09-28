package com.utc.backend.repository;

import com.utc.backend.entity.InventoryTransaction;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long> {

    @EntityGraph(attributePaths = {"product"})
    List<InventoryTransaction> findByProductIdOrderByCreatedAtDesc(Long productId);

    @EntityGraph(attributePaths = {"product"})
    List<InventoryTransaction> findByType(String type);
}
