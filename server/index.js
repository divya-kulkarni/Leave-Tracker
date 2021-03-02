const express= require("express");
const app = express();
const port = 5000;
const cors = require('cors');
const conn = require('./db/dbconn');
const {differenceInDays,startOfDay,format} = require('date-fns');

//middleware
app.use(cors());
app.use(express.json());

//Routes

/**
 *  use - fetches employee details from the database if the entered id is valid
 * 
 *  returns an object which contains
 *          success : bool stating if login was successful
 *          name : name of employee if login is successful
 *          message :  string decribing success or failure
 *          
 */ 

app.post('/login',(req,res)=>{
    var empid = req.body.employee_id;
    var pass = req.body.pass;
    if(isNaN(empid))
        res.json({
            success : false,
            message : 'No such user,Check your id or contact Admin'
        })
    else {    
        try{
            conn.query('SELECT * FROM employee WHERE employee_id = ? LIMIT 1',[empid],(err, result)=>{
                console.log(result);
                if(err)   
                    res.json({
                        success : false,
                        message : err
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
                            message : 'Login success',
                            name : result[0].employee_name
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
            console.log(err);
        }
    }
});

//Adding leave
/**
 *  Use - adding leave for logged in employee
 *     
 *  returns : insert id of new leave entry
 * 
 */
app.post('/addLeave',(req,res) =>{
    var start_dt= req.body.startDate,
    end_dt=req.body.endDate,
    emp_id=parseInt(req.body.employee_id),
    day_count;
    
    if(start_dt == end_dt || !end_dt){
        day_count=1;
        end_dt=null;
    }
    else{
        day_count = differenceInDays(new Date(end_dt),new Date(start_dt)) +1;
        end_dt=format(startOfDay(new Date(end_dt)),'yyyy-MM-dd');
    }   
    start_dt = format(startOfDay(new Date(start_dt)),'yyyy-MM-dd');
    try{

       conn.query('INSERT INTO leaves (start_date,end_date,leave_count,employee_id) VALUES (?,?,?,?);',[start_dt,end_dt,day_count,emp_id],(err,result)=>{
            if(err)
                console.log(err);
            else{
                
                res.send({data: result.insertId});
            }
        });
    }
    catch(err)
    {
        console.log(err);
    }
});

//Fetch team data and members
/**
 *  Use - fetches team data (team name, threshold, id, employees, employee_id) from the database
 * 
 *  returns : an array of objects, where each object is a team containing team name, id, threshold and list of employees
 */

app.get('/team',(req,res)=>{
    try{
        const queryStmt = "select employee_name,employee_id,team_name,threshold from employee as e,employee_team as et, team as t where (e.employee_id=et.e_id AND et.t_id = t.team_id )";
        conn.query(queryStmt,(err,results)=>{
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

//fetch employee list and leaves
/**
 *  Use - fetches list of employees along with their leaves 
 * 
 *  returns -  array of objects, where each object is an employee and contains name,id,total_leave,list of leaves 
 */

app.get('/employee',(req,res)=>{
    try{
        const queryStmt = "select e.employee_id,employee_name as name,leave_count as count,date_format(start_date,'%Y-%m-%d') as start_date from employee as e,leaves as l where e.employee_id = l.employee_id;select employee_name, employee_id from employee ;"
        conn.query(queryStmt,(err,results)=>{
            if(err){
            
                res.json({
                    success : false,
                    message : 'Error fetching data form db'
                })
                
            }
            if(results[1].length == 0){
            
                res.json({
                    success : false,
                    message : 'No employees'
                })
            }
            if(results[1].length>0){
            
                var employees= results[1].map(emp=>({employee_id:emp.employee_id,name:emp.employee_name,count:0,leaves:[]}));
                employees = [...new Map(employees.map(item=>[item.employee_id,item])).values()]
                results[0].forEach(emp=>{
                    var index = employees.map((e)=>{return e.employee_id}).indexOf(emp.employee_id);
                    employees[index].leaves.push({start_date:startOfDay(new Date(emp.start_date)),count:emp.count});
                    employees[index].count+=emp.count;

                })
                //console.log(employees)
                res.json(employees);
            }
        });
    }
    catch(err){
        console.log(err);
    }
});

//fetch Team detail with leave
/**
 *  Use - fetch team wise employee list and their leaves along with team details
 * 
 *  returns - array of object, where each object is a team containing team name,id,threshold,employee_count 
 *           and array of leaves taken by employees of that team
 */
app.get('/teamLeave',(req,res)=>{
    try{
        const queryStmt="select e_id,t_id,team_name,threshold,employee_name,leave_count,start_date from leaves as l,employee_team as et,employee as e,team as t where (et.e_id = l.employee_id and e.employee_id = et.e_id and t.team_id = et.t_id);select t_id , count(e_id) as emp_count from employee_team group by t_id;"
        conn.query(queryStmt,(err,results)=>{
            if(err){
                res.json({
                    success : false,
                    message : 'Error fetching data form db'
                });
            }
            if(results[0].length==0){
                res.json({
                    success: false,
                    message: 'No data found'
                });
            }
            if(results[0].length > 0){
                var team = results[0].map(data=>data.t_id);
                team = Array.from(new Set(team));
                team = team.map(data=>({team_id:data,leaves:[]}));
                results[0].forEach(data=>{
                    var i = team.map(e=>{return e.team_id}).indexOf(data.t_id);
                    team[i]['name'] = data.team_name;
                    team[i]['threshold'] = data.threshold;
                    team[i]['emp_count'] = results[1].filter(tm=>tm.t_id == team[i].team_id)[0].emp_count;
                    team[i].leaves.push({emp_id:data.e_id,emp_name:data.employee_name,start_date:data.start_date,count:data.leave_count});
                });
                res.json(team);
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