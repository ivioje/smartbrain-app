import React from 'react'

const Rank = ({ user }) => {
   //console.log(user.name);
    return (
        <div className='tc'>
            <div className='white f3'>
                <p>{user.name}, your current rank is...</p>
            </div>
            <div className='white f1'>
            {user.entries}
            </div>
        </div>
    )
}

export default Rank