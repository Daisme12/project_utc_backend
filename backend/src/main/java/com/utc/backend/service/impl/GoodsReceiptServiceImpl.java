package com.utc.backend.service.impl;

import com.utc.backend.dto.GoodsReceiptRequestDto;
import com.utc.backend.dto.GoodsReceiptResponseDto;
import com.utc.backend.entity.GoodsReceipt;
import com.utc.backend.entity.Product;
import com.utc.backend.entity.Supplier;
import com.utc.backend.entity.User;
import com.utc.backend.exception.BadRequestException;
import com.utc.backend.exception.ResourceNotFoundException;
import com.utc.backend.mapper.GoodsReceiptMapper;
import com.utc.backend.repository.GoodsReceiptRepository;
import com.utc.backend.repository.ProductRepository;
import com.utc.backend.repository.SupplierRepository;
import com.utc.backend.repository.UserRepository;
import com.utc.backend.service.GoodsReceiptService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GoodsReceiptServiceImpl implements GoodsReceiptService {

    private final GoodsReceiptRepository goodsReceiptRepository;
    private final SupplierRepository supplierRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final GoodsReceiptMapper goodsReceiptMapper;

    @Override
    @Transactional
    public GoodsReceiptResponseDto createGoodsReceipt(GoodsReceiptRequestDto dto, Long createdByUserId) {
        String code = dto.receiptCode();
        if (code == null || code.isBlank()) {
            code = "GR-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } else if (goodsReceiptRepository.existsByReceiptCode(code)) {
            throw new BadRequestException("Mã phiếu nhập kho '" + code + "' đã tồn tại");
        }

        Supplier supplier = supplierRepository.findById(dto.supplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhà cung cấp với ID: " + dto.supplierId()));

        User createdBy = userRepository.findById(createdByUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng tạo phiếu với ID: " + createdByUserId));

        Product product = productRepository.findById(dto.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với ID: " + dto.productId()));

        BigDecimal totalCost = dto.importPrice().multiply(dto.quantity());

        // Update product stock directly
        BigDecimal oldStock = product.getStockQuantity() != null ? product.getStockQuantity() : BigDecimal.ZERO;
        product.setStockQuantity(oldStock.add(dto.quantity()));
        productRepository.save(product);

        GoodsReceipt goodsReceipt = GoodsReceipt.builder()
                .receiptCode(code)
                .supplier(supplier)
                .createdBy(createdBy)
                .product(product)
                .batchNumber(dto.batchNumber())
                .expDate(dto.expDate())
                .quantity(dto.quantity())
                .importPrice(dto.importPrice())
                .totalCost(totalCost)
                .note(dto.note())
                .build();

        GoodsReceipt savedReceipt = goodsReceiptRepository.save(goodsReceipt);
        return goodsReceiptMapper.toResponseDto(savedReceipt);
    }

    @Override
    @Transactional(readOnly = true)
    public GoodsReceiptResponseDto getGoodsReceiptById(Long id) {
        GoodsReceipt receipt = goodsReceiptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phiếu nhập với ID: " + id));
        return goodsReceiptMapper.toResponseDto(receipt);
    }

    @Override
    @Transactional(readOnly = true)
    public GoodsReceiptResponseDto getGoodsReceiptByCode(String receiptCode) {
        GoodsReceipt receipt = goodsReceiptRepository.findByReceiptCode(receiptCode)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phiếu nhập với mã: " + receiptCode));
        return goodsReceiptMapper.toResponseDto(receipt);
    }

    @Override
    @Transactional(readOnly = true)
    public List<GoodsReceiptResponseDto> getAllGoodsReceipts() {
        return goodsReceiptRepository.findAll().stream()
                .map(goodsReceiptMapper::toResponseDto)
                .toList();
    }
}
