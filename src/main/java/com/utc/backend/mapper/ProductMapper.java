package com.utc.backend.mapper;

import com.utc.backend.dto.ProductRequestDto;
import com.utc.backend.dto.ProductResponseDto;
import com.utc.backend.entity.Category;
import com.utc.backend.entity.Product;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProductMapper {

    private final CategoryMapper categoryMapper;

    public Product toEntity(ProductRequestDto dto, Category category) {
        if (dto == null) {
            return null;
        }
        return Product.builder()
                .category(category)
                .sku(dto.sku())
                .name(dto.name())
                .unit(dto.unit())
                .isWeighing(dto.isWeighing() != null ? dto.isWeighing() : false)
                .price(dto.price())
                .costPrice(dto.costPrice())
                .stockQuantity(dto.stockQuantity())
                .origin(dto.origin())
                .imageUrl(dto.imageUrl())
                .isActive(dto.isActive() != null ? dto.isActive() : true)
                .build();
    }

    public void updateEntityFromDto(ProductRequestDto dto, Product product, Category category) {
        if (dto == null || product == null) {
            return;
        }
        if (category != null) {
            product.setCategory(category);
        }
        if (dto.sku() != null) {
            product.setSku(dto.sku());
        }
        if (dto.name() != null) {
            product.setName(dto.name());
        }
        if (dto.unit() != null) {
            product.setUnit(dto.unit());
        }
        if (dto.isWeighing() != null) {
            product.setIsWeighing(dto.isWeighing());
        }
        if (dto.price() != null) {
            product.setPrice(dto.price());
        }
        if (dto.costPrice() != null) {
            product.setCostPrice(dto.costPrice());
        }
        if (dto.stockQuantity() != null) {
            product.setStockQuantity(dto.stockQuantity());
        }
        if (dto.origin() != null) {
            product.setOrigin(dto.origin());
        }
        if (dto.imageUrl() != null) {
            product.setImageUrl(dto.imageUrl());
        }
        if (dto.isActive() != null) {
            product.setIsActive(dto.isActive());
        }
    }

    public ProductResponseDto toResponseDto(Product product) {
        if (product == null) {
            return null;
        }
        return new ProductResponseDto(
                product.getId(),
                categoryMapper.toResponseDto(product.getCategory()),
                product.getSku(),
                product.getName(),
                product.getUnit(),
                product.getIsWeighing(),
                product.getPrice(),
                product.getCostPrice(),
                product.getStockQuantity(),
                product.getOrigin(),
                product.getImageUrl(),
                product.getIsActive(),
                product.getCreatedAt()
        );
    }
}
