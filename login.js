import c from "./connection.js";
import { validationResult } from 'express-validator';
import session from "express-session";


function postlogin(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    c.getConnection((err, connection) => {
      if (err) throw err;
      console.log(`connected as id ${connection.threadId}`);
  
      connection.query(
        "SELECT * FROM user WHERE email = ? AND password = ?",
        [email, password],
        (err, rows) => {
          connection.release(); // return the connection to pool
          if (err) {
            console.log(err);
            return res.status(500).json({ errors: [{ msg: "Internal Server Error" }] });
          }
          if (rows.length === 0) {
            return res.status(404).json({
              errors: [{ msg: "Email or password not found!" }],
            });
          }
        //  else if (admin[0].role == "1") {
        //     return res.status(404).json({
        //       errors: [{ msg: "you are user" }],
        //     });
        //   }
          //req.sessionID = rows[0].id;

          //return res.json(rows[0]);

          if (rows[0].type == "1") {
            req.session.admin = true;
            return res.status(200).json({
              message: "You are admin",
              user: rows[0],
            });
          } else {
            req.session.admin = false;
            return res.status(200).json({
              message: "You are user",
              user: rows[0],
            });

        }
    });
    });
  }



  function postlogout(req, res) 
    {

    request.session.destroy();

    //response.redirect("/");

};
  
export  { postlogin,postlogout };
