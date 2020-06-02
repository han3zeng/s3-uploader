import React, { useEffect, useState, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Uploader from './components/Uploader';
import List from './components/List';
import Mask from './components/Mask';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
  }
  button {
    cursor: pointer;
    padding: 5px 8px;
    background-color: white;
    border-radius: 3px;
    border: 1px solid #cccccc;
    &:hover {
      background-color: #F5F5F5;
    }
  }
  input[type=file] {
    cursor: pointer;
  }
`;

const Container = styled.div`
  margin: 0 auto;
  width: 100%;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function App() {
  const [ isUploading, setIsUploading ] = useState(false);
  const previousLoadingStatus = usePrevious(isUploading);

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
      <Mask
        showUp={isUploading}
      />
      <Uploader
        setIsUploading={setIsUploading}
        isUploading={isUploading}
      />
      <List
        previousLoadingStatus={previousLoadingStatus}
        isUploading={isUploading}
        setIsUploading={setIsUploading}
      />
      <GlobalStyle />
    </Container>
  );
}

export default App;
