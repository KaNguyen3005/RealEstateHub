const mongoose = require("mongoose");

const contactRequestSchema = new mongoose.Schema(
  {
    // Bất động sản mà người dùng đang gửi yêu cầu liên hệ.
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    // Người dùng đã đăng nhập gửi yêu cầu, có thể để trống nếu là khách vãng lai.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Họ tên người liên hệ.
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    // Email người liên hệ.
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    // Số điện thoại người liên hệ.
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    // Nội dung người dùng muốn hỏi về bất động sản.
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
    },
    // Trạng thái xử lý của yêu cầu liên hệ.
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

// Ưu tiên đọc các yêu cầu mới nhất theo từng bất động sản và lọc theo trạng thái.
contactRequestSchema.index({ propertyId: 1, createdAt: -1 });
contactRequestSchema.index({ status: 1 });
contactRequestSchema.index({ propertyId: 1, status: 1, createdAt: -1 });

contactRequestSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const ContactRequest =
  mongoose.models.ContactRequest || mongoose.model("ContactRequest", contactRequestSchema);

module.exports = ContactRequest;
