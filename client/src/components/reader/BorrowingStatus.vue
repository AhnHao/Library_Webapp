<template>
  <div class="borrowing-status">
    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Tên sách</th>
            <th>Mã sách</th>
            <th>Ngày mượn</th>
            <th>Ngày hẹn trả</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in borrowedBooks" :key="book._id">
            <td>{{ book.MaSach?.TenSach }}</td>
            <td>{{ book.MaSach?.MaSach }}</td>
            <td>{{ formatDate(book.NgayMuon) }}</td>
            <td>{{ formatDate(book.NgayHenTra) }}</td>
            <td>
              <span :class="getStatusClass(book.TrangThai)">
                {{ book.TrangThai }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "BorrowingStatus",
  props: {
    borrowedBooks: {
      type: Array,
      required: true,
    },
  },
  methods: {
    formatDate(date) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    getStatusClass(status) {
      switch (status) {
        case "Đang mượn":
          return "text-warning";
        case "Đã trả":
          return "text-success";
        case "Quá hạn":
          return "text-danger";
        default:
          return "";
      }
    },
  },
};
</script>

<style scoped>
.table-responsive {
  margin-top: 20px;
}

.text-warning {
  color: #ffc107;
}

.text-success {
  color: #28a745;
}

.text-danger {
  color: #dc3545;
}
</style>
