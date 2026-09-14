package com.utc.backend.service.impl;

import com.utc.backend.common.VnPayUtil;
import com.utc.backend.config.VnPayConfig;
import com.utc.backend.dto.VnPayPaymentResponseDto;
import com.utc.backend.entity.Order;
import com.utc.backend.exception.BadRequestException;
import com.utc.backend.exception.ResourceNotFoundException;
import com.utc.backend.repository.OrderRepository;
import com.utc.backend.service.VnPayService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@RequiredArgsConstructor
public class VnPayServiceImpl implements VnPayService {

    private final VnPayConfig vnPayConfig;
    private final OrderRepository orderRepository;

    @Override
    @Transactional(readOnly = true)
    public VnPayPaymentResponseDto createPaymentUrl(Long orderId, HttpServletRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với ID: " + orderId));

        if (order.getFinalAmount() == null || order.getFinalAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Số tiền đơn hàng không hợp lệ để thanh toán VNPAY");
        }

        // Amount in VNPAY is multiplied by 100
        long amount = order.getFinalAmount().multiply(new BigDecimal(100)).longValue();

        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", "2.1.0");
        vnpParams.put("vnp_Command", "pay");
        vnpParams.put("vnp_TmnCode", vnPayConfig.getTmnCode());
        vnpParams.put("vnp_Amount", String.valueOf(amount));
        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_TxnRef", order.getOrderCode());
        vnpParams.put("vnp_OrderInfo", "Thanh toan don hang:" + order.getOrderCode());
        vnpParams.put("vnp_OrderType", "other");
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
        vnpParams.put("vnp_IpAddr", VnPayUtil.getIpAddress(request));

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnpCreateDate = formatter.format(cld.getTime());
        vnpParams.put("vnp_CreateDate", vnpCreateDate);

        cld.add(Calendar.MINUTE, 15); // Expiry time: 15 minutes
        String vnpExpireDate = formatter.format(cld.getTime());
        vnpParams.put("vnp_ExpireDate", vnpExpireDate);

        // Build query string and hash
        String hashData = VnPayUtil.getPaymentURL(vnpParams, false);
        String vnpSecureHash = VnPayUtil.hmacSHA512(vnPayConfig.getHashSecret(), hashData);
        String queryUrl = VnPayUtil.getPaymentURL(vnpParams, true) + "&vnp_SecureHash=" + vnpSecureHash;
        String paymentUrl = vnPayConfig.getPayUrl() + "?" + queryUrl;

        return new VnPayPaymentResponseDto(paymentUrl, order.getOrderCode(), "Tạo URL thanh toán VNPAY thành công");
    }

    @Override
    @Transactional
    public boolean processCallback(HttpServletRequest request) {
        Map<String, String> fields = new HashMap<>();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements(); ) {
            String fieldName = params.nextElement();
            String fieldValue = request.getParameter(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                fields.put(fieldName, fieldValue);
            }
        }

        String vnpSecureHash = request.getParameter("vnp_SecureHash");
        fields.remove("vnp_SecureHashType");
        fields.remove("vnp_SecureHash");

        String signValue = VnPayUtil.hmacSHA512(vnPayConfig.getHashSecret(), VnPayUtil.getPaymentURL(fields, false));

        if (signValue.equalsIgnoreCase(vnpSecureHash)) {
            String responseCode = request.getParameter("vnp_ResponseCode");
            String orderCode = request.getParameter("vnp_TxnRef");

            Optional<Order> orderOptional = orderRepository.findByOrderCode(orderCode);
            if (orderOptional.isPresent()) {
                Order order = orderOptional.get();
                if ("00".equals(responseCode)) {
                    order.setPaymentStatus("PAID");
                    order.setOrderStatus("COMPLETED");
                    order.setPaymentMethod("VNPAY");
                } else {
                    order.setPaymentStatus("FAILED");
                    order.setOrderStatus("CANCELLED");
                }
                orderRepository.save(order);
                return "00".equals(responseCode);
            }
        }
        return false;
    }
}
