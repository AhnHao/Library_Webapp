<template>
  <div class="login-container">
    <div class="form-container">
      <div class="card login-card fade-in">
        <div class="card-header text-center">
          <i class="bi bi-book-half header-icon"></i>
          <h3>Chào mừng trở lại!</h3>
          <p class="text-muted">Đăng nhập vào tài khoản của bạn</p>
        </div>
        <div class="card-body">
          <form @submit.prevent="handleLogin">
            <div class="form-floating mb-4">
              <input
                type="text"
                class="form-control"
                id="phone"
                v-model="formData.SoDienThoai"
                placeholder="Số điện thoại"
                required
              />
              <label for="phone">
                <i class="bi bi-phone me-2"></i>Số điện thoại
              </label>
            </div>
            <div class="form-floating mb-4">
              <input
                type="password"
                class="form-control"
                id="password"
                v-model="formData.Password"
                placeholder="Mật khẩu"
                required
              />
              <label for="password">
                <i class="bi bi-lock me-2"></i>Mật khẩu
              </label>
            </div>
            <div class="d-grid gap-2">
              <button
                type="submit"
                class="btn btn-primary btn-lg"
                :disabled="loading"
              >
                <span
                  v-if="loading"
                  class="spinner-border spinner-border-sm me-2"
                ></span>
                {{ loading ? "Đang đăng nhập..." : "Đăng nhập" }}
              </button>
            </div>
          </form>
          <div class="text-center mt-4">
            <p class="mb-0">
              Chưa có tài khoản?
              <router-link to="/register" class="text-decoration-none fw-bold">
                Đăng ký ngay<i class="bi bi-arrow-right ms-1"></i>
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  name: "LoginView",
  data() {
    return {
      formData: {
        SoDienThoai: "",
        Password: "",
      },
      loading: false,
    };
  },
  methods: {
    async handleLogin() {
      if (this.loading) return;

      this.loading = true;
      try {
        const response = await api.login(this.formData);

        // Lưu thông tin đăng nhập
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userRole", response.data.role);
        localStorage.setItem("userData", JSON.stringify(response.data.user));

        // Hiển thị thông báo thành công
        this.$notify({
          type: "success",
          title: "Đăng nhập thành công",
          message: "Chào mừng bạn quay trở lại!",
        });

        // Chuyển hướng sau khi thông báo được hiển thị
        setTimeout(() => {
          this.$router.push(
            response.data.role === "staff" ? "/staff" : "/reader"
          );
        }, 500);
      } catch (error) {
        // Hiển thị thông báo lỗi
        this.$notify({
          type: "error",
          title: "Đăng nhập thất bại",
          message:
            error.response?.data?.message ||
            "Thông tin đăng nhập không chính xác",
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  padding: 20px;
}

.form-container {
  width: 100%;
  max-width: 450px;
  perspective: 1000px;
}

.login-card {
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: none;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.login-card:hover {
  transform: translateY(-5px) rotateX(5deg);
}

.card-header {
  background: transparent;
  padding: 2.5rem 2rem 1.5rem;
  border: none;
}

.header-icon {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.card-header h3 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.card-body {
  padding: 2rem;
}

.form-floating > label {
  color: #6b7280;
}

.form-control {
  border: 2px solid #e5e7eb;
  padding: 1rem;
  height: 3.5rem;
  font-size: 1rem;
}

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.btn-primary {
  background: linear-gradient(to right, var(--primary-color), #8b5cf6);
  border: none;
  font-weight: 600;
  padding: 1rem;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(99, 102, 241, 0.3);
}

@media (max-width: 576px) {
  .card-body {
    padding: 1.5rem;
  }

  .header-icon {
    font-size: 2rem;
  }

  .card-header h3 {
    font-size: 1.5rem;
  }
}
</style>
