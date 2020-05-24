const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const logger = require('./create-logger');
const mime = require('mime');
require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_API_KEY,
  secretAccessKey: process.env.AWS_SECRET
});

function traverseRecursively(currentDirectory, cb) {
  fs
    .readdirSync(currentDirectory)
    .forEach((fileName) => {
      const pwd = path.join(currentDirectory, fileName);
      const stat = fs.statSync(pwd);
      if (stat.isFile()) {
        cb(pwd, fileName);
      } else {
        traverseRecursively(pwd, cb);
      }
    })
}

function uploadDirectory(targetDirectory, bucketName) {
  traverseRecursively(targetDirectory, (pwd, fileName) => {
    const bucketPath = pwd.substring(targetDirectory.length+1);
    const ext = path.extname(pwd).split('.').join('');
    const contentType = mime.getType(ext);
    const params = {
      Bucket: bucketName,
      Key: bucketPath,
      Body: fs.readFileSync(pwd),
      ContentType: contentType,
    };
    s3.putObject(params, function (err, data) {
      if (err) {
        logger.log({
          level: 'error',
          message: `fail to upload file - erroe messae: ${err}`
        });
      } else {
        logger.log({
          level: 'info',
          message: `File uploaded successfully. Etag: ${data.ETag}. file: ${fileName}`
        });
      }
    });
  })

}

const BUCKET_NAME = 'recall-06-06';
const DIRECTORY = path.resolve(__dirname, '../../build');

uploadDirectory(DIRECTORY, BUCKET_NAME);
