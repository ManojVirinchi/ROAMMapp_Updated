import React,{useState,useEffect} from 'react';
import { Col, Row, Container, Table, Form, Button, Modal , Alert} from 'react-bootstrap';
import NavBar from '../Components/NavBar';
import SideNavbar from '../Components/SideNavbar';
import '../index.css'
import { useNavigate, useParams } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {connect} from 'react-redux'
import {getCampaignInfo} from '../Store/Actions/campaign'
import {setParticipantId} from '../Store/Actions/state'
import AlertBox from '../Components/AlertBox'
import axios from 'axios';
import { FaArrowLeft } from "react-icons/fa";
import Loader from '../Components/Loader'
import {Auth} from 'aws-amplify';
import { DataGrid } from '@mui/x-data-grid';
import { FaDownload } from 'react-icons/fa';






function CampaignDashboard(props){
    const [currentSideActive, setCurrentSideActive] = useState(0)
    const [selectValue, setSelectValue] = useState("totalPar");
    const [order, setOrder] = useState("normal")
    const {managerid} = useParams(); 
    const [participantList, setParticipantList] = useState([])
    const [campaignName, setCampaignName] = useState("")
    const [campaignId, setCampaignId] = useState("")
    const [avgCompliance, setAvgComplinace] = useState(0)
    const [avgWearingTime, setAvgWearingTime] = useState(0)
    const [alertShow,setAlertShow] = useState([false,""])
    const [errorMsg,setErrorMsg] = useState("");
    const [loader,setLoader] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedDataTypes, setSelectedDataTypes] = useState([]);
    const [currentParticipant, setCurrentParticipant] = useState(null);
    const [collectionTime, setCollectionTime] = useState("-")


    const [isAllSelected, setIsAllSelected] = useState(false);
    

  

    const navigate = useNavigate()
    
    useEffect(()=> {
        //handleInfo()
        Auth.currentSession().then(session=>{
            if(session.isValid()){
                let role = session.getIdToken().payload["custom:role"];
                if(role=="manager" || role == "coordinator" || role == "admin"){
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
    },[]);

    useEffect(() => {
        setCampaignName(props.campaign.campaignName);
        setCampaignId(props.campaign.campaignId);
        setParticipantList(props.campaign.participantList);
    }, [props.campaign]);

    const handleInfo = async (managerId, campaignId) =>{
        await props.getCampaignInfo(props.state.managerId,props.state.campaignId)
    }

    const handleInfoDummy = async () =>{
        setLoader(true)
        try{
            //axios call
            const requestData = {
                campaign_id: localStorage.getItem("campaignId"),
                managerid: localStorage.getItem("managerId")
            }
            const response = await axios.post("https://aa2397tzu2-vpce-00569c5e62069a9a0.execute-api.us-east-1.amazonaws.com/roamm/new_campaign_dashboard",requestData)
            console.log(response)
            if(response.data.statusCode != 200){
                setLoader(true)
                setAlertShow([true,"danger"])
                setErrorMsg(JSON.parse(response.data.body).message)
            }
            //update the data format required for the dispatch
            else{
                setParticipantList(JSON.parse(response.data.body))
                calaculateAvgCompliance(JSON.parse(response.data.body))
                setCampaignId(localStorage.getItem("campaignId"))
                setCampaignName(localStorage.getItem("campaignId"))
                setLoader(false)
            }
            
            //dispatch the action
            
            }
            catch(err){
                setLoader(true)
                setAlertShow([true,"danger"])
                setErrorMsg(err.message)
                console.log(err)
            }
    }


    const calaculateAvgCompliance = (participants) => {
        let totalCompliance = 0;
        participants.forEach((participant) => { totalCompliance += participant["compliance"] });
        totalCompliance = totalCompliance/participants.length;

        setAvgComplinace(totalCompliance);
    }

    useEffect(()=> {
        try{
            const dateOnly= new Date(participantList[0]["timestamps"].replace(" ", "T"));

            // Format the date as YYYY-MM-DD
            const month = String(dateOnly.getMonth() + 1).padStart(2, "0");
            const day = String(dateOnly.getDate()).padStart(2, "0");
            const year = dateOnly.getFullYear();

// Combine components into MM-DD-YYYY format
            const formattedDate = `${month}-${day}-${year}`;
            setCollectionTime(formattedDate)
        }
        catch(e){
            console.log(e)
            setCollectionTime("-")
        }
    }, [avgCompliance])
     // Open modal for the selected participant
  const handleDownloadClick = (participant) => {
    setCurrentParticipant(participant);
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDataTypes([]);
  };

  // Handle checkbox selection
//   const handleCheckboxChange = (e) => {
//     const { name, checked } = e.target;
//     setSelectedDataTypes((prev) =>
//       checked ? [...prev, name] : prev.filter((type) => type !== name)
//     );
//   };
const handleCheckboxChange = (e, isAll) => {
    const { name, checked } = e.target;

    if (isAll) {
        // If "Select All" is checked/unchecked
        setIsAllSelected(checked);
        setSelectedDataTypes(checked ? [...new Set(participantList.map(p => p.participantid))] : []); // If "All" is selected, add all PIDs
    } else {
        // If an individual checkbox is selected, update state only if "All" is not selected
        if (!isAllSelected) {
            setSelectedDataTypes((prev) =>
                checked ? [...prev, name] : prev.filter((type) => type !== name)
            );
        }
    }
};


  // Download selected data
//   const handleDownloadData = async () => {
//     const { campaignid, participantid } = currentParticipant;
//     console.log(currentParticipant)
//     console.log("Payload:", {
//         campaign_id: campaignid,
//         participant_id: participantid,
//         selection: selectedDataTypes,
//         email: props.user.email, // Include email from Redux state
//     });
//     try {
//         // Make a POST request to the Lambda API
//         const response = await axios.post(
//           'https://aa2397tzu2-vpce-00569c5e62069a9a0.execute-api.us-east-1.amazonaws.com/roamm/new_get_csv_files',
//           {
//             campaign_id: campaignid,
//             participant_id: participantid,
//             selection: selectedDataTypes,
//             email: props.user.email,
//           },
//           {
//             responseType: 'json', 
//           }
//         );
//           console.log(response)
//         // Check if response contains Base64 data
//         if (response.data && response.data.body) {
//           // Decode Base64 data
//           const binaryData = atob(response.data.body); // Decode Base64 to binary string
    
//           // Convert binary string to an ArrayBuffer
//           const arrayBuffer = new Uint8Array(
//             binaryData.split('').map((char) => char.charCodeAt(0))
//           );
    
//           // Create a Blob from the ArrayBuffer
//           const blob = new Blob([arrayBuffer], { type: 'application/zip' });
    
//           // Create a download link
//           const url = window.URL.createObjectURL(blob);
//           const link = document.createElement('a');
//           link.href = url;
//           link.setAttribute('download', `${participantid}_data_files.zip`); // File name
//           document.body.appendChild(link);
//           link.click();
//           document.body.removeChild(link);
//         } else {
//           alert('Failed to download file. No data received.');
//         }
//       } catch (error) {
//         console.error('Error downloading file:', error);
//         alert('An error occurred while downloading the file.');
//       }
//     handleCloseModal();
//   };


    



  const handleDownloadAllData = async () => {
    console.log("Downloading all participant data...");

    const participantIdsToSend = isAllSelected
        ? participantList.map((p) => p.participantid):selectedDataTypes;
    console.log(`campaign id:${campaignId}`);
    console.log(`participant list ${participantIdsToSend}`);
    console.log(`email: ${props.user.email}`)

    try {
        const response = await axios.post(
            'https://aa2397tzu2-vpce-00569c5e62069a9a0.execute-api.us-east-1.amazonaws.com/roamm/new_get_csv_files',
            {
                campaign_id: campaignId,
                participant_id_list: participantIdsToSend, 
                // selection: selectedDataTypes,
                email: props.user.email, 
            },
            { responseType: 'json' }
        );

        console.log(response);

        if (response.status === 200) {

            handleCloseModal();
            window.alert(`Data download has started. The data will be sent to ${props.user.email}`);
        } else {
            alert('Failed to start the data download.');
        }
    }
    catch (error) {
            console.error('Error downloading file:', error);
            alert('An error occurred while downloading the file.');
    }
}

    //     if (response.data && response.data.body) {
    //         const binaryData = atob(response.data.body);
    //         const arrayBuffer = new Uint8Array(
    //             binaryData.split('').map((char) => char.charCodeAt(0))
    //         );

    //         const blob = new Blob([arrayBuffer], { type: 'application/zip' });

    //         const url = window.URL.createObjectURL(blob);
    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.setAttribute('download', `${campaignId}_all_participants_data.zip`);
            
    //         document.body.appendChild(link);
    //         link.click();
            
    //         document.body.removeChild(link);
    //     } else {
    //         alert('Failed to download file. No data received.');
    //     }
    // } 
    // }







    return(

        
        
        <div style={{height:"100%",overflowY:"auto"}} className="bg-image">
    <NavBar/>
    <div style={{height:"inherit"}}>
        <Container style={{height:"100%"}}>
            <Row style={{height:"100%"}}>
                <Col lg={2} style={{height:"75%"}}>
                <SideNavbar list={["Campaign Dashboard","Create Participant","Configure Watch"]} active={currentSideActive} links={["/campaignDashboard","/createParticipant","/configureWatch"]}/>
                </Col>
                <Col style={{height: "75%",overflow:"auto"}}>
                {alertShow[0]?(alertShow[1] == "danger"? <AlertBox type="danger" message={errorMsg}/>:<></>):<></>}
                    <Row>
                        <Col>
                        <FaArrowLeft style={{fontSize:"22px"}} onClick={()=>{navigate("/managerDashboard")}}/>
                        </Col>
                        <Col sm={6}>
                            <Row>
                                <h2 style={{fontFamily:"GentonaLight"}}>Campaign Name: <b>{campaignName}</b></h2>
                            </Row>
                            {/* <Row>
                                <h4 style={{fontFamily:"GentonaLight"}}>Campaign Id: <b>{campaignId}</b></h4>
                            </Row> */}
                        </Col>
                          
                        <Col style={{display:"flex",justifyContent:"space-around"}} sm={5}>
                        <div style={{display:"flex",flexDirection:"column",justifyContent:"cneter",alignItems:"center"}}>
                            <h2><b>{avgCompliance.toFixed(2)}%</b></h2>
                        <div>Avg. Compliance</div>
                        </div>
                        {/* <div style={{display:"flex",flexDirection:"column",justifyContent:"cneter",alignItems:"center"}}>
                            <h2><b>{avgWearingTime} hrs</b></h2>
                            <div>Avg. Wear Time</div>
                        </div> */}
                        </Col>
                        <Container style={{padding: "15px"}}>
                            <Alert key={'primary'} variant={"primary"}>The Data in the columns {<b>Prompt Count, Compliance, Sensor Count, Battery Decay</b>} are calculated only for the data collected on {<b>{collectionTime?collectionTime:"-"}</b>}</Alert>
                        </Container>
                    {/* </Row>
                    <Row className="mb-3">
                            <Col>
                                <Button variant="primary" onClick={handleDownloadAllData}>
                                    Download All Data
                                </Button>
                            </Col>
                    </Row>
                    {loader?<Loader/>: (<Row className="mt-3"> */}
                        

<BootstrapTable  keyField='name' data={participantList} columns={[
                                {
                                    dataField: 'participantid',
                                    text: 'PID'
                                },
                                {
                                    dataField: 'startdate',
                                    text: 'Start Date',
                                    sort: true
                                },
                                {
                                    dataField: 'endtime',
                                    text: 'End Date',
                                    sort: true
                                },
                                {
                                    dataField: 'prompt_count',
                                    text: 'Prompt Count',
                                    sort: true
                                },
                                {
                                    dataField: 'compliance',
                                    text: 'Compliance (% per day)',
                                    sort: true
                                },
                                {
                                    dataField: 'sensor_count',
                                    text: 'Sensor Count',
                                    sort: true
                                },
                                {
                                    dataField: 'battery_decay',
                                    text: 'Battery Decay (% per hour)',
                                    sort: true
                                },
                                {
                                    dataField:"lastdata",
                                    text:"Date of last data (battery) capture",
                                    sort:true
                                },
                                
                                    {
                                        dataField: 'download',
                                        text: 'Download',
                                        
                                        // Add a custom header formatter to include the button
                                        headerFormatter: () => (
                                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                <span>Download</span>
                                                <FaDownload 
                                                    style={{ marginLeft: "10px", cursor: "pointer" }}
                                                    onClick={() => setShowModal(true)} // Open the modal instead
                                                />
                                            </div>
                                        ),
                                    // dataField: 'download',
                                    // text: 'Download',
                                    // // formatter: (cell, row) => (
                                    // //   <FaDownload onClick={(e) => {
                                    // //     e.stopPropagation();
                                    // //     handleDownloadClick(row);
                                    // // }}>Download</FaDownload>
                                    // // ),
                                  },
                                ]} 
                                hover 
                                headerClasses={"table-header-style"} 
                                rowClasses="table-row-style"
                                rowEvents={{
                                    onClick: (e, row, rowIndex)=>{
                                        // props.setParticipantId(row.participant_id)
                                        localStorage.setItem("participantId",row.participantid)
                                        localStorage.setItem("startdate", row.startdate)
                                        localStorage.setItem("enddate", row.endtime)
                                        navigate("/participantDashboard")
                                }}} 
                                />
                                {/* Popup Modal */}
                                {/* <Modal show={showModal} onHide={handleCloseModal} fullscreen={'lg-down'}>
                                    <Modal.Header closeButton>
                                    <Modal.Title>Select Data to Download</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                    <Form>
                                        {['Numeric', 'Discrete', 'Cognitive', 'GPS', 'HealthKit', 'All'].map((type) => (
                                        <Form.Check
                                            key={type}
                                            type="checkbox"
                                            name={type}
                                            label={type}
                                            onChange={handleCheckboxChange}
                                        />
                                        ))}
                                    </Form>
                                    </Modal.Body>
                                    <Modal.Footer>
                                    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                                    <Button variant="primary" onClick={handleDownloadData}>Download</Button>
                                    </Modal.Footer>
                                </Modal> */}
                                <Modal show={showModal} onHide={handleCloseModal} fullscreen={'lg-down'}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Select Data to Download</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Form>
                                            {/* "Select All" Checkbox */}
                                            <Form.Check
                                                type="checkbox"
                                                name="All"
                                                label="Select All"
                                                onChange={(e) => handleCheckboxChange(e, true)} // Pass true for the "Select All" checkbox
                                                checked={isAllSelected}
                                            />

                                            {/* Individual Participant Checkboxes */}
                                            {[... new Set(participantList.map(p=>p.participantid))].sort((a, b) => a.localeCompare(b)) // Sort PIDs alphabetically
                                                .map((pid) => (
                                                    <Form.Check
                                                        key={pid}
                                                        type="checkbox"
                                                        name={pid}
                                                        label={`PID: ${pid}`}
                                                        onChange={(e) => handleCheckboxChange(e, false)} // Pass false for individual checkboxes
                                                        checked={selectedDataTypes.includes(pid)}
                                                        disabled={isAllSelected} // Disable if "Select All" is selected
                                                    />
                                                ))}
                                        </Form>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                                        <Button variant="primary" onClick={handleDownloadAllData}>Download</Button>
                                    </Modal.Footer>
                                </Modal>


                    </Row>
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
        getCampaignInfo: (managerId,campaignId) => dispatch(getCampaignInfo(managerId,campaignId)),
        setParticipantId: (participantId) => dispatch(setParticipantId(participantId))
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(CampaignDashboard);