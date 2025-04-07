<template>
  <div class="borrow-management">
    <h2 class="mb-4">
      <i class="bi bi-journal-check me-2"></i>
      Quản lý yêu cầu mượn sách
    </h2>

    <!-- Thanh tìm kiếm -->
    <div class="search-section mb-4">
      <div class="row">
        <div class="col-md-6">
          <div class="search-box">
            <i class="bi bi-search search-icon"></i>
            <input
              type="text"
              class="form-control search-input"
              placeholder="Tìm kiếm theo tên độc giả, tên sách..."
              v-model="searchKeyword"
              @input="handleSearch"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="tabs-container mb-4">
      <ul class="nav nav-pills">
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: activeTab === 'pending' }"
            @click="switchTab('pending')"
            href="#"
          >
            <i class="bi bi-clock-history me-2"></i>
            Duyệt yêu cầu mượn sách
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: activeTab === 'history' }"
            @click="switchTab('history')"
            href="#"
          >
            <i class="bi bi-journal-text me-2"></i>
            Lịch sử mượn
          </a>
        </li>
      </ul>
    </div>

    <div class="table-container">
      <!-- Pending Requests Table -->
      <div v-if="activeTab === 'pending'" class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Độc giả</th>
              <th>Tên sách</th>
              <th>Mã sách</th>
              <th>Ngày yêu cầu</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="request in sortedPendingRequests" :key="request._id">
              <td>{{ request.MaDocGia?.HoTen }}</td>
              <td>{{ request.MaSach?.TenSach }}</td>
              <td>{{ request.MaSach?.MaSach }}</td>
              <td>{{ formatDate(request.NgayYeuCau) }}</td>
              <td>
                <button
                  class="btn btn-success btn-sm me-2"
                  @click="approveRequest(request._id)"
                >
                  Duyệt
                </button>
                <button
                  class="btn btn-danger btn-sm"
                  @click="rejectRequest(request._id)"
                >
                  Từ chối
                </button>
              </td>
            </tr>
            <tr v-if="pendingRequests.length === 0">
              <td colspan="5" class="text-center">
                Không có yêu cầu mượn sách nào
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Borrowing History Table -->
      <div v-if="activeTab === 'history'" class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Độc giả</th>
              <th>Tên sách</th>
              <th>Mã sách</th>
              <th>Ngày mượn</th>
              <th>Ngày trả</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="history in borrowingHistory" :key="history._id">
              <td>{{ history.MaDocGia?.HoTen }}</td>
              <td>{{ history.MaSach?.TenSach }}</td>
              <td>{{ history.MaSach?.MaSach }}</td>
              <td>{{ formatDate(history.NgayMuon) }}</td>
              <td>{{ formatDate(history.NgayTra) }}</td>
              <td>
                <span
                  class="badge"
                  :class="getStatusBadgeClass(history.TrangThai)"
                >
                  {{ history.TrangThai }}
                </span>
              </td>
            </tr>
            <tr v-if="borrowingHistory.length === 0">
              <td colspan="6" class="text-center">
                Không có lịch sử mượn sách
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../../services/api";

