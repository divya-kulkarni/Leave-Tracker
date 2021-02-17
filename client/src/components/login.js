import React from 'react';

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
        <div className="card">
            <article className="card-body">
            <h4 className="card-title text-center mb-4 mt-1">Sign in</h4>
	        <hr/>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <input name="employee_id" type="text" className="form-control" value={this.state.employee_id} onChange={this.handleChange} placeholder="Employee id"/>
                    </div>
                    <div className="form-group">
                        <input name ="pass" type="password" className="form-control" value={this.state.pass} onChange={this.handleChange} placeholder="Password"/>
                    </div>
                    <div className="form-group">
	                    <button type="submit" className="btn btn-primary btn-block"> Login  </button>
	                </div>
                </form>
            </article>
        </div>
      );
    }
  }

export default Login;