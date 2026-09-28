package com.utc.backend.service.impl;

import com.utc.backend.dto.GoodsReceiptDetailRequestDto;
import com.utc.backend.dto.GoodsReceiptRequestDto;
import com.utc.backend.dto.GoodsReceiptResponseDto;
import com.utc.backend.entity.*;
import com.utc.backend.exception.BadRequestException;
import com.utc.backend.exception.ResourceNotFoundException;
import com.utc.backend.mapper.GoodsReceiptMapper;
import com.utc.backend.repository.*;
import com.utc.backend.service.GoodsReceiptService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GoodsReceiptServiceImpl implements GoodsReceiptService {

    private final GoodsReceiptRepository goodsReceiptRepository;
    private final GoodsReceiptDetailRepository goodsReceiptDetailRepository;
    private final SupplierRepository supplierRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final InventoryTransactionRepository inventoryTransactionRepository;
    private final GoodsReceiptMapper goodsReceiptMapper;

    @Override
    @Transactional
    public GoodsReceiptResponseDto createGoodsReceipt(GoodsReceiptRequestDto dto, Long createdByUserId) {
        if (goodsReceiptRepository.existsByReceiptCode(dto.receiptCode())) {
            throw new BadRequestException("Mã phiếu nhập kho '" + dto.receiptCode() + "' đã tồn tại");
        }

        Supplier supplier = supplierRepository.findById(dto.supplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhà cung cấp với ID: " + dto.supplierId()));

        User createdBy = userRepository.findById(createdByUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng tạo phiếu với ID: " + createdByUserId));

        GoodsReceipt goodsReceipt = GoodsReceipt.builder()
                .receiptCode(dto.receiptCode())
                .supplier(supplier)
                .createdBy(createdBy)
                .totalCost(BigDecimal.ZERO)
                .build();

        GoodsReceipt savedReceipt = goodsReceiptRepository.save(goodsReceipt);

        BigDecimal totalCost = BigDecimal.ZERO;
        List<GoodsReceiptDetail> details = new ArrayList<>();

        for (GoodsReceiptDetailRequestDto detailDto : dto.details()) {
            Product product = productRepository.findById(detailDto.productId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với ID: " + detailDto.productId()));

            BigDecimal lineTotal = detailDto.importPrice().multiply(detailDto.quantity());
            totalCost = totalCost.add(lineTotal);

            // Update Product stock & cost price
            BigDecimal oldStock = product.getStockQuantity() != null ? product.getStockQuantity() : BigDecimal.ZERO;
            BigDecimal newStock = oldStock.add(detailDto.quantity());
            product.setStockQuantity(newStock);
            product.setCostPrice(detailDto.importPrice());
            productRepository.save(product);

            // Create GoodsReceiptDetail record
            GoodsReceiptDetail detail = GoodsReceiptDetail.builder()
                    .receipt(savedReceipt)
                    .product(product)
                    .batchNumber(detailDto.batchNumber())
                    .expDate(detailDto.expDate())
                    .quantity(detailDto.quantity())
                    .importPrice(detailDto.importPrice())
                    .build();
            details.add(goodsReceiptDetailRepository.save(detail));

            // Log Inventory Transaction
            InventoryTransaction transaction = InventoryTransaction.builder()
                    .product(product)
                    .type("IMPORT")
                    .quantityDelta(detailDto.quantity())
                    .balanceAfter(newStock)
                    .referenceId(savedReceipt.getReceiptCode())
                    .build();
            inventoryTransactionRepository.save(transaction);
        }

        savedReceipt.setTotalCost(totalCost);
        GoodsReceipt updatedReceipt = goodsReceiptRepository.save(savedReceipt);

        return goodsReceiptMapper.toResponseDto(updatedReceipt, details);
    }

    @Override
    @Transactional(readOnly = true)
    public GoodsReceiptResponseDto getGoodsReceiptById(Long id) {
        GoodsReceipt receipt = goodsReceiptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phiếu nhập với ID: " + id));
        List<GoodsReceiptDetail> details = goodsReceiptDetailRepository.findByReceiptId(id);
        return goodsReceiptMapper.toResponseDto(receipt, details);
    }

    @Override
    @Transactional(readOnly = true)
    public GoodsReceiptResponseDto getGoodsReceiptByCode(String receiptCode) {
        GoodsReceipt receipt = goodsReceiptRepository.findByReceiptCode(receiptCode)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phiếu nhập với mã: " + receiptCode));
        List<GoodsReceiptDetail> details = goodsReceiptDetailRepository.findByReceiptId(receipt.getId());
        return goodsReceiptMapper.toResponseDto(receipt, details);
    }

    @Override
    @Transactional(readOnly = true)
    public List<GoodsReceiptResponseDto> getAllGoodsReceipts() {
        return goodsReceiptRepository.findAll().stream()
                .map(receipt -> {
                    List<GoodsReceiptDetail> details = goodsReceiptDetailRepository.findByReceiptId(receipt.getId());
                    return goodsReceiptMapper.toResponseDto(receipt, details);
                })
                .toList();
    }
}
