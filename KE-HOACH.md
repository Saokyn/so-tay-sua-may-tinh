# Kế hoạch — Sổ tay sửa máy tính (v2 — nội dung chuyên sâu, bản chạy trên máy)

> Trạng thái: **v1 đã chạy được trên máy (box)**, CHƯA đưa lên mạng. Amli xem và duyệt trước khi triển khai.

## 1. Cấu trúc ứng dụng
Ứng dụng web tĩnh (HTML/CSS/JS thuần, không cần build), làm theo cùng khuôn mẫu với **Sổ tay sửa đồ điện**.

```
app/
  index.html            khung trang + thanh tab dưới
  style.css             giao diện (sáng/tối), màu xanh dương
  svg.js                minh hoạ SVG nội tuyến
  data.js               toàn bộ nội dung (chủ đề, triệu chứng, hướng dẫn…)
  app.js                điều hướng (#/…), chẩn đoán, tìm kiếm, yêu thích
  ai.js                 Hỏi AI (key người dùng tự nhập)
  bars.js               ẩn/hiện thanh công cụ khi cuộn
  sw.js, manifest.webmanifest, icon.svg, icon-192/512.png, fonts/
```

### Màn hình
| Đường dẫn | Màn hình |
|---|---|
| `#/` | Trang chủ: tìm kiếm, lối tắt, 4 nhóm chủ đề, danh sách tất cả hướng dẫn |
| `#/a/<chủ đề>` | Chọn triệu chứng |
| `#/d/<chủ đề>/<triệu chứng>/<n>` | Câu hỏi Có/Không → dẫn đến hướng dẫn phù hợp |
| `#/g/<hướng dẫn>` | Hướng dẫn từng bước + hình minh hoạ + nhãn **✅ Tự làm được** / **🏪 Nên mang ra tiệm** + cảnh báo |
| `#/search/<từ>` | Tìm kiếm (gõ có dấu hoặc không dấu đều được) |
| `#/fav`, `#/safety`, `#/tools`, `#/parts`, `#/maint` | Yêu thích, An toàn, Phím tắt, Thuật ngữ, Bảo trì định kỳ |
| `#/ai` | Hỏi AI |

### Nhóm nội dung (198 hướng dẫn = 162 sửa lỗi + 36 hướng dẫn cài đặt; 39 chủ đề, 8 nhóm — v9 thêm 30 hướng dẫn lỗi phần mềm, màn hình xanh, thiếu file, mã độc và 3 chủ đề; v8 thêm 20 hướng dẫn sửa lỗi và chủ đề “Disk/CPU 100% & ứng dụng nền”; v7 thêm 26 hướng dẫn sửa lỗi và 2 chủ đề “Khởi động & tự restart”, “Nhiệt độ & tản nhiệt”; v6 thêm nhóm “Hướng dẫn cài đặt & kết nối” (8 chủ đề) và bộ lọc Loại; v5 thêm 34 hướng dẫn nhóm “Lỗi không ngờ tới” trong 7 chủ đề: phần cứng 19 · Windows/khởi động/dữ liệu 10 · ngoại vi 8 · mạng 7 · ứng dụng 4 · macOS & điện thoại 4)
- Danh sách đầy đủ xem ở trang chủ ứng dụng (mỗi nhóm hiện số hướng dẫn).

### Định dạng dữ liệu (`data.js`)
- `g(id, nhóm, tiêu đề, độ khó 1–3, thời gian, chuẩn bị[], bước[[chữ, hình]], {pro, why, warn, note, svc})` — `pro:true` = Nên mang ra tiệm.
- Chủ đề `A[]`: `{id, cat, name, icon, syms:[s(id, tên, [[câu hỏi, hướng dẫn nếu Có]], hướng dẫn mặc định)]}`.
- Thêm nội dung chỉ cần sửa `data.js`.

### PWA / dùng offline
- `sw.js` lưu sẵn mọi file khi mở lần đầu (cache `stsmt-v2`); sau đó dùng được khi mất mạng (trừ Hỏi AI).
- Khi sửa nội dung: tăng tên cache (`stsmt-v2`…) để máy người dùng tải bản mới.
- Có `manifest.webmanifest` → "Thêm vào màn hình chính" trên điện thoại.

### Hỏi AI
- Người dùng tự nhập API key (Grok/xAI, Gemini hoặc nhà cung cấp tương thích OpenAI) trong ⚙ Cài đặt AI.
- Key chỉ lưu trong `localStorage` của trình duyệt trên máy đó (khoá `stsmt.ai`), **không viết sẵn trong mã nguồn**, chỉ gửi đến nhà cung cấp AI khi bấm Gửi.
- Lời nhắc hệ thống: trả lời tiếng Việt, từng bước, luôn ghi "Tự làm được"/"Nên mang ra tiệm", nhắc sao lưu, cảnh báo lừa đảo OTP/điều khiển từ xa, không hướng dẫn crack.
- Đã tắt chế độ "Grok có sẵn qua máy chủ" của bản Sửa đồ điện vì GitHub Pages không có máy chủ.

