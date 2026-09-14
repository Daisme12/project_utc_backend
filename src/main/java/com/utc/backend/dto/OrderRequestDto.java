package com.utc.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public record OrderRequestDto(
    @NotBlank(message = "Mã đơn hàng không được để trống")
    @Size(max = 30, message = "Mã đơn hàng tối đa 30 ký tự")
    String orderCode,

    @Size(max = 20, message = "Kênh bán hàng tối đa 20 ký tự")
    String channel,

    Long userId,
    Long cashierId,

    @Size(max = 100, message = "Tên khách hàng tối đa 100 ký tự")
    String customerName,

    @Size(max = 15, message = "Số điện thoại khách hàng tối đa 15 ký tự")
    String customerPhone,

    @Size(max = 255, message = "Địa chỉ giao hàng tối đa 255 ký tự")
    String shippingAddress,

    @NotNull(message = "Tổng tiền không được để trống")
    @PositiveOrZero(message = "Tổng tiền phải lớn hơn hoặc bằng 0")
    BigDecimal totalAmount,

    @PositiveOrZero(message = "Tiền giảm giá phải lớn hơn hoặc bằng 0")
    BigDecimal discountAmount,

    @NotNull(message = "Số tiền thanh toán cuối cùng không được để trống")
    @PositiveOrZero(message = "Thành tiền phải lớn hơn hoặc bằng 0")
    BigDecimal finalAmount,

    @PositiveOrZero(message = "Số tiền khách trả phải lớn hơn hoặc bằng 0")
    BigDecimal paidAmount,

    @PositiveOrZero(message = "Tiền thừa trả khách phải lớn hơn hoặc bằng 0")
    BigDecimal changeAmount,

    @Size(max = 30, message = "Phương thức thanh toán tối đa 30 ký tự")
    String paymentMethod,

    @Size(max = 30, message = "Trạng thái thanh toán tối đa 30 ký tự")
    String paymentStatus,

    @Size(max = 30, message = "Trạng thái đơn hàng tối đa 30 ký tự")
    String orderStatus,

    @NotEmpty(message = "Đơn hàng phải có ít nhất 1 sản phẩm")
    @Valid
    List<OrderItemRequestDto> items
) {}
