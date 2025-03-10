import {Alert} from 'react-bootstrap'
import { FaThumbsUp } from "react-icons/fa";
import { ImCross } from "react-icons/im";
const AlertBox = ({type,message}) => {
return(
    <Alert variant={type} dismissible>
        <div style={{display:"flex",alignItems:"center"}}>
            {type == "success"?<FaThumbsUp style={{color:"darkgreen"}}/>:<></>}{type=="danger"?<ImCross style={{color:"darkred"}}/>:<></>}
            <span className="m-2" >{message}</span>
        </div>
    </Alert>
);
}

export default AlertBox
