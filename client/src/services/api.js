import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Đảm bảo baseURL đúng
  headers: {
    "Content-Type": "application/json",
  },
  // Thêm timeout và retry
  timeout: 5000,
  retry: 3,
});

// Thêm interceptor để tự động gắn token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm log để debug
api.interceptors.request.use((request) => {
  console.log("Starting Request:", request.method, request.url);
  return request;
});

// Thêm interceptor để xử lý lỗi
api.interceptors.response.use(
  (response) => {
    console.log("Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
    });
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default {
  // Auth APIs
  login(credentials) {
    return api.post("/auth/login", credentials);
  },
  register(userData) {
    return api.post("/auth/register", userData);
  },

  // Publisher APIs
  getAllPublishers() {
    return api.get("/publishers");
  },
  createPublisher(data) {
    return api.post("/publishers", data);
  },
  updatePublisher(id, data) {
    return api.put(`/publishers/${id}`, data);
  },
  deletePublisher(id) {
    return api.delete(`/publishers/${id}`);
  },
  searchPublishers(keyword) {
    return api.get(`/publishers/search?keyword=${keyword}`);
  },

  // Book APIs
  getAllBooks() {
    return api.get("/books");
  },
  createBook(data) {
    return api.post("/books", data).catch((error) => {
      console.error("Error creating book:", error.response?.data);
      throw error;
    });
  },
  updateBook(id, data) {
    return api.put(`/books/${id}`, data).catch((error) => {
      console.error("Error updating book:", error.response?.data);
      throw error;
    });
  },
  deleteBook(id) {
    return api.delete(`/books/${id}`);
  },
  searchBooks(keyword) {
    return api.get(`/books/search?keyword=${keyword}`);
  },

  // General purpose method
  get(endpoint) {
    return api.get(endpoint);
  },
  post(endpoint, data) {
    return api.post(endpoint, data);
  },
  put(endpoint, data) {
    return api.put(endpoint, data);
  },
  delete(endpoint) {
    return api.delete(endpoint);
  },

  // Staff borrowing management APIs
  getPendingRequests() {
    return api.get("/borrow-requests/pending");
  },
  getCurrentBorrowings() {
    return api.get("/borrowing/current");
  },
  approveRequest(requestId) {
    return api.post(`/borrow-requests/${requestId}/approve`);
  },

  getAllBorrowingHistory() {
    return api.get("/borrow-requests/all-history");
  },

  // Reader borrowing APIs
  requestBorrow(maSach) {
    return api.post("/borrow-requests/request", { MaSach: maSach });
  },
  getBorrowedBooks() {
    return api.get("/borrowing/borrowed");
  },
  getBorrowingHistory() {
    return api.get("/borrowing/history");
  },

  // Thêm API mới
  getBookStatus() {
    return api.get("/borrow-requests/book-status");
  },

  // API cho quản lý yêu cầu mượn sách
  getBookById(maSach) {
    return api.get(`/books/${maSach}`);
  },

  rejectRequest(requestId) {
    return api.post(`/borrow-requests/${requestId}/reject`);
  },

  // // API cho độc giả
  getMyBorrowingBooks() {
    return api.get("/borrow-requests/my-borrowing");
  },

  getMyBorrowingHistory() {
    return api.get("/borrow-requests/my-history");
  },

  getMyPendingRequests() {
    return api.get("/borrow-requests/my-pending");
  },

  returnBook(requestId) {
    return api.post(`/borrow-requests/${requestId}/return`);
  },
};
