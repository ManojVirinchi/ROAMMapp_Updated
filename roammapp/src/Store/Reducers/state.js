const initialState = {
    adminId: "",
    managerId:"",
    campaignId:"",
    participantId: ""
    

}

export default function state(state=initialState, action){
    switch(action.type){
        case "SET_ADMINID_SUCCESS":
            return {...state,adminId: action.data.adminId}
        case "SET_ADMIN_FAILED":
            return {...state}
        case "SET_MANAGERID_SUCCESS":
            return {...state,managerId: action.data.managerId}
        case "SET_MANAGERID_FAILED":
            return {...state}
        case "SET_CAMPAIGNID_SUCCESS":
            return {...state,campaignId: action.data.campaignId}
        case "SET_CAMPAIGNID_FAILED":
            return {...state}
        case "SET_PARTICIPANTID_SUCCESS":
            return {...state,participantId: action.data.participantId}
        case "SET_PARTICIPANTID_FAILED":
            return {...state}
        default:
            return {...state}
    }
}