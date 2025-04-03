<template>
  <div class="book-list">
    <!-- Hero Section -->
    <div class="hero-section mb-5">
      <h1>Khám phá thư viện</h1>
      <p>Tìm kiếm và mượn sách yêu thích của bạn</p>

      <!-- Search Bar -->
      <div class="search-container">
        <div class="search-box">
          <i class="bi bi-search search-icon"></i>
          <input
            type="text"
            class="form-control search-input"
            placeholder="Tìm kiếm theo tên sách, tác giả..."
            v-model="searchKeyword"
            @input="handleSearch"
          />
        </div>
      </div>
    </div>

    <!-- Book Grid -->
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
      <div v-for="book in books" :key="book._id" class="col">
        <div class="book-card">
          <div class="book-image">
            <img
              v-if="book.imageUrl"
              :src="book.imageUrl"
              :alt="book.TenSach"
              class="book-cover"
              @error="handleImageError"
            />
            <i v-else class="bi bi-book"></i>
          </div>
          <div class="book-info">
            <h5 class="book-title">{{ book.TenSach }}</h5>
            <div class="book-details">
              <div class="detail-item">
                <i class="bi bi-person me-2"></i>
                <span>Tác giả: {{ book.TacGia }}</span>
              </div>
              <div class="detail-item">
                <i class="bi bi-building me-2"></i>
                <span>NXB: {{ book.MaNXB?.TenNXB || "Không xác định" }}</span>
              </div>
              <div class="detail-item">
                <i class="bi bi-calendar me-2"></i>
                <span>Năm XB: {{ book.NamXB }}</span>
              </div>
              <div class="detail-item">
                <i class="bi bi-cash me-2"></i>
                <span>Giá: {{ formatCurrency(book.DonGia) }}</span>
              </div>
            </div>
            <div class="book-status">
              <span class="status-badge" :class="getStatusBadgeClass(book._id)">
                {{ getStatusText(book._id) }}
              </span>
            </div>
          </div>
          <div class="book-action">
            <button
              class="btn btn-borrow"
              @click="requestBorrow(book.MaSach)"
              :disabled="isBookUnavailable(book._id)"
            >
              <i class="bi bi-journal-plus me-1"></i>
              {{ getBorrowButtonText(book._id) }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../../services/api";

export default {
  name: "BookList",
  data() {
    return {
      books: [],
      searchKeyword: "",
      borrowStatus: {},
    };
  },
  async mounted() {
    await this.loadBooks();
    await this.loadBookStatus();
  },
  methods: {
    async loadBooks() {
      try {
        const response = await api.getAllBooks();
        this.books = response.data;
      } catch (error) {
        this.$notify({
          type: "error",
          title: "Lỗi",
          message: "Không thể tải danh sách sách",
        });
      }
    },
    async loadBookStatus() {
      try {
        const [borrowing, pending] = await Promise.all([
          api.getMyBorrowingBooks(),
          api.getMyPendingRequests(),
        ]);

        const status = {};
        borrowing.data.forEach((request) => {
          status[request.MaSach._id] = "đang mượn";
        });
        pending.data.forEach((request) => {
          status[request.MaSach._id] = "chờ duyệt";
        });

        this.borrowStatus = status;
      } catch (error) {
        console.error("Lỗi khi tải trạng thái sách:", error);
      }
    },
    getStatusBadgeClass(bookId) {
      const status = this.borrowStatus[bookId];
      return {
        "bg-warning": status === "chờ duyệt",
        "bg-danger": status === "đang mượn",
        "bg-success": !status,
      };
    },
    getStatusText(bookId) {
      const status = this.borrowStatus[bookId];
      switch (status) {
        case "đang mượn":
          return "Bạn đã mượn quyển sách này";
        case "chờ duyệt":
          return "Đang chờ duyệt";
        default:
          return "Có thể mượn";
      }
    },
    async requestBorrow(maSach) {
      try {
        await api.requestBorrow(maSach);
        this.$notify({
          type: "success",
          title: "Thành công",
          message: "Đã gửi yêu cầu mượn sách thành công",
        });
        await this.loadBookStatus();
      } catch (error) {
        this.$notify({
          type: "error",
          title: "Lỗi",
          message:
            error.response?.data?.message ||
            "Đã có lỗi xảy ra khi gửi yêu cầu mượn",
        });
      }
    },
    async handleSearch() {
      if (this.searchKeyword.trim()) {
        try {
          const response = await api.searchBooks(this.searchKeyword);
          this.books = response.data;
        } catch (error) {
          console.error("Lỗi khi tìm kiếm sách:", error);
        }
      } else {
        await this.loadBooks();
      }
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    },
    isBookUnavailable(bookId) {
      return (
        this.borrowStatus[bookId] === "đang mượn" ||
        this.borrowStatus[bookId] === "chờ duyệt"
      );
    },
    getBorrowButtonText(bookId) {
      const status = this.borrowStatus[bookId];
      switch (status) {
        case "đang mượn":
          return "Đang mượn";
        case "chờ duyệt":
          return "Chờ duyệt";
        default:
          return "Yêu cầu mượn sách";
      }
    },
    handleImageError(e) {
      e.target.style.display = "none";
      e.target.nextElementSibling.style.display = "block";
    },
  },
};
</script>

<style scoped>
.book-list {
  padding: 2rem 0;
}

.hero-section {
  text-align: center;
  margin-bottom: 3rem;
}

.hero-section h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
}

.hero-section p {
  color: #64748b;
  font-size: 1.1rem;
}

.search-container {
  max-width: 600px;
  margin: 2rem auto 0;
}

.search-box {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 1.1rem;
}

.search-input {
  padding: 1rem 1rem 1rem 3rem;
  border-radius: 9999px;
  border: 2px solid #e2e8f0;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.book-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-width: 350px; /* Giới hạn chiều rộng tối đa của card */
  margin: 0 auto; /* Căn giữa card */
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.book-image {
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  text-align: center;
  position: relative;
  height: 300px; /* Tăng chiều cao */
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.book-cover {
  width: 80%; /* Giảm width để tạo padding hai bên */
  height: 90%; /* Giảm height để tạo padding trên dưới */
  object-fit: contain; /* Đổi từ cover sang contain để hiển thị trọn ảnh */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Căn giữa hoàn hảo */
  padding: 1rem; /* Thêm padding xung quanh ảnh */
  background: rgba(255, 255, 255, 0.1); /* Thêm background mờ */
  border-radius: 0.5rem; /* Bo tròn nhẹ */
}

.book-image i {
  font-size: 4rem; /* Tăng kích thước icon */
  color: white;
  opacity: 0.8; /* Làm mờ nhẹ icon */
}

.book-info {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.book-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.book-author {
  color: #64748b;
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.book-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 1rem 0;
}

.detail-item {
  display: flex;
  align-items: center;
  color: #64748b;
  font-size: 0.95rem;
}

.detail-item i {
  width: 20px;
  color: #3b82f6;
}

.status-badge {
  display: inline-block;
  padding: 0.5em 1em;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.book-action {
  padding: 1.5rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.btn-borrow {
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-borrow:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
}

.btn-borrow:disabled {
  background: #e2e8f0;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 2rem;
  }

  .search-input {
    padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  }

  .book-image {
    height: 250px; /* Giảm chiều cao trên mobile */
  }

  .book-cover {
    width: 85%; /* Tăng width trên mobile */
    height: 85%; /* Tăng height trên mobile */
  }
}
</style>
