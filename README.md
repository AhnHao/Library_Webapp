# Library Webapp System

![Library Webapp](https://cdn-icons-png.flaticon.com/512/8074/8074804.png)

Hệ thống quản lý thư viện hiện đại giúp tự động hóa các quy trình mượn trả sách và quản lý tài liệu.  
Lưu ý: Trong hệ thống sẽ có một số tính năng để cho người dùng trải nghiệm trong thực tế sẽ không có hoặc được cài đặt đặc biệt (Vd: đăng ký tài khoản dành cho nhân viên,..)

## Tính năng chính

### Dành cho Độc giả

- Xem và tìm kiếm sách trong thư viện
- Yêu cầu mượn sách trực tuyến
- Theo dõi tình trạng mượn sách
- Xem lịch sử mượn trả
- Quản lý thông tin cá nhân (coming soon)

### Dành cho Nhân viên

- Quản lý sách (thêm, sửa, xóa, tìm kiếm)
- Quản lý nhà xuất bản
- Xử lý yêu cầu mượn sách
- Theo dõi quá trình mượn trả
- Xem báo cáo và thống kê (coming soon)

## Công nghệ sử dụng

### Frontend

- Vue.js 3
- Bootstrap 5
- Axios
- Vue Router
- Bootstrap Icons

### Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Bcrypt

### DevOps

- Docker
- Docker Compose
- Nginx
- Jenkins
- AWS EC2

## Yêu cầu hệ thống

- Node.js >= 16
- MongoDB >= 4.4
- Docker và Docker Compose
- Git

## Cài đặt và Chạy

1. Clone repository:

```bash
git clone https://github.com/AhnHao/Library_Webapp.git
cd Library_Webapp
```

2. Cài đặt dependencies:

Install backend dependencies

```terminal
cd server
npm install
```

Install frontend dependencies

```terminal
cd ../client
npm install
```

3. Cấu hình biến môi trường:

```terminal
   cd ../server
   vi .env
```

```vim
PORT=your_port
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=your_jwt_expire
```

4. Chạy với Docker:
   docker-compose up -d

# Ứng dụng sẽ chạy tại:

Frontend: http://localhost
Backend: http://localhost:3000
MongoDB: localhost:27017
