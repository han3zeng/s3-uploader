import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { uploadFile } from '../utils/s3';

const Container = styled.div`
  border-radius: 5px;
  border: 1px solid #cccccc;
  width: 100%;
  max-width: 600px;
  padding: 15px;
`

const Header = styled.h2`
  text-align: center;
`

const Panel = styled.div`
  display: flex;
  justify-content: space-between;
`

const Pending = styled.div``

const statusOptions = {
  pending: 'pending',
  success: 'success',
  fail: 'fail',
}

const fileElem = ({
  fileName,
  status=statusOptions.pending,
  url=undefined,
}) => {
  return {
    fileName,
    status,
    url,
  }
}

let fileMap = {};

function Uploader({
  setIsUploading,
  isUploading,
}) {
  const [ pendingFiles, setPendingFiles ] = useState([]);

  const upload = (e) => {
    e.preventDefault();
    const keys = Object.keys(fileMap);
    if (keys.length === 0) {
      return;
    }
    let acc = 0;
    setIsUploading(true);
    let localPendingFiles = [ ...pendingFiles ];
    keys.forEach((key, index) => {
      uploadFile({
        typedArray: fileMap[key].typedArray,
        fileName: key,
        contentType: fileMap[key].contentType,
      })
      .then(({
        url,
        fileName,
        status,
      }) => {
        const newPendingFiles = localPendingFiles.map((file) => {
          if (file.fileName === fileName) {
            return fileElem({
              fileName,
              url,
              status: statusOptions.success,
            })
          }
          return file;
        })
        localPendingFiles = newPendingFiles;
        setPendingFiles(newPendingFiles);
        acc++
        if (acc === keys.length) {
          setIsUploading(false);
        }
      })
      .catch(({
        fileName,
        status,
      }) => {
        const newPendingFiles = localPendingFiles.map((file) => {
          if (file.fileName === fileName) {
            return fileElem({
              fileName,
              status: statusOptions.fail,
            })
          }
          return file;
        })
        localPendingFiles = newPendingFiles;
        setPendingFiles(newPendingFiles);
        acc++
        if (acc === keys.length) {
          setIsUploading(false);
        }
      })
    })
  }
  const onChangeHandler = (e) => {
    fileMap = {};
    setPendingFiles([]);
    let acc = 0;
    const fileList = e.target.files;
    for(let i = 0 ; i < fileList.length ; i++) {
      const reader = new FileReader();
      const file = fileList[i]
      reader.readAsArrayBuffer(file)
      reader.onload = function(e) {
        const arrayBuffer = e.target.result;
        const typedArray = new Uint8Array(arrayBuffer);
        fileMap[file.name] = {
          typedArray,
          contentType: file.type,
        }
        acc++;
        if (acc === fileList.length) {
          const files = Object.keys(fileMap).map((fileName) => fileElem({ fileName }))
          setPendingFiles(files);
        }
      };
    }
  }

  const PendingFiles = pendingFiles.map((file, index) => {
    return (
      <li
        key={`pending_${file}_${index}`}
      >
        <div>
          <span>{file.fileName} - </span>
          <span>{file.status}</span>
        </div>
        {file.url && <span>{file.url}</span>}
      </li>
    )
  })

  return (
    <Container>
      <Header>File Uploader</Header>
      <Panel>
        <input
          type="file"
          id="files"
          name="files"
          multiple
          onChange={onChangeHandler}
        />
      <button onClick={upload}>Upload</button>
      </Panel>
      <div>
        <h3>Status</h3>
        <div>{`status: ${isUploading ? 'Loading...' : 'Idle'}`}</div>
      </div>
      <Pending>
        <h3>Files</h3>
        <ol>
          {PendingFiles}
        </ol>
      </Pending>
    </Container>
  )
}

export default Uploader;
