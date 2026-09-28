package com.utc.backend.mapper;

import com.utc.backend.dto.VoucherRequestDto;
import com.utc.backend.dto.VoucherResponseDto;
import com.utc.backend.entity.Voucher;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class VoucherMapper {

    public Voucher toEntity(VoucherRequestDto dto) {
        if (dto == null) {
            return null;
        }
        return Voucher.builder()
                .code(dto.code().toUpperCase())
                .badge(dto.badge())
                .title(dto.title())
                .discountType(dto.discountType().toUpperCase())
                .discountValue(dto.discountValue())
                .minOrderAmount(dto.minOrderAmount() != null ? dto.minOrderAmount() : BigDecimal.ZERO)
                .startDate(dto.startDate())
                .endDate(dto.endDate())
                .isActive(dto.isActive() != null ? dto.isActive() : true)
                .build();
    }

    public VoucherResponseDto toResponseDto(Voucher voucher) {
        if (voucher == null) {
            return null;
        }
        return new VoucherResponseDto(
                voucher.getId(),
                voucher.getCode(),
                voucher.getBadge(),
                voucher.getTitle(),
                voucher.getDiscountType(),
                voucher.getDiscountValue(),
                voucher.getMinOrderAmount(),
                voucher.getStartDate(),
                voucher.getEndDate(),
                voucher.getIsActive(),
                voucher.getCreatedAt()
        );
    }
}
