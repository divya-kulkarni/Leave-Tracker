import React from 'react';
import image from '../CSS/error-img.png';

// import PageNotFound from '../assets/images/PageNotFound';
class NotFoundPage extends React.Component {
    render() {
        return (
            <div style={{ backgroundColor: '#060b26', height: '100vh', width: '100vw' }}>
                <div style={{backgroundColor: '#060b26', paddingTop: '10vh'}}>
                    <center style={{ color: 'white' }}>
                        <img src={image} alt="error_image" height="300px" width= "300px"></img>
                        <br /><br />
                        <h4><b>The page you were looking for does not exist.</b></h4>
                        <h6>You may have mistyped the address or the page may have moved.</h6>
                    </center>
                </div>
            </div>
        );
    }
}
export default NotFoundPage;