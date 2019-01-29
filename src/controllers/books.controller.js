var express = require('express');
var bookService = require('../service/book.service');
var router = express.Router();

router.post('/', (req, res) => {
    console.log('posting book', req.body);
    return bookService.create(req.body)
        .then(created => res.status(201).send(created))
        .catch(error => res.status(500).send(error));
});

router.get('/', (req, res) => {
    return bookService.findAll()
        .then(foundAll => res.status(200).send(foundAll))
        .catch(error => res.status(500).send(error));
});

router.get('/:id', (req, res) => {
    console.log('Find Book By Id', req.params.id);
    return bookService.find(req.params.id)
        .then(found => res.status(200).send(found))
        .catch(error => res.status(500).send(error));
})

module.exports = router;