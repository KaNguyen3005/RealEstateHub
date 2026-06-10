const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    // Người dùng đã đánh dấu yêu thích.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Bất động sản được đánh dấu yêu thích.
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Mỗi cặp user-property chỉ được xuất hiện một lần.
favoriteSchema.index({ userId: 1, propertyId: 1 }, { unique: true });

favoriteSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Favorite = mongoose.models.Favorite || mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;
