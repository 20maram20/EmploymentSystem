import c from "./connection.js";
import { validationResult } from 'express-validator';

function get(_req, res)  {

    c.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        connection.query('SELECT * from user', (err, rows) => {
            connection.release() // return the connection to pool

            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

        })
    })
}

function getbyid (req, res)  {

    c.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        connection.query('SELECT * from user WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

        })
    })
}

function deleteUser (req, res)  {

    c.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        connection.query('DELETE from user WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool

            if(!err) {
                res.send(`user with the Record ID: ${[req.params.id]} has been removed.`)
            } else {
                console.log(err)
            }

        })
    })
}


function post(req, res)  {
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

    c.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

    
        const params = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            status: req.body.status,


          };
      

        connection.query('INSERT INTO user SET ?', params , (err, rows) => {
            connection.release() // return the connection to pool

            if(!err) {
                res.send(`user with the name: ${params.name} has been added.`)
            } else {
                console.log(err)
            }

        })

        console.log(req.body)
    })
}


function put(req, res) {

   c.getConnection((err, connection) => {
       if(err) throw err
       console.log(`connected as id ${connection.threadId}`)

        const { name,password, email, phone, status,type,id } = req.body

        const query='UPDATE user SET name = ?, email = ?, password = ?, phone = ?, status = ? , type = ? WHERE id = ?'
        
           const values = [name, email, password, phone, status, type, id];

           connection.query(query, values, (err, result) => {
             connection.release();                  
       
            if(!err) {
                res.send(`user with the name: ${name} has been added.`)
            } else {
                console.log(err)
            }

        })

        console.log(req.body)
    })
}

//filter jobs by USER 
function filterbyname (req, res)  {

    c.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)
        connection.query('SELECT * from user WHERE name = ?', [req.params.name], (err, rows) => {
            connection.release() // return the connection to pool
            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

        })
    })
} 

export  { get, getbyid, post, put, deleteUser,filterbyname };