## 2. Triển khai GitHub Pages (CHƯA làm — chờ Amli duyệt)
1. Tạo repo (ví dụ `so-tay-sua-may-tinh`), đưa nội dung thư mục `app/` lên nhánh `main` (hoặc thư mục `docs/`).
2. Settings → Pages → Deploy from branch → `main` / root.
3. Địa chỉ dự kiến: `https://<tài-khoản>.github.io/so-tay-sua-may-tinh/` (đường dẫn tương đối nên chạy được trong thư mục con).
4. Kiểm tra lại offline + Hỏi AI trên điện thoại thật.

## 3. Mốc tiếp theo
- **v1.1:** Amli duyệt nội dung; sửa câu chữ; thêm ảnh chụp màn hình thật cho các bước Windows khó.
- **v1.2:** thêm hướng dẫn macOS cơ bản, điện thoại Android/iPhone, máy chiếu cụ thể theo hãng.
- **v1.3:** nút "Gửi câu hỏi kèm hướng dẫn đang xem" sang Hỏi AI; xuất/nhập Yêu thích.
- **v2:** triển khai GitHub Pages sau khi duyệt; tuỳ chọn tên miền riêng.

## v2 (03/11/2026) — viết lại nội dung chuyên nghiệp
- Mỗi hướng dẫn: Triệu chứng · Nguyên nhân xếp theo khả năng · Cần chuẩn bị · Các bước đánh số (có lệnh) · Kiểm tra sau khi sửa · Cảnh báo an toàn · Tự làm hay ra tiệm (khi nào chuyển lên).
- Nguồn nội dung tách trong `src/p0–p6.js`, ghép thành `app/data.js` (`cat src/p*.js > app/data.js`).
- Tìm kiếm: so khớp theo từ (khớp nguyên từ hoặc tiền tố từ ≥3 ký tự), bắt buộc đủ mọi từ, ưu tiên cụm từ và tiêu đề.

