"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const registerRoute_1 = require("./routes/registerRoute");
const errorMiddleware_1 = __importDefault(require("./middleware/errorMiddleware"));
const cors = require("cors");
const PORT = process.env.PORT || 8080;
const app = (0, express_1.default)();
(0, db_1.default)();
app.use(cors());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:8000/api/register");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
    next();
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use("/api", registerRoute_1.registerRouter);
app.use(errorMiddleware_1.default);
app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});
