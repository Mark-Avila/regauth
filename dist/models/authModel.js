"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AccountSchema = new mongoose_1.Schema({
    fname: {
        type: String,
        required: [true, "fname input missing"],
    },
    lname: {
        type: String,
        required: [true, "lname input missing"],
    },
    email: {
        type: String,
        required: [true, "email input missing"],
    },
    bday: {
        type: String,
        required: [true, "bday input missing"],
    },
    contact: {
        type: String,
        required: [true, "contact input missing"],
    },
    sex: {
        type: Number,
        required: [true, "sex input missing"],
    },
    password: {
        type: String,
        required: [true, "password input missing"],
    },
}, {
    timestamps: true,
});
const Account = (0, mongoose_1.model)("users", AccountSchema);
exports.default = Account;
