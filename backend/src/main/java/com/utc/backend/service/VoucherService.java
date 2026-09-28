package com.utc.backend.service;

import com.utc.backend.dto.VoucherRequestDto;
import com.utc.backend.dto.VoucherResponseDto;

import java.util.List;

public interface VoucherService {
    VoucherResponseDto createVoucher(VoucherRequestDto dto);
    VoucherResponseDto getVoucherByCode(String code);
    List<VoucherResponseDto> getAllActiveVouchers();
    void deleteVoucher(Long id);
}
