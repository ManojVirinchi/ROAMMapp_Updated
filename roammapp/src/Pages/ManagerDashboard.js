import React,{useState,useEffect} from 'react';
import { Col, Row, Container,} from 'react-bootstrap';
import NavBar from '../Components/NavBar';
import SideNavbar from '../Components/SideNavbar';
import '../index.css'
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {connect,useDispatch,useSelector} from 'react-redux';
import {getCampaigns} from '../Store/Actions/manager'
import {setCampaignId} from '../Store/Actions/state'
import { useNavigate } from 'react-router-dom';
import AlertBox from '../Components/AlertBox'
import axios from 'axios';
import { FaArrowLeft } from "react-icons/fa";
import Loader from '../Components/Loader'
import {Auth} from 'aws-amplify';

function ManagerDashboard(props){

    const [currentSideActive, setCurrentSideActive] = useState(0)
    const [campaignList, setCampaignList] = useState([]);
    const navigate = useNavigate()
    const [alertShow,setAlertShow] = useState([false,""])
    const [errorMsg,setErrorMsg] = useState("");
    const [loader, setLoader] = useState(true);    
    useEffect(()=>{
        //handleInfo()
        Auth.currentSession().then(session=>{
            if(session.isValid()){
                let role = session.getIdToken().payload["custom:role"];
                if (role == "coordinator"){
                    navigate("/coordinatorDashboard")
                }
                if(role=="manager" || role == "admin"){
                    if(role=="manager"){
                        localStorage.setItem("managerId",session.getIdToken().payload["custom:id"])
                    }
                    handleInfoDummy()
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

    useEffect(()=>{
            setCampaignList(props.manager.campaignList) 
    },[props.manager]);

    const handleInfo = async () =>{
       await props.getCampaigns(props.state.managerId)
    }

    const handleInfoDummy = async () => {
        setLoader(true)
        try{
            //axios call 
            const config = {
                headers: {
                    'Custom-Header': 'value',
                    'Content-Type': 'application/json'
                }
            };
        
            const requestData = {
                manager_id: localStorage.getItem("managerId")
            }
            const response = await axios.post("https://aa2397tzu2-vpce-00569c5e62069a9a0.execute-api.us-east-1.amazonaws.com/roamm/new_manager_dashboard",requestData)
             console.log(response)
            
            if(response.data.statusCode != 200){
                setLoader(true)
                setAlertShow([true,"danger"])
                setErrorMsg(JSON.parse(response.data.body).message)
                setCampaignList([])
                setTimeout(()=>{handleInfoDummy()},2000)
            }
            //get the campaign
            setCampaignList(response.data.body)
            setLoader(false)
            setAlertShow([false,""])
        }
        catch(err){
            setCampaignList([])
            setLoader(true)
            setAlertShow([true,"danger"])
            setErrorMsg(err.message)
            setTimeout(()=>{handleInfoDummy()},2000)
            console.log(err)
        }
    }

    return (
    <div style={{height:"100%",overflowY:"auto"}} className="bg-image">
    <NavBar/>
    <div style={{height:"inherit"}}>
        <Container style={{height:"100%"}}>
            <Row style={{height:"100%"}}>
                <Col lg={2} style={{height:"75%"}}>
                <SideNavbar list={["Campaign List", "Create Campaign","Edit Campaign", "Create Coordinator", "Coordinator Permissions", "Edit Watch Configuration"]} active={0} links={["/managerDashboard","/createCampaign","/editCampaign","/createCoordinator","/coordinatorPermission","/editConfigureWatch"]}/>                </Col>
                <Col style={{height: "75%"}}>
                {alertShow[0]?(alertShow[1] == "danger"? <AlertBox type="danger" message={errorMsg}/>:<></>):<></>}
                    <h2><FaArrowLeft style={{fontSize:"22px"}} onClick={()=>{navigate("/adminDashboard")}}/> Campaign List</h2>
                    <hr/>
                    
                    {loader?<Loader/>: (<Row className="mt-3">
                      
                        <BootstrapTable  keyField='name' data={campaignList} columns={[
                                // {
                                //     dataField: 'campaign_id',
                                //     text: 'Campaign Id'
                                // },
                                {
                                    dataField: 'name',
                                    text: 'Campaign Name',
                                    sort: true
                                },
                                {
                                    dataField: 'total_participants',
                                    text: 'Total Participants',
                                    sort: true
                                },
                                {
                                    dataField: 'active_participants',
                                    text: 'Active Participants',
                                    sort: true
                                }
                                ]} 
                                hover 
                                headerClasses={"table-header-style"} 
                                rowClasses="table-row-style"
                                rowEvents={{
                                    onClick: (e,row, rowIndex) =>{
                                        //props.setCampaignId(row.name)
                                        localStorage.setItem("campaignId",row.name)
                                        navigate("/campaignDashboard")

                                    }
                                }}
                                />
                    </Row>)}
                </Col>
            </Row>
        </Container>
    </div>

</div>);

}

const mapStateToProps = (state,ownProps) =>{
    return {
        user: state.user,
        manager: state.manager,
        state: state.state
    }
}

const mapDispatchToProps = (dispatch) =>{
    return{
        getCampaigns: (managerId) => dispatch(getCampaigns(managerId)),
        setCampaignId: (campaignId) => dispatch(setCampaignId(campaignId))
    }
} 


export default connect(mapStateToProps, mapDispatchToProps)(ManagerDashboard);