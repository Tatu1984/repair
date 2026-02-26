import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Clean up existing data
  await prisma.notification.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.dispute.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.partOrder.deleteMany();
  await prisma.sparePart.deleteMany();
  await prisma.breakdownRequest.deleteMany();
  await prisma.workshop.deleteMany();
  await prisma.mechanic.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.otpVerification.deleteMany();
  await prisma.user.deleteMany();
  await prisma.vehicleMasterData.deleteMany();
  await prisma.platformConfig.deleteMany();

  console.log("  Cleaned existing data");

  // --- Platform Config ---
  await prisma.platformConfig.create({
    data: { id: "singleton" },
  });

  // --- Admin User ---
  const admin = await prisma.user.create({
    data: {
      phone: "9999999999",
      name: "Admin User",
      email: "admin@repairassist.com",
      role: "ADMIN",
    },
  });

  // --- Persistent OTPs for demo login ---
  await prisma.otpVerification.createMany({
    data: [
      { phone: "9999999999", otp: "123456", role: "ADMIN", expiresAt: new Date("2030-01-01") },
      { phone: "9811234567", otp: "123456", role: "WORKSHOP", expiresAt: new Date("2030-01-01") },
      { phone: "8765543211", otp: "123456", role: "WORKSHOP", expiresAt: new Date("2030-01-01") },
    ],
  });

  console.log("  Created demo OTPs (admin + 2 workshops)");

  // --- Riders ---
  const riders = await Promise.all([
    prisma.user.create({ data: { phone: "9876543210", name: "Arjun Mehta", role: "RIDER" } }),
    prisma.user.create({ data: { phone: "8765432109", name: "Priya Singh", role: "RIDER" } }),
    prisma.user.create({ data: { phone: "7654321098", name: "Vikram Reddy", role: "RIDER" } }),
    prisma.user.create({ data: { phone: "6543210987", name: "Neha Gupta", role: "RIDER" } }),
    prisma.user.create({ data: { phone: "5432109876", name: "Rohit Patel", role: "RIDER" } }),
  ]);

  console.log("  Created riders");

  // --- Mechanic Users + Mechanic Profiles ---
  const mechUsers = await Promise.all([
    prisma.user.create({ data: { phone: "9876500001", name: "Ravi Sharma", role: "MECHANIC" } }),
    prisma.user.create({ data: { phone: "9876500002", name: "Suresh Kumar", role: "MECHANIC" } }),
    prisma.user.create({ data: { phone: "9876500003", name: "Deepak Yadav", role: "MECHANIC" } }),
    prisma.user.create({ data: { phone: "9876500004", name: "Amit Tiwari", role: "MECHANIC" } }),
    prisma.user.create({ data: { phone: "9876500005", name: "Karthik Rajan", role: "MECHANIC" } }),
    prisma.user.create({ data: { phone: "9876500006", name: "Manoj Verma", role: "MECHANIC" } }),
  ]);

  const mechanics = await Promise.all([
    prisma.mechanic.create({
      data: {
        userId: mechUsers[0].id,
        skills: ["2W", "4W"],
        latitude: 28.5706,
        longitude: 77.2399,
        status: "ONLINE",
        isOnline: true,
        rating: 4.9,
        totalJobs: 342,
        completedToday: 5,
        earnings: 48500,
        verificationStatus: "APPROVED",
      },
    }),
    prisma.mechanic.create({
      data: {
        userId: mechUsers[1].id,
        skills: ["2W", "EV"],
        latitude: 19.1136,
        longitude: 72.8697,
        status: "BUSY",
        isOnline: true,
        rating: 4.8,
        totalJobs: 298,
        completedToday: 3,
        earnings: 42000,
        verificationStatus: "APPROVED",
      },
    }),
    prisma.mechanic.create({
      data: {
        userId: mechUsers[2].id,
        skills: ["2W", "4W", "EV"],
        latitude: 12.9352,
        longitude: 77.6245,
        status: "ONLINE",
        isOnline: true,
        rating: 4.7,
        totalJobs: 267,
        completedToday: 4,
        earnings: 39800,
        verificationStatus: "APPROVED",
      },
    }),
    prisma.mechanic.create({
      data: {
        userId: mechUsers[3].id,
        skills: ["2W"],
        latitude: 18.5590,
        longitude: 73.7868,
        status: "OFFLINE",
        isOnline: false,
        rating: 4.6,
        totalJobs: 234,
        completedToday: 2,
        earnings: 35200,
        verificationStatus: "APPROVED",
      },
    }),
    prisma.mechanic.create({
      data: {
        userId: mechUsers[4].id,
        skills: ["2W", "4W"],
        latitude: 13.0418,
        longitude: 80.2341,
        status: "ONLINE",
        isOnline: true,
        rating: 4.3,
        totalJobs: 45,
        completedToday: 0,
        earnings: 12800,
        verificationStatus: "PENDING",
      },
    }),
    prisma.mechanic.create({
      data: {
        userId: mechUsers[5].id,
        skills: ["2W", "EV"],
        latitude: 22.5726,
        longitude: 88.3639,
        status: "BUSY",
        isOnline: true,
        rating: 4.5,
        totalJobs: 201,
        completedToday: 3,
        earnings: 31500,
        verificationStatus: "APPROVED",
      },
    }),
  ]);

  console.log("  Created mechanics");

  // --- Workshop Users + Workshop Profiles (with KYC data) ---
  const wsUsers = await Promise.all([
    prisma.user.create({ data: { phone: "9811234567", name: "Rajendra Sharma", role: "WORKSHOP" } }),
    prisma.user.create({ data: { phone: "8765543211", name: "Kiran Patel", role: "WORKSHOP" } }),
    prisma.user.create({ data: { phone: "7654321199", name: "Anil Hegde", role: "WORKSHOP" } }),
    prisma.user.create({ data: { phone: "6543210988", name: "Venkat Krishna", role: "WORKSHOP" } }),
    prisma.user.create({ data: { phone: "5432109877", name: "Soumya Mukherjee", role: "WORKSHOP" } }),
  ]);

  const workshops = await Promise.all([
    prisma.workshop.create({
      data: {
        ownerId: wsUsers[0].id,
        name: "Sharma Auto Spares & Service",
        address: "Karol Bagh, New Delhi",
        latitude: 28.6508,
        longitude: 77.1900,
        gstNumber: "07AAACS1234H1Z5",
        phone: "+91 98112 34567",
        rating: 4.8,
        reviewCount: 156,
        specialties: ["Honda", "TVS", "Hero"],
        panNumber: "ABCPS1234H",
        aadhaarNumber: "1234 5678 9012",
        bankAccountName: "Rajendra Sharma",
        bankAccountNumber: "1234567890123456",
        bankIfscCode: "SBIN0001234",
        monthlyRevenue: 285000,
        verificationStatus: "APPROVED",
      },
    }),
    prisma.workshop.create({
      data: {
        ownerId: wsUsers[1].id,
        name: "Patel Two-Wheeler Parts",
        address: "CG Road, Ahmedabad",
        latitude: 23.0300,
        longitude: 72.5800,
        gstNumber: "24AABCP5678M1Z3",
        phone: "+91 87655 43210",
        rating: 4.6,
        reviewCount: 98,
        specialties: ["Bajaj", "Royal Enfield"],
        panNumber: "DEFKP5678M",
        aadhaarNumber: "9876 5432 1098",
        bankAccountName: "Kiran Patel",
        bankAccountNumber: "9876543210987654",
        bankIfscCode: "HDFC0002345",
        monthlyRevenue: 198000,
        verificationStatus: "APPROVED",
      },
    }),
    prisma.workshop.create({
      data: {
        ownerId: wsUsers[2].id,
        name: "Bengaluru EV Hub",
        address: "Indiranagar, Bengaluru",
        latitude: 12.9784,
        longitude: 77.6408,
        gstNumber: "29AADCH9012K1Z8",
        phone: "+91 76543 21098",
        rating: 4.9,
        reviewCount: 72,
        specialties: ["Ola", "Ather", "TVS iQube"],
        panNumber: "GHIAH9012K",
        aadhaarNumber: "4567 8901 2345",
        bankAccountName: "Anil Hegde",
        bankAccountNumber: "4567890123456789",
        bankIfscCode: "ICIC0003456",
        monthlyRevenue: 340000,
        verificationStatus: "APPROVED",
      },
    }),
    prisma.workshop.create({
      data: {
        ownerId: wsUsers[3].id,
        name: "Krishna Motor Parts",
        address: "Ameerpet, Hyderabad",
        latitude: 17.4375,
        longitude: 78.4483,
        gstNumber: "36AABCK3456P1Z1",
        phone: "+91 65432 10987",
        rating: 4.2,
        reviewCount: 45,
        specialties: ["Yamaha", "Suzuki"],
        monthlyRevenue: 0,
        verificationStatus: "PENDING",
      },
    }),
    prisma.workshop.create({
      data: {
        ownerId: wsUsers[4].id,
        name: "Mukherjee Bike World",
        address: "Park Street, Kolkata",
        latitude: 22.5511,
        longitude: 88.3521,
        gstNumber: "19AABCM7890L1Z6",
        phone: "+91 54321 09876",
        rating: 4.5,
        reviewCount: 134,
        specialties: ["Hero", "Honda", "Bajaj"],
        panNumber: "JKLSM7890L",
        aadhaarNumber: "7890 1234 5678",
        bankAccountName: "Soumya Mukherjee",
        bankAccountNumber: "7890123456789012",
        bankIfscCode: "BARB0004567",
        monthlyRevenue: 165000,
        verificationStatus: "APPROVED",
      },
    }),
  ]);

  console.log("  Created workshops (with KYC)");

  // --- Vehicle Master Data (~40 entries) ---
  const vehicleMasterEntries = [
    // 2-Wheeler — Honda
    { vehicleType: "2-Wheeler", brand: "Honda", model: "Activa 6G", yearFrom: 2020, yearTo: 2024 },
    { vehicleType: "2-Wheeler", brand: "Honda", model: "Shine 125", yearFrom: 2018, yearTo: 2024 },
    { vehicleType: "2-Wheeler", brand: "Honda", model: "Unicorn 160", yearFrom: 2019, yearTo: 2024 },
    { vehicleType: "2-Wheeler", brand: "Honda", model: "SP 125", yearFrom: 2019, yearTo: 2024 },
    // 2-Wheeler — Bajaj
    { vehicleType: "2-Wheeler", brand: "Bajaj", model: "Pulsar 150", yearFrom: 2017, yearTo: 2024 },
    { vehicleType: "2-Wheeler", brand: "Bajaj", model: "Pulsar NS200", yearFrom: 2018, yearTo: 2024 },
    { vehicleType: "2-Wheeler", brand: "Bajaj", model: "Platina 110", yearFrom: 2019, yearTo: 2024 },
    // 2-Wheeler — Hero
    { vehicleType: "2-Wheeler", brand: "Hero", model: "Splendor Plus", yearFrom: 2015, yearTo: 2024 },
    { vehicleType: "2-Wheeler", brand: "Hero", model: "HF Deluxe", yearFrom: 2016, yearTo: 2024 },
    { vehicleType: "2-Wheeler", brand: "Hero", model: "Passion Pro", yearFrom: 2018, yearTo: 2024 },
    // 2-Wheeler — TVS
    { vehicleType: "2-Wheeler", brand: "TVS", model: "Jupiter", yearFrom: 2018, yearTo: 2024 },
    { vehicleType: "2-Wheeler", brand: "TVS", model: "Apache RTR 160", yearFrom: 2019, yearTo: 2024 },
    { vehicleType: "2-Wheeler", brand: "TVS", model: "Ntorq 125", yearFrom: 2020, yearTo: 2024 },
    // 2-Wheeler — Royal Enfield
    { vehicleType: "2-Wheeler", brand: "Royal Enfield", model: "Classic 350", yearFrom: 2020, yearTo: 2024 },
    { vehicleType: "2-Wheeler", brand: "Royal Enfield", model: "Meteor 350", yearFrom: 2021, yearTo: 2024 },
    { vehicleType: "2-Wheeler", brand: "Royal Enfield", model: "Hunter 350", yearFrom: 2022, yearTo: 2024 },
    // 2-Wheeler — Yamaha
    { vehicleType: "2-Wheeler", brand: "Yamaha", model: "FZ-S V3", yearFrom: 2019, yearTo: 2024 },
    { vehicleType: "2-Wheeler", brand: "Yamaha", model: "R15 V4", yearFrom: 2021, yearTo: 2024 },
    // 2-Wheeler — Suzuki
    { vehicleType: "2-Wheeler", brand: "Suzuki", model: "Access 125", yearFrom: 2017, yearTo: 2024 },
    { vehicleType: "2-Wheeler", brand: "Suzuki", model: "Gixxer 150", yearFrom: 2019, yearTo: 2024 },
    // 4-Wheeler — Maruti
    { vehicleType: "4-Wheeler", brand: "Maruti", model: "Swift", yearFrom: 2018, yearTo: 2024 },
    { vehicleType: "4-Wheeler", brand: "Maruti", model: "Alto K10", yearFrom: 2015, yearTo: 2024 },
    { vehicleType: "4-Wheeler", brand: "Maruti", model: "Baleno", yearFrom: 2019, yearTo: 2024 },
    // 4-Wheeler — Hyundai
    { vehicleType: "4-Wheeler", brand: "Hyundai", model: "i20", yearFrom: 2020, yearTo: 2024 },
    { vehicleType: "4-Wheeler", brand: "Hyundai", model: "Creta", yearFrom: 2020, yearTo: 2024 },
    { vehicleType: "4-Wheeler", brand: "Hyundai", model: "Venue", yearFrom: 2019, yearTo: 2024 },
    // 4-Wheeler — Tata
    { vehicleType: "4-Wheeler", brand: "Tata", model: "Nexon", yearFrom: 2020, yearTo: 2024 },
    { vehicleType: "4-Wheeler", brand: "Tata", model: "Punch", yearFrom: 2021, yearTo: 2024 },
    { vehicleType: "4-Wheeler", brand: "Tata", model: "Altroz", yearFrom: 2020, yearTo: 2024 },
    // 4-Wheeler — Honda
    { vehicleType: "4-Wheeler", brand: "Honda", model: "City", yearFrom: 2018, yearTo: 2024 },
    { vehicleType: "4-Wheeler", brand: "Honda", model: "Amaze", yearFrom: 2018, yearTo: 2024 },
    // 4-Wheeler — Mahindra
    { vehicleType: "4-Wheeler", brand: "Mahindra", model: "XUV700", yearFrom: 2021, yearTo: 2024 },
    { vehicleType: "4-Wheeler", brand: "Mahindra", model: "Thar", yearFrom: 2020, yearTo: 2024 },
    // EV
    { vehicleType: "EV", brand: "Ola", model: "S1 Pro", yearFrom: 2022, yearTo: 2024 },
    { vehicleType: "EV", brand: "Ather", model: "450X", yearFrom: 2021, yearTo: 2024 },
    { vehicleType: "EV", brand: "TVS", model: "iQube", yearFrom: 2022, yearTo: 2024 },
    { vehicleType: "EV", brand: "Bajaj", model: "Chetak", yearFrom: 2022, yearTo: 2024 },
    { vehicleType: "EV", brand: "Tata", model: "Nexon EV", yearFrom: 2021, yearTo: 2024 },
    // Truck
    { vehicleType: "Truck", brand: "Tata", model: "Ace", yearFrom: 2015, yearTo: 2024 },
    { vehicleType: "Truck", brand: "Mahindra", model: "Bolero Pickup", yearFrom: 2016, yearTo: 2024 },
    { vehicleType: "Truck", brand: "Ashok Leyland", model: "Dost", yearFrom: 2017, yearTo: 2024 },
  ];

  await prisma.vehicleMasterData.createMany({
    data: vehicleMasterEntries,
  });

  console.log(`  Created ${vehicleMasterEntries.length} vehicle master entries`);

  // --- Spare Parts (~25 parts with category and serialNumber) ---
  const parts = await Promise.all([
    // Workshop 0 — Sharma Auto (Honda, TVS, Hero)
    prisma.sparePart.create({ data: { workshopId: workshops[0].id, name: "Brake Pad Set - Honda Activa", vehicleType: "2-Wheeler", brand: "Honda", model: "Activa 6G", category: "brakes", serialNumber: "BP-HON-001", condition: "LIKE_NEW", price: 450, marketPrice: 750, stock: 12 } }),
    prisma.sparePart.create({ data: { workshopId: workshops[0].id, name: "Head Light Assembly - Hero Splendor", vehicleType: "2-Wheeler", brand: "Hero", model: "Splendor Plus", category: "electrical", serialNumber: "HL-HER-002", condition: "OEM_SURPLUS", price: 1100, marketPrice: 1800, stock: 8 } }),
    prisma.sparePart.create({ data: { workshopId: workshops[0].id, name: "CDI Unit - Honda Shine", vehicleType: "2-Wheeler", brand: "Honda", model: "Shine 125", category: "electrical", serialNumber: "CDI-HON-003", condition: "REFURBISHED", price: 850, marketPrice: 1500, stock: 6 } }),
    prisma.sparePart.create({ data: { workshopId: workshops[0].id, name: "Exhaust Silencer - TVS Jupiter", vehicleType: "2-Wheeler", brand: "TVS", model: "Jupiter", category: "exhaust", serialNumber: "EX-TVS-004", condition: "USED_GOOD", price: 1200, marketPrice: 2400, stock: 3 } }),
    prisma.sparePart.create({ data: { workshopId: workshops[0].id, name: "Speedometer Cable - Hero HF Deluxe", vehicleType: "2-Wheeler", brand: "Hero", model: "HF Deluxe", category: "body", serialNumber: "SC-HER-005", condition: "LIKE_NEW", price: 180, marketPrice: 350, stock: 20 } }),

    // Workshop 1 — Patel (Bajaj, Royal Enfield)
    prisma.sparePart.create({ data: { workshopId: workshops[1].id, name: "Clutch Plate - Bajaj Pulsar 150", vehicleType: "2-Wheeler", brand: "Bajaj", model: "Pulsar 150", category: "transmission", serialNumber: "CP-BAJ-006", condition: "REFURBISHED", price: 680, marketPrice: 1200, stock: 5 } }),
    prisma.sparePart.create({ data: { workshopId: workshops[1].id, name: "Radiator Fan Motor - Maruti Swift", vehicleType: "4-Wheeler", brand: "Maruti", model: "Swift", category: "engine", serialNumber: "RF-MAR-007", condition: "USED_GOOD", price: 2200, marketPrice: 4500, stock: 3 } }),
    prisma.sparePart.create({ data: { workshopId: workshops[1].id, name: "Suspension Coil Spring - Tata Nexon", vehicleType: "4-Wheeler", brand: "Tata", model: "Nexon", category: "suspension", serialNumber: "SS-TAT-008", condition: "LIKE_NEW", price: 1800, marketPrice: 3200, stock: 6 } }),
    prisma.sparePart.create({ data: { workshopId: workshops[1].id, name: "Rear Brake Shoe - Royal Enfield Classic", vehicleType: "2-Wheeler", brand: "Royal Enfield", model: "Classic 350", category: "brakes", serialNumber: "BS-RE-009", condition: "OEM_SURPLUS", price: 550, marketPrice: 900, stock: 10 } }),
    prisma.sparePart.create({ data: { workshopId: workshops[1].id, name: "Stator Coil - Bajaj NS200", vehicleType: "2-Wheeler", brand: "Bajaj", model: "Pulsar NS200", category: "electrical", serialNumber: "ST-BAJ-010", condition: "REFURBISHED", price: 1400, marketPrice: 2800, stock: 2 } }),

    // Workshop 2 — Bengaluru EV Hub
    prisma.sparePart.create({ data: { workshopId: workshops[2].id, name: "Alternator - Hyundai i20", vehicleType: "4-Wheeler", brand: "Hyundai", model: "i20", category: "electrical", serialNumber: "AL-HYU-011", condition: "REFURBISHED", price: 3500, marketPrice: 6800, stock: 0 } }),
    prisma.sparePart.create({ data: { workshopId: workshops[2].id, name: "Battery 12V 35Ah - Bajaj Chetak EV", vehicleType: "EV", brand: "Bajaj", model: "Chetak", category: "electrical", serialNumber: "BT-BAJ-012", condition: "OEM_SURPLUS", price: 8500, marketPrice: 14000, stock: 4 } }),
    prisma.sparePart.create({ data: { workshopId: workshops[2].id, name: "Controller Unit - Ola S1 Pro", vehicleType: "EV", brand: "Ola", model: "S1 Pro", category: "electrical", serialNumber: "CU-OLA-013", condition: "LIKE_NEW", price: 6200, marketPrice: 11000, stock: 2 } }),
    prisma.sparePart.create({ data: { workshopId: workshops[2].id, name: "Hub Motor - Ather 450X", vehicleType: "EV", brand: "Ather", model: "450X", category: "engine", serialNumber: "HM-ATH-014", condition: "REFURBISHED", price: 9800, marketPrice: 18500, stock: 1 } }),
    prisma.sparePart.create({ data: { workshopId: workshops[2].id, name: "Charger Unit - TVS iQube", vehicleType: "EV", brand: "TVS", model: "iQube", category: "electrical", serialNumber: "CH-TVS-015", condition: "OEM_SURPLUS", price: 4500, marketPrice: 7500, stock: 5 } }),

    // Workshop 3 — Krishna Motor (Yamaha, Suzuki)
    prisma.sparePart.create({ data: { workshopId: workshops[3].id, name: "Carburetor - Yamaha FZ-S", vehicleType: "2-Wheeler", brand: "Yamaha", model: "FZ-S V3", category: "engine", serialNumber: "CB-YAM-016", condition: "USED_GOOD", price: 1600, marketPrice: 3200, stock: 4 } }),
    prisma.sparePart.create({ data: { workshopId: workshops[3].id, name: "Fuel Pump - Suzuki Access 125", vehicleType: "2-Wheeler", brand: "Suzuki", model: "Access 125", category: "engine", serialNumber: "FP-SUZ-017", condition: "REFURBISHED", price: 1100, marketPrice: 2200, stock: 7 } }),
    prisma.sparePart.create({ data: { workshopId: workshops[3].id, name: "Side Mirror Set - Yamaha R15", vehicleType: "2-Wheeler", brand: "Yamaha", model: "R15 V4", category: "body", serialNumber: "SM-YAM-018", condition: "LIKE_NEW", price: 750, marketPrice: 1400, stock: 9 } }),
    prisma.sparePart.create({ data: { workshopId: workshops[3].id, name: "Chain Sprocket Kit - Suzuki Gixxer", vehicleType: "2-Wheeler", brand: "Suzuki", model: "Gixxer 150", category: "transmission", serialNumber: "CS-SUZ-019", condition: "OEM_SURPLUS", price: 1350, marketPrice: 2500, stock: 3 } }),

    // Workshop 4 — Mukherjee Bike World (Hero, Honda, Bajaj)
    prisma.sparePart.create({ data: { workshopId: workshops[4].id, name: "Air Filter - Tata Ace Truck", vehicleType: "Truck", brand: "Tata", model: "Ace", category: "engine", serialNumber: "AF-TAT-020", condition: "USED_GOOD", price: 950, marketPrice: 1600, stock: 15 } }),
    prisma.sparePart.create({ data: { workshopId: workshops[4].id, name: "Disc Brake Rotor - Honda City", vehicleType: "4-Wheeler", brand: "Honda", model: "City", category: "brakes", serialNumber: "DB-HON-021", condition: "REFURBISHED", price: 2800, marketPrice: 5200, stock: 7 } }),
    prisma.sparePart.create({ data: { workshopId: workshops[4].id, name: "Piston Ring Set - Hero Passion Pro", vehicleType: "2-Wheeler", brand: "Hero", model: "Passion Pro", category: "engine", serialNumber: "PR-HER-022", condition: "OEM_SURPLUS", price: 480, marketPrice: 900, stock: 18 } }),
    prisma.sparePart.create({ data: { workshopId: workshops[4].id, name: "Ignition Coil - Bajaj Platina", vehicleType: "2-Wheeler", brand: "Bajaj", model: "Platina 110", category: "electrical", serialNumber: "IC-BAJ-023", condition: "LIKE_NEW", price: 620, marketPrice: 1100, stock: 11 } }),
    prisma.sparePart.create({ data: { workshopId: workshops[4].id, name: "Tail Light Assembly - Honda Activa", vehicleType: "2-Wheeler", brand: "Honda", model: "Activa 6G", category: "electrical", serialNumber: "TL-HON-024", condition: "USED_GOOD", price: 380, marketPrice: 700, stock: 14 } }),
    prisma.sparePart.create({ data: { workshopId: workshops[4].id, name: "Front Fork Oil Seal - Royal Enfield", vehicleType: "2-Wheeler", brand: "Royal Enfield", model: "Meteor 350", category: "suspension", serialNumber: "FO-RE-025", condition: "REFURBISHED", price: 350, marketPrice: 650, stock: 8 } }),
  ]);

  console.log(`  Created ${parts.length} spare parts`);

  // --- Breakdown Requests ---
  const emergencyTypes = [
    "FLAT_TYRE", "ENGINE_STALL", "BATTERY_DEAD", "CHAIN_BREAK", "FUEL_EMPTY",
    "BRAKE_FAILURE", "PUNCTURE", "CLUTCH_ISSUE", "SELF_START_FAIL", "OVERHEATING",
  ] as const;

  const bdStatuses = [
    "ACCEPTED", "COMPLETED", "PENDING", "ACCEPTED", "COMPLETED",
    "PENDING", "COMPLETED", "CANCELLED", "ACCEPTED", "PENDING",
  ] as const;

  const bdLocations = [
    { addr: "MG Road, Bengaluru", lat: 12.9716, lng: 77.5946, vehicle: "Honda Activa 6G" },
    { addr: "Connaught Place, Delhi", lat: 28.6315, lng: 77.2167, vehicle: "Royal Enfield Classic 350" },
    { addr: "Banjara Hills, Hyderabad", lat: 17.4120, lng: 78.4406, vehicle: "TVS Jupiter" },
    { addr: "Andheri West, Mumbai", lat: 19.1364, lng: 72.8296, vehicle: "Bajaj Pulsar 150" },
    { addr: "Navrangpura, Ahmedabad", lat: 23.0386, lng: 72.5621, vehicle: "Hero Splendor Plus" },
    { addr: "Koramangala, Bengaluru", lat: 12.9352, lng: 77.6245, vehicle: "Ola S1 Pro" },
    { addr: "Salt Lake, Kolkata", lat: 22.5804, lng: 88.4119, vehicle: "Suzuki Access 125" },
    { addr: "Aundh, Pune", lat: 18.5590, lng: 73.8071, vehicle: "KTM Duke 200" },
    { addr: "T. Nagar, Chennai", lat: 13.0418, lng: 80.2341, vehicle: "Yamaha FZ-S V3" },
    { addr: "Civil Lines, Jaipur", lat: 26.8567, lng: 75.7916, vehicle: "Ather 450X" },
  ];

  const breakdowns = [];
  for (let i = 0; i < 10; i++) {
    const riderIdx = i % riders.length;
    const mechIdx = i % mechanics.length;
    const loc = bdLocations[i];

    const bd = await prisma.breakdownRequest.create({
      data: {
        displayId: `BR-${2401 + i}`,
        riderId: riders[riderIdx].id,
        mechanicId: bdStatuses[i] !== "PENDING" ? mechanics[mechIdx].id : null,
        latitude: loc.lat,
        longitude: loc.lng,
        locationAddress: loc.addr,
        vehicleInfo: loc.vehicle,
        emergencyType: emergencyTypes[i],
        status: bdStatuses[i],
        estimatedPrice: bdStatuses[i] === "COMPLETED" ? 500 + i * 100 : null,
        finalPrice: bdStatuses[i] === "COMPLETED" ? 500 + i * 100 : null,
        completedAt: bdStatuses[i] === "COMPLETED" ? new Date() : null,
      },
    });
    breakdowns.push(bd);
  }

  console.log("  Created breakdown requests");

  // --- Part Orders (~15 orders across workshops, mixed statuses) ---
  const orderStatuses = [
    "DELIVERED", "CONFIRMED", "SHIPPED", "PENDING", "DELIVERED",
    "RETURNED", "CONFIRMED", "SHIPPED", "DELIVERED", "PENDING",
    "CONFIRMED", "DELIVERED", "SHIPPED", "CANCELLED", "DELIVERED",
  ] as const;

  const paymentStatuses = [
    "PAID", "ESCROW", "COD", "PAID", "PAID",
    "REFUNDED", "COD", "PAID", "PAID", "PENDING",
    "ESCROW", "PAID", "COD", "REFUNDED", "PAID",
  ] as const;

  for (let i = 0; i < 15; i++) {
    const part = parts[i % parts.length];
    const buyer = riders[i % riders.length];
    const qty = i % 3 === 0 ? 2 : 1;

    const subtotal = part.price * qty;
    const gst = Math.round(subtotal * 0.18);

    await prisma.partOrder.create({
      data: {
        displayId: `ORD-${10234 + i}`,
        partId: part.id,
        buyerId: buyer.id,
        workshopId: part.workshopId,
        quantity: qty,
        unitPrice: part.price,
        subtotal,
        gstAmount: gst,
        totalAmount: subtotal + gst,
        orderStatus: orderStatuses[i],
        paymentStatus: paymentStatuses[i],
      },
    });
  }

  console.log("  Created 15 orders");

  // --- Ratings ---
  for (let i = 0; i < mechanics.length; i++) {
    for (let j = 0; j < 3; j++) {
      await prisma.rating.create({
        data: {
          fromUserId: riders[j % riders.length].id,
          toUserId: mechUsers[i].id,
          stars: 4 + Math.floor(Math.random() * 2),
          review: [
            "Great service, very professional!",
            "Quick response and fair pricing",
            "Fixed my bike perfectly, highly recommend",
          ][j],
          breakdownId: breakdowns[j % breakdowns.length].id,
        },
      });
    }
  }

  console.log("  Created ratings");

  // --- Disputes ---
  const disputes = [
    { raisedById: riders[0].id, relatedId: breakdowns[0].id, relatedType: "BREAKDOWN", reason: "Overcharging by mechanic", description: "The mechanic charged ₹1,500 for brake pad replacement but the market rate is ₹800.", status: "OPEN" as const, priority: "HIGH" as const },
    { raisedById: wsUsers[1].id, relatedId: breakdowns[1].id, relatedType: "BREAKDOWN", reason: "Defective part received from supplier", description: "Customer returned a Bajaj Pulsar clutch plate claiming it was defective.", status: "UNDER_REVIEW" as const, priority: "MEDIUM" as const },
    { raisedById: riders[1].id, relatedId: breakdowns[2].id, relatedType: "BREAKDOWN", reason: "Mechanic no-show for scheduled service", description: "Booked a roadside assistance for flat tyre. Mechanic confirmed but never showed up.", status: "RESOLVED" as const, priority: "HIGH" as const },
    { raisedById: riders[2].id, relatedId: breakdowns[3].id, relatedType: "BREAKDOWN", reason: "Wrong part delivered", description: "Ordered a clutch plate for Bajaj Pulsar 150 but received one for Pulsar 220.", status: "OPEN" as const, priority: "MEDIUM" as const },
    { raisedById: mechUsers[0].id, relatedId: breakdowns[4].id, relatedType: "BREAKDOWN", reason: "Delayed payment for completed service", description: "Completed an emergency engine repair. Payment is still held in escrow for over 5 days.", status: "CLOSED" as const, priority: "LOW" as const },
  ];

  for (let i = 0; i < disputes.length; i++) {
    await prisma.dispute.create({
      data: {
        displayId: `DSP-${401 + i}`,
        ...disputes[i],
      },
    });
  }

  console.log("  Created disputes");

  // --- Notifications ---
  const notifTypes = [
    "BREAKDOWN_NEW", "BREAKDOWN_ACCEPTED", "BREAKDOWN_COMPLETED",
    "ORDER_CONFIRMED", "ORDER_SHIPPED", "PAYMENT_RECEIVED", "DISPUTE_UPDATE", "SYSTEM",
  ] as const;

  const notifData = [
    { title: "New breakdown request", body: "A rider near MG Road needs help with a flat tyre" },
    { title: "Breakdown accepted", body: "Mechanic Ravi Sharma is on the way" },
    { title: "Service completed", body: "Your breakdown request has been resolved" },
    { title: "Order confirmed", body: "Your brake pad order has been confirmed" },
    { title: "Order shipped", body: "Your order ORD-10234 has been dispatched" },
    { title: "Payment received", body: "₹531 payment confirmed for order ORD-10234" },
    { title: "Dispute update", body: "Your dispute DSP-401 is under review" },
    { title: "Welcome to RepairAssist", body: "Thank you for joining the platform!" },
  ];

  for (let i = 0; i < notifData.length; i++) {
    await prisma.notification.create({
      data: {
        userId: admin.id,
        title: notifData[i].title,
        body: notifData[i].body,
        type: notifTypes[i],
        isRead: i > 4,
      },
    });
  }

  console.log("  Created notifications");
  console.log("✅ Seed complete!");
  console.log("");
  console.log("📋 Demo Login Credentials:");
  console.log("  Admin:    9999999999 / 123456");
  console.log("  Workshop: 9811234567 / 123456 (Sharma Auto Spares)");
  console.log("  Workshop: 8765543211 / 123456 (Patel Two-Wheeler Parts)");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
