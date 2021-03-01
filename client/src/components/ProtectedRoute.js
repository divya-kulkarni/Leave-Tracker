import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import Home from './Home';

/**
 * function name - ProtectedRoute()
 * Paramenters - isAuth (variable used to chekc if the user is authenticated or not)
 *               Rest (stores rest of parameters passed from parent component)
 * 
 * Use - Returns aroute ot homepage if the user is authorized otherwise
 *       sends him/her back to login screen.
 * 
 */

function ProtectedRoute({isAuth:isAuth,...Rest}){
    return(
        <Route 
            render={()=>{
                if(isAuth!=null){
                    return <Home setEmpid={Rest.setEmpid} emp_name={Rest.emp_name} emp_id={isAuth}/>;
                }
                else{
                    return <Redirect to='/'/>;
                }
            }}
        />

    );
}

export default ProtectedRoute;