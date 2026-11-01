import { PrismaClient, Transmission, FuelType, BodyType, CarCondition } from "@prisma/client";
import bcrypt from "bcryptjs";
import { slugify } from "../src/lib/utils";

const prisma = new PrismaClient();

// Unsplash images (stable IDs) for realistic car photos
const img = (id: string) => `https://images.unsplash.com/${id}?q=80&w=1200&auto=format&fit=crop`;

type SeedCar = {
  title: string; make: string; model: string; year: number; price: number; mileage: number;
  transmission: Transmission; fuelType: FuelType; bodyType: BodyType; condition: CarCondition;
  location: string; description: string; featured: boolean; verified: boolean;
  engineCc: number; drive: string; color: string; images: string[]; dealer: string;
};

const cars: SeedCar[] = [
  {
    title: "2019 Toyota Land Cruiser Prado TX-L 2.8D", dealer: "kamau",
    make: "Toyota", model: "Land Cruiser Prado", year: 2019, price: 6850000, mileage: 62000,
    transmission: Transmission.AUTOMATIC, fuelType: FuelType.DIESEL, bodyType: BodyType.SUV,
    condition: CarCondition.FOREIGN_USED, location: "Nairobi",
    description: "Foreign used Prado TX-L, 2.8L diesel, 7-seater leather, sunroof, duty paid, ready logbook. Fully serviced with service history.",
    featured: true, verified: true, engineCc: 2800, drive: "4WD", color: "Pearl White",
    images: [img("photo-1533473353331-0135ef1b58bf"), img("photo-1503376780353-7e6692767b70"), img("photo-1494976388531-d1058494cdd8")],
  },
  {
    title: "2021 Toyota Hilux Double Cab 2.8 GD-6", dealer: "kamau",
    make: "Toyota", model: "Hilux", year: 2021, price: 5490000, mileage: 48000,
    transmission: Transmission.MANUAL, fuelType: FuelType.DIESEL, bodyType: BodyType.PICKUP,
    condition: CarCondition.FOREIGN_USED, location: "Nakuru",
    description: "Ex-Japan Hilux double cab, 2.8 GD-6, 4WD, canopy fitted, new tyres. Ideal for farm and business.",
    featured: true, verified: true, engineCc: 2800, drive: "4WD", color: "Silver",
    images: [img("photo-1533106418989-88406c7cc8ca"), img("photo-1559416523-140ddc511d3a")],
  },
  {
    title: "2018 Mercedes-Benz C200 AMG Line", dealer: "kamau",
    make: "Mercedes-Benz", model: "C200", year: 2018, price: 3950000, mileage: 54000,
    transmission: Transmission.AUTOMATIC, fuelType: FuelType.PETROL, bodyType: BodyType.SEDAN,
    condition: CarCondition.FOREIGN_USED, location: "Nairobi",
    description: "C200 AMG Line, panoramic roof, half-leather, cruise control, parking sensors. Well maintained.",
    featured: true, verified: true, engineCc: 2000, drive: "2WD", color: "Obsidian Black",
    images: [img("photo-1618843479313-40f8afb4b4d8"), img("photo-1617531653332-bd46c24f2068")],
  },
  {
    title: "2017 Nissan Note e-Power Medalist", dealer: "coast",
    make: "Nissan", model: "Note", year: 2017, price: 1250000, mileage: 68000,
    transmission: Transmission.AUTOMATIC, fuelType: FuelType.HYBRID, bodyType: BodyType.HATCHBACK,
    condition: CarCondition.FOREIGN_USED, location: "Mombasa",
    description: "Fuel-sipping e-Power hybrid, 360 camera, push start. Perfect town car, duty paid.",
    featured: false, verified: true, engineCc: 1200, drive: "2WD", color: "Wine Red",
    images: [img("photo-1549317661-bd32c8ce0db2"), img("photo-1552519507-da3b142c6e3d")],
  },
  {
    title: "2020 BMW X3 xDrive20d M Sport", dealer: "kamau",
    make: "BMW", model: "X3", year: 2020, price: 5650000, mileage: 41000,
    transmission: Transmission.AUTOMATIC, fuelType: FuelType.DIESEL, bodyType: BodyType.SUV,
    condition: CarCondition.FOREIGN_USED, location: "Nairobi",
    description: "X3 M Sport, panoramic roof, electric tailgate, iDrive, run-flats. KRA compliant.",
    featured: true, verified: false, engineCc: 2000, drive: "AWD", color: "Phytonic Blue",
    images: [img("photo-1555215695-3004980ad54e"), img("photo-1580273916550-e323be2ae537")],
  },
  {
    title: "2016 Toyota Fielder G 1.5 Hybrid", dealer: "lake",
    make: "Toyota", model: "Fielder", year: 2016, price: 1580000, mileage: 89000,
    transmission: Transmission.CVT, fuelType: FuelType.HYBRID, bodyType: BodyType.WAGON,
    condition: CarCondition.LOCALLY_USED, location: "Kisumu",
    description: "Locally used Fielder Hybrid, lady driven, accident-free, new shocks. Ready transfer.",
    featured: false, verified: true, engineCc: 1500, drive: "2WD", color: "Silver",
    images: [img("photo-1621007947382-bb3c3994e3fb")],
  },
  {
    title: "2022 Suzuki Swift RS 1.2", dealer: "rift",
    make: "Suzuki", model: "Swift", year: 2022, price: 1890000, mileage: 22000,
    transmission: Transmission.CVT, fuelType: FuelType.PETROL, bodyType: BodyType.HATCHBACK,
    condition: CarCondition.FOREIGN_USED, location: "Eldoret",
    description: "Almost new Swift RS, paddle shifts, push start, very low mileage. Ideal first car.",
    featured: false, verified: false, engineCc: 1200, drive: "2WD", color: "Burning Red",
    images: [img("photo-1541899481282-d53bffe3c35d")],
  },
  {
    title: "2015 Subaru Forester XT 2.0T", dealer: "kamau",
    make: "Subaru", model: "Forester", year: 2015, price: 2150000, mileage: 98000,
    transmission: Transmission.CVT, fuelType: FuelType.PETROL, bodyType: BodyType.SUV,
    condition: CarCondition.LOCALLY_USED, location: "Thika",
    description: "Forester XT turbo, Eyesight, leather, well serviced by Subaru Kenya. No issues.",
    featured: false, verified: true, engineCc: 2000, drive: "AWD", color: "Dark Grey",
    images: [img("photo-1547038577-da80abbc4f19")],
  },
  {
    title: "2023 Toyota RAV4 Adventure 2.5 Hybrid", dealer: "kamau",
    make: "Toyota", model: "RAV4", year: 2023, price: 7200000, mileage: 12000,
    transmission: Transmission.CVT, fuelType: FuelType.HYBRID, bodyType: BodyType.SUV,
    condition: CarCondition.NEW, location: "Nairobi",
    description: "Brand new RAV4 Adventure ex-UK, panoramic roof, JBL, 360 cam. Warranty included.",
    featured: true, verified: true, engineCc: 2500, drive: "AWD", color: "Lunar Rock",
    images: [img("photo-1626668893632-6f3d4466d22f"), img("photo-1606664515524-ed2f786a0bd6")],
  },
  {
    title: "2014 Isuzu D-Max Double Cab", dealer: "coast",
    make: "Isuzu", model: "D-Max", year: 2014, price: 2350000, mileage: 132000,
    transmission: Transmission.MANUAL, fuelType: FuelType.DIESEL, bodyType: BodyType.PICKUP,
    condition: CarCondition.LOCALLY_USED, location: "Machakos",
    description: "Workhorse D-Max, well maintained fleet vehicle, new clutch, ready for kazi.",
    featured: false, verified: false, engineCc: 2500, drive: "4WD", color: "White",
    images: [img("photo-1605893477799-b99e3b8b93fe")],
  },
  {
    title: "2019 Mazda CX-5 XD Proactive Diesel", dealer: "kamau",
    make: "Mazda", model: "CX-5", year: 2019, price: 3250000, mileage: 58000,
    transmission: Transmission.AUTOMATIC, fuelType: FuelType.DIESEL, bodyType: BodyType.SUV,
    condition: CarCondition.FOREIGN_USED, location: "Nairobi",
    description: "CX-5 diesel, Bose sound, leather, heads-up display. Very clean unit.",
    featured: false, verified: true, engineCc: 2200, drive: "AWD", color: "Soul Red",
    images: [img("photo-1594502184342-2e12f877aa73")],
  },
  {
    title: "2017 Honda Fit Hybrid F-Package", dealer: "lake",
    make: "Honda", model: "Fit", year: 2017, price: 1180000, mileage: 74000,
    transmission: Transmission.CVT, fuelType: FuelType.HYBRID, bodyType: BodyType.HATCHBACK,
    condition: CarCondition.FOREIGN_USED, location: "Nyeri",
    description: "Honda Fit Hybrid, extremely economical (28km/l), space saver, clean interior.",
    featured: false, verified: false, engineCc: 1500, drive: "2WD", color: "Silver",
    images: [img("photo-1535732820275-9ffd998cac22")],
  },
  // ---- Extra categories: COUPE, CONVERTIBLE, VAN, TRUCK, COMMERCIAL ----
  {
    title: "2021 BMW 420i M Sport Coupe", dealer: "kamau",
    make: "BMW", model: "420i", year: 2021, price: 4450000, mileage: 38000,
    transmission: Transmission.AUTOMATIC, fuelType: FuelType.PETROL, bodyType: BodyType.COUPE,
    condition: CarCondition.FOREIGN_USED, location: "Nairobi",
    description: "Stunning 4 Series coupe, M Sport package, laser lights, Harman Kardon, accident-free.",
    featured: true, verified: true, engineCc: 2000, drive: "2WD", color: "Portimao Blue",
    images: [img("photo-1555215695-3004980ad54e"), img("photo-1580273916550-e323be2ae537")],
  },
  {
    title: "2019 Mazda MX-5 RF Convertible", dealer: "coast",
    make: "Mazda", model: "MX-5 RF", year: 2019, price: 3350000, mileage: 45000,
    transmission: Transmission.AUTOMATIC, fuelType: FuelType.PETROL, bodyType: BodyType.CONVERTIBLE,
    condition: CarCondition.FOREIGN_USED, location: "Mombasa",
    description: "Retractable fastback roadster, weekend car, garage kept, new soft-touch roof mechanism serviced.",
    featured: false, verified: true, engineCc: 2000, drive: "2WD", color: "Soul Red",
    images: [img("photo-1503376780353-7e6692767b70")],
  },
  {
    title: "2020 Toyota Hiace Super GL 2.8 Van", dealer: "rift",
    make: "Toyota", model: "Hiace", year: 2020, price: 4950000, mileage: 76000,
    transmission: Transmission.AUTOMATIC, fuelType: FuelType.DIESEL, bodyType: BodyType.VAN,
    condition: CarCondition.FOREIGN_USED, location: "Nairobi",
    description: "14-seater Super GL, ideal for shuttle/matatu business on long routes. PSV ready, new tyres.",
    featured: false, verified: true, engineCc: 2800, drive: "2WD", color: "White",
    images: [img("photo-1605893477799-b99e3b8b93fe")],
  },
  {
    title: "2018 Mitsubishi Fuso FH 6-Ton Truck", dealer: "coast",
    make: "Mitsubishi", model: "Fuso FH", year: 2018, price: 3850000, mileage: 145000,
    transmission: Transmission.MANUAL, fuelType: FuelType.DIESEL, bodyType: BodyType.TRUCK,
    condition: CarCondition.LOCALLY_USED, location: "Mombasa",
    description: "Fuso FH with closed body, fleet maintained, new brakes and clutch. Ready for port cargo runs.",
    featured: false, verified: false, engineCc: 7500, drive: "2WD", color: "White",
    images: [img("photo-1533106418989-88406c7cc8ca")],
  },
  {
    title: "2019 Isuzu NQR 4-Ton Commercial", dealer: "lake",
    make: "Isuzu", model: "NQR", year: 2019, price: 3250000, mileage: 121000,
    transmission: Transmission.MANUAL, fuelType: FuelType.DIESEL, bodyType: BodyType.COMMERCIAL,
    condition: CarCondition.LOCALLY_USED, location: "Kisumu",
    description: "NQR 4-ton with open load body, perfect for cereals and hardware distribution upcountry.",
    featured: false, verified: false, engineCc: 5200, drive: "2WD", color: "White",
    images: [img("photo-1559416523-140ddc511d3a")],
  },
  {
    title: "2018 Toyota Premio 1.8G Sedan", dealer: "rift",
    make: "Toyota", model: "Premio", year: 2018, price: 2150000, mileage: 71000,
    transmission: Transmission.CVT, fuelType: FuelType.PETROL, bodyType: BodyType.SEDAN,
    condition: CarCondition.LOCALLY_USED, location: "Nakuru",
    description: "Executive Premio, wood finish, very comfortable. Company maintained with full records.",
    featured: false, verified: true, engineCc: 1800, drive: "2WD", color: "Black",
    images: [img("photo-1621007947382-bb3c3994e3fb")],
  },
  // ---- Brand-new showroom stock ----
  {
    title: "2024 Toyota Land Cruiser 300 ZX 3.3D", dealer: "kamau",
    make: "Toyota", model: "Land Cruiser 300", year: 2024, price: 18500000, mileage: 500,
    transmission: Transmission.AUTOMATIC, fuelType: FuelType.DIESEL, bodyType: BodyType.SUV,
    condition: CarCondition.NEW, location: "Nairobi",
    description: "Brand new LC300 ZX, 3.3 V6 twin-turbo diesel, cool box, adaptive suspension, full warranty.",
    featured: true, verified: true, engineCc: 3300, drive: "4WD", color: "Precious White",
    images: [img("photo-1533473353331-0135ef1b58bf"), img("photo-1606664515524-ed2f786a0bd6")],
  },
  {
    title: "2024 Mercedes-Benz GLC 200 4Matic", dealer: "kamau",
    make: "Mercedes-Benz", model: "GLC 200", year: 2024, price: 9800000, mileage: 800,
    transmission: Transmission.AUTOMATIC, fuelType: FuelType.PETROL, bodyType: BodyType.SUV,
    condition: CarCondition.NEW, location: "Nairobi",
    description: "Brand new GLC, MBUX, ambient lighting, powered tailgate, 3-year dealer warranty.",
    featured: true, verified: true, engineCc: 2000, drive: "AWD", color: "High-Tech Silver",
    images: [img("photo-1618843479313-40f8afb4b4d8"), img("photo-1617531653332-bd46c24f2068")],
  },
  {
    title: "2023 Nissan X-Trail e-Power e-4orce", dealer: "coast",
    make: "Nissan", model: "X-Trail", year: 2023, price: 5900000, mileage: 6000,
    transmission: Transmission.AUTOMATIC, fuelType: FuelType.HYBRID, bodyType: BodyType.SUV,
    condition: CarCondition.NEW, location: "Mombasa",
    description: "Ex-UK X-Trail e-Power, ProPILOT assist, 7 seats, panoramic roof. Balance of warranty remaining.",
    featured: false, verified: true, engineCc: 1500, drive: "AWD", color: "Gun Metallic",
    images: [img("photo-1547038577-da80abbc4f19")],
  },
  {
    title: "2024 Honda Fit e:HEV Home", dealer: "lake",
    make: "Honda", model: "Fit", year: 2024, price: 2450000, mileage: 3000,
    transmission: Transmission.CVT, fuelType: FuelType.HYBRID, bodyType: BodyType.HATCHBACK,
    condition: CarCondition.NEW, location: "Kisumu",
    description: "Brand new Fit hybrid, Honda Sensing safety, magic seats, 30km/l real world.",
    featured: false, verified: true, engineCc: 1500, drive: "2WD", color: "Platinum Grey",
    images: [img("photo-1535732820275-9ffd998cac22")],
  },
];

