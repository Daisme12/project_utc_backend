package com.utc.backend.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.utc.backend.exception.BadRequestException;
import com.utc.backend.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryServiceImpl implements CloudinaryService {

    private final Cloudinary cloudinary;

    @Value("${cloudinary.folder:project-utc}")
    private String defaultFolder;

    @Value("${cloudinary.upload-preset:project-utc}")
    private String uploadPreset;

    @Override
    public String uploadImage(MultipartFile file) {
        return uploadImage(file, "products");
    }

    @Override
    public String uploadImage(MultipartFile file, String subFolder) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File ảnh không được để trống");
        }

        try {
            String targetFolder = (subFolder != null && !subFolder.trim().isEmpty())
                    ? defaultFolder + "/" + subFolder.trim()
                    : defaultFolder;

            Map<String, Object> params = new HashMap<>();
            params.put("folder", targetFolder);
            params.put("resource_type", "auto");
            params.put("unique_filename", true);
            params.put("overwrite", false);

            // Using Signed Upload via Backend with API Key & API Secret
            if (uploadPreset != null && !uploadPreset.trim().isEmpty()) {
                params.put("upload_preset", uploadPreset.trim());
            }

            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), params);
            return uploadResult.get("secure_url").toString();
        } catch (IOException e) {
            throw new BadRequestException("Tải ảnh lên Cloudinary qua Signed Mode thất bại: " + e.getMessage());
        }
    }

    @Override
    public void deleteImage(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            throw new BadRequestException("Xóa ảnh trên Cloudinary thất bại: " + e.getMessage());
        }
    }
}
