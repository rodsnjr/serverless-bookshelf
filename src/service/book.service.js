const bookRepository = require('../repository/book.repository');
const uuid4 = require('uuid/v4');
const sns = require('../providers/messenger');
const s3 = require('../providers/s3');
const stockEntryTopic = process.env.STOCK_ENTRY_TOPIC;
const s3Bucket = process.env.S3_BUCKET;

/* Private Methods */
function response(item) {
    return {
        status: (item ? 200: 404),
        body: item
    };
}

function validBook(book) {
    return new Promise((resolve, reject) => {
        console.log('Validating Book');
        if (!book.name) {
            return reject({error: 'Book must have a name'});
        }
        return resolve(book);
    });
}

function addStockEntry(book, stockAmount=1) {
    console.log('Calling Stock Entry Service on ', stockEntryTopic);
    
    return new Promise((resolve, reject) => {
        sns.publish({
            Message: JSON.stringify({
                bookId: book.id,
                amount: 1,
                message: 'stock-entry'
            }),
            MessageStructure: "json",
            TopicArn: `arn:aws:sns:us-east-1:123456789012:${stockEntryTopic}`
        }, (err, data) => {
            if (err) {
                console.log(err);
                return reject({
                    error: 'Error When adding Stock Entry'
                });
            }
            console.log(`Added Stock Entry for Book 
                        [${book.id}] 
                        to SNS Topic - ${stockEntryTopic}`);
            console.log(data);
            return resolve({
                id: book.id,
                name: book.name,
                stock: stockAmount,
                image: book.image
            });
        });
    });
}

function upload(book) {
    if (book.image) {
        return new Promise((resolve, reject) => {
            const key = `book/${uuid4()}`;
            s3.putObject({
                Bucket: s3Bucket,
                Key: key,
                Body: new Buffer(book.image)
            }, (err, data) => {
                if (err) {
                    console.log(err);
                    return reject({ error: 'Error Uploading Book Image' });
                }
                // Replace the base64 image with a key
                book.image = key;
                return resolve(book);
            });
        })
    }
    return book;
}

// Service
module.exports = {
    create: function(book){
        console.log('Creating Book');
        return validBook(book)
            .then(bookWithImage => upload(bookWithImage))
            .then(validBook => bookRepository.create(validBook))
            .then(createdBook => { 
                if (createdBook.addStock)
                    return addStockEntry(createdBook, createdBook.stockAmount);
                return createdBook;
            });
    },
    findAll: function() {
        return bookRepository.findAll();
    },
    find: function(id) {
        return bookRepository.find(id)
            .then(foundBook => response(foundBook));
    },
    delete: function(id){
        return bookRepository.delete(id);
    },
    update: function(book){
        console.log('Updating Book');
        return validBook(book)
            .then(validBook => bookRepository.update(validBook));
    }
}