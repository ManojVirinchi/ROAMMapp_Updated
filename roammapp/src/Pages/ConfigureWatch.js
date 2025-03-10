import React,{useState,useEffect} from 'react';
import { Col, Row, Container, Table, Form } from 'react-bootstrap';
import NavBar from '../Components/NavBar';
import SideNavbar from '../Components/SideNavbar';
import '../index.css'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {configureWatchAction} from '../Store/Actions/participant'
import {connect} from 'react-redux'
import { useNavigate } from 'react-router-dom';
import {Auth} from 'aws-amplify'
import AlertBox from '../Components/AlertBox'
import axios from 'axios';


function ConfigureWatch(props){
    const [currentSideActive, setCurrentSideActive] = useState(4)
    const [selectValue, setSelectValue] = useState("totalPar");
    const [order, setOrder] = useState("normal");
    const [campaignList, setCampaignList] = useState([])
    const [participantList, setParticipantList] = useState([])
    const [alertShow,setAlertShow] = useState([false,""])
    const [errorMsg,setErrorMsg] = useState("");
    const navigate = useNavigate()
    const [tempCampaignId, setTempCampaignId] = useState("")


    useEffect(()  => {
        Auth.currentSession().then(session=>
            {
                if(session.isValid()){
                    let role = session.getIdToken().payload["custom:role"];
                    if(role == "admin"){
                        navigate("/campaignDashboard")
                    }
                    else if(role == "participant"){
                        navigate("/participantDashboard")
                    }
                    else{
                        if(localStorage.getItem("managerId") == null ){
                            let id = session.getIdToken().payload["custom:id"];
                            localStorage.setItem("managerId",id) 
                        }
                        getTheCampaignList()
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
    
    useEffect(()=> async () => {
        
        
    },[])

    const getTheCampaignList = async () =>{
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

    const details = {
        campaign_id: "",
        participant_id: "",
        watchid: "",
        starttime: "",
        endtime: ""
    }
    const [configureDetails, setConfigureDetails] = useState(details) 

    
    const handleChange = (e, key) =>{
        if(key == "campaign_id"){
            setTempCampaignId(e.target.value)
        }
        const newObject = {...configureDetails}
        newObject[key] = e.target.value
        setConfigureDetails(newObject)
    }


    const handleSubmit = async () =>{
        console.log(props)
        configureDetails.manager_id = localStorage.getItem("managerId")
        handleConfigureWatch(configureDetails)
        //await props.configureWatch(configureDetails)
        //navigate("/campaignDashboard")
        
    }

    const handleConfigureWatch = async (configDetails) => {
        try{
            const response = await axios.post("https://aa2397tzu2-vpce-00569c5e62069a9a0.execute-api.us-east-1.amazonaws.com/roamm/new_config_watch",configDetails)
            if(response.data.statusCode != 200){
                setAlertShow([true,"danger"])
                setErrorMsg(JSON.parse(response.data.body).message)
            }
            else{
                navigate("/campaignDashboard")
            }
        }
        catch(err){
            setAlertShow([true,"danger"])
            setErrorMsg(err.message)
            console.log(err)
        }
    }

    const handleCampaignChange = async (e) =>{
        console.log("This campaign change")
        try{
            const response = await axios.post("https://aa2397tzu2-vpce-00569c5e62069a9a0.execute-api.us-east-1.amazonaws.com/roamm/new_get_participantlist",{
            manager_id : localStorage.getItem("managerId"),
            campaign_id : e.target.value //localStorage.getItem("campaignId")
        })
        if(response.data.statusCode != 200){
            setAlertShow([true,"danger"])
            setErrorMsg(JSON.parse(response.data.body).message)
        }
            console.log(response)
            setParticipantList(JSON.parse(response.data.body).participants)
        }
        catch(error){
            setAlertShow([true,"danger"])
            setErrorMsg(error.message)
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
                        <SideNavbar list={["Campaign Dashboard","Create Participant","Configure Watch"]} active={2} links={["/campaignDashboard","/createParticipant","/configureWatch"]}/>
                        </Col>
                        <Col style={{height: "75%"}}>
                        {alertShow[0]?(alertShow[1] == "danger"? <AlertBox type="danger" message={errorMsg}/>:<></>):<></>}
                            <h2>Configure Watch</h2>
                            <hr/>
                            <Container className="p-4" style={{background:"rgba(255,255,255,0.3)",height:"inherit",overflowY:"auto"}}>
                                <Form onSubmit={(e)=>{e.preventDefault(); handleSubmit()}}>
                            
                                        <Col className='mt-3'>
                                            <Form.Group>
                                                <Form.Label>Select Campaign</Form.Label>
                                            <Form.Select style={{background:"rgba(0,0,0,0.05)"}} onChange={(e)=>{handleChange(e, "campaign_id"); handleCampaignChange(e);}}>
                                                <option value="">select option</option>
                                                {campaignList.map((data)=>
                                                    (<option key={data} value={data}>{data}</option>)
                                                )}
                                            </Form.Select>
                                            </Form.Group>
                                        </Col>

                                        <Col className='mt-3'>
                                            <Form.Group>
                                                <Form.Label>Select Participant</Form.Label>
                                            <Form.Select style={{background:"rgba(0,0,0,0.05)"}}  onChange={(e)=>{handleChange(e, "participant_id")}}>
                                                <option>select option</option>
                                                {participantList.map((data)=>(<option key={data.participant_id} value={data.participant_id}>{data.participant_id}</option>))}
                                            </Form.Select>
                                            </Form.Group>
                                        </Col>

                                        <Col className='mt-3'>
                                        <Form.Group>
                                            <Form.Label>Enter Watch ID</Form.Label>
                                            <Form.Control type="text" style={{background:"rgba(0,0,0,0.05)"}}  onChange={(e)=>{handleChange(e, "watchid")}}/>
                                        </Form.Group>
                                        </Col>

                                        <Col className='mt-3'>
                                        <Form.Group>
                                            <Form.Label>Start Date</Form.Label>
                                            <Form.Control type="datetime-local" style={{background:"rgba(0,0,0,0.05)"}}  onChange={(e)=>{handleChange(e, "starttime")}}/>
                                        </Form.Group>
                                        </Col>

                                        <Col className='mt-3'>
                                        <Form.Group>
                                            <Form.Label>End Date</Form.Label>
                                            <Form.Control type="datetime-local" style={{background:"rgba(0,0,0,0.05)"}}  onChange={(e)=>{handleChange(e, "endtime")}}/>
                                        </Form.Group>
                                        </Col>







                                        <Col>
                                            <Form.Control type="submit" className='btn btn-primary mt-5' value={"Configure"} />
                                        </Col>


                                </Form>
                            </Container>
                            
                        </Col>
                    </Row>
                </Container>
            </div>

        </div>

    );
}

const mapStateToProps = (state) =>{
    return {
        user: state.user,
        manager: state.manager,
        campaign: state.campaign,
        state: state.state
    }
}

const mapDispatchToProps = (dispatch) =>{
    return{
        configureWatch: (configuration) => dispatch(configureWatchAction(configuration))
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(ConfigureWatch);
