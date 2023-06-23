import express from "express";


import { get, getbyid, post, put, deletequalification,} from "./qualification.js";

const router = express.Router(); 


router.post("", post);


router.delete("/:id",deletequalification);

router.put("/:id", put);

router.get("/", get);
router.get("/:id", getbyid);




export default router;