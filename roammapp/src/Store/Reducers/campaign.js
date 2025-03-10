
const initialState = {
    participantList:[],
    campaignName: null,
    campaignId: null
}

export default function campaign(state=initialState, action){
    switch(action.type){
        case "CAMPAIGN_INFO_SUCCESS":
            return {...state, campaignName: action.data.name,campaignId: action.data.id, participantList: [...action.data.list]}
        case "CAMPAIGN_INFO_FAILED":
            return {...state}
        default:
            return state;
    }
}