// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {
    res.render('books/details',{
        title: 'Books',
        type: 'add',
        books: ''
    });
});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', async (req, res, next) => {

    try{
        let newBook = new book({
            Title: req.body.title,
            Description: '',
            Author: req.body.author,
            Price: req.body.price,
            Genre: req.body.genre
        });
        let result = await newBook.save();
        res.redirect('/books');
    }catch (e) {
        res.status(501).send('Something went wrong');
    }
});

// GET the Book Details page in order to edit an existing Book
router.get('/:id',async (req, res, next) => {
    if(!req.params.id){
        res.status(400).send('Object id is not provided');
    }
    try{
        let id = req.params.id;
        let result = await book.findById(id);

        res.render('books/details',{
            title: 'Books',
            type: 'edit',
            books: result
        });
    }catch (e) {
        res.status(404).send('no books found with given id');
    }
});

// POST - process the information passed from the details form and update the document
router.post('/:id', async (req, res, next) => {

    if(req.params.id){
       let id = req.params.id;
        try{
            let resultBook = await book.findById(id);
            if(!resultBook){
                res.status(404).send('Object not found with given id');
            }

            resultBook.Title = req.body.title;
            resultBook.Description = '';
            resultBook.Author = req.body.author;
            resultBook.Price = req.body.price;
            resultBook.Genre = req.body.genre;

            let result = await  resultBook.save();
            res.redirect('/books');
        }catch (e) {
            res.status(501).send('Something went wrong');
        }
    }else{
        res.status(400).send('Id is not provoded');
    }

});

// GET - process the delete by user id
router.get('/delete/:id', async (req, res, next) => {
    if(req.params.id){
        let id = req.params.id;
        try{
            let resultBook = await book.findById(id);
            if(!resultBook){
                res.status(404).send('Object not found with given id');
            }

            let result = await book.findByIdAndDelete(id);
            res.redirect('/books');
        }catch (e) {
            res.status(501).send('Something went wrong');
        }
    }else{
        res.status(400).send('Id is not provoded');
    }
});


module.exports = router;