## Hình ảnh (v3)
- 201 hình WebP 800×500 (q75) trong app/img/, tự vẽ bằng SVG (imggen/*.py → build.py), 0 ảnh bên thứ ba (xem img/CREDITS.md, trang #/credits).
- Mỗi triệu chứng hiện ảnh của hướng dẫn đích; ảnh bước: CMOS, SMART, đèn router (src/p7.js sinh từ imggen/mkp7.py).
- SW stsmt-v3 precache toàn bộ ảnh. Chủ đề Zalo và Họp online tách riêng.


## v5 (chưa đẩy lên mạng)
- Thêm nhóm “Lỗi không ngờ tới” (cat ngo): 34 hướng dẫn trong src/p8a–p8d.js, 7 chủ đề chẩn đoán, câu hỏi liên kết từ các chủ đề cũ.
- 34 hình mới (imggen/i10–i13.py). Service worker stsmt-v5.

## v6 (đã đưa lên mạng)
- Nhóm mới “Hướng dẫn cài đặt & kết nối”: 36 hướng dẫn (src/p9a–p9d.js), 8 chủ đề: máy in & scan 9 · màn hình/TV/máy chiếu 6 · âm thanh/Bluetooth/họp 2 · router & Wi-Fi 4 · chia sẻ file 2 · máy mới/cài Windows/sao lưu 5 · phần mềm & hỗ trợ từ xa 5 · bảo mật/gia đình/UPS 3.
- Cấu trúc hướng dẫn: Mục đích · Cần chuẩn bị · Các bước · Kiểm tra kết quả · Lỗi hay gặp (liên kết bài sửa lỗi) · An toàn · Tự làm/ra tiệm.
- Bộ lọc Loại (Tất cả / Sửa lỗi / Hướng dẫn) ở trang chủ (#/loai/hd, #/loai/sua) và trang tìm kiếm (#/sk/hd/…); tìm kiếm bao gồm mục đích, kiểm tra, lỗi hay gặp.
- 36 hình mới (imggen/i14–i17.py). Service worker stsmt-v6.

## v7 (đã đưa lên mạng)
- Thêm 26 hướng dẫn sửa lỗi về khởi động, tự restart, nhiệt, nguồn và lỗi phần cứng thường gặp (src/p10a–p10c.js). Hai chủ đề mới: “Khởi động & tự restart” và “Nhiệt độ & tản nhiệt”; bổ sung câu hỏi chẩn đoán ở các chủ đề sẵn có.
- Đào sâu các mục đã có: Tự tắt/tự khởi động lại, Máy nóng, Vệ sinh/thay keo (pad VRM/VRAM), Máy chậm (throttling), Ổ cứng (NVMe nóng).
- 26 hình mới (imggen/i18–i20.py). Service worker stsmt-v7. Tổng 148 hướng dẫn (112 sửa lỗi + 36 hướng dẫn), 35 chủ đề, 151 hình.

## v8 (đã đưa lên mạng — commit 257d536)
- Thêm 20 hướng dẫn sửa lỗi về hiệu năng và tải nền (src/p11a–p11b.js): Disk 100%, lag khi Task Manager không thấy ứng dụng nặng, CPU 100%, RAM đầy/rò rỉ, GPU nền, chậm sau Update, khởi động chậm, mở app chậm, chuột/hình khựng (stutter), game tụt FPS, trình duyệt ngốn RAM, chế độ nguồn/Core parking, Not Responding, System Interrupts/DPC, Defender quét, OneDrive đồng bộ, Windows Search indexer, copy file chậm, WSL/Docker, Delivery Optimization.
- Chủ đề mới: “Disk/CPU 100% & ứng dụng nền”; bổ sung câu hỏi chẩn đoán ở Chậm/nóng/nâng cấp, Khởi động & tự restart, Ổ cứng & RAM, Pin, Update, Office & trình duyệt, chuột, Explorer/OneDrive.
- Đào sâu các mục đã có: Máy chậm (khoanh nút thắt, Active time), Ổ C đầy (SSD gần đầy/TRIM, không defrag SSD), Explorer treo (thumbnail, Preview pane, shell extension), diệt virus cài chồng (hai real-time scan / Disk 100%), chậm khi rút sạc (Battery saver, `powercfg /energy`), chuột giật mặt bàn (phân biệt stutter hệ thống), trình duyệt (ngốn RAM), tiến trình ngầm (Process Explorer + VirusTotal, phần mềm giấu mặt).
- 20 hình mới (imggen/i21–i23.py). Service worker stsmt-v8. Tổng 168 hướng dẫn (132 sửa lỗi + 36 hướng dẫn), 36 chủ đề, 171 hình.

## v9 (đã đưa lên mạng)
- Thêm 30 hướng dẫn sửa lỗi phần mềm (src/p12a–p12c.js): 10 bài màn hình xanh theo stop code (đọc minidump WinDbg `!analyze -v`/BlueScreenView, CRITICAL_PROCESS_DIED/UNEXPECTED_STORE/NTFS, IRQL, MEMORY_MANAGEMENT/PAGE_FAULT/BAD_POOL, SYSTEM_SERVICE/KMODE/SYSTEM_THREAD/KERNEL_SECURITY_CHECK, INACCESSIBLE_BOOT_DEVICE, VIDEO_TDR, DPC_WATCHDOG/DRIVER_POWER_STATE, WHEA/CLOCK_WATCHDOG, bảng tra file .sys); 10 bài lỗi phần mềm & xung đột (crash khi mở, overlay/hook, Start/taskbar, profile tạm, 0x80070005, Microsoft Store, “This app can’t run”/SmartScreen, font tiếng Việt, kích hoạt Windows hợp pháp, Windows Update tự thay driver); 4 bài thiếu file (DLL Visual C++/DirectX, 0xc000007b/0xc0000135, không tìm thấy đường dẫn, file hệ thống/registry hỏng); 6 bài mã độc (adware/policy trình duyệt, ransomware, virus USB, trojan chiếm tài khoản Facebook/Zalo, Defender cách ly nhầm, quét offline + Autoruns).
- Chủ đề mới: “Lỗi phần mềm & xung đột”, “Thiếu file & file hệ thống”, “Virus & mã độc”; chủ đề “Màn hình xanh” có thêm 10 triệu chứng theo mã lỗi; cập nhật câu hỏi ở “Update, driver, mã độc”.
- Đào sâu (src/p12d.js): Màn hình xanh (phân biệt driver/phần cứng), Tra mã lỗi (thêm 0x139, 0x7E, 0x9F, 0x154), Mã độc (dấu hiệu nhiễm, ID Ransomware), Khởi động sạch (Reliability Monitor, Event 1000/1002/1026, Safe Mode, thủ phạm hay gặp); thêm liên kết “Lỗi hay gặp” giữa các bài liên quan.
- Không hướng dẫn crack, activator hay tải DLL từ trang lạ.
- 30 hình mới (imggen/i24–i26.py, render-v9.js). Service worker stsmt-v9. Tổng 198 hướng dẫn (162 sửa lỗi + 36 hướng dẫn), 39 chủ đề, 201 hình.
