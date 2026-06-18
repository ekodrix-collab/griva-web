// FEATURE: Delivery Boy System
// Run: node seed-delivery-boys.js
// Creates test delivery boy accounts in the database

require("dotenv").config();
const User = require("./src/models/User");
const { sequelize } = require("./src/config/db");

async function seedDeliveryBoys() {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connected.");

    // Sync in case new enum hasn't been applied
    await sequelize.sync({ alter: true });

    const drivers = [
      { name: "Mohammed Driver", email: "driver1@griva.qa", password: "driver123", role: "delivery" },
      { name: "Ali Delivery", email: "driver2@griva.qa", password: "driver123", role: "delivery" },
    ];

    for (const d of drivers) {
      const existing = await User.scope("withPassword").findOne({ where: { email: d.email } });
      if (existing) {
        console.log(`⏭️  ${d.email} already exists (ID: ${existing.id})`);
      } else {
        const user = await User.create(d);
        console.log(`✅ Created delivery boy: ${d.name} (ID: ${user.id}, email: ${d.email}, password: ${d.password})`);
      }
    }

    console.log("\n🎉 Done! Delivery boy accounts ready.");
    console.log("Login credentials:");
    console.log("  Email: driver1@griva.qa / Password: driver123");
    console.log("  Email: driver2@griva.qa / Password: driver123");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

seedDeliveryBoys();
