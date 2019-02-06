const AWS = require('aws-sdk');
const IS_OFFLINE = process.env.IS_OFFLINE;
const DYNAMO_PORT = process.env.DYNAMO_PORT;
let dynamoDb;

if (IS_OFFLINE) {
  console.log('Starting Offline Dynamo', IS_OFFLINE);
  dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: `http://localhost:${DYNAMO_PORT}`
  })
} else {
  console.log('Starting Online Dynamo');  
  dynamoDb = new AWS.DynamoDB.DocumentClient();
};

module.exports = dynamoDb;