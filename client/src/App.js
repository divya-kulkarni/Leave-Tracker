import React from 'react';
import './App.css';
import Navbar from './components/navbar/navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import dashboard from './pages/dashboard';
import RiskChart from './pages/risk-chart';
import ResourceTeam from './components/resource_teams';

//loads dashboard as the default component

function App() {
  return (
    <>
      <Router className='parent'>
        <Navbar className='child1' />
        <Switch className='child2'>
          <Route path='/' exact component={dashboard} />
          <Route path='/risk-chart' component={RiskChart} />
          <Route path='/resource-wise-chart' component={ResourceTeam} />
        </Switch>
      </Router>
    </>
  );
}

export default App;