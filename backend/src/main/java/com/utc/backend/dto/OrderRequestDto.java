package com.utc.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public record OrderRequestDto(
    String orderCode,

    String channel, // WEB hoặc POS

    Long userId,

    Long cashierId,

    @NotBlank(message = "Tên khách hàng không được để trống")
    @Size(max = 100, message = "Tên khách hàng không quá 100 ký tự")
    String customerName,

    String customerPhone,

    String shippingAddress,

    String deliveryMethod, // FAST_2H, SCHEDULED, TAKE_AWAY

    String note,

    @NotNull(message = "Tổng tiền hàng không được để trống")
    BigDecimal totalAmount,

    BigDecimal shippingFee,

    @NotNull(message = "Số tiền thực tế thanh toán không được để trống")
    BigDecimal finalAmount,

    @NotBlank(message = "Phương thức thanh toán không được để trống")
    String paymentMethod, // CASH, VNPAY, MOMO, CARD

    String orderStatus,

    Boolean isPrinted,

    @NotEmpty(message = "Danh sách sản phẩm không được để trống")
    @Valid
    List<OrderItemRequestDto> items,

    List<String> voucherCodes
) {}
