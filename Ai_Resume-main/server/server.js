const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const connectToMongo = require("./config/resumedb");
const { errorHandler } = require("./utils/errorHandler");
const resumeRoutes = require("./routes/resumeRoutes");
const resumeRoutes1 = require("./routes/resumeRoutes1");
const temp2Routes =require("./routes/temp2Routes");
const routerTemp3 = require("./routes/resumeRoutesTemp3");
const temp4Routes = require("./routes/temp4Routes");
const temp5Routes = require("./routes/temp5Routes");
const temp6Routes = require("./routes/temp6Routes");
const temp7Routes = require("./routes/temp7Routes");
const temp8Routes = require("./routes/temp8Routes");
const temp9Routes = require("./routes/temp9Routes");
const authRoutes = require('./routes/auth');
const myTempRoute=require("./routes/myRoute")
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("dev"));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "public")));

// ✅ Register Resume Routes with distinct paths
app.use("/api/resume", resumeRoutes);
app.use("/api/resume1", resumeRoutes1);
app.use("/api/temp2", temp2Routes);
app.use("/api/temp3", routerTemp3);
app.use("/api/temp4", temp4Routes);
app.use("/api/temp5", temp5Routes); 
app.use("/api/resume6", temp6Routes);
app.use("/api/resume7", temp7Routes);
app.use('/api/auth', authRoutes);
app.use("/api/resume8", temp8Routes);
app.use("/api/resume9", temp9Routes);
app.use("/api/myTemp", myTempRoute);


// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Error handling middleware
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    await connectToMongo(); // ✅ Ensure MongoDB is connected before starting the server

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
  console.error("❌ Unhandled Rejection:", error);
  process.exit(1);
});

startServer();