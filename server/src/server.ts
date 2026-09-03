// import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";




const PORT = env.PORT || 5001;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Application startup failed", err);
  process.exit(1);
});
