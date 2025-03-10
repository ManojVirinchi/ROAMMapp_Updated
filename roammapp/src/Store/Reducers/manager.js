
let initialState = {
    campaignList:[]
}

export default function manager(state=initialState, action){
    switch(action.type){
        case "GET_CAMPAIGNS_SUCCESS":{
           return {...state,campaignList: [...action.data]}
        }
        case "GET_CAMPAIGNS_FAILED":{
            return {...state};
        }
        default:
            return {...state};
    }
}
