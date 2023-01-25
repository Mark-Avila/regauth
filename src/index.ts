require("dotenv").config();
import express from "express";
import connect from "./config/db";
import { authRouter } from "./routes/authRoute";
import errorHandler from "./middleware/errorMiddleware";
const cors = require("cors");

const PORT = process.env.PORT || 8080;

const app = express();

connect();

app.use(cors());

app.use(express.static("public"));

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "http://localhost:8000/api/register"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", authRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
