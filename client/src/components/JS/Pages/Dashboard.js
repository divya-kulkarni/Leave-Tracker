import AddLeaveModal from '../AddLeave/AddLeaveModal';
import { format, addDays, subDays, isWithinInterval, startOfMonth, lastDayOfMonth, getDaysInMonth, isSameDay } from 'date-fns';
import React from 'react';
import { genMonth, genWeek } from './dateGen';


export default class Dashboard extends React.Component {

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
    refresh() {
        window.location.reload();
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
        fetch('http://localhost:5000/employee').
            then((response) => response.json()).
            then(data => this.setState({ data: data }));
    }

    getEmpOnLeave(day) {
        var employees = this.state.data;
        var namelist = [];

        employees.forEach(emp => {
            emp.leaves.forEach(leave => {
                namelist.push(isWithinInterval(day, { start: new Date(leave.start_date), end: addDays(new Date(leave.start_date), leave.count - 1) }) ? emp.name : null);
            }
            );
        });
        namelist = namelist.filter(name => name != null);
        return namelist;
    }

    getWeeklyCalendar() {
        return (
            <table className="table table-bordered">
                <thead>
                    <tr className="thead-dark ">
                        <th colSpan={2} >
                            <h5 className="month-name">
                                {this.state.monthname}/{format(this.state.month[1][3], 'yyyy')}
                            </h5>
                        </th>
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((val, i) => (<th key={i} >{val}</th>))}
                    </tr>
                    <tr className="thead-light">
                        <th keys={'em_name'} className="sticky-header">Employee Name</th>
                        <th keys={'count'} className="sticky-header">Total Annual Leave</th>
                        {this.state.week.map((day) => {
                            const style = isSameDay(day, this.state.curr) ? { backgroundColor: "#6aa09a" } : { backgroundColor: "" };
                            return (
                                <th style={style} className="sticky-header">{format(day, 'dd')}</th>)
                        })}
                    </tr>
                </thead>
                {this.state.data.length > 0 ? (
                    <tbody>
                        {
                            this.state.data.map((val, i) => {
                                const style = i % 2 == 0 ? { backgroundColor: 'coral' } : { backgroundColor: "#ffdacc" };
                                return (
                                    <tr key={val.employee_id}>
                                        <td>{val.name}</td>
                                        <td>{val.count}</td>
                                        {[...new Array(7)].map((_, i) => {
                                            var off = false;
                                            val.leaves.forEach((ele) =>
                                                isWithinInterval(this.state.week[i], { start: new Date(ele.start_date), end: addDays(new Date(ele.start_date), ele.count - 1) }) ? off = true : null
                                            )
                                            return (
                                                off ? (<td style={style}></td>) : <td></td>)
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
                <thead >
                    <tr className="thead-dark">
                        <th colSpan={getDaysInMonth(this.state.month[1][3]) + 1} >
                            <h5 className='text-center month-name'>{this.state.monthname}/{format(this.state.month[1][3], 'yyyy')}</h5>
                        </th>
                    </tr>
                    <tr className="thead-light">
                        <th keys={'em_name'} className="sticky-name sticky-header">Employee</th>
                        {this.state.month.map((week, i) => (
                            week.map(day => {
                                if (day < startOfMonth(this.state.month[1][3]) || day > lastDayOfMonth(this.state.month[1][3]))
                                    return null;
                                else {
                                    const style = isSameDay(day, this.state.curr) ? { backgroundColor: "#6aa09a" } : { backgroundColor: "" };
                                    return (<th style={style} className="sticky-header">{format(day, 'dd')}</th>)
                                }
                            })
                        ))}
                    </tr>
                </thead>
               
                {this.state.data.length > 0 ? (<tbody>
                    {
                        this.state.data.map((emp, i) => {
                            const style = i % 2 == 0 ? { backgroundColor: "coral" } : { backgroundColor: "#ffdacc" };
                            return (
                                <tr>
                                    <td className='sticky-name' 
                                    style={{top: document.getElementsByClassName('sticky-header')[0].clientHeight}}>{emp.name}</td>
                                    {this.state.month.map((week, i) => {
                                        return (
                                            week.map(day => {
                                                if (day < startOfMonth(this.state.month[1][3]) || day > lastDayOfMonth(this.state.month[1][3]))
                                                    return null;
                                                else {
                                                    var off = false;
                                                    emp.leaves.forEach((ele) =>
                                                        isWithinInterval(day, { start: new Date(ele.start_date), end: addDays(new Date(ele.start_date), ele.count - 1) }) ? off = true : null
                                                    )
                                                    return (
                                                        off ? (<td style={style}></td>) : <td></td>)
                                                }
                                            })
                                        );
                                    })
                                    }
                                </tr>
                            )
                        })
                    }
                </tbody>) : null}
            </table>
        )
    }

    renderButton() {
        if (this.state.data.length != 0)
            return (<AddLeaveModal refresh={this.refresh} leaves={this.state.data.filter(emp => emp.employee_id == this.props.emp_id)[0].leaves} emp_id={this.props.emp_id}/>)
        else
            return (<AddLeaveModal />)
    }

    getLegend(){
        return(
            <div className="col" style={{right:'0'}}>
                <table className='legend-table'>
                    <tr>
                        <td style={{height:'50%', width:'15%', backgroundColor:'coral'}}></td>&nbsp;
                        <td style={{height:'50%', width:'15%', backgroundColor:'#ffdacc'}}></td>
                        &nbsp;&nbsp;
                        <td>Employee On Leave</td>

                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                        <td style={{height:'50%', width:'15%', backgroundColor:'#6aa09a'}}></td>
                        <td></td>
                        <td> </td>
                        &nbsp;&nbsp;
                        <td>Today</td>
                    </tr>
                    <tr>
                                
                    </tr>
                </table>
            </div>
        );
    }

    render() {
        return (
            <div className="dashboard">
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
                {this.getLegend()}    
                </div><br />
                <div className='empTable'>
                    {this.state.monthly ? this.getMonthlyCalendar() : this.getWeeklyCalendar()}
                </div>
                <div className='add-leave-btn'>
                    {this.renderButton()}
                </div>
            </div>
        );
    }
}