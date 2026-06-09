const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    // Bất động sản mà cuộc trò chuyện này đang xoay quanh.
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    // Danh sách người tham gia cuộc trò chuyện, thường là buyer và seller.
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    // Nội dung tin nhắn gần nhất để hiển thị nhanh trong danh sách chat.
    lastMessage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Tối ưu tra cứu theo property, theo participant và theo cặp property-participant.
conversationSchema.index({ propertyId: 1 });
conversationSchema.index({ participants: 1 });
conversationSchema.index({ propertyId: 1, participants: 1 });
conversationSchema.index({ participants: 1, updatedAt: -1 });
conversationSchema.index({ propertyId: 1, updatedAt: -1 });

conversationSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Conversation = mongoose.models.Conversation || mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
