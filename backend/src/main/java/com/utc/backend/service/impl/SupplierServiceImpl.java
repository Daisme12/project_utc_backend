package com.utc.backend.service.impl;

import com.utc.backend.dto.SupplierRequestDto;
import com.utc.backend.dto.SupplierResponseDto;
import com.utc.backend.entity.Supplier;
import com.utc.backend.exception.BadRequestException;
import com.utc.backend.exception.ResourceNotFoundException;
import com.utc.backend.mapper.SupplierMapper;
import com.utc.backend.repository.SupplierRepository;
import com.utc.backend.service.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;
    private final SupplierMapper supplierMapper;

    @Override
    @Transactional
    public SupplierResponseDto createSupplier(SupplierRequestDto dto) {
        if (supplierRepository.existsByName(dto.name())) {
            throw new BadRequestException("Tên nhà cung cấp '" + dto.name() + "' đã tồn tại");
        }
        Supplier supplier = supplierMapper.toEntity(dto);
        Supplier savedSupplier = supplierRepository.save(supplier);
        return supplierMapper.toResponseDto(savedSupplier);
    }

    @Override
    @Transactional
    public SupplierResponseDto updateSupplier(Long id, SupplierRequestDto dto) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhà cung cấp với ID: " + id));

        supplierMapper.updateEntityFromDto(dto, supplier);
        Supplier updatedSupplier = supplierRepository.save(supplier);
        return supplierMapper.toResponseDto(updatedSupplier);
    }

    @Override
    @Transactional(readOnly = true)
    public SupplierResponseDto getSupplierById(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhà cung cấp với ID: " + id));
        return supplierMapper.toResponseDto(supplier);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SupplierResponseDto> getAllActiveSuppliers() {
        return supplierRepository.findByIsActiveTrue().stream()
                .map(supplierMapper::toResponseDto)
                .toList();
    }

    @Override
    @Transactional
    public void deleteSupplier(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhà cung cấp với ID: " + id));
        supplier.setIsActive(false);
        supplierRepository.save(supplier);
    }
}
