import axios from "axios"

export const getManagersList = (adminId) =>
     async dispatch => {
        try{
        const managerList = []
        //axios call
        const config = {
            headers: {
                'Custom-Header': 'value',
                'Content-Type': 'application/json'
            }
        };
       const res =  await axios.post("https://aa2397tzu2-vpce-00569c5e62069a9a0.execute-api.us-east-1.amazonaws.com/roamm/new_admin_dashboard",config)
        //change to final format
        

        //dispatch the state
        if(true){
            dispatch({type:"MANAGERS_LIST_SUCCESS",data:{managersList:[...res.data.body]}})
        }
        else{
            dispatch({type:"MANAGERS_LIST_FAILED",err: "ERROR MESSAGE"})
        }
    }
    catch(error){
        console.log(error)
    }
        
    }
