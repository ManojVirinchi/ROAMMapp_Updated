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

function CreateManager(props){
    const [currentSideActive, setCurrentSideActive] = useState(3)
    const [selectValue, setSelectValue] = useState("totalPar");
    const [order, setOrder] = useState("normal")
    const [alertShow,setAlertShow] = useState([false,""])
    const [errorMsg,setErrorMsg] = useState("");

    
    const info = {
        manager_id: "",
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
                if(role=="manger" || role == "coordinator"){
                    navigate("/managerDashboard")
                }
                else{
                    if(role == "participant"){
                        navigate("/participantDashboard")
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
        //await props.createManagerAction(infoObject)
        await handleCreateManager()
        
        
    }

    const handleCreateManager = async() => {
        try{
            const response = await axios.post("https://aa2397tzu2-vpce-00569c5e62069a9a0.execute-api.us-east-1.amazonaws.com/roamm/new_manager_dashboard/new_create_manager", infoObject)
            if(response.data.statusCode != 200){
                setAlertShow([true,"danger"])
                setErrorMsg(response.data.body)
            }

            else{
                //create new user
                const createManagerInCognitoResponse = await axios.post("https://aa2397tzu2-vpce-00569c5e62069a9a0.execute-api.us-east-1.amazonaws.com/roamm/new_create_cognito_user", {role: "manager", name: infoObject.name, email: infoObject.email, id: infoObject.manager_id})
                console.log(createManagerInCognitoResponse)
                if(createManagerInCognitoResponse.data.status != 200){
                    setAlertShow([true,"danger"])
                    setErrorMsg(createManagerInCognitoResponse.data.body)
            }
            else{
                setAlertShow([false,"success"])
                setErrorMsg("")
                navigate("/adminDashboard")
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
                        <SideNavbar list={["Manager List", "Create Manager"]} active={1} links={["/adminDashboard","/createManager"]}/>
                        </Col>
                        <Col style={{height: "75%"}}>
                        {alertShow[0]?(alertShow[1] == "danger"? <AlertBox type="danger" message={errorMsg}/>:<></>):<></>}
                            <h2>Create Manager</h2>
                            <hr/>
                            <Container className="p-4" style={{background:"rgba(255,255,255,0.3)",height:"inherit",overflowY:"auto"}}>
                                <Form onSubmit={(e) => {e.preventDefault(); handleSubmit()}}>
                        
                                    <Col>
                                            <Form.Group>
                                                <Form.Label>Manager Id</Form.Label>
                                                <Form.Control type='text' style={{background:"rgba(0,0,0,0.05)"}} onChange={(e)=>{handleInfo(e,"manager_id")}} />
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
                                            <button onClick={()=>{handleSubmit()}} className="btn btn-primary mt-5">Create Manager</button>
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


export default connect(mapStateToProps,mapDispatchToProps)(CreateManager);
