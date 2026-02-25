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

  // --- Persistent OTP for demo login ---
  await prisma.otpVerification.create({
    data: {
      phone: "9999999999",
      otp: "123456",
      role: "ADMIN",
      expiresAt: new Date("2030-01-01"),
    },
  });

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

  // --- Workshop Users + Workshop Profiles ---
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
        monthlyRevenue: 165000,
        verificationStatus: "APPROVED",
      },
    }),
  ]);

  console.log("  Created workshops");

  // --- Spare Parts ---
  const parts = await Promise.all([
    prisma.sparePart.create({
      data: { workshopId: workshops[0].id, name: "Brake Pad Set - Honda Activa", vehicleType: "2-Wheeler", brand: "Honda", condition: "LIKE_NEW", price: 450, marketPrice: 750, stock: 12 },
    }),
    prisma.sparePart.create({
      data: { workshopId: workshops[1].id, name: "Clutch Plate - Bajaj Pulsar 150", vehicleType: "2-Wheeler", brand: "Bajaj", condition: "REFURBISHED", price: 680, marketPrice: 1200, stock: 5 },
    }),
    prisma.sparePart.create({
      data: { workshopId: workshops[0].id, name: "Head Light Assembly - Hero Splendor", vehicleType: "2-Wheeler", brand: "Hero", condition: "OEM_SURPLUS", price: 1100, marketPrice: 1800, stock: 8 },
    }),
    prisma.sparePart.create({
      data: { workshopId: workshops[1].id, name: "Radiator Fan Motor - Maruti Swift", vehicleType: "4-Wheeler", brand: "Maruti", condition: "USED_GOOD", price: 2200, marketPrice: 4500, stock: 3 },
    }),
    prisma.sparePart.create({
      data: { workshopId: workshops[2].id, name: "Alternator - Hyundai i20", vehicleType: "4-Wheeler", brand: "Hyundai", condition: "REFURBISHED", price: 3500, marketPrice: 6800, stock: 0 },
    }),
    prisma.sparePart.create({
      data: { workshopId: workshops[1].id, name: "Suspension Coil Spring - Tata Nexon", vehicleType: "4-Wheeler", brand: "Tata", condition: "LIKE_NEW", price: 1800, marketPrice: 3200, stock: 6 },
    }),
    prisma.sparePart.create({
      data: { workshopId: workshops[2].id, name: "Battery 12V 35Ah - Bajaj Chetak EV", vehicleType: "EV", brand: "Bajaj", condition: "OEM_SURPLUS", price: 8500, marketPrice: 14000, stock: 4 },
    }),
    prisma.sparePart.create({
      data: { workshopId: workshops[4].id, name: "Air Filter - Tata Ace Truck", vehicleType: "Truck", brand: "Tata", condition: "USED_GOOD", price: 950, marketPrice: 1600, stock: 15 },
    }),
    prisma.sparePart.create({
      data: { workshopId: workshops[4].id, name: "Disc Brake Rotor - Honda City", vehicleType: "4-Wheeler", brand: "Honda", condition: "REFURBISHED", price: 2800, marketPrice: 5200, stock: 7 },
    }),
  ]);

  console.log("  Created spare parts");

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

  // --- Part Orders ---
  const orderStatuses = [
    "DELIVERED", "CONFIRMED", "SHIPPED", "PENDING", "DELIVERED",
    "RETURNED", "CONFIRMED", "SHIPPED",
  ] as const;

  const paymentStatuses = [
    "PAID", "ESCROW", "COD", "PAID", "PAID",
    "REFUNDED", "COD", "PAID",
  ] as const;

  for (let i = 0; i < 8; i++) {
    const part = parts[i % parts.length];
    const buyer = riders[i % riders.length];

    const subtotal = part.price;
    const gst = Math.round(subtotal * 0.18);

    await prisma.partOrder.create({
      data: {
        displayId: `ORD-${10234 + i}`,
        partId: part.id,
        buyerId: buyer.id,
        workshopId: part.workshopId,
        quantity: 1,
        unitPrice: part.price,
        subtotal,
        gstAmount: gst,
        totalAmount: subtotal + gst,
        orderStatus: orderStatuses[i],
        paymentStatus: paymentStatuses[i],
      },
    });
  }

  console.log("  Created orders");

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
