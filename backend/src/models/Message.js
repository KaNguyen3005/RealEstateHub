const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    // Cuộc trò chuyện chứa tin nhắn này.
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    // Người gửi tin nhắn.
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Nội dung tin nhắn, giới hạn để tránh dữ liệu quá dài.
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    // Đánh dấu đã đọc hay chưa.
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Lấy tin nhắn theo cuộc trò chuyện và sắp xếp theo thời gian nhanh hơn.
messageSchema.index({ conversationId: 1, createdAt: 1 });

messageSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

module.exports = Message;
