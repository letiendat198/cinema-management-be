# cinema-management-be

## API endpoints
🔹 1. User API
GET /users → Lấy danh sách người dùng
POST /users → Đăng ký tài khoản
GET /users/{userID} → Lấy thông tin 1 user
PUT /users/{userID} → Cập nhật thông tin user
DELETE /users/{userID} → Xóa user
POST /users/login → Đăng nhập
GET /users/{userID}/rank → Lấy hạng thành viên
GET /users/{userID}/points → Xem điểm thưởng
🔹 2. Movie API
GET /movies → Lấy danh sách phim
POST /movies → Thêm phim mới (Admin)
GET /movies/{movieID} → Xem chi tiết phim
PUT /movies/{movieID} → Cập nhật phim (Admin)
DELETE /movies/{movieID} → Xóa phim (Admin)
🔹 3. Cinema API
GET /cinemas → Lấy danh sách rạp
POST /cinemas → Thêm rạp mới (Admin)
GET /cinemas/{cinemaID} → Xem chi tiết rạp
PUT /cinemas/{cinemaID} → Cập nhật thông tin rạp
DELETE /cinemas/{cinemaID} → Xóa rạp
🔹 4. Room API
GET /cinemas/{cinemaID}/rooms → Lấy danh sách phòng của một rạp
POST /cinemas/{cinemaID}/rooms → Thêm phòng mới
GET /cinemas/{cinemaID}/rooms/{roomID} → Xem chi tiết phòng
PUT /cinemas/{cinemaID}/rooms/{roomID} → Cập nhật phòng
DELETE /cinemas/{cinemaID}/rooms/{roomID} → Xóa phòng
🔹 5. Seat API
GET /cinema/{}/rooms/{roomID}/seats → Lấy danh sách ghế của một phòng
POST /rooms/{roomID}/seats → Thêm ghế mới
GET /rooms/{roomID}/seats/{seatID} → Xem thông tin ghế
PUT /rooms/{roomID}/seats/{seatID} → Cập nhật ghế
DELETE /rooms/{roomID}/seats/{seatID} → Xóa ghế
🔹 6. Schedule API
GET /movies/{movieID}/schedules → Lấy lịch chiếu của một phim
POST /movies/{movieID}/schedules → Thêm lịch chiếu (Admin)
GET /schedules/{scheduleID} → Xem chi tiết lịch chiếu
PUT /schedules/{scheduleID} → Cập nhật lịch chiếu
DELETE /schedules/{scheduleID} → Xóa lịch chiếu
🔹 7. Ticket API
GET /users/{userID}/tickets → Lấy danh sách vé của người dùng
POST /tickets → Người dùng mua vé
GET /tickets/{ticketID} → Xem chi tiết vé
DELETE /tickets/{ticketID} → Hủy vé
🔹 8. Complementary Item API (Đồ ăn, nước uống, quà tặng)
GET /complementary-items → Lấy danh sách sản phẩm
POST /complementary-items → Thêm sản phẩm mới (Admin)
GET /complementary-items/{itemID} → Xem chi tiết sản phẩm
PUT /complementary-items/{itemID} → Cập nhật sản phẩm
DELETE /complementary-items/{itemID} → Xóa sản phẩm
🔹 9. Rank API (Hệ thống hội viên)
GET /ranks → Lấy danh sách hạng hội viên
GET /users/{userID}/rank → Xem hạng hội viên của user
PUT /users/{userID}/rank → Cập nhật hạng hội viên
🔹 10. Buy API (Mua hàng, vé)
POST /buy/tickets → Người dùng mua vé
POST /buy/complementary-items → Người dùng mua sản phẩm phụ
GET /users/{userID}/purchases → Lấy lịch sử mua hàng của user

