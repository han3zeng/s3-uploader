import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background-color: rgba(0,0,0,.5);
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  position: fixed;
  transform: translateZ(0);
  transition: opacity .2s linear;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Content = styled.div`
  border-radius: 4px;
  background-color: white;
  padding: 50px 50px;
  font-size: 25px;
`

const Mask = ({
  showUp,
}) => {

  if (document && showUp) {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
  }

  if (document && !showUp) {
    document.body.style.overflow = null;
    document.body.style.position = null;
  }

  if (showUp) {
    return (
      <Container>
        <Content>
          Loading...
        </Content>
      </Container>
    )
  } else {
    return null;
  }
}

export default Mask;
