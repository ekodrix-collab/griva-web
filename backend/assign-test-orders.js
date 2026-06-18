// FEATURE: Delivery Boy System
// Run: node assign-test-orders.js
// Assigns some seeded orders to the created drivers for instant dashboard testing

require("dotenv").config();
const Order = require("./src/models/Order");
const User = require("./src/models/User");
const { sequelize } = require("./src/config/db");

async function assignOrders() {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connected.");

    // Find the delivery boys
    const driver1 = await User.findOne({ where: { email: "driver1@griva.qa" } });
    const driver2 = await User.findOne({ where: { email: "driver2@griva.qa" } });

    if (!driver1 || !driver2) {
      console.error("❌ Drivers not found. Run seed-delivery-boys.js first.");
      process.exit(1);
    }

    // Find first few orders
    const orders = await Order.findAll({ limit: 4 });
    if (orders.length === 0) {
      console.error("❌ No orders found. Run seed.js first.");
      process.exit(1);
    }

    // Assign Order 1 to Driver 1 (assigned)
    if (orders[0]) {
      orders[0].delivery_boy_id = driver1.id;
      orders[0].status = "assigned";
      orders[0].assigned_at = new Date();
      await orders[0].save();
      console.log(`✅ Assigned Order #${orders[0].id} (${orders[0].order_number}) to ${driver1.name} (Status: assigned)`);
    }

    // Assign Order 2 to Driver 1 (out_for_delivery)
    if (orders[1]) {
      orders[1].delivery_boy_id = driver1.id;
      orders[1].status = "out_for_delivery";
      orders[1].assigned_at = new Date();
      await orders[1].save();
      console.log(`✅ Assigned Order #${orders[1].id} (${orders[1].order_number}) to ${driver1.name} (Status: out_for_delivery)`);
    }

    // Assign Order 3 to Driver 2 (assigned)
    if (orders[2]) {
      orders[2].delivery_boy_id = driver2.id;
      orders[2].status = "assigned";
      orders[2].assigned_at = new Date();
      await orders[2].save();
      console.log(`✅ Assigned Order #${orders[2].id} (${orders[2].order_number}) to ${driver2.name} (Status: assigned)`);
    }

    console.log("\n🎉 Done! Ready to test Griva delivery dashboard.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

assignOrders();
