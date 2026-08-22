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
      descriptionVi:
        "Bộ bánh răng xoay mâm cẩu chính hãng, gia công chính xác, đảm bảo vòng quay êm ái và ổn định.",
      descriptionEn:
        "Genuine slewing ring gear set, precision-machined for smooth and stable rotation.",
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
  const newsData = [
    {
      slug: "5-dau-hieu-can-bao-duong-cau-gap",
      titleVi: "5 dấu hiệu cho thấy cẩu gập của bạn cần được bảo dưỡng ngay",
      titleEn: "5 Signs Your Knuckle Boom Crane Needs Maintenance Now",
      excerptVi:
        "Nhận biết sớm các dấu hiệu bất thường giúp tránh sự cố nghiêm trọng và giảm chi phí sửa chữa về sau.",
      excerptEn:
        "Spotting early warning signs helps you avoid serious breakdowns and reduce repair costs down the line.",
      contentVi:
        "Cẩu gập là thiết bị vận hành liên tục trong điều kiện khắc nghiệt, vì vậy việc bảo dưỡng định kỳ đóng vai trò quan trọng trong việc duy trì an toàn và hiệu suất.\n\nDưới đây là 5 dấu hiệu phổ biến cho thấy cẩu của bạn cần được kiểm tra kỹ thuật ngay: rò rỉ dầu thủy lực tại các khớp nối, tiếng ồn bất thường khi nâng hạ cần, thời gian phản hồi điều khiển chậm hơn bình thường, cáp thép có dấu hiệu sờn hoặc đứt sợi, và mâm xoay phát ra tiếng kêu khi quay.\n\nNếu bạn nhận thấy bất kỳ dấu hiệu nào ở trên, hãy liên hệ đội kỹ thuật PALFINGER VIPEC để được kiểm tra và tư vấn kịp thời, tránh để sự cố nhỏ trở thành hư hỏng lớn.",
      contentEn:
        "Knuckle boom cranes operate continuously in demanding conditions, which makes scheduled maintenance essential for safety and performance.\n\nHere are 5 common signs that your crane needs a technical inspection: hydraulic oil leaks at joints, unusual noise when raising or lowering the boom, slower-than-normal control response, visible fraying or broken strands on the wire rope, and noise from the slewing ring during rotation.\n\nIf you notice any of these signs, contact the PALFINGER VIPEC technical team for a timely inspection — catching small issues early prevents costly breakdowns.",
    },
    {
      slug: "vi-sao-nen-dung-phu-tung-chinh-hang",
      titleVi: "Vì sao nên luôn sử dụng phụ tùng cẩu chính hãng",
      titleEn: "Why You Should Always Use Genuine Crane Parts",
      excerptVi:
        "Phụ tùng không chính hãng có thể tiết kiệm chi phí trước mắt nhưng tiềm ẩn rủi ro lớn về an toàn và chi phí vận hành.",
      excerptEn:
        "Non-genuine parts may save money upfront but carry significant safety and operating-cost risks.",
      contentVi:
        "Nhiều doanh nghiệp cân nhắc sử dụng phụ tùng thay thế giá rẻ để tiết kiệm chi phí ban đầu. Tuy nhiên, về lâu dài, điều này có thể gây ra nhiều rủi ro.\n\nPhụ tùng không chính hãng thường không đạt đúng dung sai kỹ thuật, dễ dẫn đến hao mòn nhanh, giảm hiệu suất và tăng nguy cơ hỏng hóc dây chuyền các bộ phận liên quan. Trong ngành cẩu, đây còn là vấn đề an toàn vận hành nghiêm trọng.\n\nPALFINGER VIPEC cam kết cung cấp 100% phụ tùng chính hãng, có nguồn gốc rõ ràng, giúp thiết bị của bạn vận hành đúng thông số kỹ thuật nguyên bản và kéo dài tuổi thọ tổng thể.",
      contentEn:
        "Many companies consider cheaper aftermarket parts to save on upfront costs. Over time, however, this can introduce significant risks.\n\nNon-genuine parts often fall outside proper technical tolerances, leading to faster wear, reduced performance, and a higher risk of cascading failures in related components. In the crane industry, this is also a serious operational safety concern.\n\nPALFINGER VIPEC is committed to supplying 100% genuine, traceable parts — keeping your equipment running to its original specification and extending its overall service life.",
    },
    {
      slug: "quy-trinh-kiem-dinh-an-toan-cau-gap",
      titleVi: "Quy trình kiểm định an toàn cẩu gập định kỳ",
      titleEn: "Periodic Knuckle Boom Crane Safety Inspection Process",
      excerptVi:
        "Tìm hiểu quy trình kiểm định an toàn tiêu chuẩn mà đội kỹ thuật PALFINGER VIPEC áp dụng cho mọi lần bảo dưỡng.",
      excerptEn:
        "Learn about the standard safety inspection process our technical team applies at every maintenance visit.",
      contentVi:
        "Kiểm định an toàn định kỳ là bước bắt buộc để đảm bảo cẩu gập vận hành đúng tiêu chuẩn và tuân thủ quy định pháp luật.\n\nQuy trình kiểm định của PALFINGER VIPEC bao gồm: kiểm tra kết cấu cần và mâm xoay, đo áp suất hệ thống thủy lực, kiểm tra tình trạng cáp thép và móc cẩu, thử tải theo tiêu chuẩn, và lập biên bản kiểm định kèm khuyến nghị bảo dưỡng.\n\nSau mỗi lần kiểm định, khách hàng sẽ nhận được báo cáo chi tiết cùng khuyến nghị cụ thể cho lần bảo dưỡng tiếp theo.",
      contentEn:
        "Periodic safety inspection is a mandatory step to keep knuckle boom cranes operating to standard and in compliance with regulations.\n\nThe PALFINGER VIPEC inspection process includes: structural inspection of the boom and slewing ring, hydraulic system pressure testing, wire rope and hook condition checks, standard load testing, and a documented inspection report with maintenance recommendations.\n\nAfter every inspection, customers receive a detailed report along with specific recommendations for the next maintenance cycle.",
    },
    {
      slug: "cau-hoi-thuong-gap-ve-bao-duong-cau",
      titleVi: "Câu hỏi thường gặp về lịch bảo dưỡng cẩu gập",
      titleEn: "Frequently Asked Questions About Crane Maintenance Schedules",
      excerptVi:
        "Giải đáp những thắc mắc phổ biến nhất của khách hàng về tần suất và nội dung bảo dưỡng cẩu gập.",
      excerptEn:
        "Answers to the most common customer questions about how often — and what — crane maintenance should cover.",
      contentVi:
        "Bao lâu nên bảo dưỡng cẩu gập một lần? Tần suất khuyến nghị phụ thuộc vào cường độ sử dụng, thông thường nên kiểm tra định kỳ mỗi 3-6 tháng đối với thiết bị hoạt động liên tục.\n\nBảo dưỡng định kỳ gồm những hạng mục gì? Bao gồm kiểm tra dầu thủy lực, hệ thống van điều khiển, cáp thép, kết cấu cần, và hiệu chỉnh các thông số vận hành theo khuyến nghị nhà sản xuất.\n\nNếu bỏ qua bảo dưỡng định kỳ thì sao? Nguy cơ hỏng hóc đột ngột tăng cao, chi phí sửa chữa lớn hơn nhiều so với chi phí bảo dưỡng phòng ngừa, và có thể ảnh hưởng đến an toàn vận hành.",
      contentEn:
        "How often should a knuckle boom crane be serviced? The recommended frequency depends on usage intensity — typically every 3-6 months for equipment in continuous operation.\n\nWhat does scheduled maintenance cover? It includes checking hydraulic oil, the control valve system, wire ropes, boom structure, and calibrating operating parameters to manufacturer recommendations.\n\nWhat happens if maintenance is skipped? The risk of sudden breakdown rises sharply, repair costs end up far higher than preventive maintenance, and operating safety can be compromised.",
    },
  ];

  for (const [i, post] of newsData.entries()) {
    await prisma.newsPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        ...post,
        coverImage: "default",
        publishedAt: new Date(Date.now() - i * 1000 * 60 * 60 * 24 * 7),
      },
    });
  }

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
