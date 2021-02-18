import React, { useState } from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import { IconContext } from 'react-icons';
import { Grid } from '@material-ui/core';
import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


/**
 * Creates the header (navbar), sidebar with avatar component and its menu items.
 */

function Navbar() {
  const classes = useStyles();
  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <div className='navbar'>
          <Grid container justify="flex-end" style={{alignItems: 'center'}}>
            <button className = "logout-btn" name="logout" onClick={() => { alert('Logged Out!') }}><span>Logout</span></button>
          </Grid>
        </div>
        <div className='nav-menu'>
          <ul className='nav-menu-items'>
          <div className='avatar-item'>
            <div className={classes.root} >
              <Avatar alt="Jordan Fisher" src="./components/images/jordan-avatar.jpg" className={classes.large}/>
            </div>
            <h4 className='nav-text'>Jordan Fisher</h4>
          </div>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
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


/**
 * custom class for circular avatar and its size.
 */

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  large: {
    width: theme.spacing(9),
    height: theme.spacing(9),
  },
}));


export default Navbar;