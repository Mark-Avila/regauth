import { Request, Response, Router } from "express";
import {
  getUser,
  loginUser,
  registerUser,
} from "../controllers/authController";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

export { router as authRouter };
