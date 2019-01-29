var express = require('express');
var bookService = require('../service/book.service');
var router = express.Router();

router.post('/', (req, res) => {
    console.log('Posting book', req.body);
    return bookService.create(req.body)
        .then(created => res.status(201).send(created))
        .catch(error => res.status(500).send(error));
});

router.get('/', (req, res) => {
    console.log('List all Books')
    return bookService.findAll()
        .then(foundAll => res.status(200).send(foundAll))
        .catch(error => res.status(500).send(error));
});

router.get('/:id', (req, res) => {
    console.log('Find Book By Id', req.params.id);
    return bookService.find(req.params.id)
        .then(found => res.status(found.status).send(found.body))
        .catch(error => res.status(500).send(error));
});

router.delete('/:id', (req, res) => {
    console.log('Delete by Id', req.params.id);
    return bookService.delete(req.params.id)
        .then(() => res.status(200).send())
        .catch(error => res.status(500).send(error));
});

router.put('/', (req, res) => {
    console.log('Updating Item');
    return bookService.update(req.body)
        .then(updated => res.status(200).send(updated))
        .catch(error => res.status(500).send(error));
});

module.exports = router;