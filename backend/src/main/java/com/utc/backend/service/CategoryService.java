package com.utc.backend.service;

import com.utc.backend.dto.CategoryRequestDto;
import com.utc.backend.dto.CategoryResponseDto;

import java.util.List;

public interface CategoryService {
    CategoryResponseDto createCategory(CategoryRequestDto dto);
    CategoryResponseDto updateCategory(Long id, CategoryRequestDto dto);
    CategoryResponseDto getCategoryById(Long id);
    CategoryResponseDto getCategoryBySlug(String slug);
    List<CategoryResponseDto> getAllActiveCategories();
    void deleteCategory(Long id);
}
