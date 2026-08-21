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

Website đang cấu hình sẵn cho tên miền `vipec-vp.vn` (theo email liên hệ công ty). Nếu tên miền
này đã có ở nhà cung cấp khác, vào phần quản lý DNS của tên miền và trỏ về Hostinger theo hướng dẫn
trong hPanel (mục Domains). Nếu muốn dùng tên miền khác, nhớ cập nhật lại `NEXTAUTH_URL` trong `.env`
và các thông tin domain trong `src/lib/site.ts` cho khớp.

---

## Phần 3 — Triển khai ứng dụng Node.js trên Hostinger (qua hPanel)

1. Đăng nhập **hPanel** → chọn gói hosting → mục **Advanced → Node.js**.
2. Tạo ứng dụng Node.js mới:
   - **Node.js version**: chọn bản mới nhất có sẵn (≥ 20.x)
   - **Application root**: thư mục sẽ chứa code, ví dụ `palfinger-vipec`
   - **Application URL**: chọn tên miền của bạn
   - **Application startup file**: `server.js` — dự án đã có sẵn file này ở thư mục gốc, dùng cho
     đúng các hệ thống Node.js kiểu Passenger (như hPanel) yêu cầu một file khởi động thay vì chạy
     lệnh `npm run start`
3. Kết nối mã nguồn — có 2 cách:
   - **Cách A (khuyến nghị): Git Deployment** — trong hPanel có mục "Git", dán URL GitHub repo và
     nhánh `main`, Hostinger sẽ tự kéo code về mỗi khi bạn bấm "Deploy" (hoặc tự động khi có commit
     mới nếu bật webhook).
   - **Cách B: SSH thủ công** — dùng SSH (hPanel cung cấp thông tin truy cập SSH) để `git clone` repo
     về thư mục ứng dụng, sau đó `git pull` mỗi khi cập nhật.
4. Sau khi có code trên server, chạy các lệnh sau qua giao diện Node.js của hPanel hoặc qua SSH,
   trong đúng thư mục ứng dụng:

   ```bash
   npm install
   npx prisma db push
   npx prisma db seed        # chỉ chạy 1 lần đầu để có dữ liệu mẫu/tài khoản admin
   npm run build
   ```

5. Tạo file `.env` **trực tiếp trên server** (không đẩy qua Git) với nội dung dựa theo `.env.example`,
   điền:
   - `DATABASE_URL="file:./dev.db"`
   - `NEXTAUTH_SECRET` — tạo chuỗi ngẫu nhiên mạnh, ví dụ chạy `openssl rand -base64 32`
   - `NEXTAUTH_URL="https://ten-mien-cua-ban.com"`
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `INQUIRY_NOTIFY_TO` — lấy từ
     email doanh nghiệp tạo trong hPanel (mục Emails), dùng để nhận thông báo khi có khách gửi yêu
     cầu báo giá/liên hệ.

6. Đặt lệnh khởi động ứng dụng là `npm run start` nếu hPanel cho chọn lệnh tùy ý; nếu giao diện chỉ
   cho chọn một **file** khởi động (kiểu Passenger), chọn `server.js` như đã cấu hình ở bước 2.
7. Bật ứng dụng (Start/Restart) trong giao diện Node.js của hPanel.
8. Vào mục **SSL** trong hPanel, bật **SSL miễn phí (Let's Encrypt)** cho tên miền — bắt buộc để
   website chạy `https://`.

### Lưu ý về cơ sở dữ liệu SQLite

Website dùng SQLite (file `prisma/dev.db`) — đơn giản, không cần dịch vụ database riêng, phù hợp
với quy mô một website doanh nghiệp. Điều quan trọng:

- **Sao lưu định kỳ** file `prisma/dev.db` (tải về qua File Manager/SFTP), vì đây là nơi lưu toàn
  bộ phụ tùng, tin tức, yêu cầu khách hàng đã nhập qua trang quản trị.
- Nếu sau này lượng dữ liệu/truy cập tăng mạnh, có thể chuyển sang MySQL (Hostinger có sẵn) bằng
  cách đổi `provider` trong `prisma/schema.prisma` và cập nhật `DATABASE_URL`.

### Cập nhật khi có thay đổi code sau này

1. `git push` code mới lên GitHub từ máy bạn.
2. Trên hPanel (Git Deployment): bấm **Deploy** để kéo code mới nhất.
3. Qua SSH: `git pull && npm install && npx prisma db push && npm run build`, sau đó **Restart**
   ứng dụng trong giao diện Node.js.

---

## Phần 4 — Sau khi triển khai

- [ ] Đổi mật khẩu tài khoản quản trị mặc định (`admin@vipec-vp.vn`) ngay lập tức
- [ ] Cập nhật thông tin liên hệ thật trong `src/lib/site.ts` (số điện thoại, địa chỉ, bản đồ)
- [ ] Thay logo/favicon chính thức
- [ ] Nhập phụ tùng và tin tức thật qua `/admin`, xóa dữ liệu mẫu
- [ ] Kiểm tra gửi thử form "Yêu cầu báo giá" để xác nhận email thông báo hoạt động
- [ ] Kiểm tra website trên điện thoại thật (không chỉ trên trình duyệt máy tính)
