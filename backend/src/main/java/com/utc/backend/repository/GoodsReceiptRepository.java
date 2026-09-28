package com.utc.backend.repository;

import com.utc.backend.entity.GoodsReceipt;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GoodsReceiptRepository extends JpaRepository<GoodsReceipt, Long> {

    @EntityGraph(attributePaths = {"supplier", "createdBy"})
    Optional<GoodsReceipt> findByReceiptCode(String receiptCode);

    boolean existsByReceiptCode(String receiptCode);

    @EntityGraph(attributePaths = {"supplier", "createdBy"})
    List<GoodsReceipt> findBySupplierId(Long supplierId);
}
