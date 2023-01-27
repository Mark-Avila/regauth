import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Account, { IAccount } from "../models/authModel";
import bcrypt from "bcrypt";

const lev = require("fast-levenshtein");

type UsersRequest = Request<{}, {}, IAccount>;

interface FormInputs {
  fname: string;
  lname: string;
  email: string;
  bday: string;
  contact: string;
}

interface IRegexList {
  "First name": string;
  "Last name": string;
  Email: string;
  Birthday: string;
  Contact: string;
}

interface IPassChecks {
  "one upper case letter": "^(?=.*?[A-Z])$";
  "one lower case letter": "^(?=.*?[a-z])$";
  "one digit character": "^(?=.*?[0-9])$";
  "one special character": "^(?=.*?[#?!@$%^&*-])$";
  "minimum of 8 characters": "^(?=.*?[#?!@$%^&*-])$";
}

const validatePasswordChars = (password: string): string => {
  const passChecks = {
    "one lower case letter": "^.*(?=.*?[a-z]).*$",
    "one upper case letter": "^.*(?=.*?[A-Z]).*$",
    "one digit character": "^.*(?=.*?[0-9]).*$",
    "one special character": "^.*(?=.*?[#?!@$%^&*-]).*$",
    "minimum of 8 characters": "^.{8,}.*$",
  };

  const passCheckKeys = Object.keys(passChecks);
  let returnString = "";

  passCheckKeys.forEach((key) => {
    const regexCheck = new RegExp(passChecks[key as keyof IPassChecks]);

    if (returnString.length === 0) {
      if (!regexCheck.test(password) === true) {
        returnString = key;
      }
    }
  });

  return returnString;
};

const validatePassword = (password: string, inputs: FormInputs): string[] => {
  const { fname, lname, email, bday, contact } = inputs;

  const modEmail = email.replace(/@.*$/, "");
  const matches: string[] = [];

  const modContact = contact.replace(/-/g, "|");
  const modBday = bday.replace(/-/g, "|");

  const regexList: IRegexList = {
    "First name": `^((?!${fname.toLocaleLowerCase().replace(" ", "")}).)*$`,
    "Last name": `^((?!${lname.toLocaleLowerCase().replace(" ", "")}).)*$`,
    Email: `^((?!${modEmail.toLocaleLowerCase()}).)*$`,
    Birthday: modBday,
    Contact: modContact,
  };

  const listKeys = Object.keys(regexList);

  listKeys.forEach((key) => {
    const regexCheck = new RegExp(regexList[key as keyof IRegexList]);

    let strPassword = password.toString().toLocaleLowerCase();

    if (key === "Contact") {
      if (regexCheck.test(strPassword)) {
        matches.push(key);
      }
    } else if (key === "Birthday") {
      const bdayMatches =
        (strPassword || "").match(
          RegExp(regexList[key as keyof IRegexList], "g")
        ) || [];

      if (bdayMatches.length >= 2) {
        matches.push(key);
      }
    } else if (!regexCheck.test(strPassword)) {
      matches.push(key);
    }
  });

  return matches;
};

const validateEmail = (email: string) => {
  const emailRegex = new RegExp(
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
  );

  return emailRegex.test(email);
};

const validateContact = (contact: string) =>
  /^[0-9]{4}-[0-9]{3}-[0-9]{4}$/.test(contact);

export const registerUser = asyncHandler(
  async (req: UsersRequest, res: Response) => {
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
      if (!data[key as keyof IAccount]) {
        res.status(404);
        throw Error(`${key} input is missing`);
      }
    });

    const { fname, lname, contact, bday, email, password } = data;

    const passCharsCheck = validatePasswordChars(password);
    const isPassValid = passCharsCheck.length > 0;

    if (await Account.findOne({ email })) {
      res.status(400);
      throw Error("User already exists");
    }

    if (isPassValid) {
      res.status(400);
      throw Error(`Password must have ${passCharsCheck}`);
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
      throw Error(
        `Password is too similar with other inputs: ${passwordMatches.join(
          ", "
        )}`
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const newUser = await Account.create({
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
    } else {
      res.status(400);
      throw Error("Error occured during registration");
    }
  }
);

export const loginUser = asyncHandler(
  async (req: UsersRequest, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw Error("Missing input");
    }

    const user = await Account.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        status: "success",
        code: 200,
        message: `Successfully logged in with user ${user.fname} ${user.lname}`,
      });
    } else {
      res.status(400);
      throw Error("Invalid credentials");
    }
  }
);
