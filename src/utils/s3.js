import { setup }  from '../config';
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const BUCKET_NAME = 'pts-multimedia';
const DIRECTORY_NAME = 'recall-vote-han-kuo-yu';
require('dotenv').config();

const status = {
  fail: 0,
  success: 1,
}

const s3 = new AWS.S3({
  accessKeyId: process.env.REACT_APP_AWS_API_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET,
  region: 'ap-southeast-1',
});

// const getBucketRegion = (cb) => {
//   const s3 = new AWS.S3({
//     accessKeyId: process.env.AWS_API_KEY,
//     secretAccessKey: process.env.AWS_SECRET,
//     region: 'ap-southeast-1',
//   });
//   const params = {
//     Bucket: BUCKET_NAME,
//   };
//   s3.getBucketLocation(params, function(err, data) {
//     if (err) console.log(err, err.stack); // an error occurred
//     else {
//       return cb(data.LocationConstraint);
//     }
//   });
// }

const deleteFile = ({
  fileName,
}) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: BUCKET_NAME,
      Key: `${DIRECTORY_NAME}/${fileName}`,
    }
    s3.deleteObject(params, (err, data) => {
      if (err) {
        reject({
          status: status.fail,
          fileName,
        });
      } else {
        resolve({
          status: status.success,
          fileName,
        });
      }
    })
  })
}


const uploadFile = ({
  fileName,
  contentType,
  typedArray,
}) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: BUCKET_NAME,
      Key: `${DIRECTORY_NAME}/${fileName}`,
      Body: typedArray,
      ContentType: contentType,
      CacheControl: 'max-age=604800'
    };
    s3.putObject(params, function (err, data) {
      if (err) {
        reject({
          status: status.fail,
          fileName,
        });
      } else {
        const url = `${setup.cloudFrontBase}/${DIRECTORY_NAME}/${fileName}`
        resolve({
          status: status.success,
          url,
          fileName,
        });
      }
    });
  })
};

const listFiles = () => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: BUCKET_NAME,
      Prefix: `${DIRECTORY_NAME}/`,
    };
    s3.listObjectsV2(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  })
}

export {
  uploadFile,
  listFiles,
  deleteFile
};
