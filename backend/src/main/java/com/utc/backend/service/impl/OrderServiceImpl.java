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
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final InventoryTransactionRepository inventoryTransactionRepository;
    private final OrderMapper orderMapper;

    @Override
    @Transactional
    public OrderResponseDto createOrder(OrderRequestDto dto) {
        if (orderRepository.existsByOrderCode(dto.orderCode())) {
            throw new BadRequestException("Mã đơn hàng '" + dto.orderCode() + "' đã tồn tại");
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
                .orderCode(dto.orderCode())
                .channel(dto.channel() != null ? dto.channel() : "STORE")
                .user(user)
                .cashier(cashier)
                .customerName(dto.customerName())
                .customerPhone(dto.customerPhone())
                .shippingAddress(dto.shippingAddress())
                .totalAmount(dto.totalAmount())
                .discountAmount(dto.discountAmount() != null ? dto.discountAmount() : BigDecimal.ZERO)
                .finalAmount(dto.finalAmount())
                .paidAmount(dto.paidAmount())
                .changeAmount(dto.changeAmount())
                .paymentMethod(dto.paymentMethod() != null ? dto.paymentMethod() : "CASH")
                .paymentStatus(dto.paymentStatus() != null ? dto.paymentStatus() : "PAID")
                .orderStatus(dto.orderStatus() != null ? dto.orderStatus() : "COMPLETED")
                .isPrinted(false)
                .build();

        Order savedOrder = orderRepository.save(order);
        List<OrderItem> items = new ArrayList<>();

        for (OrderItemRequestDto itemDto : dto.items()) {
            Product product = productRepository.findById(itemDto.productId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với ID: " + itemDto.productId()));

            // Check stock quantity
            BigDecimal currentStock = product.getStockQuantity() != null ? product.getStockQuantity() : BigDecimal.ZERO;
            if (currentStock.compareTo(itemDto.quantity()) < 0) {
                throw new BadRequestException("Sản phẩm '" + product.getName() + "' không đủ tồn kho (Tồn kho hiện tại: " + currentStock + ")");
            }

            // Deduct stock
            BigDecimal newStock = currentStock.subtract(itemDto.quantity());
            product.setStockQuantity(newStock);
            productRepository.save(product);

            // Calculate subtotal
            BigDecimal subtotal = itemDto.unitPrice().multiply(itemDto.quantity());

            OrderItem orderItem = OrderItem.builder()
                    .order(savedOrder)
                    .product(product)
                    .productName(itemDto.productName())
                    .unit(itemDto.unit())
                    .quantity(itemDto.quantity())
                    .unitPrice(itemDto.unitPrice())
                    .subtotal(subtotal)
                    .build();

            items.add(orderItemRepository.save(orderItem));

            // Log Inventory Transaction
            InventoryTransaction transaction = InventoryTransaction.builder()
                    .product(product)
                    .type("EXPORT")
                    .quantityDelta(itemDto.quantity().negate())
                    .balanceAfter(newStock)
                    .referenceId(savedOrder.getOrderCode())
                    .build();
            inventoryTransactionRepository.save(transaction);
        }

        return orderMapper.toResponseDto(savedOrder, items);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponseDto getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với ID: " + id));
        List<OrderItem> items = orderItemRepository.findByOrderId(id);
        return orderMapper.toResponseDto(order, items);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponseDto getOrderByCode(String orderCode) {
        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với mã: " + orderCode));
        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
        return orderMapper.toResponseDto(order, items);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponseDto> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId).stream()
                .map(order -> {
                    List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
                    return orderMapper.toResponseDto(order, items);
                })
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponseDto> getOrdersByStatus(String status) {
        return orderRepository.findByOrderStatus(status).stream()
                .map(order -> {
                    List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
                    return orderMapper.toResponseDto(order, items);
                })
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponseDto> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(order -> {
                    List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
                    return orderMapper.toResponseDto(order, items);
                })
                .toList();
    }

    @Override
    @Transactional
    public OrderResponseDto updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với ID: " + id));
        order.setOrderStatus(status);
        Order updatedOrder = orderRepository.save(order);
        List<OrderItem> items = orderItemRepository.findByOrderId(id);
        return orderMapper.toResponseDto(updatedOrder, items);
    }
}
