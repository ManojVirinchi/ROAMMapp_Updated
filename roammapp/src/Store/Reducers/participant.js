
const initialState = {
    participantInfo:{},
    notifications:[],
    questions:null
}

export default function participant(state=initialState, action){
    switch(action.type){
        case "PARTICIPANT_INFO_SUCCESS":
            console.log(action.data)
            return {...state,participantInfo: action.data.participantInfo,notifications:action.data.notifications}
        case "PARTICIPANT_INFO_FAILED":
            return {...state}
        case "GET_CAMPAIGN_QUESTIONS_SUCCESS":
            return {...state,questions:action.data}
        case "GET_CAMPAIGN_QUESTIONS_FAIL":
            return {...state,questions: null}
        default:
            return state;
    }
}