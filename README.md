# PALFINGER VIPEC — Website công ty

Website song ngữ (VI/EN) cho PALFINGER VIPEC — đối tác phân phối phụ tùng cẩu gập chính hãng
và dịch vụ kỹ thuật sửa chữa/bảo dưỡng cẩu. Xây dựng bằng Next.js (Node.js), có trang quản trị
(CMS) riêng để tự cập nhật phụ tùng và tin tức mà không cần biết lập trình.

## Công nghệ sử dụng

- **Next.js 16** (App Router) + **TypeScript** — chạy trên Node.js
- **Tailwind CSS 4** — hệ thống thiết kế (màu sắc, typography) khai báo tại `src/app/globals.css`
- **Prisma + SQLite** — cơ sở dữ liệu cho phụ tùng, tin tức, yêu cầu liên hệ, tài khoản quản trị
- **NextAuth (Credentials)** — bảo vệ trang `/admin`
- **next-intl** — song ngữ VI (mặc định) / EN, dùng đường dẫn `/vi/...` và `/en/...`
- **Nodemailer** — gửi email thông báo khi có yêu cầu liên hệ/báo giá mới (tùy chọn, cấu hình qua `.env`)

## Bắt đầu (chạy thử trên máy)

```bash
npm install
npx prisma db push      # tạo file database SQLite theo schema
npx prisma db seed      # tạo dữ liệu mẫu + tài khoản admin
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) — sẽ tự chuyển đến `/vi`.

Trang quản trị: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

**Tài khoản quản trị mặc định (đổi ngay sau khi triển khai thật):**
- Email: `admin@palfingervipec.com`
- Mật khẩu: `PalfingerVipec@2026`

> Đổi mật khẩu bằng cách sửa trực tiếp trong Prisma Studio (`npm run db:studio`) — hash mật khẩu
> mới bằng bcrypt, hoặc tạo lại thông qua kịch bản seed với mật khẩu khác rồi chạy lại seed.

## Cấu trúc thư mục

```
prisma/schema.prisma        Định nghĩa cơ sở dữ liệu (Category, Part, NewsPost, Inquiry, Admin)
prisma/seed.ts               Dữ liệu mẫu + tài khoản admin ban đầu
messages/vi.json, en.json    Toàn bộ văn bản giao diện song ngữ
src/app/[locale]/...         Các trang công khai (trang chủ, giới thiệu, dịch vụ, phụ tùng, tin tức, liên hệ)
src/app/admin/...            Trang quản trị (CMS) — đăng nhập, CRUD phụ tùng/tin tức, danh sách yêu cầu
src/app/api/inquiries        API nhận form báo giá/liên hệ
src/components/              Component giao diện dùng chung
src/lib/                     Prisma client, cấu hình auth, gửi email, dữ liệu tĩnh (site.ts)
```

## Cập nhật nội dung thực tế trước khi bàn giao cho khách hàng

Toàn bộ nội dung hiện tại (văn bản, số điện thoại, địa chỉ, phụ tùng, tin tức) là **nội dung mẫu**
để minh họa cấu trúc và văn phong, cần thay thế bằng thông tin thật:

1. **Logo & favicon** — hiện dùng logo chữ tạm "PV" (`src/components/layout/Logo.tsx`) vì chưa có
   file logo chính thức. Khi có logo thật, thay bằng `<Image>` và cập nhật `src/app/favicon.ico`.
   *Lưu ý bản quyền*: chỉ dùng logo/thương hiệu Palfinger chính thức khi có giấy phép đại lý xác nhận.
2. **Thông tin liên hệ** — sửa số điện thoại, email, địa chỉ, giờ làm việc, link bản đồ tại
   `src/lib/site.ts`.
3. **Ảnh sản phẩm/dịch vụ** — hiện dùng minh họa SVG (`src/components/illustrations/`) thay cho ảnh
   thật vì chưa có ảnh chính hãng. Khi có ảnh thật, có thể thay bằng `<Image>` trỏ tới file trong
   `public/` hoặc mở rộng model `Part`/`NewsPost` để lưu đường dẫn ảnh.
4. **Phụ tùng & tin tức thật** — xóa dữ liệu mẫu và nhập nội dung thật qua trang quản trị `/admin`,
   không cần sửa code.
5. **Văn bản giao diện khác** (tiêu đề trang, mô tả dịch vụ, giới thiệu công ty...) — sửa trong
   `messages/vi.json` và `messages/en.json`.

## Trang quản trị (CMS)

- `/admin/parts` — thêm/sửa/xóa phụ tùng, gắn danh mục, chọn hiển thị nổi bật trên trang chủ
- `/admin/news` — viết/sửa/xóa bài tin tức, có thể lưu bản nháp (chưa đăng công khai)
- `/admin/inquiries` — xem toàn bộ yêu cầu báo giá/liên hệ gửi từ website, cập nhật trạng thái xử lý

Nội dung phụ tùng/tin tức đều nhập song ngữ (VI/EN) ngay trong form quản trị.

## Kiểm tra chất lượng

```bash
npm run build   # build production, kiểm tra lỗi TypeScript/biên dịch
npm run lint    # kiểm tra lỗi code style
```

## Triển khai lên GitHub & Hostinger

Xem hướng dẫn chi tiết từng bước tại [`DEPLOY.md`](./DEPLOY.md).
