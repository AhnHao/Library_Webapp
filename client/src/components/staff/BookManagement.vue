<template>
  <div class="book-management">
    <div class="header-section mb-4">
      <div class="d-flex justify-content-between align-items-center">
        <h2><i class="bi bi-book me-2"></i>Quản lý sách</h2>
        <button class="btn btn-primary add-btn" @click="showAddModal">
          <i class="bi bi-plus-lg me-2"></i>Thêm sách mới
        </button>
      </div>
    </div>

    <div class="search-section mb-4">
      <div class="row">
        <div class="col-md-6">
          <div class="search-box">
            <i class="bi bi-search search-icon"></i>
            <input
              type="text"
              class="form-control search-input"
              placeholder="Tìm kiếm sách..."
              v-model="searchKeyword"
              @input="handleSearch"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Bảng danh sách với thiết kế mới -->
    <div class="table-container">
      <table class="table custom-table">
        <thead>
          <tr>
            <th>Mã sách</th>
            <th>Tên sách</th>
            <th>Tác giả</th>
            <th>Nhà xuất bản</th>
            <th>Năm xuất bản</th>
            <th>Đơn giá</th>
            <th>Số quyển</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in paginatedBooks" :key="book._id">
            <td>{{ book.MaSach }}</td>
            <td>{{ book.TenSach }}</td>
            <td>{{ book.TacGia }}</td>
            <td>{{ book.MaNXB?.TenNXB || "Không xác định" }}</td>
            <td>{{ book.NamXB }}</td>
            <td>{{ formatCurrency(book.DonGia) }}</td>
            <td>{{ book.SoQuyen }}</td>
            <td>
              <button
                class="btn btn-sm btn-warning me-2"
                @click="showEditModal(book)"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button
                class="btn btn-sm btn-danger"
                @click="confirmDelete(book)"
              >
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="d-flex justify-content-between align-items-center mt-4">
      <div class="pages-info">
        Hiển thị {{ startIndex + 1 }} - {{ endIndex }} trong số
        {{ totalItems }} kết quả
      </div>
      <nav v-if="totalPages > 1">
        <ul class="pagination mb-0">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a
              class="page-link"
              href="#"
              @click.prevent="changePage(currentPage - 1)"
            >
              <i class="bi bi-chevron-left"></i>
            </a>
          </li>
          <li
            class="page-item"
            v-for="page in totalPages"
            :key="page"
            :class="{ active: page === currentPage }"
          >
            <a class="page-link" href="#" @click.prevent="changePage(page)">{{
              page
            }}</a>
          </li>
          <li
            class="page-item"
            :class="{ disabled: currentPage === totalPages }"
          >
            <a
              class="page-link"
              href="#"
              @click.prevent="changePage(currentPage + 1)"
            >
              <i class="bi bi-chevron-right"></i>
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Modal thêm/sửa -->
    <div class="modal fade" id="bookModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEditing ? "Sửa sách" : "Thêm sách" }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label class="form-label">Tên sách</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.TenSach"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Tác giả</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.TacGia"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Nhà xuất bản</label>
                <select class="form-select" v-model="formData.MaNXB" required>
                  <option value="">Chọn nhà xuất bản</option>
                  <option
                    v-for="pub in publishers"
                    :key="pub._id"
                    :value="pub.MaNXB"
                  >
                    {{ pub.TenNXB }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Năm xuất bản</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.NamXB"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Đơn giá</label>
                <input
                  type="number"
                  class="form-control"
                  v-model="formData.DonGia"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Số quyển</label>
                <input
                  type="number"
                  class="form-control"
                  v-model="formData.SoQuyen"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Hình ảnh sách (URL)</label>
                <input
                  type="url"
                  class="form-control"
                  v-model="formData.imageUrl"
                  placeholder="Nhập URL hình ảnh sách"
                />
              </div>
              <div class="alert alert-danger" v-if="error">{{ error }}</div>
              <div class="text-end">
                <button
                  type="button"
                  class="btn btn-secondary me-2"
                  data-bs-dismiss="modal"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="loading"
                >
                  {{ loading ? "Đang xử lý..." : "Lưu" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal xác nhận xóa -->
    <div class="modal fade" id="deleteModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Xác nhận xóa</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">Bạn có chắc chắn muốn xóa sách này?</div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Hủy
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="handleDelete"
              :disabled="loading"
            >
              {{ loading ? "Đang xử lý..." : "Xóa" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap";
import api from "../../services/api";

export default {
  name: "BookManagement",
  data() {
    return {
      books: [],
      publishers: [],
      formData: {
        TenSach: "",
        TacGia: "",
        MaNXB: "",
        NamXB: "",
        DonGia: "",
        SoQuyen: "",
        imageUrl: "",
      },
      selectedBook: null,
      isEditing: false,
      loading: false,
      error: null,
      bookModal: null,
      deleteModal: null,
      searchKeyword: "",
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  async mounted() {
    await Promise.all([this.loadBooks(), this.loadPublishers()]);
    this.bookModal = new Modal(document.getElementById("bookModal"));
    this.deleteModal = new Modal(document.getElementById("deleteModal"));
  },
  computed: {
    totalItems() {
      return this.books.length;
    },
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    },
    startIndex() {
      return (this.currentPage - 1) * this.itemsPerPage;
    },
    endIndex() {
      return Math.min(this.startIndex + this.itemsPerPage, this.totalItems);
    },
    paginatedBooks() {
      return this.books.slice(this.startIndex, this.endIndex);
    },
  },
  methods: {
    async loadBooks() {
      try {
        const response = await api.getAllBooks();
        console.log("Books loaded:", response.data);
        this.books = response.data;
      } catch (error) {
        console.error("Lỗi khi tải danh sách sách:", error);
      }
    },
    async loadPublishers() {
      try {
        const response = await api.getAllPublishers();
        console.log("Publishers loaded:", response.data);
        this.publishers = response.data;
      } catch (error) {
        console.error("Lỗi khi tải danh sách nhà xuất bản:", error);
      }
    },
    showAddModal() {
      this.isEditing = false;
      this.formData = {
        TenSach: "",
        TacGia: "",
        MaNXB: "",
        NamXB: "",
        DonGia: "",
        SoQuyen: "",
        imageUrl: "",
      };
      this.error = null;
      this.bookModal.show();
    },
    showEditModal(book) {
      this.isEditing = true;
      this.selectedBook = book;
      this.formData = {
        TenSach: book.TenSach,
        TacGia: book.TacGia,
        MaNXB: book.MaNXB?._id || "",
        NamXB: book.NamXB,
        DonGia: book.DonGia,
        SoQuyen: book.SoQuyen,
        imageUrl: book.imageUrl || "",
      };
      this.error = null;
      this.bookModal.show();
    },
    async handleSubmit() {
      this.loading = true;
      this.error = null;
      try {
        if (this.isEditing) {
          await api.updateBook(this.selectedBook._id, this.formData);
          this.$notify({
            type: "success",
            title: "Cập nhật thành công",
            message: "Thông tin sách đã được cập nhật",
          });
        } else {
          await api.createBook(this.formData);
          this.$notify({
            type: "success",
            title: "Thêm sách thành công",
            message: "Sách mới đã được thêm vào thư viện",
          });
        }
        await this.loadBooks();
        this.bookModal.hide();
      } catch (error) {
        this.$notify({
          type: "error",
          title: "Lỗi",
          message: error.response?.data?.message || "Đã có lỗi xảy ra",
        });
      } finally {
        this.loading = false;
      }
    },
    confirmDelete(book) {
      this.selectedBook = book;
      this.deleteModal.show();
    },
    async handleDelete() {
      this.loading = true;
      try {
        await api.deleteBook(this.selectedBook._id);
        this.$notify({
          type: "success",
          title: "Xóa thành công",
          message: "Sách đã được xóa khỏi thư viện",
        });
        await this.loadBooks();
        this.deleteModal.hide();
      } catch (error) {
        this.$notify({
          type: "error",
          title: "Lỗi",
          message: error.response?.data?.message || "Không thể xóa sách",
        });
      } finally {
        this.loading = false;
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
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
  },
};
</script>

<style scoped>
.book-management {
  background-color: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-section h2 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #1e293b;
}

.add-btn {
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.search-box {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-input {
  padding-left: 2.75rem;
  height: 3rem;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.table-container {
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.custom-table {
  margin-bottom: 0;
}

.custom-table thead th {
  background-color: #f8fafc;
  padding: 1rem;
  font-weight: 600;
  color: #475569;
  border-bottom: 2px solid #e2e8f0;
}

.custom-table tbody td {
  padding: 1rem;
  vertical-align: middle;
}

.btn-sm {
  padding: 0.4rem 0.75rem;
  border-radius: 0.375rem;
}

/* Modal styles */
::v-deep .modal-content {
  border-radius: 1rem;
  border: none;
}

::v-deep .modal-header {
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 1.5rem;
}

::v-deep .modal-body {
  padding: 1.5rem;
}

.form-label {
  font-weight: 500;
  color: #475569;
}

.modal-backdrop {
  background-color: rgba(15, 23, 42, 0.7);
}

.modal-content {
  transform: scale(0.95);
  transition: transform 0.2s ease;
}

.modal.show .modal-content {
  transform: scale(1);
}

.modal-header {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: white;
  border-radius: 1rem 1rem 0 0;
}

.modal-title {
  font-weight: 600;
  font-size: 1.25rem;
}

.btn-close {
  filter: brightness(0) invert(1);
}

.modal-body {
  padding: 2rem;
}

.form-label {
  font-weight: 500;
  color: #475569;
  margin-bottom: 0.5rem;
}

.form-control,
.form-select {
  border: 2px solid #e2e8f0;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.modal-footer {
  padding: 1rem 2rem;
  border-top: 1px solid #e2e8f0;
}

.alert {
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
}
</style>
