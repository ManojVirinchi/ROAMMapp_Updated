import React,{useState} from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card';
import '../Pages/css/Dashboard.css'
import {BiHome} from 'react-icons/bi'
import {IoAnalyticsSharp} from 'react-icons/io5'
import {BsWatch, BsPersonFill,BsBell,BsListUl} from 'react-icons/bs'
import {NavLink} from 'react-router-dom'
import { Nav } from 'react-bootstrap';

function SideNavbar({list,active,links}){
    //  const list_item = ["Dashboard","Create Manager","Analysis"]
    const [activeItem,setActiveItem] = useState(active);
    const handleListActive = (itemIndex) =>{
        setActiveItem(itemIndex);
    }
    const body = list.map((item,index) => {
        return  <NavLink key={index} to={links[index]}><div style={HomeNavigationStyle.button} className={`list-element ${index === activeItem?"active-element":""}`} onClick={()=>handleListActive(index)}>
            <span style={{width:"100%"}}>{item}</span>
            </div>
        <hr style={{margin:"0"}}/>
        </NavLink>

    })
    return(
    // <Col xs={12} lg={2} style={{height:"100%"}}>
        <Card style={{height:"100%", background:"rgb(255,255,255,0.3)",backdropFilter:"blur(5px)"}}>
            <Card.Body className='mt-5'>
                <h3 className='h3-element'>ROAMM</h3>
                <hr/>
                <div className="list">
                    {body}
                </div>
            </Card.Body>
        </Card>
    // </Col>
                    );
};

export default SideNavbar;

let HomeNavigationStyle = {
    icon: {
        fontSize: "small",
        marginRight: "5px"
    },
    button:{
        cursor:"pointer",
        display: "flex",
        alignItems: "center",
        // paddingLeft:"9px",
        fontWeight:700,
        fontSize: "larger",
        color:"black",
        textDecoration: "none"  
    }
    }



