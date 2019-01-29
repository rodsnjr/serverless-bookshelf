const uuid4 = require('uuid/v4');
const dynamoDb = require('../database');
const BOOKS_TABLE = process.env.BOOKS_TABLE;

module.exports = {
    idParams: function(id) {
        return {
            TableName: BOOKS_TABLE,
            Key: {
                id: id
            }
        };
    },

    create: function(book) { 
          return new Promise((resolve, reject) => {
            console.log('Saving Book', book, 'On Table ', BOOKS_TABLE);
            book.id = uuid4();
            const params = {
                TableName: BOOKS_TABLE,
                Item: {
                  id: book.id,
                  name: book.name,
                }
            };

            dynamoDb.put(params, (error) => {
                if (error) {
                  console.log(error);
                  return reject({ error: 'Could not create Book' });
                }
                return resolve(book);
              });
          });
    },

    findAll: function() {
        return new Promise((resolve, reject) => {
            const params = {
                TableName: BOOKS_TABLE
            };

            dynamoDb.scan(params, (error, data) => {
                if (error) {
                    console.log(error);
                    return reject({ error: 'Could not find Books' });
                }
                return resolve(data.Items);
            })
        });
    },

    find: function(id) {
        return new Promise((resolve, reject) => {
            console.log('Querying Book', id, 'in the Database');
            dynamoDb.get(this.idParams(id), (error, data) => {
                if (error) {
                    console.log(error);
                    return reject({ error: 'Could not find Book with id ' + id })
                }
                return resolve(data.Item);
            });
        });
    },

    update: function(book) {
        return new Promise((resolve, reject) => {
            console.log('Updating Book ' , book.id);
            const params = {
                TableName: BOOKS_TABLE,
                Key: {
                  id: book.id
                },
                UpdateExpression: 'set #book=:val1',
                ExpressionAttributeValues: {
                  ":val1": book.name,
                },
                ExpressionAttributeNames: {
                    "#book": "name"
                },
                ReturnValues:"UPDATED_NEW"
            };

            dynamoDb.update(params, (err, data) => {
                if (err) {
                    console.log(err);
                    return reject({ error: 'Cannot Update Book '});
                }
                return resolve(data);
            });
        });
    },

    delete: function(id) {
        return new Promise((resolve, reject) => {
            console.log('Deleting Book ', id);
            dynamoDb.delete(this.idParams(id), (error, data) => {
                if (error) {
                    console.log(error);
                    return reject({ error: 'Could not delete Book with id ' + id });
                }
                return resolve(data);
            });
        });
    }
};