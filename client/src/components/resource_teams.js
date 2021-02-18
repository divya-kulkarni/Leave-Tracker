import React from 'react';
import {resourceData} from "./resource_data";


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
            team_name:""
        };

        this.handleChange = this.handleChange.bind(this);
           
        var teamName=resourceData.map(data => (data.team_name) );
        this.teamName= Array.from(new Set(teamName));
    }
    
    handleChange(event) {        
        const value = event.target.value;
        this.setState({
            team_name: value
        });  
    }
         
    render() {       
        return(
            <>
                <div>
                    <label>TEAM NAMES </label>
                    <select value={this.state.team_name} onChange={this.handleChange}>
                        {this.teamName.map((item,index)=>{ 
                            return(
                                <option key={index} value={item}>{item}</option>
                            );
                        })}
                    </select>
                    <br></br>
                    <br></br>       
                    {this.state.team_name.length>0 ? (
                        <div>
                            <h4>TEAM DETAILS</h4>
                            <table border={1}> 
                                <tbody>
                                    <tr>
                                        <th>EMPLOYEE ID</th>
                                        <th>EMPLOYEE NAME</th>
                                        <th>EMAIL</th>
                                    </tr>
                                    {resourceData.map(item=>{
                                        if(this.state.team_name===item.team_name){
                                            return(
                                                <tr>
                                                    <td>{item.id}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.email}</td>
                                                </tr>
                                            );
                                        }
                                    })}
                                </tbody>
                            </table>
                        </div>  
                    ):null}
                </div>
            </>
        );      
    }
}       

export default ResourceTeam;