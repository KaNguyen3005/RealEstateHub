import { z } from "zod";

export const contactRequestSchema = z.object({
  propertyId: z.string().trim().min(1, "Property is required"),
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(1, "Phone is required"),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
});

export type ContactRequestInput = z.input<typeof contactRequestSchema>;
export type ContactRequestValues = z.output<typeof contactRequestSchema>;
