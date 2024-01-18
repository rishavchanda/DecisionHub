import express from "express";
import * as dotenv from "dotenv";
import userRoutes from "./routes/User.js";
import authRoutes from "./routes/Auth.js";
import ruleRoutes from "./routes/Rule.js";
import bankUserRoutes from "./routes/BankUser.js";
import cors from "cors";
import morgan from "morgan";
import db from "./models/index.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

/** Middlewares */
app.use(express.json());
const corsConfig = {
  credentials: true,
  origin: true,
};
app.use(cors(corsConfig));
app.use(morgan("tiny"));

app.use(express.json());

// db.sequelize.sync({ force: false }).then(() => {
//   console.log("db has been re sync");
// });

// db.sequelize.sync({ alter: true }).then(() => {
//   console.log("Database schema has been updated"); 
// });

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/rule", ruleRoutes);
app.use("/api/bankUser", bankUserRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500; 
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.listen(PORT, () => console.log(`Server listening to port ${PORT}`));
