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

function CreateCoordinator(props){
    const [currentSideActive, setCurrentSideActive] = useState(3)
    const [selectValue, setSelectValue] = useState("totalPar");
    const [order, setOrder] = useState("normal")
    const [alertShow,setAlertShow] = useState([false,""])
    const [errorMsg,setErrorMsg] = useState("");

    
    const info = {
        coordinatorid: "",
        name:"",
        department:"",
        email:"",
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
                else{
                    if(role == "participant"){
                        navigate("/participantDashboard")
                    }
                    else{
                        if(role == "admin"){
                            navigate("/managerDashboard")
                        }
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
        handleCreateCoordinator()
    }

    const handleCreateCoordinator = async() => {
        try{
            const response = await axios.post("https://aa2397tzu2-vpce-00569c5e62069a9a0.execute-api.us-east-1.amazonaws.com/roamm/new_create_coordinator", infoObject)
            if(response.data.statusCode != 200){
                setAlertShow([true,"danger"])
                setErrorMsg(response.data.body)
            }

            else{
                //create new user
                const createManagerInCognitoResponse = await axios.post("https://aa2397tzu2-vpce-00569c5e62069a9a0.execute-api.us-east-1.amazonaws.com/roamm/new_create_cognito_user", {role: "coordinator", name: infoObject.name, email: infoObject.email, id: infoObject.coordinatorid})
                console.log(createManagerInCognitoResponse)
                if(createManagerInCognitoResponse.data.status != 200){
                    setAlertShow([true,"danger"])
                    setErrorMsg(createManagerInCognitoResponse.data.body)
            }
            else{
                setAlertShow([false,"success"])
                setErrorMsg("")
                navigate("/managerDashboard")
            }
            }
            
        }
        catch(err){
            setAlertShow([true,"danger"])
            setErrorMsg(err.message)
            console.log(err)
        }
    }
   
    return(
        <div style={{height:"100%",overflowY:"auto"}} className="bg-image">
            <NavBar/>
            <div style={{height:"inherit"}}>
                <Container style={{height:"100%"}}>
                    <Row style={{height:"100%"}}>
                        <Col lg={2} style={{height:"75%"}}>
                        <SideNavbar list={["Campaign List", "Create Campaign","Edit Campaign", "Create Coordinator", "Coordinator Permissions", "Edit Watch Configuration"]} active={3} links={["/managerDashboard","/createCampaign","/editCampaign","/createCoordinator","/coordinatorPermission","/editConfigureWatch"]}/>                        </Col>
                        <Col style={{height: "75%"}}>
                        {alertShow[0]?(alertShow[1] == "danger"? <AlertBox type="danger" message={errorMsg}/>:<></>):<></>}
                            <h2>Create Coordinator</h2>
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
                                                <Form.Label>Name</Form.Label>
                                                <Form.Control type='text' style={{background:"rgba(0,0,0,0.05)"}} placeholder='Name'  onChange={(e)=>{handleInfo(e,"name")}} />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>Department</Form.Label>
                                                <Form.Control type='text' style={{background:"rgba(0,0,0,0.05)"}} placeholder='Department'  onChange={(e)=>{handleInfo(e,"department")}} />
                                            </Form.Group>
                                        </Col>
                              
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control type='email' style={{background:"rgba(0,0,0,0.05)"}}  onChange={(e)=>{handleInfo(e,"email")}} />
                                            </Form.Group>
                                        </Col>

                                    <Row>
                                        <Col>
                                            <button type='submit' className="btn btn-primary mt-5">Create Coordinator</button>
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
        createManagerAction: (managerInfo)=> dispatch(createManagerAction(managerInfo))
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(CreateCoordinator);
