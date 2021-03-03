import React from 'react';
import image from '../CSS/error-img.png';

// import PageNotFound from '../assets/images/PageNotFound';
class NotFoundPage extends React.Component {
    render() {
        return (
            <div style={{ backgroundColor: '#060b26', height: '100vh', width: '100vw' }}>
                <link rel="preconnect" href="https://fonts.gstatic.com"/>
                <link href="https://fonts.googleapis.com/css2?family=Recursive:wght@600&display=swap" rel="stylesheet"></link>

                <div style={{backgroundColor: '#060b26', paddingTop: '10vh'}}>
                    <center style={{ color: 'white' }}>
                        <img src={image} alt="error_image" height="300px" width= "300px"></img>
                        <br /><br />
                        <h4><b>The page you were looking for does not exist.</b></h4>
                        <h6>You may have mistyped the address or the page may have moved.</h6>
                        <br/><br/><br/>
                        <h1 style={{fontFamily:'Recursive',color:'white',fontSize:'60px'}}>Riskly</h1>
                    </center>
                </div>
            </div>
        );
    }
}
export default NotFoundPage;