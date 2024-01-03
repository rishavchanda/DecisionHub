import express from "express";
import * as dotenv from "dotenv";
import userRoutes from "./routes/User.js";
import db from "./models/index.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

// db.sequelize.sync({ force: true }).then(() => {
//   console.log("db has been re sync");
// });

app.use("/api/user", userRoutes);

app.listen(PORT, () => console.log(`Server listening to port ${PORT}`));