export default {
  name: "BorrowManagement",
  data() {
    return {
      activeTab: "pending",
      pendingRequests: [],
      borrowingHistory: [],
      searchKeyword: "",
    };
  },
  async mounted() {
    await this.loadData();
  },
  computed: {
    sortedPendingRequests() {
      return [...this.pendingRequests].sort(
        (a, b) => new Date(b.NgayYeuCau) - new Date(a.NgayYeuCau)
      );
    },
    filteredRequests() {
      const keyword = this.searchKeyword.toLowerCase().trim();
      if (!keyword)
        return this.activeTab === "pending"
          ? this.sortedPendingRequests
          : this.borrowingHistory;

      const items =
        this.activeTab === "pending"
          ? this.sortedPendingRequests
          : this.borrowingHistory;

      return items.filter((item) => {
        const readerName = item.MaDocGia?.HoTen.toLowerCase() || "";
        const bookName = item.MaSach?.TenSach.toLowerCase() || "";
        return readerName.includes(keyword) || bookName.includes(keyword);
      });
    },
  },
  methods: {
    async switchTab(tab) {
      this.activeTab = tab;
      await this.loadData();
    },
    async handleSearch() {
      // Reset to first page if implementing pagination
      if (this.currentPage) this.currentPage = 1;
    },
    async loadData() {
      try {
        if (this.activeTab === "pending") {
          const response = await api.getPendingRequests();
          this.pendingRequests = response.data;
        } else if (this.activeTab === "history") {
          const response = await api.getAllBorrowingHistory();
          this.borrowingHistory = response.data;
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        alert("Không thể tải dữ liệu");
      }
    },
    formatDate(date) {
      if (!date) return "";
      return new Date(date).toLocaleDateString("vi-VN");
    },
    getStatusBadgeClass(status) {
      return {
        "bg-success": status === "đã trả",
        "bg-danger": status === "từ chối",
        "bg-warning": status === "chờ duyệt",
        "bg-primary": status === "đã duyệt",
      };
    },
    async approveRequest(requestId) {
      try {
        await api.approveRequest(requestId);
        this.$notify({
          type: "success",
          title: "Thành công",
          message: "Đã duyệt yêu cầu mượn sách",
        });
        await this.loadData();
      } catch (error) {
        this.$notify({
          type: "error",
          title: "Thất bại",
          message: error.response?.data?.message || "Không thể duyệt yêu cầu",
        });
      }
    },
    async rejectRequest(requestId) {
      try {
        await api.rejectRequest(requestId);
        this.$notify({
          type: "success",
          title: "Thành công",
          message: "Đã từ chối yêu cầu mượn sách",
        });
        await this.loadData();
      } catch (error) {
        this.$notify({
          type: "error",
          title: "Thất bại",
          message: error.response?.data?.message || "Không thể từ chối yêu cầu",
        });
      }
    },
    async handleApprove(requestId) {
      try {
        await api.approveBorrowRequest(requestId);
        this.$notify({
          type: "success",
          title: "Phê duyệt thành công",
          message: "Yêu cầu mượn sách đã được chấp nhận",
        });
        await this.loadData();
      } catch (error) {
        this.$notify({
          type: "error",
          title: "Lỗi",
          message:
            error.response?.data?.message || "Không thể phê duyệt yêu cầu",
        });
      }
    },

    async handleReject(requestId) {
      try {
        await api.rejectBorrowRequest(requestId);
        this.$notify({
          type: "success",
          title: "Đã từ chối",
          message: "Yêu cầu mượn sách đã bị từ chối",
        });
        await this.loadData();
      } catch (error) {
        this.$notify({
          type: "error",
          title: "Lỗi",
          message: error.response?.data?.message || "Không thể từ chối yêu cầu",
        });
      }
    },
  },
};
</script>

<style scoped>
.borrow-management {
  background-color: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.tabs-container {
  border-bottom: 2px solid #e2e8f0;
}

.nav-pills {
  gap: 0.5rem;
}

.nav-pills .nav-link {
  padding: 0.75rem 1.5rem;
  color: #64748b;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.nav-pills .nav-link:hover:not(.active) {
  background-color: #f1f5f9;
}

.nav-pills .nav-link.active {
  background-color: #3b82f6;
  color: white;
}

.table-container {
  margin-top: 1.5rem;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.badge {
  padding: 0.5em 1em;
  font-weight: 500;
  border-radius: 9999px;
}

/* Custom status colors */
.badge.bg-success {
  background-color: #10b981 !important;
}
.badge.bg-danger {
  background-color: #ef4444 !important;
}
.badge.bg-warning {
  background-color: #f59e0b !important;
}
.badge.bg-primary {
  background-color: #3b82f6 !important;
}

/* Add to existing styles */
.search-box {
  position: relative;
  margin-bottom: 1rem;
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
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.table tr {
  transition: background-color 0.2s ease;
}

.table tr:hover {
  background-color: #f8fafc;
}

.badge {
  font-weight: 500;
  padding: 0.5em 1em;
  border-radius: 9999px;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

/* Status badge colors */
.badge.bg-success {
  background-color: #10b981 !important;
}
.badge.bg-danger {
  background-color: #ef4444 !important;
}
.badge.bg-warning {
  background-color: #f59e0b !important;
}
.badge.bg-primary {
  background-color: #3b82f6 !important;
}
</style>
