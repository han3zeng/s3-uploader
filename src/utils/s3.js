const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const BUCKET_NAME = 'pts-multimedia';
const DIRECTORY_NAME = 'recall-vote-han-kuo-yu';
require('dotenv').config();

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
      ContentType: contentType
    };
    s3.putObject(params, function (err, data) {
      if (err) {
        reject({
          status: 0,
          fileName,
        });
      } else {
        const url = `https://d3prffu8f9hpuw.cloudfront.net/${DIRECTORY_NAME}/${fileName}`
        resolve({
          status: 1,
          url,
          fileName,
        });
      }
    });
  })
};

export {
  uploadFile
};
