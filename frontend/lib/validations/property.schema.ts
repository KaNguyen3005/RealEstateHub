import { z } from "zod";

const imageUrlsSchema = z.preprocess(
  (value) => {
    if (typeof value !== "string") {
      return value;
    }

    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  },
  z
    .array(z.string().url("Each image must be a valid URL"))
    .min(1, "Add at least 1 image URL")
    .max(10, "Images must not exceed 10 URLs")
);

const amenitiesSchema = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}, z.array(z.string()).optional());

export const propertySchema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters"),
  description: z.string().trim().min(20, "Description must be at least 20 characters"),
  type: z.enum(["apartment", "house", "land", "villa", "office"], {
    message: "Property type is required",
  }),
  purpose: z.enum(["sale", "rent"], {
    message: "Purpose is required",
  }),
  price: z.coerce.number().positive("Price must be greater than 0"),
  area: z.coerce.number().positive("Area must be greater than 0"),
  bedrooms: z.coerce.number().min(0, "Bedrooms must be greater than or equal to 0"),
  bathrooms: z.coerce.number().min(0, "Bathrooms must be greater than or equal to 0"),
  address: z.string().trim().min(5, "Address must be at least 5 characters"),
  city: z.string().trim().min(1, "City is required"),
  district: z.string().trim().optional(),
  ward: z.string().trim().optional(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  images: imageUrlsSchema,
  amenities: amenitiesSchema,
});

export type PropertyFormInput = z.input<typeof propertySchema>;
export type PropertyFormValues = z.output<typeof propertySchema>;
