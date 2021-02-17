const express= require("express");
const app = express();
const port = 5000;
const cors = require('cors');
const conn = require('./db/dbconn');

//middleware
app.use(cors());
app.use(express.json());

//Routes

app.post('/login',(req,res)=>{
    var empid = req.body.employee_id;
    var pass = req.body.pass;
    try{
        conn.query('SELECT * FROM employee WHERE employee_id = ? LIMIT 1',[empid],(err, result)=>{
            if(err)   
                res.json({
                    success : false,
                    message : 'ERROR FETCHING DATA'
                });

            if(result.length == 0)
                res.json({
                    success : false,
                    message : 'No such user,Check your id or contact Admin'
                });
        
            if(result && result.length == 1){              
                if(result[0].password == pass)
                    res.json({
                        success : true,
                        message : 'Login success'
                    });
                else
                    res.json({
                        success : false,
                        message : 'Incorrect password, try again'
                    });
            }
        });
    }
    catch(err){
        console.log(err)
    }
});


app.listen(port, ()=>{

    console.log("Server started on port : "+port);
});