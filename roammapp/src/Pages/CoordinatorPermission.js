import React,{useState,useEffect} from 'react';
import { Col, Row, Container, Table, Form } from 'react-bootstrap';
import NavBar from '../Components/NavBar';
import SideNavbar from '../Components/SideNavbar';
import '../index.css'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {createManagerAction} from '../Store/Actions/manager'
import {connect} from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom';
import AlertBox from '../Components/AlertBox'
import axios from 'axios';
import AWS from 'aws-sdk'
import {Auth} from 'aws-amplify';

function CoordinatorPermission(props){
    const [currentSideActive, setCurrentSideActive] = useState(3)
    const [selectValue, setSelectValue] = useState("totalPar");
    const [order, setOrder] = useState("normal")
    const [alertShow,setAlertShow] = useState([false,""])
    const [errorMsg,setErrorMsg] = useState("");
    const [campaignList, setCampaignList] = useState([])

    
    const info = {
        coordinatorid: "",
        campaignid: "",
        managerid: ""
    }


    const [infoObject, setInfoObject] = useState(info)
    const navigate = useNavigate()
    
    

    useEffect(()=>{
        // console.log(props)
        Auth.currentSession().then(session=>{
            if(session.isValid()){
                let role = session.getIdToken().payload["custom:role"];
                if(role == "coordinator"){
                    navigate("/coordinatorDashboard")
                }
                else if(role == "participant"){
                        navigate("/participantDashboard")
                    }
                else{
                    if(role == "admin"){
                        navigate("/managerDashboard")
                    }
                    else{
                        setInfoObject({...infoObject, managerid: localStorage.getItem("managerId")})
                        getTheCampaignList()
                    }
                }
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

    const handleInfo = (e, key) =>{
        const newObject = {...infoObject}
        newObject[key] = e.target.value
        setInfoObject(newObject)
    }

    const handleSubmit = async (e)=>{
        //await handleCreateCoordinator()
        handleCoordinatorPermission()
    }

    const handleCoordinatorPermission = async() => {
        try{
            const response = await axios.post("https://aa2397tzu2-vpce-00569c5e62069a9a0.execute-api.us-east-1.amazonaws.com/roamm/new_coordinator_permission", infoObject)
            if(response.data.statusCode != 200){
                setAlertShow([true,"danger"])
                setErrorMsg(response.data.body)
            }
            else{
                setAlertShow([false,"success"])
                setErrorMsg("")
                navigate("/managerDashboard")
            }
            
        }
        catch(err){
            setAlertShow([true,"danger"])
            setErrorMsg(err.message)
            console.log(err)
        }

    
    }

    const getTheCampaignList = async () => {
        try{
            const response = await axios.post("https://aa2397tzu2-vpce-00569c5e62069a9a0.execute-api.us-east-1.amazonaws.com/roamm/new_get_campaignlist",{
            manager_id : localStorage.getItem("managerId"),
            
        })
            console.log(response)
            setCampaignList(JSON.parse(response.data.body).campaigns)
        }
        catch(error){
            console.log(error)
        }
    }
   
    return(
        <div style={{height:"100%",overflowY:"auto"}} className="bg-image">
            <NavBar/>
            <div style={{height:"inherit"}}>
                <Container style={{height:"100%"}}>
                    <Row style={{height:"100%"}}>
                        <Col lg={2} style={{height:"75%"}}>
                        <SideNavbar list={["Campaign List", "Create Campaign","Edit Campaign", "Create Coordinator", "Coordinator Permissions", "Edit Watch Configuration"]} active={4} links={["/managerDashboard","/createCampaign","/editCampaign","/createCoordinator","/coordinatorPermission","/editConfigureWatch"]}/>
                        </Col>
                        <Col style={{height: "75%"}}>
                        {alertShow[0]?(alertShow[1] == "danger"? <AlertBox type="danger" message={errorMsg}/>:<></>):<></>}
                            <h2>Coordinator Permissions</h2>
                            <hr/>
                            <Container className="p-4" style={{background:"rgba(255,255,255,0.3)",height:"inherit",overflowY:"auto"}}>
                                <Form onSubmit={(e) => {e.preventDefault(); handleSubmit()}}>
                        
                                    <Col>
                                            <Form.Group>
                                                <Form.Label>Coordinator Id</Form.Label>
                                                <Form.Control type='text' style={{background:"rgba(0,0,0,0.05)"}} onChange={(e)=>{handleInfo(e,"coordinatorid")}} />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>Campaign Id</Form.Label>
                                                <Form.Select style={{background:"rgba(0,0,0,0.05)"}} onChange={(e)=>{handleInfo(e,"campaignid")}} >
                                                    <option key="" value="">Please Select a campaign from the dropdown</option>
                                                    {campaignList.map(campaign => (<option value={campaign}>{campaign}</option>))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    <Row>
                                        <Col>
                                            <button type='submit' className="btn btn-primary mt-5">Grant Permission</button>
                                        </Col>
                                    </Row>



                                </Form>
                            </Container>
                            
                        </Col>
                    </Row>
                </Container>
            </div>

        </div>

    );
}





export default CoordinatorPermission;
