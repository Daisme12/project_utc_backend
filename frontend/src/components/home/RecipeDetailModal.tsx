"use client";

import React, { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";

export interface Recipe {
  id: number;
  title: string;
  tag: string;
  time: string;
  servings: string;
  calories: string;
  desc: string;
  image: string;
  difficulty: "Dễ" | "Trung bình";
  ingredients: {
    id: number;
    name: string;
    amount: string;
    price: number;
    packWeight: string;
    image: string;
  }[];
  steps: {
    stepNumber: number;
    title: string;
    instruction: string;
  }[];
}

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RecipeDetailModal({
  recipe,
  isOpen,
  onClose,
}: RecipeDetailModalProps) {
  const { addItem } = useCart();
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<number[]>([]);

  // Khi recipe thay đổi, mặc định chọn tất cả nguyên liệu
  React.useEffect(() => {
    if (recipe) {
      setSelectedIngredientIds(recipe.ingredients.map((i) => i.id));
    }
  }, [recipe]);

  if (!isOpen || !recipe) return null;

  const toggleIngredient = (id: number) => {
    setSelectedIngredientIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectedIngredients = recipe.ingredients.filter((i) =>
    selectedIngredientIds.includes(i.id)
  );

  const totalIngredientsPrice = selectedIngredients.reduce(
    (sum, i) => sum + i.price,
    0
  );

  const handleAddSelectedToCart = () => {
    if (selectedIngredients.length === 0) {
      toast.error("Vui lòng tích chọn ít nhất 1 nguyên liệu!");
      return;
    }

    selectedIngredients.forEach((item) => {
      addItem(
        {
          id: item.id,
          name: item.name,
          price: item.price,
          packWeight: item.packWeight,
          image: item.image,
        },
        1
      );
    });

    toast.success(
      `Đã thêm ${selectedIngredients.length} nguyên liệu món "${recipe.title}" vào giỏ hàng!`,
      {
        description: `Tổng tiền: ${new Intl.NumberFormat("vi-VN").format(totalIngredientsPrice)}đ`,
      }
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-zinc-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Header with Hero Image */}
        <div className="relative w-full h-48 sm:h-56 bg-gray-100 dark:bg-zinc-800 flex-shrink-0">
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center text-sm font-bold backdrop-blur-xs transition-colors cursor-pointer z-10"
          >
            ✕
          </button>

          {/* Title and metadata on image */}
          <div className="absolute bottom-3.5 left-4 right-4 text-white">
            <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-600/90 text-[10px] font-bold uppercase tracking-wider mb-1">
              {recipe.tag}
            </span>
            <h2 className="text-lg sm:text-xl font-black leading-tight drop-shadow-xs">
              {recipe.title}
            </h2>
            <div className="flex items-center gap-3 text-[11px] text-gray-200 mt-1.5 flex-wrap">
              <span className="flex items-center gap-1">
                <span>⏱️</span>
                <span>{recipe.time}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span>👥</span>
                <span>{recipe.servings}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span>🔥</span>
                <span>{recipe.calories}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span>⭐</span>
                <span>Độ khó: {recipe.difficulty}</span>
              </span>
            </div>
          </div>
        </div>

        {/* 2. Scrollable Body: Ingredients & Steps */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic bg-emerald-50/60 dark:bg-emerald-950/20 p-3 rounded-2xl border border-emerald-100/70 dark:border-emerald-900/40">
            &ldquo;{recipe.desc}&rdquo;
          </p>

          {/* Section: Ingredients List with checkboxes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-black text-[#113a1b] dark:text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                <span>🥗</span>
                <span>Nguyên liệu tươi chuẩn mát (Chọn để gom vào giỏ)</span>
              </h3>
              <span className="text-[11px] text-gray-500">
                Đã chọn {selectedIngredients.length}/{recipe.ingredients.length}
              </span>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-zinc-800 rounded-2xl border border-gray-200/70 dark:border-zinc-800 overflow-hidden bg-gray-50/50 dark:bg-zinc-800/40">
              {recipe.ingredients.map((ing) => {
                const isChecked = selectedIngredientIds.includes(ing.id);
                return (
                  <label
                    key={ing.id}
                    className="flex items-center justify-between p-2.5 sm:px-3.5 hover:bg-white dark:hover:bg-zinc-800 transition-colors cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleIngredient(ing.id)}
                        className="w-4 h-4 rounded text-[#195329] focus:ring-emerald-500 cursor-pointer"
                      />
                      <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={ing.image}
                          alt={ing.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200 block leading-tight">
                          {ing.name}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {ing.amount} • {ing.packWeight}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-[#195329] dark:text-emerald-400 whitespace-nowrap">
                      {new Intl.NumberFormat("vi-VN").format(ing.price)}đ
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Section: Steps */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-black text-[#113a1b] dark:text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
              <span>👨‍🍳</span>
              <span>Các bước chế biến mâm cơm gia đình</span>
            </h3>

            <div className="space-y-3">
              {recipe.steps.map((st) => (
                <div
                  key={st.stepNumber}
                  className="flex items-start gap-3 p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-2xs"
                >
                  <div className="w-6 h-6 rounded-full bg-[#195329] text-white flex items-center justify-center text-xs font-black flex-shrink-0 shadow-xs">
                    {st.stepNumber}
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                      {st.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      {st.instruction}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Sticky Bottom CTA Bar */}
        <div className="p-3.5 sm:p-4 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between gap-3 flex-shrink-0">
          <div>
            <span className="text-[10px] text-gray-400 block">
              Tổng tiền nguyên liệu đã chọn:
            </span>
            <span className="text-base sm:text-lg font-black text-[#195329] dark:text-emerald-400">
              {new Intl.NumberFormat("vi-VN").format(totalIngredientsPrice)}đ
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={handleAddSelectedToCart}
              className="px-4 sm:px-5 py-2 rounded-xl bg-[#195329] hover:bg-[#12421f] text-white text-xs font-bold shadow-md shadow-emerald-950/20 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>🛒</span>
              <span>Gom vào giỏ hàng</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
