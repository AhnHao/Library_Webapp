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
      <div v-for="book in paginatedBooks" :key="book._id" class="col">
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
                <i class="bi bi-box-seam me-2"></i>
                <span>Còn lại: {{ book.SoQuyen || "Không xác định" }}</span>
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

    <!-- Pagination -->
    <div class="pagination-wrapper mt-5">
      <div class="d-flex justify-content-between align-items-center">
        <div class="pagination-info">
          Hiển thị {{ startIndex + 1 }}-{{ endIndex }} trong số
          {{ filteredBooks.length }} quyển sách
        </div>
        <nav aria-label="Page navigation">
          <ul class="pagination mb-0">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a
                class="page-link"
                href="#"
                @click.prevent="handlePageChange(currentPage - 1)"
              >
                <i class="bi bi-chevron-left"></i>
              </a>
            </li>
            <li
              v-for="page in displayedPages"
              :key="page"
              class="page-item"
              :class="{
                active: currentPage === page,
                disabled: page === '...',
              }"
            >
              <a
                class="page-link"
                href="#"
                @click.prevent="handlePageChange(page)"
              >
                {{ page }}
              </a>
            </li>
            <li
              class="page-item"
              :class="{ disabled: currentPage === totalPages }"
            >
              <a
                class="page-link"
                href="#"
                @click.prevent="handlePageChange(currentPage + 1)"
              >
                <i class="bi bi-chevron-right"></i>
              </a>
            </li>
          </ul>
        </nav>
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
      currentPage: 1,
      itemsPerPage: 12,
    };
  },
  async mounted() {
    await this.loadBooks();
    await this.loadBookStatus();
  },
  computed: {
    filteredBooks() {
      if (!this.searchKeyword.trim()) return this.books;

      const keyword = this.searchKeyword.toLowerCase();
      return this.books.filter((book) => {
        return (
          book.TenSach.toLowerCase().includes(keyword) ||
          book.TacGia.toLowerCase().includes(keyword) ||
          book.MaNXB?.TenNXB.toLowerCase().includes(keyword)
        );
      });
    },
    totalPages() {
      return Math.ceil(this.filteredBooks.length / this.itemsPerPage);
    },
    startIndex() {
      return (this.currentPage - 1) * this.itemsPerPage;
    },
    endIndex() {
      return Math.min(
        this.startIndex + this.itemsPerPage,
        this.filteredBooks.length
      );
    },
    paginatedBooks() {
      return this.filteredBooks.slice(this.startIndex, this.endIndex);
    },
    displayedPages() {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];
      let l;

      range.push(1);

      for (
        let i = this.currentPage - delta;
        i <= this.currentPage + delta;
        i++
      ) {
        if (i < this.totalPages && i > 1) {
          range.push(i);
        }
      }

      range.push(this.totalPages);

      for (let i of range) {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (i - l !== 1) {
            rangeWithDots.push("...");
          }
        }
        rangeWithDots.push(i);
        l = i;
      }

      return rangeWithDots;
    },
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
        "bg-secondary": this.getBookById(bookId)?.SoQuyen === 0,
        "bg-success": !status && this.getBookById(bookId)?.SoQuyen > 0,
      };
    },
    getStatusText(bookId) {
      const status = this.borrowStatus[bookId];
      const book = this.getBookById(bookId);

      if (book?.SoQuyen === 0) {
        return "Hết sách";
      }

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
      this.currentPage = 1; // Reset về trang đầu khi tìm kiếm
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
      const book = this.getBookById(bookId);
      return (
        this.borrowStatus[bookId] === "đang mượn" ||
        this.borrowStatus[bookId] === "chờ duyệt" ||
        book?.SoQuyen === 0
      );
    },
    getBorrowButtonText(bookId) {
      const status = this.borrowStatus[bookId];
      const book = this.getBookById(bookId);

      if (book?.SoQuyen === 0) {
        return "Hết sách";
      }

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
    getBookById(bookId) {
      return this.books.find((book) => book._id === bookId);
    },
    handlePageChange(page) {
      if (typeof page === "number" && page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
  },
  watch: {
    searchKeyword() {
      this.currentPage = 1; // Reset về trang đầu khi thay đổi từ khóa tìm kiếm
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
  max-width: 350px;
  margin: 0 auto;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.book-image {
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  text-align: center;
  position: relative;
  height: 300px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.book-cover {
  width: 80%;
  height: 90%;
  object-fit: contain;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
}

.book-image i {
  font-size: 4rem;
  color: white;
  opacity: 0.8;
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

.status-badge.bg-secondary {
  background-color: #6c757d !important;
  color: white;
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
  background: #6c757d;
  cursor: not-allowed;
  opacity: 0.65;
}

.pagination-wrapper {
  margin-top: 2rem;
  padding: 1rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.pagination {
  margin: 0;
}

.page-link {
  padding: 0.5rem 0.75rem;
  color: #3b82f6;
  background-color: white;
  border: 1px solid #e2e8f0;
  min-width: 38px;
  text-align: center;
  transition: all 0.2s ease;
}

.page-link:hover {
  background-color: #f1f5f9;
  color: #2563eb;
  border-color: #e2e8f0;
}

.page-item.active .page-link {
  background-color: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.page-item.disabled .page-link {
  color: #94a3b8;
  pointer-events: none;
  background-color: white;
}

.pagination-info {
  color: #64748b;
  font-size: 0.875rem;
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
