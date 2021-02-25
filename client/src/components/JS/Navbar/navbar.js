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
  },
});


/**
 * Creates the header (navbar), sidebar with avatar component and its menu items.
 */

class Navbar extends React.Component{
  constructor(props){
    super(props)
    this.state={link:'Dashboard'};
  
  //const [link,setLink] = useState('Dashboard')
  }
  
  render(){
    const {classes} = this.props;
    return (
      <>
        <IconContext.Provider value={{ color: '#fff' }}>
          <div className='navbar'>
            <Grid container justify="flex-end" style={{alignItems: 'center'}}>
              <button className = "logout-btn" name="logout" onClick={() => { alert('Logged Out!') }}><span>Logout</span></button>
            </Grid>
          </div>
          <div className='nav-menu'>
            <ul className='nav-menu-items active'>
            <div className='avatar-item'>
              <div className={classes.root} >
                <Avatar alt="Jordan" src="./components/images/jordan-avatar.jpg" className={classes.large}/>
              </div>
              <h4 className='avatar'>Jordan</h4>
            </div>
              {SidebarData.map((item, index) => {
                return (
                  <li key={index} className={item.cName} id={item.title == this.state.link ? "active": ""} onClick={()=>this.setState({link:item.title})}>
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