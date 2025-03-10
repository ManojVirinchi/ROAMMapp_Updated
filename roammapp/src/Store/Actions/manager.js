import axios from "axios"
import { Navigate } from "react-router-dom";
import {Auth} from 'aws-amplify'
export const getCampaigns = (managerId)=>
    async dispatch => {

    try{
    //axios call 
       // console.log(`managerId: ${managerId}`)
    const config = {
        headers: {
            'Custom-Header': 'value',
            'Content-Type': 'application/json'
        }
    };

    const requestData = {
        manager_id: managerId
    }
    const response = await axios.post("https://aa2397tzu2-vpce-00569c5e62069a9a0.execute-api.us-east-1.amazonaws.com/roamm/new_manager_dashboard",requestData)
   
    //get the campaign

    //return the cmapaigns
    if(true){
        dispatch({type:"GET_CAMPAIGNS_SUCCESS",data:[...response.data.body]})
    }
    else{
        dispatch({type:"GET_CAMPAIGNS_FAILED",err:"Error MEssage"})
    }
}
catch(error){
    console.log(error)
}
}

export const createManagerAction = (managerInfo) =>
    async dispatch => {
        //axios call
        try{
            const response = await axios.post("https://aa2397tzu2-vpce-00569c5e62069a9a0.execute-api.us-east-1.amazonaws.com/roamm/new_manager_dashboard/new_create_manager", managerInfo)
            console.log(response.data)
            Auth.signUp()
            dispatch({type:"CREATE_MANAGER_INFO",message:"Manager Created"})
        }
        catch(error){
            alert(error)
        }
    }
