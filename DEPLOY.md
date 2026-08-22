# Hướng dẫn triển khai: GitHub → Hostinger

Tài liệu này hướng dẫn từng bước để đưa website PALFINGER VIPEC lên GitHub và triển khai chạy
thật trên Hostinger. Vì các bước dưới đây cần tài khoản/mật khẩu riêng của bạn (GitHub, Hostinger,
tên miền), bạn cần tự thực hiện — tài liệu này chỉ đưa ra lệnh và thao tác chính xác để làm theo.

---

## Phần 1 — Đưa code lên GitHub

1. Tạo tài khoản GitHub (nếu chưa có): https://github.com/signup
2. Tạo một repository mới (ví dụ tên `palfinger-vipec-website`), để **Private** nếu chưa muốn công khai.
3. Trong thư mục dự án, chạy lệnh sau để nối tới repo vừa tạo và đẩy code lên (thay đường dẫn URL
   bằng URL repo thật của bạn):

   ```bash
   git remote add origin https://github.com/<ten-tai-khoan>/palfinger-vipec-website.git
   git branch -M main
   git push -u origin main
   ```

4. Từ lần sau, mỗi khi có thay đổi code, chỉ cần:

   ```bash
   git add .
   git commit -m "Mô tả thay đổi"
   git push
   ```

> Lưu ý: file `.env` (chứa mật khẩu SMTP, secret đăng nhập) **không** được đẩy lên GitHub — đã được
> loại trừ sẵn trong `.gitignore`. Khi triển khai trên Hostinger, bạn sẽ tạo file `.env` riêng trực
> tiếp trên server (xem Phần 3).

---

## Phần 2 — Chọn gói Hostinger phù hợp

Website này là ứng dụng **Node.js** (Next.js), **không phải** website PHP/WordPress thông thường,
nên cần gói hosting có hỗ trợ chạy Node.js:

| Gói Hostinger | Hỗ trợ Node.js? | Khuyến nghị |
|---|---|---|
| Shared Hosting (Premium/Business cơ bản, chỉ PHP) | Không | Không dùng được |
| **Business / Cloud Startup Hosting** (có mục "Node.js" trong hPanel) | Có (qua trình quản lý Node.js dựng sẵn) | **Phù hợp cho website quy mô này** |
| **VPS Hosting** | Có (toàn quyền cài đặt) | Phù hợp nếu muốn kiểm soát sâu hơn (PM2, Nginx tùy chỉnh) |

Khuyến nghị: bắt đầu với gói **Cloud/Business Hosting có Node.js**, đây là lựa chọn cân bằng chi
phí/khả năng quản lý, đủ đáp ứng một website doanh nghiệp vừa. Nếu sau này lượng truy cập lớn, có
thể nâng cấp lên VPS.

### Tên miền

Website đang cấu hình sẵn cho tên miền `vipec-palfingerpart.com`. Nếu muốn dùng tên miền khác, cập
nhật lại `NEXTAUTH_URL` (biến môi trường) và `domain` trong `src/lib/site.ts` cho khớp.

---

## Phần 3 — Triển khai qua tính năng "Web Apps" của Hostinger

Các gói Hosting Business/Cloud của Hostinger có sẵn tính năng **Trang web → Web Apps** — hỗ trợ
Next.js trực tiếp, kết nối GitHub, tự build/deploy mỗi khi có code mới, **không cần server.js hay
thao tác SSH thủ công**. Đây là cách đã được xác nhận hoạt động cho dự án này:

1. hPanel → **Trang web → Web Apps → Bắt đầu**.
2. Chọn tên miền sẽ chạy website, chọn vị trí server gần người dùng nhất (VD: Singapore).
3. Ở bước "Triển khai Ứng dụng Web Node.js" → chọn **"Nhập kho lưu trữ Git"** → **"Kết nối với
   GitHub"** → đăng nhập/ủy quyền → chọn đúng repo đã push ở Phần 1.
4. Xem lại cấu hình build (Hostinger tự nhận diện đúng Next.js, thường không cần đổi gì):
   - Framework: **Next.js**, Nhánh: **main**, Thư mục gốc: `./`
   - Trình quản lý gói: **npm**, Thư mục đầu ra: **.next**
   - **Lệnh xây dựng**: ô này là dropdown cố định `npm run build`, **không tự gõ lệnh khác được** —
     mọi tùy chỉnh (build database, dùng Webpack thay Turbopack...) đã được cấu hình sẵn ngay trong
     `package.json` của repo, cứ để nguyên lựa chọn mặc định.
5. Mục **Biến môi trường** → bấm "Thêm" → điền:
   - `DATABASE_URL` — xem Phần 3b bên dưới (cần tạo database MySQL trước)
   - `NEXTAUTH_SECRET` — chuỗi ngẫu nhiên mạnh (tạo bằng `openssl rand -base64 32`, hoặc nhờ Claude
     tạo giúp)
   - `NEXTAUTH_URL` — `https://ten-mien-cua-ban.com`
   - (Tùy chọn, thêm sau) `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`,
     `INQUIRY_NOTIFY_TO` — lấy từ email doanh nghiệp tạo trong hPanel (mục Email)
