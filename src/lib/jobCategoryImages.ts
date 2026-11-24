interface JobCategoryImage {
  src: string;
  position: string;
}

const imageUrl = (photoId: string) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=640&q=80`;

const categoryImages: Record<string, JobCategoryImage> = {
  "Phục vụ / F&B": {
    src: imageUrl("photo-1607539068168-21a93fbedad8"),
    position: "object-[center_52%]",
  },
  "Bán hàng / Cửa hàng": {
    src: imageUrl("photo-1441986300917-64674bd600d8"),
    position: "object-center",
  },
  "Gia sư": {
    src: imageUrl("photo-1758525860449-fa3602fceb31"),
    position: "object-center",
  },
  "Trợ giảng": {
    src: imageUrl("photo-1758525860449-fa3602fceb31"),
    position: "object-center",
  },
  "Nhập liệu / Văn phòng": {
    src: imageUrl("photo-1611844327158-1b6c66bc402c"),
    position: "object-center",
  },
  "Content / Social media": {
    src: imageUrl("photo-1611844327158-1b6c66bc402c"),
    position: "object-center",
  },
  "Thiết kế": {
    src: imageUrl("photo-1611844327158-1b6c66bc402c"),
    position: "object-center",
  },
  "Giao hàng": {
    src: imageUrl("photo-1621972750749-0fbb1abb7736"),
    position: "object-[center_58%]",
  },
  "Sự kiện / PG": {
    src: imageUrl("photo-1492684223066-81342ee5ff30"),
    position: "object-center",
  },
  "Chăm sóc khách hàng": {
    src: imageUrl("photo-1611844327158-1b6c66bc402c"),
    position: "object-center",
  },
  "Dịch thuật": {
    src: imageUrl("photo-1611844327158-1b6c66bc402c"),
    position: "object-center",
  },
  "IT hỗ trợ / Lập trình": {
    src: imageUrl("photo-1611844327158-1b6c66bc402c"),
    position: "object-center",
  },
};

// Keep unfamiliar categories visually consistent with office work.
export function getJobCategoryImage(category: string): JobCategoryImage {
  return categoryImages[category] ?? categoryImages["Nhập liệu / Văn phòng"];
}
