import React from 'react';
import { Link } from 'react-router-dom';
// import PageNotFound from '../assets/images/PageNotFound';
class NotFoundPage extends React.Component{
    render(){
        return <div>
        <center>
            <h2>404</h2>
            <h3>Page does not exist!</h3>
            </center>
          </div>;
    }
}
export default NotFoundPage;