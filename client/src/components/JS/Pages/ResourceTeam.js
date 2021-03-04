import React from 'react';
import '../../CSS/resourceTeam.css';

/*
Class - ResourceTeam
Parameters - state.team_name(by default it is none, it changes as an option from dropdown list is selected),
             state.threshold(based on the team_name chosen the threshold is displayed),
             state.emplist(based on the team_name chosen the employees belonging to that team is displayed ),
             state.sort(by default this is true indicating the employees of the chosen team_name are 
             already sorted alphabetically (A-Z)).
Functions -  Constructor() : Initializing the local state and binds the event handler,
             also an array is declared to eliminate duplicate team_names.
             handleSort() : To change the sorting either from A-Z or Z-A depending on the selected filter and 
             display employee names accordingly.
             handleChange() : To change the state of the component when the selection event occurs.
             componentDidMount() : To fetch data from server.
*/

class ResourceTeam extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            team_name: '',
            threshold: '',
            emplist: [],
            sort:true
        };
        this.teamNames = [];
        this.handleChange = this.handleChange.bind(this);
        this.handleSort = this.handleSort.bind(this);
    }

    handleSort(event) {
        const value = event.target.value;
        const sort = value == 'asc' ? true : false;
        var empList = this.data.filter(team => team.team_name == this.state.team_name)[0].emp;
        if(sort)
            empList = empList.sort((a, b) => a.name.localeCompare(b.name));
        else
            empList = empList.sort((a, b) => b.name.localeCompare(a.name));
        this.setState({emplist: empList,sort:sort});
    }

    handleChange(event) {
        const value = event.target.value;
        var empList = this.data.filter(team => team.team_name == value)[0].emp;
        empList = empList.sort((a, b) => a.name.localeCompare(b.name));
        this.setState({
            team_name: value,
            threshold: this.data.filter(team => team.team_name == value)[0].threshold,
            emplist: empList,
        });     
    }

    componentDidMount() {
        fetch('http://localhost:5000/team').
        then((response) => response.json()).
        then((result) => {
            this.data = result;
            this.teamNames = result.map(ele => ele.team_name);
            this.setState({
                team_name: '',
                threshold: '',
                emplist: []
            });
        });
    }

    render() {
        return (
            <>
                <div className='resource-list form-inline'>
                    <label><b>Team Names&nbsp;&nbsp;&nbsp;</b></label>
                    <select style={{ padding: 0, margin: 0 }} className="form-control"
                        onChange={this.handleChange}>
                        <option value="" disabled selected> Select</option>
                        {this.teamNames.map((item, index) => {
                            return <option key={index} value={item}>{item}</option>;
                        })}
                    </select>
                </div>
                <div>
                    {this.state.team_name.length > 0 ? (
                        <div className='parent-resource-table'>
                            <div className='resource-table-details'>
                                <h6><b>TEAM DETAILS</b></h6>
                                <b>Team Name : {this.state.team_name}</b>
                                <br></br>
                                <div className='form-inline'>
                                    <b>Team Threshold : {this.state.threshold}</b>
                                    <br></br>
                                    <div className='sorting form-inline col'
                                        style={{ margin: 0 }}>
                                        <label>Sort Name By:</label>
                                        <select className="form-control" style={{ margin: 0 }} 
                                            onClick={this.handleSort} defaultValue='asc'>
                                            <option value="asc">A-Z</option>
                                            <option value="desc">Z-A</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className='child-resource-table'>
                                <table className='table table-bordered'>
                                    <thead className='thead-dark'>
                                        <tr>
                                            <th className='resource-table-header'>EMPLOYEE ID</th>
                                            <th className='resource-table-header'>EMPLOYEE NAME</th>
                                        </tr>
                                    </thead>
                                    <tbody className='resource-table-body'> {
                                        this.state.emplist.map((emp) => {
                                            return (
                                                <tr key={emp.id}>
                                                    <td>{emp.id}</td>
                                                    <td>{emp.name}</td>
                                                </tr>
                                            )
                                        })
                                    }</tbody>
                                </table>
                            </div>
                        </div>
                    ) : null}
                </div>
            </>
        );
    }
}

export default ResourceTeam;