const { Sequelize } = require("sequelize");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is missing.");
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Required for Azure SSL handshake
    },
  },
  pool: {
    max: 10,       // Max persistent connections in pool (Azure friendly)
    min: 2,
    acquire: 30000,
    idle: 10000,
  },
});

// Test database connection helper
const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("[Database] Connected successfully to Azure PostgreSQL (Doha Region).");
  } catch (error) {
    console.error("[Database] Connection failed:", error);
  }
};

module.exports = {
  sequelize,
  testDbConnection,
};
