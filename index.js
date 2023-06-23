import express from "express";
import bodyParser from "body-parser";
import users from "./routeruser.js";
import qualifications from "./routerqualiffication.js";

import login from "./routerlogin.js";
import job from "./routerjobs.js";
import session from "express-session";

const port = process.env.PORT || 8000

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
    secret: "key",
    resave: false,
    saveUninitialized: true
  }));

app.use("/users", users);
app.use("/login", login);
app.use("/job", job);
app.use("/qualifications",qualifications );




app.listen(port, () => console.log(`Listen on port ${port}`))