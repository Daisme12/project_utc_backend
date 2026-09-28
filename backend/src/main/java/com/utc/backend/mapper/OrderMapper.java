package com.utc.backend.mapper;

import com.utc.backend.dto.OrderItemResponseDto;
import com.utc.backend.dto.OrderResponseDto;
import com.utc.backend.dto.OrderVoucherResponseDto;
import com.utc.backend.entity.Order;
import com.utc.backend.entity.OrderItem;
import com.utc.backend.entity.OrderVoucher;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
public class OrderMapper {

    private final UserMapper userMapper;

    public OrderItemResponseDto toItemResponseDto(OrderItem item) {
        if (item == null) {
            return null;
        }
        return new OrderItemResponseDto(
                item.getId(),
                item.getProduct() != null ? item.getProduct().getId() : null,
                item.getProductName(),
                item.getPackWeight(),
                item.getUnit(),
                item.getQuantity(),
                item.getUnitPrice(),
                item.getSubtotal(),
                item.getImageUrl()
        );
    }

    public OrderVoucherResponseDto toVoucherResponseDto(OrderVoucher orderVoucher) {
        if (orderVoucher == null) {
            return null;
        }
        return new OrderVoucherResponseDto(
                orderVoucher.getId(),
                orderVoucher.getVoucher() != null ? orderVoucher.getVoucher().getId() : null,
                orderVoucher.getVoucherCode(),
                orderVoucher.getDiscountAmount(),
                orderVoucher.getAppliedAt()
        );
    }

    public OrderResponseDto toResponseDto(Order order) {
        if (order == null) {
            return null;
        }
        List<OrderItemResponseDto> itemDtos = order.getItems() != null ?
                order.getItems().stream().map(this::toItemResponseDto).toList() : Collections.emptyList();

        List<OrderVoucherResponseDto> voucherDtos = order.getVouchers() != null ?
                order.getVouchers().stream().map(this::toVoucherResponseDto).toList() : Collections.emptyList();

        return new OrderResponseDto(
                order.getId(),
                order.getOrderCode(),
                order.getChannel(),
                userMapper.toResponseDto(order.getUser()),
                userMapper.toResponseDto(order.getCashier()),
                order.getCustomerName(),
                order.getCustomerPhone(),
                order.getShippingAddress(),
                order.getDeliveryMethod(),
                order.getNote(),
                order.getTotalAmount(),
                order.getShippingFee(),
                order.getFinalAmount(),
                order.getPaymentMethod(),
                order.getOrderStatus(),
                order.getIsPrinted(),
                order.getPrintedAt(),
                order.getCreatedAt(),
                itemDtos,
                voucherDtos
        );
    }
}
