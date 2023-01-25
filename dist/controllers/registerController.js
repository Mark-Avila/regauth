"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const registerModel_1 = __importDefault(require("../models/registerModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const validatePassword = (password, inputs) => {
    const { fname, lname, email, bday, contact } = inputs;
    const modEmail = email.replace(/@.*$/, "");
    const matches = [];
    const regexList = {
        "First name": `^((?!${fname}).)*$`,
        "Last name": `^((?!${lname}).)*$`,
        Email: `^((?!${modEmail}).)*$`,
        Contact: `^((?!${contact}).)*$`,
    };
    const listKeys = Object.keys(regexList);
    listKeys.forEach((key) => {
        const regexCheck = new RegExp(regexList[key]);
        if (!regexCheck.test(password)) {
            matches.push(key);
        }
    });
    return matches;
};
const validateEmail = (email) => {
    const emailRegex = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$");
    return emailRegex.test(email);
};
const validateContact = (contact) => /^[0-9]{11}$/.test(contact);
exports.registerUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const keys = [
        "fname",
        "lname",
        "email",
        "bday",
        "contact",
        "sex",
        "password",
    ];
    keys.forEach((key) => {
        if (!data[key]) {
            res.status(404);
            throw Error(`${key} input is missing`);
        }
    });
    const { fname, lname, contact, bday, email, password } = data;
    if (yield registerModel_1.default.findOne({ email })) {
        res.status(400);
        throw Error("User already exists");
    }
    if (!validateEmail(email)) {
        res.status(400);
        throw Error("Email is invalid");
    }
    if (!validateContact(contact)) {
        res.status(400);
        throw Error("Philippine contact number is invalid");
    }
    const passwordMatches = validatePassword(password, {
        fname,
        lname,
        email,
        bday,
        contact,
    });
    if (passwordMatches.length > 0) {
        res.status(400);
        throw Error(`Password is too similar with other inputs: ${passwordMatches.map((match) => match)}`);
    }
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashed = yield bcrypt_1.default.hash(password, salt);
    const newUser = yield registerModel_1.default.create({
        fname: data.fname,
        lname: data.lname,
        password: hashed,
        email: data.email,
        bday: data.bday,
        contact: data.contact,
        sex: data.sex,
    });
    if (newUser) {
        res.status(201).json({
            status: "success",
            code: 201,
            message: `Successfully created account for ${email}`,
        });
    }
    else {
        res.status(400).json({
            status: "failed",
            code: 400,
            message: `Error occured during registration`,
        });
    }
}));
