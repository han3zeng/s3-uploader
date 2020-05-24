import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { listFiles, deleteFile } from '../utils/s3';
import { setup } from '../config';

const Container = styled.div`
  border-radius: 5px;
  border: 1px solid #cccccc;
  width: 100%;
  max-width: 600px;
  padding: 15px;
  margin-top: 40px;
`

const Header = styled.h2`
  text-align: center;
`

const exclusionMap = {
  '.json': true
};


const Li = styled.li`
  margin-bottom: 13px;
  > div {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
`

function List({
  previousLoadingStatus,
  isUploading,
  setIsUploading,
}) {
  const [ files, setFiles ] = useState([]);

  const fetchFile = () => {
    listFiles()
      .then((data) => {
        const { Contents } = data;
        setFiles(Contents);
      })
      .catch((err) => {
        console.log('err: ', err)
      })
  }

  useEffect(() => {
    fetchFile();
  }, []);

  useEffect(() => {
    if (previousLoadingStatus === true && isUploading === false) {
      fetchFile();
    }
  }, [previousLoadingStatus, isUploading]);


  const deleteFileAction = ({
    fileName
  }) => {
    setIsUploading(true);
    deleteFile({
      fileName,
    })
    .then(() => {
      setIsUploading(false);
    })
    .catch((err) => {
      setIsUploading(false);
      console.log('delete err: ', err)
    })
  }


  const list = files.map((file, index) => {
    const { Etag, Key } = file;
    const fileName = Key.split('/')[1];
    const pattern = /\.[0-9a-z]+$/i;
    const extension = fileName.match(pattern);
    if (fileName && !exclusionMap[extension]) {
      return (
        <Li
          key={file.ETag}
        >
          <div>
            <div>
              <div>
                {fileName}
              </div>
              <div>
                {`${setup.cloudFrontBase}/${Key}`}
              </div>
            </div>
            <button onClick={() => {
                deleteFileAction({
                  fileName,
                })
              }}>
              Delete
            </button>
          </div>
        </Li>
      )
    }
    return null;
  })

  return (
    <Container>
      <Header>All Files On Server</Header>
      <ol>
        {list}
      </ol>
    </Container>
  )
}

export default List;
