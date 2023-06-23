import c from "./connection.js";
import { validationResult } from 'express-validator';

function get(_req, res)  {

    c.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        connection.query('SELECT * from job', (err, rows) => {
            connection.release() // return the connection to pool

            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

        })
    })
}

// function getbyid (req, res)  {

//     c.getConnection((err, connection) => {
//         if(err) throw err
//         console.log(`connected as id ${connection.threadId}`)

//         connection.query('SELECT * from user WHERE id = ?', [req.params.id], (err, rows) => {
//             connection.release() // return the connection to pool
//             if(!err) {
//                 res.send(rows)
//             } else {
//                 console.log(err)
//             }

//         })
//     })
// }

function deletejob (req, res)  {

    c.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        connection.query('DELETE from job WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool

            if(!err) {
                res.send(`job with the Record ID: ${[req.params.id]} has been removed.`)
            } else {
                console.log(err)
            }

        })
    })
}

function post(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  c.getConnection((err, connection) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Internal server error.');
    }

    console.log(`connected as id ${connection.threadId}`);

    const params = {
      position: req.body.position,
      description: req.body.description,
      offer: req.body.offer,
      max_can_no: req.body.max_can_no,
    };

    connection.query('INSERT INTO job SET ?', params, (err, rows) => {
      connection.release();

      if (err) {
        console.log(err);
        return res.status(500).send('Internal server error.');
      }

      res.send(`job with the position: ${params.position} has been added.`);
    });

    console.log(req.body);
  });
}


function put(req, res) {
    c.getConnection((err, connection) => {
      if (err) throw err;
      console.log(`connected as id ${connection.threadId}`);
  
      const { position, description, offer, max_can_no, id } = req.body;
  
      const query =
        "UPDATE job SET position = ?, description = ?, offer = ?, max_can_no = ? WHERE id = ?";
      const values = [position, description, offer, max_can_no, id];
  
      connection.query(query, values, (err, result) => {
        connection.release();
  
        if (!err) {
          res.send(`Job with the position: ${position} has been updated.`);
        } else {
          console.log(err);
        }
      });
    });
  }
  

//filter jobs  
function filterbypostion (req, res)  {

    c.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)
        connection.query('SELECT * from job WHERE position = ?', [req.params.position], (err, rows) => {
            connection.release() // return the connection to pool
            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

        })
    })
} 


