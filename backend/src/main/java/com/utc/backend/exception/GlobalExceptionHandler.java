package com.utc.backend.exception;

import com.utc.backend.common.ApiResponse;
import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. Lỗi 404 Not Found - Không tìm thấy dữ liệu
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotFound(ResourceNotFoundException ex) {
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status(HttpStatus.NOT_FOUND.value())
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    // 2. Lỗi 400 Bad Request - Yêu cầu không hợp lệ / Trùng dữ liệu
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadRequest(BadRequestException ex) {
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    // 3. Lỗi 401 Unauthorized - Chưa xác thực JWT / Đăng nhập sai
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse<Void>> handleUnauthorized(UnauthorizedException ex) {
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status(HttpStatus.UNAUTHORIZED.value())
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    // 4. Lỗi 403 Forbidden - Không có quyền truy cập
    @ExceptionHandler({ForbiddenException.class, AccessDeniedException.class})
    public ResponseEntity<ApiResponse<Void>> handleForbidden(Exception ex) {
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status(HttpStatus.FORBIDDEN.value())
                .message("Bạn không có quyền thực hiện thao tác này")
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

    // 5. Lỗi 400 Validation DTO - Nhập dữ liệu sai định dạng
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );

        ApiResponse<Map<String, String>> response = ApiResponse.<Map<String, String>>builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message("Dữ liệu đầu vào không hợp lệ")
                .data(errors)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.badRequest().body(response);
    }

    // 6. Lỗi 400 Param Validation - Nhập sai tham số trên URL
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleConstraintViolation(ConstraintViolationException ex) {
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.badRequest().body(response);
    }

    // 7. Lỗi 400 Type Mismatch - Nhập sai kiểu dữ liệu (VD: nhập chữ vào ID số)
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResponse<Void>> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        String message = String.format("Tham số '%s' có giá trị '%s' không đúng kiểu dữ liệu yêu cầu", ex.getName(), ex.getValue());
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.badRequest().body(response);
    }

    // 8. Lỗi 405 Method Not Allowed - Gọi sai phương thức HTTP (VD: Gọi GET vào API POST)
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiResponse<Void>> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex) {
        String message = String.format("Phương thức HTTP '%s' không được hỗ trợ cho đường dẫn này", ex.getMethod());
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status(HttpStatus.METHOD_NOT_ALLOWED.value())
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(response);
    }

    // 9. Lỗi 400 Over File Size Limit - Tải file vượt quá 50MB
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ApiResponse<Void>> handleMaxUploadSize(MaxUploadSizeExceededException ex) {
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message("Kích thước file vượt quá giới hạn tối đa cho phép (50MB)")
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.badRequest().body(response);
    }

    // 10. Lỗi 409 Conflict - Vi phạm ràng buộc dữ liệu MySQL (Unique key, FK constraint)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status(HttpStatus.CONFLICT.value())
                .message("Dữ liệu đã tồn tại hoặc vi phạm ràng buộc cơ sở dữ liệu")
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    // 11. Lỗi 500 Internal Server Error - Tất cả các lỗi hệ thống chưa được phân loại
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneralException(Exception ex) {
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message("Lỗi hệ thống bên trong server: " + ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
