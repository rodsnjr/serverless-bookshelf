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
    create: function(book){
        console.log('Creating book');
        return validBook(book).then(validBook => bookRepository.create(validBook));
    },

    findAll: function() {
        return bookRepository.findAll();
    },

    find: function(id) {
        return bookRepository.find(id);
    }
}