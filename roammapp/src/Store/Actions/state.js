export const setAdminId = (adminId) => {
    return (dispatch, ownProps) =>{
        dispatch({type:"SET_ADMINID_SUCCESS", data:{adminId: adminId}})
    }
}

export const setManagerId = (managerId) => {
    return (dispatch, ownProps) =>{
        dispatch({type:"SET_MANAGERID_SUCCESS", data:{managerId: managerId}})
    }
}

export const setCampaignId = (campaignId) => {
    return (dispatch, ownProps) =>{
        dispatch({type:"SET_CAMPAIGNID_SUCCESS", data:{campaignId: campaignId}})
    }
}

export const setParticipantId = (participantId) => {
    return (dispatch, ownProps) =>{
        dispatch({type:"SET_PARTICIPANTID_SUCCESS", data:{participantId: participantId}})
    }
}