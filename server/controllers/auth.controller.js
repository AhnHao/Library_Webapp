const Staff = require("../models/staff.model");
const Reader = require("../models/reader.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const generateCode = require("../utils/generateCode");

// Đăng ký tài khoản nhân viên
exports.registerStaff = async (req, res) => {
  try {
    const { HoTenNV, Password, ChucVu, DiaChi, SoDienThoai } = req.body;

    // Kiểm tra số điện thoại đã tồn tại trong cả Staff và Reader
    const existingStaff = await Staff.findOne({ SoDienThoai });
    const existingReader = await Reader.findOne({ SoDienThoai });

    if (existingStaff || existingReader) {
      return res.status(400).json({
        message: "Số điện thoại đã được sử dụng để đăng ký tài khoản",
      });
    }

    // Tạo mã nhân viên tự động
    const MSNV = await generateCode(Staff, "NV", "MSNV");

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(Password, 10);

    const newStaff = new Staff({
      MSNV,
      HoTenNV,
      Password: hashedPassword,
      ChucVu,
      DiaChi,
      SoDienThoai,
    });

    await newStaff.save();

    const staffResponse = newStaff.toObject();
    delete staffResponse.Password;

    res.status(201).json(staffResponse);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi đăng ký tài khoản nhân viên",
      error: error.message,
    });
  }
};

// Đăng ký tài khoản độc giả
exports.registerReader = async (req, res) => {
  try {
    const { HoTen, Password, DiaChi, SoDienThoai, NgaySinh } = req.body;

    // Kiểm tra số điện thoại đã tồn tại trong cả Staff và Reader
    const existingStaff = await Staff.findOne({ SoDienThoai });
    const existingReader = await Reader.findOne({ SoDienThoai });

    if (existingStaff || existingReader) {
      return res.status(400).json({
        message: "Số điện thoại đã được sử dụng để đăng ký tài khoản",
      });
    }

    // Tạo mã độc giả tự động
    const MaDocGia = await generateCode(Reader, "DG", "MaDocGia");

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(Password, 10);

    const newReader = new Reader({
      MaDocGia,
      HoTen,
      Password: hashedPassword,
      DiaChi,
      SoDienThoai,
      NgaySinh,
    });

    await newReader.save();

    const readerResponse = newReader.toObject();
    delete readerResponse.Password;

    res.status(201).json(readerResponse);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Lỗi khi đăng ký tài khoản độc giả",
      error: error.message,
    });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { SoDienThoai, Password } = req.body;

    // Log để debug
    console.log("Login attempt:", { SoDienThoai });

    if (!SoDienThoai || !Password) {
      return res.status(400).json({
        message: "Vui lòng nhập số điện thoại và mật khẩu",
      });
    }

    // Kiểm tra trong bảng Staff
    let user = await Staff.findOne({ SoDienThoai });
    let isStaff = true;

    // Nếu không tìm thấy trong Staff, kiểm tra trong Reader
    if (!user) {
      user = await Reader.findOne({ SoDienThoai });
      isStaff = false;
    }

    // Log để debug
    console.log("User found:", { found: !!user, isStaff });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Số điện thoại không tồn tại",
      });
    }

    const isValidPassword = await bcrypt.compare(Password, user.Password);

    // Log để debug
    console.log("Password validation:", { isValid: isValidPassword });

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Mật khẩu không đúng",
      });
    }

    // Tạo JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: isStaff ? "staff" : "reader",
        SoDienThoai: user.SoDienThoai,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "24h" }
    );

    // Trả về response thành công
    return res.status(200).json({
      success: true,
      token,
      role: isStaff ? "staff" : "reader",
      user: {
        id: user._id,
        code: isStaff ? user.MSNV : user.MaDocGia,
        name: isStaff ? user.HoTenNV : user.HoTen,
        SoDienThoai: user.SoDienThoai,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
