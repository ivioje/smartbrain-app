import React from 'react'

const Rank = ({ user }) => {
   // console.log(Object.values(user)[0].name);
    return (
        <div className='tc'>
            <div className='white f3'>
                <p>{Object.values(user)[0].name}, your current rank is...</p>
            </div>
            <div className='white f1'>
            {Object.values(user)[0].entries}
            </div>
        </div>
    )
}

export default Rank