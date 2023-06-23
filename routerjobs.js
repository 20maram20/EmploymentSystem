import express from "express";
import { check } from 'express-validator';


import {getJobWithQualifications, get ,post, put, deletejob,filterbypostion,postjobreq, getdate_postedofuserreq, getHistoryOfJobSearch, accept } from "./job.js";

const router = express.Router(); 


router.post(
    "",

    [
       check("position").isString().withMessage('position is required'),
       check("description").isString().withMessage('description is required'),
       check("offer").isInt().withMessage('offer should be a number'),
 ], post);

router.post(
  "/:id",
  [
    check("IDUser")
      .isInt()
      .withMessage("IDUser is required"),
      check("IDUser").isInt().withMessage("User id is required"),

  ],
  postjobreq
);


router.post("/jobresponse/:id",accept);
router.get("/:IDUser", getdate_postedofuserreq);
router.get("/jobrelated/:user_id", getHistoryOfJobSearch);
router.get("/jobId", getJobWithQualifications);




router.delete("/:id",deletejob);

router.put("/:id", put);

router.get("/", get);

router.get("/:position",filterbypostion);


export default router;