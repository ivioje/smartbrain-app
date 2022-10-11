import React from 'react';
import './faceRecognition.css'

const FaceRecognition = ({ imageUrl }) => {
    return (
        <div className='center ma'>
            <div className='absolute mt2 img'>
                <img id='inputImage' src={imageUrl} alt='' width='500px' height='auto' />
            </div>
        </div>
    )
}

export default FaceRecognition