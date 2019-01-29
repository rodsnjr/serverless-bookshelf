const uuid4 = require('uuid/v4');
const dynamoDb = require('../database');
const BOOKS_TABLE = process.env.BOOKS_TABLE;

module.exports = {
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
            const params = {
                TableName: BOOKS_TABLE,
                Key: {
                    id: id
                }
            };

            dynamoDb.get(pararms, (error, data) => {
                if (error) {
                    console.log(error);
                    return reject({ error: 'Could not find Book with id ' + id })
                }
                return resolve(data);
            });
        });
    },

    update: function(item) {
        
    }
};