const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const User = require("../models/User");
const Property = require("../models/Property");
const { hashPassword } = require("../utils/password");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const DEMO_USERS = [
  {
    fullName: "Seller One",
    email: "seller1@realestatehub.local",
    password: "Seller@123",
    phone: "0901000001",
    role: "seller",
    avatar: "",
  },
  {
    fullName: "Seller Two",
    email: "seller2@realestatehub.local",
    password: "Seller@123",
    phone: "0901000002",
    role: "seller",
    avatar: "",
  },
  {
    fullName: "Nguyen Van A",
    email: "user1@realestatehub.local",
    password: "User@123",
    phone: "0902000001",
    role: "user",
    avatar: "",
  },
  {
    fullName: "Tran Thi B",
    email: "user2@realestatehub.local",
    password: "User@123",
    phone: "0902000002",
    role: "user",
    avatar: "",
  },
];

const DEMO_PROPERTIES = [
  {
    title: "Can ho view ho tai Tay Ho",
    description:
      "Can ho cao cap 2 phong ngu, view ho dep, gan trung tam va co day du tien ich.",
    type: "apartment",
    purpose: "sale",
    price: 4200000000,
    area: 82,
    bedrooms: 2,
    bathrooms: 2,
    address: "123 Duong Thanh Nien, Tay Ho",
    city: "Ha Noi",
    district: "Tay Ho",
    ward: "Quang An",
    latitude: 21.058,
    longitude: 105.818,
    images: [
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: ["Thang may", "Bai do xe", "Bao ve 24/7"],
    status: "approved",
  },
  {
    title: "Nha pho 3 tang trung tam Quan 7",
    description:
      "Nha pho thong thoang, phu hop o gia dinh hoac lam van phong kinh doanh.",
    type: "house",
    purpose: "rent",
    price: 18000000,
    area: 110,
    bedrooms: 3,
    bathrooms: 3,
    address: "45 Nguyen Thi Thap, Quan 7",
    city: "Ho Chi Minh",
    district: "Quan 7",
    ward: "Tan Phong",
    latitude: 10.737,
    longitude: 106.722,
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: ["San vuon", "San oto", "Ban cong"],
    status: "approved",
  },
  {
    title: "Dat nen dau tu Binh Chanh",
    description:
      "Lo dat vi tri dep, phap ly ro rang, phu hop dau tu trung va dai han.",
    type: "land",
    purpose: "sale",
    price: 2650000000,
    area: 125,
    bedrooms: 0,
    bathrooms: 0,
    address: "Duong Tran Van Giau, Binh Chanh",
    city: "Ho Chi Minh",
    district: "Binh Chanh",
    ward: "Tan Tuc",
    latitude: 10.703,
    longitude: 106.561,
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: ["Gan du an", "Mat tien duong lon"],
    status: "pending",
  },
  {
    title: "Van phong trung tam Da Nang",
    description:
      "Van phong rieng biet, phu hop cong ty nho va doi ngu ban hang.",
    type: "office",
    purpose: "rent",
    price: 22000000,
    area: 95,
    bedrooms: 0,
    bathrooms: 2,
    address: "88 Le Duan, Hai Chau",
    city: "Da Nang",
    district: "Hai Chau",
    ward: "Thach Thang",
    latitude: 16.067,
    longitude: 108.220,
    images: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: ["Internet toc do cao", "Le tan", "Phong hop"],
    status: "approved",
  },
];

function slugifyProperty(title, ownerId) {
  const baseSlug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${baseSlug}-${String(ownerId).slice(-6)}`;
}

async function upsertUser(userData) {
  const passwordHash = await hashPassword(userData.password);
  const payload = {
    fullName: userData.fullName,
    email: userData.email,
    passwordHash,
    phone: userData.phone,
    role: userData.role,
    avatar: userData.avatar,
    status: "active",
  };

  return User.findOneAndUpdate({ email: userData.email }, { $set: payload }, { upsert: true, new: true });
}

async function upsertProperty(propertyData, ownerId) {
  const payload = {
    ...propertyData,
    ownerId,
    slug: slugifyProperty(propertyData.title, ownerId),
  };

  return Property.findOneAndUpdate(
    { slug: payload.slug },
    { $set: payload },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function seedDemoData() {
  await connectDB();

  const seededUsers = new Map();
  for (const userData of DEMO_USERS) {
    const user = await upsertUser(userData);
    seededUsers.set(user.email, user);
  }

  const sellerOne = seededUsers.get("seller1@realestatehub.local");
  const sellerTwo = seededUsers.get("seller2@realestatehub.local");

  const ownerByTitle = {
    "Can ho view ho tai Tay Ho": sellerOne._id,
    "Nha pho 3 tang trung tam Quan 7": sellerOne._id,
    "Dat nen dau tu Binh Chanh": sellerTwo._id,
    "Van phong trung tam Da Nang": sellerTwo._id,
  };

  for (const propertyData of DEMO_PROPERTIES) {
    await upsertProperty(propertyData, ownerByTitle[propertyData.title]);
  }

  console.log("Demo sellers, users, and properties seeded successfully");
  console.log("- Sellers: 2");
  console.log("- Users: 2");
  console.log("- Properties: 4");
}

seedDemoData()
  .catch((error) => {
    console.error("Failed to seed demo data:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
