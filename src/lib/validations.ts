import { z } from "zod";

export const carFilterSchema = z.object({
  q: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minYear: z.coerce.number().optional(),
  maxYear: z.coerce.number().optional(),
  maxMileage: z.coerce.number().optional(),
  transmission: z.string().optional(),
  fuelType: z.string().optional(),
  bodyType: z.string().optional(),
  condition: z.string().optional(),
  location: z.string().optional(),
  sort: z.enum(["newest", "price-asc", "price-desc", "year-desc", "mileage-asc"]).default("newest"),
  page: z.coerce.number().min(1).default(1),
});

export type CarFilters = z.infer<typeof carFilterSchema>;

export const listCarSchema = z.object({
  title: z.string().min(10, "Give a descriptive title (min 10 chars)"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce.number().min(1995).max(new Date().getFullYear() + 1),
  price: z.coerce.number().min(50000, "Price seems too low"),
  negotiable: z.boolean().default(false),
  listingType: z.enum(["SALE", "RENT", "BOTH"]).default("SALE"),
  dailyRate: z.coerce.number().min(500, "Daily rate seems too low").optional(),
  mileage: z.coerce.number().min(0).max(1_000_000),
  transmission: z.enum(["AUTOMATIC", "MANUAL", "CVT"]),
  fuelType: z.enum(["PETROL", "DIESEL", "HYBRID", "ELECTRIC", "LPG"]),
  bodyType: z.enum(["SUV", "SEDAN", "HATCHBACK", "PICKUP", "COUPE", "CONVERTIBLE", "WAGON", "VAN", "TRUCK", "COMMERCIAL"]),
  condition: z.enum(["NEW", "FOREIGN_USED", "LOCALLY_USED"]),
  location: z.string().min(1),
  description: z.string().min(30, "Describe the car in at least 30 characters"),
  engineCc: z.coerce.number().optional(),
  drive: z.string().optional(),
  color: z.string().optional(),
  images: z.array(z.string().url()).min(1, "Add at least 1 photo").max(12),
}).superRefine((v, ctx) => {
  if (v.listingType !== "SALE" && !v.dailyRate) {
    ctx.addIssue({ code: "custom", path: ["dailyRate"], message: "Daily rate is required for hire listings" });
  }
});

export type ListCarInput = z.infer<typeof listCarSchema>;

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(9).optional(),
  password: z.string().min(8, "Min 8 characters"),
  role: z.enum(["BUYER", "SELLER", "DEALER"]).default("BUYER"),
});

export const inquirySchema = z.object({
  carId: z.string(),
  name: z.string().min(2),
  phone: z.string().min(9, "Enter a valid phone e.g. 0722…"),
  message: z.string().min(5),
});
