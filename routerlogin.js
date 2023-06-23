import express from "express";
import { check } from 'express-validator';
import { postlogin,postlogout} from "./login.js";


const router = express.Router(); 

 //admin
router.post(
   "",
   [
      check("email").notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
      check("password").isLength({min:6}).withMessage('Password should be at least 6 characters'),
], postlogin);

router.post("/logout", postlogout);


export default router;