import React, {useState} from 'react';
import Home from './components/Home';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './components/JS/Login/login';
import ProtectedRoute from './components/ProtectedRoute';
//loads dashboard as the default component

function App() {
  const [emp_id, setEmpid]=useState(localStorage.getItem('emp_id'));
  const [emp_name, setEmpname]=useState(localStorage.getItem('emp_name'));
  return (
    <>
      <Router>
        <Switch>
          <Route path='/' exact><Login setEmpid={setEmpid} setEmpname={setEmpname}/></Route>
          <ProtectedRoute path='/home' isAuth={emp_id} setEmpid={setEmpid} emp_name={emp_name}/>
        </Switch>
      </Router> 
    </>
  );
}

export default App;