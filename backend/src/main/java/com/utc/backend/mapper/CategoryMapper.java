package com.utc.backend.mapper;

import com.utc.backend.dto.CategoryRequestDto;
import com.utc.backend.dto.CategoryResponseDto;
import com.utc.backend.entity.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public Category toEntity(CategoryRequestDto dto) {
        if (dto == null) {
            return null;
        }
        return Category.builder()
                .name(dto.name())
                .slug(dto.slug())
                .description(dto.description())
                .isActive(dto.isActive() != null ? dto.isActive() : true)
                .build();
    }

    public void updateEntityFromDto(CategoryRequestDto dto, Category category) {
        if (dto == null || category == null) {
            return;
        }
        if (dto.name() != null) {
            category.setName(dto.name());
        }
        if (dto.slug() != null) {
            category.setSlug(dto.slug());
        }
        if (dto.description() != null) {
            category.setDescription(dto.description());
        }
        if (dto.isActive() != null) {
            category.setIsActive(dto.isActive());
        }
    }

    public CategoryResponseDto toResponseDto(Category category) {
        if (category == null) {
            return null;
        }
        return new CategoryResponseDto(
                category.getId(),
                category.getName(),
                category.getSlug(),
                category.getDescription(),
                category.getIsActive()
        );
    }
}
