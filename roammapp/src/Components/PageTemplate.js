import React,{useState,useEffect} from 'react';
import { Col, Row, Container, Table, Form } from 'react-bootstrap';
import NavBar from '../Components/NavBar';
import SideNavbar from '../Components/SideNavbar';
import '../index.css'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import AlertBox from '../Components/AlertBox'



function PageTemplate({child}){

    return(
        <div style={{height:"100%",overflowY:"auto"}} className="bg-image">
            <NavBar/>
            <div style={{height:"inherit"}}>
                <Container style={{height:"100%"}}>
                    <Row style={{height:"100%"}}>
                        <Col lg={2} style={{height:"75%"}}>
                        <SideNavbar list={["Campaign Dashboard","Create Participant","Configure Watch"]} active={2} links={["/campaignDashboard","/createParticipant","/configureWatch"]}/>
                        </Col>
                        <Col style={{height: "75%"}}>
                        {/* {alertShow[0]?(alertShow[1] == "danger"? <AlertBox type="danger" message={errorMsg}/>:<></>):<></>} */}
                            <h2>Create Campaign</h2>
                            <hr/>
                            <Container className="p-4" style={{background:"rgba(255,255,255,0.3)",height:"inherit",overflowY:"auto"}}>
                                



                            {child}







                                
                            </Container>
                            
                        </Col>
                    </Row>
                </Container>
            </div>

        </div>

    );
}




export default PageTemplate;
