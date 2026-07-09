import mongoose from "mongoose";
import User from "../models/User.js";
import Vehicle from "../models/Vehicle.js";
import PricingPlan from "../models/PricingPlan.js";

const seedData = async () => {
  const count = await Vehicle.countDocuments();
  if (count > 0) return;
  console.log("Seeding initial data...");
  const agency = await User.create({ name: "Luxury Rentals", email: "agency@lux.com", phone: "+12345", password: "Agency@123", role: "agency" });
  
  const v1 = await Vehicle.create({ agency: agency._id, regNumber: "LUX-001", brand: "Mercedes-Benz", model: "S-Class", year: 2023, type: "4-wheeler", fuelType: "petrol", transmission: "automatic", city: "New York", depot: "Downtown", status: "available", isApproved: true, photos: ["/lux_car.png"] });
  await PricingPlan.create({ vehicle: v1._id, daily: 5000, weekly: 30000, monthly: 100000 });
  
  const v2 = await Vehicle.create({ agency: agency._id, regNumber: "LUX-002", brand: "Porsche", model: "911 Carrera", year: 2024, type: "4-wheeler", fuelType: "petrol", transmission: "automatic", city: "New York", depot: "Airport", status: "available", isApproved: true, photos: ["/lux_car.png"] });
  await PricingPlan.create({ vehicle: v2._id, daily: 8000, weekly: 50000, monthly: 150000 });
};

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("MONGO_URI is not defined in environment variables. Please set it in your .env file.");
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    
    await seedData();
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
