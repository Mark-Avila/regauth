import { Document, model, Schema } from "mongoose";

export interface IAccount extends Document {
  fname: string;
  lname: string;
  email: string;
  bday: string;
  contact: string;
  sex: boolean;
  password: string;
}

const AccountSchema = new Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

const Account = model<IAccount>("users", AccountSchema);
export default Account;
