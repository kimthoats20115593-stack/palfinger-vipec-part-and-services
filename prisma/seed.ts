import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { syncFromVipec } from "../src/lib/vipecSync";

const prisma = new PrismaClient();

async function main() {
  // ----- Admin account -----
  const adminEmail = "kimthoats20115593@gmail.com";
  const adminPassword = "PalfingerVipec@2026";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash, name: "Quản trị viên" },
  });

  // ----- Categories -----
  const categoriesData = [
    { slug: "he-thong-thuy-luc", nameVi: "Hệ thống thủy lực", nameEn: "Hydraulic System", order: 1 },
    { slug: "van-dieu-khien", nameVi: "Van điều khiển", nameEn: "Control Valves", order: 2 },
    { slug: "moc-cau-cap", nameVi: "Móc cẩu & cáp", nameEn: "Hooks & Cables", order: 3 },
    { slug: "ket-cau-can-cau", nameVi: "Kết cấu cần cẩu", nameEn: "Boom Structure", order: 4 },
    { slug: "bom-mo-to", nameVi: "Bơm & mô-tơ thủy lực", nameEn: "Pumps & Motors", order: 5 },
    { slug: "he-thong-dieu-khien", nameVi: "Hệ thống điều khiển", nameEn: "Control System", order: 6 },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categories[cat.slug] = created.id;
  }

  // ----- Parts -----
  const partsData = [
    {
      sku: "PV-HC-2201",
      nameVi: "Xy lanh thủy lực nâng cần",
      nameEn: "Main Boom Lift Hydraulic Cylinder",
      categorySlug: "he-thong-thuy-luc",
      image: "cylinder",
      featured: true,
      price: 18_500_000,
      status: "Mới",
      unit: "Cái",
      stockQty: 4,
      descriptionVi:
        "Xy lanh thủy lực chính hãng dùng cho cơ cấu nâng cần cẩu gập, chịu áp lực cao, gioăng phớt đạt chuẩn chống rò rỉ. Lắp đặt trực tiếp, không cần gia công thêm.",
      descriptionEn:
        "Genuine hydraulic cylinder for the main boom lift mechanism, rated for high pressure with leak-proof seals. Direct fit, no additional machining required.",
      specs: [
        { label: "Áp suất làm việc", value: "350 bar" },
        { label: "Đường kính xy lanh", value: "Ø80 mm" },
        { label: "Hành trình piston", value: "1.200 mm" },
        { label: "Vật liệu", value: "Thép hợp kim mạ crôm" },
      ],
    },
    {
      sku: "PV-CV-1187",
      nameVi: "Van điều khiển tỷ lệ đa chức năng",
      nameEn: "Multi-Function Proportional Control Valve",
      categorySlug: "van-dieu-khien",
      image: "valve",
      featured: true,
      price: 12_300_000,
      status: "Mới",
      unit: "Cái",
      stockQty: 6,
      descriptionVi:
        "Van điều khiển tỷ lệ cho phép vận hành cần cẩu mượt mà, chính xác, tích hợp cảm biến áp suất bảo vệ quá tải.",
      descriptionEn:
        "Proportional control valve enabling smooth, precise crane operation, with an integrated pressure sensor for overload protection.",
      specs: [
        { label: "Áp suất làm việc", value: "320 bar" },
        { label: "Số kênh điều khiển", value: "8" },
        { label: "Điện áp vận hành", value: "24V DC" },
        { label: "Vật liệu", value: "Thân gang, van thép không gỉ" },
      ],
    },
    {
      sku: "PV-HK-0542",
      nameVi: "Móc cẩu chịu tải tiêu chuẩn",
      nameEn: "Standard Load-Rated Crane Hook",
      categorySlug: "moc-cau-cap",
      image: "hook",
      featured: true,
      price: 3_200_000,
      status: "Mới",
      unit: "Cái",
      stockQty: 15,
      descriptionVi:
        "Móc cẩu thép hợp kim rèn nguyên khối, có khóa an toàn, đạt chứng nhận tải trọng theo tiêu chuẩn ngành.",
      descriptionEn:
        "Forged alloy-steel crane hook with a safety latch, certified to industry load-rating standards.",
    },
    {
      sku: "PV-WR-0876",
      nameVi: "Cáp thép cẩu 6 tao",
      nameEn: "6-Strand Wire Rope",
      categorySlug: "moc-cau-cap",
      image: "cable",
      featured: false,
      price: 4_800_000,
      status: "Mới",
      unit: "Cuộn",
      stockQty: 8,
      descriptionVi:
        "Cáp thép bện 6 tao lõi thép, độ bền kéo cao, phù hợp môi trường vận hành khắc nghiệt ngoài trời.",
      descriptionEn:
        "6-strand, steel-core wire rope with high tensile strength, suited to demanding outdoor operating conditions.",
    },
    {
      sku: "PV-BM-3320",
      nameVi: "Đoạn cần gập trung gian",
      nameEn: "Intermediate Boom Extension Section",
      categorySlug: "ket-cau-can-cau",
      image: "boom",
      featured: true,
      price: 45_000_000,
      status: "Mới",
      unit: "Bộ",
      stockQty: 2,
      descriptionVi:
        "Đoạn cần trung gian bằng thép cường độ cao, đúng kích thước nguyên bản, đảm bảo lắp ráp khớp hoàn toàn với hệ thống cần chính.",
      descriptionEn:
        "High-strength steel intermediate boom section, manufactured to original dimensions for a perfect fit with the main boom assembly.",
    },
    {
      sku: "PV-PM-4410",
      nameVi: "Bơm thủy lực bánh răng",
      nameEn: "Gear-Type Hydraulic Pump",
      categorySlug: "bom-mo-to",
      image: "pump",
      featured: false,
      price: 9_600_000,
      status: "Mới",
      unit: "Cái",
      stockQty: 0,
      descriptionVi:
        "Bơm thủy lực bánh răng công suất ổn định, tiếng ồn thấp, tuổi thọ cao trong điều kiện vận hành liên tục.",
      descriptionEn:
        "Gear-type hydraulic pump delivering stable output with low noise and long service life under continuous operation.",
    },
    {
      sku: "PV-CT-5501",
      nameVi: "Bảng điều khiển từ xa",
      nameEn: "Radio Remote Control Panel",
      categorySlug: "he-thong-dieu-khien",
      image: "control",
      featured: false,
      price: 6_750_000,
      status: "Mới",
      unit: "Bộ",
      stockQty: 5,
      descriptionVi:
        "Bộ điều khiển từ xa không dây, chống nước, thao tác trực quan, tăng độ an toàn khi vận hành ở khoảng cách xa.",
      descriptionEn:
        "Wireless, water-resistant remote control panel with intuitive operation, improving safety when operating at a distance.",
    },
    {
      sku: "PV-GR-6620",
      nameVi: "Bộ bánh răng xoay mâm cẩu",
      nameEn: "Slewing Ring Gear Set",
      categorySlug: "ket-cau-can-cau",
      image: "gear",
      featured: false,
      price: 5_400_000,
      status: "Mới",
      unit: "Bộ",
      stockQty: 3,
      descriptionVi:
        "Bộ bánh răng xoay mâm cẩu chính hãng, gia công chính xác, đảm bảo vòng quay êm ái và ổn định.",
      descriptionEn:
        "Genuine slewing ring gear set, precision-machined for smooth and stable rotation.",
    },
    {
      // Real product — first live catalog item added by the client (photo, specs and
      // description supplied directly), replacing the sample "PV-CT-5501" placeholder
      // in the same category. That sample entry should be deleted from /admin/parts.
      sku: "PV-RC-7701",
      nameVi: "Điều khiển từ xa cẩu Palfinger (Remote Palfinger)",
      nameEn: "Palfinger Crane Radio Remote Control",
      categorySlug: "he-thong-dieu-khien",
      image: "control",
      photoUrl: "/parts/remote-control-palfinger.jpg",
      featured: true,
      descriptionVi:
        "Bộ điều khiển từ xa (Radio Remote Control) chính hãng dành cho cẩu gập Palfinger. Thiết kế công thái học, phím bấm nhạy bén, giúp người vận hành kiểm soát chính xác và an toàn tuyệt đối tại các công trường khắc nghiệt.",
      descriptionEn:
        "Genuine radio remote control for Palfinger knuckle boom cranes. Ergonomic design with responsive buttons, giving the operator precise and safe control on demanding job sites.",
      specs: [
        { label: "Loại thiết bị", value: "Điều khiển vô tuyến cầm tay" },
        {
          label: "Cấu hình thao tác",
          value:
            "4 cần gạt tuyến tính (Linear Levers) điều khiển các ty thủy lực, 1 nút dừng khẩn cấp (Emergency Stop) màu đỏ, và cụm công tắc bật/tắt chức năng",
        },
        {
          label: "Băng tần hoạt động",
          value: "Hỗ trợ chống nhiễu tín hiệu tần số cao (433 MHz / 868 MHz hoặc 2.4 GHz)",
        },
        { label: "Phạm vi điều khiển", value: "Tối đa 100m trong điều kiện không vật cản" },
        {
          label: "Cấp độ bảo vệ",
          value: "Chuẩn IP65 (Chống bụi bẩn hoàn toàn và chống nước phun áp lực thấp)",
        },
        {
          label: "Vật liệu vỏ",
          value: "Nhựa kỹ thuật cao cấp, tích hợp khung viền bảo vệ chống va đập, rơi rớt",
        },
        {
          label: "Khả năng tương thích",
          value:
            "Tương thích hoàn hảo với hệ thống van thủy lực và bo mạch điện tử của các dòng cẩu Palfinger PK Series",
        },
      ],
    },
  ];

  for (const part of partsData) {
    const { categorySlug, ...data } = part;
    await prisma.part.upsert({
      where: { sku: part.sku },
      update: {},
      create: { ...data, categoryId: categories[categorySlug] },
    });
  }

  // ----- News posts -----
  // Sample/placeholder posts used to live here (upserted by slug on every
  // deploy). That's exactly what kept resurrecting them after the admin
  // deleted them: db:seed reruns on every Hostinger build, sees the slug is
  // gone, and recreates it. The site now has real admin-authored articles
  // covering the same topics with genuine photos, so the placeholders were
  // removed outright rather than left to fight future deletions.

  // ----- Đồng bộ model cẩu + dầu nhớt mỡ thật từ vipec-vp.vn -----
  const syncSummary = await syncFromVipec();
  console.log(
    `Đồng bộ VIPEC: +${syncSummary.craneModels.created} model cẩu, +${syncSummary.lubricants.created} dầu nhớt mỡ` +
      (syncSummary.errors.length ? ` (lỗi: ${syncSummary.errors.join("; ")})` : "")
  );

  console.log("Seed hoàn tất.");
  console.log(`Đăng nhập admin: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
