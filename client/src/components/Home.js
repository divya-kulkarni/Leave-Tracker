import React from 'react';
import './CSS/App.css';
import Navbar from './JS/Navbar/navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import dashboard from './JS/Pages/Dashboard';
import RiskChart from './JS/Pages/RiskChart';
import ResourceTeam from './JS/Pages/ResourceTeam';

function Home(props) {
  return (
    <>
      <Router className='parent'>
        <Navbar className='child1' setEmpid={props.setEmpid} emp_name={props.emp_name}/>
        <Switch className='child2'>
          <Route path='/home' exact component={dashboard} />
          <Route path='/home/resources' component={ResourceTeam} />
          <Route path='/home/risk-chart' component={RiskChart} />
        </Switch>
      </Router>
    </>
  )
}

export default Home