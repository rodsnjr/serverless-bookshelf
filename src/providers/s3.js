const AWS = require('aws-sdk');
const IS_OFFLINE = process.env.IS_OFFLINE;
const S3_PORT = process.env.S3_PORT;

let s3;

if (IS_OFFLINE) {
    console.log(`Creating Offline S3 on PORT = ${S3_PORT}`);
    s3 = new AWS.S3({
        s3ForcePathStyle: true,
        endpoint: new AWS.Endpoint(`http://localhost:${S3_PORT}`),
    });
} else {
    s3 = new AWS.S3();
}

module.exports = s3;