import React,{useState,useEffect} from 'react';
import { Col, Row, Container, Table, Form } from 'react-bootstrap';
import NavBar from '../Components/NavBar';
import SideNavbar from '../Components/SideNavbar';
import '../index.css'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {createParticipantAction} from '../Store/Actions/participant'
import {connect} from 'react-redux'
import { proposalSyntaxPlugins } from '@babel/preset-env/lib/shipped-proposals';
import { Navigate, useNavigate } from 'react-router-dom';
import {Auth} from 'aws-amplify'
import AlertBox from '../Components/AlertBox'
import axios from 'axios';


function CreateParticipant(props){
    const [currentSideActive, setCurrentSideActive] = useState(3)
    const [selectValue, setSelectValue] = useState("totalPar");
    const [order, setOrder] = useState("normal")
    const [alertShow,setAlertShow] = useState([false,""])
    const [errorMsg,setErrorMsg] = useState("");
    const navigate = useNavigate()


    const info = {
        manager_id: "",
        campaign_id:"",
        participant_id: "",
        // firstName: "",
        // middleName:"",
        // lastName: "",
        age:0,
        gender:"",
        race: "",
        ethnicity:"",
        // dob: "",
        email:"",
        // phone:"",
        // addressLine1:"",
        // addressLine2:"",
        // city:"",
        // state:"",
        // postalCode:""
    }

    const [infoObject, setInfoObject] = useState(info)

    useEffect(() =>{
        Auth.currentSession().then(session=>{
            if(session.isValid()){
                let role = session.getIdToken().payload["custom:role"];
                if(role=="admin"){
                    navigate("/campaignDashboard")
                }
                else if(role=="participant"){
                    navigate("/participantDetails")
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
    })

    const handleInfo = (e, key) =>{
        const newObject = {...infoObject}
        newObject[key] = e.target.value
        setInfoObject(newObject)
    }

    const handleSubmit = async (e)=>{
        // infoObject.manager_id = props.state.managerId
        // infoObject.campaign_id = props.state.campaignId
        // await props.createParticipantAction(infoObject)
        // navigate("/campaignDashboard")
        handleCreateParticipant()
    }

    const handleCreateParticipant = async () =>{
        try{
            infoObject.manager_id = localStorage.getItem("managerId")
            infoObject.campaign_id = localStorage.getItem("campaignId")
            const response = await axios.post("https://aa2397tzu2-vpce-00569c5e62069a9a0.execute-api.us-east-1.amazonaws.com/roamm/new_manager_dashboard/new_create_participant",infoObject)
            if(response.data.statusCode != 200){
                setAlertShow([true,"danger"])
                setErrorMsg(JSON.parse(response.data.body).message)
            }
            else{
                setAlertShow([true,"success"])
                setErrorMsg("Participant Created Successfully")
                setTimeout(()=>{navigate("/campaignDashboard")},2000)
                
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
                        <SideNavbar list={["Campaign Dashboard","Create Participant","Configure Watch"]} active={1} links={["/campaignDashboard","/createParticipant","/configureWatch"]}/>
                        </Col>
                        <Col style={{height: "75%"}}>
                        {alertShow[0]?(alertShow[1] == "danger"? <AlertBox type="danger" message={errorMsg}/>:<></>):<></>}
                            <h2>Create Particiapant</h2>
                            <hr/>
                            <Container className="p-4" style={{background:"rgba(255,255,255,0.3)",height:"inherit",overflowY:"auto"}}>
                                <Form onSubmit={(e) => {e.preventDefault(); handleSubmit()}}>
                                    <Row>
                                    <Col>
                                            <Form.Group>
                                                <Form.Label>Participant Id</Form.Label>
                                                <Form.Control type='text' style={{background:"rgba(0,0,0,0.05)"}} onChange={(e)=>{handleInfo(e,"participant_id")}} />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>Age</Form.Label>
                                                <Form.Control type='number' style={{background:"rgba(0,0,0,0.05)"}} placeholder='Age'  onChange={(e)=>{handleInfo(e,"age")}} />
                                            </Form.Group>
                                        </Col>
                                        {/* <Col>
                                            <Form.Group>
                                                <Form.Label>First Name</Form.Label>
                                                <Form.Control type='text' style={{background:"rgba(0,0,0,0.05)"}}  onChange={(e)=>{handleInfo(e,"firstName")}} />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>Middle Name</Form.Label>
                                                <Form.Control type='text' style={{background:"rgba(0,0,0,0.05)"}}  onChange={(e)=>{handleInfo(e,"middleName")}} />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>Last Name</Form.Label>
                                                <Form.Control type='text' style={{background:"rgba(0,0,0,0.05)"}}  onChange={(e)=>{handleInfo(e,"lastName")}} />
                                            </Form.Group>
                                        </Col> */}
                                    </Row>

                                    <Row className='mt-4'>
                                    
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>What best describes the participant’s gender?</Form.Label>
                                                <Form.Select style={{background:"rgba(0,0,0,0.05)"}} placeholder={"What best describes the participant’s gender"}  onChange={(e)=>{handleInfo(e,"gender")}} >
                                                    <option value="">Select from below options</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Intersex">Intersex</option>
                                                    <option value="None of these">None of these describe the participant</option>
                                                    <option value="Refused">Refused to provide information</option> 
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>What best describes the participants race?</Form.Label>
                                                <Form.Select type='text' style={{background:"rgba(0,0,0,0.05)"}}  onChange={(e)=>{handleInfo(e,"race")}} >
                                                    <option value="">Select from below options</option> 
                                                    <option value="White">White</option>
                                                    <option value="Black or African American">Black or African American</option>
                                                    <option value="American Indian or Alaska Native">American Indian or Alaska Native</option>
                                                    <option value="Asian">Asian</option>
                                                    <option value="Native Hawaiian or other Pacific Islander">Native Hawaiian or other Pacific Islander</option>
                                                    <option value="More than one">More than one race</option>
                                                    <option value="Other">Other</option>
                                                    <option value="Refused">Refused to provide information</option> 
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        
                                        </Row>

                                        <Row className='mt-4'>
                                        {/* <Col>
                                            <Form.Group>
                                                <Form.Label>Date Of Birth</Form.Label>
                                                <Form.Control type='date' style={{background:"rgba(0,0,0,0.05)"}} placeholder='MM/DD/YYYY'  onChange={(e)=>{handleInfo(e,"dob")}} />
                                            </Form.Group>
                                        </Col> */}
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>What best describes the participants ethnicity?</Form.Label>
                                                <Form.Select type='text' style={{background:"rgba(0,0,0,0.05)"}}  onChange={(e)=>{handleInfo(e,"ethnicity")}} >
                                                    <option value="">Select from below options</option> 
                                                    <option value="Hispanic or Latino">Hispanic or Latino</option>
                                                    <option value="Not Hispanic or Latino">Not Hispanic or Latino</option>
                                                    <option value="Refused to provide information">Refused to provide information</option> 
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control type='email' style={{background:"rgba(0,0,0,0.05)"}}  onChange={(e)=>{handleInfo(e,"email")}} />
                                            </Form.Group>
                                        </Col>
                                        {/* <Col>
                                            <Form.Group>
                                                <Form.Label>Phone Number</Form.Label>
                                                <Form.Control type='text' style={{background:"rgba(0,0,0,0.05)"}}  onChange={(e)=>{handleInfo(e,"phone")}} />
                                            </Form.Group>
                                        </Col> */}
                                        </Row>
                                    



                                   
                                        {/* <Col className='mt-4'>
                                            <Form.Group>
                                                <Form.Label>Address Line 1</Form.Label>
                                                <Form.Control type='text' style={{background:"rgba(0,0,0,0.05)"}}  onChange={(e)=>{handleInfo(e,"addressLine1")}} />
                                            </Form.Group>
                                        </Col>
                                        <Col className='mt-4'>
                                            <Form.Group>
                                                <Form.Label>Address Line 2</Form.Label>
                                                <Form.Control type='text' style={{background:"rgba(0,0,0,0.05)"}}  onChange={(e)=>{handleInfo(e,"addressLine2")}} />
                                            </Form.Group>
                                        </Col>
                                   */}

                                        {/* <Row className='mt-4'>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>City</Form.Label>
                                                <Form.Control type='text' style={{background:"rgba(0,0,0,0.05)"}}  onChange={(e)=>{handleInfo(e,"city")}} />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>State/Province</Form.Label>
                                                <Form.Control type='text'style={{background:"rgba(0,0,0,0.05)"}}  onChange={(e)=>{handleInfo(e,"state")}} />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>Postal Code</Form.Label>
                                                <Form.Control type='text' style={{background:"rgba(0,0,0,0.05)"}}  onChange={(e)=>{handleInfo(e,"postalCode")}} />
                                            </Form.Group>
                                        </Col>
                                        </Row> */}
                                    

                                    <Row>
                                        <Col>
                                            <button onClick={()=>{handleSubmit()}} className="btn btn-primary mt-5">Create Participant</button>
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
        createParticipantAction: (participantInfo)=> dispatch(createParticipantAction(participantInfo))
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(CreateParticipant);
