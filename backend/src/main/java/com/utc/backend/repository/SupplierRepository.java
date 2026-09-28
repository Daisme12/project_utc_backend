package com.utc.backend.repository;

import com.utc.backend.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    boolean existsByName(String name);
    List<Supplier> findByIsActiveTrue();
}
