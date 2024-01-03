import express from "express";
import * as dotenv from "dotenv";
import pgPromise from "pg-promise";
import userRoutes from "./routes/User.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

const cn = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Adjust this based on your server's configuration
  },
};

// Create Database Connection
const pgp = pgPromise({});
const db = pgp(cn);

db.connect()
  .then((obj) => {
    console.log("Connected to database");
    obj.done(); // success, release connection;
  })
  .catch((error) => {
    console.error("ERROR:", error.message);
  });

app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use("/api/users", userRoutes);

app.listen(PORT, () => console.log(`Server listening to port ${PORT}`));
