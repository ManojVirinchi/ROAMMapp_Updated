import React,{useState,useEffect} from 'react';
import { Col, Row, Container, Table, Form ,Card, Alert} from 'react-bootstrap';
import DashboardChart from '../Components/DashboardChart';
import NavBar from '../Components/NavBar';
import SideNavbar from '../Components/SideNavbar';
import CustomCircularProgressBar from '../Components/CustomCircularProgressBar';
import '../index.css'
import CustomLineChart from '../Components/CustomLineChart';
import DescreteBarChart from '../Components/DescreteBarChart';
import {connect} from 'react-redux'
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {Auth} from 'aws-amplify'
import {useNavigate} from 'react-router-dom'
import {analyticsData,getCampaignQuestions} from '../Store/Actions/participant'
import AlertBox from '../Components/AlertBox'
import axios, { all } from 'axios';
import { FaArrowLeft, FaDownload } from "react-icons/fa";
import Loader from '../Components/Loader';
import { TbReload } from "react-icons/tb";
import LineChartCustom from '../Components/LineChartCustom';
import GpsGraph from '../Components/GpsGraph';

function ParticipantAnalysis(props){
    const [alertShow,setAlertShow] = useState([false,""])
    const [errorMsg,setErrorMsg] = useState("");
    const navigate = useNavigate()
    const [participantData, setParticipantData] = useState({})
    const [numericData, setNumericData] = useState({values:[], labels:[]})
    const [descreteData, setDescreteData] = useState({values:[], labels:[]})
    const [sensorData, setSensorData] = useState({values:[],labels:[]})
    const [gpsData, setGpsData] = useState([])
    const [numericQuestion,setNumericQuestion] = useState("")
    const [descreteQuestion,setDescreteQuestion] = useState("")
    const [sensorQuestion, setSensorQuestion] = useState("")
    const [questions,setQuestions] = useState(null)
    const [numericQuestions,setNumericQuestions] = useState([])
    const [descreteQuestions,setDescreteQuestions] = useState([])
    const [sensorQuestions,setSensorQuestions] = useState([])
    const [loadingComponents, setLoadingComponents] = useState({
        allQuestions : true,
        numericData : true,
        descreteData: true,
        gpsData: true,
        sensorData: true
    })
    const [sensorLoading,setSensorLoading] = useState(true)
    const [numericLoading,setNumericLoading] = useState(true)
    const [discreteLoading,setDiscreteLoading] = useState(true)
    const [dates,setDates] = useState([])
    const [currentDate, setCurrentDate] = useState("")
    const [errorCount,setErrorCount] = useState([0,0,0])
    const [flag, setFlag] = useState(true)
    const [avgMetrics, setAvgMetrics] = useState(0)


    const ParticipantData = {
        firstName: "John",
        lastName: "Karniski",
        patientId: "8290335",
        avgWearTime: "-",
        compliance: 0,
        totalCredits: "-"
    }

    // useEffect(() =>{
    //     Auth.currentSession().then(session=>{
    //         if(session.isValid()){
    //             let role = session.getIdToken().payload["cognito:groups"][0];
    //             handleInfo()
    //         }
    //         else{
    //             Auth.signOut()
    //             navigate("/")     
    //         }
    //     }).catch(error => {
    //         Auth.signOut()
    //         navigate("/")
    //     })
    // },[])

    const getDateRanges = () => {
        let startDate = localStorage.getItem("startDate");
        let endDate = new Date(localStorage.getItem("endDate")); // Assuming endDate is also stored in localStorage
        const ranges = [];
        let currentDate = new Date(startDate);
        const now = new Date();
      
        // Determine the stopping point: either endDate or now, whichever is earlier
        const stoppingPoint = endDate < now ? endDate : now;
      
        // Determine the end of the first week
        while (currentDate.getDay() !== 6) { // Loop until Saturday
          currentDate.setDate(currentDate.getDate() + 1);
        }
      
        let firstIteration = true;
        while (true) {
          let startOfWeek;
          if (firstIteration) {
            startOfWeek = new Date(startDate);
            firstIteration = false;
          } else {
            startOfWeek = new Date(currentDate);
            startOfWeek.setDate(startOfWeek.getDate() - 6); // Set to Sunday of the current week
          }
      
          const endOfWeek = new Date(currentDate);
          if (endOfWeek >= stoppingPoint) {
            ranges.push(`${startOfWeek.toLocaleDateString()} - ${stoppingPoint.toLocaleDateString()}`);
            break;
          } else {
            ranges.push(`${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`);
          }
      
          // Prepare for the next iteration
          currentDate.setDate(currentDate.getDate() + 1); // Move to next day (Sunday)
          if (currentDate > stoppingPoint) break;
          currentDate.setDate(currentDate.getDate() + 6); // Find next Saturday
        }
        setDates(ranges);
      }
      
    useEffect(()=>{
        //handleInfo()
        getDateRanges()  
        //getGPSData()
    },[])

    useEffect(()=>{
        setCurrentDate(dates.length>0?dates[0]:"")
    }, [dates])


    useEffect(()=>{
        handleAvgMetrics()
        if(flag){
            handleAllQuestions()
            setFlag(false)
        }  
    },[currentDate])

    useEffect(() => {
        setTimeout(()=>{
            if(questions && questions.numeric.length != 0){
            setNumericQuestion(questions.numeric[0])
            }
        },500)
    },[numericQuestions])


    useEffect(() => {
        setTimeout(()=>{
                        if(questions && questions.descrete.length != 0){
                            setDescreteQuestion(questions.descrete[0])
                            // getDescereteData()
                        }
                    },1000)
    },[descreteQuestions])

    useEffect(() => {
        setTimeout(()=>{
            if(questions && questions.sensor.length != 0){
                setSensorQuestion(questions.sensor[0])
                // getDescereteData()
            }
        },1500)
    },[sensorQuestions])


    useEffect(()=>{
        if(questions!=null)
        {
            console.log(questions)
            setNumericQuestions(questions.numeric)
            setDescreteQuestions(questions.descrete)
            setSensorQuestions(questions.sensor)
            // getDateRanges()
            // setCurrentDate(dates.length>0?dates[0]:"")
            
            // Promise.all([
            //     new Promise((resolve, reject) => {
            //       setTimeout(()=>{
            //         if(questions.numeric.length != 0){
            //         setNumericQuestion(questions.numeric[0])
            //         }
            //     },500)
            //       resolve(); 
            //       // Resolve immediately after calling handleApi1
            //     }),
            //     new Promise((resolve, reject) => {
            //         setTimeout(()=>{
            //             if(questions.descrete.length != 0){
            //                 setDescreteQuestion(questions.descrete[0])
            //                 // getDescereteData()
            //             }
            //         },1000)
                    
            //       resolve(); // Resolve immediately after calling handleApi2
            //     }),
            //     new Promise((resolve, reject) => {
            //         setTimeout(()=>{
            //             if(questions.sensor.length != 0){
            //                 setSensorQuestion(questions.sensor[0])
            //                 // getDescereteData()
            //             }
            //         },1500)
                    
            //       resolve(); // Resolve immediately after calling handleApi2
            //     }),
            //     // new Promise((resolve, reject) => {
                //     setTimeout( ()=>{
                //             getGPSData()
                //     },2000)
                    
                //   resolve(); // Resolve immediately after calling handleApi2
                // })

            //   ]).then(() => {
            //   }).catch(error => {
            //     console.error('An error occurred:', error);
            //   });
            
            
        }
        console.log(props)
    },[questions])


    const handleAvgMetrics = async () =>{
        let dateRange = currentDate.split(" - ")
        try{
            const requestData = {
                campaign_id: localStorage.getItem("campaignId"),
                participant_id: localStorage.getItem("participantId"),
                start_date: dateRange[0],
                end_date: dateRange[1]

            }
            const response = await axios.post("https://aa2397tzu2-vpce-00569c5e62069a9a0.execute-api.us-east-1.amazonaws.com/roamm/new_get_participant_avg_for_analytics",requestData)
            if(response.data.statusCode!=200){
                console.log(response.data.body)
            }
            else{
                const data_res = JSON.parse(response.data.body);
                let avg_comp = 0;
                if(data_res.length > 0){
                    data_res.map((data)=>{avg_comp = avg_comp + data.compliance})
                    avg_comp = avg_comp / data_res.length;
                }
                
                setAvgMetrics(avg_comp)
            }
        }
        catch(err){
            console.error(err)
            setTimeout(()=>{handleAvgMetrics()},1000)
        }
    }

    const handleAllQuestions = async () =>{
        setLoadingComponents({...loadingComponents,allQuestions:true})
        try{
            const requestData = {
                campaignid: localStorage.getItem("campaignId")
            }
            const response = await axios.post("https://aa2397tzu2-vpce-00569c5e62069a9a0.execute-api.us-east-1.amazonaws.com/roamm/new_dataanalytics/new_unique_questions",requestData)
            console.log(response)
            if(response.data.statusCode!=200){
                setLoadingComponents({...loadingComponents,allQuestions:true})
                //setAlertShow([true,"danger"])
                //setErrorMsg(response.data.body)
                console.log(response.data.body)
            }
            else{
                //console.log(response.data.body)
                let descrete = JSON.parse(response.data.body["descrete"])
                let numeric = JSON.parse(response.data.body["numeric"])
                let sensor = JSON.parse(response.data.body["features"])
                let allquestions = {descrete,numeric,sensor}
                //console.log(allquestions)
                setQuestions(allquestions)
                // if(questions!=null)
                // {
                //     setNumericQuestions(allquestions.numeric)
                //     setDescreteQuestions(allquestions.descrete)
                //     setSensorQuestions(allquestions.sensor)
                //     setNumericQuestion(allquestions.numeric[0])
                //     setDescreteQuestion(allquestions.decrete[0])
                // }
                setLoadingComponents({...loadingComponents,allQuestions:false})
            }
        }
        catch(err){
            //setAlertShow([true,"danger"])
            //setErrorMsg(err.message)
            console.log(err)
        }
    }


    const getNumericData = async () =>{
        setNumericLoading(true)
        let dateRange = currentDate.split(" - ")
        try{
            const requestData = {
                campaign_id: localStorage.getItem("campaignId"),
                questionid: numericQuestion.questionid == ""? questions.numeric[0].questionid:numericQuestion.questionid,
                participant_id: localStorage.getItem("participantId"),
                start_date: dateRange[0],
                end_date: dateRange[1]

            }
            const response = await axios.post("https://aa2397tzu2-vpce-00569c5e62069a9a0.execute-api.us-east-1.amazonaws.com/roamm/new_numeric_data_with_time",requestData)
            //console.log(response)
            if(response.data.statusCode!=200){
                setNumericData(true)
                //setAlertShow([true,"danger"])
                setErrorMsg(response.data.body)
                console.log(response.data.body)
            }
            else{
                const data_res = JSON.parse(response.data.body);
                let values = []
                let labels = []
                data_res.map(d => {values.push(d.value);labels.push(d.collectedtimestamp)})
                setNumericData({values: values,labels: labels})
                //console.log(numericData)
                // let temp = [...errorCount]
                // temp[0] = 0
                // setErrorCount(temp)
                setAlertShow(false)
                setNumericLoading(false)
            }
        }
        catch(err){
            setNumericLoading(true)
            console.error(err)
            setTimeout(()=>{getNumericData();},2000)
            // if(errorCount[0]<=3){
            //     let temp= [...errorCount]
            //     temp[0] = temp[0] + 1;
            //     setErrorCount(temp)
                
            // }
            // else{
            //     setAlertShow([true,"danger"])
            //     setErrorMsg(err.message)
            // }
            
        }
    }

    function countValues(arr, target){
        const countOccurrences = arr.reduce((count, currentValue) => {
            return currentValue === target ? count + 1 : count;
        }, 0);
        return countOccurrences
    }

    const getDescereteData = async () => {
        setDiscreteLoading(true)
        let dateRange = currentDate.split(" - ")
        try{
            const requestData = {
                campaign_id: localStorage.getItem("campaignId"),
                questionid: descreteQuestion.questionid == ""? questions.descrete[0].questionid:descreteQuestion.questionid,
                participant_id: localStorage.getItem("participantId"),
                start_date: dateRange[0],
                end_date: dateRange[1]

            }
            const response = await axios.post("https://aa2397tzu2-vpce-00569c5e62069a9a0.execute-api.us-east-1.amazonaws.com/roamm/new_numeric_data_with_time",requestData)
            console.log(response)
            if(response.data.statusCode!=200){
    
                setDiscreteLoading(true)
                //setAlertShow([true,"danger"])
                //setErrorMsg(response.data.body)
                console.error(response)
                
            }
            else{
                const data_res = JSON.parse(response.data.body);
                let values = []
                let descreteValues = []
                let times = []
                data_res.map(d => {
                    if(d.value != "-1"){
                        descreteValues.push(JSON.parse(d.value)[0]);
                    }
                    else{
                        descreteValues.push(d.value)
                    }
                    
                    times.push(d.collectedtimestamp);
                })
                descreteQuestion.values.map( d => {values.push(countValues(descreteValues,d))})
                setDescreteData({binLabel: descreteQuestion.longUIquestion,values: values,times: times,labels:descreteQuestion.values})
                console.log(`data: ${data_res}, questionid: ${descreteQuestion.questionid}, binLabel : ${descreteQuestion.longUIquestion}, values: ${values}, times: ${times}, labels: ${descreteQuestion.values}`)
                //console.log(descreteData)
                // let temp = [...errorCount]
                // temp[1] =0
                // setErrorCount(temp)
                setAlertShow(false)
                setDiscreteLoading(false)
            }
        }
        catch(err){
            setDiscreteLoading(true)
            console.log(err)
            setTimeout(()=>{getDescereteData();},2000)
            // if(errorCount[1]<=3){
            //     let temp= [...errorCount]
            //     temp[1] = temp[1] + 1;
            //     setErrorCount(temp)
                
                
            // }
            // else{
            //     setAlertShow([true,"danger"])
            //     setErrorMsg(err.message)
            // }
            
        }
    }

    const getSensorData = async () =>{
        setSensorLoading(true)
        var dateRange = currentDate.split(" - ")
        try{
            const requestData = {
                campaign_id: localStorage.getItem("campaignId"),
                questionid: sensorQuestion.question == ""? questions.sensor[0].questionid:sensorQuestion.questionid,
                participant_id: localStorage.getItem("participantId"),
                start_date: dateRange[0],
                end_date: dateRange[1]
            }

            const response = await axios.post("https://aa2397tzu2-vpce-00569c5e62069a9a0.execute-api.us-east-1.amazonaws.com/roamm/new_numeric_data_with_time",requestData)
            console.log(response)
            if(response.data.statusCode!=200){
                setSensorLoading(true)
                //setAlertShow([true,"danger"])
                setErrorMsg(response.data.body)
                console.error(response.data.body)
            }
            else{
                const data_res = JSON.parse(response.data.body);
                let values = []
                let labels = []

                if(requestData.questionid == "99"){
                    var latitudes = []
                    var longitude = []
                    data_res.map( d => {
                       var gps_coord = d.value.split(",")
                        latitudes.push(Number(gps_coord[0]))
                        longitude.push(Number(gps_coord[1]))
                        labels.push(d.collectedtimestamp)
                    })
                    values.push(latitudes)
                    values.push(longitude)
                }
                else{
                    data_res.map(d => {values.push(d.value);labels.push(d.collectedtimestamp)}) 
                }
                setSensorData({values: values,labels: labels})
                //console.log(sensorData)
                // let temp = [...errorCount]
                // temp[2] = 0
                // setErrorCount(temp)
                setAlertShow(false)
                setSensorLoading(false)
            }
        }
        catch(err){
            setSensorLoading(true)
            console.log(err)
            setTimeout(()=>{getSensorData();},2000)
            // if(errorCount[2] <= 3){
            //     let temp= [...errorCount]
            //     temp[2] = temp[2] + 1;
            //     setErrorCount(temp)    
            // }
            // else{
            //     setAlertShow([true,"danger"])
            //     setErrorMsg(err.message)
            // }
            
        }
    }

    const handleNumericQuestionChange = async (e) => {
        setLoadingComponents({...loadingComponents,numericData:true})
        await setNumericQuestion({...JSON.parse(e.target.value)})
        console.log(numericQuestion)
        //getNumericData()
        setLoadingComponents({...loadingComponents,numericData:false})
        
    }
    const handleDescreteQuestionChange = async (e) => {
        setLoadingComponents({...loadingComponents,descreteData:true})
        await setDescreteQuestion({...JSON.parse(e.target.value)})
    
        //getDescereteData()
        setLoadingComponents({...loadingComponents,descreteData:false})
    }

    const handleSensorQuestionChange = async (e) => {
        setLoadingComponents({...loadingComponents,sensorData:true})
        await setSensorQuestion({...JSON.parse(e.target.value)})
        //getDescereteData()
        setLoadingComponents({...loadingComponents,sensorData:false})
    }
    
    const datesoptions = () => {
        return (
            dates.map(date => (
                <option value={date}>{date}</option>
            ))
        )
    }

    const handleChangeDate = (e) =>{
        setCurrentDate(e.target.value)
    }

    useEffect(()=>{
        if(!flag){
            getNumericData()
            getDescereteData()
            getSensorData()
        }
    }, [currentDate])

    useEffect(()=>{
        getDescereteData()
    },[descreteQuestion])

    useEffect(()=>{
        getNumericData()
    },[numericQuestion])

    useEffect(()=>{
        getSensorData()
    },[sensorQuestion])

    const handleDownload = async () => {
        const response = await fetch('https://aa2397tzu2-vpce-00569c5e62069a9a0.execute-api.us-east-1.amazonaws.com/roamm/new_download_report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dateRange: currentDate,
                participantId: localStorage.getItem("participantId"),
                campaignId: localStorage.getItem("campaignId"),
                managerId: localStorage.getItem("managerId"),
            }),
        });

        const data = await response.json();
        console.log(response)
        if (data.statusCode == 404) {
            alert(JSON.parse(data.body).error); // Display error if file does not exist
        } else if(data.statusCode == 200){
                const link = document.createElement('a');
                link.href = JSON.parse(data.body).url;
                link.download = ''; // The download attribute can be used to suggest a file name
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link); // Redirect to the signed URL if file exists
        }
    };
    
        return(
        <div style={{height:"100%",overflowY:"auto"}} className="bg-image mb-5">
            <NavBar/>
            <div className="mb-5"style={{height:"inherit"}}>
                <Container style={{height:"100%"}}>
                    <Row style={{height:"100%"}}>
                        <Col lg={2} style={{height:"75%"}}>
                            <SideNavbar list={["Participant Information", "Analytics","Cognitive"]} active={1} links={["/participantDashboard","/participantAnalysis","/cognitive"]}/>
                        </Col>
                        <Col style={{height: "75%"}}>
                        {alertShow[0]?(alertShow[1] == "danger"? <AlertBox type="danger" message={errorMsg}/>:<></>):<></>}
                            {/* <h2>{ParticipantData.firstName} {ParticipantData.lastName}  ({ParticipantData.patientId})</h2> */}
                            <div style={{display:"flex",justifyContent:"space-between"}}>
                            <div className='btn' onClick={()=> navigate("/campaignDashboard")}><FaArrowLeft></FaArrowLeft>Back to Table</div>
                            <h2>{localStorage.getItem("participantId")}</h2>
                            <div style={{display:"flex", alignItems:"center"}}>
                                <span style={{width: "200px"}}>Week Range : </span><Form.Select value={currentDate} onChange={handleChangeDate} style={{height: "40px"}}>
                                       {datesoptions()}
                                    </Form.Select>
                                </div>
                            {/* <button onClick={()=>{handleDownload()}} className='btn btn-success' style={{marginRight:"0"}}><FaDownload/>  Download Report</button> */}
                            </div>
                            <hr/>
                            <div style={{height:"85%"}}>
                                <Row style={{height:"100%"}}>
                                    <Col>

                                    {/* Brief Metrics */}
                                        <Row style={{display:"flex",justifyContent:"space-evenly"}}>
                                            {/* <Card style={styling.thumbnail} className="mt-4">
                                                <h1>{ParticipantData.totalCredits}</h1>
                                                <div>Total Credits</div>
                                            </Card> */}
                                            <Card className="mt-4" style={{width:"14rem",background:"rgba(255,255,255,0.3)",height:"10rem",display:"flex",justifyContent:"center",alignItems:"center",color:"black"}}>
                                                <div style={{width:"8rem",height:"8rem",position:"relative"}}>
                                                   <CustomCircularProgressBar progress={avgMetrics} text={`${avgMetrics.toFixed(2)}`}/> 
                                                </div>
                                                <div>Compliance</div>
                                            </Card>
                                            {/* <Card style={styling.thumbnail} className="mt-4">
                                                <h1>{ParticipantData.avgWearTime} hrs</h1>
                                                <div>Avg. Wearing Time</div>
                                            </Card> */}
                                        </Row>

                                        {/* Graphs */}
                                        {loadingComponents.allQuestions?<Loader/>:
                                        <div>
                                        <Row className='mt-5'>
                                            <Col>
                                                <Card style={{width:"800px",background:"rgba(255,255,255,0.8)",padding:"5px",marginLeft:"13%"}}>
                                                        <Card.Title style={{textAlign:"center"}}><h4>{"Numeric Data".toUpperCase()} <button style={{border:"none", marginRight:0}} onClick={()=>{getNumericData()}}><TbReload /></button></h4></Card.Title>     
                                                </Card>
                                                <Card className="mt-3" style={{width:"800px",height:"450px",background:"rgba(255,255,255,0.8)",padding:"5px",marginLeft:"13%"}}>
                                                    <select style={{border:"none",textAlign:"center",fontSize:"22px"}} onChange={(e)=>{handleNumericQuestionChange(e)}}>
                                                        {numericQuestions.map(ques => <option value={JSON.stringify(ques)}>{ques.longUIquestion}</option>)}
                                                    </select>
                                                    {numericLoading? <Loader/>: (<DashboardChart legends={[numericQuestion.longUIquestion]} data={[numericData.values]} labels={numericData.labels}/>)}
                                                </Card>
                                            </Col>
                                        </Row>

                                        <Row className='mt-5' style={{marginLeft:"13%"}}>
                                            <Col style={{width:"790px"}}>
                                            <Card className="mt-5" style={{width:"800px",background:"rgba(255,255,255,0.8)",padding:"5px"}}>
                                                        <Card.Title style={{textAlign:"center"}}><h4>{"Discrete Data".toUpperCase()} <button style={{border:"none"}} onClick={()=>{getDescereteData()}}><TbReload /></button></h4></Card.Title>     
                                                </Card>
                                                <Card className="mt-3" style={{width:"inherit",height:"inherit",background:"rgba(255,255,255,0.8)",padding:"5px"}}>
                                                <select style={{border:"none",textAlign:"center",fontSize:"22px"}} onChange={(e)=>{handleDescreteQuestionChange(e)}}>
                                                {descreteQuestions.map(ques => <option value={JSON.stringify(ques)}>{ques.longUIquestion}</option>)}
                                                    </select>
                                                   {discreteLoading?<Loader/>: <DescreteBarChart binLabel={descreteData.binLabel} labels={descreteData.labels} data={descreteData.values}/>}
                                                </Card>
                                            </Col>
                                        </Row>

                                        {/* Map */}
                                        <Row className='mt-5 mb-5'>
                                            {/* <Col>  DashboardChart
                                            <Card className="pb-2" style={{background:"rgba(255,255,255,0.3"}}>
                                                <h4 style={{color:"black", textAlign:"center"}}>GPS Coordinates</h4>
                                                <Row>
                                                <Col>
                                                <Map height={250} defaultCenter={[50.879, 4.6997]} defaultZoom={11}>
                                                    <Marker width={50} anchor={[50.879, 4.6997]} />
                                                </Map>
                                                </Col>
                                                    {//<CustomLineChart legends={[sensorQuestion.question]} data={[sensorData.values]} labels={sensorData.labels}/>}
                                                </Row>
                                            </Card>
                                            </Col> */}
                                            <Col>
                                            <Card className="mt-5" style={{width:"800px",background:"rgba(255,255,255,0.8)",padding:"5px",marginLeft:"13%"}}>
                                                        <Card.Title style={{textAlign:"center"}}><h4>{"Sensor Data".toUpperCase()}<button style={{border:"none"}} onClick={()=>{getSensorData()}}><TbReload /></button></h4></Card.Title>     
                                                </Card>
                                            <Card className="mt-3" style={{marginLeft:"13%",width:"800px",height:"450px",background:"rgba(255,255,255,0.8)",padding:"5px"}}>
                                                    <select style={{border:"none",textAlign:"center",fontSize:"22px"}} onChange={(e)=>{handleSensorQuestionChange(e)}}>
                                                        {sensorQuestions.map((question,index)=>{
                                                            return(<option value={JSON.stringify(question)}>{question.question}</option>)
                                                        })}
                                                    </select>
                                                {
                                                sensorQuestion.questionid == "99"?
                                                sensorLoading?<Loader/>:<GpsGraph legends={[sensorQuestion.question]} data={sensorData.values} labels={sensorData.labels}/>:
                                                sensorLoading?<Loader/>:<CustomLineChart legends={[sensorQuestion.question]} data={[sensorData.values]} labels={sensorData.labels}/>
                                                }
                                                    
                                                    
                                                </Card>
                                            </Col>
                                        </Row>

                                
                                </div>}
                
                                    </Col>
                                </Row>
                            </div>
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
        campaign: state.campaign,
        participant: state.participant,
        manager: state.manager,
        state: state.state

    }
}

