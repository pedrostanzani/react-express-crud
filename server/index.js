const express = require('express')
const app = express()

let books = [
  {
    id: 1,
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    year: 1951
  },
  {
    id: 2,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    year: 1960
  },

];

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/api/books', (req, res) => {
  res.json(books);
})

app.get('/api/books/:id', (req, res) => {
  const id = Number(req.params.id);
  const book = books.find(book => book.id === id);

  if (book) { res.json(book); } 
  else { res.status(404).end(); }
})

app.delete('/api/books/:id', (req, res) => {
  // Excerpt from: https://fullstackopen.com/en/part3/node_js_and_express#deleting-resources
  // There's no consensus on what status code should be returned to a DELETE request if the resource does not exist. 
  // Really, the only two options are 204 and 404. 
  // For the sake of simplicity our application will respond with 204 in both cases.
  const id = Number(req.params.id);
  books = books.filter(book => book.id !== id)
  res.status(204).end()
})

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})