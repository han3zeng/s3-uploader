import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Uploader from './components/Uploader';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
  button {
    cursor: pointer;
  }
  input[type=file] {
    cursor: pointer;
  }
`;

const Container = styled.div`
  max-width: 1024px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  padding: 15px;
`;

function App() {
  /*
  const [region, setRegion] = useState('');
  useEffect(() => {
    getBucketRegion((targetRegion) => {
      console.log('targetRegion: ', targetRegion);
      setRegion(targetRegion);
    })
  }, [])
  */
  return (
    <Container>
      <Uploader />
      <GlobalStyle />
    </Container>
  );
}

export default App;
