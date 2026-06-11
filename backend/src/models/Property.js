const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    // Tiêu đề ngắn gọn của tin bất động sản.
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
    },
    // Slug duy nhất để hỗ trợ URL thân thiện và tránh trùng dữ liệu.
    slug: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    // Mô tả chi tiết về bất động sản.
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
    },
    // Loại bất động sản, ví dụ căn hộ hoặc nhà phố.
    type: {
      type: String,
      required: true,
      enum: ["apartment", "house", "land", "villa", "office"],
    },
    // Mục đích đăng tin: bán hoặc cho thuê.
    purpose: {
      type: String,
      required: true,
      enum: ["sale", "rent"],
    },
    // Giá bán hoặc giá thuê.
    price: {
      type: Number,
      required: true,
      min: 1,
    },
    // Diện tích của bất động sản.
    area: {
      type: Number,
      required: true,
      min: 1,
    },
    // Số phòng ngủ, mặc định là 0 nếu không khai báo.
    bedrooms: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Số phòng tắm, mặc định là 0 nếu không khai báo.
    bathrooms: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Địa chỉ chi tiết của bất động sản.
    address: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
    },
    // Tỉnh hoặc thành phố.
    city: {
      type: String,
      required: true,
      trim: true,
    },
    // Quận hoặc huyện.
    district: {
      type: String,
      trim: true,
    },
    // Phường hoặc xã.
    ward: {
      type: String,
      trim: true,
    },
    // Vĩ độ để hiển thị trên bản đồ.
    latitude: {
      type: Number,
      required: true,
    },
    // Kinh độ để hiển thị trên bản đồ.
    longitude: {
      type: Number,
      required: true,
    },
    // Danh sách ảnh của bất động sản, tối thiểu 1 và tối đa 10 ảnh.
    images: {
      type: [String],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length >= 1 && value.length <= 10,
        message: "Property must have between 1 and 10 images",
      },
    },
    // Danh sách tiện ích đi kèm.
    amenities: [
      {
        type: String,
        trim: true,
      },
    ],
    // Người dùng sở hữu tin đăng này.
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Trạng thái duyệt tin của hệ thống.
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "hidden"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

propertySchema.index({ status: 1, city: 1, purpose: 1, type: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ area: 1 });
propertySchema.index({ ownerId: 1, status: 1, createdAt: -1 });
propertySchema.index({
  title: "text",
  description: "text",
  address: "text",
});

propertySchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Property = mongoose.models.Property || mongoose.model("Property", propertySchema);

module.exports = Property;
