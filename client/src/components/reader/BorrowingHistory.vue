<template>
  <div class="borrowing-history">
    <div class="page-header">
      <h2><i class="bi bi-journal-text me-2"></i>Quản lý mượn sách</h2>
    </div>

    <!-- Modern Tabs -->
    <div class="tabs-container">
      <ul class="nav nav-pills">
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: activeTab === 'borrowing' }"
            @click="switchTab('borrowing')"
            href="#"
          >
            <i class="bi bi-journal-bookmark me-1"></i>
            Đang mượn
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: activeTab === 'history' }"
            @click="switchTab('history')"
            href="#"
          >
            <i class="bi bi-clock-history me-1"></i>
            Lịch sử mượn
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: activeTab === 'pending' }"
            @click="switchTab('pending')"
            href="#"
          >
            <i class="bi bi-hourglass-split me-1"></i>
            Chờ duyệt
          </a>
        </li>
      </ul>
    </div>

    <!-- Tables with modern design -->
    <div class="table-container">
      <transition name="fade" mode="out-in">
        <div class="table-responsive" :key="activeTab">
          <!-- Borrowing Table -->
          <table v-if="activeTab === 'borrowing'" class="table">
            <thead>
              <tr>
                <th>Tên sách</th>
                <th>Mã sách</th>
                <th>Ngày mượn</th>
                <th>Ngày hẹn trả</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="book in borrowingBooks" :key="book._id">
                <td>{{ book.MaSach?.TenSach }}</td>
                <td>{{ book.MaSach?.MaSach }}</td>
                <td>{{ formatDate(book.NgayMuon) }}</td>
                <td>{{ formatDate(book.NgayHenTra) }}</td>
                <td>
                  <span class="badge bg-primary">Đang mượn</span>
                </td>
                <td>
                  <button
                    class="btn btn-success btn-sm"
                    @click="returnBook(book._id)"
                  >
                    <i class="bi bi-arrow-return-left me-1"></i>Trả sách
                  </button>
                </td>
              </tr>
              <tr v-if="borrowingBooks.length === 0">
                <td colspan="6" class="text-center py-4">
                  <i class="bi bi-inbox me-2"></i>Không có sách đang mượn
                </td>
              </tr>
            </tbody>
          </table>

          <!-- History Table -->
          <table v-if="activeTab === 'history'" class="table">
            <thead>
              <tr>
                <th>Tên sách</th>
                <th>Mã sách</th>
                <th>Ngày mượn</th>
                <th>Ngày trả</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="book in historyBooks" :key="book._id">
                <td>{{ book.MaSach?.TenSach }}</td>
                <td>{{ book.MaSach?.MaSach }}</td>
                <td>{{ formatDate(book.NgayMuon) }}</td>
                <td>{{ formatDate(book.NgayTra) }}</td>
                <td>
                  <span
                    class="badge"
                    :class="getStatusBadgeClass(book.TrangThai)"
                  >
                    {{ book.TrangThai }}
                  </span>
                </td>
              </tr>
              <tr v-if="historyBooks.length === 0">
                <td colspan="5" class="text-center py-4">
                  <i class="bi bi-clock-history me-2"></i>Không có lịch sử mượn
                  sách
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Pending Table -->
          <table v-if="activeTab === 'pending'" class="table">
            <thead>
              <tr>
                <th>Tên sách</th>
                <th>Mã sách</th>
                <th>Ngày yêu cầu</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="request in pendingRequests" :key="request._id">
                <td>{{ request.MaSach?.TenSach }}</td>
                <td>{{ request.MaSach?.MaSach }}</td>
                <td>{{ formatDate(request.NgayYeuCau) }}</td>
                <td>
                  <span class="badge bg-warning">Chờ duyệt</span>
                </td>
              </tr>
              <tr v-if="pendingRequests.length === 0">
                <td colspan="4" class="text-center py-4">
                  <i class="bi bi-hourglass me-2"></i>Không có yêu cầu chờ duyệt
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import api from "../../services/api";

export default {
  name: "BorrowingList",
  data() {
    return {
      activeTab: "borrowing",
      borrowingBooks: [],
      historyBooks: [],
      pendingRequests: [],
    };
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    async switchTab(tab) {
      this.activeTab = tab;
      await this.loadData();
    },
    async loadData() {
      try {
        switch (this.activeTab) {
          case "borrowing":
            const borrowingResponse = await api.getMyBorrowingBooks();
            this.borrowingBooks = borrowingResponse.data;
            break;
          case "history":
            const historyResponse = await api.getMyBorrowingHistory();
            this.historyBooks = historyResponse.data;
            break;
          case "pending":
            const pendingResponse = await api.getMyPendingRequests();
            this.pendingRequests = pendingResponse.data;
            break;
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
    async returnBook(requestId) {
      try {
        await api.returnBook(requestId);
        alert("Đã trả sách thành công");
        await this.loadData();
      } catch (error) {
        console.error("Lỗi khi trả sách:", error);
        alert(error.response?.data?.message || "Không thể trả sách");
      }
    },
  },
};
</script>

<style scoped>
.borrowing-history {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h2 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #1e293b;
}

.tabs-container {
  margin-bottom: 2rem;
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
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  color: white;
}

.table-container {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.table {
  margin-bottom: 0;
  width: 100%;
}

.table thead th {
  background: #f8fafc;
  padding: 1.25rem 1rem;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #e2e8f0;
}

.table tbody td {
  padding: 1.25rem 1rem;
  vertical-align: middle;
  border-bottom: 1px solid #f1f5f9;
  color: #1e293b;
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.table tbody tr {
  transition: background-color 0.2s ease;
}

.table tbody tr:hover {
  background-color: #f8fafc;
}

/* Status badges */
.badge {
  padding: 0.5rem 1rem;
  font-weight: 500;
  border-radius: 0.5rem;
  display: inline-block;
  text-align: center;
  min-width: 100px;
  height: 36px;
  line-height: 20px;
  margin-bottom: 10px;
}

.badge.bg-success {
  background-color: #22c55e !important;
}
.badge.bg-warning {
  background-color: #f59e0b !important;
}
.badge.bg-danger {
  background-color: #ef4444 !important;
}
.badge.bg-primary {
  background-color: #3b82f6 !important;
}

.btn-sm {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .borrowing-history {
    padding: 1rem;
  }

  .nav-pills .nav-link {
    padding: 0.5rem 1rem;
  }

  .table thead th {
    font-size: 0.8rem;
  }
}
</style>