//function send request it might work i need to build db first
//dont forget too ad mwauth when i call it in routes
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  function postjobreq(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    c.getConnection((err, connection) => {
      if (err) throw err;
      console.log(`connected as id ${connection.threadId}`);
  
      // Check if job exists
      connection.query('SELECT * FROM job WHERE id = ?', [req.params.id], (err, job) => {
        if (err) {
          connection.release();
          return res.status(500).json({ msg: "Server errokkr!" });
        }
  
        if (!job[0]) {
          connection.release();
          return res.status(404).json({ msg: "Job not found!" });
        }
  
        // Prepare job request object
        const reqjob = {
          IDUser: req.body.IDUser,
          IDJop: job[0].id,
          histroyReq: new Date().toString()
        };
        console.log(reqjob);
  
        // Insert job request
        connection.query('INSERT INTO requser SET ?', reqjob, (err, result) => {
          connection.release(); // return the connection to pool
          if (!err) {
            res.send(`Request for job with position "${job[0].position}" has been added.`);
          } else {
            console.log(err);
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
              return res.status(400).json({ msg: "Invalid user or job ID!" });
            } else {
              return res.status(500).json({ msg: "Server error!" });
            }
          }
        });
      });
    });
  }
  








 function getdate_postedofuserreq(req, res)  {

        c.getConnection((err, connection) => {
            if(err) throw err
            console.log(`connected as id ${connection.threadId}`)
    
            connection.query('SELECT * FROM requser WHERE IDUser =?',[req.params.IDUser], (err, rows) => {
                connection.release() // return the connection to pool
    
                if(!err) {
                    res.send(rows)
                } else {
                    console.log(err)
            }
    
            })
        })
    }









    function getHistoryOfJobSearch(req, res) {
        c.getConnection((err, connection) => {
          if (err) throw err;
          console.log(`connected as id ${connection.threadId}`);
      
          connection.query('SELECT * FROM joprelatedapplicant WHERE user_id = ?', [req.params.user_id], (err, rows) => {
            connection.release(); // return the connection to pool
      
            if (!err) {
              res.send(rows);
            } else {
              console.log(err);
              res.status(500).json({ msg: "Server error!" });
            }
          });
        });
      }
      





      function accept(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
      
        c.getConnection((err, connection) => {
          if (err) throw err;
          console.log(`connected as id ${connection.threadId}`);
      
          // Check if job exists
          connection.query('SELECT * FROM requser WHERE id = ?', [req.params.id], (err, requser) => {
            if (err) {
              connection.release();
              return res.status(500).json({ msg: "Server errokkr!" });
            }
      
            if (!requser[0]) {
              connection.release();
              return res.status(404).json({ msg: "Job not found!" });
            }
      
            // Prepare job request object
            const reqjob = {
              message: req.body.message,
              id_request: requser[0].id,
            };
            console.log(reqjob);
      
            // Insert job request
            connection.query('INSERT INTO requstreplays SET ?', reqjob, (err, result) => {
              connection.release(); // return the connection to pool
              if (!err) {
                res.send(`message has been added.`);
              } else {
                console.log(err);
                if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                  return res.status(400).json({ msg: "Invalid user or job ID!" });
                } else {
                  return res.status(500).json({ msg: "Server error!" });
                }
              }
            });
          });
        });
      }
      
    


      function getJobWithQualifications(jobId, callback) {
        // Get a connection from the pool
        c.getConnection((err, connection) => {
          if (err) throw err;
          console.log(`connected as id ${connection.threadId}`);
      
          // Construct SQL query
          const sql = `SELECT j.position, j.description, q.description as qualification
                       FROM job j
                       JOIN riation_between_jop_qulification r ON j.id = r.id_jop
                       JOIN qualifications q ON r.id_qualification = q.id
                       WHERE j.id = ?`;
      
          // Execute SQL query using the existing database connection
          connection.query(sql, [jobId], (err, results) => {
            connection.release(); // Return the connection to the pool
      
            if (err) {
              callback(err, null);
            } else if (results.length == 0) {
              callback(null, null);
            } else {
              // Loop through each row and add its qualification to an array
              const job = results[0];
              const qualifications = [];
              results.forEach(row => {
                qualifications.push(row.qualification);
              });
      
              // Add the array of qualifications to the job object
              job.qualifications = qualifications;
      
              callback(null, job);
            }
          });
        });
      }
      



      

    //   function getJobsWithQualifications(req, res) {
    //     const jobId = req.params.id;
        
    //     c.getConnection((err, connection) => {
    //       if (err) throw err;
    //       console.log(`connected as id ${connection.threadId}`);
      
    //       // Get job with specified ID
    //       connection.query('SELECT * FROM job WHERE id = ?', [jobId], (err, job) => {
    //         if (err) {
    //           connection.release();
    //           console.log(err);
    //           return res.status(500).json({ msg: "Server error!" });
    //         }
      
    //         if (!job[0]) {
    //           connection.release();
    //           console.log(`Job with ID ${jobId} not found`);
    //           return res.status(404).json({ msg: "Job not found!" });
    //         }
      
    //         // Get qualifications for the job
    //         connection.query('SELECT q.* FROM qualification q INNER JOIN riation_between_jop_qulification r ON q.id = r.id_qualification WHERE r.id_jop = ?', [jobId], (err, qualifications) => {
    //           connection.release(); // return the connection to pool
    //           if (err) {
    //             console.log(err);
    //             return res.status(500).json({ msg: "Server error!" });
    //           }
      
    //           // Return job with qualifications
    //           const jobWithQualifications = {
    //             id: job[0].id,
    //             position: job[0].position,
    //             description: job[0].description,
    //             qualifications: qualifications
    //           };
    //           console.log(jobWithQualifications);
    //           res.json(jobWithQualifications);
    //         });
    //       });
    //     });
    //   }  
      





export  {getJobWithQualifications, get,post, put,accept, deletejob,filterbypostion,postjobreq,getdate_postedofuserreq,getHistoryOfJobSearch };



