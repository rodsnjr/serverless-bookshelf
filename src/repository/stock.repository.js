const uuid4 = require('uuid/v4');
const dynamoDb = require('../database');
const STOCK_TABLE = process.env.STOCK_TABLE;

module.exports = {
    stockEntry: function(bookId, amount) {
        console.log(`Repository Stock Entry for BookId ${bookId} with amount ${amount}`);
        return new Promise((resolve, reject) => {
            const stockEntry = {
                id: uuid4(),
                bookId: bookId,
                amount: amount
            }
    
            const params = {
                TableName: STOCK_TABLE,
                Item: stockEntry
            };
            dynamoDb.put(params, (error) => {
                if (error) {
                  console.log(error);
                  return reject({ error: 'Could not create Stock Entry' });
                }
                return resolve(stockEntry);
            });
        });
    },
    amountStockByBookId: function(bookId) {
        console.log(`Counting Amounts of Book Id ${bookId} in Stock`);
        return new Promise((resolve, reject) => {
            const queryParams = {
                TableName : STOCK_TABLE,
                FilterExpression: "bookId = :id",
                ExpressionAttributeValues: {
                    ":id": bookId
                }
            };

            dynamoDb.scan(queryParams, (err, data) => {
                if (err) {
                    console.log(err);
                    return reject({ error: 'Error on Finding Stock Entries' });
                }
                
                let sum = 0;
                
                if (data.Items.length > 0){
                    sum = data.Items
                            .map(stock => stock.amount)
                            .reduce((previousAmount, nextAmount) => previousAmount + nextAmount);
                }
                resolve({
                    bookId: bookId,
                    amount: sum
                })
            });
        })
    }
}