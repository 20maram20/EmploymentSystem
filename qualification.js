import c from "./connection.js";

function get(_req, res)  {

    c.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        connection.query('SELECT * from qualifications', (err, rows) => {
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

        connection.query('SELECT * from qualifications WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

        })
    })
}

function deletequalification (req, res)  {

    c.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        connection.query('DELETE from qualifications WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool

            if(!err) {
                res.send(`qualifications with the Record ID: ${[req.params.id]} has been removed.`)
            } else {
                console.log(err)
            }

        })
    })
}


function post(req, res)  {
    c.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

    
        const params = {
            description: req.body.description,

          };
      

        connection.query('INSERT INTO qualifications SET ?', params , (err, rows) => {
            connection.release() // return the connection to pool

            if(!err) {
                res.send(`qualifications has been added.`)
            } else {
                console.log(err)
            }

        })

        console.log(req.body)
    })
}

function put(req, res) {
    const { id } = req.params; // Get the ID from the request parameters
    const { description } = req.body; // Get the description from the request body
  
    // Get a connection from the pool
    c.getConnection((err, connection) => {
      if (err) throw err;
      console.log(`connected as id ${connection.threadId}`);
  
      const query = 'UPDATE qualifications SET description = ? WHERE id = ?'; // Add the SET keyword and description placeholder to the query
  
      const values = [description, id];
  
      connection.query(query, values, (err, result) => {
        connection.release();
  
        if (!err) {
          res.send(`Qualification with ID ${id} has been updated.`); // Send a success message with the updated ID
        } else {
          console.log(err);
          res.status(500).send('An error occurred while updating the qualification.'); // Send an error message if the query fails
        }
      });
    });
  }
  

export  { get, getbyid, post, put, deletequalification };




