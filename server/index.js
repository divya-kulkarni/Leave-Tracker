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

app.get('/team',(req,res)=>{
    try{
        conn.query('select employee_name,employee_id,team_name,threshold from employee as e,employee_team as et, team as t where (e.employee_id=et.e_id AND et.t_id = t.team_id )',(err,results)=>{
            if(err)
                console.log(err)
          
            Teams = results.map(x=>({team_name:x.team_name,threshold:x.threshold})); // makes an array of object with team name and threshold
            Teams = [...new Map(Teams.map(item=>[item.team_name,item])).values()] // removes duplicate data
            Teams.forEach(element => (
                element.emp = results.filter(res=>res.team_name == element.team_name).map((i)=>({id: i.employee_id,name:i.employee_name}))
             ));     //adds the list of employee in the particular team
            
            res.send(Teams);
        })
    }
    catch(err)
    {
        console.log(err)
    }
});

app.listen(port, ()=>{

    console.log("Server started on port : "+port);
});