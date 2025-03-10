

const initialState = {
    isLoggedIn: false,
    info:{},
    email: null,  
}

export default function user(state=initialState, action){
    switch(action.type){

        case "USER_LOGIN_SUCCESS":
            return {...state,isLoggedIn:true,info:{...action.data}};
        
        case "SET_USER_EMAIL":
            return{...state,
            email: action.payload};

        default:
            return state;
    }
}