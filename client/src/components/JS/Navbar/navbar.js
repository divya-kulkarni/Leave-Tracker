import React, { useState } from 'react';
import '../../CSS/navbar.css';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import { IconContext } from 'react-icons';
import { Grid } from '@material-ui/core';
import { Avatar } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

/**
 * custom class for circular avatar and its size.
 */

const useStyles = theme => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  large: {
    width: theme.spacing(9),
    height: theme.spacing(9),
    backgroundColor: '#212121'
  },
});


/**
 * Creates the header (navbar), sidebar with avatar component and its menu items.
 * Class - Navbar
 * Parameters - props.setEmpid: sets employee ID for current logged in user
 *              state.path : links navbar tabs to each other
 * Use - creates header at the top of the webpage, and sidebar for navigation 
 *       to other tabs.
 */

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    const pathname = window.location.pathname;
    this.state = { path: pathname };
    var paths = SidebarData.map(dat=>dat.path);
    if(!paths.includes(pathname))
      window.location.href = '/404';
  }

  render() {
    const { classes } = this.props;
    return (
      <>
        <IconContext.Provider value={{ color: '#fff' }}>
          <div className='navbar'>
            <Grid container justify="flex-end" style={{ alignItems: 'center' }}>
              <button className="logout-btn" name="logout"
                onClick={() => { localStorage.clear(); this.props.setEmpid(null); }}>
                <span>Logout</span>
              </button>
            </Grid>
          </div>
          <div className='nav-menu'>
            <ul className='nav-menu-items active'>
              <div className='avatar-item'>
                <div className={classes.root} >
                  <Avatar alt={this.props.emp_name.toUpperCase()}
                    src="E:\Study Material\BLUEpineapple\Leave-Tracker\client\src\components\CSS\error-img.png"
                    className={classes.large} />
                </div>
                <h4 className='avatar'>{this.props.emp_name.toUpperCase()}</h4>
              </div>
              {SidebarData.map((item, index) => {
                return (
                  <li key={index} className={item.cName}
                    id={item.path == this.state.path ? "active" : ""}
                    onClick={() => this.setState({ path: item.path })}>
                    <Link to={item.path}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </IconContext.Provider>
      </>
    );
  }
}

export default withStyles(useStyles)(Navbar);