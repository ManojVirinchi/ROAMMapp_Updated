import { CognitoUserPool,CognitoUser, CognitoUserAttribute } from "amazon-cognito-identity-js";

export const login = (userObject) =>
    async dispatch => {
        console.log(userObject)
        dispatch({type:"USER_LOGIN_SUCCESS",data: userObject})
    }

export const SET_USER_EMAIL = "SET_USER_EMAIL";

export const setUserEmail = (email) => {
    return {
        type: SET_USER_EMAIL,
        payload: email,
    };
};
