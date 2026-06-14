const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const Property = require("../models/Property");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function dropLegacySlugIndex() {
  try {
    await Property.collection.dropIndex("slug_1");
    console.log("Dropped legacy slug_1 index");
  } catch (error) {
    if (error.codeName === "IndexNotFound" || error.code === 27) {
      console.log("No legacy slug_1 index found");
      return;
    }

    throw error;
  }
}

async function backfillMissingSlugs() {
  const properties = await Property.find({
    $or: [{ slug: { $exists: false } }, { slug: null }, { slug: "" }],
  }).select("_id title slug");

  for (const property of properties) {
    property.slug = `${String(property.title || "property")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "property"}-${String(property._id).slice(-6)}`;

    await property.save();
  }

  console.log(`Backfilled property slugs: ${properties.length}`);
}

async function createSparseSlugIndex() {
  await Property.collection.createIndex(
    { slug: 1 },
    {
      unique: true,
      sparse: true,
      name: "slug_1",
    }
  );

  console.log("Created sparse unique slug_1 index");
}

async function fixPropertySlugIndex() {
  await connectDB();
  await dropLegacySlugIndex();
  await backfillMissingSlugs();
  await createSparseSlugIndex();
  console.log("Property slug index fixed successfully");
}

fixPropertySlugIndex()
  .catch((error) => {
    console.error("Failed to fix property slug index:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
