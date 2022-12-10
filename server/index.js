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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})