const mapDispatchToProps = (dispatch) =>{
    return{
        getParticipantAnalysis: (managerId,campaignId,participantId) => dispatch(analyticsData(managerId,campaignId,participantId)),
        getCampaignQuestions: (campaignId) => dispatch(getCampaignQuestions(campaignId))
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(ParticipantAnalysis);

const styling = {
    thumbnail: {
        width:"14rem",
        background:"rgba(255,255,255,0.3)",
        height:"10rem",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        color:"black",
        padding: "10px"
    }
}


// <DashboardChart legends={["pre-surgery","post-surgery","var1","var2"]} data={[[1,2,5,9],[4,9,1,6],[4,7,2,8],[1,8,3,7]]} labels={["02/03/2022","02/04/2022","02/05/2022","02/06/2022"]}/>

// <DescreteBarChart labels={['No Pain', 'Low', 'Medium', 'High', 'Extreme']} data={[6, 7, 4, 4, 2]}/>



/* <CustomLineChart 
legends={["Battery Percentage"]} 
data={[[12, 37, 40, 30, 19, 17, 89, 17, 46, 37, 36, 52, 45, 95, 32, 72, 40, 21, 84, 13, 91, 44, 28, 38, 16, 70, 81, 38, 60, 99, 62, 84, 66, 39, 77, 15, 81, 76, 3, 16, 16, 83, 56, 5, 3, 3, 43, 6, 90, 93, 81, 19, 17, 19, 71, 21, 27, 63, 43, 37, 88, 76, 20, 52, 50, 95, 9, 94, 99, 42, 16, 2, 26, 100, 77, 34, 18, 89, 99, 3, 1, 57, 59, 61, 34, 44, 84, 30, 45, 51, 9, 67, 31, 80, 76, 59, 49, 70, 44, 58]]} 
labels={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99]}/>*/
