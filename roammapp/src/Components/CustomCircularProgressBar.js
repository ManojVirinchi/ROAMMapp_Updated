import React from 'react'
// import { CircularProgressbar,buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import CircularProgressBar from 'react-svg-circular-progressbar'

function CustomCircularProgressBar({progress=0,text=0}){
    return( 
    <CircularProgressBar  size={135} progress={progress} rotate={-90} trackWidth={15} trackColor="grey" indicatorWidth={15} indicatorColor="rgba(79, 119, 170, 1)" indicatorCap="butt">
        <div style={{ fontSize:"24px",position: 'absolute', top: '52%', left: '55%', transform: 'translate(-50%, -50%)' }}>{`${text}%`}</div>
    </CircularProgressBar>);
}

export default CustomCircularProgressBar;