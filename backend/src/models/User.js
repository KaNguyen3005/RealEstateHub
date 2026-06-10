const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Họ và tên đầy đủ của người dùng.
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    // Email dùng để đăng nhập và phải là duy nhất.
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Mật khẩu đã được băm, không lưu mật khẩu thô.
    passwordHash: {
      type: String,
      required: true,
    },
    // Số điện thoại liên hệ, không bắt buộc.
    phone: {
      type: String,
    },
    // Vai trò của tài khoản trong hệ thống.
    role: {
      type: String,
      enum: ["admin", "seller", "user"],
      default: "user",
    },
    // Ảnh đại diện của người dùng.
    avatar: {
      type: String,
    },
    // Refresh token để làm mới access token.
    refreshToken: {
      type: String,
    },
    // Trạng thái tài khoản: đang hoạt động hoặc bị khóa.
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ role: 1, status: 1 });

userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    delete ret.refreshToken;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
