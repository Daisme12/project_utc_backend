package com.utc.backend.service;

import org.springframework.web.multipart.MultipartFile;

public interface CloudinaryService {
    String uploadImage(MultipartFile file);
    String uploadImage(MultipartFile file, String subFolder);
    void deleteImage(String publicId);
}
