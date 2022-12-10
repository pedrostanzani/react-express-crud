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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})