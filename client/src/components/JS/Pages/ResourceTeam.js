import React from 'react';
import '../../CSS/resourceTeam.css';

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
                <div className='resource-list form-inline'>
                    <label><b>Team Names&nbsp;&nbsp;&nbsp;</b></label>
                    <select style={{ padding: 0, margin: 0 }} className="form-control" onChange={this.handleChange}>
                        <option value="" disabled> Select</option>
                        {this.teamNames.map((item, index) => {
                            return (
                                <option key={index} value={item}>{item}</option>
                            );
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
                            <b>Team Threshold : {this.state.threshold}</b>
                            <br></br>
                        </div>
                        <div className='child-resource-table'>
                            <table className='table table-bordered'> 
                            <thead className='thead-dark'> 
                                <tr>
                                    <th className='resource-table-header'>EMPLOYEE ID</th>
                                    <th className='resource-table-header'>EMPLOYEE NAME</th>
                                </tr>
                            </thead>
                            <tbody className='resource-table-body'>
                                {
                                    this.state.emplist.map((emp) => {
                                    return (<tr key={emp.id}><td>{emp.id}</td><td>{emp.name}</td></tr>)
                                    })
                                }
                            </tbody>
                            </table>
                        </div>
                    </div>
                    ) : null }
                </div>
                    
            </>
        );
    }
}

export default ResourceTeam;