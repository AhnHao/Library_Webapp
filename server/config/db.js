const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://mongodb:27017/library",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Kết nối MongoDB thành công");
  } catch (err) {
    console.error("Lỗi kết nối MongoDB:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
