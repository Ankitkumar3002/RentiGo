// Run with: npm run seed
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Vehicle from "../models/Vehicle.js";
import PricingPlan from "../models/PricingPlan.js";

dotenv.config();

const seed = async () => {
  await connectDB();
  await Promise.all([User.deleteMany(), Vehicle.deleteMany(), PricingPlan.deleteMany()]);

  const admin = await User.create({
    name: "Platform Admin", email: "admin@rentigo.com",
    phone: "+919800000000", password: "Admin@1234", role: "admin",
  });

  const agency = await User.create({
    name: "SpeedRent Kolkata", email: "agency@speedrent.com",
    phone: "+919800000001", password: "Agency@1234", role: "agency",
  });

  const customer = await User.create({
    name: "Riya Sharma", email: "riya@email.com",
    phone: "+919800000002", password: "Customer@1234", role: "customer",
  });

  const vehicle1 = await Vehicle.create({
    agency: agency._id, regNumber: "WB-01-AB-1234",
    brand: "Maruti", model: "Swift VXI", year: 2022,
    type: "4-wheeler", fuelType: "petrol", transmission: "manual",
    city: "Kolkata", depot: "Kolkata South depot",
    status: "available", isApproved: true,
    photos: ["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80"],
  });
  await PricingPlan.create({ vehicle: vehicle1._id, daily: 1200, weekly: 7000, monthly: 24000 });

  const vehicle2 = await Vehicle.create({
    agency: agency._id, regNumber: "WB-02-CD-5678",
    brand: "Honda", model: "City", year: 2023,
    type: "4-wheeler", fuelType: "petrol", transmission: "automatic",
    city: "Kolkata", depot: "Kolkata Central depot",
    status: "available", isApproved: true,
    photos: ["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80"],
  });
  await PricingPlan.create({ vehicle: vehicle2._id, daily: 2000, weekly: 12000, monthly: 40000 });

  const bike1 = await Vehicle.create({
    agency: agency._id, regNumber: "WB-03-EF-9012",
    brand: "Royal Enfield", model: "Classic 350", year: 2021,
    type: "2-wheeler", fuelType: "petrol", transmission: "manual",
    city: "Kolkata", depot: "Kolkata North depot",
    status: "available", isApproved: true,
    photos: ["https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80"],
  });
  await PricingPlan.create({ vehicle: bike1._id, daily: 800, weekly: 4500, monthly: 15000 });

  const bike2 = await Vehicle.create({
    agency: agency._id, regNumber: "WB-04-GH-3456",
    brand: "Honda", model: "Activa 6G", year: 2022,
    type: "2-wheeler", fuelType: "petrol", transmission: "automatic",
    city: "Kolkata", depot: "Kolkata South depot",
    status: "available", isApproved: true,
    photos: ["https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80"],
  });
  await PricingPlan.create({ vehicle: bike2._id, daily: 400, weekly: 2500, monthly: 8000 });

  console.log("Seed complete:");
  console.log(`  Admin    -> ${admin.email} / Admin@1234`);
  console.log(`  Agency   -> ${agency.email} / Agency@1234`);
  console.log(`  Customer -> ${customer.email} / Customer@1234`);

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => { console.error(err); process.exit(1); });
