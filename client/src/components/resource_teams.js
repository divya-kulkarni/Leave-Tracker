import React from 'react';
import './navbar/navbar.css';
import AddLeaveModal from '../pages/AddLeaveModal';
import '../pages/addLeaveBtn.css';
/*
Class Name: ResourceTeam
Constructor Used For: 1.Initializing the local state of a component. 
                      2.Binding event handler.
                      3.Declaring an array to eliminate duplicate team_names.
Class Functions Used: 1.handleChange()->to change the state of the component when the selection event occurs.
                      2.render()->to print the details based on team name

*/
class ResourceTeam extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            team_name: "",
            threshold: '',
            emplist: []
        };
        this.teamNames = [];
        this.handleChange = this.handleChange.bind(this);

    }

    handleChange(event) {
        const value = event.target.value;
        // console.log(this.data.filter(team=>team.team_name == value)[0].emp)
        this.setState({
            team_name: value,
            threshold: this.data.filter(team => team.team_name == value)[0].threshold,
            emplist: this.data.filter(team => team.team_name == value)[0].emp,

        });
    }
    componentDidMount() {
        fetch('http://localhost:5000/team').
            then((response) => response.json()).
            then((result) => {
                this.data = result;
                this.teamNames = result.map(ele => ele.team_name);
                const value = this.teamNames[0]
                // console.log(this.data);
                this.setState({
                    team_name: "",
                    threshold: '',
                    emplist: []
                });
            });
    }

    render() {
        return (
            <>
                <div className='resource-list'>
                    <label>TEAM NAMES </label>
                    <select value={this.state.team_name} onChange={this.handleChange}>
                        <option value="" disabled>Select</option>
                        {this.teamNames.map((item, index) => {
                            return (
                                <option key={index} value={item}>{item}</option>
                            );
                        })}
                    </select>
                    <br></br>
                    <br></br>
                    {this.state.team_name.length > 0 ? (
                        <div>
                            <h4>TEAM DETAILS</h4>

                            <h5>Team Name :{this.state.team_name}</h5>
                            <h5>Team Threshold :{this.state.threshold}</h5>
                            <table className="table table-bordered">
                                <thead className="thead-light">
                                    <tr>
                                        <th>EMPLOYEE ID</th>
                                        <th>EMPLOYEE NAME</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.emplist.map((emp) => {
                                            return (<tr key={emp.id}><td>{emp.id}</td><td>{emp.name}</td></tr>)
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    ) : null}
                    <div className='add-leave-btn'>
                        <AddLeaveModal />
                    </div>
                </div>
            </>
        );
    }
}

export default ResourceTeam;