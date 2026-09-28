package com.utc.backend.repository;

import com.utc.backend.entity.Product;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @EntityGraph(attributePaths = {"category"})
    Optional<Product> findBySku(String sku);

    @EntityGraph(attributePaths = {"category"})
    Optional<Product> findBySlug(String slug);

    boolean existsBySku(String sku);
    boolean existsBySlug(String slug);

    @EntityGraph(attributePaths = {"category"})
    List<Product> findByCategoryId(Long categoryId);

    @EntityGraph(attributePaths = {"category"})
    List<Product> findByCategory_Slug(String categorySlug);

    @EntityGraph(attributePaths = {"category"})
    List<Product> findByIsActiveTrue();

    @EntityGraph(attributePaths = {"category"})
    List<Product> findByNameContainingIgnoreCase(String keyword);
}