6. Bấm **Hoàn tất** rồi **Triển khai** — theo dõi tiến trình ở trang "Triển khai", xem log nếu build
   thất bại.
7. Vào mục **SSL** (nếu có) hoặc kiểm tra tên miền đã tự có `https://` chưa — Hostinger thường tự
   cấp SSL miễn phí cho các trang trong Web Apps.

> Lưu ý quan trọng đã xác minh thực tế: **mỗi lần deploy, Hostinger Web Apps tạo một thư mục hoàn
> toàn mới** (không giữ lại file phát sinh lúc build/chạy trước đó). Vì vậy dự án này **bắt buộc
> dùng MySQL** (database ngoài, độc lập với thư mục app) — SQLite dạng file **không hoạt động được**
> trên nền tảng này vì dữ liệu sẽ mất sau mỗi lần deploy lại.

### Phần 3b — Tạo database MySQL

1. hPanel → mục **Cơ sở dữ liệu** (Databases) → tạo database MySQL mới + người dùng (username/mật
   khẩu riêng cho database, không phải mật khẩu Hostinger của bạn).
2. Ghi lại 4 thông tin: **host**, **port** (thường là 3306), **tên database**, **username/password**.
3. Ghép thành chuỗi kết nối theo định dạng:
   ```
   mysql://<username>:<password>@<host>:<port>/<ten-database>
   ```
4. Dán chuỗi này làm giá trị biến môi trường `DATABASE_URL` ở bước 5 (Phần 3) — nếu app đã deploy
   rồi, vào **Triển khai → Biến môi trường**, sửa `DATABASE_URL`, rồi bấm **Tải triển khai** để build
   lại (bảng dữ liệu sẽ tự được tạo trong lúc build, không cần chạy lệnh gì thêm trên MySQL).

### Cập nhật khi có thay đổi code sau này

Chỉ cần `git push` code mới lên GitHub, sau đó vào trang **Triển khai** trên Hostinger, bấm
**"Tải triển khai"** để build và deploy lại bản mới nhất.

---

## Phần 3c — Tự động đồng bộ model cẩu & dầu nhớt mỡ từ vipec-vp.vn

Website tự lấy dữ liệu **model cẩu gập** và **dầu nhớt mỡ** thật từ vipec-vp.vn (qua API công khai
của WooCommerce) — chỉ tạo mới, không ghi đè nội dung bạn đã tự chỉnh qua `/admin`. Có 2 cách chạy:

1. **Thủ công** — vào `/admin` (trang Tổng quan), bấm **"Đồng bộ ngay"** trong khối "Đồng bộ dữ liệu
   VIPEC" bất cứ khi nào muốn cập nhật.
2. **Tự động định kỳ** — thiết lập **Cron Job** trên Hostinger:
   1. hPanel → **Advanced → Cron Jobs** (hoặc mục tương đương trong "Nâng cao").
   2. Tạo cron job mới, chọn tần suất (ví dụ: mỗi ngày lúc 3:00 sáng).
   3. Lệnh chạy:
      ```bash
      curl -X POST -H "x-sync-token: GIA_TRI_SYNC_SECRET" https://ten-mien-cua-ban.com/api/admin/sync-vipec
      ```
   4. Thay `GIA_TRI_SYNC_SECRET` bằng đúng giá trị biến môi trường `SYNC_SECRET` đã đặt ở Phần 3
      (nếu chưa có, thêm biến này vào **Biến môi trường** với giá trị bất kỳ đủ dài/khó đoán, ví dụ
      tạo bằng `openssl rand -base64 32`).

---

## Phần 4 — Sau khi triển khai

- [ ] Đổi mật khẩu tài khoản quản trị mặc định (`admin@vipec-vp.vn`) ngay lập tức
- [ ] Cập nhật thông tin liên hệ thật trong `src/lib/site.ts` (số điện thoại, địa chỉ, bản đồ)
- [ ] Thay logo/favicon chính thức
- [ ] Bấm "Đồng bộ ngay" trong `/admin` để lấy model cẩu + dầu nhớt mỡ thật từ vipec-vp.vn
- [ ] Nhập phụ tùng và tin tức thật qua `/admin` (phụ tùng cẩu gập cụ thể chưa có trên vipec-vp.vn
      nên vẫn cần nhập tay, gắn đúng model cẩu tương ứng)
- [ ] (Tùy chọn) Thiết lập Cron Job tự động đồng bộ định kỳ — xem Phần 3c
- [ ] Kiểm tra gửi thử form "Yêu cầu báo giá" để xác nhận email thông báo hoạt động
- [ ] Kiểm tra website trên điện thoại thật (không chỉ trên trình duyệt máy tính)
