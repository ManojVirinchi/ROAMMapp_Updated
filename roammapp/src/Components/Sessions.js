import {Auth} from 'aws-amplify'
import { useNavigate } from 'react-router-dom';

export const sessionChecker = () =>{
    Auth.currentSession()
    .then(session => {
        {
            const now = Math.floor(Date.now() / 1000); // current time in Unix seconds
            const isValid = session.getAccessToken().getExpiration() > now;
            if (!isValid) {
              Auth.signOut() // If the session is not valid, handle expiration
              useNavigate("/")
            }
          }}
    ).catch(error => {
        Auth.signOut()
        useNavigate("/")
    })

}