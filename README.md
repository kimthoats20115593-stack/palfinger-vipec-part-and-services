# PALFINGER VIPEC — Website công ty

Website song ngữ (VI/EN) cho PALFINGER VIPEC — đối tác phân phối phụ tùng cẩu gập chính hãng
và dịch vụ kỹ thuật sửa chữa/bảo dưỡng cẩu. Xây dựng bằng Next.js (Node.js), có trang quản trị
(CMS) riêng để tự cập nhật phụ tùng và tin tức mà không cần biết lập trình.

## Công nghệ sử dụng

- **Next.js 16** (App Router) + **TypeScript** — chạy trên Node.js
- **Tailwind CSS 4** — hệ thống thiết kế (màu sắc, typography) khai báo tại `src/app/globals.css`
- **Prisma + MySQL** — cơ sở dữ liệu cho phụ tùng, tin tức, yêu cầu liên hệ, tài khoản quản trị
- **NextAuth (Credentials)** — bảo vệ trang `/admin`
- **next-intl** — song ngữ VI (mặc định) / EN, dùng đường dẫn `/vi/...` và `/en/...`
- **Nodemailer** — gửi email thông báo khi có yêu cầu liên hệ/báo giá mới (tùy chọn, cấu hình qua `.env`)
- Đồng bộ tự động **model cẩu** và **dầu nhớt mỡ** thật từ vipec-vp.vn (`src/lib/vipecSync.ts`, xem
  Phần 3c trong [`DEPLOY.md`](./DEPLOY.md))

## Bắt đầu (chạy thử trên máy)

```bash
npm install
# Cần một database MySQL đang chạy, khai báo DATABASE_URL trong .env (xem .env.example)
npx prisma db push      # tạo bảng theo schema
npx prisma db seed      # tạo dữ liệu mẫu + tài khoản admin + đồng bộ model cẩu/dầu nhớt từ vipec-vp.vn
npm run dev
```

> Bước seed cần kết nối internet để lấy dữ liệu model cẩu/dầu nhớt mỡ thật từ vipec-vp.vn — nếu
> không có mạng, bước này chỉ in ra lỗi và bỏ qua, không làm hỏng phần seed còn lại.

Mở [http://localhost:3000](http://localhost:3000) — sẽ tự chuyển đến `/vi`.

Trang quản trị: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

**Tài khoản quản trị mặc định (đổi ngay sau khi triển khai thật):**
- Email: `admin@vipec-vp.vn`
- Mật khẩu: `PalfingerVipec@2026`

> Đổi mật khẩu bằng cách sửa trực tiếp trong Prisma Studio (`npm run db:studio`) — hash mật khẩu
> mới bằng bcrypt, hoặc tạo lại thông qua kịch bản seed với mật khẩu khác rồi chạy lại seed.

## Cấu trúc thư mục

```
prisma/schema.prisma        Định nghĩa cơ sở dữ liệu (CraneModel, Category, Part, Lubricant, NewsPost, Inquiry, Admin)
prisma/seed.ts               Dữ liệu mẫu + tài khoản admin + gọi đồng bộ VIPEC ban đầu
messages/vi.json, en.json    Toàn bộ văn bản giao diện song ngữ
src/app/[locale]/...         Các trang công khai (trang chủ, giới thiệu, dịch vụ, phụ tùng, dầu nhớt mỡ, so sánh, tin tức, liên hệ)
src/app/admin/...            Trang quản trị (CMS) — đăng nhập, CRUD model cẩu/phụ tùng/dầu nhớt/tin tức, danh sách yêu cầu
src/app/api/inquiries        API nhận form báo giá/liên hệ
src/app/api/admin/sync-vipec API đồng bộ dữ liệu từ vipec-vp.vn (nút bấm admin + Cron Job)
src/components/              Component giao diện dùng chung
src/lib/                     Prisma client, cấu hình auth, gửi email, đồng bộ VIPEC (vipecSync.ts), dữ liệu tĩnh (site.ts)
```

## Cập nhật nội dung thực tế trước khi bàn giao cho khách hàng

Toàn bộ nội dung hiện tại (văn bản, số điện thoại, địa chỉ, phụ tùng, tin tức) là **nội dung mẫu**
để minh họa cấu trúc và văn phong, cần thay thế bằng thông tin thật:

1. **Logo & favicon** — đã dùng logo thật (`public/logo-vipec.png`, `public/logo-palfinger.png`,
   `src/app/icon.png`).
2. **Thông tin liên hệ** — sửa số điện thoại, email, địa chỉ, giờ làm việc, link bản đồ tại
   `src/lib/site.ts`.
3. **Ảnh phụ tùng** — phụ tùng cẩu gập cụ thể hiện dùng minh họa SVG (`src/components/illustrations/`)
   vì vipec-vp.vn chưa công khai ảnh/SKU phụ tùng cẩu gập riêng lẻ. Model cẩu và sản phẩm dầu nhớt mỡ
   thì đã có ảnh thật, lấy tự động qua đồng bộ VIPEC.
4. **Phụ tùng & tin tức thật** — xóa dữ liệu mẫu và nhập nội dung thật qua trang quản trị `/admin`,
   không cần sửa code. Model cẩu và dầu nhớt mỡ nên dùng nút "Đồng bộ ngay" thay vì nhập tay.
5. **Văn bản giao diện khác** (tiêu đề trang, mô tả dịch vụ, giới thiệu công ty...) — sửa trong
   `messages/vi.json` và `messages/en.json`.

## Trang quản trị (CMS)

- `/admin` (Tổng quan) — số liệu tổng quan + nút **"Đồng bộ ngay"** lấy model cẩu/dầu nhớt mỡ thật
  từ vipec-vp.vn
- `/admin/crane-models` — thêm/sửa/xóa model cẩu (tự có sau khi đồng bộ, có thể nhập tay thêm)
- `/admin/parts` — thêm/sửa/xóa phụ tùng, gắn danh mục + model cẩu tương thích, nhập thông số kỹ
  thuật dùng cho mục so sánh, chọn hiển thị nổi bật trên trang chủ
- `/admin/lubricants` — thêm/sửa/xóa sản phẩm dầu/nhớt/mỡ (tự có sau khi đồng bộ), gắn loại + hãng
- `/admin/news` — viết/sửa/xóa bài tin tức, có thể lưu bản nháp (chưa đăng công khai)
- `/admin/inquiries` — xem toàn bộ yêu cầu báo giá/liên hệ gửi từ website, cập nhật trạng thái xử lý

Nội dung phụ tùng/tin tức/dầu nhớt mỡ đều nhập song ngữ (VI/EN) ngay trong form quản trị.

## Catalog công khai

- `/vi/parts` — 2 tab: **"Theo model cẩu"** (lọc phụ tùng theo model cẩu + danh mục) và
  **"Dầu nhớt mỡ"** (lọc theo loại: nhớt động cơ/thủy lực/hộp số-cầu/mỡ bôi trơn)
- Mỗi phụ tùng có nút **"So sánh"** — chọn tối đa 4 phụ tùng, xem bảng so sánh thông số tại
  `/vi/parts/compare` (danh sách chọn lưu ở trình duyệt người dùng, không cần đăng nhập)

## Kiểm tra chất lượng

```bash
npm run build   # build production, kiểm tra lỗi TypeScript/biên dịch
npm run lint    # kiểm tra lỗi code style
```

## Triển khai lên GitHub & Hostinger

Xem hướng dẫn chi tiết từng bước tại [`DEPLOY.md`](./DEPLOY.md).
