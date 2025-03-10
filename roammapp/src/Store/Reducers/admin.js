
const initialState = {
    managerList:[]
}

export default function campaign(state=initialState, action){
    switch(action.type){
        case "MANAGERS_LIST_SUCCESS":
            return {...state, managerList: [...action.data.managersList]}
        case "MANAGERS_LIST_FAILED":
            return {...state}
        default:
            return {...state};
    }
}