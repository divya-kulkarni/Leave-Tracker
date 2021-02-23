import { format,addDays,subDays ,isWithinInterval,  startOfMonth, lastDayOfMonth,getDaysInMonth,isSameDay} from 'date-fns';
import React from 'react';
import {genMonth, genWeek} from './dateGen';
import ToolTip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade'


export default class RiskChart extends React.Component{
    constructor(props){
        super(props);
        const week = genWeek()();
        const month = genMonth()();
        const monthname = format(new Date,'MMMM')
        this.state = {curr: new Date(),week:week,data:[],monthly:false,month:month,monthname:monthname};
        this.Prev =this.Prev.bind(this);
        this.Next =this.Next.bind(this);
        this.Today = this.Today.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event){
        if(event.target.value == 'monthly'){
            this.setState({monthly:true})
        }
        else{
            this.setState({monthly:false});
        }
    }

    Today(){
        const week = genWeek(this.state.curr)();
        const month = genMonth(this.state.curr)();
        const monthname = format(this.state.curr,'MMMM');
        this.setState({week:week,month:month,monthname:monthname});
    }

    Prev() {
        if(!this.state.monthly){
            var day = subDays(this.state.week[0],1);
            var week = genWeek(day)();
            this.setState({week:week});
        }   
        else{
            var day = subDays(this.state.month[0][0],1);
            var monthname = format(day,'MMMM');
            var month = genMonth(day)();
            this.setState({month:month,monthname:monthname});
        }
    }
    Next(){
        if(!this.state.monthly){
            var day = addDays(this.state.week[6],1);
            var week = genWeek(day)();
            this.setState({week:week});
        }
        else{
            var day = addDays(this.state.month[this.state.month.length-1][6],1);
            var monthname = format(day,'MMMM');
            var month = genMonth(day)();
            this.setState({month:month,monthname:monthname});
        }
    }

    componentDidMount(){
        fetch('http://localhost:5000/teamLeave').
        then((response)=>response.json()).
        then(data=>this.setState({data:data}));
    }

    getEmpOnLeave(day){
        var teams = this.state.data;
        var namelist=[];
        
        teams.forEach(team=>{
            team.leaves.forEach(leave=>{
                namelist.push(isWithinInterval(day,{start:new Date(leave.start_date),end:addDays( new Date(leave.start_date),leave.count-1)}) ? {team:team.name,emp:leave.emp_name}:null);
                }                
            );
        });
        namelist = namelist.filter(name => name!=null);
        const list = namelist.filter((v,i,a)=>a.findIndex(t=>(JSON.stringify(t) === JSON.stringify(v)))===i)
        
        return list;
    }
    
    getToolTipList(day,team){
        var list=this.getEmpOnLeave(day);
        var emp_on_Leave=list.filter(emp=>emp.team == team.name).length;
        const namelist = list.filter(emp=>emp.team == team.name);
        var risk = (team.emp_count-emp_on_Leave)/team.emp_count <= team.threshold ? true: false ;
        return(
            <ToolTip title={
                <ul className='list-group list-group-flush'>
                <li className=''><h6>Team : Member</h6></li>
                {namelist.map((name)=>
                    <li className=''><h6>{name.team} : {name.emp}</h6></li>)}
                </ul>
            } 
            TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}
            >
            {risk ? <td style={{backgroundColor:"crimson"}}></td>:<td style={{backgroundColor:"#99bbff"}}></td>}
            </ToolTip>
        )
    }

    getWeeklyCalendar(){
        return(
        <table className="table table-bordered">
            <thead className="thead-light">
                <tr>
                    {['','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map((val,i)=>(<th key={i}>{val}</th>))}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th keys={'em_name'}>Team</th>
                    {this.state.week.map((day)=>{
                        const style= isSameDay(day,this.state.curr)?{backgroundColor:"coral"} : {backgroundColor:""};
                        return(
                        <th style={style}>{format(day,'d/LLL/yy')}</th>)
                    })}
                </tr>
                {
                    this.state.data.map((val)=>{
                        //console.log(val.leaves)
                        return(
                            <tr key={val.team_id}>
                                <td>{val.name}</td>
                                {[...new Array(7)].map((_,i)=>{
                                    var off =false;
                                    val.leaves.forEach((ele)=>
                                        isWithinInterval(this.state.week[i],{start:new Date(ele.start_date),end:addDays( new Date(ele.start_date),ele.count-1)}) ? off = true: null
                                    )
                                    return(
                                        off ? this.getToolTipList(this.state.week[i],val):<td></td>)
                                })}
                            </tr>
                        );
                    })
                }
            </tbody>
        </table>)
    }
    getMonthlyCalendar()
    {
        return(
            <table className="table table-bordered">
            <thead className="thead-light">
                <tr>
                    <td colSpan={getDaysInMonth(this.state.month[1][3])+1}>
                    <h4 className='text-center'>{this.state.monthname}/{format(this.state.month[1][3],'yyyy')}</h4>
                    </td>
                </tr>
                <tr>
                    <th keys={'em_name'}>Team</th>
                    {this.state.month.map((week,i)=>(
                        week.map(day=>{
                            if(day < startOfMonth(this.state.month[1][3]) || day > lastDayOfMonth(this.state.month[1][3]))
                                return null;
                            else{
                                    const style= isSameDay(day,this.state.curr)?{backgroundColor:"coral"} : {backgroundColor:""};
                                    return(<th style={style}>{format(day,'dd')}</th>)
                                }
                            })
                        ))}
                </tr>
            </thead>
            <tbody>
                {
                   this.state.data.map(team=>{
                        return(
                            <tr>
                                <td>{team.name}</td>
                                {this.state.month.map((week,i)=>{
                                    return(
                                    week.map(day=>{
                                        
                                        if(day < startOfMonth(this.state.month[1][3]) || day > lastDayOfMonth(this.state.month[1][3]))
                                            return null;
                                        else
                                        {   
                                            var off =false;
                                            team.leaves.forEach((ele)=>
                                            isWithinInterval(day,{start:new Date(ele.start_date),end:addDays( new Date(ele.start_date),ele.count-1)}) ? off = true: null
                                            )
                                            return(
                                                off ? this.getToolTipList(day,team):<td></td>)
                                            
                                        }
                                    })
                                    )
                                })
                                }
                            </tr>
                        )
                       
                   })
                }
            </tbody>
        </table>
        )
    }

    render(){
        return(
            <div className="RiskChart">
                <div className="row">
                
                    <div className="col">
                        <button className="btn btn-dark" onClick={this.Prev}>{'<'}</button>____
                        <button className="btn btn-dark" onClick={this.Next}>{'>'}</button>.....
                        <button className="btn btn-dark" onClick={this.Today}>Today</button>
                    </div>
                    <div className="col">
                        <label>View:
                            <select className="form-control" value={this.state.team_name} onChange={this.handleChange}>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </label>
                    </div>
                </div>
                {this.state.monthly ? this.getMonthlyCalendar(): this.getWeeklyCalendar()}
            </div>
        );
    }
}