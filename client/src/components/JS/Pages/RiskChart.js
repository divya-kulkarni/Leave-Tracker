import { format, addDays, subDays, isWithinInterval, startOfMonth, lastDayOfMonth, getDaysInMonth, isSameDay } from 'date-fns';
import React from 'react';
import { genMonth, genWeek } from './dateGen';
import ToolTip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade'

/*
    Class name :   RiskChart
    
    state variables
        curr:   current date
        week:   week for currently viewing calendar(Array of dates)
        monthly : bool to check if monthly calendar is selected
        month:  month for currently viewing calendar(2D array of dates, divided by weeks)
        data:   data of team (name, id, employees and their leaves)

    functions :
    handleChange(event)  : changes monthly state depending upon selected dropdown
    Next() : shifts week/month by 1 week/month ahead
    Prev() : shifts week/month by 1 week/month back
    Today() : shifts week/month to current day
    getWeeklyCalendar() :  prints weekly calendar
    getMonthlyCalendar() : prints monthly calendar
    getLegend() : Prints legend
    getEmpOnLeave(day) : used for fetching list of employees on leave on the particular 'day'
    getToolTip(day,team) : prints a tooltip when mouse is hovered over table containing list of employees of the 'team' who are on leave on 'day' 
*/


export default class RiskChart extends React.Component {
    constructor(props) {
        super(props);
        const week = genWeek()();
        const month = genMonth()();
        this.state = { curr: new Date(), week: week, data: [], monthly: false, month: month};
        this.Prev = this.Prev.bind(this);
        this.Next = this.Next.bind(this);
        this.Today = this.Today.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        if (event.target.value == 'monthly') {
            this.setState({ monthly: true })
        }
        else {
            this.setState({ monthly: false });
        }
    }

    Today() {
        const week = genWeek(this.state.curr)();
        const month = genMonth(this.state.curr)();
        this.setState({ week: week, month: month});
    }

    Prev() {
        if (!this.state.monthly) {
            var day = subDays(this.state.week[0], 1);
            var week = genWeek(day)();
            this.setState({ week: week});
        }
        else {
            var day = subDays(this.state.month[0][0], 1);
            var month = genMonth(day)();
            this.setState({ month: month});
        }
    }
    Next() {
        if (!this.state.monthly) {
            var day = addDays(this.state.week[6], 1);
            var week = genWeek(day)();
            this.setState({ week: week});
        }
        else {
            var day = addDays(this.state.month[this.state.month.length - 1][6], 1);
            var month = genMonth(day)();
            this.setState({ month: month});
        }
    }

    componentDidMount() {
        fetch('http://localhost:5000/teamLeave').
            then((response) => response.json()).
            then(data => this.setState({ data: data }));
    }

    getEmpOnLeave(day) {
        const teams = this.state.data;
        var namelist = [];

        teams.forEach(team => {
            team.leaves.forEach(leave => {
                namelist.push(isWithinInterval(day, { start: new Date(leave.start_date), end: addDays(new Date(leave.start_date), leave.count - 1) }) ? { team: team.name, emp: leave.emp_name } : null);
            }
            );
        });
        namelist = namelist.filter(name => name != null);
        const list = namelist.filter((v, i, a) => a.findIndex(t => (JSON.stringify(t) === JSON.stringify(v))) === i)    //removes duplicate opbject

        return list;
    }

