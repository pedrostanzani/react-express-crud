// Load environment variables
require('dotenv').config();

// Initialize application
const express = require('express');
const app = express()

// Set up request logging
const morgan = require('morgan');
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

// Enable request body parsing
app.use(express.json())

// Import database model
const Book = require('./models/book');

// Routes
app.get('/api/books', (req, res, next) => {
  Book.find({})
    .then(books => {
      res.json(books)
    })
    .catch(error => next(error));
})

app.get('/api/books/:id', (req, res, next) => {
  Book.findById(req.params.id)
    .then(book => {
      if (book) {
        res.json(book);
      } else {
        res.status(404).end();
      }
    })
    .catch(error => next(error));
})

app.delete('/api/books/:id', (req, res, next) => {
  // Excerpt from: https://fullstackopen.com/en/part3/node_js_and_express#deleting-resources
  // There's no consensus on what status code should be returned to a DELETE
  // request if the resource does not exist. Really, the only two options are 
  // 204 and 404. For the sake of simplicity our application will respond with 
  // 204 in both cases.
  Book.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/books', (req, res, next) => {
  const body = req.body;

  const book = new Book({
    title: body.title,
    author: body.author,
    year: body.year
  })

  book.save()
    .then(savedBook => {
      res.json(savedBook);
    })
    .catch(error => next(error));
})

app.put('/api/books/:id', (req, res, next) => {
  const { title, author, year } = req.body;

  // new: true allows us to pass modified object as a parameter, and not
  // the default new object
  Book.findByIdAndUpdate(req.params.id, { title, author, year }, { 
      new: true,
      runValidators: true,
      context: 'query'
    })
    .then(updatedBook => {
      res.json(updatedBook)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
  console.log("--> Unknown endpoint handler called.");
  res.status(404).send({ error: 'unknown endpoint' });
}
app.use(unknownEndpoint);


const errorHandler = (err, req, res, next) => {
  // Excerpt from the express.js documentation:
  // If you pass anything to the next() function (except the string 'route'), 
  // Express regards the current request as being an error and will skip any 
  // remaining non-error handling routing and middleware functions.
  console.log(err);
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (err.name === 'SyntaxError') {
    return res.status(400).send({ error: 'parsing error' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }
  
  next(err);
}
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})