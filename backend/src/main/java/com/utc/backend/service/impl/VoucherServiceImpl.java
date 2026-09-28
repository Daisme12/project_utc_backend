package com.utc.backend.service.impl;

import com.utc.backend.dto.VoucherRequestDto;
import com.utc.backend.dto.VoucherResponseDto;
import com.utc.backend.entity.Voucher;
import com.utc.backend.exception.BadRequestException;
import com.utc.backend.exception.ResourceNotFoundException;
import com.utc.backend.mapper.VoucherMapper;
import com.utc.backend.repository.VoucherRepository;
import com.utc.backend.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VoucherServiceImpl implements VoucherService {

    private final VoucherRepository voucherRepository;
    private final VoucherMapper voucherMapper;

    @Override
    @Transactional
    public VoucherResponseDto createVoucher(VoucherRequestDto dto) {
        if (voucherRepository.existsByCode(dto.code().toUpperCase())) {
            throw new BadRequestException("Mã voucher '" + dto.code() + "' đã tồn tại");
        }
        Voucher voucher = voucherMapper.toEntity(dto);
        Voucher saved = voucherRepository.save(voucher);
        return voucherMapper.toResponseDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public VoucherResponseDto getVoucherByCode(String code) {
        Voucher voucher = voucherRepository.findByCodeAndIsActiveTrue(code.toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Mã voucher '" + code + "' không tồn tại hoặc đã hết hạn"));
        return voucherMapper.toResponseDto(voucher);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VoucherResponseDto> getAllActiveVouchers() {
        return voucherRepository.findAll().stream()
                .filter(v -> Boolean.TRUE.equals(v.getIsActive()))
                .map(voucherMapper::toResponseDto)
                .toList();
    }

    @Override
    @Transactional
    public void deleteVoucher(Long id) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy voucher với ID: " + id));
        voucher.setIsActive(false);
        voucherRepository.save(voucher);
    }
}
