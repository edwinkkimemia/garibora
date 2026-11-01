import { PrismaClient, Transmission, FuelType, BodyType, CarCondition, PartCategory, PartCondition } from "@prisma/client";
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

// ---------- Volume stock: deterministic generator (~96 extra listings) ----------
// Keeps every category, town and budget band populated. Idempotent: titles are
// deterministic and the seeder skips any title that already exists.
type GenBase = {
  make: string; model: string; grades: [string, string, string];
  body: BodyType; fuel: FuelType; gear: Transmission; condition: CarCondition;
  years: [number, number, number]; basePrice: number; engineCc: number; drive: string;
};

const GEN_POOL = [
  "photo-1621007947382-bb3c3994e3fb", "photo-1549317661-bd32c8ce0db2",
  "photo-1552519507-da3b142c6e3d", "photo-1541899481282-d53bffe3c35d",
  "photo-1535732820275-9ffd998cac22", "photo-1594502184342-2e12f877aa73",
  "photo-1547038577-da80abbc4f19", "photo-1502877338535-766e1452684a",
  "photo-1583121274602-3e2820c69888", "photo-1553440569-bcc63803a83d",
  "photo-1542362567-b07e54358753", "photo-1618843479313-40f8afb4b4d8",
  "photo-1580273916550-e323be2ae537", "photo-1555215695-3004980ad54e",
  "photo-1533473353331-0135ef1b58bf", "photo-1503376780353-7e6692767b70",
];
const GEN_COLORS = ["Silver", "Black", "White", "Wine Red", "Grey", "Blue", "Pearl White", "Gun Metallic"];
const GEN_TOWNS = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Kiambu", "Machakos", "Nyeri", "Meru"];
const GEN_DEALERS = ["kamau", "coast", "lake", "rift"];
const GEN_BLURBS: ((b: GenBase, grade: string, town: string) => string)[] = [
  (b, grade, town) => `${b.make} ${b.model} ${grade}, original paint, accident-free. Duty paid, ready logbook. Viewing in ${town} — call or WhatsApp to arrange.`,
  (b, grade, town) => `Well kept ${b.model} ${grade} with service history. New tyres, cold AC, clean interior. Priced to sell — viewing in ${town}.`,
  (b, grade, town) => `Ex-Japan ${b.model} ${grade}, genuine mileage with auction sheet available on request. Duty paid, ready transfer in ${town}.`,
];

