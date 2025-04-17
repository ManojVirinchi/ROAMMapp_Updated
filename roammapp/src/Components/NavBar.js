import React, {useState, useEffect } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import {connect} from 'react-redux'
import {Auth} from 'aws-amplify'
import {useNavigate} from 'react-router-dom'
function NavBar(props){
    const navigate = useNavigate()
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(()=> async () => {
        try {
            const session = await Auth.currentSession();
            if(session.isValid()){
                localStorage.setItem("isLoggedIn",true)
                setIsLoggedIn(true)
            }
            else{
                setIsLoggedIn(false)
                localStorage.setItem("isLoggedIn",false)
                handleLogout()
                navigate("/")
            }
            
          } catch (error) {
            if (error === 'No current user') {
              console.log('User is not authenticated.');
              localStorage.setItem("isLoggedIn",false)
              navigate("/")
            } else {
                localStorage.setItem("isLoggedIn",false)
              console.error('An unexpected error occurred:', error);
              navigate("/")
            }
          }
    },[])

    const handleLogout = async () =>{
        localStorage.setItem("isLoggedIn",false)
        await Auth.signOut()
    }
    return(
        <div style={{marginBottom:"30px"}}>
        <Navbar variant='light'>
        {/* <Container> */}
            <Navbar.Brand href="/" style={{padding: '10px'}}>ROAMM</Navbar.Brand>
            <Nav className="ms-auto">
                {!localStorage.getItem("isLoggedIn") && <div onClick={()=>{navigate("/")}}>Login</div>}
                { localStorage.getItem("isLoggedIn") && <div onClick={()=>{handleLogout();navigate("/");}} style={{
                                    cursor: 'pointer',
                                    padding: '10px',
                                    marginLeft: 'auto',
                                    fontWeight: 'bold',
                                }}>Logout</div>}
            </Nav>
        {/* </Container> */}
      </Navbar>
      <br />
        </div>
    );
}

const mapStateToProps = (state, ownProps) => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        login: () => dispatch()
    }
}

export default connect()(NavBar);