const extraDealers = [
  {
    key: "coast", email: "coast@garibora.ke", name: "Coast Auto Mall", slug: "coast-auto-mall",
    description: "Mombasa's trusted yard along Moi Avenue. Specialists in hybrids, vans and port-cleared imports.",
    location: "Mombasa", phone: "+254733111222", rating: 4.6, reviewCount: 89,
  },
  {
    key: "lake", email: "lake@garibora.ke", name: "Lake Basin Motors", slug: "lake-basin-motors",
    description: "Kisumu's home of clean family cars and commercial trucks. Every unit inspected before listing.",
    location: "Kisumu", phone: "+254744333444", rating: 4.7, reviewCount: 64,
  },
  {
    key: "rift", email: "rift@garibora.ke", name: "Rift Valley Cars", slug: "rift-valley-cars",
    description: "Eldoret yard serving farmers and athletes — pickups, vans and reliable town runners.",
    location: "Eldoret", phone: "+254755555666", rating: 4.5, reviewCount: 51,
  },
];

async function main() {
  console.log("Seeding GariBora…");

  const passwordHash = await bcrypt.hash("Password123!", 10);

  await prisma.user.upsert({
    where: { email: "admin@garibora.ke" },
    update: {},
    create: { email: "admin@garibora.ke", name: "GariBora Admin", role: "ADMIN", verified: true, passwordHash },
  });

  // Main dealer (Nairobi)
  const kamauUser = await prisma.user.upsert({
    where: { email: "seller@garibora.ke" },
    update: {},
    create: { email: "seller@garibora.ke", name: "Kamau Motors", phone: "+254722000000", role: "DEALER", verified: true, passwordHash },
  });
  await prisma.dealer.upsert({
    where: { userId: kamauUser.id },
    update: {},
    create: {
      userId: kamauUser.id, businessName: "Kamau Motors Ltd", slug: "kamau-motors",
      description: "Trusted dealer along Kiambu Road. Inspected, duty-paid units with warranty.",
      location: "Nairobi", phone: "+254722000000", whatsapp: "254722000000", verified: true, rating: 4.8, reviewCount: 132,
    },
  });

  // Regional dealers
  const dealerIds: Record<string, string> = { kamau: (await prisma.dealer.findUnique({ where: { slug: "kamau-motors" } }))!.id };
  for (const d of extraDealers) {
    const user = await prisma.user.upsert({
      where: { email: d.email },
      update: {},
      create: { email: d.email, name: d.name, phone: d.phone, role: "DEALER", verified: true, passwordHash },
    });
    const dealer = await prisma.dealer.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id, businessName: d.name, slug: d.slug, description: d.description,
        location: d.location, phone: d.phone, whatsapp: d.phone.replace(/[^0-9]/g, ""),
        verified: true, rating: d.rating, reviewCount: d.reviewCount,
      },
    });
    dealerIds[d.key] = dealer.id;
  }

  // Brands
  const brandNames = [...new Set(cars.map((c) => c.make))];
  for (const name of brandNames) {
    await prisma.brand.upsert({
      where: { slug: slugify(name) },
      update: {},
      create: { name, slug: slugify(name), popularKE: ["Toyota", "Nissan", "Mercedes-Benz", "BMW", "Honda", "Mazda", "Subaru"].includes(name) },
    });
  }

  const kamauId = kamauUser.id;
  for (const c of cars) {
    const brand = await prisma.brand.findUnique({ where: { slug: slugify(c.make) } });
    const slug = `${slugify(`${c.year}-${c.make}-${c.model}`)}-${Math.random().toString(36).slice(2, 7)}`;
    const existing = await prisma.car.findFirst({ where: { title: c.title } });
    if (existing) continue;
    await prisma.car.create({
      data: {
        title: c.title, slug, make: c.make, model: c.model, year: c.year, price: c.price,
        mileage: c.mileage, transmission: c.transmission, fuelType: c.fuelType, bodyType: c.bodyType,
        condition: c.condition, location: c.location, description: c.description,
        featured: c.featured, verified: c.verified, status: "ACTIVE",
        sellerId: kamauId, dealerId: dealerIds[c.dealer] ?? dealerIds.kamau, brandId: brand?.id,
        engineCc: c.engineCc, drive: c.drive, color: c.color, dutyPaid: true,
        images: { create: c.images.map((url, i) => ({ url, isPrimary: i === 0, sortOrder: i })) },
      },
    });
  }

  // Blog posts for SEO
  const posts = [
    { slug: "toyota-prado-buying-guide-kenya", title: "Toyota Prado Buying Guide in Kenya (2026): Prices, Grades & What to Check", excerpt: "TX vs TX-L vs TZ-G, diesel vs petrol, mileage checks and duty.", content: "Full guide content…", coverUrl: img("photo-1533473353331-0135ef1b58bf"), published: true },
    { slug: "kra-duty-calculator-import-car", title: "KRA Duty in 2026: How Much to Import a Car to Kenya", excerpt: "CRSP, excise and what foreign-used really costs.", content: "Full guide content…", coverUrl: img("photo-1449965408869-eaa3f722e40d"), published: true },
    { slug: "best-fuel-efficient-cars-nairobi", title: "7 Most Fuel-Efficient Cars for Nairobi Traffic", excerpt: "Note e-Power, Fit Hybrid, Swift and real-world km/l.", content: "Full guide content…", coverUrl: img("photo-1477959858617-67df85cf4f1df"), published: true },
  ];
  for (const p of posts) {
    await prisma.post.upsert({ where: { slug: p.slug }, update: {}, create: p });
  }

  console.log("Seeded admin + 4 dealers + cars. Logins: admin@garibora.ke / seller@garibora.ke (Password123!)");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
