package com.utc.backend.mapper;

import com.utc.backend.dto.SupplierRequestDto;
import com.utc.backend.dto.SupplierResponseDto;
import com.utc.backend.entity.Supplier;
import org.springframework.stereotype.Component;

@Component
public class SupplierMapper {

    public Supplier toEntity(SupplierRequestDto dto) {
        if (dto == null) {
            return null;
        }
        return Supplier.builder()
                .name(dto.name())
                .phone(dto.phone())
                .address(dto.address())
                .isActive(dto.isActive() != null ? dto.isActive() : true)
                .build();
    }

    public void updateEntityFromDto(SupplierRequestDto dto, Supplier supplier) {
        if (dto == null || supplier == null) {
            return;
        }
        if (dto.name() != null) {
            supplier.setName(dto.name());
        }
        if (dto.phone() != null) {
            supplier.setPhone(dto.phone());
        }
        if (dto.address() != null) {
            supplier.setAddress(dto.address());
        }
        if (dto.isActive() != null) {
            supplier.setIsActive(dto.isActive());
        }
    }

    public SupplierResponseDto toResponseDto(Supplier supplier) {
        if (supplier == null) {
            return null;
        }
        return new SupplierResponseDto(
                supplier.getId(),
                supplier.getName(),
                supplier.getPhone(),
                supplier.getAddress(),
                supplier.getIsActive()
        );
    }
}
