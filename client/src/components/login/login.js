import React from 'react';
import './login.css';

class Login extends React.Component {
    constructor(props) {
      super(props);
      this.state = {employee_id: '',
                    pass:''};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      const value = event.target.value;
      const name= event.target.name;
      this.setState({
        [name] : value
      });
    }
  
    async handleSubmit(event) {
        event.preventDefault();
        console.log(this.state);
        console.log('employee id: ' + this.state.employee_id + '  password:'+this.state.pass);
        const result = await fetch("http://localhost:5000/login",{
            method:"POST",
            headers:{ "Content-Type": "application/json" },
            body:JSON.stringify(this.state)
        });
        const data=await result.json();
        console.log(data);
        
        alert(data.message);
    }
  
    render() {
      return (
        <div className="login-bg">
          <form onSubmit={this.handleSubmit}>
            <h2>Sign in</h2>
            <br/>  
            <input className="form-input" id="txt-input" name="employee_id" type="text" placeholder="Employee Id" required value={this.state.employee_id} onChange={this.handleChange}/>
            <br/><br/>                    
            <input className="form-input" id="pwd" name ="pass" type="password" placeholder="Password" required value={this.state.pass} onChange={this.handleChange}/>
            <br/>                   
            <button type="submit"><b>Log In </b></button>      
          </form>
        </div>
      );
    }
  }

export default Login;