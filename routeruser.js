import express from "express";
import { check } from 'express-validator';

import { get, getbyid, post, put, deleteUser,filterbyname } from "./manageusers.js";

const router = express.Router(); 

router.post(
   "",

   [
      check("email").notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
      check("password").isLength({min:6}).withMessage('Password should be at least 6 characters'),
      check("phone").isInt().withMessage('Phone should be a number').isLength({min:6}).withMessage('Phone should be at least 6 digits'),
], post);

router.delete("/:id",deleteUser);

router.put("/:id", put);

router.get("/", get);
router.get("/:name", filterbyname);

router.get("/:id",getbyid);


export default router;