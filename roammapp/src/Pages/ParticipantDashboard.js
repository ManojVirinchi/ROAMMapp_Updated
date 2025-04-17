import React,{useState,useEffect} from 'react';
import { Col, Row, Container, Table, Form ,Card} from 'react-bootstrap';
import NavBar from '../Components/NavBar'

import SideNavbar from '../Components/SideNavbar';
import '../index.css'
import {connect} from "react-redux"
import {getParticipantInfo} from '../Store/Actions/participant'
import AlertBox from '../Components/AlertBox'
import axios from 'axios';
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Loader from '../Components/Loader';
import {Auth} from 'aws-amplify'


function ParticipantDashboard(props){
    
    const [participantInfo, setParticipantInfo] = useState({participant_id:""})
    const [notifications, setNotifications] = useState([])
    const [alertShow,setAlertShow] = useState(false)
    const [errorMsg,setErrorMsg] = useState("");
    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    

    useEffect(()=>{
        //handleInfo()

        Auth.currentSession().then(session=>{
            if(session.isValid()){
                let role = session.getIdToken().payload["custom:role"];
               if(role == "participant"){
                        setLoader(true) 
                        localStorage.setItem("participantId",session.getIdToken().payload["custom:id"])
                        localStorage.setItem("campaignId",session.getIdToken().payload["custom:campaignid"])
                        localStorage.setItem("managerId",session.getIdToken().payload["custom:managerid"])
                        console.log(localStorage.getItem("participantId"))
                        
                    }
                    handleInfoDummmy()
                }
            else{
                Auth.signOut()
                navigate("/")     
            }
        }).catch(error => {
            Auth.signOut()
            navigate("/")
        })
        
    },[])

    useEffect(()=>{
        
        localStorage.setItem('startDate',participantInfo.starttime)
        localStorage.setItem('endDate', participantInfo.endtime)
    },[participantInfo])

    // useEffect(()=>{    
    //     setParticipantInfo(props.participant.participantInfo)
    //     setNotifications(props.participant.notifications)
    // },[props.participant])

    const handleInfoDummmy = async() =>{
        setLoader(true)
        try{
            const requestData = {
                manager_id : localStorage.getItem("managerId"),
                campaign_id: localStorage.getItem("campaignId"),
                participant_id: localStorage.getItem("participantId")
    
            }
            
            const response = await axios.post("https://aa2397tzu2-vpce-00569c5e62069a9a0.execute-api.us-east-1.amazonaws.com/roamm/new_participant_dashboard",requestData)
            console.log(response)
            if(response.data.statusCode != 200){
                // setLoader(true)
                setAlertShow([true,"danger"])
                setErrorMsg(response.data.body)
            }
            else{
                // setParticipantInfo(response.data)
                if(JSON.parse(response.data.body).length == 0){
                    setErrorMsg("No Participant Information found.")
                    setAlertShow([true,"No Participant Information found."])
                    setLoader(true)
                }
                else{
                    setParticipantInfo(JSON.parse(response.data.body)[0])
                   
                    setLoader(false)
                    setAlertShow(false)
                }
                
            }
        }
        catch(err){
            setLoader(true)
            setAlertShow([true,"danger"])
            setErrorMsg(err.message)
            console.log(err)
        }
    }


    const notificationRows = notifications.map(notification => {
        return(
            <div style={{ marginTop:"10px",padding: "10px", background:"rgba(170, 201, 221, 0.4)",borderRadius:"5px", color:"black", }}>
                {notification}
            </div>
        );
    });
    return(
        <div style={{height:"100%",overflowY:"auto"}} className="bg-image">
            <NavBar/>
            <div style={{height:"inherit"}}>
                <Container fluid style={{height:"100%"}}>
                    <Row style={{height:"100%"}}>
                        <Col lg={2} style={{height:"75%"}}>
                            <SideNavbar list={["Participant Information", "Analytics","Cognitive"]} active={0} links={["/participantDashboard","/participantAnalysis","/cognitive"]}/>
                        </Col>
                        <Col style={{height: "75%"}}>
                            {alertShow?(alertShow[1] == "danger"? <AlertBox type="danger" message={errorMsg}/>:<></>):<></>}
                            <h2><FaArrowLeft style={{fontSize:"22px"}} onClick={()=>{navigate("/campaignDashboard")}}/> Participant Information</h2>
                            <hr/>
                            <div style={{height:"85%"}}>
                                {loader? <Loader/>: (<Row style={{height:"100%"}}>
                                    {/* <Col sm={5} style={{height:"100%"}}> */}
                                    <Col style={{height:"100%"}}>
                                     {/* <Row className='participant-container mt-3'>
                                         <Col>
                                             <Form.Label>First Name: </Form.Label> 
                                             <Form.Control disabled value={participantInfo.firstName} />
                                         </Col>
                                         <Col>
                                             <Form.Label>Middle Name: </Form.Label> 
                                             <Form.Control disabled value={participantInfo.middleName} />
                                         </Col>
                                         <Col>
                                             <Form.Label>Last Name: </Form.Label> 
                                             <Form.Control disabled value={participantInfo.lastName} />
                                         </Col>
                                     </Row> */}

                                     {/* <Row className='mt-4 participant-container'> */}
                                        <Col className="mt-4 participant-container">
                                            <Form.Label>Participant Id</Form.Label>
                                            <Form.Control disabled value={participantInfo.participant_id}/>
                                        </Col>
                                     <Col className="mt-4 participant-container">
                                         <Form.Label>Age  </Form.Label>
                                         <Form.Control disabled value={participantInfo.age}/>
                                     </Col>
                                     <Col className="mt-4 participant-container">
                                     <Form.Label>Gender  </Form.Label>
                                     <Form.Control disabled value={participantInfo.gender}/>
                                     </Col>
                                     <Col className="mt-4 participant-container">
                                     <Form.Label>Race  </Form.Label>
                                     <Form.Control disabled value={participantInfo.race}/>
                                     </Col>
                                     
                                     {/* <Col>
                                     <Form.Label>Ethnicity  </Form.Label>
                                     <Form.Control disabled value={participantInfo.ethnicity}/>
                                     </Col> */}
                                 {/* </Row> */}






                                 {/* <Row className='mt-4 participant-container'> */}
                                    <Col className="mt-4 participant-container">
                                        <Form.Label>Ethnicity  </Form.Label>
                                        <Form.Control disabled value={participantInfo.ethnicity}/>
                                     </Col>
                                     <Col className="mt-4 participant-container">
                                         <Form.Label>Email:  </Form.Label>
                                         <Form.Control disabled value={participantInfo.email}/>
                                     </Col>
                                     {/* <Col>
                                     <Form.Label>Phone:  </Form.Label>
                                     <Form.Control disabled value={participantInfo.phone}/>
                                     </Col> */}
                                     <Col className="mt-4 participant-container">
                                     <Form.Label>Start Date:  </Form.Label>
                                     <Form.Control disabled value={participantInfo.starttime}/>
                                     </Col>
                                     <Col className="mt-4 participant-container">
                                     <Form.Label>End Date:  </Form.Label>
                                     <Form.Control disabled value={participantInfo.endtime}/>
                                 </Col>
                                 {/* </Row> */}
                                 {/* <Row  className="mt-4 participant-container">
                                 <Col sm={4}>
                                     <Form.Label>End Date:  </Form.Label>
                                     <Form.Control disabled value={participantInfo.endDate}/>
                                 </Col>
                                 <Col sm={6}>
                                     <Form.Label>Address  </Form.Label>
                                     <Form.Control as="textarea" rows={3} disabled value={String(participantInfo.addressLine1+"\n"+participantInfo.addressLine2+"\n"+participantInfo.pincode)}/>
                                     </Col>
                                     <Col>
                                     </Col>
                                 </Row> */}

                            
                                    </Col>
                                
                                </Row>)}
                                    
                                    
                                    
                                
                            </div>
                            
                        </Col>
                        <Col sm={12} lg={3}  style={{height:"88%"}}>
                            <Card style={{height:"inherit", background:"rgb(255,255,255,0.3)",backdropFilter:"blur(5px)"}}>
                                <Card.Header><h4>Notifications</h4></Card.Header>
                                <Card.Body>
                                    {notificationRows}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>

        </div>
    );

}

const mapStateToProps = (state,ownProps) =>{
    return {
        user: state.user,
        manager: state.manager,
        campaign: state.campaign,
        state: state.state,
        participant: state.participant
    }
}

const mapDispatchToProps = (dispatch) =>{
    return{
        getParticipantInfo: (managerId,campaignId,participantId) => dispatch(getParticipantInfo(managerId,campaignId,participantId))
    }
}



export default connect(mapStateToProps,mapDispatchToProps)(ParticipantDashboard);

