import axios from 'axios'

const participantList = [
    {
        pid: "1253",
        startDate: "02/23/2021",
        endDate: "05/22/2021",
        wearTime: 7,
        compliance: 87,
        totalData: "12(8/4)",
        batteryDecay: 4
    },
    {
        pid: "6346",
        startDate: "06/01/2022",
        endDate: "09/01/2022",
        wearTime: 4.5,
        compliance: 91,
        totalData: "20(12/8)",
        batteryDecay: 3
    },
]


//Gives the information and the Table of participants in the Campaign Dashboard page
export const getCampaignInfo = (managerId,campaignId) =>
    async (dispatch) => {
        try{
    //axios call
    const requestData = {
        campaign_id: campaignId
    }
    const response = await axios.post("https://aa2397tzu2-vpce-00569c5e62069a9a0.execute-api.us-east-1.amazonaws.com/roamm/new_campaign_dashboard",requestData)
    
    //update the data format required for the dispatch

    //dispatch the action
    if(true){
        dispatch({type:"CAMPAIGN_INFO_SUCCESS",data:{name:"EHR",id:"C2334",list: [...JSON.parse(response.data.body)]}})
    }
    else{
        dispatch({type:"CAMPAIGN_INFO_FAILED",err:"ERROR MESSAGE"})
    }
    }
    catch(error){
        console.log(error)
    }
}
    