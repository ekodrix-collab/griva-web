require("dotenv").config();
const app = require("./app");
const User = require("./models/User");

const { testDbConnection, sequelize } = require("./config/db");

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  await testDbConnection();

  if (process.env.DB_SYNC === "true") {
    try {
      // Safely alter the ENUM role type in PostgreSQL if it exists
      try {
        await sequelize.query("ALTER TYPE \"enum_Users_role\" ADD VALUE IF NOT EXISTS 'staff'");
        console.log("🟢 [DATABASE]: Altered role ENUM type if PostgreSQL to support 'staff'");
      } catch (enumErr) {
        console.log("ℹ️ [DATABASE]: Skipping raw ENUM alteration (type may not exist or not PostgreSQL):", enumErr.message);
      }

      // Safely add printing tracking columns to Orders table if they don't exist
      try {
        await sequelize.query("ALTER TABLE \"Orders\" ADD COLUMN IF NOT EXISTS is_printed BOOLEAN DEFAULT false;");
        await sequelize.query("ALTER TABLE \"Orders\" ADD COLUMN IF NOT EXISTS printed_at TIMESTAMP WITH TIME ZONE;");
        await sequelize.query("ALTER TABLE \"Orders\" ADD COLUMN IF NOT EXISTS checkout_token VARCHAR(255);");
        console.log("🟢 [DATABASE]: Added is_printed, printed_at and checkout_token columns to Orders table");
      } catch (printColErr) {
        console.log("ℹ️ [DATABASE]: Skipping raw Orders column addition:", printColErr.message);
      }

      console.log("[DATABASE]: Syncing schemas...");
      await sequelize.sync();
      console.log("🟢 [DATABASE]: Schemas synced successfully.");
    } catch (err) {
      console.error(
        "🔴 [DATABASE]: Schema sync failed:",
        err.message
      );
      process.exit(1);
    }
  }

  // ✅ Run after sync
  await createDefaultAdmin();

  const server = app.listen(PORT, () => {
    console.log(
      `🚀 [GriVA Backend] Server is running on port ${PORT}`
    );
  });
};

const createDefaultAdmin = async () => {
  const existingAdmin = await User.findOne({
    where: {
        email: process.env.ADMIN_EMAIL,
    },
  });

  if (!existingAdmin) {
    await User.create({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: "admin",
    });

    console.log("✅ Default admin created");
  }
};

startServer(); // trigger nodemon restart



