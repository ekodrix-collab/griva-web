require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`[GriVA Backend] Server is running on port ${PORT}`);
});

// Handle graceful shutdowns
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});
