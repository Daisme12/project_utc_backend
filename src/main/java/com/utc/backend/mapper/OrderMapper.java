package com.utc.backend.mapper;

import com.utc.backend.dto.OrderItemResponseDto;
import com.utc.backend.dto.OrderResponseDto;
import com.utc.backend.entity.Order;
import com.utc.backend.entity.OrderItem;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
public class OrderMapper {

    private final UserMapper userMapper;
    private final ProductMapper productMapper;

    public OrderItemResponseDto toItemResponseDto(OrderItem item) {
        if (item == null) {
            return null;
        }
        return new OrderItemResponseDto(
                item.getId(),
                productMapper.toResponseDto(item.getProduct()),
                item.getProductName(),
                item.getUnit(),
                item.getQuantity(),
                item.getUnitPrice(),
                item.getSubtotal()
        );
    }

    public OrderResponseDto toResponseDto(Order order, List<OrderItem> items) {
        if (order == null) {
            return null;
        }
        List<OrderItemResponseDto> itemDtos = items != null ?
                items.stream().map(this::toItemResponseDto).toList() : Collections.emptyList();

        return new OrderResponseDto(
                order.getId(),
                order.getOrderCode(),
                order.getChannel(),
                userMapper.toResponseDto(order.getUser()),
                userMapper.toResponseDto(order.getCashier()),
                order.getCustomerName(),
                order.getCustomerPhone(),
                order.getShippingAddress(),
                order.getTotalAmount(),
                order.getDiscountAmount(),
                order.getFinalAmount(),
                order.getPaidAmount(),
                order.getChangeAmount(),
                order.getPaymentMethod(),
                order.getPaymentStatus(),
                order.getOrderStatus(),
                order.getIsPrinted(),
                order.getPrintedAt(),
                order.getCreatedAt(),
                itemDtos
        );
    }
}
