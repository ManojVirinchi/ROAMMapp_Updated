import React,{useState,useEffect, u} from 'react';
import { Col, Row, Container, Table, Form } from 'react-bootstrap';
import NavBar from '../Components/NavBar';
import SideNavbar from '../Components/SideNavbar';
import { useNavigate } from 'react-router-dom';
import '../index.css'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import "react-step-progress-bar/styles.css";
import {ProgressBar, Step} from 'react-step-progress-bar'
import {initialFeaturesSet} from '../constantdata/analyticsPages'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import {initialConfigureWatchParameters, initialNumericData, initialDiscreteData, initialCognitiveData} from '../constantdata/createCampaignData'
import {Auth} from 'aws-amplify'
import axios from 'axios'




const createInitialSchedule = () => {
    const schedule = {};
    for (let day = 1; day <= 7; day++) {
      schedule[day] = [];
    }
    return schedule;
  };

function CreateCampaign(){
    const [currentSideActive, setCurrentSideActive] = useState(1)

    const [currentStep, setCurrentStep] = useState(0);
    const progress_labels = ["Campaign name", "Numeric data", "Discrete data","Cognitive","Watch Configuration Parameters","Features"]
    const totalSteps = 4; // Total number of steps in the form



  const [campaignId, setCampaignId] = useState('');
  const [cognitivePrompts, setCognitivePrompts] = useState([]);
  const [discretePrompts, setDiscretePrompts] = useState([]);
  const [numericPrompts, setNumericPrompts] = useState([]);
  const [newDiscreteValue, setNewDiscreteValue] = useState('');
  const [newAnchor, setNewAnchor] = useState({ value1: '', value2: '', value3: '' });
  const [newTime, setNewTime] = useState('');
    const navigate = useNavigate()
   
    const features = ["mvm","svdm","mangle","sdangle","df","fpdf","p625","gps","battery","activity_min","caloriesBurnt","steps","distance Travelled","flights climbed","avgHeartRate","restingHeartRate","walkingspeed"]
    const [featureSet,setFeatureSet] = useState(initialFeaturesSet)
    const [configWatchParams,setConfigWatchParams] = useState(initialConfigureWatchParameters)
    


    useEffect(()=>{
        // console.log(props)
        Auth.currentSession().then(session=>{
            if(session.isValid()){
                let role = session.getIdToken().payload["custom:role"];
                if(role == "admin"){
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





    const handleAddCognitivePrompt = () => {
        setCognitivePrompts([...cognitivePrompts, { numberOfDigits: 0, questionid: 0, schedule: createInitialSchedule(), testOrder: '', testType: '' }]);
      };
    
      const handleRemoveCognitivePrompt = (index) => {
        setCognitivePrompts(cognitivePrompts.filter((_, i) => i !== index));
      };
    
      const handleAddDiscretePrompt = () => {
        setDiscretePrompts([...discretePrompts, { longUIquestion: '', question: '', questionid: 0, schedule: createInitialSchedule(), type: "discrete", values: [] }]);
      };
    
      const handleRemoveDiscretePrompt = (index) => {
        setDiscretePrompts(discretePrompts.filter((_, i) => i !== index));
      };
    
      const handleAddNumericPrompt = () => {
        setNumericPrompts([...numericPrompts, { anchors: [], default_value: 0, inc: 1, longUIquestion: '', max: 0, min: 0, question: '', questionid: 0, schedule: createInitialSchedule(), type: "range" }]);
      };
    
      const handleRemoveNumericPrompt = (index) => {
        setNumericPrompts(numericPrompts.filter((_, i) => i !== index));
      };
    
      const handleScheduleChange = (type, promptIndex, day, timeIndex, value) => {
        const updateSchedule = (prompts) => {
          const newPrompts = [...prompts];
          newPrompts[promptIndex].schedule[day][timeIndex] = value;
          return newPrompts;
        };
    
        if (type === 'cognitive') {
          setCognitivePrompts(updateSchedule(cognitivePrompts));
        } else if (type === 'discrete') {
          setDiscretePrompts(updateSchedule(discretePrompts));
        } else if (type === 'numeric') {
          setNumericPrompts(updateSchedule(numericPrompts));
        }
      };
    
      const handleRemoveScheduleTime = (type, promptIndex, day, timeIndex) => {
        const updateSchedule = (prompts) => {
          const newPrompts = [...prompts];
          newPrompts[promptIndex].schedule[day].splice(timeIndex, 1);
          return newPrompts;
        };
    
        if (type === 'cognitive') {
          setCognitivePrompts(updateSchedule(cognitivePrompts));
        } else if (type === 'discrete') {
          setDiscretePrompts(updateSchedule(discretePrompts));
        } else if (type === 'numeric') {
          setNumericPrompts(updateSchedule(numericPrompts));
        }
      };
    
      const handleAddDiscreteValue = (promptIndex) => {
        const newPrompts = [...discretePrompts];
        newPrompts[promptIndex].values.push(newDiscreteValue);
        setDiscretePrompts(newPrompts);
        setNewDiscreteValue('');
      };
    
      const handleRemoveDiscreteValue = (promptIndex, valueIndex) => {
        const newPrompts = [...discretePrompts];
        newPrompts[promptIndex].values.splice(valueIndex, 1);
        setDiscretePrompts(newPrompts);
      };
    
      const handleAddAnchor = (promptIndex) => {
        const newPrompts = [...numericPrompts];
        newPrompts[promptIndex].anchors.push([newAnchor.value1, newAnchor.value2, newAnchor.value3]);
        setNumericPrompts(newPrompts);
        setNewAnchor({ value1: '', value2: '', value3: '' });
      };
    
      const handleRemoveAnchor = (promptIndex, anchorIndex) => {
        const newPrompts = [...numericPrompts];
        newPrompts[promptIndex].anchors.splice(anchorIndex, 1);
        setNumericPrompts(newPrompts);
      };
    
      const handleAddScheduleTime = (type, promptIndex, day) => {
        const updateSchedule = (prompts) => {
          const newPrompts = [...prompts];
          newPrompts[promptIndex].schedule[day].push(newTime);
          return newPrompts;
        };
    
        if (type === 'cognitive') {
          setCognitivePrompts(updateSchedule(cognitivePrompts));
        } else if (type === 'discrete') {
          setDiscretePrompts(updateSchedule(discretePrompts));
        } else if (type === 'numeric') {
          setNumericPrompts(updateSchedule(numericPrompts));
        }
        setNewTime('');
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        if(campaignId !== ""){
            const campaignData = {
                campaignid: campaignId,
                CognitivePrompt: cognitivePrompts,
                DiscretePrompt: discretePrompts,
                NumericPrompt: numericPrompts,
              };

              let response = await axios.post("https://aa2397tzu2-vpce-00569c5e62069a9a0.execute-api.us-east-1.amazonaws.com/roamm/new_create_campaign",{
                managerid: localStorage.getItem("managerId"),
                campaign_data: campaignData    
            })
            console.log(response.data)
            if(response.data.statusCode == 200){
                navigate("/managerDashboard")
            }
            
              //console.log(JSON.stringify(campaignData, null, 2));
        }
        else{
            alert("atlest Campaign Id is needed!!!")
        }
        
      };







  // Function to change the current step
  const goToStep = (stepIndex) => {
    if(currentStep < 0){
        setCurrentStep(0)
    }
    else if(currentStep >= totalSteps){
        setCurrentStep(totalSteps - 1)
    }
    else{
        setCurrentStep(stepIndex);
    }
    
  };







  //Step 1 - Campaign Id
  const stepOne =  (
  <div>
        <h3>Campaign Id</h3>
        <div>
          <Form.Label>Campaign ID:</Form.Label>
          <Form.Control type="text" value={campaignId} onChange={(e) => setCampaignId(e.target.value)} />
        </div>
    </div>
    )

// Step 2 - Numeric Data
    const stepTwo = (
        <div>
            <h3>Numeric Data</h3>
            {numericPrompts.map((prompt, index) => (
            <div key={index}>
            <h5 style={{textDecoration: "underline"}}>{`Question - ${index+1})`}</h5>
              <label>Long UI Question:</label>
              <Form.Control
              style={{border: "1px solid black"}}
                type="text"
                value={prompt.longUIquestion}
                onChange={(e) => {
                  const newPrompts = [...numericPrompts];
                  newPrompts[index].longUIquestion = e.target.value;
                  setNumericPrompts(newPrompts);
                }}
              />
              <label>Question:</label>
              <Form.Control
              style={{border: "1px solid black"}}
                type="text"
                value={prompt.question}
                onChange={(e) => {
                  const newPrompts = [...numericPrompts];
                  newPrompts[index].question = e.target.value;
                  setNumericPrompts(newPrompts);
                }}
              />
              <label>Question ID:</label>
              <Form.Control
              style={{border: "1px solid black"}}
                type="number"
                value={prompt.questionid}
                onChange={(e) => {
                  const newPrompts = [...numericPrompts];
                  newPrompts[index].questionid = e.target.value;
                  setNumericPrompts(newPrompts);
                }}
              />
              <label>Min:</label>
              <Form.Control
              style={{border: "1px solid black"}}
                type="number"
                value={prompt.min}
                onChange={(e) => {
                  const newPrompts = [...numericPrompts];
                  newPrompts[index].min = e.target.value;
                  setNumericPrompts(newPrompts);
                }}
              />
              <label>Max:</label>
              <Form.Control
              style={{border: "1px solid black"}}
                type="number"
                value={prompt.max}
                onChange={(e) => {
                  const newPrompts = [...numericPrompts];
                  newPrompts[index].max = e.target.value;
                  setNumericPrompts(newPrompts);
                }}
              />
              <label>Increment:</label>
              <Form.Control
              style={{border: "1px solid black"}}
                type="number"
                value={prompt.inc}
                onChange={(e) => {
                  const newPrompts = [...numericPrompts];
                  newPrompts[index].inc = e.target.value;
                  setNumericPrompts(newPrompts);
                }}
              />
              <label>Anchors:</label>
              <div style={{display: "flex", gap: "20px"}}>
              <Form.Control
              style={{border: "1px solid black", width: "250px"}}
                type="text"
                value={newAnchor.value1}
                onChange={(e) => setNewAnchor({ ...newAnchor, value1: e.target.value })}
              />
              <Form.Control
              style={{border: "1px solid black",  width: "250px"}}
                type="text"
                value={newAnchor.value2}
                onChange={(e) => setNewAnchor({ ...newAnchor, value2: e.target.value })}
              />
              <Form.Control
              style={{border: "1px solid black",  width: "250px"}}
                type="text"
                value={newAnchor.value3}
                onChange={(e) => setNewAnchor({ ...newAnchor, value3: e.target.value })}
              />
              <button type="button" className='btn btn-success' onClick={() => handleAddAnchor(index)}>Add Anchor</button>
              </div>
              <div>
                {prompt.anchors.map((anchor, anchorIndex) => (
                  <div key={anchorIndex} className="m-3" style={{display:"flex", gap:"20px"}}>
                    {anchor.map((val, ind) => (<Form.Control style={{width:"250px", border:"1px solid black"}} disabled value={val}/>))}
                    <button type="button" className='btn btn-danger' onClick={() => handleRemoveAnchor(index, anchorIndex)}>Remove </button>
                  </div>
                ))}
              </div>

              <div className='m-3'>
                <h4>Schedule</h4>
                {Object.keys(prompt.schedule).map(day => (
                  <div key={day} className="mb-4">
                    <h5>Day {day}:</h5>
                    {prompt.schedule[day].map((time, timeIndex) => (
                      <div key={timeIndex} className="mb-3" style={{display:"flex", gap: "20px"}}>
                        <Form.Control
                        style={{width: "250px", border: "1px solid black",  marginLeft: "30px"}}
                          type="text"
                          value={time}
                          onChange={(e) => handleScheduleChange('numeric', index, day, timeIndex, e.target.value)}
                        />
                        <button type="button" className='btn btn-outline-danger ' onClick={() => handleRemoveScheduleTime('numeric', index, day, timeIndex)}>Remove Time</button>
                      </div>
                    ))}
                    <div style={{display:"flex", marginLeft: "20px", gap: "20px"}}>
                    <Form.Control
                      type="text"
                      style={{width: "250px",border: "1px solid black"}}
                      onChange={(e) => setNewTime(e.target.value)}
                    />
                    <button type="button" className="btn btn-outline-success" onClick={() => handleAddScheduleTime('numeric', index, day)}>Add Time</button>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" className="btn btn-danger m-4" onClick={() => handleRemoveNumericPrompt(index)}>Remove Question</button>
              <hr/>
            </div>
          ))}
          <button type="button" className='btn btn-outline-primary m-4' onClick={handleAddNumericPrompt}>Add Numeric Prompt</button>
        </div>
    )
  
    //Step 3 - Discrete Prompt
    const stepThree = (
        <div>
            <h3>Discrete Data</h3>
            
           {discretePrompts.map((prompt, index) => (
            <div key={index}>
            <h5 style={{textDecoration:"underline"}}>{`Question - ${index+1})`}</h5>
              <label>Long UI Question:</label>
              <Form.Control
              style={{border: "1px solid black"}}
                type="text"
                value={prompt.longUIquestion}
                onChange={(e) => {
                  const newPrompts = [...discretePrompts];
                  newPrompts[index].longUIquestion = e.target.value;
                  setDiscretePrompts(newPrompts);
                }}
              />
              <label>Question:</label>
              <Form.Control
              style={{border: "1px solid black"}}
                type="text"
                value={prompt.question}
                onChange={(e) => {
                  const newPrompts = [...discretePrompts];
                  newPrompts[index].question = e.target.value;
                  setDiscretePrompts(newPrompts);
                }}
              />
              <label>Question ID:</label>
              <Form.Control
              style={{border: "1px solid black"}}
                type="number"
                value={prompt.questionid}
                onChange={(e) => {
                  const newPrompts = [...discretePrompts];
                  newPrompts[index].questionid = e.target.value;
                  setDiscretePrompts(newPrompts);
                }}
              />
              {/* <label>Type:</label>
              <Form.Control
              style={{border: "1px solid black"}}
                type="text"
                value={prompt.type}
                onChange={(e) => {
                  const newPrompts = [...discretePrompts];
                  newPrompts[index].type = e.target.value;
                  setDiscretePrompts(newPrompts);
                }}
              /> */}
              <label className="mt-4">Values:</label>
              <div style={{display: "flex", gap:"20px"}}>
              <Form.Control
              style={{border: "1px solid black", width: "250px"}}
                type="text"
                value={newDiscreteValue}
                onChange={(e) => setNewDiscreteValue(e.target.value)}
              />
              <button type="button" className="btn btn-outline-success" onClick={() => handleAddDiscreteValue(index)}>Add Value</button>
              </div>
              <div>
                {prompt.values.map((value, valueIndex) => (
                  <div key={valueIndex} className="m-3" style={{display:"flex", gap:"20px"}}>
                    {valueIndex+1+")"}<Form.Control disabled style={{width: "250px"}} value={value} />
                    <button type="button" className='btn btn-outline-danger' onClick={() => handleRemoveDiscreteValue(index, valueIndex)}>Remove</button>
                  </div>
                ))}
              </div>

              <div className='mt-3'>
                <h5>Schedule</h5>
                {Object.keys(prompt.schedule).map(day => (
                  <div key={day} className="m-3">
                    <h6>Day {day}:</h6>
                    {prompt.schedule[day].map((time, timeIndex) => (
                      <div key={timeIndex} className="mb-3" style={{display:"flex", gap: "20px"}}>
                        <Form.Control
                        style={{width: "250px", border: "1px solid black",  marginLeft: "30px"}}
                          type="text"
                          value={time}
                          onChange={(e) => handleScheduleChange('discrete', index, day, timeIndex, e.target.value)}
                        />
                        <button type="button" className='btn btn-outline-danger ' onClick={() => handleRemoveScheduleTime('discrete', index, day, timeIndex)}>Remove Time</button>
                      </div>
                    ))}
                    <div style={{display:"flex", marginLeft: "20px", gap: "20px"}}>
                    <Form.Control
                      type="text"
                      style={{width: "250px",border: "1px solid black"}}
                      onChange={(e) => setNewTime(e.target.value)}
                    />
                    <button type="button" className="btn btn-outline-success" onClick={() => handleAddScheduleTime('discrete', index, day)}>Add Time</button>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" className="btn btn-danger m-4" onClick={() => handleRemoveDiscretePrompt(index)}>Remove Question</button>
              <hr/>
            </div>
          ))}
        
         <button type="button" className='btn btn-outline-primary m-4' onClick={handleAddDiscretePrompt}>Add Discrete Prompt</button>

        </div>
    )

    //Step-4 - Cognitive Prompt
    const stepFour = (
        <div>
            <h3>Cognitive Prompts</h3>
        
            {cognitivePrompts.map((prompt, index) => (
            <div key={index}>
              <Form.Label>Number of Digits:</Form.Label>
              <Form.Control
              style={{border: "1px solid black"}}
                type="number"
                value={prompt.numberOfDigits}
                onChange={(e) => {
                  const newPrompts = [...cognitivePrompts];
                  newPrompts[index].numberOfDigits = e.target.value;
                  setCognitivePrompts(newPrompts);
                }}
              />
              <Form.Label>Question ID:</Form.Label>
              <Form.Control
              style={{border: "1px solid black"}}
                type="number"
                value={prompt.questionid}
                onChange={(e) => {
                  const newPrompts = [...cognitivePrompts];
                  newPrompts[index].questionid = e.target.value;
                  setCognitivePrompts(newPrompts);
                }}
              />
              <label>Test Order:</label>
              <Form.Control
              style={{border: "1px solid black"}}
                type="text"
                value={prompt.testOrder}
                onChange={(e) => {
                  const newPrompts = [...cognitivePrompts];
                  newPrompts[index].testOrder = e.target.value;
                  setCognitivePrompts(newPrompts);
                }}
              />
              <label>Test Type:</label>
              <Form.Control
              style={{border: "1px solid black"}}
                type="text"
                value={prompt.testType}
                onChange={(e) => {
                  const newPrompts = [...cognitivePrompts];
                  newPrompts[index].testType = e.target.value;
                  setCognitivePrompts(newPrompts);
                }}
              />

              <div>
                <h4>Schedule</h4>
                {Object.keys(prompt.schedule).map(day => (
                  <div key={day} className="mb-4">
                    <h5>Day {day}:</h5>
                    {prompt.schedule[day].map((time, timeIndex) => (
                      <div key={timeIndex} className="mb-3" style={{display:"flex", gap: "20px"}}>
                        <Form.Control
                        style={{width: "250px", border: "1px solid black",  marginLeft: "30px"}}
                          type="text"
                          value={time}
                          onChange={(e) => handleScheduleChange('cognitive', index, day, timeIndex, e.target.value)}
                        />
                        <button type="button" className='btn btn-outline-danger ' onClick={() => handleRemoveScheduleTime('cognitive', index, day, timeIndex)}>Remove Time</button>
                      </div>
                    ))}
                    <div style={{display:"flex", marginLeft: "20px", gap: "20px"}}>
                    <Form.Control
                      type="text"
                      style={{width: "250px",border: "1px solid black"}}
                      onChange={(e) => setNewTime(e.target.value)}
                    />
                    <button type="button" className="btn btn-outline-success" onClick={() => handleAddScheduleTime('cognitive', index, day)}>Add Time</button>
                  </div>
                  </div>
                ))}
              </div>
              <button type="button" className="btn btn-danger m-4" onClick={() => handleRemoveCognitivePrompt(index)}>Remove Question</button>
              <hr/>
            </div>
            
          ))}
          <button type="button" className='btn btn-outline-primary m-4' onClick={handleAddCognitivePrompt}>Add Cognitive Prompt</button>
        </div>
        
    )

    //Step-5 - Watch Configuration Parameters
    // const stepFive = (
    //     <div>
    //         <h3>Watch Configuration Parameter</h3>
    //         <hr/>
    //         <Form.Label className='mt-4'>Accelerometer Active</Form.Label>
    //             <div style={{display:"flex"}}>
    //                 <Form.Switch defaultChecked={configWatchParams["accel_active"]} onChange={(e)=>handleCWPChange(e,"accel_active",true)}/><span style={{color:"grey"}}>when true accelorometer values are collected</span>
    //             </div>
    //             <hr/>
    //         <Form.Group className='mt-4'>
    //             <Form.Label>Accelerometer Rate</Form.Label>
    //             <Form.Control type="number" value={configWatchParams["accel_rate"]} onChange={(e)=>{handleCWPChange(e,"accel_rate",false)}}/>
    //         </Form.Group>
    //         <hr/>
    //         <Form.Label className='mt-4'>Location Active</Form.Label>
    //             <div style={{display:"flex"}}>
    //                 <Form.Switch defaultChecked={configWatchParams["location_active"]} onChange={(e)=>{handleCWPChange(e,"location_active",true)}}/><span style={{color:"grey"}}>when true location values are collected</span>
    //             </div><hr/>
    //         <Form.Group className='mt-4'>
    //             <Form.Label>Location Rate</Form.Label>
    //             <Form.Control type="number" value={configWatchParams["location_rate"]} onChange={(e)=>{handleCWPChange(e,"location_rate",false)}}/>
    //         </Form.Group>
    //         <hr/>
            
    //         <Form.Label className='mt-4'>Battery Active</Form.Label>
    //             <div style={{display:"flex"}}>
    //                 <Form.Switch defaultChecked={configWatchParams["battery_active"]} onChange={(e)=>{handleCWPChange(e,"battery_active",true)}}/><span style={{color:"grey"}}>when true battery values are collected</span>
    //             </div><hr/>
    //         <Form.Group className='mt-4'>
    //             <Form.Label>Battery Rate</Form.Label>
    //             <Form.Control type="number" value={configWatchParams["battery_rate"]} onChange={(e)=>{handleCWPChange(e,"battery_rate",false)}}/>
    //         </Form.Group><hr/>
            

    //         <Form.Label className='mt-4'>Heartrate Active</Form.Label>
    //             <div style={{display:"flex"}}>
    //                 <Form.Switch defaultChecked={configWatchParams["heartrate_active"]} onChange={(e)=>{handleCWPChange(e,"heartrate_active",true)}}/><span style={{color:"grey"}}>when true heartrate values are collected</span>
    //             </div><hr/>
    //         <Form.Group className='mt-4'>
    //             <Form.Label>Heartrate Rate</Form.Label>
    //             <Form.Control type="number" value={configWatchParams["heartrate_rate"]} onChange={(e)=>{handleCWPChange(e,"heartrate_rate",false)}}/>
    //         </Form.Group><hr/>

    //         <Form.Label className='mt-4'>Gyro Active</Form.Label>
    //             <div style={{display:"flex"}}>
    //                 <Form.Switch defaultChecked={configWatchParams["gyro_active"]} onChange={(e)=>{handleCWPChange(e,"gyro_active",true)}}/><span style={{color:"grey"}}>when true gyro values are collected</span>
    //             </div><hr/>
    //         <Form.Group className='mt-4'>
    //             <Form.Label>Export Rate</Form.Label>
    //             <Form.Control type="number" value={configWatchParams["export_rate"]}  onChange={(e)=>{handleCWPChange(e,"export_rate",false)}}/>
    //         </Form.Group><hr/>
            
    //         <Form.Label className='mt-4'>Pressure Active</Form.Label>
    //             <div style={{display:"flex"}}>
    //                 <Form.Switch defaultChecked={configWatchParams["pressure_active"]} onClick={(e)=>{handleCWPChange(e,"pressure_active",true)}}/><span style={{color:"grey"}}>when true pressure values are collected</span>
    //             </div><hr/>
    //         <Form.Group className='mt-4'>
    //             <Form.Label>Sampling Rate</Form.Label>
    //             <Form.Control type="number" value={configWatchParams["SAMPLING_RATE"]}  onChange={(e)=>{handleCWPChange(e,"SAMPLING_RATE",false)}}/>
    //         </Form.Group>
    //     </div>
    // )

    // // Step - 6 - Features
    // const stepSix = (
    //     <div>
    //         <h3>Features</h3>
    //         <hr></hr>
    //         <Form>
    //             {featureSet.map((feature,index) => {
    //                 return(
                        
    //                 <Form.Group id={feature.question} className='mt-4'>
    //                     <h4>{feature.question}</h4>
    //                     <div style={{display:"flex"}}>
    //                         <Form.Check value={featureSet[index].calculate} className="mt-2" onChange={(e)=>{handleFeaturesCalculate(e,index)}} />
    //                         <span className='m-2'> If this box is selected then {feature.question} data is collected.</span>
    //                     </div>
    //                     <FloatingLabel label="questionid">
    //                         <Form.Control value={featureSet[index].questionid} onChange={(e)=>{handleFeaturesQuestionid(e,index)}} type="number" placeholder='questionid'></Form.Control>
    //                     </FloatingLabel>
    //                     <hr/>
    //                 </Form.Group>)
    //             })}
    //         </Form>
    //     </div>
    // )

    // const stepSeven = (
    //     <div>
    //         <h3>Preview</h3>
    //         <hr/>
    //         <h4>Campaign Id:</h4>
    //         <div>
    //             <Form.Label>Campaign Id</Form.Label>

    //         </div>
    //     </div>
    // )



  // Render the content for the current step
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <div>{stepOne}</div>;
      case 1:
        return <div>{stepTwo}</div>;
      case 2:
        return <div>{stepThree}</div>;
      case 3:
        return <div>{stepFour}</div>
        // case 4:
        // return <div>{stepFive}</div>
        // case 5:
        // return <div>{stepSix}</div>
      default:
        return <div>Unknown Step</div>;
    }
  };
   
    return(
        <div style={{height:"100%",overflowY:"auto"}} className="bg-image">
            <NavBar/>
            <div style={{height:"inherit"}}>
                <Container style={{height:"100%"}}>
                    <Row style={{height:"100%"}}>
                        <Col lg={2} style={{height:"75%"}}>
                        <SideNavbar list={["Campaign List", "Create Campaign","Edit Campaign", "Create Coordinator", "Coordinator Permissions", "Edit Watch Configuration"]} active={1} links={["/managerDashboard","/createCampaign","/editCampaign","/createCoordinator","/coordinatorPermission","/editConfigureWatch"]}/>                        </Col>
                        <Col style={{height: "75%"}}>
                            <h2>Create Campaign</h2>
                            <hr/>
                            <div style={{marginLeft:"70px",marginTop:"40px",marginBottom:"40px",marginRight:"40px"}}>
                            <ProgressBar percent={(currentStep + 1) / totalSteps * 100} 
                                         filledBackground="rgba(79, 119, 170, 1)"
                                         unfilledBackground="transparent"
                                         >
        
                                {[...Array(totalSteps)].map((_, index) => (
                                    <Step key={index} transition="scale">
                                        {({ accomplished }) => (
                                            <div
                                                style={accomplished ? { backgroundColor: 'rgba(79, 119, 170, 1)',color:"white",borderRadius:"10px" } : {borderRadius:"10px",background:"rgb(255,255,255,0.6)",backdropFilter:"blur(5px)"}}
                                                onClick={() => goToStep(index)}
                                                className="clickable-step">
                                                <div style={{padding:"10px", borderRadius:"10px"}}>{progress_labels[index]}</div>
                
                                            </div>
                                        )}
                                    </Step>
                                ))}
                            </ProgressBar>
                            </div>




                            <Container className="p-4" style={{background:"rgba(255,255,255,0.3)",height:"inherit",overflowY:"auto"}}>
                                {renderStepContent(currentStep)}
                                <hr/>
                                <div style={{marginTop:"50px", display:"flex", justifyContent:"space-between"}}>
                                    
                                    {currentStep <= -1? <></>: <button style={{background:"rgba(79, 119, 170, 1)", color:"white"}} className='btn' onClick={()=>{goToStep(currentStep-1)}}>Previous</button>}
                                    {currentStep>= totalSteps-1?<></>:<button style={{background:"rgba(79, 119, 170, 1)", color:"white"}} className="btn" onClick={()=>{goToStep(currentStep+1);}}>Next</button>}
                                    {currentStep != totalSteps-1?<></>: <button style={{background:"rgba(79, 119, 170, 1)", color:"white"}} className="btn" onClick={(e)=>{handleSubmit(e)}}>Submit</button>}
                                </div>
                            </Container>
                            
                        </Col>
                    </Row>
                </Container>
            </div>

        </div>

    );
}

export default CreateCampaign;
