package com.utc.backend.repository;

import com.utc.backend.entity.GoodsReceiptDetail;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoodsReceiptDetailRepository extends JpaRepository<GoodsReceiptDetail, Long> {

    @EntityGraph(attributePaths = {"product"})
    List<GoodsReceiptDetail> findByReceiptId(Long receiptId);

    @EntityGraph(attributePaths = {"receipt", "product"})
    List<GoodsReceiptDetail> findByProductId(Long productId);
}
