import { ConsoleLogger } from "@aws-amplify/core"
import axios from "axios"

export const getParticipantInfo = (managerId, campaignId,participantId) =>
    async dispatch  => {
        try{
        //axios call
    
        //get final output format
        console.log(managerId)
        const notifications = []
        // const participantInfo = {
        //     participantId: "M343",
        //     // firstName:"John",
        //     // lastName: "Karniski",
        //     // middleName:"",
        //     email:"john@dummy.com",
        //     // phone: "+1 xxx-xxx-xxxx",
        //     // addressLine1:"xxx xxx xxx xxxxx,",
        //     // addressLine2:"Gainesville, Florida",
        //     // pincode: "xxxxx",
        //     startDate: "02/24/2021",
        //     endDate:"04/23/2021",
        //     age: 32,
        //     gender: "Male",
        //     race:"white",
        //     ethnicity: "Hispanic or Latino" 
        // }

        let participantInfo = {}

        const requestData = {
            manager_id : managerId,
            campaign_id: campaignId,
            participant_id: participantId

        }
        console.log(requestData)
        const response = await axios.post("https://aa2397tzu2-vpce-00569c5e62069a9a0.execute-api.us-east-1.amazonaws.com/roamm/new_participant_dashboard",requestData)
        console.log(response.data.body)
        participantInfo = {...JSON.parse(response.data.body)[0]}
        //dispatch the state
        if(true){
            dispatch({type:"PARTICIPANT_INFO_SUCCESS", data:{notifications,participantInfo}})
        }
        else{
            dispatch({type:"PARTICIPANT_INFO_FAILED" , err: "ERROR MESSAGE"})
        }
    }
    catch(error){
        console.log(error)
    }
        
    }
    

export const createParticipantAction = (participantInfo) => 
    async dispatch => {
        try{
        //axios call
        const response = await axios.post("https://aa2397tzu2-vpce-00569c5e62069a9a0.execute-api.us-east-1.amazonaws.com/roamm/new_manager_dashboard/new_create_participant",participantInfo)
        console.log(response)
        console.log(participantInfo)
        dispatch({type:"CREATE_PARTICIPANT_SUCCESS",message:"Participant Created"})
        }
        catch(error){
            console.log(error)
        }
       
    }


    export const configureWatchAction = (configuration) => 
        async dispatch => {
            try{
                console.log(configuration)
                const response = await axios.post("https://aa2397tzu2-vpce-00569c5e62069a9a0.execute-api.us-east-1.amazonaws.com/roamm/new_config_watch",configuration)
                console.log(response)
                dispatch({type:"CONFIGURATION_WATCH_SUCCESS",message:"Watch configuration successful"})
            }
            catch(error){
                console.log(error)
            }
        }


    export const analyticsData = (managerId,campaignId,participantId) =>
        async dispatch => {
            const requestData = {
                // manager_id : managerId,
                campaignid: "ShahPostSurgery_Apple",
                participant_id: "P1"
            }
            try{
                const response = await axios.post("https://aa2397tzu2-vpce-00569c5e62069a9a0.execute-api.us-east-1.amazonaws.com/roamm/new_dataanalytics",requestData)
                console.log(JSON.parse(response.data.body["descrete"]))
                dispatch({type:"ANALYTICS_DATA_SUCCESS",data:{response}})
            }
        catch(e){
            console.log(e)
        }
    }

    export const getCampaignQuestions = (campaignId) => 
    async dispatch => {
        const requestData = {
            campaignid: campaignId
        }
        try{
            const response = await axios.post("https://aa2397tzu2-vpce-00569c5e62069a9a0.execute-api.us-east-1.amazonaws.com/roamm/new_dataanalytics/new_unique_questions",requestData)
            let descrete = JSON.parse(response.data.body["descrete"])
            let numeric = JSON.parse(response.data.body["numeric"])
            let questions = {descrete,numeric}
            console.log(questions)
            dispatch({type:"GET_CAMPAIGN_QUESTIONS_SUCCESS",data:questions})
        }
        catch(e){
            console.log(e)
            dispatch({type:"GET_CAMPAIGN_QUESTIONS_FAIL"})
        }
    }