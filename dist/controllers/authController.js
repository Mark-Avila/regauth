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
exports.loginUser = exports.registerUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const authModel_1 = __importDefault(require("../models/authModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const lev = require("fast-levenshtein");
const validatePassword = (password, inputs) => {
    const { fname, lname, email, bday, contact } = inputs;
    const modEmail = email.replace(/@.*$/, "");
    const matches = [];
    const modContact = contact.replace(/-/g, "|");
    const modBday = bday.replace(/-/g, "|");
    const regexList = {
        "First name": `^((?!${fname.toLocaleLowerCase().replace(" ", "")}).)*$`,
        "Last name": `^((?!${lname.toLocaleLowerCase().replace(" ", "")}).)*$`,
        Email: `^((?!${modEmail.toLocaleLowerCase()}).)*$`,
        Birthday: modBday,
        Contact: modContact,
    };
    const listKeys = Object.keys(regexList);
    listKeys.forEach((key) => {
        const regexCheck = new RegExp(regexList[key]);
        let strPassword = password.toString().toLocaleLowerCase();
        if (key === "Contact") {
            if (regexCheck.test(strPassword)) {
                matches.push(key);
            }
        }
        else if (key === "Birthday") {
            const bdayMatches = (strPassword || "").match(RegExp(regexList[key], "g")) || [];
            if (bdayMatches.length >= 2) {
                matches.push(key);
            }
        }
        else if (!regexCheck.test(strPassword)) {
            matches.push(key);
        }
    });
    return matches;
};
const validateEmail = (email) => {
    const emailRegex = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$");
    return emailRegex.test(email);
};
const validateContact = (contact) => /^[0-9]{4}-[0-9]{3}-[0-9]{4}$/.test(contact);
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
    if (yield authModel_1.default.findOne({ email })) {
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
        throw Error(`Password is too similar with other inputs: ${passwordMatches.join(", ")}`);
    }
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashed = yield bcrypt_1.default.hash(password, salt);
    const newUser = yield authModel_1.default.create({
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
        res.status(400);
        throw Error("Error occured during registration");
    }
}));
exports.loginUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        throw Error("Missing input");
    }
    const user = yield authModel_1.default.findOne({ email });
    if (user && (yield bcrypt_1.default.compare(password, user.password))) {
        res.status(200).json({
            status: "success",
            code: 200,
            message: `Successfully logged in with user ${user.fname} ${user.lname}`,
        });
    }
    else {
        res.status(400);
        throw Error("Invalid credentials");
    }
}));
