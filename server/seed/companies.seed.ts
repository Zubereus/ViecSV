export interface SeedCompanyRaw {
  key: string;
  name: string;
  industry: string;
  description: string;
  ownerEmail: string;
  colorHex: string;
}

export const SEED_COMPANIES: SeedCompanyRaw[] = [
  {
    key: "gom-tra-moc",
    name: "Gốm & Trà Mộc",
    industry: "Cà phê & Trà sữa",
    description: "Không gian trà thảo mộc kết hợp trưng bày gốm mộc mạc, nơi sinh viên thư giãn và làm việc yên tĩnh.",
    ownerEmail: "tuyendung@demo.vn",
    colorHex: "#134e4a", // Teal đậm
  },
  {
    key: "bep-nha-lanh",
    name: "Bếp Nhà Lành",
    industry: "Nhà hàng & Ẩm thực",
    description: "Chuỗi cơm văn phòng và món ăn gia đình thuần Việt với tiêu chí sạch lành và nguyên liệu tươi mỗi ngày.",
    ownerEmail: "doi.tac@demo.vn",
    colorHex: "#854d0e", // Hổ phách đất
  },
  {
    key: "bach-hoa-24h",
    name: "Tiệm Bách Hóa 24 Giờ",
    industry: "Cửa hàng tiện lợi",
    description: "Hệ thống bách hóa tiện ích 24/7 đặt gần các cụm trường đại học, phục vụ nhu yếu phẩm và thức ăn nhanh.",
    ownerEmail: "tuyendung@demo.vn",
    colorHex: "#1e3a8a", // Lam thẫm
  },
  {
    key: "ngoai-ngu-chan-troi",
    name: "Ngoại Ngữ Chân Trời Mới",
    industry: "Trung tâm ngoại ngữ",
    description: "Đơn vị đào tạo tiếng Anh giao tiếp và luyện thi chứng chỉ quốc tế với phương pháp tương tác phản xạ tích cực.",
    ownerEmail: "nhansu@demo.vn",
    colorHex: "#334155", // Xám slate
  },
  {
    key: "gia-su-tri-tue-tre",
    name: "Gia Sư Trí Tuệ Trẻ",
    industry: "Trung tâm gia sư",
    description: "Mạng lưới kết nối gia sư sinh viên xuất sắc từ các trường đại học top đầu đến các gia đình tại TP.HCM.",
    ownerEmail: "doi.tac@demo.vn",
    colorHex: "#047857", // Xanh ngọc
  },
  {
    key: "sang-tao-tinh-van",
    name: "Sáng Tạo Số Tinh Vân",
    industry: "Agency Marketing & Truyền thông",
    description: "Agency trẻ trung chuyên quản lý nội dung đa nền tảng, viral video và chiến dịch mạng xã hội cho các nhãn hàng F&B.",
    ownerEmail: "tuyendung@demo.vn",
    colorHex: "#4338ca", // Indigo dịu
  },
  {
    key: "studio-khung-nhin",
    name: "Studio Thiết Kế Khung Nhìn",
    industry: "Studio thiết kế",
    description: "Xưởng sáng tạo tập trung vào thiết kế bộ nhận diện thương hiệu, bao bì sản phẩm và hình ảnh truyền thông số.",
    ownerEmail: "nhansu@demo.vn",
    colorHex: "#6b21a8", // Tím mận trầm
  },
  {
    key: "startup-nova",
    name: "Công Nghệ Giải Pháp Trẻ Nova",
    industry: "Startup Công nghệ",
    description: "Đội ngũ khởi nghiệp công nghệ cung cấp nền tảng quản lý bán hàng và giải pháp tự động hóa cho doanh nghiệp vừa và nhỏ.",
    ownerEmail: "doi.tac@demo.vn",
    colorHex: "#0f766e", // Cyan đất
  },
  {
    key: "giao-hang-nam-sai-gon",
    name: "Giao Hàng Siêu Tốc Nam Sài Gòn",
    industry: "Công ty giao nhận",
    description: "Dịch vụ giao vận chặng cuối nội thành TP.HCM, ứng dụng công nghệ điều phối tối ưu thời gian giao hàng.",
    ownerEmail: "nhansu@demo.vn",
    colorHex: "#c2410c", // Cam đất
  },
  {
    key: "su-kien-anh-sao",
    name: "Sự Kiện Ánh Sao Sài Gòn",
    industry: "Công ty tổ chức sự kiện",
    description: "Chuyên tổ chức hội chợ việc làm sinh viên, triển lãm du học, lễ hội ẩm thực và activations tại trung tâm thương mại.",
    ownerEmail: "doi.tac@demo.vn",
    colorHex: "#991b1b", // Đỏ trầm
  },
  {
    key: "san-xanh-moc",
    name: "Sàn Mua Sắm Xanh Mộc",
    industry: "Thương mại điện tử",
    description: "Nền tảng mua sắm trực tuyến chuyên về thực phẩm xanh, mỹ phẩm thiên nhiên và đồ gia dụng tái chế thân thiện môi trường.",
    ownerEmail: "nhansu@demo.vn",
    colorHex: "#15803d", // Xanh lục lá
  },
  {
    key: "to-ken-coworking",
    name: "Tổ Kén Học Tập & Co-working",
    industry: "Thư viện & Không gian học tập",
    description: "Không gian làm việc và tự học chuyên nghiệp 24/7 với quầy cà phê tự phục vụ, phòng họp nhóm và thư viện tài liệu miễn phí.",
    ownerEmail: "doi.tac@demo.vn",
    colorHex: "#475569", // Thép slate
  },
  {
    key: "banh-mi-pho-xua",
    name: "Chuỗi Bánh Mì Phố Xưa",
    industry: "F&B / Ẩm thực đường phố",
    description: "Thương hiệu bánh mì gia truyền với hệ thống quầy bán nhanh tại các trục đường chính và cổng trường đại học.",
    ownerEmail: "nhansu@demo.vn",
    colorHex: "#b45309", // Hổ phách ấm
  },
  {
    key: "tin-hoc-thuc-chien",
    name: "Trung Tâm Tin Học & Lập Trình Thực Chiến",
    industry: "Đào tạo & IT",
    description: "Cơ sở đào tạo thực hành các kỹ năng văn phòng số, lập trình web cơ bản và phân tích dữ liệu cho sinh viên.",
    ownerEmail: "doi.tac@demo.vn",
    colorHex: "#0369a1", // Xanh biển sẫm
  },
];
