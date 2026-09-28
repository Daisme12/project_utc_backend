package com.utc.backend.controller;

import com.utc.backend.common.ApiResponse;
import com.utc.backend.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/v1/upload")
@RequiredArgsConstructor
public class UploadController {

    private final CloudinaryService cloudinaryService;

    @PostMapping("/image")
    public ResponseEntity<ApiResponse<String>> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", required = false, defaultValue = "products") String folder) {
        String imageUrl = cloudinaryService.uploadImage(file, folder);
        return ResponseEntity.ok(ApiResponse.success(imageUrl, "Tải ảnh lên Cloudinary (Signed Mode) thành công"));
    }
}
