import React from 'react';
import '../../CSS/login.css';
import {Redirect} from 'react-router-dom';

class Login extends React.Component {
    constructor(props) {
      super(props);
      this.state = {employee_id: '',
                    pass:'',
                    redirect:false
                  };
  
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
        if(data.success){
          
          this.props.setEmpname(data.name);
          this.props.setEmpid(this.state.employee_id);
          localStorage.setItem('emp_id', this.state.employee_id);
          localStorage.setItem('emp_name', data.name);
          this.setState({redirect : true});
        }
        else
          alert(data.message);
    }
  
    render() {
      if(this.state.redirect==false){
      return (
        <div className="login-bg">
          <form className="login-form" onSubmit={this.handleSubmit}>
            <h2 style={{color: "white"}}><center>Sign in</center></h2>
            <br/>  
            <input className="form-input" id="txt-input" name="employee_id" type="text" placeholder="Employee Id" required value={this.state.employee_id} onChange={this.handleChange}/>
            <br/><br/>                    
            <input className="form-input" id="pwd" name ="pass" type="password" placeholder="Password" required value={this.state.pass} onChange={this.handleChange}/>
            <br/>                   
            <button className="login-btn" type="submit"><b>Log In </b></button>      
          </form>
        </div>
      );
    }
    else{
      return(
        <Redirect push to='/home' />
      )
    }
    }
  }

export default Login;