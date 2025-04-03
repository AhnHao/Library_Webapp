<template>
  <div class="dashboard-container">
    <nav class="navbar navbar-expand-lg navbar-dark">
      <div class="container">
        <a class="navbar-brand">
          <i class="bi bi-book me-2"></i>
          Quản lý thư viện
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
                <i class="bi bi-book-half me-1"></i>
                Quản lý sách
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                :class="{ active: activeTab === 'publishers' }"
                @click="activeTab = 'publishers'"
              >
                <i class="bi bi-building me-1"></i>
                Quản lý NXB
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                :class="{ active: activeTab === 'borrowings' }"
                @click="activeTab = 'borrowings'"
              >
                <i class="bi bi-journal-check me-1"></i>
                Quản lý mượn sách
              </a>
            </li>
          </ul>
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link logout-link" @click="handleLogout">
                <i class="bi bi-box-arrow-right me-1"></i>
                Đăng xuất
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

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
import BookManagement from "../components/staff/BookManagement.vue";
import PublisherManagement from "../components/staff/PublisherManagement.vue";
import BorrowManagement from "../components/staff/BorrowManagement.vue";

export default {
  name: "StaffDashboard",
  components: {
    BookManagement,
    PublisherManagement,
    BorrowManagement,
  },
  data() {
    return {
      activeTab: "books",
    };
  },
  computed: {
    currentComponent() {
      const components = {
        books: "BookManagement",
        publishers: "PublisherManagement",
        borrowings: "BorrowManagement",
      };
      return components[this.activeTab];
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
.dashboard-container {
  min-height: 100vh;
  background-color: #f8fafc;
}

.navbar {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: 600;
}

.nav-link {
  padding: 0.5rem 1rem;
  margin: 0 0.25rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.nav-link:hover:not(.active) {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: 500;
}

.logout-link:hover {
  color: #fecaca !important;
}

.main-content {
  padding-top: 1rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .navbar-brand {
    font-size: 1.25rem;
  }

  .nav-link {
    padding: 0.5rem;
  }
}
</style>
