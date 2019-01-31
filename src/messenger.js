const AWS = require('aws-sdk');
const IS_OFFLINE = process.env.IS_OFFLINE;
const SNS_PORT = process.env.SNS_PORT;

let sns;

if (IS_OFFLINE) {
    console.log(`Creating Offline SNS on Port ${SNS_PORT}`);
    sns = new AWS.SNS({
        endpoint: `http://127.0.0.1:${SNS_PORT}`,
        region: "us-east-1",
    });
} else {
    console.log('Creating Online SNS');
    sns = new AWS.SNS();
}

module.exports = sns;