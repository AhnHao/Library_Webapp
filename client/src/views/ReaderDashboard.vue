<template>
  <div class="dashboard-wrapper">
    <!-- Modern Navbar -->
    <nav class="navbar navbar-expand-lg">
      <div class="container">
        <a class="navbar-brand">
          <i class="bi bi-book-half"></i> THƯ VIỆN ONLINE
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a
                class="nav-link"
                :class="{ active: activeTab === 'books' }"
                @click="activeTab = 'books'"
              >
                <i class="bi bi-grid-3x3-gap me-1"></i>
                Thư viện sách
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                :class="{ active: activeTab === 'history' }"
                @click="activeTab = 'history'"
              >
                <i class="bi bi-clock-history me-1"></i>
                Quản lý mượn sách
              </a>
            </li>
          </ul>
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link logout-button" @click="handleLogout">
                <i class="bi bi-box-arrow-right me-2"></i>
                Đăng xuất
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Main Content with Transition -->
    <div class="main-content">
      <div class="container py-4">
        <transition name="fade" mode="out-in">
          <component :is="currentComponent" :key="activeTab" />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import BookList from "../components/reader/BookList.vue";
import BorrowingHistory from "../components/reader/BorrowingHistory.vue";

export default {
  name: "ReaderDashboard",
  components: {
    BookList,
    BorrowingHistory,
  },
  data() {
    return {
      activeTab: "books",
      userData: JSON.parse(localStorage.getItem("userData")) || {},
    };
  },
  computed: {
    currentComponent() {
      return this.activeTab === "books" ? "BookList" : "BorrowingHistory";
    },
  },
  methods: {
    async handleLogout() {
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        this.$notify({
          type: "info",
          title: "Đăng xuất",
          message: "Bạn đã đăng xuất khỏi hệ thống",
        });
        this.$router.push("/login");
      } catch (error) {
        this.$notify({
          type: "error",
          title: "Lỗi",
          message: "Có lỗi xảy ra khi đăng xuất",
        });
      }
    },
  },
};
</script>

<style scoped>
.dashboard-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f6f9fc 0%, #ffffff 100%);
}

.navbar {
  background: white;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  padding: 1rem 0;
}

.navbar-brand {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2563eb;
  letter-spacing: 0.5px;
}

.navbar-brand i {
  font-size: 1.5rem;
  vertical-align: middle;
  margin-right: 0.5rem;
}

.nav-link {
  padding: 0.5rem 1rem;
  margin: 0 0.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  color: #64748b;
  transition: all 0.3s ease;
}

.nav-link:hover:not(.active) {
  color: #2563eb;
  background-color: #f1f5f9;
}

.nav-link.active {
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  color: white;
}

.dropdown-menu {
  border: none;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
}

.dropdown-item {
  padding: 0.75rem 1rem;
  color: #64748b;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background-color: #f1f5f9;
  color: #2563eb;
}

.main-content {
  padding: 2rem 0;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.logout-button {
  color: #ef4444 !important;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.logout-button:hover {
  background: rgba(239, 68, 68, 0.15);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .navbar-brand {
    font-size: 1.1rem;
  }

  .nav-link {
    padding: 0.5rem;
  }
}
</style>
