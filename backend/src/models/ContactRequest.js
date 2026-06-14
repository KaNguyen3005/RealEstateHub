const mongoose = require("mongoose");

const contactRequestSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email is invalid"],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
    },
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
