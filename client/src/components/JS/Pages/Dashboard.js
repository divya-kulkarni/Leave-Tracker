import AddLeaveModal from '../AddLeave/AddLeaveModal';
import { format, addDays, subDays, isWithinInterval, startOfMonth, lastDayOfMonth, getDaysInMonth, isSameDay } from 'date-fns';
import React from 'react';
import { genMonth, genWeek } from './dateGen';


/*
    Class name : Dashboard
    parameters = emp_id employee id passed as props from navbar
    state variables
        curr:   current date
        week:   week for currently viewing calendar(Array of dates)
        monthly : bool to check if monthly calendar is selected
        month:  month for currently viewing calendar(2D array of dates, divided by weeks)
        data:   data of employees (name, id, leaves)
        monthname:  month name of state.month
        sort:   default sorting of employees (ascending by default)

    functions :
    handleChange(event)  : changes monthly state depending upon selected dropdown
    Next() : shifts week/month by 1 week/month ahead
    Prev() : shifts week/month by 1 week/month back
    Today() : shifts week/month to current day
    sortEmp() : Sorts employees acc to sort state
    getWeeklyCalendar() :  prints weekly calendar
    getMonthlyCalendar() : prints monthly calendar
    getLegend() : Prints legend
*/


export default class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        const week = genWeek()();
        const month = genMonth()();
        const monthname = format(new Date, 'MMMM')
        this.state = { curr: new Date(), week: week, data: [], monthly: false, month: month, monthname: monthname ,sort:"asc"};
        this.Prev = this.Prev.bind(this);
        this.Next = this.Next.bind(this);
        this.Today = this.Today.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.sortEmp = this.sortEmp.bind(this);
    }

    handleChange(event) {
        if (event.target.value == 'monthly') {
            this.setState({ monthly: true })
        }
        else {
            this.setState({ monthly: false });
        }
    }

    sortEmp(event){
        const sort = event.target.value;
        const data = Array.from(this.state.data);
        if(sort=="asc")
        {   console.log('ascending');
            data.sort((a,b)=>a.name.localeCompare(b.name))
        }
        else
        {
            console.log('decending');
            data.sort((b,a)=>a.name.localeCompare(b.name))
        }
        console.log(data);
        this.setState({
            sort:sort,
            data:data
        });
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
            var monthname = format(day, 'MMMM');
            var week = genWeek(day)();
            this.setState({ week: week, monthname: monthname });
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
            var monthname = format(day, 'MMMM');
            var week = genWeek(day)();
            var week = genWeek(day)();
            this.setState({ week: week , monthname: monthname});
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
            then(data => {
                data.sort((a,b)=>a.name.localeCompare(b.name));
                this.setState({ data: data })});
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
                        {this.state.week.map((day,i) => {
                            const style = isSameDay(day, this.state.curr) ? { backgroundColor: "#6aa09a" } : { backgroundColor: "" };
                            return (
                                <th key={i} style={style} className="sticky-header">{format(day, 'dd/MMM/yy')}</th>)
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
                                                off ? (<td key={i} style={style}></td>) : <td key={i}></td>)
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
                                    const data = format(day, 'dd');
                                    return (<th style={style} key={data} className="sticky-header">{data}</th>)
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
                                <tr key={i}>
                                    <td className='sticky-name' 
                                    style={{top: document.getElementsByClassName('sticky-header')[0].clientHeight}}>{emp.name}</td>
                                    {this.state.month.map((week, i) => {
                                        return (
                                            week.map((day,i) => {
                                                if (day < startOfMonth(this.state.month[1][3]) || day > lastDayOfMonth(this.state.month[1][3]))
                                                    return null;
                                                else {
                                                    var off = false;
                                                    emp.leaves.forEach((ele) =>
                                                        isWithinInterval(day, { start: new Date(ele.start_date), end: addDays(new Date(ele.start_date), ele.count - 1) }) ? off = true : null
                                                    )
                                                    return (
                                                        off ? (<td key={i} style={style}></td>) : <td key={i}></td>)
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
            return (<AddLeaveModal leaves={this.state.data.filter(emp => emp.employee_id == this.props.emp_id)[0].leaves} emp_id={this.props.emp_id}/>)
        else
            return (<AddLeaveModal />)
    }

    getLegend(){
        return(
            <div className="col" style={{right:'0'}}>
                <table className='legend-table'>
                    <tbody>
                        <tr>
                            <td style={{height:'50%', width:'15%', backgroundColor:'coral'}}></td>&nbsp;
                            <td style={{height:'50%', width:'15%', backgroundColor:'#ffdacc'}}></td>
                            &nbsp;&nbsp;
                            <td>Employee On Leave</td>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <td style={{height:'50%', width:'15%', backgroundColor:'#6aa09a'}}></td>
                            <td></td>
                            <td></td>
                            &nbsp;&nbsp;
                            <td>Today</td>
                        </tr>
                    </tbody>
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
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <label>Sort:</label>&nbsp;&nbsp;
                        <select className="form-control" value={this.state.sort}
                            onChange={this.sortEmp}
                            style = {{padding:0,margin:0}}
                        >
                            <option value="asc">A-Z</option>
                            <option value="desc">Z-A</option>
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