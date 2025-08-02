# Tính năng Check-in Người Hiến Máu

## Mô tả
Tính năng check-in cho phép staff kiểm tra và đánh dấu trạng thái đến của những người đã đăng ký hiến máu.

## Tính năng chính

### 1. Hiển thị danh sách đăng ký hiến máu
- Danh sách người đã đăng ký hiến máu với trạng thái "Approved"
- Thông tin hiển thị: Họ tên, số điện thoại, thời gian hẹn
- Trạng thái check-in: "Đã đến" hoặc "Chưa đến"

### 2. Thống kê tổng quan
- Tổng số đăng ký
- Số người đã check-in
- Số người chưa đến
- Tỷ lệ đến (%)

### 3. Chức năng check-in
- Nút "Check-in" để đánh dấu người đã đến
- Nút "Hủy check-in" để hủy trạng thái đã đến
- Màu sắc phân biệt: Xanh nhạt cho người đã check-in

### 4. Tìm kiếm và lọc
- Tìm kiếm theo tên hoặc số điện thoại
- Lọc theo ngày hẹn
- Nút "Xóa bộ lọc" để reset

### 5. Responsive Design
- Giao diện desktop với bảng dữ liệu
- Giao diện mobile với card layout
- Tự động chuyển đổi theo kích thước màn hình

## Cách sử dụng

### Truy cập tính năng
1. Đăng nhập với tài khoản Staff
2. Vào menu "Check-in Hiến máu" trong sidebar
3. Giao diện check-in sẽ hiển thị

### Thực hiện check-in
1. Tìm người cần check-in trong danh sách
2. Nhấn nút "Check-in" màu xanh
3. Trạng thái sẽ chuyển thành "Đã đến" với màu xanh nhạt
4. Thống kê sẽ được cập nhật tự động

### Hủy check-in
1. Tìm người đã check-in trong danh sách
2. Nhấn nút "Hủy check-in" màu cam
3. Trạng thái sẽ chuyển về "Chưa đến"

### Tìm kiếm và lọc
1. Sử dụng ô tìm kiếm để tìm theo tên hoặc số điện thoại
2. Chọn ngày trong ô date picker để lọc theo ngày hẹn
3. Nhấn "Xóa bộ lọc" để xem lại toàn bộ danh sách

## Cấu trúc file

```
src/
├── pages/staff/
│   └── DonationCheckIn.tsx          # Component chính
├── components/
│   ├── CheckInStats.tsx             # Component thống kê
│   └── EmptyState.tsx               # Component trạng thái trống
└── services/
    └── donation.service.ts          # API service
```

## API Endpoints

### Cập nhật trạng thái check-in
- **Method**: PUT
- **Endpoint**: `/api/donations/update`
- **Body**: 
  ```json
  {
    "donation_id": number,
    "status": "CheckedIn" | "Approved"
  }
  ```

### Lấy danh sách đăng ký
- **Method**: GET
- **Endpoint**: `/api/donations/by-status?status=Approved`

## Trạng thái

### Donation Status
- `Pending`: Chờ duyệt
- `Approved`: Đã duyệt (chưa check-in)
- `CheckedIn`: Đã check-in
- `Completed`: Hoàn thành
- `Rejected`: Từ chối
- `Cancelled`: Hủy bỏ
- `Processed`: Đã xử lý

## Responsive Breakpoints

- **Desktop**: Hiển thị bảng đầy đủ
- **Tablet**: Bảng với scroll ngang
- **Mobile**: Card layout với thông tin dọc

## Màu sắc

- **Đã check-in**: Xanh nhạt (`bg-green-50`, `border-green-200`)
- **Chưa check-in**: Trắng với hover xám nhạt
- **Nút Check-in**: Xanh (`bg-green-600`)
- **Nút Hủy check-in**: Cam (`text-orange-600`)

## Lưu ý

1. Chỉ hiển thị đăng ký có trạng thái "Approved"
2. Trạng thái check-in được lưu vào database
3. Thống kê được tính toán real-time
4. Giao diện responsive trên mọi thiết bị
5. Có thông báo toast khi thực hiện check-in/hủy check-in 