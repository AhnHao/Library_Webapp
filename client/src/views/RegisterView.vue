<template>
  <div class="register-container">
    <div class="form-container">
      <div class="card register-card fade-in">
        <div class="card-header text-center">
          <i class="bi bi-person-plus header-icon"></i>
          <h3>Tạo tài khoản mới</h3>
          <div class="btn-group mt-4" role="group">
            <button
              type="button"
              class="btn role-btn"
              :class="isStaff ? 'active' : ''"
              @click="isStaff = true"
            >
              <i class="bi bi-person-badge me-2"></i>Nhân viên
            </button>
            <button
              type="button"
              class="btn role-btn"
              :class="!isStaff ? 'active' : ''"
              @click="isStaff = false"
            >
              <i class="bi bi-person me-2"></i>Độc giả
            </button>
          </div>
        </div>
        <div class="card-body">
          <form @submit.prevent="handleRegister">
            <div class="form-floating mb-3">
              <input
                type="text"
                class="form-control"
                id="name"
                v-model="formData.HoTen"
                placeholder="Họ và tên"
                required
              />
              <label for="name"
                ><i class="bi bi-person-circle me-2"></i>Họ và tên</label
              >
            </div>
            <div class="form-floating mb-3">
              <input
                type="text"
                class="form-control"
                id="phone"
                v-model="formData.SoDienThoai"
                placeholder="Số điện thoại"
                required
              />
              <label for="phone"
                ><i class="bi bi-telephone me-2"></i>Số điện thoại</label
              >
            </div>
            <div class="form-floating mb-3">
              <input
                type="password"
                class="form-control"
                id="password"
                v-model="formData.Password"
                placeholder="Mật khẩu"
                required
              />
              <label for="password"
                ><i class="bi bi-lock me-2"></i>Mật khẩu</label
              >
            </div>
            <div class="form-floating mb-3">
              <input
                type="text"
                class="form-control"
                id="address"
                v-model="formData.DiaChi"
                placeholder="Địa chỉ"
              />
              <label for="address"
                ><i class="bi bi-geo-alt me-2"></i>Địa chỉ</label
              >
            </div>
            <div v-if="isStaff" class="form-floating mb-3">
              <input
                type="text"
                class="form-control"
                id="position"
                v-model="formData.ChucVu"
                placeholder="Chức vụ"
                required
              />
              <label for="position"
                ><i class="bi bi-briefcase me-2"></i>Chức vụ</label
              >
            </div>
            <div v-if="!isStaff" class="form-floating mb-3">
              <input
                type="date"
                class="form-control"
                id="birthdate"
                v-model="formData.NgaySinh"
                placeholder="Ngày sinh"
                required
              />
              <label for="birthdate"
                ><i class="bi bi-calendar me-2"></i>Ngày sinh</label
              >
            </div>
            <div class="alert alert-danger" v-if="error">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ error }}
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
                {{ loading ? "Đang đăng ký..." : "Đăng ký" }}
              </button>
            </div>
          </form>
          <div class="text-center mt-4">
            <p class="mb-0">
              Đã có tài khoản?
              <router-link to="/login" class="text-decoration-none fw-bold">
                Đăng nhập ngay<i class="bi bi-arrow-right ms-1"></i>
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
  name: "RegisterView",
  data() {
    return {
      isStaff: false,
      formData: {
        HoTen: "",
        SoDienThoai: "",
        Password: "",
        DiaChi: "",
        ChucVu: "",
        NgaySinh: "",
      },
      loading: false,
      error: null,
    };
  },
  methods: {
    async handleRegister() {
      this.loading = true;
      this.error = null;
      try {
        let registerData;
        if (this.isStaff) {
          registerData = {
            HoTenNV: this.formData.HoTen,
            SoDienThoai: this.formData.SoDienThoai,
            Password: this.formData.Password,
            DiaChi: this.formData.DiaChi,
            ChucVu: this.formData.ChucVu,
            isStaff: true,
          };
        } else {
          registerData = {
            HoTen: this.formData.HoTen,
            SoDienThoai: this.formData.SoDienThoai,
            Password: this.formData.Password,
            DiaChi: this.formData.DiaChi,
            NgaySinh: this.formData.NgaySinh,
            isStaff: false,
          };
        }

        await api.register(registerData);
        this.$notify({
          type: "success",
          title: "Đăng ký thành công",
          message: "Tài khoản của bạn đã được tạo. Vui lòng đăng nhập!",
        });
        this.$router.push("/login");
      } catch (error) {
        this.$notify({
          type: "error",
          title: "Đăng ký thất bại",
          message: error.response?.data?.message || "Không thể tạo tài khoản",
        });
      } finally {
        this.loading = false;
      }
    },
  },
  watch: {
    isStaff() {
      // Reset form khi chuyển đổi loại tài khoản
      this.formData = {
        HoTen: "",
        SoDienThoai: "",
        Password: "",
        DiaChi: "",
        ChucVu: "",
        NgaySinh: "",
      };
      this.error = null;
    },
  },
};
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  padding: 20px;
}

.form-container {
  width: 100%;
  max-width: 500px;
  perspective: 1000px;
}

.register-card {
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: none;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.header-icon {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.role-btn {
  background: transparent;
  border: 2px solid #e5e7eb;
  color: #6b7280;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  flex: 1;
}

.role-btn.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.role-btn:hover:not(.active) {
  background: #f3f4f6;
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

  .role-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}
</style>
