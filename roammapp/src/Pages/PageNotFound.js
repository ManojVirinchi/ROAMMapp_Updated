import React from 'react'
import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import PageNotFoundImage from '../static/404_PageNotFound.svg'
function PageNotFound(){
    return(
        <Container style={
            {
                height:"80%",
            }
        }>
            <div style={{
                height:"80%",
                display:"flex",
                alignItems: "center",
                justifyContent:"center",
                flexDirection:"column",
            }}>
            <Image src={PageNotFoundImage} height={500} width={500}/>
            <h5>No page found that you are looking for. Please try another Page.</h5>
            </div>
            
        </Container>
    );
}

export default PageNotFound;