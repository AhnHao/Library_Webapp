<template>
  <div class="publisher-management">
    <div class="header-section mb-4">
      <div class="d-flex justify-content-between align-items-center">
        <h2><i class="bi bi-building me-2"></i>Quản lý nhà xuất bản</h2>
        <button class="btn btn-primary add-btn" @click="showAddModal">
          <i class="bi bi-plus-lg me-2"></i>Thêm nhà xuất bản
        </button>
      </div>
    </div>

    <!-- Thanh tìm kiếm -->
    <div class="search-section mb-4">
      <div class="row">
        <div class="col-md-6">
          <div class="search-box">
            <i class="bi bi-search search-icon"></i>
            <input
              type="text"
              class="form-control search-input"
              placeholder="Tìm kiếm nhà xuất bản..."
              v-model="searchKeyword"
              @input="handleSearch"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Bảng danh sách -->
    <div class="table-container">
      <table class="table custom-table">
        <thead>
          <tr>
            <th>Tên nhà xuất bản</th>
            <th>Địa chỉ</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="publisher in paginatedPublishers" :key="publisher._id">
            <td>{{ publisher.TenNXB }}</td>
            <td>{{ publisher.DiaChi }}</td>
            <td>
              <button
                class="btn btn-sm btn-primary me-2"
                @click="showEditModal(publisher)"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button
                class="btn btn-sm btn-danger"
                @click="confirmDelete(publisher)"
              >
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
          <tr v-if="publishers.length === 0">
            <td colspan="3" class="text-center py-4">
              Không có dữ liệu nhà xuất bản
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Phân trang -->
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
    <div class="modal fade" id="publisherModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div
            class="modal-header"
            style="border-radius: calc(0.5rem - (1px)) calc(0.5rem - (1px)) 0 0"
          >
            <h5 class="modal-title">
              {{
                isEditing ? "Chỉnh sửa nhà xuất bản" : "Thêm nhà xuất bản mới"
              }}
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
                <label class="form-label">Tên nhà xuất bản</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.TenNXB"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Địa chỉ</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.DiaChi"
                  required
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
                  {{
                    loading
                      ? "Đang xử lý..."
                      : isEditing
                      ? "Cập nhật"
                      : "Thêm mới"
                  }}
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
          <div class="modal-body">
            <p>Bạn có chắc chắn muốn xóa nhà xuất bản này không?</p>
          </div>
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
              {{ loading ? "Đang xóa..." : "Xóa" }}
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
  name: "PublisherManagement",
  data() {
    return {
      publishers: [],
      searchKeyword: "",
      formData: {
        TenNXB: "",
        DiaChi: "",
      },
      selectedPublisher: null,
      isEditing: false,
      loading: false,
      error: null,
      publisherModal: null,
      deleteModal: null,
      currentPage: 1,
      itemsPerPage: 10, // Số dòng mỗi trang
    };
  },
  async mounted() {
    await this.loadPublishers();
    this.publisherModal = new Modal(document.getElementById("publisherModal"));
    this.deleteModal = new Modal(document.getElementById("deleteModal"));
  },
  computed: {
    totalItems() {
      return this.publishers.length;
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
    paginatedPublishers() {
      return this.publishers.slice(this.startIndex, this.endIndex);
    },
  },
  methods: {
    async loadPublishers() {
      try {
        const response = await api.getAllPublishers();
        this.publishers = response.data;
      } catch (error) {
        console.error("Lỗi khi tải danh sách nhà xuất bản:", error);
      }
    },
    async handleSearch() {
      if (this.searchKeyword.trim()) {
        try {
          const response = await api.searchPublishers(this.searchKeyword);
          this.publishers = response.data;
        } catch (error) {
          console.error("Lỗi khi tìm kiếm nhà xuất bản:", error);
        }
      } else {
        await this.loadPublishers();
      }
    },
    showAddModal() {
      this.isEditing = false;
      this.formData = { TenNXB: "", DiaChi: "" };
      this.error = null;
      this.publisherModal.show();
    },
    showEditModal(publisher) {
      this.isEditing = true;
      this.selectedPublisher = publisher;
      this.formData = { ...publisher };
      this.error = null;
      this.publisherModal.show();
    },
    async handleSubmit() {
      this.loading = true;
      this.error = null;
      try {
        if (this.isEditing) {
          await api.updatePublisher(this.selectedPublisher._id, this.formData);
          this.$notify({
            type: "success",
            title: "Cập nhật thành công",
            message: "Thông tin nhà xuất bản đã được cập nhật",
          });
        } else {
          await api.createPublisher(this.formData);
          this.$notify({
            type: "success",
            title: "Thêm mới thành công",
            message: "Nhà xuất bản mới đã được thêm vào hệ thống",
          });
        }
        await this.loadPublishers();
        this.publisherModal.hide();
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
    confirmDelete(publisher) {
      this.selectedPublisher = publisher;
      this.deleteModal.show();
    },
    async handleDelete() {
      this.loading = true;
      try {
        await api.deletePublisher(this.selectedPublisher._id);
        this.$notify({
          type: "success",
          title: "Xóa thành công",
          message: "Nhà xuất bản đã được xóa khỏi hệ thống",
        });
        await this.loadPublishers();
        this.deleteModal.hide();
      } catch (error) {
        this.$notify({
          type: "error",
          title: "Lỗi",
          message:
            error.response?.data?.message || "Không thể xóa nhà xuất bản",
        });
      } finally {
        this.loading = false;
      }
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
.publisher-management {
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
  padding-left: 2.75rem !important;
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

.pagination {
  gap: 0.25rem;
}

.page-link {
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  color: #64748b;
  border: none;
  transition: all 0.2s ease;
}

.page-item.active .page-link {
  background-color: #3b82f6;
  color: white;
}

.page-item:not(.active) .page-link:hover {
  background-color: #f1f5f9;
  color: #3b82f6;
}

.pages-info {
  color: #64748b;
  font-size: 0.875rem;
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

@media (max-width: 768px) {
  .publisher-management {
    padding: 1rem;
  }

  .header-section h2 {
    font-size: 1.5rem;
  }

  .add-btn {
    padding: 0.5rem 1rem;
  }
}
</style>