const GEN_BASES: GenBase[] = [
  { make: "Toyota", model: "Probox", grades: ["DX", "GL", "WXB"], body: BodyType.WAGON, fuel: FuelType.PETROL, gear: Transmission.AUTOMATIC, condition: CarCondition.FOREIGN_USED, years: [2016, 2017, 2018], basePrice: 980000, engineCc: 1500, drive: "2WD" },
  { make: "Toyota", model: "Succeed", grades: ["UL", "UL-X", "TX"], body: BodyType.WAGON, fuel: FuelType.PETROL, gear: Transmission.AUTOMATIC, condition: CarCondition.FOREIGN_USED, years: [2015, 2016, 2017], basePrice: 950000, engineCc: 1500, drive: "2WD" },
  { make: "Toyota", model: "Corolla Axio", grades: ["G", "G WXB", "Luxel"], body: BodyType.SEDAN, fuel: FuelType.HYBRID, gear: Transmission.CVT, condition: CarCondition.FOREIGN_USED, years: [2016, 2017, 2018], basePrice: 1650000, engineCc: 1500, drive: "2WD" },
  { make: "Toyota", model: "Vitz", grades: ["F", "U", "Jewela"], body: BodyType.HATCHBACK, fuel: FuelType.PETROL, gear: Transmission.CVT, condition: CarCondition.FOREIGN_USED, years: [2016, 2017, 2018], basePrice: 1050000, engineCc: 1300, drive: "2WD" },
  { make: "Toyota", model: "Rush", grades: ["G", "X", "S"], body: BodyType.SUV, fuel: FuelType.PETROL, gear: Transmission.AUTOMATIC, condition: CarCondition.FOREIGN_USED, years: [2018, 2019, 2020], basePrice: 1950000, engineCc: 1500, drive: "2WD" },
  { make: "Toyota", model: "Harrier", grades: ["Premium", "Elegance", "Progress"], body: BodyType.SUV, fuel: FuelType.PETROL, gear: Transmission.AUTOMATIC, condition: CarCondition.FOREIGN_USED, years: [2016, 2017, 2018], basePrice: 3400000, engineCc: 2000, drive: "2WD" },
  { make: "Toyota", model: "Noah", grades: ["Si", "G", "X"], body: BodyType.VAN, fuel: FuelType.PETROL, gear: Transmission.CVT, condition: CarCondition.FOREIGN_USED, years: [2016, 2017, 2018], basePrice: 2100000, engineCc: 2000, drive: "2WD" },
  { make: "Toyota", model: "Mark X", grades: ["250G", "250G S-Package", "350S"], body: BodyType.SEDAN, fuel: FuelType.PETROL, gear: Transmission.AUTOMATIC, condition: CarCondition.FOREIGN_USED, years: [2015, 2016, 2017], basePrice: 1850000, engineCc: 2500, drive: "2WD" },
  { make: "Toyota", model: "Dyna 2-Ton", grades: ["Standard", "Full-Justlow", "Double Cab"], body: BodyType.TRUCK, fuel: FuelType.DIESEL, gear: Transmission.MANUAL, condition: CarCondition.LOCALLY_USED, years: [2015, 2016, 2017], basePrice: 1900000, engineCc: 4000, drive: "2WD" },
  { make: "Toyota", model: "Allion", grades: ["A18", "A18 G", "A20"], body: BodyType.SEDAN, fuel: FuelType.PETROL, gear: Transmission.AUTOMATIC, condition: CarCondition.FOREIGN_USED, years: [2015, 2016, 2017], basePrice: 1550000, engineCc: 1800, drive: "2WD" },
  { make: "Toyota", model: "Ractis", grades: ["X", "G", "S"], body: BodyType.HATCHBACK, fuel: FuelType.PETROL, gear: Transmission.CVT, condition: CarCondition.FOREIGN_USED, years: [2015, 2016, 2017], basePrice: 1050000, engineCc: 1500, drive: "2WD" },
  { make: "Toyota", model: "Sienta", grades: ["X", "G", "DICE"], body: BodyType.VAN, fuel: FuelType.PETROL, gear: Transmission.CVT, condition: CarCondition.FOREIGN_USED, years: [2016, 2017, 2018], basePrice: 1450000, engineCc: 1500, drive: "2WD" },
  { make: "Toyota", model: "Tank", grades: ["X", "G", "Custom G S"], body: BodyType.HATCHBACK, fuel: FuelType.PETROL, gear: Transmission.CVT, condition: CarCondition.FOREIGN_USED, years: [2017, 2018, 2019], basePrice: 1150000, engineCc: 1000, drive: "2WD" },
  { make: "Nissan", model: "Latio", grades: ["X", "G", "S"], body: BodyType.SEDAN, fuel: FuelType.PETROL, gear: Transmission.AUTOMATIC, condition: CarCondition.FOREIGN_USED, years: [2014, 2015, 2016], basePrice: 850000, engineCc: 1200, drive: "2WD" },
  { make: "Nissan", model: "Caravan NV350", grades: ["DX", "GX", "Rider"], body: BodyType.VAN, fuel: FuelType.DIESEL, gear: Transmission.MANUAL, condition: CarCondition.FOREIGN_USED, years: [2016, 2017, 2018], basePrice: 2950000, engineCc: 2500, drive: "2WD" },
  { make: "Honda", model: "Grace", grades: ["LX", "Hybrid DX", "Hybrid EX"], body: BodyType.SEDAN, fuel: FuelType.HYBRID, gear: Transmission.CVT, condition: CarCondition.FOREIGN_USED, years: [2016, 2017, 2018], basePrice: 1550000, engineCc: 1500, drive: "2WD" },
  { make: "Mazda", model: "Biante", grades: ["20S", "20CS", "Granz"], body: BodyType.VAN, fuel: FuelType.PETROL, gear: Transmission.AUTOMATIC, condition: CarCondition.FOREIGN_USED, years: [2014, 2015, 2016], basePrice: 1350000, engineCc: 2000, drive: "2WD" },
  { make: "Mitsubishi", model: "RVR", grades: ["G", "M", "Roadest"], body: BodyType.SUV, fuel: FuelType.PETROL, gear: Transmission.CVT, condition: CarCondition.FOREIGN_USED, years: [2015, 2016, 2017], basePrice: 1500000, engineCc: 1800, drive: "2WD" },
  { make: "Suzuki", model: "Solio", grades: ["G", "S", "Bandit"], body: BodyType.HATCHBACK, fuel: FuelType.PETROL, gear: Transmission.CVT, condition: CarCondition.FOREIGN_USED, years: [2016, 2017, 2018], basePrice: 1100000, engineCc: 1200, drive: "2WD" },
  { make: "Volkswagen", model: "Polo Vivo", grades: ["Trendline", "Comfortline", "GT"], body: BodyType.HATCHBACK, fuel: FuelType.PETROL, gear: Transmission.MANUAL, condition: CarCondition.FOREIGN_USED, years: [2016, 2017, 2018], basePrice: 950000, engineCc: 1400, drive: "2WD" },
  { make: "BMW", model: "X1", grades: ["sDrive18i", "xDrive20i", "M Sport"], body: BodyType.SUV, fuel: FuelType.PETROL, gear: Transmission.AUTOMATIC, condition: CarCondition.FOREIGN_USED, years: [2016, 2017, 2018], basePrice: 2650000, engineCc: 2000, drive: "AWD" },
  { make: "Mercedes-Benz", model: "GLA", grades: ["GLA 200", "AMG Line", "Progressive"], body: BodyType.SUV, fuel: FuelType.PETROL, gear: Transmission.AUTOMATIC, condition: CarCondition.FOREIGN_USED, years: [2016, 2017, 2018], basePrice: 2750000, engineCc: 1600, drive: "2WD" },
  { make: "Nissan", model: "Navara", grades: ["SE", "XE", "LE"], body: BodyType.PICKUP, fuel: FuelType.DIESEL, gear: Transmission.MANUAL, condition: CarCondition.FOREIGN_USED, years: [2017, 2018, 2019], basePrice: 3400000, engineCc: 2500, drive: "4WD" },
  { make: "Ford", model: "Ranger", grades: ["XL", "XLT", "Wildtrak"], body: BodyType.PICKUP, fuel: FuelType.DIESEL, gear: Transmission.AUTOMATIC, condition: CarCondition.FOREIGN_USED, years: [2017, 2018, 2019], basePrice: 3950000, engineCc: 3200, drive: "4WD" },
  { make: "Mazda", model: "BT-50", grades: ["Brave", "Pro", "Thunder"], body: BodyType.PICKUP, fuel: FuelType.DIESEL, gear: Transmission.MANUAL, condition: CarCondition.FOREIGN_USED, years: [2016, 2017, 2018], basePrice: 2900000, engineCc: 2200, drive: "4WD" },
  { make: "Nissan", model: "Tiida", grades: ["15M", "15G", "Axis"], body: BodyType.HATCHBACK, fuel: FuelType.PETROL, gear: Transmission.AUTOMATIC, condition: CarCondition.FOREIGN_USED, years: [2015, 2016, 2017], basePrice: 850000, engineCc: 1500, drive: "2WD" },
  { make: "Nissan", model: "Bluebird Sylphy", grades: ["X", "G", "XV"], body: BodyType.SEDAN, fuel: FuelType.PETROL, gear: Transmission.CVT, condition: CarCondition.FOREIGN_USED, years: [2015, 2016, 2017], basePrice: 1150000, engineCc: 1800, drive: "2WD" },
  { make: "Nissan", model: "Serena", grades: ["Highway Star", "X", "Rider"], body: BodyType.VAN, fuel: FuelType.PETROL, gear: Transmission.CVT, condition: CarCondition.FOREIGN_USED, years: [2016, 2017, 2018], basePrice: 1750000, engineCc: 2000, drive: "2WD" },
  { make: "Nissan", model: "Juke", grades: ["15RS", "15RX", "Nismo"], body: BodyType.SUV, fuel: FuelType.PETROL, gear: Transmission.CVT, condition: CarCondition.FOREIGN_USED, years: [2015, 2016, 2017], basePrice: 1350000, engineCc: 1500, drive: "2WD" },
  { make: "Nissan", model: "March", grades: ["S", "G", "Bolero"], body: BodyType.HATCHBACK, fuel: FuelType.PETROL, gear: Transmission.AUTOMATIC, condition: CarCondition.FOREIGN_USED, years: [2015, 2016, 2017], basePrice: 750000, engineCc: 1200, drive: "2WD" },
  { make: "Nissan", model: "Atlas 3-Ton", grades: ["Standard", "Wide", "Double Cab"], body: BodyType.TRUCK, fuel: FuelType.DIESEL, gear: Transmission.MANUAL, condition: CarCondition.LOCALLY_USED, years: [2014, 2015, 2016], basePrice: 1700000, engineCc: 4500, drive: "2WD" },
  { make: "Honda", model: "Vezel", grades: ["Hybrid X", "Hybrid Z", "G"], body: BodyType.SUV, fuel: FuelType.HYBRID, gear: Transmission.CVT, condition: CarCondition.FOREIGN_USED, years: [2016, 2017, 2018], basePrice: 2350000, engineCc: 1500, drive: "2WD" },
  { make: "Honda", model: "CR-V", grades: ["EX", "EX Masterpiece", "ZX"], body: BodyType.SUV, fuel: FuelType.PETROL, gear: Transmission.AUTOMATIC, condition: CarCondition.FOREIGN_USED, years: [2015, 2016, 2017], basePrice: 2200000, engineCc: 2000, drive: "AWD" },
  { make: "Honda", model: "Stream", grades: ["RSZ", "X", "ZS"], body: BodyType.VAN, fuel: FuelType.PETROL, gear: Transmission.CVT, condition: CarCondition.LOCALLY_USED, years: [2014, 2015, 2016], basePrice: 1250000, engineCc: 1800, drive: "2WD" },
  { make: "Mazda", model: "Demio", grades: ["13S", "XD", "15S"], body: BodyType.HATCHBACK, fuel: FuelType.PETROL, gear: Transmission.AUTOMATIC, condition: CarCondition.FOREIGN_USED, years: [2015, 2016, 2017], basePrice: 950000, engineCc: 1300, drive: "2WD" },
  { make: "Mazda", model: "Axela", grades: ["15S", "20S", "XD"], body: BodyType.SEDAN, fuel: FuelType.PETROL, gear: Transmission.AUTOMATIC, condition: CarCondition.FOREIGN_USED, years: [2015, 2016, 2017], basePrice: 1450000, engineCc: 1500, drive: "2WD" },
  { make: "Mazda", model: "CX-3", grades: ["XD", "XD Proactive", "20S"], body: BodyType.SUV, fuel: FuelType.DIESEL, gear: Transmission.AUTOMATIC, condition: CarCondition.FOREIGN_USED, years: [2016, 2017, 2018], basePrice: 1850000, engineCc: 1500, drive: "2WD" },
  { make: "Subaru", model: "Impreza", grades: ["1.6i-L", "2.0i-S", "Sport"], body: BodyType.SEDAN, fuel: FuelType.PETROL, gear: Transmission.CVT, condition: CarCondition.FOREIGN_USED, years: [2015, 2016, 2017], basePrice: 1350000, engineCc: 1600, drive: "AWD" },
  { make: "Subaru", model: "Legacy Touring", grades: ["B-Sport", "Limited", "XT"], body: BodyType.WAGON, fuel: FuelType.PETROL, gear: Transmission.CVT, condition: CarCondition.LOCALLY_USED, years: [2014, 2015, 2016], basePrice: 1400000, engineCc: 2500, drive: "AWD" },
  { make: "Mitsubishi", model: "Outlander", grades: ["G", "M", "PHEV"], body: BodyType.SUV, fuel: FuelType.PETROL, gear: Transmission.CVT, condition: CarCondition.FOREIGN_USED, years: [2015, 2016, 2017], basePrice: 1950000, engineCc: 2000, drive: "4WD" },
  { make: "Mitsubishi", model: "Delica D:5", grades: ["G-Power", "M", "Roadest"], body: BodyType.VAN, fuel: FuelType.DIESEL, gear: Transmission.AUTOMATIC, condition: CarCondition.FOREIGN_USED, years: [2015, 2016, 2017], basePrice: 2400000, engineCc: 2300, drive: "4WD" },
  { make: "Suzuki", model: "Alto", grades: ["L", "VXL", "Works"], body: BodyType.HATCHBACK, fuel: FuelType.PETROL, gear: Transmission.AUTOMATIC, condition: CarCondition.FOREIGN_USED, years: [2016, 2017, 2018], basePrice: 720000, engineCc: 660, drive: "2WD" },
  { make: "Suzuki", model: "Escudo", grades: ["1.6", "1.4T", "S-Limited"], body: BodyType.SUV, fuel: FuelType.PETROL, gear: Transmission.AUTOMATIC, condition: CarCondition.FOREIGN_USED, years: [2016, 2017, 2018], basePrice: 1650000, engineCc: 1600, drive: "4WD" },
  { make: "Volkswagen", model: "Golf", grades: ["TSI Trendline", "TSI Comfortline", "GTI"], body: BodyType.HATCHBACK, fuel: FuelType.PETROL, gear: Transmission.AUTOMATIC, condition: CarCondition.FOREIGN_USED, years: [2015, 2016, 2017], basePrice: 1450000, engineCc: 1200, drive: "2WD" },
  { make: "Volkswagen", model: "Tiguan", grades: ["TSI", "TDI", "R-Line"], body: BodyType.SUV, fuel: FuelType.PETROL, gear: Transmission.AUTOMATIC, condition: CarCondition.FOREIGN_USED, years: [2015, 2016, 2017], basePrice: 2100000, engineCc: 1400, drive: "2WD" },
  { make: "Audi", model: "A4", grades: ["1.8T", "2.0T", "S-Line"], body: BodyType.SEDAN, fuel: FuelType.PETROL, gear: Transmission.AUTOMATIC, condition: CarCondition.FOREIGN_USED, years: [2015, 2016, 2017], basePrice: 2300000, engineCc: 1800, drive: "2WD" },
  { make: "BMW", model: "320i", grades: ["Base", "M Sport", "Luxury"], body: BodyType.SEDAN, fuel: FuelType.PETROL, gear: Transmission.AUTOMATIC, condition: CarCondition.FOREIGN_USED, years: [2015, 2016, 2017], basePrice: 2200000, engineCc: 2000, drive: "2WD" },
  { make: "Land Rover", model: "Defender 110", grades: ["County", "XS", "Adventure"], body: BodyType.SUV, fuel: FuelType.DIESEL, gear: Transmission.MANUAL, condition: CarCondition.LOCALLY_USED, years: [2014, 2015, 2016], basePrice: 4200000, engineCc: 2200, drive: "4WD" },
];

