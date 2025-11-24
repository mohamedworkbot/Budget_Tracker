// Quick MongoDB Connection Test
require("dotenv").config();
const mongoose = require("mongoose");

console.log("Testing MongoDB connection...");
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
console.log("MONGO_URI length:", process.env.MONGO_URI?.length || 0);

if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is not defined in .env file");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
    console.log("Database:", mongoose.connection.name);
    mongoose.connection.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed!");
    console.error("Error:", err.message);
    console.log("\nCommon issues:");
    console.log("1. Check if MONGO_URI is correct in .env file");
    console.log("2. Verify MongoDB Atlas cluster is running");
    console.log("3. Check Network Access in MongoDB Atlas (allow 0.0.0.0/0)");
    console.log("4. Verify username and password are correct");
    console.log("5. URL encode special characters in password (@ → %40)");
    process.exit(1);
  });


