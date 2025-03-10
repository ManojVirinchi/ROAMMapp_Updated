import React,{useState,useEffect} from 'react';
import { Col, Row, Container, Table, Form ,Card} from 'react-bootstrap';
import NavBar from '../Components/NavBar';
import SideNavbar from '../Components/SideNavbar';
import '../index.css'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {Auth} from 'aws-amplify'
import {useNavigate} from 'react-router-dom'
import AlertBox from '../Components/AlertBox'
import axios, { all } from 'axios';
import Loader from '../Components/Loader';
import { DataGrid} from '@mui/x-data-grid';
import { Box } from '@mui/material';

function Cognitive(props){
    const [alertShow,setAlertShow] = useState([false,""])
    const [errorMsg,setErrorMsg] = useState("");
    const [loadingComponents, setLoadingComponents] = useState({
        cognitiveData: true
    })
    const [cognitiveData, setCognitiveData] = useState([])
    const navigate = useNavigate()

    const getCognitiveData = async() =>{

        const requestData = {
            campaign_id: localStorage.getItem("campaignId"),
            participant_id: localStorage.getItem("participantId"),
        }

        try{

        
        const response = await axios.post("https://aa2397tzu2-vpce-00569c5e62069a9a0.execute-api.us-east-1.amazonaws.com/roamm/new_cognitive_data",requestData)
        console.log(response)
        if(response.data.statusCode != 200){
            console.log(response.data.body)
            setLoadingComponents({...loadingComponents, cognitiveData:true})
        }
        let temp = JSON.parse(response.data.body).map((row, index)=>({
            id: index + 1,
            ...row,
          }))
        setCognitiveData(temp)
        console.log(cognitiveData)
        setLoadingComponents({...loadingComponents, cognitiveData:false})
    }
    catch(err){
        console.log(err)
        setLoadingComponents({...loadingComponents, cognitiveData:true})
        setTimeout(()=>{getCognitiveData()}, 2000)
    }
}

    const columns = [
        {
          field: 'timestamp',
          headerName: 'Timestamp',
          sortable: true,
          headerAlign: 'center',
          align: 'center',
          resizable: true,
          flex: 1,
          headerClassName: 'super-app-theme--header',
        },
        {
          field: 'testType',
          headerName: 'Test Type',
          sortable: true,
          headerAlign: 'center',
          align: 'center',
          resizable: true,
          flex: 1,
          headerClassName: 'super-app-theme--header',
        },
        {
          field: 'testOrder',
          headerName: 'Test Order',
          sortable: true,
          headerAlign: 'center',
          align: 'center',
          resizable: true,
          flex: 1,
          headerClassName: 'super-app-theme--header',
        },
        {
          field: 'questionid',
          headerName: 'Question ID',
          sortable: true,
          headerAlign: 'center',
          align: 'center',
          resizable: true,
          flex: 1,
          headerClassName: 'super-app-theme--header',
        },
        // {
        //   field: 'string',
        //   headerName: 'String',
        //   width: 200,
        //   sortable: true,
        //   headerAlign: 'center',
        //   align: 'center',
        //   resizable: true,
        //   flex: 1,
        //   headerClassName: 'super-app-theme--header',
        //   renderCell: (params) => (
        //     <Box sx={{overflow: 'auto',textAlign: 'center',}}>
        //       {params.value}
        //     </Box>
        //   ),
        // },
        {
          field: 'value',
          headerName: 'Value',
          sortable: true,
          headerAlign: 'center',
          align: 'center',
          resizable: true,
          flex: 3,
          headerClassName: 'super-app-theme--header',
          renderCell: (params) => (
            <Box
              sx={{overflow: 'auto',textAlign: 'center',}}>
              {params.value}
            </Box>
          ),
        },
      ]
      
      useEffect(()=>{
        getCognitiveData()
      },[])

    return (
        <div style={{height:"100%",overflowY:"auto"}} className="bg-image mb-5">
        <NavBar/>
        <div className="mb-5"style={{height:"inherit"}}>
            <Container style={{height:"100%"}}>
                <Row style={{height:"100%"}}>
                    <Col lg={2} style={{height:"75%"}}>
                        <SideNavbar list={["Participant Information", "Analytics","Cognitive"]} active={2} links={["/participantDashboard","/participantAnalysis","/cognitive"]}/>
                    </Col>
                    <Col style={{height: "75%"}}>
                    {alertShow[0]?(alertShow[1] == "danger"? <AlertBox type="danger" message={errorMsg}/>:<></>):<></>}
                        {/* <h2>{ParticipantData.firstName} {ParticipantData.lastName}  ({ParticipantData.patientId})</h2> */}
                        <div style={{display:"flex",justifyContent:"space-between"}}>
                        <h2>{localStorage.getItem("participantId")}</h2>
                        </div>
                        <hr/>
                        <div style={{height:"85%"}}>
                            <Row style={{height:"100%"}}>
                                <Col>
                                <h3 className='mb-3'>Conginitive Data</h3>
                                {loadingComponents.cognitiveData?<Loader/>:<div style={{ height: "inherit", width: '100%', backgroundColor: 'white' }}>
                                <DataGrid
                                    rows={cognitiveData}
                                    columns={columns}
                                    pageSize={5}
                                    rowsPerPageOptions={[5, 10, 20]}
                                    pagination
                                    disableSelectionOnClick
                                    // disableColumnResize
                                    sx={{
                                    '.super-app-theme--header': {
                                        backgroundColor: '#4F77AA', // Deep blue background for headers
                                        color: '#fff', // Optional: change text color to white for better visibility
                                    },
                                    '& .MuiDataGrid-row': {
                                        backgroundColor: 'white', // Ensures rows have a white background
                                    }
                                    }}
                                />
                                </div>
                            }


                                </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

        </div>

    )
}

export default Cognitive