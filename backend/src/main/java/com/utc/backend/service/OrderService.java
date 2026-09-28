package com.utc.backend.service;

import com.utc.backend.dto.OrderRequestDto;
import com.utc.backend.dto.OrderResponseDto;

import java.util.List;

public interface OrderService {
    OrderResponseDto createOrder(OrderRequestDto dto);
    OrderResponseDto getOrderById(Long id);
    OrderResponseDto getOrderByCode(String orderCode);
    List<OrderResponseDto> getOrdersByUserId(Long userId);
    List<OrderResponseDto> getAllOrders();
    OrderResponseDto updateOrderStatus(Long id, String status);
    void markAsPrinted(Long id);
}
