import React from 'react';
import './components/CSS/App.css';
import Navbar from './components/JS/Navbar/navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import dashboard from './components/JS/Pages/Dashboard';
import RiskChart from './components/JS/Pages/RiskChart';
import ResourceTeam from './components/JS/Pages/ResourceTeam';

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