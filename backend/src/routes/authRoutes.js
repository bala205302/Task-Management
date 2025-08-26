import express from "express";
import { body } from "express-validator";
import { login, register } from "../controllers/authController.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("name").isString().trim().notEmpty(),
    body("email").isEmail().normalizeEmail(),
    body("mobileNumber").isString().trim().notEmpty(),
    body("password").isString().isLength({ min: 6 }),
    body("county").isString().trim().notEmpty(),
    body("city").isString().trim().notEmpty(),
    body("state").isString().trim().notEmpty(),
    body("gender").isIn(["male", "female", "other"]),
  ],
  register
);

router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").isString().notEmpty()],
  login
);

export default router;


