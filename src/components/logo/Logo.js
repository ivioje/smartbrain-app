import React from 'react';
import './logo.css';
import Tilt from 'react-parallax-tilt';
import brain from './brain.png'

const Logo = () => {
    return (
        <div className='ma4 mt0' style={{ height: '100px', width: '100px' }}>
            <Tilt>
                <div style={{ height: '100px', width: '100px', paddingTop: '15px' }} className='logo pa3'>
                    <img src={brain} alt='logo' />
                </div>
            </Tilt>

        </div>
    )
}

export default Logo