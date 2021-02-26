import { format, addDays, subDays, isWithinInterval, startOfMonth, lastDayOfMonth, getDaysInMonth, isSameDay } from 'date-fns';
import React from 'react';
import { genMonth, genWeek } from './dateGen';
import ToolTip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade'


export default class RiskChart extends React.Component {
    constructor(props) {
        super(props);
        const week = genWeek()();
        const month = genMonth()();
        const monthname = format(new Date, 'MMMM')
        this.state = { curr: new Date(), week: week, data: [], monthly: false, month: month, monthname: monthname };
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
        const monthname = format(this.state.curr, 'MMMM');
        this.setState({ week: week, month: month, monthname: monthname });
    }

    Prev() {
        if (!this.state.monthly) {
            var day = subDays(this.state.week[0], 1);
            var week = genWeek(day)();
            this.setState({ week: week });
        }
        else {
            var day = subDays(this.state.month[0][0], 1);
            var monthname = format(day, 'MMMM');
            var month = genMonth(day)();
            this.setState({ month: month, monthname: monthname });
        }
    }
    Next() {
        if (!this.state.monthly) {
            var day = addDays(this.state.week[6], 1);
            var week = genWeek(day)();
            this.setState({ week: week });
        }
        else {
            var day = addDays(this.state.month[this.state.month.length - 1][6], 1);
            var monthname = format(day, 'MMMM');
            var month = genMonth(day)();
            this.setState({ month: month, monthname: monthname });
        }
    }

    componentDidMount() {
        fetch('http://localhost:5000/teamLeave').
            then((response) => response.json()).
            then(data => this.setState({ data: data }));
    }

    getEmpOnLeave(day) {
        var teams = this.state.data;
        var namelist = [];

        teams.forEach(team => {
            team.leaves.forEach(leave => {
                namelist.push(isWithinInterval(day, { start: new Date(leave.start_date), end: addDays(new Date(leave.start_date), leave.count - 1) }) ? { team: team.name, emp: leave.emp_name } : null);
            }
            );
        });
        namelist = namelist.filter(name => name != null);
        const list = namelist.filter((v, i, a) => a.findIndex(t => (JSON.stringify(t) === JSON.stringify(v))) === i)

        return list;
    }

    getToolTipList(day, team) {
        var list = this.getEmpOnLeave(day);
        var emp_on_Leave = list.filter(emp => emp.team == team.name).length;
        const namelist = list.filter(emp => emp.team == team.name);
        var risk = (team.emp_count - emp_on_Leave) / team.emp_count <= team.threshold ? true : false;
        return (
            <ToolTip title={
                <ul className='list-group list-group-flush'>
                    <li className=''><h6>Team : Member</h6></li>
                    {namelist.map((name) =>
                        <li className=''><h6>{name.team} : {name.emp}</h6></li>)}
                </ul>
            }
                TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}
            >
                {risk ? <td style={{ backgroundColor: "crimson" }}></td> : <td style={{ backgroundColor: "#99bbff" }}></td>}
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
                                {this.state.monthname}/{format(this.state.month[1][3], 'yyyy')}
                            </h5>
                        </th>
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((val, i) => (<th key={i}>{val}</th>))}
                    </tr>
                    <tr className="thead-light">
                        <th keys={'team_name'} className="sticky-header" >Team</th>
                        {this.state.week.map((day) => {
                            const style = isSameDay(day, this.state.curr) ? { backgroundColor: "#839b97" } : { backgroundColor: "" };
                            return (
                                <th style={style} className="sticky-header">{format(day, 'd/LLL/yy')}</th>)
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
                            <h5 className='text-center month-name'>{this.state.monthname}/{format(this.state.month[1][3], 'yyyy')}</h5>
                        </th>
                    </tr>
                    <tr className="thead-light">
                        <th keys={'team_name'} className="sticky-header">Team</th>
                        {this.state.month.map((week, i) => (
                            week.map(day => {
                                if (day < startOfMonth(this.state.month[1][3]) || day > lastDayOfMonth(this.state.month[1][3]))
                                    return null;
                                else {
                                    const style = isSameDay(day, this.state.curr) ? { backgroundColor: "#839b97" } : { backgroundColor: "" };
                                    return (<th style={style} className="sticky-header">{format(day, 'dd')}</th>)
                                }
                            })
                        ))}
                    </tr>
                </thead>
                {this.state.data.length > 0 ? (
                    <tbody>
                        {
                            this.state.data.map(team => {
                                return (
                                    <tr>
                                        <td className='sticky-name'
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
                        <select className="form-control" value={this.state.team_name}
                            onChange={this.handleChange}
                            style={{ padding: 0, margin: 0 }}
                        >
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>
                    <div className="col" style={{ right: '0' }}>
                        <table className='legend-table'>
                            <tr>
                                <td style={{ height: '50%', width: '15%', backgroundColor: 'crimson' }}></td>&nbsp;
                                &nbsp;&nbsp;
                                <td>High Risk</td>

                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                                <td style={{ height: '50%', width: '15%', backgroundColor: '#99bbff' }}></td>&nbsp;
                                &nbsp;&nbsp;
                                <td>Low Risk</td>

                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                                <td style={{ height: '50%', width: '15%', backgroundColor: '#839b97' }}></td>
                                <td></td><td> </td>&nbsp;&nbsp;
                                <td>Today</td>
                            </tr>
                            <tr>

                            </tr>
                        </table>
                    </div>
                </div><br />
                <div className="riskTable">
                    {this.state.monthly ? this.getMonthlyCalendar() : this.getWeeklyCalendar()}
                </div>
            </div>
        );
    }
}