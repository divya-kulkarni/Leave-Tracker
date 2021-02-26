import React from 'react';
import './CSS/App.css';
import Navbar from './JS/Navbar/navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import dashboard from './JS/Pages/Dashboard';
import RiskChart from './JS/Pages/RiskChart';
import ResourceTeam from './JS/Pages/ResourceTeam';

function Home() {
  return (
    <>
      <Router className='parent'>
        <Navbar className='child1' />
        <Switch className='child2'>
          <Route path='/' exact component={dashboard} />
          <Route path='/resources' component={ResourceTeam} />
          <Route path='/risk-chart' component={RiskChart} />
        </Switch>
      </Router>
    </>
  )
}

export default Home