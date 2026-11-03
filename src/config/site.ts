export const siteConfig = {
  brandName: process.env.NEXT_PUBLIC_BRAND_NAME || "Motiva",
  tagline: "Find your next drive.",
  taglineAlt: "Premium cars. Verified.",
  description:
    "Motiva — Kenya's premium car marketplace. Verified dealers, inspected cars, transparent KES pricing. From Nairobi to Mombasa, Kisumu to Nakuru.",
  url: (process.env.NEXT_PUBLIC_APP_URL || "https://motiva.co.ke").replace(/\/$/, ""),
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "254729396174",
  locations: [
    "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita-Taveta",
    "Garissa", "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru",
    "Tharaka-Nithi", "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua",
    "Nyeri", "Kirinyaga", "Murang'a", "Kiambu", "Turkana", "West Pokot",
    "Samburu", "Trans-Nzoia", "Uasin Gishu", "Elgeyo-Marakwet", "Nandi",
    "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado", "Kericho", "Bomet",
    "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya", "Kisumu", "Homa Bay",
    "Migori", "Kisii", "Nyamira", "Nairobi",
  ],
  makes: [
    "Toyota", "Nissan", "Mercedes-Benz", "BMW", "Honda", "Mazda", "Subaru",
    "Volkswagen", "Audi", "Mitsubishi", "Suzuki", "Land Rover", "Ford", "Isuzu",
    "Lexus", "Volvo", "Porsche", "Jeep", "Peugeot", "Hyundai", "Kia", "Jaguar",
    "Mini", "Daihatsu", "Hino", "UD Trucks",
  ],
  bodyTypes: [
    { value: "SUV", label: "SUVs", blurb: "Prado, RAV4, CX-5" },
    { value: "SEDAN", label: "Sedans", blurb: "Axio, Note, C-Class" },
    { value: "PICKUP", label: "Pickups", blurb: "Hilux, D-Max, Ranger" },
    { value: "HATCHBACK", label: "Hatchbacks", blurb: "Fit, Demio, Swift" },
    { value: "VAN", label: "Vans", blurb: "Hiace, NV350" },
    { value: "COMMERCIAL", label: "Commercial", blurb: "Canter, FH" },
    { value: "COUPE", label: "Coupes", blurb: "420i, 4 Series" },
    { value: "CONVERTIBLE", label: "Convertibles", blurb: "MX-5 RF, Z4" },
  ] as const,
};

export type SiteConfig = typeof siteConfig;
