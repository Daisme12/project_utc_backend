"use client";

import React, { useState } from "react";
import Image from "next/image";
import RecipeDetailModal, { Recipe } from "./RecipeDetailModal";
import AllRecipesModal from "./AllRecipesModal";
import ReviewsModal from "./ReviewsModal";

export default function RecipesAndReviews() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isOpenAllRecipes, setIsOpenAllRecipes] = useState(false);
  const [isOpenReviewsModal, setIsOpenReviewsModal] = useState(false);

  const recipes: Recipe[] = [
    {
      id: 1,
      title: "Sườn Thăn Rim Mặn Ngọt Đậm Đà",
      tag: "Từ Sườn Thăn Heo Ubomeat",
      time: "25 Phút",
      servings: "3 - 4 người",
      calories: "480 kcal",
      difficulty: "Dễ",
      desc: "Thịt sườn mềm róc xương, nước sốt sánh bóng ăn cùng cơm nóng đầu than. Giữ trọn vị ngọt tự nhiên nhờ công nghệ thịt mát.",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
      ingredients: [
        {
          id: 1,
          name: "Sườn Thăn Heo Truyền Thống",
          amount: "500g",
          price: 119000,
          packWeight: "Khay 500g",
          image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80",
        },
        {
          id: 911,
          name: "Nước Sốt Rim Truyền Thống Ubofood",
          amount: "1 gói",
          price: 15000,
          packWeight: "Gói 80g",
          image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
        },
        {
          id: 912,
          name: "Hành Tím & Tỏi Bóc Sẵn VietGAP",
          amount: "1 khay",
          price: 12000,
          packWeight: "Khay 100g",
          image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&q=80",
        },
      ],
      steps: [
        {
          stepNumber: 1,
          title: "Sơ chế & Chuẩn bị sườn mát",
          instruction: "Rửa nhẹ sườn mát với nước ấm pha muối loãng, thấm khô và chặt thành khúc vừa ăn khoảng 3 - 4cm.",
        },
        {
          stepNumber: 2,
          title: "Ướp gia vị thẩm thấu",
          instruction: "Ướp sườn với 1 thìa hành tỏi băm, 1 thìa nước mắm cốt và nửa gói sốt rim Ubofood trong 15 phút.",
        },
        {
          stepNumber: 3,
          title: "Chiên xém vàng & Khóa vị ngọt",
          instruction: "Đun nóng chảo dầu, chiên sườn xém vàng hai mặt để thớ thịt giữ trọn vị mềm ngọt và độ ẩm bên trong.",
        },
        {
          stepNumber: 4,
          title: "Rim sốt sánh & Hoàn thiện",
          instruction: "Cho phần sốt còn lại cùng 80ml nước dừa tươi, rim lửa liu riu 15 phút đến khi sốt keo bóng, rắc tiêu và hành lá rồi tắt bếp.",
        },
      ],
    },
    {
      id: 2,
      title: "Ba Chỉ Nướng Nồi Chiên Không Dầu",
      tag: "Từ Ba Chỉ Heo Ubomeat",
      time: "30 Phút",
      servings: "3 - 4 người",
      calories: "520 kcal",
      difficulty: "Dễ",
      desc: "Bì giòn rụm tan trong miệng, thớ thịt ngọt không bị khô nhờ bảo quản lạnh chuẩn 0 - 4°C khép kín.",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
      ingredients: [
        {
          id: 2,
          name: "Ba Chỉ Heo Truyền Thống",
          amount: "500g",
          price: 112000,
          packWeight: "Khay 500g",
          image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=400&q=80",
        },
        {
          id: 913,
          name: "Sốt Ướp Thịt Nướng Ngũ Vị",
          amount: "1 gói",
          price: 16000,
          packWeight: "Gói 70g",
          image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
        },
        {
          id: 914,
          name: "Rau Sống VietGAP Ăn Kèm (Xà lách, Dưa leo)",
          amount: "1 túi",
          price: 18000,
          packWeight: "Túi 350g",
          image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=400&q=80",
        },
      ],
      steps: [
        {
          stepNumber: 1,
          title: "Xăm bì & Lau giấm giòn bì",
          instruction: "Dùng tăm nhọn xăm đều mặt bì heo, xoa một lớp mỏng giấm gạo và muối hạt để khi nướng bì nổ bung giòn.",
        },
        {
          stepNumber: 2,
          title: "Ướp thịt ngũ vị",
          instruction: "Xoa đều sốt ướp vào các mặt thịt (tránh để sốt ướt lên phần da) trong 20 phút cho ngấm đều gia vị.",
        },
        {
          stepNumber: 3,
          title: "Nướng lần 1 (180°C - 20 phút)",
          instruction: "Đặt thịt vào nồi chiên không dầu (mặt bì hướng lên), nướng ở nhiệt độ 180°C trong 20 phút cho thịt chín tới.",
        },
        {
          stepNumber: 4,
          title: "Nổ giòn bì (200°C - 10 phút)",
          instruction: "Tăng nhiệt lên 200°C nướng thêm 8 - 10 phút cho bì nổ phồng giòn tan. Thái lát mỏng ăn kèm rau sống VietGAP.",
        },
      ],
    },
    {
      id: 3,
      title: "Thăn Bò Úc Áp Chảo Bơ Tỏi Rosemary",
      tag: "Từ Thăn Bò Úc Chuẩn Mát",
      time: "20 Phút",
      servings: "2 người",
      calories: "420 kcal",
      difficulty: "Dễ",
      desc: "Thịt thăn bò mềm mọng nước, hương thơm bơ tỏi và lá hương thảo đậm đà chuẩn vị nhà hàng Âu.",
      image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80",
      ingredients: [
        {
          id: 5,
          name: "Thăn Bò Sạch Ubomeat",
          amount: "300g",
          price: 104900,
          packWeight: "Khay 300g",
          image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=400&q=80",
        },
        {
          id: 915,
          name: "Bơ Lạt Động Vật & Nhánh Rosemary",
          amount: "1 set",
          price: 22000,
          packWeight: "Set nấu ăn",
          image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
        },
      ],
      steps: [
        {
          stepNumber: 1,
          title: "Ướp muối tiêu",
          instruction: "Thấm khô miếng thăn bò, rắc một nhúm muối biển và tiêu đen đập dập lên 2 mặt trong 5 phút.",
        },
        {
          stepNumber: 2,
          title: "Áp chảo lửa lớn",
          instruction: "Đun chảo thật nóng, áp chảo mỗi mặt 2 phút để tạo lớp vỏ nâu thơm giòn.",
        },
        {
          stepNumber: 3,
          title: "Tưới bơ thơm rosemary",
          instruction: "Hạ lửa vừa, cho bơ, tỏi đập dập và nhánh rosemary vào chảo, nghiêng chảo múc bơ tưới đều lên miếng thịt trong 1 phút.",
        },
      ],
    },
    {
      id: 4,
      title: "Canh Sườn Heo Hầm Rau Củ Đà Lạt",
      tag: "Từ Sườn Thăn & Rau Củ VietGAP",
      time: "35 Phút",
      servings: "4 người",
      calories: "360 kcal",
      difficulty: "Dễ",
      desc: "Nước canh thanh ngọt tự nhiên từ xương và củ quả tươi, bồi bổ năng lượng cho cả gia đình.",
      image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80",
      ingredients: [
        {
          id: 1,
          name: "Sườn Thăn Heo Truyền Thống",
          amount: "400g",
          price: 95000,
          packWeight: "Khay 400g",
          image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80",
        },
        {
          id: 916,
          name: "Set Củ Quả Hầm Canh Đà Lạt (Cà rốt, khoai tây, bắp ngọt)",
          amount: "1 khay",
          price: 25000,
          packWeight: "Khay 500g",
          image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=400&q=80",
        },
      ],
      steps: [
        {
          stepNumber: 1,
          title: "Trần sơ sườn",
          instruction: "Trần sườn qua nước sôi 1 phút rồi rửa lại để nước dùng trong veo không bọt.",
        },
        {
          stepNumber: 2,
          title: "Hầm lấy nước ngọt",
          instruction: "Cho sườn vào 1.5 lít nước cùng 1 thìa muối, hầm nhỏ lửa 20 phút.",
        },
        {
          stepNumber: 3,
          title: "Nấu cùng củ quả",
          instruction: "Cho bắp ngọt, cà rốt, khoai tây vào nấu thêm 12 phút đến khi củ mềm bùi, rắc hành ngò thơm lừng.",
        },
      ],
    },
  ];

  const reviews = [
    {
      id: 1,
      name: "Chị Trần Thu Hà",
      location: "Khu đô thị Ngoại Giao Đoàn, Hà Nội",
      avatarText: "TH",
      rating: 5,
      content:
        "Thịt mát Ubofood luộc lên không hề nổi bọt tanh như thịt mua ngoài chợ truyền thống, nước trong veo ngọt lịm. Shipper giao tới nơi đá gel vẫn cứng ngắc. Cả nhà mình giờ chỉ ăn thịt ở đây.",
    },
    {
      id: 2,
      name: "Anh Nguyễn Hoàng Vũ",
      location: "Chung cư Times City, Minh Khai",
      avatarText: "HV",
      rating: 5,
      content:
        "Đặt combo sơ chế sẵn cho tối thứ 6 rất tiện, không mất công rửa thái. Thịt thăn bò làm bít tết thơm mềm, chuẩn vị thịt tươi chứ không bị dai khô. Giao hàng chuẩn xác 45 phút.",
    },
  ];

  return (
    <>
      <section className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 1. LEFT COLUMN: RECIPES (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                  NẤU GÌ HÔM NAY?
                </span>
                <h2 className="text-base sm:text-lg font-extrabold text-[#113a1b] dark:text-white">
                  Gợi Ý Món Ngon Từ Thịt Mát Ubofood
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpenAllRecipes(true)}
                className="text-xs font-semibold text-[#195329] dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Xem 120+ công thức</span>
                <span>&gt;</span>
              </button>
            </div>

            {/* 2 Recipe Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recipes.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-xs flex flex-col justify-between group hover:shadow-md transition-shadow"
                >
                  <div
                    className="cursor-pointer"
                    onClick={() => setSelectedRecipe(item)}
                  >
                    <div className="relative w-full h-36 bg-gray-100 dark:bg-zinc-800">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 30vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                        ⏱️ {item.time}
                      </span>
                    </div>

                    <div className="p-3.5">
                      <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                        {item.tag}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-100 mt-0.5 line-clamp-1 group-hover:text-[#195329] transition-colors">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 pt-0">
                    <button
                      type="button"
                      onClick={() => setSelectedRecipe(item)}
                      className="w-full py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-[#195329] hover:text-white text-[#195329] dark:text-emerald-300 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
                    >
                      📖 Xem công thức & Gom nguyên liệu
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. RIGHT COLUMN: CUSTOMER REVIEWS (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                PHẢN HỒI THỰC TẾ
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-[#113a1b] dark:text-white">
                Được Tin Dùng Bởi Hơn 50.000 Gia Đình
              </h2>
            </div>

            <div className="space-y-3">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  onClick={() => setIsOpenReviewsModal(true)}
                  className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-800 hover:shadow-xs transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#195329] dark:text-emerald-400 font-bold text-xs flex items-center justify-center">
                        {rev.avatarText}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-800 dark:text-gray-100 leading-tight">
                          {rev.name}
                        </h4>
                        <p className="text-[10px] text-gray-400">{rev.location}</p>
                      </div>
                    </div>

                    <div className="flex text-amber-400 text-xs">
                      {"★".repeat(rev.rating)}
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed italic">
                    &ldquo;{rev.content}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Rating Banner Bottom */}
          <div className="mt-4 p-3 rounded-2xl bg-[#eaf7ee] dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#144723] dark:text-emerald-300">
              <span className="text-emerald-600">✓</span>
              <span>Đánh giá 4.9/5 sao từ 19.820 khách hàng</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpenReviewsModal(true)}
              className="text-xs font-bold text-[#195329] dark:text-emerald-400 hover:underline cursor-pointer"
            >
              Xem thêm
            </button>
          </div>
        </div>
      </section>

      {/* 3. Popups */}
      {/* Detail Recipe Modal with Ingredients & Steps */}
      <RecipeDetailModal
        recipe={selectedRecipe}
        isOpen={Boolean(selectedRecipe)}
        onClose={() => setSelectedRecipe(null)}
      />

      {/* 120+ Recipes Catalog Modal */}
      <AllRecipesModal
        isOpen={isOpenAllRecipes}
        recipes={recipes}
        onSelectRecipe={(r) => setSelectedRecipe(r)}
        onClose={() => setIsOpenAllRecipes(false)}
      />

      {/* Full Customer Reviews Modal */}
      <ReviewsModal
        isOpen={isOpenReviewsModal}
        onClose={() => setIsOpenReviewsModal(false)}
      />
    </>
  );
}

