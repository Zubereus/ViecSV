import { normalizeText } from "../../shared/text.js";
import type { DayOfWeek, Shift, WorkType, JobStatus } from "../../shared/types.js";

export interface SeedJobDefinition {
  companyKey: string;
  title: string;
  category: string;
  district: string;
  address: string;
  workType: WorkType;
  wagePerHour: number;
  wageNote: string;
  days: DayOfWeek[];
  shifts: Shift[];
  hoursPerWeek: number;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  experienceRequired: boolean;
  isUrgent: boolean;
  status: JobStatus;
  daysAgo: number; // số ngày trước để tính posted_at động
}

export const RAW_SEED_JOBS: SeedJobDefinition[] = [
  // --- 1. Gốm & Trà Mộc (F&B / Trà thảo mộc) - Thuộc nhà tuyển dụng Demo (5 jobs) ---
  {
    companyKey: "gom-tra-moc",
    title: "Nhân viên Pha chế & Phục vụ Trà Thảo Mộc",
    category: "Phục vụ / F&B",
    district: "Quận 1",
    address: "42 Nguyễn Huệ, Phường Bến Nghé",
    workType: "tai-cho",
    wagePerHour: 32000,
    wageNote: "Thưởng chuyên cần 500k/tháng",
    days: ["T2", "T4", "T6", "CN"],
    shifts: ["sang", "chieu"],
    hoursPerWeek: 20,
    description: "Quán trà cần tuyển các bạn sinh viên yêu thích không gian trà đạo, nhẹ nhàng và chỉn chu. Bạn sẽ học hỏi cách pha chế các loại trà hoa quả tươi và chăm sóc bàn trà cho khách.",
    responsibilities: [
      "Pha chế trà thảo mộc và nước uống theo đúng công thức chuẩn",
      "Tiếp đón và giới thiệu menu các dòng trà cho khách hàng",
      "Dọn dẹp khu vực quầy bar và bàn trà ngăn nắp",
      "Kiểm kê nguyên liệu lá trà và hoa quả mỗi cuối ca"
    ],
    requirements: [
      "Giao tiếp nhẹ nhàng, lễ phép và lịch sự",
      "Trung thực, đúng giờ và có tinh thần tự giác cao",
      "Ưu tiên sinh viên có thể gắn bó từ 3 tháng trở lên"
    ],
    benefits: [
      "Miễn phí 1 phần trà thơm mát mỗi ca làm việc",
      "Hỗ trợ linh hoạt xếp ca theo lịch thi học kỳ",
      "Thưởng năng suất vào các ngày lễ Tết"
    ],
    experienceRequired: false,
    isUrgent: true,
    status: "open",
    daysAgo: 2,
  },
  {
    companyKey: "gom-tra-moc",
    title: "Thu ngân & Quản lý Hóa đơn Ca Tối",
    category: "Phục vụ / F&B",
    district: "Quận 1",
    address: "42 Nguyễn Huệ, Phường Bến Nghé",
    workType: "tai-cho",
    wagePerHour: 34000,
    wageNote: "Phụ cấp ca tối 20.000đ/ngày",
    days: ["T3", "T5", "T7", "CN"],
    shifts: ["toi"],
    hoursPerWeek: 16,
    description: "Tuyển bạn sinh viên phụ trách máy thu ngân ca tối tại chi nhánh phố đi bộ. Công việc nhẹ nhàng, môi trường máy lạnh văn minh.",
    responsibilities: [
      "Order đồ uống cho khách qua phần mềm POS CukCuk",
      "Nhận tiền mặt, kiểm tra thanh toán mã QR và quẹt thẻ",
      "Bàn giao doanh thu và hóa đơn cuối ca cho quản lý"
    ],
    requirements: [
      "Cẩn thận, tỉ mỉ với các con số thanh toán",
      "Ngoại hình sáng, giọng nói rõ ràng dễ nghe",
      "Có laptop hoặc smartphone để nhận thông báo ca làm"
    ],
    benefits: [
      "Được đào tạo sử dụng thành thạo phần mềm bán hàng",
      "Phụ cấp tiền ăn nhẹ cho ca tối sau 21h",
      "Môi trường làm việc an toàn, lịch thiệp"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 5,
  },
  {
    companyKey: "gom-tra-moc",
    title: "Nhân viên Bán hàng & Trưng bày Sản phẩm Gốm",
    category: "Bán hàng / Cửa hàng",
    district: "Quận 1",
    address: "42 Nguyễn Huệ, Phường Bến Nghé",
    workType: "tai-cho",
    wagePerHour: 35000,
    wageNote: "Hoa hồng 3% trên sản phẩm gốm bán được",
    days: ["T7", "CN"],
    shifts: ["sang", "chieu"],
    hoursPerWeek: 14,
    description: "Vị trí chuyên trách tư vấn và bán các sản phẩm chén dĩa gốm thủ công mỹ nghệ cho khách tham quan. Phù hợp sinh viên thích văn hóa truyền thống.",
    responsibilities: [
      "Giới thiệu câu chuyện văn hóa từng mẻ gốm thủ công cho khách",
      "Sắp xếp và lau bụi các kệ gốm trưng bày cẩn thận",
      "Đóng gói gốm bằng giấy bọt khí chống vỡ khi khách mua"
    ],
    requirements: [
      "Khéo tay, cẩn trọng khi cầm nắm đồ gốm sứ",
      "Khả năng giao tiếp tiếng Anh cơ bản với du khách nước ngoài",
      "Nhanh nhẹn và yêu thích thẩm mỹ thủ công"
    ],
    benefits: [
      "Hoa hồng theo doanh thu sản phẩm bán ra",
      "Giảm giá 25% khi mua đồ gốm trang trí cá nhân",
      "Chỉ làm việc vào 2 ngày cuối tuần"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 8,
  },
  {
    companyKey: "gom-tra-moc",
    title: "Phụ bếp Sơ chế Bánh Ngọt & Trái cây",
    category: "Phục vụ / F&B",
    district: "Quận 1",
    address: "42 Nguyễn Huệ, Phường Bến Nghé",
    workType: "tai-cho",
    wagePerHour: 30000,
    wageNote: "Bao ăn ca giữa giờ",
    days: ["T2", "T3", "T4", "T5"],
    shifts: ["sang"],
    hoursPerWeek: 16,
    description: "Hỗ trợ bếp bánh chuẩn bị các loại bánh quy bơ, cắt tỉa hoa quả trang trí cho set trà chiều. Công việc sạch sẽ trong phòng lạnh.",
    responsibilities: [
      "Rửa sạch và cắt gọt hoa quả tươi theo định lượng",
      "Nướng và đóng gói bánh quy hạt dưỡng sinh",
      "Vệ sinh khay kệ và tủ mát bảo quản nguyên liệu"
    ],
    requirements: [
      "Đảm bảo an toàn vệ sinh thực phẩm và gọn gàng",
      "Nhanh nhẹn, có thể đứng làm việc trong ca 4 tiếng",
      "Có chứng nhận khám sức khỏe (hoặc bổ sung sau 1 tuần)"
    ],
    benefits: [
      "Học nghề làm bánh mộc và đồ tráng miệng healthy",
      "Bữa ăn nhẹ thơm ngon giữa ca làm",
      "Lương thanh toán đúng hạn ngày mùng 5 hàng tháng"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "closed",
    daysAgo: 19,
  },
  {
    companyKey: "gom-tra-moc",
    title: "Cộng tác viên Chụp ảnh Menu & Story Trà Quán",
    category: "Content / Social media",
    district: "Quận 1",
    address: "42 Nguyễn Huệ, Phường Bến Nghé",
    workType: "linh-hoat",
    wagePerHour: 55000,
    wageNote: "Tính theo giờ chụp thực tế tại quán",
    days: ["T3", "T6"],
    shifts: ["chieu"],
    hoursPerWeek: 8,
    description: "Cần bạn sinh viên có gu thẩm mỹ chụp ảnh tĩnh vật tĩnh lặng để chụp góc quán, chén trà, ly nước làm tư liệu đăng Fanpage và TikTok. Bạn có thể sử dụng điện thoại iPhone đời mới hoặc máy ảnh cá nhân.",
    responsibilities: [
      "Chụp ảnh set trà, không gian gốm và khách hàng trải nghiệm",
      "Chỉnh màu ảnh theo tone màu nâu ấm hoài niệm của quán",
      "Quay các clip ngắn 15s bắt trend âm nhạc êm dịu"
    ],
    requirements: [
      "Có mắt thẩm mỹ tốt về bố cục ánh sáng và sắp đặt tĩnh vật",
      "Sở hữu smartphone chụp ảnh đẹp hoặc máy ảnh du lịch",
      "Gửi 3-5 ảnh mẫu từng chụp kèm theo hồ sơ ứng tuyển"
    ],
    benefits: [
      "Thưởng thức đồ uống miễn phí không giới hạn khi làm việc",
      "Thời gian linh động sắp xếp theo lịch rảnh của bạn",
      "Được ghi nhận tác quyền hình ảnh trên các kênh truyền thông"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 4,
  },

  // --- 2. Tiệm Bách Hóa 24 Giờ (Cửa hàng tiện lợi) - Thuộc nhà tuyển dụng Demo (5 jobs) ---
  {
    companyKey: "bach-hoa-24h",
    title: "Nhân viên Bán hàng & Trực quầy Ca Sáng",
    category: "Bán hàng / Cửa hàng",
    district: "Quận 5",
    address: "105 An Dương Vương, Phường 8",
    workType: "tai-cho",
    wagePerHour: 28000,
    wageNote: "Thưởng doanh số chi nhánh",
    days: ["T2", "T3", "T4", "T5", "T6"],
    shifts: ["sang"],
    hoursPerWeek: 25,
    description: "Cửa hàng nằm đối diện trường Đại học Sư phạm, lượng khách sinh viên đông đúc buổi sáng. Cần bạn năng động, vui vẻ đón tiếp khách hàng mua đồ ăn sáng và nước giải khát.",
    responsibilities: [
      "Tính tiền cho khách qua máy quét mã vạch",
      "Lấy bánh bao, xúc xích và hâm nóng đồ ăn theo yêu cầu",
      "Lau dọn bàn ăn nhanh và quầy kệ sạch bóng"
    ],
    requirements: [
      "Thân thiện, niềm nở câu chào khách 'Bách Hóa xin chào'",
      "Đúng giờ, không đi trễ ca sáng",
      "Có sức khỏe tốt để bưng bê hàng hóa nhẹ"
    ],
    benefits: [
      "Môi trường mát mẻ, văn minh, khách hàng chủ yếu là sinh viên",
      "Mua hàng giảm giá 15% tại toàn bộ hệ thống",
      "Nhận đồng phục và thẻ nhân viên miễn phí"
    ],
    experienceRequired: false,
    isUrgent: true,
    status: "open",
    daysAgo: 1,
  },
  {
    companyKey: "bach-hoa-24h",
    title: "Nhân viên Kiểm đếm & Xếp hàng Lên Kệ",
    category: "Nhập liệu / Văn phòng",
    district: "Quận 5",
    address: "105 An Dương Vương, Phường 8",
    workType: "tai-cho",
    wagePerHour: 30000,
    wageNote: "Trả theo tuần",
    days: ["T3", "T5", "T7"],
    shifts: ["chieu"],
    hoursPerWeek: 12,
    description: "Tiếp nhận hàng hóa từ kho tổng giao đến, đối chiếu hóa đơn và xếp hàng gọn gàng lên các dãy kệ theo sơ đồ mặt bằng.",
    responsibilities: [
      "Kiểm tra số lượng thùng hàng nhập so với phiếu giao",
      "Dán tem giá niêm yết lên từng sản phẩm",
      "Luân chuyển hàng cũ ra ngoài, hàng mới vào trong theo nguyên tắc FIFO"
    ],
    requirements: [
      "Chăm chỉ, chịu khó và cẩn thận trong việc dán tem nhãn",
      "Có thể khiêng thùng mì, thùng nước ngọt 10kg",
      "Không ngại việc vận động tay chân"
    ],
    benefits: [
      "Lương trả đều đặn theo tuần thuận tiện chi tiêu",
      "Được hướng dẫn quy trình quản lý kho bán lẻ hiện đại",
      "Nghỉ giải lao 20 phút có tính lương"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 7,
  },
  {
    companyKey: "bach-hoa-24h",
    title: "Nhân viên Trực Quầy Đêm (Ca Gãy Linh Hoạt)",
    category: "Bán hàng / Cửa hàng",
    district: "Quận 10",
    address: "268 Lý Thường Kiệt, Phường 14",
    workType: "tai-cho",
    wagePerHour: 38000,
    wageNote: "Hệ số ca đêm x1.3 lương cơ bản",
    days: ["T6", "T7", "CN"],
    shifts: ["toi"],
    hoursPerWeek: 18,
    description: "Cửa hàng cạnh cổng ký túc xá Bách Khoa cần thêm bạn phụ trách ca tối và đêm. Khách chủ yếu là sinh viên học đêm, không khí thoải mái.",
    responsibilities: [
      "Trực quầy thanh toán và quản lý an ninh cửa hàng ban đêm",
      "Nhắc nhở khách giữ trật tự tại khu vực ngồi tự học",
      "Chốt ca kiểm kê tiền mặt két sắt lúc 23h30"
    ],
    requirements: [
      "Nam/Nữ từ 18 tuổi, sức khỏe tốt",
      "Có tính cảnh giác và trung thực tuyệt đối",
      "Ưu tiên sinh viên nội trú khu vực Quận 10, Tân Bình"
    ],
    benefits: [
      "Mức lương ca đêm hấp dẫn 38k/giờ",
      "Được sử dụng wifi tốc độ cao để đọc tài liệu khi vắng khách",
      "Bảo hiểm tai nạn cá nhân trong giờ làm việc"
    ],
    experienceRequired: false,
    isUrgent: true,
    status: "open",
    daysAgo: 3,
  },
  {
    companyKey: "bach-hoa-24h",
    title: "Nhân viên Giao Hàng Bán Kính Gần (Ship xe đạp/đi bộ)",
    category: "Giao hàng",
    district: "Quận 10",
    address: "268 Lý Thường Kiệt, Phường 14",
    workType: "tai-cho",
    wagePerHour: 35000,
    wageNote: "+5.000đ mỗi đơn giao thành công",
    days: ["T2", "T4", "T6"],
    shifts: ["chieu"],
    hoursPerWeek: 12,
    description: "Giao các đơn hàng đồ ăn vặt, nước uống cho sinh viên trong các tòa ký túc xá và chung cư lân cận trong bán kính 1km.",
    responsibilities: [
      "Nhận đơn từ quầy, kiểm tra đúng món và đóng túi xách",
      "Giao tận sảnh hoặc phòng ký túc xá theo chỉ dẫn",
      "Thu tiền mặt hoặc kiểm tra mã chuyển khoản từ người nhận"
    ],
    requirements: [
      "Rành đường nội bộ khu vực KTX Bách Khoa",
      "Có phương tiện xe đạp hoặc xe máy cá nhân",
      "Thái độ lễ phép, vui tươi khi gặp khách"
    ],
    benefits: [
      "Có thêm tiền thưởng trên mỗi đơn giao",
      "Bán kính giao cực gần, không lo kẹt xe",
      "Linh hoạt đổi ca nếu trùng lịch thuyết trình trên lớp"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 10,
  },
  {
    companyKey: "bach-hoa-24h",
    title: "Cộng tác viên Nhập Liệu Hóa Đơn Nhà Cung Cấp",
    category: "Nhập liệu / Văn phòng",
    district: "Quận 5",
    address: "105 An Dương Vương, Phường 8",
    workType: "tai-cho",
    wagePerHour: 33000,
    wageNote: "Phụ cấp tiền gửi xe",
    days: ["T3", "T5"],
    shifts: ["sang"],
    hoursPerWeek: 8,
    description: "Hỗ trợ phòng kế toán cửa hàng gõ lại các chứng từ nhập hàng, biên bản giao nhận vào file Excel nội bộ.",
    responsibilities: [
      "Nhập thông tin mã hàng, số lượng và đơn giá từ hóa đơn giấy",
      "Đối chiếu tổng tiền khớp giữa hóa đơn và phần mềm",
      "Lưu trữ hồ sơ giấy vào từng bìa còng theo tháng"
    ],
    requirements: [
      "Đánh máy nhanh, gõ phím số bàn phím rời chính xác",
      "Biết dùng hàm SUM, VLOOKUP cơ bản trong Excel",
      "Tính tình cẩn trọng, không để sót số liệu"
    ],
    benefits: [
      "Tích lũy kinh nghiệm thực tế về chứng từ kế toán kho",
      "Làm việc tại văn phòng máy lạnh yên tĩnh",
      "Có xác nhận thực tập nếu sinh viên cần mộc tròn"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "closed",
    daysAgo: 18,
  },

  // --- 3. Sáng Tạo Số Tinh Vân (Agency Marketing) - Thuộc nhà tuyển dụng Demo (5 jobs) ---
  {
    companyKey: "sang-tao-tinh-van",
    title: "Cộng tác viên Viết Bài Social Media (Chủ đề Ẩm thực & Giới trẻ)",
    category: "Content / Social media",
    district: "Bình Thạnh",
    address: "135/22 Nguyễn Hữu Cảnh, Phường 22",
    workType: "linh-hoat",
    wagePerHour: 45000,
    wageNote: "Thưởng bài viết đạt trên 500 share",
    days: ["T2", "T3", "T5", "T7"],
    shifts: ["chieu"],
    hoursPerWeek: 16,
    description: "Viết caption và lên ý tưởng bài đăng cho các Fanpage F&B của khách hàng. Yêu cầu văn phong trẻ trung, dí dỏm, nắm bắt nhanh các hot trend của Gen Z.",
    responsibilities: [
      "Lên kịch bản nội dung 10-15 bài đăng hàng tuần cho kênh Facebook/IG",
      "Phối hợp với designer để chọn hình ảnh minh họa phù hợp",
      "Theo dõi bình luận và giải đáp thắc mắc của độc giả"
    ],
    requirements: [
      "Văn phong tự nhiên, đúng chính tả, không dùng từ ngữ sáo rỗng",
      "Thường xuyên lướt Threads, TikTok và cập nhật meme mới",
      "Gửi 2 bài viết mẫu ngắn cùng CV ứng tuyển"
    ],
    benefits: [
      "Chỉ cần lên văn phòng 1 buổi/tuần, còn lại làm việc tại nhà",
      "Được đào tạo bài bản về tư duy Content Strategy",
      "Tham gia các buổi ăn uống liên hoan dự án của công ty"
    ],
    experienceRequired: false,
    isUrgent: true,
    status: "open",
    daysAgo: 2,
  },
  {
    companyKey: "sang-tao-tinh-van",
    title: "Trợ lý Hậu kỳ & Cắt Ghép Video CapCut / TikTok",
    category: "Content / Social media",
    district: "Bình Thạnh",
    address: "135/22 Nguyễn Hữu Cảnh, Phường 22",
    workType: "tu-xa",
    wagePerHour: 50000,
    wageNote: "Tính theo giờ làm việc quy đổi qua output video",
    days: ["T3", "T5", "CN"],
    shifts: ["toi"],
    hoursPerWeek: 12,
    description: "Cắt ghép các cảnh quay thô thành video ngắn 30-60 giây đăng Reels và TikTok. Chỉ cần sử dụng thành thạo CapCut PC hoặc Premiere cơ bản.",
    responsibilities: [
      "Chèn phụ đề tự động, sửa lỗi chính tả và canh nhịp nhạc",
      "Lựa chọn sound effect vui nhộn phù hợp ngữ cảnh video",
      "Xuất file video đúng kích thước chuẩn 9:16 và màu sắc nét"
    ],
    requirements: [
      "Thao tác CapCut nhanh nhẹn, có gu chọn nhạc bắt tai",
      "Có máy tính cá nhân đáp ứng được việc dựng video nhẹ",
      "Đúng deadline đã thỏa thuận cho từng clip"
    ],
    benefits: [
      "Hoàn toàn làm việc online tại nhà hoặc ký túc xá",
      "Học hỏi kỹ thuật dựng video triệu view từ Lead Editor",
      "Thanh toán thù lao đều đặn 2 tuần một lần qua tài khoản"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 6,
  },
  {
    companyKey: "sang-tao-tinh-van",
    title: "Cộng tác viên Thiết kế Banner Canva & Adobe Illustrator",
    category: "Thiết kế",
    district: "Bình Thạnh",
    address: "135/22 Nguyễn Hữu Cảnh, Phường 22",
    workType: "linh-hoat",
    wagePerHour: 55000,
    wageNote: "Có thưởng theo dự án hoàn thành tốt",
    days: ["T2", "T4", "T6"],
    shifts: ["sang"],
    hoursPerWeek: 12,
    description: "Thiết kế các ấn phẩm mạng xã hội như post thông báo, cover, story khuyến mãi theo bộ nhận diện thương hiệu sẵn có.",
    responsibilities: [
      "Layout text và hình ảnh sản phẩm theo guideline mẫu",
      "Resize kích thước banner cho đa nền tảng (Facebook, Instagram, Zalo)",
      "Lưu trữ file thiết kế gọn gàng trên Google Drive chung"
    ],
    requirements: [
      "Thành thạo Canva Pro hoặc Adobe Photoshop / Illustrator cơ bản",
      "Hiểu biết về độ tương phản chữ, khoảng cách lề và màu sắc hài hòa",
      "Đính kèm link Portfolio (Behance / Drive) gồm 3-5 tác phẩm"
    ],
    benefits: [
      "Cung cấp tài khoản Canva Pro và kho tài nguyên vector bản quyền",
      "Review chuyên môn 1-1 giúp nâng cao tay nghề thiết kế",
      "Làm việc cùng đội ngũ trẻ trung 100% sinh viên và mới tốt nghiệp"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 9,
  },
  {
    companyKey: "sang-tao-tinh-van",
    title: "Seeding & Quản lý Nhóm Sinh viên TP.HCM",
    category: "Content / Social media",
    district: "Bình Thạnh",
    address: "135/22 Nguyễn Hữu Cảnh, Phường 22",
    workType: "tu-xa",
    wagePerHour: 40000,
    wageNote: "Thưởng tài khoản tương tác tự nhiên cao",
    days: ["T2", "T3", "T4", "T5", "T6", "T7"],
    shifts: ["toi"],
    hoursPerWeek: 15,
    description: "Tham gia thảo luận, trả lời câu hỏi và chia sẻ thông tin học tập, việc làm hữu ích vào các hội nhóm sinh viên tại TP.HCM một cách chân thực.",
    responsibilities: [
      "Theo dõi các chủ đề nóng trong các group sinh viên các trường",
      "Bình luận khéo léo dẫn dắt thảo luận tự nhiên, văn minh",
      "Báo cáo link bài viết và số lượng tương tác hàng ngày"
    ],
    requirements: [
      "Có tài khoản Facebook cá nhân hoạt động thường xuyên",
      "Hiểu tâm lý sinh viên, biết cách nói chuyện gần gũi",
      "Tuyệt đối không spam link bừa bãi vi phạm quy tắc nhóm"
    ],
    benefits: [
      "Chủ động hoàn toàn thời gian, làm lúc nào rảnh trong ngày",
      "Nâng cao kỹ năng quan sát cộng đồng mạng và xử lý thông tin",
      "Lương theo giờ được đối soát minh bạch hàng tháng"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 14,
  },
  {
    companyKey: "sang-tao-tinh-van",
    title: "Trợ lý Sự kiện Họp báo & Livestream Bán hàng",
    category: "Sự kiện / PG",
    district: "Quận 1",
    address: "Trung tâm Hội nghị Riverside Palace, Quận 4",
    workType: "tai-cho",
    wagePerHour: 60000,
    wageNote: "Phụ cấp trang phục 100k/buổi",
    days: ["T7", "CN"],
    shifts: ["chieu", "toi"],
    hoursPerWeek: 14,
    description: "Hỗ trợ chuẩn bị hậu trường, điều phối khách mời và chuẩn bị đạo cụ cho các buổi livestream ra mắt sản phẩm của khách hàng.",
    responsibilities: [
      "Đón tiếp và phát thẻ đeo cho khách mời tham dự",
      "Đưa sản phẩm mẫu cho MC trong suốt phiên livestream",
      "Hỗ trợ kiểm tra micro, ánh sáng đèn led trước giờ lên sóng"
    ],
    requirements: [
      "Ngoại hình chỉn chu, tác phong nhanh nhẹn và đúng giờ",
      "Khả năng ứng biến linh hoạt khi có sự cố kỹ thuật nhỏ",
      "Có thể làm thêm giờ nếu buổi livestream kéo dài (tính x1.5)"
    ],
    benefits: [
      "Mức thù lao hấp dẫn 60.000đ/giờ",
      "Gặp gỡ và học hỏi từ các KOLs, Creator nổi tiếng",
      "Được bao trọn bữa tối thịnh soạn tại sự kiện"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "closed",
    daysAgo: 20,
  },

  // --- 4. Bếp Nhà Lành (Nhà hàng & Ẩm thực) (5 jobs) ---
  {
    companyKey: "bep-nha-lanh",
    title: "Phục vụ Bàn Nhà Hàng Món Việt Trưa",
    category: "Phục vụ / F&B",
    district: "Quận 3",
    address: "214 Nam Kỳ Khởi Nghĩa, Phường Võ Thị Sáu",
    workType: "tai-cho",
    wagePerHour: 30000,
    wageNote: "Chia tiền tip hàng tuần",
    days: ["T2", "T3", "T4", "T5", "T6"],
    shifts: ["sang", "chieu"],
    hoursPerWeek: 20,
    description: "Nhà hàng phục vụ cơm trưa văn phòng cao cấp, cần bạn nhanh nhẹn bưng bê đồ ăn, châm trà đá và phục vụ khách công sở văn minh.",
    responsibilities: [
      "Chào đón khách và sắp xếp chỗ ngồi phù hợp",
      "Bưng bê mâm cơm và món ăn nóng sốt từ bếp ra bàn",
      "Lau dọn bàn ăn sạch sẽ sau khi khách hoàn tất bữa trưa"
    ],
    requirements: [
      "Tươi cười, lễ phép và biết lắng nghe yêu cầu của khách",
      "Tay chân nhanh nhẹn, giữ gìn vệ sinh cá nhân sạch sẽ",
      "Làm được từ 11h00 đến 14h30 các ngày trong tuần"
    ],
    benefits: [
      "Bao một bữa cơm trưa ngon lành với canh thịt đầy đặn",
      "Tiền tip chia đều mỗi thứ Sáu (trung bình 300k - 500k/tháng)",
      "Môi trường nhà hàng sạch sẽ, máy lạnh mát mẻ"
    ],
    experienceRequired: false,
    isUrgent: true,
    status: "open",
    daysAgo: 3,
  },
  {
    companyKey: "bep-nha-lanh",
    title: "Phụ bếp Rửa chén Bằng Máy & Sơ chế Rau Củ",
    category: "Phục vụ / F&B",
    district: "Quận 3",
    address: "214 Nam Kỳ Khởi Nghĩa, Phường Võ Thị Sáu",
    workType: "tai-cho",
    wagePerHour: 28000,
    wageNote: "Hỗ trợ găng tay và ủng bảo hộ",
    days: ["T2", "T4", "T6", "CN"],
    shifts: ["chieu", "toi"],
    hoursPerWeek: 16,
    description: "Khu vực bếp được trang bị máy rửa chén công nghiệp hiện đại, bạn chỉ cần gạt thức ăn thừa và xếp chén đĩa vào khay máy.",
    responsibilities: [
      "Xếp bát dĩa vào khay rửa và vận hành máy rửa bát tự động",
      "Lau khô và phân loại chén đĩa về đúng tủ bảo quản",
      "Nhặt rau muống, lột tỏi hành hỗ trợ đầu bếp"
    ],
    requirements: [
      "Chăm chỉ, thật thà và chịu được độ ẩm ướt khu rửa",
      "Có trách nhiệm với công việc được giao",
      "Không yêu cầu kinh nghiệm, được chỉ dẫn từ đầu"
    ],
    benefits: [
      "Không phải rửa tay hoàn toàn vì đã có máy hỗ trợ",
      "Bao ăn bữa chiều theo khẩu phần nhà hàng",
      "Không áp lực chỉ tiêu hay tiếp xúc khách hàng"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 11,
  },
  {
    companyKey: "bep-nha-lanh",
    title: "Lễ tân Đón tiếp & Hướng dẫn Chỗ đỗ xe",
    category: "Chăm sóc khách hàng",
    district: "Quận 3",
    address: "214 Nam Kỳ Khởi Nghĩa, Phường Võ Thị Sáu",
    workType: "tai-cho",
    wagePerHour: 35000,
    wageNote: "Được cấp áo dài / âu phục nhà hàng",
    days: ["T6", "T7", "CN"],
    shifts: ["toi"],
    hoursPerWeek: 12,
    description: "Đứng sảnh chính chào đón thực khách đến dùng bữa tối cuối tuần, kiểm tra tên đặt bàn trước và phối hợp cùng bảo vệ dắt xe.",
    responsibilities: [
      "Mở cửa, chào khách niềm nở và hỏi thông tin đặt bàn",
      "Dẫn khách vào bàn đã chuẩn bị sẵn theo danh sách",
      "Ghi nhận phản hồi của khách trước khi ra về"
    ],
    requirements: [
      "Ngoại hình ưa nhìn, nụ cười rạng rỡ và thân thiện",
      "Cao từ 1m58 (nữ) hoặc 1m68 (nam)",
      "Giọng nói truyền cảm, không ngọng hay dùng từ địa phương khó nghe"
    ],
    benefits: [
      "Được đào tạo kỹ năng đón tiếp chuẩn mực ngành Hospitality",
      "Đồng phục cao cấp miễn phí giặt ủi tại nhà hàng",
      "Mức lương cao trong khối ngành dịch vụ phục vụ"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 8,
  },
  {
    companyKey: "bep-nha-lanh",
    title: "Thu ngân & Điều phối Đơn hàng GrabFood / ShopeeFood",
    category: "Phục vụ / F&B",
    district: "Quận 3",
    address: "214 Nam Kỳ Khởi Nghĩa, Phường Võ Thị Sáu",
    workType: "tai-cho",
    wagePerHour: 32000,
    wageNote: "Thưởng đơn mang đi đúng giờ",
    days: ["T3", "T5", "T7"],
    shifts: ["sang", "chieu"],
    hoursPerWeek: 15,
    description: "Theo dõi máy tính bảng nhận đơn giao hàng tận nơi, in bill chuyển xuống bếp và đóng gói đồ ăn cẩn thận cho shipper.",
    responsibilities: [
      "Bấm nhận đơn trên các ứng dụng GrabFood, ShopeeFood",
      "Kiểm tra đủ hộp cơm, canh, đũa muỗng và đóng túi chống tràn",
      "Bàn giao đơn hàng nhanh chóng cho tài xế công nghệ"
    ],
    requirements: [
      "Thao tác máy tính bảng nhanh nhạy, không nhầm lẫn món",
      "Bình tĩnh xử lý khi quán đông khách vào giờ cao điểm",
      "Ưu tiên sinh viên chuyên ngành kinh tế, tài chính"
    ],
    benefits: [
      "Trực tiếp quản lý hệ thống bán hàng đa kênh thực tế",
      "Được giảm 20% khi mua đồ ăn mang về cho gia đình",
      "Môi trường làm việc trẻ trung, đồng nghiệp hỗ trợ nhau"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 15,
  },
  {
    companyKey: "bep-nha-lanh",
    title: "Nhân viên Pha chế Nước Mát & Tráng miệng Truyền Thống",
    category: "Phục vụ / F&B",
    district: "Quận 3",
    address: "214 Nam Kỳ Khởi Nghĩa, Phường Võ Thị Sáu",
    workType: "tai-cho",
    wagePerHour: 31000,
    wageNote: "Có thưởng chuyên cần",
    days: ["T2", "T4", "T6"],
    shifts: ["toi"],
    hoursPerWeek: 12,
    description: "Chuyên phụ trách quầy nước mát: sâm bông cúc, mủ trôm nha đam và múc các chén chè sương sáo tráng miệng cho khách.",
    responsibilities: [
      "Nấu nước sâm theo công thức đóng can sẵn",
      "Múc chè, thêm đá và trang trí lá dứa đẹp mắt",
      "Vệ sinh sạch sẽ ly tách và khay inox trước khi hết ca"
    ],
    requirements: [
      "Khéo léo, cẩn thận và ngăn nắp",
      "Tuân thủ nghiêm ngặt định lượng đường và đá",
      "Không để móng tay dài khi làm việc quầy bar"
    ],
    benefits: [
      "Học bí quyết nấu các loại nước thanh nhiệt dân gian",
      "Được uống nước mát miễn phí trong suốt ca trực",
      "Thời gian ca tối 18h - 22h rất hợp lịch học sinh viên"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 17,
  },

  // --- 5. Ngoại Ngữ Chân Trời Mới (Trung tâm ngoại ngữ) (5 jobs) ---
  {
    companyKey: "ngoai-ngu-chan-troi",
    title: "Trợ giảng Lớp Tiếng Anh Trẻ Em (IELTS Junior)",
    category: "Trợ giảng",
    district: "Quận 7",
    address: "Số 88 đường số 10, KDC Him Lam, Phường Tân Hưng",
    workType: "tai-cho",
    wagePerHour: 65000,
    wageNote: "Thưởng lớp đạt tỷ lệ chuyên cần 100%",
    days: ["T3", "T5", "T7"],
    shifts: ["toi"],
    hoursPerWeek: 10,
    description: "Đồng hành cùng giáo viên bản ngữ trong các lớp học sinh cấp 1 và cấp 2. Hỗ trợ quản lý lớp, giải thích từ vựng khó và tổ chức trò chơi tương tác.",
    responsibilities: [
      "Hỗ trợ giáo viên nước ngoài phát tài liệu và chuẩn bị máy chiếu",
      "Kèm cặp các bé yếu kỹ năng phát âm và làm bài tập về nhà",
      "Viết nhật ký nhận xét tình hình học tập gửi phụ huynh sau mỗi buổi"
    ],
    requirements: [
      "Tiếng Anh giao tiếp lưu loát (tương đương IELTS 6.5+ hoặc TOEIC 800+)",
      "Yêu trẻ em, kiên nhẫn và biết tạo không khí vui nhộn",
      "Cam kết theo trọn vẹn khóa học kéo dài 3 tháng"
    ],
    benefits: [
      "Luyện tập phản xạ tiếng Anh 100% với thầy cô bản ngữ",
      "Học bổng giảm 50% học phí các khóa IELTS nâng cao tại trung tâm",
      "Cấp giấy chứng nhận trợ giảng có giá trị làm đẹp CV du học"
    ],
    experienceRequired: true,
    isUrgent: true,
    status: "open",
    daysAgo: 1,
  },
  {
    companyKey: "ngoai-ngu-chan-troi",
    title: "Trực Quầy Tư Vấn Khóa Học & Chăm Sóc Học Viên",
    category: "Chăm sóc khách hàng",
    district: "Quận 7",
    address: "Số 88 đường số 10, KDC Him Lam, Phường Tân Hưng",
    workType: "tai-cho",
    wagePerHour: 40000,
    wageNote: "+100.000đ khi học viên đăng ký mới",
    days: ["T2", "T4", "T6"],
    shifts: ["chieu"],
    hoursPerWeek: 15,
    description: "Tiếp đón phụ huynh và học viên đến làm bài test đầu vào, giải đáp thắc mắc về lộ trình học và học phí các lớp tiếng Anh.",
    responsibilities: [
      "Phát đề thi thử và canh giờ cho học viên làm bài kiểm tra năng lực",
      "Nhập điểm thi vào hệ thống và hẹn giờ gặp chuyên viên tư vấn",
      "Gọi điện nhắc lịch học và thăm hỏi học viên vắng buổi"
    ],
    requirements: [
      "Giọng nói truyền cảm, tự tin và có duyên ăn nói",
      "Sử dụng tốt Google Sheets và máy in văn phòng",
      "Có tinh thần trách nhiệm và biết lắng nghe"
    ],
    benefits: [
      "Thưởng hoa hồng theo số lượng học viên ghi danh thành công",
      "Môi trường giáo dục hiện đại, chuyên nghiệp",
      "Được sử dụng thư viện sách ngoại văn miễn phí"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 6,
  },
  {
    companyKey: "ngoai-ngu-chan-troi",
    title: "Chấm Bài & Sửa Lỗi Ngữ Pháp Writing Online",
    category: "Dịch thuật",
    district: "Quận 7",
    address: "Số 88 đường số 10, KDC Him Lam, Phường Tân Hưng",
    workType: "tu-xa",
    wagePerHour: 80000,
    wageNote: "Tính theo số bài chấm quy đổi giờ",
    days: ["T2", "T4", "CN"],
    shifts: ["toi"],
    hoursPerWeek: 8,
    description: "Nhận bài viết luận Task 1 và Task 2 của học sinh qua Google Docs, gạch chân lỗi ngữ pháp, gợi ý từ vựng band điểm cao hơn và ghi nhận xét chi tiết.",
    responsibilities: [
      "Soát lỗi chính tả, ngữ pháp và cấu trúc câu trong bài làm",
      "Chấm điểm theo rubric 4 tiêu chí chấm thi IELTS chuẩn",
      "Gợi ý cách diễn đạt tự nhiên hơn bằng tiếng Anh chuẩn xác"
    ],
    requirements: [
      "IELTS Writing từ 7.0 trở lên (bắt buộc gửi bảng điểm kiểm tra)",
      "Kỹ năng nhận diện lỗi hành văn sắc bén và giải thích dễ hiểu",
      "Hoàn thành bài chấm trong vòng 48h kể từ khi nhận phân công"
    ],
    benefits: [
      "Mức thu nhập hấp dẫn 80.000đ/giờ làm việc tại nhà",
      "Rèn luyện kỹ năng viết và ngữ pháp tiếng Anh sâu sắc",
      "Thời gian linh hoạt tuyệt đối theo thời khóa biểu cá nhân"
    ],
    experienceRequired: true,
    isUrgent: false,
    status: "open",
    daysAgo: 12,
  },
  {
    companyKey: "ngoai-ngu-chan-troi",
    title: "Dịch Thuật Phụ Đề Video Bài Giảng Khoa Học",
    category: "Dịch thuật",
    district: "Quận 7",
    address: "Số 88 đường số 10, KDC Him Lam, Phường Tân Hưng",
    workType: "tu-xa",
    wagePerHour: 75000,
    wageNote: "Trả theo phút video dịch thuật",
    days: ["T3", "T6"],
    shifts: ["sang"],
    hoursPerWeek: 10,
    description: "Dịch các đoạn video ngắn về chủ đề khoa học tự nhiên, lịch sử, văn hóa từ tiếng Anh sang tiếng Việt để làm tài liệu học bổ trợ cho học viên.",
    responsibilities: [
      "Nghe và dịch chính xác nội dung video theo ngữ cảnh bài học",
      "Khớp timestamp phụ đề file .srt bằng phần mềm Aegisub hoặc CapCut",
      "Biên tập câu từ tiếng Việt mượt mà, dễ hiểu với học sinh"
    ],
    requirements: [
      "Vốn từ vựng phong phú và kỹ năng nghe hiểu tiếng Anh xuất sắc",
      "Khả năng diễn đạt tiếng Việt thuần thục, tự nhiên",
      "Có máy tính và tai nghe cách âm tốt"
    ],
    benefits: [
      "Chủ động nhận việc tùy theo tuần thi bận rộn hay rảnh rỗi",
      "Mở rộng kiến thức tổng quát về khoa học công nghệ",
      "Thanh toán tiền công sòng phẳng qua chuyển khoản ngân hàng"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 16,
  },
  {
    companyKey: "ngoai-ngu-chan-troi",
    title: "Điều Phối Phòng Thi Thử IELTS Cuối Tuần",
    category: "Sự kiện / PG",
    district: "Quận 7",
    address: "Số 88 đường số 10, KDC Him Lam, Phường Tân Hưng",
    workType: "tai-cho",
    wagePerHour: 45000,
    wageNote: "Hỗ trợ bữa trưa tại trung tâm",
    days: ["T7", "CN"],
    shifts: ["sang", "chieu"],
    hoursPerWeek: 14,
    description: "Tổ chức các buổi thi thử 4 kỹ năng mô phỏng y hệt kỳ thi thật của Hội Đồng Anh và IDP cho hơn 50 thí sinh mỗi tuần.",
    responsibilities: [
      "Kiểm tra thẻ căn cước và đối chiếu danh sách thí sinh vào phòng",
      "Phát tai nghe, giấy nháp và đề thi nghe đọc viết đúng giờ quy định",
      "Thu bài thi, niêm phong túi bài và bàn giao cho ban khảo thí"
    ],
    requirements: [
      "Nghiêm túc, công tâm và tuân thủ chặt chẽ kỷ luật phòng thi",
      "Đúng giờ tuyệt đối (có mặt trước 7h15 sáng)",
      "Khả năng xử lý các tình huống thiết bị âm thanh bình tĩnh"
    ],
    benefits: [
      "Được tham gia thi thử IELTS 4 kỹ năng miễn phí 1 lần/tháng",
      "Bao cơm trưa ngon lành trong ngày làm việc",
      "Thời gian tập trung chỉ vào ngày thứ Bảy và Chủ nhật"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 10,
  },

  // --- 6. Gia Sư Trí Tuệ Trẻ (Trung tâm gia sư) (5 jobs) ---
  {
    companyKey: "gia-su-tri-tue-tre",
    title: "Gia Sư Dạy Toán & Khoa Học Lớp 8",
    category: "Gia sư",
    district: "Quận 10",
    address: "Chung cư Kingdom 101, Tô Hiến Thành",
    workType: "tai-cho",
    wagePerHour: 120000,
    wageNote: "Phụ huynh thanh toán trực tiếp mỗi cuối tuần",
    days: ["T3", "T5", "T7"],
    shifts: ["toi"],
    hoursPerWeek: 6,
    description: "Cần bạn sinh viên kèm 1-1 cho một bé nam học lớp 8 trường THCS Nguyễn Văn Tố. Mục tiêu củng cố kiến thức hình học và môn Khoa học tự nhiên.",
    responsibilities: [
      "Ôn tập lại lý thuyết bài giảng trên lớp và giải bài tập sách giáo khoa",
      "Chuẩn bị các câu hỏi trắc nghiệm kiểm tra định kỳ trước bài thi",
      "Báo cáo tiến độ học tập cho phụ huynh sau mỗi buổi dạy 2 tiếng"
    ],
    requirements: [
      "Điểm thi THPT môn Toán từ 8.5 trở lên hoặc là sinh viên khối Tự nhiên / Bách Khoa",
      "Phương pháp giảng giải kiên nhẫn, dễ hiểu, không quát mắng học sinh",
      "Đúng giờ và lịch sự khi đến nhà học sinh dạy học"
    ],
    benefits: [
      "Mức thù lao dạy kèm rất cao 120.000đ/giờ",
      "Thời gian dạy chỉ 1.5 - 2 tiếng mỗi buổi, không tốn nhiều thì giờ",
      "Gia đình học sinh học thức, tôn trọng gia sư và có quà bánh sau buổi học"
    ],
    experienceRequired: true,
    isUrgent: true,
    status: "open",
    daysAgo: 2,
  },
  {
    companyKey: "gia-su-tri-tue-tre",
    title: "Gia Sư Dạy Kèm Tiếng Việt & Rèn Chữ Cho Bé Lớp 1",
    category: "Gia sư",
    district: "Quận 5",
    address: "Đường Trần Hưng Đạo, Phường 2",
    workType: "tai-cho",
    wagePerHour: 100000,
    wageNote: "Thưởng nếu bé viết chữ đạt vở sạch chữ đẹp",
    days: ["T2", "T4", "T6"],
    shifts: ["toi"],
    hoursPerWeek: 6,
    description: "Dạy kèm cho bé gái 6 tuổi mới bước vào lớp 1 làm quen với bảng chữ cái, cách cầm bút đúng tư thế và đánh vần các câu chuyện ngắn.",
    responsibilities: [
      "Rèn tư thế ngồi học ngay ngắn và cách cầm bút máy không lem mực",
      "Hướng dẫn bé ghép vần, đọc to các đoạn văn ngắn theo chương trình mới",
      "Tạo các trò chơi đố vui để kích thích sự hào hứng học tập của bé"
    ],
    requirements: [
      "Ưu tiên các bạn nữ sinh viên Sư phạm Tiểu học hoặc KHXH&NV",
      "Chữ viết tay tròn trịa, đều nét và chuẩn mẫu chữ Tiểu học",
      "Rất dịu dàng, kiên trì và biết dỗ dành trẻ nhỏ"
    ],
    benefits: [
      "Thù lao 100.000đ/giờ trả đều đặn",
      "Môi trường kèm cặp ấm cúng, phụ huynh hỗ trợ tối đa",
      "Tích lũy kinh nghiệm sư phạm thực chiến quý giá"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 5,
  },
  {
    companyKey: "gia-su-tri-tue-tre",
    title: "Gia Sư Luyện Thi Chuyển Cấp Môn Tiếng Anh Lớp 9 Lên 10",
    category: "Gia sư",
    district: "Tân Bình",
    address: "Khu vực K300, Phường 12",
    workType: "tai-cho",
    wagePerHour: 130000,
    wageNote: "Thưởng 1.000.000đ khi học sinh đỗ trường công lập NV1",
    days: ["T2", "T5", "CN"],
    shifts: ["chieu"],
    hoursPerWeek: 6,
    description: "Kèm cho học sinh lớp 9 chuẩn bị thi tuyển sinh lớp 10 TP.HCM. Chú trọng giải đề thi các năm trước và nắm vững các bẫy ngữ pháp thường gặp.",
    responsibilities: [
      "Hệ thống hóa toàn bộ kiến thức ngữ pháp trọng tâm cấp THCS",
      "Cho học sinh luyện các đề thi thử chuyên và không chuyên",
      "Chỉ ra lỗi sai thường gặp khi làm bài đọc hiểu và điền từ"
    ],
    requirements: [
      "Sinh viên chuyên ngành Sư phạm Anh, Ngôn ngữ Anh hoặc có chứng chỉ IELTS 7.0+",
      "Có nắm rõ cấu trúc đề thi tuyển sinh 10 môn Anh của Sở GD&ĐT TP.HCM",
      "Nhiệt huyết, đôn đốc và truyền động lực cho học sinh giai đoạn nước rút"
    ],
    benefits: [
      "Mức lương cao 130.000đ/giờ",
      "Khoản tiền thưởng thành tích lớn khi học sinh đạt kết quả tốt",
      "Được trung tâm cung cấp ngân hàng tài liệu đề thi độc quyền"
    ],
    experienceRequired: true,
    isUrgent: true,
    status: "open",
    daysAgo: 4,
  },
  {
    companyKey: "gia-su-tri-tue-tre",
    title: "Gia Sư Dạy Lập Trình Scratch & Python Trẻ Em Online",
    category: "Gia sư",
    district: "Quận 1",
    address: "Dạy trực tuyến qua Zoom / Google Meet",
    workType: "tu-xa",
    wagePerHour: 110000,
    wageNote: "Nhận tiền sau mỗi buổi dạy",
    days: ["T7", "CN"],
    shifts: ["sang"],
    hoursPerWeek: 4,
    description: "Dạy học online qua Zoom cho các bé từ 9-12 tuổi làm quen với tư duy thuật toán thông qua việc kéo thả khối lệnh Scratch và lập trình Python game mini.",
    responsibilities: [
      "Chuẩn bị slide hình ảnh sinh động và bài thực hành mẫu",
      "Hướng dẫn học sinh tạo các trò chơi đơn giản như Flappy Bird, Rắn săn mồi",
      "Gợi mở tư duy logic và khuyến khích bé sáng tạo thêm tính năng mới"
    ],
    requirements: [
      "Sinh viên ngành CNTT, Kỹ thuật phần mềm hoặc Sư phạm Tin học",
      "Có micro và webcam rõ nét, mạng internet cáp quang ổn định",
      "Biết cách truyền đạt kiến thức công nghệ bằng ngôn ngữ dễ thương cho thiếu nhi"
    ],
    benefits: [
      "Dạy tại nhà qua Zoom, không mất thời gian di chuyển ngoài đường",
      "Mức thù lao hấp dẫn 110.000đ/giờ",
      "Giáo án đã được trung tâm chuẩn bị sẵn theo từng bài học"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 11,
  },
  {
    companyKey: "gia-su-tri-tue-tre",
    title: "Gia Sư Kèm Môn Hóa Học Lớp 11 (Ban Tự Nhiên)",
    category: "Gia sư",
    district: "Gò Vấp",
    address: "Đường Phan Văn Trị, Phường 7",
    workType: "tai-cho",
    wagePerHour: 115000,
    wageNote: "Hỗ trợ thêm xăng xe 50k/tuần",
    days: ["T4", "T6"],
    shifts: ["toi"],
    hoursPerWeek: 4,
    description: "Giúp học sinh lớp 11 vượt qua nỗi sợ môn Hóa hữu cơ: Hydrocarbon, Ancol, Phenol và các bài toán xác định công thức phân tử.",
    responsibilities: [
      "Giúp học sinh nhớ bản chất liên kết hóa học thay vì học vẹt",
      "Rèn kỹ năng cân bằng phương trình và giải toán hóa nhanh",
      "Khắc phục các lỗi sai hay gặp trong bài kiểm tra 1 tiết"
    ],
    requirements: [
      "Điểm Hóa thi đại học từ 8.5+ hoặc đạt giải HSG môn Hóa",
      "Có sổ tay ghi chú phương pháp giải nhanh Hóa học",
      "Tác phong sư phạm chuẩn mực, tận tụy với học sinh"
    ],
    benefits: [
      "Thu nhập 115k/giờ đều đặn hàng tuần",
      "Gia đình rất quý mến gia sư, hỗ trợ bữa ăn nhẹ",
      "Chỉ 2 buổi mỗi tuần, rất vừa vặn với lịch học đại học"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "closed",
    daysAgo: 21,
  },

  // --- 7. Studio Thiết Kế Khung Nhìn (Studio thiết kế) (5 jobs) ---
  {
    companyKey: "studio-khung-nhin",
    title: "Thực Tập Sinh Thiết Kế Đồ Họa 2D (Part-time)",
    category: "Thiết kế",
    district: "Quận 3",
    address: "Hẻm 400 Lê Văn Sỹ, Phường 14",
    workType: "tai-cho",
    wagePerHour: 40000,
    wageNote: "Hỗ trợ dấu mộc thực tập chuẩn chỉ",
    days: ["T2", "T3", "T5"],
    shifts: ["sang", "chieu"],
    hoursPerWeek: 18,
    description: "Studio chuyên làm branding cho các chuỗi nhà hàng và thương hiệu thời trang local brand. Cần bạn sinh viên năm 2-3 phụ trách vẽ vector và xuất file in ấn.",
    responsibilities: [
      "Vẽ lại các biểu tượng icon, logo dạng vector trên Illustrator",
      "Mockup bao bì, menu quán lên các khung ảnh mẫu 3D",
      "Chuẩn bị file in ấn đúng chuẩn hệ màu CMYK và độ phân giải 300dpi"
    ],
    requirements: [
      "Sử dụng tương đối thành thạo Adobe Illustrator và Photoshop",
      "Hiểu biết cơ bản về typography, khoảng cách lưới (grid) và màu sắc",
      "Gửi portfolio hoặc các sản phẩm bài tập đã làm ở trường"
    ],
    benefits: [
      "Được các Art Director giỏi trực tiếp chỉ bảo chuyên môn",
      "Làm việc tại studio xinh xắn tràn ngập cây xanh và ánh sáng",
      "Hỗ trợ đóng dấu mộc thực tập tốt nghiệp đầy đủ"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 5,
  },
  {
    companyKey: "studio-khung-nhin",
    title: "Cộng tác viên Chỉnh Sửa Ảnh Sản Phẩm Thương Mại Điện Tử",
    category: "Thiết kế",
    district: "Quận 3",
    address: "Làm việc từ xa / online",
    workType: "tu-xa",
    wagePerHour: 42000,
    wageNote: "Tính theo số lượng hình ảnh đạt chuẩn duyệt",
    days: ["T3", "T5", "T7"],
    shifts: ["toi"],
    hoursPerWeek: 12,
    description: "Nhận các file ảnh chụp sản phẩm thô (giày dép, quần áo, mỹ phẩm), thực hiện tách nền trắng, làm mịn bề mặt và chỉnh sáng đồng bộ.",
    responsibilities: [
      "Tách nền (pen tool) sản phẩm sạch sẽ không lẹm viền",
      "Cân bằng trắng và làm sạch các vết bụi bẩn nhỏ trên bề mặt mẫu",
      "Crop ảnh đúng tỷ lệ vuông 1:1 chuẩn Shopee, Lazada"
    ],
    requirements: [
      "Kéo Pen tool khéo léo, thao tác Photoshop nhanh gọn",
      "Có màn hình máy tính hiển thị màu tương đối chuẩn xác",
      "Tỉ mỉ, kiên nhẫn khi xử lý số lượng nhiều hình ảnh"
    ],
    benefits: [
      "Nhận việc làm tại nhà vào các buổi tối rảnh rỗi",
      "Lương theo giờ được cộng dồn thanh toán đúng hạn ngày 1 và 15",
      "Được chia sẻ trọn bộ action và plugin xử lý ảnh độc quyền"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 9,
  },
  {
    companyKey: "studio-khung-nhin",
    title: "Họa Sĩ Vẽ Minh Họa Truyện Tranh & Sticker Trẻ Em",
    category: "Thiết kế",
    district: "Quận 3",
    address: "Hẻm 400 Lê Văn Sỹ, Phường 14",
    workType: "linh-hoat",
    wagePerHour: 60000,
    wageNote: "Thưởng bản vẽ được duyệt ngay lần 1",
    days: ["T4", "T6", "CN"],
    shifts: ["chieu"],
    hoursPerWeek: 12,
    description: "Vẽ các nhân vật hoạt hình ngộ nghĩnh, bộ sticker Zalo và hình vẽ minh họa cho các cuốn sách kỹ năng sống của nhà xuất bản.",
    responsibilities: [
      "Phác thảo ý tưởng nhân vật theo mô tả kịch bản",
      "Đi nét và lên màu bằng phần mềm Clip Studio Paint hoặc Procreate",
      "Điều chỉnh nét vẽ theo phản hồi đóng góp của biên tập viên"
    ],
    requirements: [
      "Có bảng vẽ điện tử (Wacom / iPad) và nét vẽ dễ thương",
      "Khả năng sáng tạo hình ảnh nhân vật phong phú, giàu cảm xúc",
      "Đính kèm tối thiểu 3 hình vẽ cá nhân thể hiện rõ phong cách"
    ],
    benefits: [
      "Được in tên tác giả minh họa trang trọng trên ấn phẩm xuất bản",
      "Mức thù lao hấp dẫn 60.000đ/giờ",
      "Môi trường sáng tạo phóng khoáng, không gò bó rập khuôn"
    ],
    experienceRequired: true,
    isUrgent: false,
    status: "open",
    daysAgo: 13,
  },
  {
    companyKey: "studio-khung-nhin",
    title: "Phụ Tá Quản Lý Đạo Cụ Chụp Ảnh Studio",
    category: "Nhập liệu / Văn phòng",
    district: "Quận 3",
    address: "Hẻm 400 Lê Văn Sỹ, Phường 14",
    workType: "tai-cho",
    wagePerHour: 32000,
    wageNote: "Bao ăn nhẹ buổi xế",
    days: ["T2", "T5"],
    shifts: ["sang"],
    hoursPerWeek: 8,
    description: "Sắp xếp, lau chùi kho đạo cụ chụp ảnh (bình hoa, vải vóc, khối hình học), chuẩn bị phông nền chụp trước mỗi buổi chụp lookbook.",
    responsibilities: [
      "Xếp các khối hình gỗ, thảm trải sàn về đúng vị trí kệ sau buổi chụp",
      "Ủi phẳng các tấm phông vải chụp màu pastel",
      "Ghi chép danh mục đạo cụ cho khách thuê studio mượn"
    ],
    requirements: [
      "Gọn gàng, ngăn nắp, có tính cẩn thận và chu đáo",
      "Yêu thích không gian nghệ thuật và nhiếp ảnh",
      "Nhanh nhẹn, có sức khỏe tốt"
    ],
    benefits: [
      "Được tự do sử dụng studio để tự chụp ảnh cá nhân vào giờ trống",
      "Làm quen với các nhiếp ảnh gia và stylist thời trang nổi tiếng",
      "Công việc thư thả, không áp lực deadline"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 17,
  },
  {
    companyKey: "studio-khung-nhin",
    title: "Cộng tác viên Motion Graphic & Làm Video Animation 2D",
    category: "Thiết kế",
    district: "Quận 3",
    address: "Hẻm 400 Lê Văn Sỹ, Phường 14",
    workType: "tu-xa",
    wagePerHour: 70000,
    wageNote: "Hợp đồng dự án 2 tháng",
    days: ["T3", "T6"],
    shifts: ["toi"],
    hoursPerWeek: 10,
    description: "Làm chuyển động các nhân vật hoạt hình và hiệu ứng chữ động (kinetic typography) cho video quảng cáo truyền thông bằng After Effects.",
    responsibilities: [
      "Import các layer từ file AI vào Adobe After Effects",
      "Gắn xương và tạo chuyển động nhân vật bước đi, biểu cảm mặt",
      "Đồng bộ nhịp điệu chuyển động khớp với voiceover lời bình"
    ],
    requirements: [
      "Sử dụng tốt phần mềm Adobe After Effects",
      "Hiểu 12 nguyên lý chuyển động hoạt hình cơ bản",
      "Có laptop hoặc PC cấu hình khá để render video"
    ],
    benefits: [
      "Thu nhập rất tốt 70.000đ/giờ làm việc online",
      "Được bổ sung các dự án commercial xịn sò vào portfolio",
      "Nhận thanh toán nhanh gọn theo từng giai đoạn nghiệm thu"
    ],
    experienceRequired: true,
    isUrgent: false,
    status: "open",
    daysAgo: 8,
  },

  // --- 8. Công Nghệ Giải Pháp Trẻ Nova (Startup công nghệ) (5 jobs) ---
  {
    companyKey: "startup-nova",
    title: "Thực Tập Sinh Lập Trình Frontend React / TypeScript",
    category: "IT hỗ trợ / Lập trình",
    district: "TP. Thủ Đức",
    address: "Khu Công nghệ Cao, Đường D1, Phường Tân Phú",
    workType: "linh-hoat",
    wagePerHour: 60000,
    wageNote: "Review tăng lương sau 2 tháng thể hiện tốt",
    days: ["T2", "T4", "T6"],
    shifts: ["chieu"],
    hoursPerWeek: 15,
    description: "Tham gia đội ngũ xây dựng giao diện người dùng cho ứng dụng web quản lý bán hàng. Cơ hội tuyệt vời cho sinh viên CNTT cọ xát công nghệ mới.",
    responsibilities: [
      "Chuyển đổi bản thiết kế Figma thành component React sạch đẹp",
      "Sử dụng Tailwind CSS để style giao diện responsive đa thiết bị",
      "Tích hợp API backend thông qua Axios / React Query"
    ],
    requirements: [
      "Nắm vững JavaScript căn bản (ES6+) và React cơ bản (Hooks, State)",
      "Biết sử dụng Git (clone, commit, pull request, branch)",
      "Ham học hỏi, chủ động hỏi han khi gặp vấn đề vướng mắc"
    ],
    benefits: [
      "Được Senior Engineer trực tiếp code review từng pull request",
      "Văn phòng mở hiện đại có cà phê hạt, trà và snack miễn phí",
      "Hỗ trợ máy tính màn hình lớn tại văn phòng làm việc"
    ],
    experienceRequired: false,
    isUrgent: true,
    status: "open",
    daysAgo: 1,
  },
  {
    companyKey: "startup-nova",
    title: "Cộng tác viên Kiểm Thử Phần Mềm (Manual QA Tester)",
    category: "IT hỗ trợ / Lập trình",
    district: "TP. Thủ Đức",
    address: "Khu Công nghệ Cao, Đường D1, Phường Tân Phú",
    workType: "tai-cho",
    wagePerHour: 45000,
    wageNote: "Thưởng phát hiện lỗi bảo mật / logic nghiêm trọng",
    days: ["T3", "T5", "T7"],
    shifts: ["sang"],
    hoursPerWeek: 12,
    description: "Thực hiện kiểm thử các tính năng mới trên ứng dụng web và mobile, ghi nhận lỗi chi tiết kèm ảnh chụp màn hình lên hệ thống Jira.",
    responsibilities: [
      "Chạy test case theo danh sách kịch bản kiểm thử đã định",
      "Tái hiện các lỗi hiển thị, lỗi logic và mô tả rõ từng bước",
      "Kiểm tra lại (retest) các lỗi sau khi developer thông báo đã sửa xong"
    ],
    requirements: [
      "Rất tỉ mỉ, có tính kiên nhẫn bấm từng nút thử nghiệm",
      "Có tư duy logic tốt, thích tìm tòi các kịch bản sử dụng bất thường",
      "Ưu tiên sinh viên các ngành Hệ thống thông tin, CNTT, Toán tin"
    ],
    benefits: [
      "Hiểu rõ quy trình phát triển phần mềm chuẩn Scrum/Agile",
      "Nâng cao tư duy chất lượng sản phẩm (QA mindset)",
      "Được cấp dấu xác nhận thực tập doanh nghiệp chính quy"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 4,
  },
  {
    companyKey: "startup-nova",
    title: "Nhân viên Hỗ Trợ Kỹ Thuật Khách Hàng (IT Helpdesk Part-time)",
    category: "IT hỗ trợ / Lập trình",
    district: "TP. Thủ Đức",
    address: "Khu Công nghệ Cao, Đường D1, Phường Tân Phú",
    workType: "tai-cho",
    wagePerHour: 42000,
    wageNote: "Phụ cấp ca trực cuối tuần",
    days: ["T6", "T7", "CN"],
    shifts: ["toi"],
    hoursPerWeek: 15,
    description: "Tiếp nhận tin nhắn và cuộc gọi của chủ cửa hàng khi gặp sự cố không in được hóa đơn, lỗi kết nối máy quét mã vạch hoặc quên mật khẩu.",
    responsibilities: [
      "Trả lời tin nhắn hỗ trợ qua cổng chat trực tuyến Zalo OA",
      "Sử dụng UltraViewer / AnyDesk để cài đặt driver máy in từ xa",
      "Chuyển tiếp các sự cố phức tạp cho đội ngũ lập trình xử lý"
    ],
    requirements: [
      "Giao tiếp điềm đạm, kiên nhẫn lắng nghe khi khách hàng sốt ruột",
      "Rành cài đặt phần mềm máy tính Windows và mạng internet cơ bản",
      "Có thể đi ca tối và cuối tuần linh hoạt"
    ],
    benefits: [
      "Rèn luyện kỹ năng giải quyết vấn đề và giao tiếp khách hàng đỉnh cao",
      "Trực tại phòng máy lạnh yên tĩnh, có trà sữa ăn nhẹ ca tối",
      "Cơ hội được nhận làm nhân viên chính thức sau khi tốt nghiệp"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 7,
  },
  {
    companyKey: "startup-nova",
    title: "Cộng tác viên Dán Nhãn Dữ Liệu AI (Data Labeling)",
    category: "Nhập liệu / Văn phòng",
    district: "TP. Thủ Đức",
    address: "Làm việc tại nhà qua website",
    workType: "tu-xa",
    wagePerHour: 35000,
    wageNote: "Tính theo số lượng nhãn hoàn thành đúng",
    days: ["T2", "T3", "T4", "T5", "T6"],
    shifts: ["chieu"],
    hoursPerWeek: 15,
    description: "Xem các hình ảnh hóa đơn, biên lai thu tiền và dùng chuột khoanh vùng các trường thông tin: Tên hàng, Đơn giá, Tổng tiền để huấn luyện mô hình OCR.",
    responsibilities: [
      "Vẽ bounding box chính xác bao quanh các dòng chữ trên ảnh hóa đơn",
      "Gõ lại chính xác nội dung chữ viết trong khung hình",
      "Phân loại các ảnh bị nhòe, rách hoặc không hợp lệ"
    ],
    requirements: [
      "Mắt tốt, kiên trì, không chán nản với công việc lặp lại",
      "Đánh máy chuẩn xác, không tự ý suy diễn từ ngữ mờ",
      "Có máy tính kết nối internet ổn định"
    ],
    benefits: [
      "Làm việc online 100% mọi lúc mọi nơi thuận tiện",
      "Hiểu biết thú vị về cách huấn luyện mô hình trí tuệ nhân tạo (AI)",
      "Nhận tiền thù lao đúng hạn vào ngày 10 hàng tháng"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 13,
  },
  {
    companyKey: "startup-nova",
    title: "Lập Trình Viên Backend Node.js / PostgreSQL (Junior Part-time)",
    category: "IT hỗ trợ / Lập trình",
    district: "TP. Thủ Đức",
    address: "Khu Công nghệ Cao, Đường D1, Phường Tân Phú",
    workType: "linh-hoat",
    wagePerHour: 65000,
    wageNote: "Thưởng dự án theo milestone",
    days: ["T2", "T4", "T6"],
    shifts: ["sang"],
    hoursPerWeek: 14,
    description: "Viết các API CRUD phục vụ cho phân hệ quản lý kho hàng và báo cáo doanh thu, sử dụng Node.js, Express và cơ sở dữ liệu PostgreSQL.",
    responsibilities: [
      "Thiết kế schema bảng và viết các câu truy vấn SQL tối ưu",
      "Xây dựng RESTful API chuẩn hóa kèm tài liệu Swagger",
      "Viết unit test đơn giản đảm bảo luồng nghiệp vụ chạy đúng"
    ],
    requirements: [
      "Nắm chắc kiến thức cơ sở dữ liệu quan hệ (SQL, Index, Foreign Key)",
      "Biết viết code backend với Node.js hoặc Express",
      "Có ý thức bảo mật dữ liệu và validate input chặt chẽ"
    ],
    benefits: [
      "Mức lương 65.000đ/giờ rất cạnh tranh cho sinh viên IT",
      "Học hỏi kiến trúc microservice và cloud deployment thực tế",
      "Môi trường công nghệ hiện đại, khuyến khích sáng tạo cá nhân"
    ],
    experienceRequired: true,
    isUrgent: false,
    status: "closed",
    daysAgo: 19,
  },

  // --- 9. Giao Hàng Siêu Tốc Nam Sài Gòn (Công ty giao nhận) (5 jobs) ---
  {
    companyKey: "giao-hang-nam-sai-gon",
    title: "Tài Xế Giao Hàng Nội Thành Ca Linh Hoạt (Xe máy cá nhân)",
    category: "Giao hàng",
    district: "Quận 7",
    address: "Bưu cục 142 Nguyễn Thị Thập, Phường Tân Hưng",
    workType: "tai-cho",
    wagePerHour: 35000,
    wageNote: "Thu nhập thực tế 40k-55k/giờ gồm phụ cấp đơn",
    days: ["T2", "T3", "T4", "T5", "T6", "T7"],
    shifts: ["chieu"],
    hoursPerWeek: 18,
    description: "Giao nhận các bưu phẩm thương mại điện tử nhỏ gọn (quần áo, sách vở, mỹ phẩm) trong khu vực Quận 7 và Quận 4. Lộ trình tối ưu qua app định vị.",
    responsibilities: [
      "Nhận hàng tại bưu cục, quét mã vạch kiểm tra đơn trước khi đi",
      "Gọi điện thoại cho người nhận trước khi đến 5-10 phút",
      "Thu tiền thu hộ (COD) và nộp lại đầy đủ cho bưu tá trưởng cuối ca"
    ],
    requirements: [
      "Có xe máy cá nhân và bằng lái xe hạng A1 hợp lệ",
      "Điện thoại thông minh pin tốt để chạy ứng dụng giao hàng",
      "Thật thà, trung thực trong việc quản lý tiền hàng COD"
    ],
    benefits: [
      "Được cấp nón bảo hiểm, áo khoác đồng phục và thùng giao hàng",
      "Bảo hiểm tai nạn giao thông 24/7",
      "Chủ động đăng ký nhận ca sáng hoặc ca chiều theo ngày rảnh"
    ],
    experienceRequired: false,
    isUrgent: true,
    status: "open",
    daysAgo: 2,
  },
  {
    companyKey: "giao-hang-nam-sai-gon",
    title: "Nhân viên Phân Loại Kiện Hàng Ca Sáng Sớm",
    category: "Giao hàng",
    district: "Quận 7",
    address: "Kho trung chuyển Huỳnh Tấn Phát, Tân Thuận Đông",
    workType: "tai-cho",
    wagePerHour: 38000,
    wageNote: "Phụ cấp ca sớm (05h00 - 08h30)",
    days: ["T2", "T3", "T4", "T5", "T6", "T7"],
    shifts: ["sang"],
    hoursPerWeek: 20,
    description: "Làm việc tại kho phân loại hàng hóa từ xe tải lớn chuyển về, quét mã barcode và chia hàng về từng sọt theo tuyến đường quận huyện.",
    responsibilities: [
      "Bốc dỡ các bao tải hàng từ thùng xe tải xuống băng chuyền",
      "Dùng máy quét cầm tay bắn mã vạch từng gói hàng",
      "Xếp các gói hàng đúng vị trí giỏ của từng anh em shipper"
    ],
    requirements: [
      "Dậy sớm được ca 05h00 sáng (kết thúc 08h30 để kịp giờ lên giảng đường)",
      "Sức khỏe tốt, dẻo dai và chịu khó",
      "Nhanh tay lẹ mắt nhìn đúng số tuyến trên nhãn in"
    ],
    benefits: [
      "Mức lương giờ hấp dẫn 38k/giờ cho ca sáng sớm",
      "Thời gian xong việc sớm, không hề ảnh hưởng lịch học ban ngày",
      "Công việc vận động thể lực khỏe khoắn, đồng đội hòa đồng"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 5,
  },
  {
    companyKey: "giao-hang-nam-sai-gon",
    title: "Nhân viên Xử Lý Khiếu Nại & Đối Soát Đơn Hàng Hoàn",
    category: "Chăm sóc khách hàng",
    district: "Quận 7",
    address: "Bưu cục 142 Nguyễn Thị Thập, Phường Tân Hưng",
    workType: "tai-cho",
    wagePerHour: 34000,
    wageNote: "Thưởng xử lý giải cứu đơn hoàn thành công",
    days: ["T2", "T4", "T6"],
    shifts: ["chieu"],
    hoursPerWeek: 12,
    description: "Gọi điện lại cho các khách hàng chưa nhận được hàng (do bận máy, sai địa chỉ) để hẹn lại lịch giao lần 2, giảm thiểu tỷ lệ hàng bị hoàn về.",
    responsibilities: [
      "Kiểm tra danh sách đơn giao không thành công trong ngày",
      "Gọi điện thoại nhẹ nhàng hỏi thăm lý do và xác nhận lại thời gian hẹn",
      "Cập nhật ghi chú mới vào hệ thống quản lý đơn hàng nội bộ"
    ],
    requirements: [
      "Giọng nói truyền cảm, khả năng xoa dịu khách hàng đang bực bội",
      "Kỹ năng lắng nghe và ghi chép thông tin địa chỉ chuẩn xác",
      "Sử dụng thành thạo máy tính văn phòng cơ bản"
    ],
    benefits: [
      "Làm việc tại văn phòng bưu cục mát mẻ, không phải ra ngoài",
      "Được thưởng tiền mặt cho mỗi đơn hàng 'cứu' giao thành công",
      "Rèn luyện bản lĩnh giao tiếp và xử lý tình huống xuất sắc"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 10,
  },
  {
    companyKey: "giao-hang-nam-sai-gon",
    title: "Trực Quầy Nhận Gửi Hàng Bưu Cục Cuối Tuần",
    category: "Bán hàng / Cửa hàng",
    district: "Quận 4",
    address: "Số 50 Đoàn Văn Bơ, Phường 9",
    workType: "tai-cho",
    wagePerHour: 32000,
    wageNote: "Bao ăn trưa thứ Bảy và Chủ nhật",
    days: ["T7", "CN"],
    shifts: ["sang", "chieu"],
    hoursPerWeek: 14,
    description: "Tiếp đón khách hàng cá nhân và chủ shop online mang hàng đến bưu cục gửi, thực hiện cân trọng lượng, đo kích thước và in phiếu gửi.",
    responsibilities: [
      "Cân gói hàng và hướng dẫn khách khai báo thông tin người nhận",
      "In mã vận đơn dán lên kiện hàng và thu phí vận chuyển",
      "Hỗ trợ đóng hộp carton hoặc quấn màng xốp bong bóng nếu khách cần"
    ],
    requirements: [
      "Niềm nở, nhiệt tình hỗ trợ khách đóng gói đồ gửi",
      "Cẩn thận khi kiểm tra cân nặng và nhập số điện thoại",
      "Có thể làm cả ngày thứ 7 và Chủ nhật"
    ],
    benefits: [
      "Bao ăn trưa miễn phí tại bưu cục",
      "Chỉ làm việc 2 ngày cuối tuần, cực kỳ thuận tiện cho sinh viên",
      "Môi trường năng động, tiếp xúc nhiều chủ shop kinh doanh giỏi"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 15,
  },
  {
    companyKey: "giao-hang-nam-sai-gon",
    title: "Cộng tác viên Kiểm Kê Tài Sản & Thiết Bị Kho Bãi",
    category: "Nhập liệu / Văn phòng",
    district: "Quận 7",
    address: "Kho trung chuyển Huỳnh Tấn Phát, Tân Thuận Đông",
    workType: "tai-cho",
    wagePerHour: 33000,
    wageNote: "Hỗ trợ bữa ăn nhẹ",
    days: ["T7"],
    shifts: ["chieu"],
    hoursPerWeek: 5,
    description: "Định kỳ chiều thứ 7 hàng tuần tiến hành đếm số lượng giỏ nhựa, băng keo đóng hàng, máy in tem nhiệt và xe đẩy tại kho để báo cáo hao hụt.",
    responsibilities: [
      "Kiểm đếm số lượng công cụ dụng cụ theo danh mục mẫu",
      "Đánh dấu các thiết bị hư hỏng cần bảo dưỡng sửa chữa",
      "Nhập số liệu kiểm kê vào Google Sheet báo cáo cho quản lý kho"
    ],
    requirements: [
      "Tính tình cẩn thận, chi tiết, không bỏ sót đồ dùng",
      "Đúng giờ và có trách nhiệm với số liệu mình đếm",
      "Không yêu cầu bằng cấp hay kinh nghiệm trước đó"
    ],
    benefits: [
      "Công việc chỉ gói gọn trong 1 buổi chiều thứ Bảy duy nhất",
      "Thù lao thanh toán ngay sau khi hoàn thành buổi kiểm kê",
      "Phù hợp cho các bạn sinh viên muốn kiếm thêm chút thu nhập cuối tuần"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 18,
  },

  // --- 10. Sự Kiện Ánh Sao Sài Gòn (Công ty tổ chức sự kiện) (5 jobs) ---
  {
    companyKey: "su-kien-anh-sao",
    title: "PG / PB Tiếp Đón Khách Hàng Triển Lãm Công Nghệ",
    category: "Sự kiện / PG",
    district: "Quận 7",
    address: "Trung tâm Hội chợ và Triển lãm Sài Gòn (SECC)",
    workType: "tai-cho",
    wagePerHour: 70000,
    wageNote: "Phụ cấp trang phục & makeup 150k/ngày",
    days: ["T6", "T7", "CN"],
    shifts: ["sang", "chieu"],
    hoursPerWeek: 16,
    description: "Đại diện hình ảnh tại gian hàng công nghệ cao SECC. Nhiệm vụ phát brochure, hướng dẫn khách trải nghiệm các thiết bị thực tế ảo và chụp ảnh lưu niệm.",
    responsibilities: [
      "Đứng sảnh gian hàng chào khách với nụ cười thân thiện",
      "Phát tờ rơi giới thiệu thông số sản phẩm và quà tặng lưu niệm",
      "Mời khách quét mã QR tham gia vòng quay may mắn"
    ],
    requirements: [
      "Ngoại hình sáng sủa, cao từ 1m62 (nữ) hoặc 1m72 (nam)",
      "Tự tin giao tiếp trước đám đông, không rụt rè",
      "Có thể đứng liên tục trong ca làm (được nghỉ giải lao giữa giờ)"
    ],
    benefits: [
      "Mức thù lao hấp dẫn 70.000đ/giờ",
      "Cung cấp đồng phục vest / váy sự kiện cao cấp",
      "Cơ hội mở rộng quan hệ trong ngành truyền thông giải trí"
    ],
    experienceRequired: false,
    isUrgent: true,
    status: "open",
    daysAgo: 3,
  },
  {
    companyKey: "su-kien-anh-sao",
    title: "Nhân viên Điều Phối Check-in & Hướng Dẫn Hội Thảo",
    category: "Sự kiện / PG",
    district: "Quận 1",
    address: "Khách sạn Rex Sài Gòn, 141 Nguyễn Huệ",
    workType: "tai-cho",
    wagePerHour: 50000,
    wageNote: "Bao ăn buffet nhẹ hội thảo",
    days: ["T7"],
    shifts: ["sang"],
    hoursPerWeek: 6,
    description: "Trực bàn lễ tân tại hội thảo khởi nghiệp của các chuyên gia kinh tế. Tiếp đón đại biểu, quét mã QR vé điện tử và phát tài liệu hội nghị.",
    responsibilities: [
      "Quét mã QR vé mời trên smartphone của khách",
      "Phát thẻ đeo tên đại biểu và túi hồ sơ hội thảo",
      "Chỉ dẫn đường lên hội trường chính và phòng tiệc trà"
    ],
    requirements: [
      "Tác phong nhanh nhẹn, chuyên nghiệp và lịch sự",
      "Trang phục áo sơ mi trắng quần tây đen chuẩn công sở",
      "Biết tiếng Anh giao tiếp cơ bản khi đón khách ngoại quốc"
    ],
    benefits: [
      "Được nghe các bài diễn thuyết giá trị của các CEO hàng đầu",
      "Thưởng thức tiệc trà teabreak bánh ngọt cao cấp",
      "Nhận thù lao liền tay sau khi kết thúc buổi sự kiện"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 8,
  },
  {
    companyKey: "su-kien-anh-sao",
    title: "Phụ Trách Hậu Đài & Set-up Âm Thanh Ánh Sáng",
    category: "Sự kiện / PG",
    district: "Quận 10",
    address: "Sân khấu Ca nhạc Lan Anh, Cách Mạng Tháng 8",
    workType: "tai-cho",
    wagePerHour: 45000,
    wageNote: "Thưởng công việc nặng nhọc 50k/buổi",
    days: ["T6", "T7"],
    shifts: ["chieu", "toi"],
    hoursPerWeek: 12,
    description: "Hỗ trợ đội ngũ kỹ thuật khiêng loa, trải thảm đỏ, dán dây điện và sắp xếp ghế khán giả trước đêm nhạc giao lưu sinh viên các trường đại học.",
    responsibilities: [
      "Hỗ trợ di chuyển và cố định chân đèn sân khấu an toàn",
      "Kéo dây tín hiệu micro và dán băng keo cố định xuống sàn",
      "Phối hợp với đạo diễn sân khấu đưa đạo cụ vào ra đúng tiết mục"
    ],
    requirements: [
      "Nam sinh viên có sức khỏe tốt, chịu khó và nhiệt tình",
      "Tác phong nhanh nhẹn, nghe theo khẩu lệnh của tổ trưởng",
      "Mặc quần áo sẫm màu, đi giày bata dễ vận động"
    ],
    benefits: [
      "Được xem trực tiếp đêm nhạc của các ca sĩ thần tượng",
      "Bao ăn tối đầy đủ với cơm hộp nóng hổi và nước ngọt",
      "Thù lao xứng đáng với công sức bỏ ra"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 12,
  },
  {
    companyKey: "su-kien-anh-sao",
    title: "Hoạt Náo Viên & Hướng Dẫn Trò Chơi Teambuilding",
    category: "Sự kiện / PG",
    district: "TP. Thủ Đức",
    address: "Khu du lịch The BCR, Phường Trường Thạnh",
    workType: "tai-cho",
    wagePerHour: 60000,
    wageNote: "Bao xe đưa đón từ trung tâm thành phố",
    days: ["CN"],
    shifts: ["sang", "chieu"],
    hoursPerWeek: 8,
    description: "Đồng hành cùng MC chính tổ chức các trò chơi gắn kết tập thể ngoài trời (kéo co, nhảy bao bố, vượt chướng ngại vật) cho các đoàn công ty.",
    responsibilities: [
      "Bơm bóng, xếp nón chóp và chuẩn bị dụng cụ cho từng game",
      "Thổi còi làm trọng tài bấm giờ và ghi điểm cho các đội",
      "Cổ vũ, hò reo khuấy động tinh thần sảng khoái cho người chơi"
    ],
    requirements: [
      "Giọng to, khỏe, tràn đầy năng lượng tích cực và sự hài hước",
      "Không ngại nắng gió khi hoạt động ngoài trời",
      "Biết bơi hoặc có kỹ năng sơ cấp cứu cơ bản là lợi thế"
    ],
    benefits: [
      "Được xe du lịch máy lạnh đưa đón tận nơi từ trung tâm",
      "Ăn trưa thịnh soạn cùng ban tổ chức tại nhà hàng sinh thái",
      "Trải nghiệm một ngày cuối tuần thư giãn xả stress cực vui"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 16,
  },
  {
    companyKey: "su-kien-anh-sao",
    title: "Cộng tác viên Chụp Ảnh Phóng Sự Sự Kiện (Event Photographer)",
    category: "Thiết kế",
    district: "Quận 1",
    address: "Các địa điểm tổ chức sự kiện tại trung tâm TP.HCM",
    workType: "tai-cho",
    wagePerHour: 80000,
    wageNote: "Yêu cầu có máy ảnh DSLR / Mirrorless cá nhân",
    days: ["T6", "CN"],
    shifts: ["toi"],
    hoursPerWeek: 8,
    description: "Chụp ảnh ghi lại các khoảnh khắc đáng nhớ của khách tham dự, góc chụp toàn cảnh khán phòng và trao giải thưởng trên sân khấu.",
    responsibilities: [
      "Bắt trọn những nụ cười, cảm xúc thăng hoa của khách mời",
      "Chụp ảnh backdrop check-in chỉn chu chuẩn sáng",
      "Lọc ảnh và bàn giao file gốc ngay trong đêm kết thúc sự kiện"
    ],
    requirements: [
      "Có máy ảnh cá nhân kèm đèn flash rời (Speedlite)",
      "Kỹ năng bắt khoảnh khắc nhanh nhạy trong điều kiện thiếu sáng",
      "Gửi link album ảnh sự kiện đã từng chụp trước đây"
    ],
    benefits: [
      "Mức thù lao cao 80.000đ/giờ",
      "Xây dựng hồ sơ portfolio nhiếp ảnh sự kiện chuyên nghiệp",
      "Cơ hội được ký hợp đồng làm photographer chính thức cho các tour diễn"
    ],
    experienceRequired: true,
    isUrgent: false,
    status: "open",
    daysAgo: 14,
  },

  // --- 11. Sàn Mua Sắm Xanh Mộc (Thương mại điện tử) (5 jobs) ---
  {
    companyKey: "san-xanh-moc",
    title: "Trực Chat Tư Vấn Khách Hàng Shopee / TikTok Shop",
    category: "Chăm sóc khách hàng",
    district: "Tân Bình",
    address: "Làm việc từ xa tại nhà",
    workType: "tu-xa",
    wagePerHour: 36000,
    wageNote: "Thưởng hoa hồng 2% trên đơn tư vấn thành công",
    days: ["T2", "T4", "T6", "CN"],
    shifts: ["toi"],
    hoursPerWeek: 16,
    description: "Trả lời tin nhắn tư vấn công dụng sản phẩm xà bông thảo dược, trà giảm cân hữu cơ và đồ gia dụng tre nứa qua hộp thư Shopee và TikTok Shop.",
    responsibilities: [
      "Phản hồi tin nhắn của khách trong vòng 3 phút theo kịch bản sẵn",
      "Tư vấn giải đáp thắc mắc về thành phần và hạn sử dụng sản phẩm",
      "Hỗ trợ khách áp mã voucher giảm giá và theo dõi lộ trình đơn hàng"
    ],
    requirements: [
      "Tốc độ đánh máy nhanh nhẹn, câu từ ngọt ngào, kiên nhẫn",
      "Có smartphone hoặc máy tính kết nối mạng để trực tin nhắn",
      "Đọc kỹ cẩm nang kiến thức sản phẩm trước khi bắt đầu làm việc"
    ],
    benefits: [
      "Hoàn toàn làm việc tại nhà, vừa học bài vừa trực chat",
      "Hoa hồng thêm từ các đơn chốt thành công giúp tăng thu nhập",
      "Được tặng quà sản phẩm dùng thử miễn phí định kỳ"
    ],
    experienceRequired: false,
    isUrgent: true,
    status: "open",
    daysAgo: 2,
  },
  {
    companyKey: "san-xanh-moc",
    title: "Nhân viên Đóng Gói Hàng Hóa Eco-friendly",
    category: "Bán hàng / Cửa hàng",
    district: "Tân Bình",
    address: "Kho hàng 86 Phổ Quang, Phường 2",
    workType: "tai-cho",
    wagePerHour: 32000,
    wageNote: "Phụ cấp tiền ăn ca trưa 30.000đ",
    days: ["T2", "T3", "T4", "T5"],
    shifts: ["sang", "chieu"],
    hoursPerWeek: 18,
    description: "Đóng gói các đơn hàng mỹ phẩm thiên nhiên bằng hộp giấy tái chế, giấy tổ ong chèn hàng thân thiện môi trường thay vì dùng nilon bong bóng xốp.",
    responsibilities: [
      "In phiếu xuất kho và nhặt đúng sản phẩm từ các kệ hàng",
      "Quấn giấy tổ ong cẩn thận quanh các chai lọ thủy tinh",
      "Dán băng keo giấy nâu và dán nhãn vận chuyển lên nắp hộp"
    ],
    requirements: [
      "Gọn gàng, khéo tay, đóng gói hộp hàng vuông vức đẹp mắt",
      "Kiểm tra kỹ lưỡng đúng mã hàng để tránh gửi nhầm cho khách",
      "Nhanh nhẹn, có thể làm việc liên tục trong ca 4 tiếng"
    ],
    benefits: [
      "Làm việc tại kho máy quạt thông thoáng, sạch sẽ không khói bụi",
      "Phụ cấp tiền ăn trưa hỗ trợ sinh viên",
      "Nhận mức lương tính đúng từng phút làm việc"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 7,
  },
  {
    companyKey: "san-xanh-moc",
    title: "Cộng tác viên Đăng Sản Phẩm Lên Sàn (Product Listing)",
    category: "Nhập liệu / Văn phòng",
    district: "Tân Bình",
    address: "Làm việc từ xa / online",
    workType: "tu-xa",
    wagePerHour: 35000,
    wageNote: "Tính theo số lượng SKU sản phẩm đưa lên sàn",
    days: ["T3", "T5", "T7"],
    shifts: ["chieu"],
    hoursPerWeek: 10,
    description: "Đăng tải các sản phẩm mới lên sàn thương mại điện tử: tải ảnh sản phẩm, copy mô tả thông số kỹ thuật, chọn danh mục và cài đặt giá bán chuẩn.",
    responsibilities: [
      "Tạo mã SKU mới trên trang quản trị nhà bán hàng Shopee/Lazada",
      "Tối ưu tiêu đề sản phẩm chứa các từ khóa tìm kiếm phổ biến",
      "Điền đầy đủ các thuộc tính xuất xứ, khối lượng, hạn sử dụng"
    ],
    requirements: [
      "Hiểu biết cách thức hoạt động của các sàn thương mại điện tử",
      "Thao tác máy tính cẩn thận, không nhập sai dấu chấm phẩy giá tiền",
      "Biết chỉnh sửa kích thước ảnh cơ bản trên Canva là lợi thế"
    ],
    benefits: [
      "Linh hoạt tự sắp xếp giờ làm việc trong ngày bất cứ lúc nào",
      "Nắm vững kỹ năng vận hành sàn TMĐT - nghề cực hot hiện nay",
      "Thanh toán thù lao đều đặn 2 tuần một lần"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 11,
  },
  {
    companyKey: "san-xanh-moc",
    title: "Livestreamer Giới Thiệu Mỹ Phẩm Thuần Chay",
    category: "Content / Social media",
    district: "Tân Bình",
    address: "Studio 86 Phổ Quang, Phường 2",
    workType: "tai-cho",
    wagePerHour: 65000,
    wageNote: "Hoa hồng 1% doanh thu phiên live",
    days: ["T3", "T5", "T7"],
    shifts: ["toi"],
    hoursPerWeek: 9,
    description: "Lên sóng livestream trên kênh TikTok Shop của thương hiệu, test chất son, xịt khoáng và tương tác vui vẻ với người xem để kích cầu mua sắm.",
    responsibilities: [
      "Nắm vững kịch bản live và các chương trình khuyến mãi trong phiên",
      "Trực tiếp swatch sản phẩm lên tay và giải đáp câu hỏi người xem",
      "Kêu gọi người xem nhấn thả tim, follow kênh và bấm mua hàng"
    ],
    requirements: [
      "Làn da tương đối khỏe khoắn, nét mặt tươi tắn ăn hình",
      "Khả năng nói lưu loát, năng lượng dồi dào, không bị khớp trước ống kính",
      "Đã từng có kinh nghiệm livestream bán hàng là một điểm cộng lớn"
    ],
    benefits: [
      "Mức lương cứng 65.000đ/giờ kèm hoa hồng doanh số cực khủng",
      "Được tài trợ trọn bộ mỹ phẩm thuần chay dưỡng da hàng ngày",
      "Được đội ngũ kỹ thuật set-up sẵn đèn và máy quay chuyên nghiệp"
    ],
    experienceRequired: true,
    isUrgent: false,
    status: "open",
    daysAgo: 15,
  },
  {
    companyKey: "san-xanh-moc",
    title: "Nhân viên Kiểm Hàng Đầu Vào & Dán Tem Phụ",
    category: "Bán hàng / Cửa hàng",
    district: "Tân Bình",
    address: "Kho hàng 86 Phổ Quang, Phường 2",
    workType: "tai-cho",
    wagePerHour: 30000,
    wageNote: "Thanh toán theo tuần",
    days: ["T2", "T6"],
    shifts: ["sang"],
    hoursPerWeek: 8,
    description: "Kiểm tra hạn sử dụng các lô hàng ngũ cốc, dầu gội vừa nhập về kho và dán nhãn phụ tiếng Việt theo quy định trước khi đưa vào kệ lưu trữ.",
    responsibilities: [
      "Kiểm tra hạn sử dụng trên bao bì phải còn tối thiểu 12 tháng",
      "Dán tem phụ tiếng Việt ngay ngắn ở mặt sau sản phẩm",
      "Lập biên bản đổi trả nếu phát hiện hộp móp méo hay rách tem niêm phong"
    ],
    requirements: [
      "Mắt tinh, cẩn thận với ngày tháng năm sản xuất",
      "Thao tác tay bóc dán tem nhanh và chuẩn xác",
      "Trung thực, không giấu giếm hàng hỏng lỗi"
    ],
    benefits: [
      "Công việc thư thả nhẹ nhàng trong phòng kín mát mẻ",
      "Nhận lương đều đặn vào mỗi chiều thứ Sáu",
      "Ưu đãi mua hàng giảm giá 30% cho nhân viên"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 17,
  },

  // --- 12. Tổ Kén Học Tập & Co-working (Thư viện/Không gian học tập) (5 jobs) ---
  {
    companyKey: "to-ken-coworking",
    title: "Quản Lý Quầy Lễ Tân Không Gian Tự Học Ca Đêm",
    category: "Chăm sóc khách hàng",
    district: "Quận 10",
    address: "Tầng 3, 354 Tô Hiến Thành, Phường 14",
    workType: "tai-cho",
    wagePerHour: 36000,
    wageNote: "Hệ số ca đêm sau 22h",
    days: ["T2", "T4", "T6", "CN"],
    shifts: ["toi"],
    hoursPerWeek: 16,
    description: "Trực quầy lễ tân không gian học tập 24/7. Khách hàng là các bạn sinh viên mùa thi cử đến học bài đêm yên tĩnh. Môi trường tuyệt đối an ninh và văn minh.",
    responsibilities: [
      "Quét mã QR thẻ thành viên và giao chìa khóa tủ đồ cá nhân",
      "Pha cà phê phin tiếp thêm vào bình giữ nhiệt cho khách tự phục vụ",
      "Nhắc nhở khách đeo tai nghe giữ không gian tĩnh lặng chung"
    ],
    requirements: [
      "Tác phong điềm đạm, lịch sự, tôn trọng không gian yên tĩnh",
      "Có thể thức khuya trực ca đến 02h00 sáng",
      "Trung thực, có tinh thần trách nhiệm bảo quản tài sản chung"
    ],
    benefits: [
      "Được sử dụng miễn phí toàn bộ tiện ích phòng tự học lúc vắng khách",
      "Cà phê sạch, trà túi lọc và bánh quy dùng thoải mái không tốn tiền",
      "Môi trường học tập lý tưởng giúp bản thân có thêm động lực học giỏi"
    ],
    experienceRequired: false,
    isUrgent: true,
    status: "open",
    daysAgo: 3,
  },
  {
    companyKey: "to-ken-coworking",
    title: "Nhân viên Chăm Sóc Sách & Quản Lý Giá Sách Thư Viện",
    category: "Nhập liệu / Văn phòng",
    district: "Quận 10",
    address: "Tầng 3, 354 Tô Hiến Thành, Phường 14",
    workType: "tai-cho",
    wagePerHour: 30000,
    wageNote: "Hỗ trợ mượn sách về nhà miễn phí",
    days: ["T3", "T5", "T7"],
    shifts: ["chieu"],
    hoursPerWeek: 12,
    description: "Sắp xếp lại các cuốn sách kinh tế, công nghệ, ngoại ngữ trên các kệ sách theo mã phân loại sau khi người đọc để lại trên bàn.",
    responsibilities: [
      "Thu gom sách từ các bàn tự học và phân loại về đúng khu vực kệ",
      "Lau bụi các kệ sách định kỳ bằng khăn sợi mềm",
      "Dán lại gáy sách bị bong tróc hoặc bọc bìa kiếng sách mới nhập"
    ],
    requirements: [
      "Yêu quý sách vở, nâng niu từng trang sách",
      "Ngăn nắp, ghi nhớ tốt vị trí phân bổ từng nhóm chủ đề",
      "Làm việc nhẹ nhàng không gây tiếng ồn ảnh hưởng người xung quanh"
    ],
    benefits: [
      "Đặc quyền mượn sách mới về nhà đọc không giới hạn",
      "Môi trường làm việc thanh lịch, thơm ngát mùi sách và gỗ mộc",
      "Thời gian ca làm nhẹ nhàng 4 tiếng/ngày"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 8,
  },
  {
    companyKey: "to-ken-coworking",
    title: "Kỹ Thuật Viên Vận Hành Máy In & Máy Scan Tài Liệu",
    category: "IT hỗ trợ / Lập trình",
    district: "Quận 10",
    address: "Tầng 3, 354 Tô Hiến Thành, Phường 14",
    workType: "tai-cho",
    wagePerHour: 33000,
    wageNote: "Có phụ cấp ca sáng",
    days: ["T2", "T3", "T4", "T5"],
    shifts: ["sang"],
    hoursPerWeek: 16,
    description: "Hỗ trợ các bạn sinh viên in tài liệu tiểu luận, scan bài tập, đóng cuốn lò xo và khắc phục các lỗi kẹt giấy máy in cơ bản.",
    responsibilities: [
      "Thay giấy A4, nạp mực in và bấm lệnh in ấn theo yêu cầu",
      "Scan tài liệu thành file PDF và gửi qua email cho khách",
      "Bấm kim, dán gáy băng keo các tập tài liệu học tập"
    ],
    requirements: [
      "Rành thao tác in hai mặt, in thu phóng trên máy in Canon / HP",
      "Nhanh nhẹn, cẩn thận không làm thất lạc file USB của khách",
      "Vui vẻ, nhiệt tình chỉ dẫn bạn đọc"
    ],
    benefits: [
      "In ấn tài liệu học tập cá nhân miễn phí (tối đa 100 trang/tháng)",
      "Được rèn luyện kỹ năng xử lý thiết bị văn phòng chuyên nghiệp",
      "Lương theo giờ minh bạch, nhận tiền đúng hẹn"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 13,
  },
  {
    companyKey: "to-ken-coworking",
    title: "Phụ Trách Vệ Sinh & Khử Khuẩn Phòng Họp Nhóm",
    category: "Phục vụ / F&B",
    district: "Quận 10",
    address: "Tầng 3, 354 Tô Hiến Thành, Phường 14",
    workType: "tai-cho",
    wagePerHour: 32000,
    wageNote: "Trang bị đầy đủ găng tay và dụng cụ",
    days: ["T7", "CN"],
    shifts: ["sang", "chieu"],
    hoursPerWeek: 14,
    description: "Dọn dẹp bàn ghế, lau bảng trắng sau mỗi ca họp nhóm của khách hàng, đảm bảo phòng họp luôn thơm tho và sẵn sàng cho lượt khách tiếp theo.",
    responsibilities: [
      "Lau sạch mực bút lông trên bảng kính viết bút lông",
      "Xếp lại ghế xoay ngay ngắn và cắm lại dây kết nối máy chiếu HDMI",
      "Bật máy lọc không khí và xịt tinh dầu sả chanh khử mùi"
    ],
    requirements: [
      "Nhanh nhẹn, tháo vát dọn dẹp sạch sẽ trong vòng 10 phút giữa 2 lượt khách",
      "Tác phong ngăn nắp, chú ý các chi tiết nhỏ",
      "Làm được ngày thứ Bảy và Chủ nhật"
    ],
    benefits: [
      "Công việc ngắt quãng, có nhiều thời gian nghỉ ngơi giữa các ca phòng",
      "Được ngồi học tập tại phòng vip miễn phí khi không có lịch đặt",
      "Phụ cấp bữa trưa cho ca làm cả ngày cuối tuần"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 17,
  },
  {
    companyKey: "to-ken-coworking",
    title: "Điều Phối Sự Kiện Workshop Sách & Giao Lưu Tác Giả",
    category: "Sự kiện / PG",
    district: "Quận 10",
    address: "Tầng 3, 354 Tô Hiến Thành, Phường 14",
    workType: "tai-cho",
    wagePerHour: 45000,
    wageNote: "Thưởng sự kiện diễn ra thành công tốt đẹp",
    days: ["CN"],
    shifts: ["chieu"],
    hoursPerWeek: 5,
    description: "Hỗ trợ tổ chức các buổi câu lạc bộ đọc sách và trò chuyện cùng các tác giả sách trẻ vào mỗi chiều Chủ nhật hàng tuần.",
    responsibilities: [
      "Kê xếp bàn ghế hình chữ U tạo không khí ấm cúng gần gũi",
      "Chuẩn bị micro, hoa tươi và trà nước cho diễn giả khách mời",
      "Chụp ảnh tư liệu buổi giao lưu gửi vào nhóm thành viên"
    ],
    requirements: [
      "Yêu thích văn hóa đọc, tác phong giao tiếp nhẹ nhàng lễ phép",
      "Có mắt thẩm mỹ bố trí không gian bàn trà thân mật",
      "Đúng giờ, có mặt trước giờ bắt đầu workshop 45 phút"
    ],
    benefits: [
      "Được trò chuyện trực tiếp và nhận sách tặng có chữ ký tác giả",
      "Mức thù lao 45k/giờ cho công việc nhẹ nhàng giàu giá trị tinh thần",
      "Kết nối với cộng đồng những bạn trẻ yêu sách tại TP.HCM"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 11,
  },

  // --- 13. Chuỗi Bánh Mì Phố Xưa (F&B / Ẩm thực) (5 jobs) ---
  {
    companyKey: "banh-mi-pho-xua",
    title: "Nhân viên Bán Bánh Mì Đứng Quầy Ca Sáng (06:00 - 10:00)",
    category: "Phục vụ / F&B",
    district: "Bình Thạnh",
    address: "28 Điện Biên Phủ, Phường 15 (Ngay chân cầu Điện Biên Phủ)",
    workType: "tai-cho",
    wagePerHour: 28000,
    wageNote: "Tặng 1 ổ bánh mì ăn sáng chất lượng",
    days: ["T2", "T3", "T4", "T5", "T6"],
    shifts: ["sang"],
    hoursPerWeek: 20,
    description: "Quầy bánh mì phục vụ người đi làm và sinh viên buổi sáng. Bạn sẽ nướng giòn ổ bánh, rạch bánh, chan nước sốt, kẹp chả thịt và trao tận tay khách.",
    responsibilities: [
      "Làm nóng lò nướng và canh bánh mì giòn xốp",
      "Kẹp pate, bơ trứng, chả lụa và dưa leo theo đúng định lượng",
      "Tính tiền nhanh nhẹn, thối tiền chính xác không để khách chờ lâu"
    ],
    requirements: [
      "Dậy sớm được ca 05h45 sáng chuẩn bị mở quầy",
      "Nhanh tay lẹ mắt, có thể làm bánh liên tục khi đông khách",
      "Đeo bao tay vệ sinh thực phẩm trong suốt quá trình làm bánh"
    ],
    benefits: [
      "Miễn phí 1 ổ bánh mì kẹp thịt thơm ngon cho bữa sáng",
      "Ca làm kết thúc lúc 10h00 sáng, hoàn toàn kịp giờ học buổi trưa",
      "Lương thanh toán đúng hạn ngày mùng 1 hàng tháng"
    ],
    experienceRequired: false,
    isUrgent: true,
    status: "open",
    daysAgo: 1,
  },
  {
    companyKey: "banh-mi-pho-xua",
    title: "Phụ Bếp Nấu Nước Sốt Xíu Mại & Rang Bơ",
    category: "Phục vụ / F&B",
    district: "Bình Thạnh",
    address: "Bếp trung tâm, 28 Điện Biên Phủ, Phường 15",
    workType: "tai-cho",
    wagePerHour: 30000,
    wageNote: "Bao ăn ca chiều",
    days: ["T3", "T5", "T7"],
    shifts: ["chieu"],
    hoursPerWeek: 12,
    description: "Nấu nước sốt cà chua thịt viên xíu mại, quậy bơ trứng gà vàng ươm theo bí quyết gia truyền tại khu bếp trung tâm.",
    responsibilities: [
      "Xắt hành tây, băm thịt heo theo định lượng chuẩn",
      "Nấu nước sốt trên chảo lớn và đóng vào các hũ nhựa chịu nhiệt",
      "Vệ sinh sạch sẽ bếp gas công nghiệp và sàn bếp"
    ],
    requirements: [
      "Không ngại mùi khói bếp và nhiệt độ nóng khi đứng bếp",
      "Chăm chỉ, khỏe khoắn, tuân thủ nghiêm ngặt vệ sinh an toàn",
      "Có tinh thần học hỏi nghề bếp ẩm thực"
    ],
    benefits: [
      "Học được công thức nấu nước sốt bánh mì thơm ngon độc quyền",
      "Bữa ăn chiều nóng hổi đầy đủ dinh dưỡng",
      "Môi trường anh em bếp đoàn kết, chỉ dạy nhiệt tình"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 6,
  },
  {
    companyKey: "banh-mi-pho-xua",
    title: "Nhân viên Bán Bánh Mì Ca Chiều Tan Tầm (16:00 - 20:00)",
    category: "Phục vụ / F&B",
    district: "Phú Nhuận",
    address: "180 Phan Xích Long, Phường 2",
    workType: "tai-cho",
    wagePerHour: 28000,
    wageNote: "Thưởng doanh số vượt chỉ tiêu 500k/tháng",
    days: ["T2", "T4", "T6", "CN"],
    shifts: ["chieu"],
    hoursPerWeek: 16,
    description: "Đứng bán tại xe đẩy bánh mì trên trục đường ẩm thực Phan Xích Long sầm uất. Phục vụ khách ghé mua bánh mì ăn lót dạ sau giờ tan học và tan sở.",
    responsibilities: [
      "Kẹp bánh mì theo khẩu vị của khách (ít cay, nhiều rau, không hành)",
      "Bảo quản khay chả thịt luôn đậy nắp kính chống bụi đường",
      "Kiểm kê bánh mì còn lại cuối ca và dọn rửa tủ kính sạch sẽ"
    ],
    requirements: [
      "Thân thiện, giọng nói to rõ và nhanh nhẹn",
      "Biết sắp xếp công việc gọn gàng trên diện tích xe nhỏ",
      "Không đi trễ ca làm giờ cao điểm"
    ],
    benefits: [
      "Thưởng tiền mặt trực tiếp nếu doanh số quầy vượt mức đề ra",
      "Được mang bánh mì chưa bán hết về dùng nếu muốn",
      "Thời gian 4 tiếng mỗi ca rất thích hợp cho sinh viên học ca sáng"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 10,
  },
  {
    companyKey: "banh-mi-pho-xua",
    title: "Tiếp Thị & Phát Mẫu Bánh Mì Mini Dùng Thử",
    category: "Sự kiện / PG",
    district: "Bình Thạnh",
    address: "Khu vực cổng trường Đại học HUTECH & UEF",
    workType: "tai-cho",
    wagePerHour: 40000,
    wageNote: "Chỉ làm trong đợt khai trương 3 ngày",
    days: ["T2", "T3", "T4"],
    shifts: ["sang"],
    hoursPerWeek: 9,
    description: "Đứng tại booth sampling trước cổng trường đại học, mời các bạn sinh viên nếm thử bánh mì pate bơ mini và phát voucher giảm giá 20%.",
    responsibilities: [
      "Cắt nhỏ bánh mì thành từng miếng vừa ăn và xếp lên khay mẫu",
      "Mời mọc sinh viên ăn thử với nụ cười thân thiện, vui vẻ",
      "Phát tờ rơi voucher và giới thiệu địa chỉ chi nhánh mới"
    ],
    requirements: [
      "Hoạt bát, cởi mở, không ngại bắt chuyện với người lạ",
      "Ngoại hình sáng, trang phục đồng phục áo thun đỏ năng động",
      "Có thể đứng liên tục trong ca sáng 3 tiếng"
    ],
    benefits: [
      "Mức thù lao 40.000đ/giờ nhận ngay sau khi kết thúc đợt phát mẫu",
      "Công việc ngắn ngày, không ràng buộc thời gian lâu dài",
      "Ăn bánh mì xả láng trong buổi làm việc"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "closed",
    daysAgo: 20,
  },
  {
    companyKey: "banh-mi-pho-xua",
    title: "Tài Xế Giao Bánh Mì Nóng & Nguyên Liệu Cho Các Chi Nhánh",
    category: "Giao hàng",
    district: "Bình Thạnh",
    address: "Lộ trình: Bình Thạnh - Phú Nhuận - Quận 1",
    workType: "tai-cho",
    wagePerHour: 35000,
    wageNote: "Hỗ trợ 20.000đ tiền xăng mỗi ca",
    days: ["T3", "T5", "T7"],
    shifts: ["sang"],
    hoursPerWeek: 9,
    description: "Dùng xe máy chở sọt bánh mì nóng giòn từ lò bánh trung tâm phân phối đến 4 quầy bán lẻ trong bán kính 5km vào đầu giờ sáng.",
    responsibilities: [
      "Nhận bánh mì nóng từ lò, cho vào bao tải giữ nhiệt",
      "Chạy xe an toàn, không làm móp méo gãy bánh mì trên đường",
      "Ký nhận biên bản giao đủ số lượng bánh với các bạn đứng quầy"
    ],
    requirements: [
      "Có xe máy có gắn giá chở hàng (baga) chắc chắn",
      "Thông thạo đường ngõ ngách khu Bình Thạnh, Phú Nhuận",
      "Tác phong đúng giờ tuyệt đối để không trễ giờ mở bán"
    ],
    benefits: [
      "Hỗ trợ tiền xăng xe riêng biệt ngoài tiền lương",
      "Công việc gọn gàng chỉ trong vòng 2.5 - 3 tiếng đầu ngày",
      "Lương theo giờ cao, tính công minh bạch"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 14,
  },

  // --- 14. Trung Tâm Tin Học & Lập Trình Thực Chiến (Đào tạo & IT) (5 jobs) ---
  {
    companyKey: "tin-hoc-thuc-chien",
    title: "Trợ Giảng Lớp Tin Học Văn Phòng MOS (Word, Excel, PPT)",
    category: "Trợ giảng",
    district: "Quận 10",
    address: "Số 142 Tô Hiến Thành, Phường 14",
    workType: "tai-cho",
    wagePerHour: 50000,
    wageNote: "Thưởng học viên đạt điểm tuyệt đối 1000/1000",
    days: ["T2", "T4", "T6"],
    shifts: ["toi"],
    hoursPerWeek: 9,
    description: "Hỗ trợ giảng viên chính đi lại trong phòng máy tính, hướng dẫn các bạn sinh viên và người đi làm thực hành bài tập Excel, Word theo chuẩn đề thi MOS quốc tế.",
    responsibilities: [
      "Đi lại trong phòng máy giải đáp các thắc mắc khi học viên thực hành bị lỗi",
      "Chỉ dẫn cách sử dụng phím tắt, hàm tính VLOOKUP, INDEX, MATCH và PivotTable",
      "Điểm danh học viên và kiểm tra kết quả bài tập cuối buổi"
    ],
    requirements: [
      "Có chứng chỉ MOS Specialist hoặc Master điểm từ 850 trở lên",
      "Kiên nhẫn, nói năng từ tốn, biết cách cầm tay chỉ việc",
      "Đúng giờ, có mặt trước giờ học 15 phút để mở máy phòng lab"
    ],
    benefits: [
      "Nâng cao kiến thức và mẹo tin học văn phòng đỉnh cao",
      "Môi trường phòng lab máy lạnh hiện đại, mát mẻ",
      "Nhận thù lao giảng dạy 50.000đ/giờ ổn định hàng tháng"
    ],
    experienceRequired: true,
    isUrgent: false,
    status: "open",
    daysAgo: 4,
  },
  {
    companyKey: "tin-hoc-thuc-chien",
    title: "Trợ Giảng Lớp Nhập Môn Lập Trình Web (HTML, CSS, JS)",
    category: "Trợ giảng",
    district: "Quận 10",
    address: "Số 142 Tô Hiến Thành, Phường 14",
    workType: "tai-cho",
    wagePerHour: 55000,
    wageNote: "Hỗ trợ bữa ăn nhẹ giữa giờ",
    days: ["T3", "T5", "T7"],
    shifts: ["toi"],
    hoursPerWeek: 9,
    description: "Kèm cặp các bạn học viên mới bắt đầu học lập trình web làm quen với cú pháp thẻ HTML, thuộc tính CSS Flexbox/Grid và các sự kiện click nút JavaScript.",
    responsibilities: [
      "Soát lỗi chính tả cú pháp (syntax error) giúp học viên khi code bị lỗi",
      "Giải thích trực quan về mô hình hộp (box model) và layout giao diện",
      "Hỗ trợ học viên đẩy bài tập lên GitHub Pages để nộp đồ án"
    ],
    requirements: [
      "Sinh viên ngành CNTT từ năm 2 trở lên, nắm chắc HTML/CSS/JS thuần",
      "Kỹ năng debug lỗi code nhanh nhạy và giải thích dễ hiểu",
      "Thái độ niềm nở, khuyến khích học viên tự tin đặt câu hỏi"
    ],
    benefits: [
      "Củng cố cực kỳ vững chắc kiến thức nền tảng lập trình web",
      "Rèn luyện kỹ năng truyền đạt và sư phạm kỹ thuật",
      "Mở rộng mối quan hệ với các chuyên gia trong ngành phần mềm"
    ],
    experienceRequired: false,
    isUrgent: true,
    status: "open",
    daysAgo: 2,
  },
  {
    companyKey: "tin-hoc-thuc-chien",
    title: "Cộng tác viên Soạn Ngân Hàng Câu Hỏi Trắc Nghiệm Python",
    category: "Nhập liệu / Văn phòng",
    district: "Quận 10",
    address: "Làm việc từ xa / online",
    workType: "tu-xa",
    wagePerHour: 45000,
    wageNote: "Tính theo số lượng câu hỏi chất lượng được duyệt",
    days: ["T2", "T4", "T6"],
    shifts: ["chieu"],
    hoursPerWeek: 9,
    description: "Soạn các câu hỏi trắc nghiệm kèm giải thích đáp án chi tiết về các chủ đề: Kiểu dữ liệu, Vòng lặp, Hàm, Xử lý chuỗi trong ngôn ngữ lập trình Python.",
    responsibilities: [
      "Viết các đoạn code Python ngắn có bẫy logic thú vị",
      "Đưa ra 4 phương án lựa chọn và giải thích tại sao chọn đáp án đúng",
      "Định dạng nội dung theo template file Markdown chuẩn của trung tâm"
    ],
    requirements: [
      "Hiểu rõ cú pháp và hành vi thực thi của ngôn ngữ Python",
      "Chữ nghĩa rõ ràng, mạch lạc, giải thích khoa học và chuẩn xác",
      "Cam kết không copy y chang câu hỏi từ các trang web khác"
    ],
    benefits: [
      "Làm việc online tại nhà bất cứ thời điểm nào rảnh",
      "Kiến thức lập trình Python được ôn luyện sâu sắc",
      "Được nhận nhuận bút câu hỏi đều đặn theo từng đợt nghiệm thu"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 9,
  },
  {
    companyKey: "tin-hoc-thuc-chien",
    title: "Kỹ Thuật Viên Bảo Trì Phòng Máy & Cài Đặt Phần Mềm",
    category: "IT hỗ trợ / Lập trình",
    district: "Quận 10",
    address: "Số 142 Tô Hiến Thành, Phường 14",
    workType: "tai-cho",
    wagePerHour: 40000,
    wageNote: "Hỗ trợ tiền gửi xe",
    days: ["T7", "CN"],
    shifts: ["sang"],
    hoursPerWeek: 8,
    description: "Vệ sinh bàn phím, màn hình máy tính phòng lab, ghost lại hệ điều hành Windows sạch sẽ và cài đặt các phần mềm học tập (VS Code, Python, Office) trước tuần học mới.",
    responsibilities: [
      "Kiểm tra đường truyền dây mạng LAN và các cổng USB trên từng máy",
      "Cài đặt và cập nhật phần mềm công cụ lập trình theo yêu cầu giảng viên",
      "Thổi bụi thùng máy tính định kỳ tránh tình trạng nóng máy sập nguồn"
    ],
    requirements: [
      "Thành thạo kỹ năng cài win, cài driver và xử lý lỗi phần cứng nhẹ",
      "Cẩn thận, tỉ mỉ khi cắm rút các cổng kết nối dây cáp",
      "Chăm chỉ và có trách nhiệm với phòng máy được phân công"
    ],
    benefits: [
      "Được tự do sử dụng phòng máy cấu hình mạnh để học tập ngoài giờ",
      "Công việc tập trung vào 2 buổi sáng cuối tuần không vướng lịch học",
      "Môi trường công nghệ thực hành bổ ích"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "open",
    daysAgo: 15,
  },
  {
    companyKey: "tin-hoc-thuc-chien",
    title: "Cộng tác viên Thiết Kế Slide Bài Giảng Công Nghệ",
    category: "Thiết kế",
    district: "Quận 10",
    address: "Làm việc từ xa qua Figma / Canva",
    workType: "tu-xa",
    wagePerHour: 48000,
    wageNote: "Tính theo số slide bài giảng thiết kế xong",
    days: ["T3", "T5"],
    shifts: ["toi"],
    hoursPerWeek: 8,
    description: "Biến các tài liệu Word giáo trình công nghệ khô khan thành các bộ slide thuyết trình đẹp mắt, trực quan và dễ tiếp thu bằng Canva hoặc PowerPoint hiện đại.",
    responsibilities: [
      "Vẽ sơ đồ khối thuật toán (flowchart) minh họa quy trình code",
      "Tìm kiếm các icon và hình minh họa công nghệ đồng bộ phong cách",
      "Trình bày bố cục chữ to rõ, tương phản tốt để chiếu màn hình lớn"
    ],
    requirements: [
      "Gu thẩm mỹ hiện đại, yêu thích phong cách tối giản công nghệ",
      "Sử dụng tốt PowerPoint, Google Slides hoặc Canva",
      "Đọc hiểu được các thuật ngữ công nghệ thông tin cơ bản"
    ],
    benefits: [
      "Làm việc online tại nhà rất thoải mái",
      "Đọc trước được toàn bộ giáo trình công nghệ chất lượng cao của trung tâm",
      "Lương thanh toán đúng hạn vào ngày 15 hàng tháng"
    ],
    experienceRequired: false,
    isUrgent: false,
    status: "closed",
    daysAgo: 21,
  },
];

/**
 * Hàm thuần túy chuyển đổi RAW_SEED_JOBS sang cấu trúc lưu vào database,
 * tính toán posted_at và search_text tự động.
 */
export function buildPreparedJobs(companyIdMap: Record<string, string>, companyNameMap: Record<string, string>) {
  const now = new Date();

  return RAW_SEED_JOBS.map((j) => {
    const companyId = companyIdMap[j.companyKey];
    const companyName = companyNameMap[j.companyKey] || "";

    // Tính posted_at lùi về quá khứ theo số ngày quy định
    const postedAt = new Date(now.getTime() - j.daysAgo * 24 * 60 * 60 * 1000);

    // Chuẩn hóa search_text không dấu để phục vụ tìm kiếm nhanh
    const searchText = normalizeText(
      `${j.title} ${companyName} ${j.category} ${j.district} ${j.description} ${j.responsibilities.join(" ")} ${j.requirements.join(" ")}`
    );

    return {
      companyId,
      title: j.title,
      category: j.category,
      district: j.district,
      address: j.address,
      workType: j.workType,
      wagePerHour: j.wagePerHour,
      wageNote: j.wageNote,
      days: j.days,
      shifts: j.shifts,
      hoursPerWeek: j.hoursPerWeek,
      description: j.description,
      responsibilities: JSON.stringify(j.responsibilities),
      requirements: JSON.stringify(j.requirements),
      benefits: JSON.stringify(j.benefits),
      experienceRequired: j.experienceRequired,
      isUrgent: j.isUrgent,
      status: j.status,
      postedAt: postedAt.toISOString(),
      searchText,
    };
  });
}
