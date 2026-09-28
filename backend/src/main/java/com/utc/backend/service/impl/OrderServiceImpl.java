package com.utc.backend.service.impl;

import com.utc.backend.dto.OrderItemRequestDto;
import com.utc.backend.dto.OrderRequestDto;
import com.utc.backend.dto.OrderResponseDto;
import com.utc.backend.entity.*;
import com.utc.backend.exception.BadRequestException;
import com.utc.backend.exception.ResourceNotFoundException;
import com.utc.backend.mapper.OrderMapper;
import com.utc.backend.repository.*;
import com.utc.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderVoucherRepository orderVoucherRepository;
    private final VoucherRepository voucherRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderMapper orderMapper;

    @Override
    @Transactional
    public OrderResponseDto createOrder(OrderRequestDto dto) {
        String code = dto.orderCode();
        if (code == null || code.isBlank()) {
            code = "UBO-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } else if (orderRepository.existsByOrderCode(code)) {
            throw new BadRequestException("Mã đơn hàng '" + code + "' đã tồn tại");
        }

        User user = null;
        if (dto.userId() != null) {
            user = userRepository.findById(dto.userId()).orElse(null);
        }

        User cashier = null;
        if (dto.cashierId() != null) {
            cashier = userRepository.findById(dto.cashierId()).orElse(null);
        }

        Order order = Order.builder()
                .orderCode(code)
                .channel(dto.channel() != null ? dto.channel().toUpperCase() : "WEB")
                .user(user)
                .cashier(cashier)
                .customerName(dto.customerName())
                .customerPhone(dto.customerPhone())
                .shippingAddress(dto.shippingAddress() != null ? dto.shippingAddress() : "Tại quầy")
                .deliveryMethod(dto.deliveryMethod() != null ? dto.deliveryMethod() : "FAST_2H")
                .note(dto.note())
                .totalAmount(dto.totalAmount())
                .shippingFee(dto.shippingFee() != null ? dto.shippingFee() : BigDecimal.ZERO)
                .finalAmount(dto.finalAmount())
                .paymentMethod(dto.paymentMethod() != null ? dto.paymentMethod() : "COD")
                .orderStatus(dto.orderStatus() != null ? dto.orderStatus() : "PENDING")
                .isPrinted(dto.isPrinted() != null ? dto.isPrinted() : false)
                .printedAt(Boolean.TRUE.equals(dto.isPrinted()) ? LocalDateTime.now() : null)
                .build();

        Order savedOrder = orderRepository.save(order);

        // Process Items & deduct stock
        List<OrderItem> items = new ArrayList<>();
        for (OrderItemRequestDto itemDto : dto.items()) {
            Product product = productRepository.findById(itemDto.productId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với ID: " + itemDto.productId()));

            BigDecimal currentStock = product.getStockQuantity() != null ? product.getStockQuantity() : BigDecimal.ZERO;
            if (currentStock.compareTo(itemDto.quantity()) < 0) {
                throw new BadRequestException("Sản phẩm '" + product.getName() + "' không đủ tồn kho (Tồn kho hiện tại: " + currentStock + ")");
            }

            // Deduct stock directly
            product.setStockQuantity(currentStock.subtract(itemDto.quantity()));
            productRepository.save(product);

            BigDecimal subtotal = itemDto.unitPrice().multiply(itemDto.quantity());

            OrderItem orderItem = OrderItem.builder()
                    .order(savedOrder)
                    .product(product)
                    .productName(itemDto.productName())
                    .packWeight(itemDto.packWeight())
                    .unit(itemDto.unit())
                    .quantity(itemDto.quantity())
                    .unitPrice(itemDto.unitPrice())
                    .subtotal(subtotal)
                    .imageUrl(itemDto.imageUrl())
                    .build();

            items.add(orderItemRepository.save(orderItem));
        }
        savedOrder.setItems(items);

        // Process Applied Vouchers
        List<OrderVoucher> vouchers = new ArrayList<>();
        if (dto.voucherCodes() != null && !dto.voucherCodes().isEmpty()) {
            for (String vCode : dto.voucherCodes()) {
                if (vCode == null || vCode.isBlank()) continue;
                Voucher voucher = voucherRepository.findByCode(vCode.trim().toUpperCase()).orElse(null);
                BigDecimal discount = BigDecimal.ZERO;
                if (voucher != null) {
                    if ("PERCENT".equalsIgnoreCase(voucher.getDiscountType())) {
                        discount = savedOrder.getTotalAmount().multiply(voucher.getDiscountValue()).divide(BigDecimal.valueOf(100));
                    } else {
                        discount = voucher.getDiscountValue();
                    }
                }

                OrderVoucher orderVoucher = OrderVoucher.builder()
                        .order(savedOrder)
                        .voucher(voucher)
                        .voucherCode(vCode.trim().toUpperCase())
                        .discountAmount(discount)
                        .appliedAt(LocalDateTime.now())
                        .build();

                vouchers.add(orderVoucherRepository.save(orderVoucher));
            }
        }
        savedOrder.setVouchers(vouchers);

        return orderMapper.toResponseDto(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponseDto getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với ID: " + id));
        return orderMapper.toResponseDto(order);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponseDto getOrderByCode(String orderCode) {
        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với mã: " + orderCode));
        return orderMapper.toResponseDto(order);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponseDto> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId).stream()
                .map(orderMapper::toResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponseDto> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(orderMapper::toResponseDto)
                .toList();
    }

    @Override
    @Transactional
    public OrderResponseDto updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với ID: " + id));
        order.setOrderStatus(status.toUpperCase());
        Order updated = orderRepository.save(order);
        return orderMapper.toResponseDto(updated);
    }

    @Override
    @Transactional
    public void markAsPrinted(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với ID: " + id));
        order.setIsPrinted(true);
        order.setPrintedAt(LocalDateTime.now());
        orderRepository.save(order);
    }
}
