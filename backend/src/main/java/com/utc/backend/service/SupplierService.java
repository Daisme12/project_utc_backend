package com.utc.backend.service;

import com.utc.backend.dto.SupplierRequestDto;
import com.utc.backend.dto.SupplierResponseDto;

import java.util.List;

public interface SupplierService {
    SupplierResponseDto createSupplier(SupplierRequestDto dto);
    SupplierResponseDto updateSupplier(Long id, SupplierRequestDto dto);
    SupplierResponseDto getSupplierById(Long id);
    List<SupplierResponseDto> getAllActiveSuppliers();
    void deleteSupplier(Long id);
}
