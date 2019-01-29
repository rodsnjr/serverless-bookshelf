const bookRepository = require('../repository/book.repository');

const validBook = function(book) {
    return new Promise((resolve, reject) => {
        console.log('Validating Book');
        if (!book.name) {
            return reject({error: 'Book must have a name'});
        }
        return resolve(book);
    });
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
            .then(validBook => bookRepository.create(validBook));
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