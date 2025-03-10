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
import PageTemplate from '../Components/PageTemplate';


const createInitialSchedule = () => {
    const schedule = {};
    for (let day = 1; day <= 7; day++) {
      schedule[day] = [];
    }
    return schedule;
  };

  

function CampaignTest(props){
    const [campaignId, setCampaignId] = useState('');
  const [cognitivePrompts, setCognitivePrompts] = useState([]);
  const [discretePrompts, setDiscretePrompts] = useState([]);
  const [numericPrompts, setNumericPrompts] = useState([]);
  const [newDiscreteValue, setNewDiscreteValue] = useState('');
  const [newAnchor, setNewAnchor] = useState({ value1: '', value2: '', value3: '' });
  const [newTime, setNewTime] = useState('');

  const handleAddCognitivePrompt = () => {
    setCognitivePrompts([...cognitivePrompts, { numberOfDigits: 0, questionid: 0, schedule: createInitialSchedule(), testOrder: '', testType: '' }]);
  };

  const handleRemoveCognitivePrompt = (index) => {
    setCognitivePrompts(cognitivePrompts.filter((_, i) => i !== index));
  };

  const handleAddDiscretePrompt = () => {
    setDiscretePrompts([...discretePrompts, { longUIquestion: '', question: '', questionid: 0, schedule: createInitialSchedule(), type: '', values: [] }]);
  };

  const handleRemoveDiscretePrompt = (index) => {
    setDiscretePrompts(discretePrompts.filter((_, i) => i !== index));
  };

  const handleAddNumericPrompt = () => {
    setNumericPrompts([...numericPrompts, { anchors: [], default_value: 0, inc: 1, longUIquestion: '', max: 0, min: 0, question: '', questionid: 0, schedule: createInitialSchedule(), type: '' }]);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const campaignData = {
      campaignid: campaignId,
      CognitivePrompt: cognitivePrompts,
      DiscretePrompt: discretePrompts,
      NumericPrompt: numericPrompts,
    };
    console.log(JSON.stringify(campaignData, null, 2));
  };

    



    return(
        <PageTemplate
        child={
            <div>




            
<div>
      <form onSubmit={handleSubmit}>

        <div>
          <Form.Label>Campaign ID:</Form.Label>
          <Form.Control type="text" value={campaignId} onChange={(e) => setCampaignId(e.target.value)} />
        </div>




        <div>
          <h2>Cognitive Prompts</h2>
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






        <div>
          <h2>Discrete Prompts</h2>
          {discretePrompts.map((prompt, index) => (
            <div key={index}>
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
              <label>Type:</label>
              <Form.Control
              style={{border: "1px solid black"}}
                type="text"
                value={prompt.type}
                onChange={(e) => {
                  const newPrompts = [...discretePrompts];
                  newPrompts[index].type = e.target.value;
                  setDiscretePrompts(newPrompts);
                }}
              />
              <label>Values:</label>
              <Form.Control
              style={{border: "1px solid black"}}
                type="text"
                value={newDiscreteValue}
                onChange={(e) => setNewDiscreteValue(e.target.value)}
              />
              <button type="button" onClick={() => handleAddDiscreteValue(index)}>Add Value</button>
              <div>
                {prompt.values.map((value, valueIndex) => (
                  <div key={valueIndex}>
                    <span>{value}</span>
                    <button type="button" onClick={() => handleRemoveDiscreteValue(index, valueIndex)}>Remove</button>
                  </div>
                ))}
              </div>

              <div className='mt-3'>
                <h4>Schedule</h4>
                {Object.keys(prompt.schedule).map(day => (
                  <div key={day} className="m-3">
                    <h5>Day {day}:</h5>
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







        <div>
          <h2>Numeric Prompts</h2>
          {numericPrompts.map((prompt, index) => (
            <div key={index}>
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
              <Form.Control
              style={{border: "1px solid black"}}
                type="text"
                value={newAnchor.value1}
                onChange={(e) => setNewAnchor({ ...newAnchor, value1: e.target.value })}
              />
              <Form.Control
              style={{border: "1px solid black"}}
                type="text"
                value={newAnchor.value2}
                onChange={(e) => setNewAnchor({ ...newAnchor, value2: e.target.value })}
              />
              <Form.Control
              style={{border: "1px solid black"}}
                type="text"
                value={newAnchor.value3}
                onChange={(e) => setNewAnchor({ ...newAnchor, value3: e.target.value })}
              />
              <button type="button" onClick={() => handleAddAnchor(index)}>Add Anchor</button>
              <div>
                {prompt.anchors.map((anchor, anchorIndex) => (
                  <div key={anchorIndex}>
                    <span>{anchor.join(', ')}</span>
                    <button type="button" onClick={() => handleRemoveAnchor(index, anchorIndex)}>Remove </button>
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

        <button type="submit">Submit</button>
      </form>
    </div>






            </div>
        }/>
    )

}
export default CampaignTest;
