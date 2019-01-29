const AWS = require('aws-sdk');
const IS_OFFLINE = process.env.IS_OFFLINE;
const DYNAMO_PORT = process.env.DYNAMO_PORT;
let dynamoDb;

if (IS_OFFLINE === 'true') {
    console.log('Is Offline', IS_OFFLINE);
  dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: `http://localhost:${DYNAMO_PORT}`
  })
  console.log(dynamoDb);
} else {
  dynamoDb = new AWS.DynamoDB.DocumentClient();
};

module.exports = dynamoDb;