GEN_BASES.forEach((b, bi) => {
  b.years.forEach((year, vi) => {
    const n = bi * 3 + vi;
    const grade = b.grades[vi];
    const town = GEN_TOWNS[n % GEN_TOWNS.length];
    cars.push({
      title: `${year} ${b.make} ${b.model} ${grade}`,
      dealer: GEN_DEALERS[n % GEN_DEALERS.length],
      make: b.make, model: b.model, year,
      price: Math.round((b.basePrice * (1 + (1 - vi) * 0.06)) / 10000) * 10000,
      mileage: (2026 - year) * 13000 + vi * 7000 + (bi % 5) * 900,
      transmission: b.gear, fuelType: b.fuel, bodyType: b.body,
      condition: b.condition, location: town,
      description: GEN_BLURBS[n % GEN_BLURBS.length](b, grade, town),
      featured: false, verified: n % 2 === 0,
      engineCc: b.engineCc, drive: b.drive, color: GEN_COLORS[n % GEN_COLORS.length],
      images: [
        `https://images.unsplash.com/${GEN_POOL[n % GEN_POOL.length]}?q=80&w=1200&auto=format&fit=crop`,
        `https://images.unsplash.com/${GEN_POOL[(n + 7) % GEN_POOL.length]}?q=80&w=1200&auto=format&fit=crop`,
      ],
    });
  });
});

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

  // Flag hire stock (monetization: rentals) — hire-only, kept fully
  // separate from sale stock. Deterministic + idempotent.
  const rentals: [string, number][] = [
    ["2017 Nissan Note e-Power Medalist", 4500],
    ["2017 Honda Fit Hybrid F-Package", 4000],
    ["2022 Suzuki Swift RS 1.2", 5000],
    ["2019 Mazda CX-5 XD Proactive Diesel", 9500],
    ["2020 Toyota Hiace Super GL 2.8 Van", 12000],
    ["2019 Toyota Land Cruiser Prado TX-L 2.8D", 22000],
    ["2018 Mercedes-Benz C200 AMG Line", 15000],
    ["2021 BMW 420i M Sport Coupe", 16000],
    ["2023 Toyota RAV4 Adventure 2.5 Hybrid", 14000],
    ["2016 Toyota Fielder G 1.5 Hybrid", 5500],
    ["2015 Subaru Forester XT 2.0T", 8000],
    ["2021 Toyota Hilux Double Cab 2.8 GD-6", 13000],
    // Extra hire fleet from volume stock
    ["2017 Toyota Probox GL", 4500],
    ["2016 Toyota Succeed UL-X", 4500],
    ["2020 Toyota Rush S", 8500],
    ["2017 Nissan Serena X", 10000],
    ["2016 Honda Stream ZS", 7000],
    ["2016 Mazda Demio XD", 5000],
    ["2016 Subaru Impreza 2.0i-S", 6500],
    ["2016 Mitsubishi Delica D:5 M", 11000],
    ["2017 Suzuki Escudo 1.4T", 8000],
    ["2016 Volkswagen Golf TSI Comfortline", 7000],
  ];
  for (const [title, rate] of rentals) {
    await prisma.car.updateMany({ where: { title }, data: { listingType: "RENT", dailyRate: rate } });
  }

  // Keep the homepage Featured rail full with sale-only stock
  for (const title of [
    "2019 Mazda CX-5 XD Proactive Diesel",
    "2018 Toyota Premio 1.8G Sedan",
    "2018 Toyota Harrier Progress",
    "2017 Honda Vezel Hybrid Z",
    "2015 Volkswagen Tiguan TSI",
    "2016 Audi A4 2.0T",
    "2016 BMW 320i M Sport",
  ]) {
    await prisma.car.updateMany({ where: { title }, data: { featured: true, verified: true } });
  }

  // ---------- Parts stock ----------
  const engineImg = "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=1200&auto=format&fit=crop";
  type SeedPart = {
    title: string; category: PartCategory; condition: PartCondition; price: number;
    location: string; description: string; dealer: string; images: string[];
  };
  const seedParts: SeedPart[] = [
    { title: "Bridgestone Dueler 265/65R17 Tyre Set (4pcs)", category: PartCategory.TYRES_WHEELS, condition: PartCondition.NEW, price: 68000, location: "Nairobi", dealer: "kamau", description: "Brand new Dueler A/T set, 2025 date stamps. Fits Prado, Fortuner, Hilux. Free fitting + alignment check.", images: [img("photo-1626668893632-6f3d4466d22f")] },
    { title: "GT Radial 205/65R16 Tyres — Pair", category: PartCategory.TYRES_WHEELS, condition: PartCondition.NEW, price: 24000, location: "Mombasa", dealer: "coast", description: "New pair, ideal for Fielder, Premio, Sylphy. Manufactured 2025.", images: [img("photo-1626668893632-6f3d4466d22f")] },
    { title: '17" 5-Lug Alloy Rims Set — Prado/Fortuner', category: PartCategory.TYRES_WHEELS, condition: PartCondition.USED, price: 85000, location: "Nairobi", dealer: "kamau", description: "Clean used alloys, no bends or cracks. With centre caps.", images: [img("photo-1555215695-3004980ad54e")] },
    { title: "Amaron 70Ah Battery — 18 Month Warranty", category: PartCategory.BATTERY, condition: PartCondition.NEW, price: 18500, location: "Nairobi", dealer: "kamau", description: "Genuine Amaron with warranty card. Free installation + old battery buyback.", images: [engineImg] },
    { title: "Exide 55Ah Battery — Vitz/Note/Fit", category: PartCategory.BATTERY, condition: PartCondition.NEW, price: 14500, location: "Kisumu", dealer: "lake", description: "Exact fit for 1000–1500cc hatchbacks. 12-month warranty.", images: [engineImg] },
    { title: "Front Brake Pads — Toyota Fielder/Axio", category: PartCategory.BRAKES, condition: PartCondition.NEW, price: 6500, location: "Nairobi", dealer: "kamau", description: "Ceramic pads, low dust, includes shims. Fits NZE/NRE chassis.", images: [img("photo-1487754180451-c456f719a1fc")] },
    { title: "Brembo Rear Brake Discs — Mazda CX-5", category: PartCategory.BRAKES, condition: PartCondition.NEW, price: 22000, location: "Nairobi", dealer: "kamau", description: "Genuine Brembo pair for KF chassis. Eliminates judder.", images: [img("photo-1487754180451-c456f719a1fc")] },
    { title: "Brake Pads — Nissan Note E12", category: PartCategory.BRAKES, condition: PartCondition.NEW, price: 5500, location: "Mombasa", dealer: "coast", description: "Front set for E12 Note, e-Power included.", images: [img("photo-1487754180451-c456f719a1fc")] },
    { title: "KYB Front Shock Absorbers Pair — Probox/Succeed", category: PartCategory.SUSPENSION, condition: PartCondition.NEW, price: 26000, location: "Nairobi", dealer: "kamau", description: "Genuine KYB Excel-G pair. Transforms rough-road handling.", images: [engineImg] },
    { title: "Rear Shocks — Subaru Forester SH", category: PartCategory.SUSPENSION, condition: PartCondition.USED, price: 12000, location: "Nakuru", dealer: "rift", description: "Low-mileage ex-Japan pair, no leaks. Tested.", images: [engineImg] },
    { title: "Alternator — Toyota 1NZ (Vitz/Ractis)", category: PartCategory.ENGINE, condition: PartCondition.USED, price: 15000, location: "Nairobi", dealer: "kamau", description: "Tested ex-Japan alternator, 1-month warranty.", images: [engineImg] },
    { title: "Radiator — Honda Fit GP5 Hybrid", category: PartCategory.ENGINE, condition: PartCondition.NEW, price: 19000, location: "Mombasa", dealer: "coast", description: "Brand new replacement radiator, exact GP5 fitment.", images: [engineImg] },
    { title: "Side Mirror (R, Power) — Nissan Note E12", category: PartCategory.BODY, condition: PartCondition.USED, price: 7500, location: "Nairobi", dealer: "kamau", description: "Wine-red power mirror, motor tested. Paint-to-match available.", images: [img("photo-1549317661-bd32c8ce0db2")] },
    { title: "Headlight (L, LED) — Mazda CX-5 KF", category: PartCategory.BODY, condition: PartCondition.USED, price: 28000, location: "Nairobi", dealer: "kamau", description: "Ex-Japan LED unit, all brackets intact.", images: [img("photo-1594502184342-2e12f877aa73")] },
    { title: "Front Bumper — Toyota Premio T260", category: PartCategory.BODY, condition: PartCondition.USED, price: 18000, location: "Eldoret", dealer: "rift", description: "Clean used bumper, primed ready for paint.", images: [img("photo-1621007947382-bb3c3994e3fb")] },
    { title: "Roof Rack + Cross Bars — Universal SUV", category: PartCategory.ACCESSORIES, condition: PartCondition.NEW, price: 15000, location: "Nairobi", dealer: "kamau", description: "Aluminium rack rated 100kg. Fits Prado, RAV4, X-Trail rails.", images: [img("photo-1533473353331-0135ef1b58bf")] },
    { title: "Heavy-Duty Seat Covers — 5-Seater", category: PartCategory.ACCESSORIES, condition: PartCondition.NEW, price: 9500, location: "Nairobi", dealer: "kamau", description: "Waterproof canvas set, beige/grey. Fitted in 30 mins.", images: [img("photo-1503376780353-7e6692767b70")] },
    { title: "Shell Helix 5W-30 (5L) + Oil Filter", category: PartCategory.OILS_FLUIDS, condition: PartCondition.NEW, price: 8500, location: "Nairobi", dealer: "kamau", description: "Service kit: genuine 5W-30 + filter. Covers most 1500–2000cc petrols.", images: [engineImg] },
    { title: "LED Headlight Bulbs H4 (Pair, 6000K)", category: PartCategory.ELECTRICAL, condition: PartCondition.NEW, price: 4500, location: "Kisumu", dealer: "lake", description: "Plug-and-play H4 LEDs with canbus. 1-year warranty.", images: [img("photo-1618843479313-40f8afb4b4d8")] },
    { title: "Starter Motor — Mazda Demio DE", category: PartCategory.ENGINE, condition: PartCondition.REFURBISHED, price: 9000, location: "Nakuru", dealer: "rift", description: "Professionally rebuilt with new brushes. 6-month warranty.", images: [engineImg] },
  ];
  for (const sp of seedParts) {
    const slug = `${slugify(sp.title)}-${Math.random().toString(36).slice(2, 6)}`;
    if (await prisma.part.findFirst({ where: { title: sp.title } })) continue;
    await prisma.part.create({
      data: {
        title: sp.title, slug, category: sp.category, condition: sp.condition, price: sp.price,
        location: sp.location, description: sp.description, status: "ACTIVE",
        sellerId: kamauUser.id, dealerId: dealerIds[sp.dealer] ?? dealerIds.kamau,
        images: { create: sp.images.map((url, i) => ({ url, isPrimary: i === 0, sortOrder: i })) },
      },
    });
  }

  // Blog posts for SEO — full-length Kenyan buying guides (re-seed refreshes them)
  const posts = [
    {
      slug: "toyota-prado-buying-guide-kenya",
      title: "Toyota Prado Buying Guide in Kenya (2026): Prices, Grades & What to Check",
      excerpt: "TX vs TX-L vs TZ-G, diesel vs petrol, mileage checks and duty.",
      coverUrl: img("photo-1533473353331-0135ef1b58bf"), published: true,
      content: [
        "The Land Cruiser Prado is Kenya's default premium SUV — from Nairobi school runs to Maasai Mara safaris. In 2026, a foreign-used 2017–2019 TX-L 2.8D sells for KSh 6.2M–7.2M, while a brand-new Land Cruiser 300 ZX pushes past KSh 18M.",
        "Grades decoded: TX is the workhorse fabric-seat spec; TX-L adds leather, sunroof and a cooler box; TZ-G tops the range with adaptive suspension and premium audio. Diesel 2.8 (1GD-FTV) is the Kenyan favourite — 11–13 km/l and proven on local diesel. The 2.7 petrol is cheaper to buy but thirsty and slower to resell.",
        "What to check: confirm the 8-year import rule compliance (year of manufacture, not registration), verify duty payment with the KRA CRSP schedule, and inspect the underbody for off-road abuse. Mileage above 120,000 km is normal — service history matters more than the odometer.",
        "Resale: Prados hold value better than any rival. Buy the cleanest TX-L you can afford, keep full service records, and you will typically recover 70–80% after three years.",
      ].join("\n\n"),
    },
    {
      slug: "kra-duty-calculator-import-car",
      title: "KRA Duty in 2026: How Much It Really Costs to Import a Car to Kenya",
      excerpt: "CRSP, excise and what foreign-used really costs.",
      coverUrl: img("photo-1449965408869-eaa3f722e40d"), published: true,
      content: [
        "Every foreign-used car price in Kenya hides the same math: KRA's Current Retail Selling Price (CRSP) schedule plus import duty 35%, excise duty (20–35% by engine size), VAT 16%, IDF 2.5% and RDL 2%. On a typical 1500cc car, total taxes land near 100% of the CRSP value.",
        "Rule one: Kenya allows only cars under 8 years old from year of manufacture. Rule two: always price-shop using the CRSP, not the Japanese auction price — two identical-looking units can carry very different duty if their trim levels differ.",
        "Cheapest route for most buyers is still buying an already-imported, duty-paid unit from a verified dealer — the duty is sunk, the logbook exists, and you can verify everything on NTSA TIMS before paying.",
        "Watch out: 'duty not paid' deals at the port look cheap until KRA storage, clearing and compliance are added. Insist on a duty receipt for every foreign-used listing.",
      ].join("\n\n"),
    },
    {
      slug: "best-fuel-efficient-cars-nairobi",
      title: "7 Most Fuel-Efficient Cars for Nairobi Traffic (2026 Real-World km/l)",
      excerpt: "Note e-Power, Fit Hybrid, Swift and real-world km/l.",
      coverUrl: img("photo-1477959858617-67df85cf4f1df"), published: true,
      content: [
        "With petrol hovering around KSh 180/litre, fuel economy is the first filter for Nairobi commuters stuck on Mombasa Road. Hybrids dominate the real-world rankings.",
        "Nissan Note e-Power (25–28 km/l) leads because its petrol engine only charges the battery — no gearbox losses in stop-go traffic. Honda Fit Hybrid (24–27 km/l) and Toyota Aqua (23–26 km/l) follow closely, all available foreign-used between KSh 1.1M and 1.5M.",
        "Non-hybrids worth a look: Suzuki Swift (18–20 km/l), Mazda Demio 1.3 petrol (17–19 km/l) and Toyota Vitz (17–19 km/l). Avoid big-engine sedans as daily drivers — a 2000cc Premio drinks twice what a Note sips on the same commute.",
        "Battery worry? Hybrid battery replacements for Note and Fit now cost KSh 80,000–150,000 in Nairobi with warranty — budget it once every 8–10 years and the fuel savings still win by a mile.",
      ].join("\n\n"),
    },
    {
      slug: "ntsa-logbook-transfer-guide",
      title: "NTSA Logbook Transfer in Kenya: TIMS Process, Fees & Timelines (2026)",
      excerpt: "How to move ownership without stories — step by step.",
      coverUrl: img("photo-1560250097-0b93528c311a"), published: true,
      content: [
        "Never drive away in a car whose logbook still reads someone else's name. Transfer on NTSA TIMS is the only proof of ownership — a sale agreement alone protects no one.",
        "Process: both buyer and seller log into TIMS, the seller initiates transfer, the buyer accepts, then KRA generates a transfer fee (roughly KSh 5,000–15,000 depending on engine rating) plus new logbook processing. Done together at a cyber or Huduma Centre, it takes under an hour of clicking and 2–14 days for the new logbook.",
        "Before you start: confirm the seller's KRA PIN matches the logbook, check for active loans or caveats on the vehicle, and ensure all number plates match the TIMS record. Any mismatch — walk away.",
        "On GariBora, verified dealers complete TIMS transfer with you before final payment release. Private sellers: do the transfer step together, in person, on the same day money moves.",
      ].join("\n\n"),
    },
    {
      slug: "car-loan-kenya-banks-vs-sacco",
      title: "Car Loans in Kenya: Banks vs SACCOs vs In-House Dealer Finance (2026)",
      excerpt: "Rates, deposits and which option actually fits your salary.",
      coverUrl: img("photo-1449965408869-eaa3f722e40d"), published: true,
      content: [
        "Most Kenyans buy cars on credit. Banks currently lend at 15–20% on reducing balance for salaried buyers, usually demanding 20–30% deposit and comprehensive insurance through their panel.",
        "SACCOs are often cheaper (12–15%, sometimes on a flat or reducing basis) and more flexible on informal income — but you must save with them first, typically for 3–6 months, and borrowing is capped at 3–4x your deposits.",
        "Dealer in-house finance gets you driving fastest with the smallest deposit (sometimes 30–40% down, balance over 12–24 months), but effective rates run highest. Read the repossession clause carefully.",
        "Rule of thumb: keep total car costs (loan + insurance + fuel + service) under 25% of household income. On a KSh 2M car over 48 months at 18%, expect roughly KSh 55,000–60,000 monthly before fuel.",
      ].join("\n\n"),
    },
    {
      slug: "best-cars-under-1-5m-kenya",
      title: "Best Cars Under KSh 1.5M in Kenya (2026): 8 Picks That Hold Value",
      excerpt: "Note, Fit, Swift, Demio and more — ranked for town driving.",
      coverUrl: img("photo-1477959858617-67df85cf4f1df"), published: true,
      content: [
        "KSh 1.5M is Kenya's sweet spot: enough for a clean foreign-used hatchback with duty paid and change left for insurance and service. Here is how the segment ranks in 2026.",
        "1) Nissan Note e-Power (~KSh 1.25M) — unbeatable town economy. 2) Honda Fit Hybrid (~KSh 1.2M) — magic seats, 28 km/l. 3) Suzuki Swift (~KSh 1.1M) — fun, cheap parts. 4) Mazda Demio (~KSh 950K) — premium cabin feel. 5) Toyota Vitz (~KSh 1.05M) — resale king.",
        "Stretch picks: Toyota Ractis for headroom, Nissan Tiida for comfort on long drives, and Honda Freed if you need 7 seats on a budget.",
        "At this budget, condition beats badge. Favour units below 80,000 km with auction sheets, verify duty, and keep KSh 150,000 spare for tyres, service and transfer.",
      ].join("\n\n"),
    },
    {
      slug: "prado-vs-land-cruiser-300",
      title: "Prado vs Land Cruiser 300 in Kenya: Which 4x4 Deserves Your Millions?",
      excerpt: "Price, comfort, running costs and resale — head to head.",
      coverUrl: img("photo-1533473353331-0135ef1b58bf"), published: true,
      content: [
        "The Prado (KSh 6–7.5M foreign-used) versus the full-size Land Cruiser 300 (KSh 16M+ new) is really a question about presence versus prudence.",
        "The LC300's 3.3 twin-turbo diesel is a monster — 302hp, effortless overtaking on the Nakuru highway, and a cabin closer to a lounge than a car. But it drinks more, insures for more, and scares more carjackers' attention.",
        "The Prado 2.8D does 90% of the job at 40% of the price: same 7 seats, same go-anywhere ability, cheaper parts everywhere from Industrial Area to Kisumu. For most families, the Prado plus KSh 9M still in the bank wins.",
        "Verdict: buy the LC300 if the car is the statement. Buy the Prado if the journey is the point — and check both against our verified stock before deciding.",
      ].join("\n\n"),
    },
    {
      slug: "pre-purchase-inspection-checklist-kenya",
      title: "17-Point Inspection Checklist Before You Pay for Any Car in Kenya",
      excerpt: "The exact walkaround our inspectors use — steal it.",
      coverUrl: img("photo-1503376780353-7e6692767b70"), published: true,
      content: [
        "Documents first: logbook matches seller ID and KRA PIN; TIMS record clean; duty receipt for imports; service history present. No documents, no deal — walk away regardless of price.",
        "Body: panel gaps even, paint shade consistent in daylight, no overspray on rubbers, boot floor and spare wheel well rust-free. Flood cars hide in Mombasa stock — sniff for damp and check under-seat rails for rust.",
        "Mechanicals: cold start (no smoke, no rattles), gearbox shifts smooth hot and cold, no dashboard lights after 10 seconds, AC ice-cold, all electrics working. Budget KSh 3,000–5,000 for an independent inspection in Nairobi — the cheapest money in car buying.",
        "On GariBora, cars with the inspection badge have already passed these checks, and the report summary is available from the seller before viewing.",
      ].join("\n\n"),
    },
    {
      slug: "toyota-hiace-shuttle-business-kenya",
      title: "Toyota Hiace Shuttle Business in Kenya: Routes, PSV & the Real Math",
      excerpt: "Nairobi–Nakuru, Upcountry, airport runs — what it earns.",
      coverUrl: img("photo-1605893477799-b99e3b8b93fe"), published: true,
      content: [
        "A 14-seater Hiace on the Nairobi–Nakuru corridor grosses roughly KSh 12,000–18,000 daily in fares. After fuel (KSh 4,000–5,000), driver, SACCO fees and service, disciplined operators net KSh 150,000–250,000 monthly per van.",
        "Compliance is non-negotiable: PSV licence via NTSA, TLB for long routes, SACCO membership, speed governor, inspection every 6 months, and genuine PSV insurance (KSh 150,000–250,000 yearly). Skip any of these and one crackdown wipes out months of profit.",
        "Buy right: the 2.8 diesel Super GL (2017+, KSh 4.5–5.5M) is the industry standard — parts everywhere, resale instant. Avoid petrol vans for shuttle work; the fuel math never closes.",
        "Start with one van, drive the route yourself for a month to learn the crew economics, then scale. Most failed shuttle businesses fail on driver honesty, not on the vehicle.",
      ].join("\n\n"),
    },
  ];
  for (const p of posts) {
    await prisma.post.upsert({ where: { slug: p.slug }, update: { title: p.title, excerpt: p.excerpt, content: p.content, coverUrl: p.coverUrl, published: p.published }, create: p });
  }

  console.log("Seeded admin + 4 dealers + cars. Logins: admin@garibora.ke / seller@garibora.ke (Password123!)");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