    getToolTipList(day, team) {
        var list = this.getEmpOnLeave(day);
        var emp_on_Leave = list.filter(emp => emp.team == team.name).length;
        const namelist = list.filter(emp => emp.team == team.name);
        const currThreshold = ((team.emp_count - emp_on_Leave) / team.emp_count).toFixed(2);
        var risk =   currThreshold <= team.threshold ? true : false;
        return (
            <ToolTip title={
                <div>
                    <h5>Team threshold : {team.threshold}</h5>
                    <h5>Current threshold : {currThreshold}</h5>
                    <ul className='list-group list-group-flush'>
                        <li className=''><h6>Team : Member</h6></li>
                        {namelist.map((name,i) =>
                            <li key={i} className=''><h6>{name.team} : {name.emp}</h6></li>)}
                    </ul>
                </div>
            }
                TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}
            >
                {risk ? <td key={format(day,'dd')} style={{ backgroundColor: "#ff4d4d" }}></td> : <td style={{ backgroundColor: "#d3d3d3" }}></td>}
            </ToolTip>
        )
    }

    getWeeklyCalendar() {
        return (
            <table className="table table-bordered">
                <thead >
                    <tr className="thead-dark">
                        <th >
                            <h5 className="month-name">
                                {format(this.state.week[0], 'MMMM/yyyy')}
                            </h5>
                        </th>
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((val, i) => (<th key={i}>{val}</th>))}
                    </tr>
                    <tr className="thead-light">
                        <th keys={'team_name'} className="sticky-header" >Team</th>
                        {this.state.week.map((day,i) => {
                            const style = isSameDay(day, this.state.curr) ? { backgroundColor: "#6aa09a" } : { backgroundColor: "" };
                            return (
                                <th style={style} key={i} className="sticky-header">{format(day, 'd/LLL/yy')}</th>)
                        })}
                    </tr>
                </thead>
                {this.state.data.length > 0 ? (
                    <tbody>
                        {
                            this.state.data.map((val) => {
                                return (
                                    <tr key={val.team_id}>
                                        <td>{val.name}</td>
                                        {[...new Array(7)].map((_, i) => {
                                            var off = false;
                                            val.leaves.forEach((ele) =>
                                                isWithinInterval(this.state.week[i], { start: new Date(ele.start_date), end: addDays(new Date(ele.start_date), ele.count - 1) }) ? off = true : null
                                            )
                                            return (
                                                off ? this.getToolTipList(this.state.week[i], val) : <td></td>)
                                        })}
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                ) : null}
            </table>)
    }
    getMonthlyCalendar() {
        return (
            <table className="table table-bordered">
                <thead>
                    <tr className="thead-dark">
                        <th colSpan={getDaysInMonth(this.state.month[1][3]) + 1} >
                            <h5 className='text-center month-name'>{format(this.state.month[1][3], 'MMMM/yyyy')}</h5>
                        </th>
                    </tr>
                    <tr className="thead-light">
                        <th keys={'team_name'} className="sticky-header sticky-name">Team</th>
                        {this.state.month.map((week) => (
                            week.map((day,i) => {
                                if (day < startOfMonth(this.state.month[1][3]) || day > lastDayOfMonth(this.state.month[1][3]))
                                    return null;
                                else {
                                    const style = isSameDay(day, this.state.curr) ? { backgroundColor: "#6aa09a" } : { backgroundColor: "" };
                                    return (<th style={style} key={i} className="sticky-header">{format(day, 'dd')}</th>)
                                }
                            })
                        ))}
                    </tr>
                </thead>
                {this.state.data.length > 0 ? (
                    <tbody>
                        {
                            this.state.data.map((team,i) => {
                                return (
                                    <tr key={i}>
                                        <td className='sticky-name' key={'tm-nm'}
                                            style={{ top: document.getElementsByClassName('sticky-header')[0].clientHeight }}>{team.name}</td>
                                        {this.state.month.map((week, i) => {
                                            return (
                                                week.map(day => {

                                                    if (day < startOfMonth(this.state.month[1][3]) || day > lastDayOfMonth(this.state.month[1][3]))
                                                        return null;
                                                    else {
                                                        var off = false;
                                                        team.leaves.forEach((ele) =>
                                                            isWithinInterval(day, { start: new Date(ele.start_date), end: addDays(new Date(ele.start_date), ele.count - 1) }) ? off = true : null
                                                        )
                                                        return (
                                                            off ? this.getToolTipList(day, team) : <td></td>)

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
                ) : null}
            </table>
        )
    }

    getLegend(){
        return(
            <div className="col" style={{ right: '0' }}>
                <table className='legend-table'>
                    <tbody>
                        <tr>
                            <td style={{ height: '50%', width: '15%', backgroundColor: '#ff4d4d' }}></td>
                            &nbsp;&nbsp;&nbsp;
                            <td>High Risk</td>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <td style={{ height: '50%', width: '15%', backgroundColor: '#d3d3d3' }}></td>
                            &nbsp;&nbsp;&nbsp;
                            <td>Low Risk</td>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <td style={{ height: '50%', width: '15%', backgroundColor: '#6aa09a' }}></td>
                            <td></td><td></td>&nbsp;&nbsp;
                            <td>Today</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

    render() {
        return (
            <div className="RiskChart">
                <div className="row">
                    <div className="col form-inline">
                        <button className="btn btn-dark" onClick={this.Prev}>{'<'}</button>
                        &nbsp;&nbsp;&nbsp;
                        <button className="btn btn-dark" onClick={this.Next}>{'>'}</button>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <button className="btn btn-dark" onClick={this.Today}>Today</button>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <select className="form-control" 
                            onChange={this.handleChange}
                            style={{ padding: 0, margin: 0 }}
                        >
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>
                {this.getLegend()}    
                </div><br />
                <div className="riskTable">
                    {this.state.monthly ? this.getMonthlyCalendar() : this.getWeeklyCalendar()}
                </div>
            </div>
        );
    }
}