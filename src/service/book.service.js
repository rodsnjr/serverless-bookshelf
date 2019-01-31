const bookRepository = require('../repository/book.repository');
const sns = require('../messenger');

const validBook = function(book) {
    return new Promise((resolve, reject) => {
        console.log('Validating Book');
        if (!book.name) {
            return reject({error: 'Book must have a name'});
        }
        return resolve(book);
    });
}

const addStockEntry = function(book) {
    console.log('Calling Stock Entry Service');
    const stockEntryTopic = process.env.STOCK_ENTRY_TOPIC;
    
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
                stock: 1
            });
        });
    })
}

module.exports = {
    response: function(item) {
        return {
            status: (item ? 200: 404),
            body: item
        };
    },
    create: function(book){
        console.log('Creating Book');
        return validBook(book)
            .then(validBook => bookRepository.create(validBook))
            .then(createdBook => addStockEntry(createdBook));
    },
    findAll: function() {
        return bookRepository.findAll();
    },
    find: function(id) {
        return bookRepository.find(id)
            .then(foundBook => this.response(foundBook));
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