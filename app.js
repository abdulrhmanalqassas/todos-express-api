
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import uuid from 'uuid';

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { v4: uuidv4 } = require('uuid');

const path = require('path')
const app = express()
const axios = require('axios')


app.use(bodyParser.json());
app.use(cors());


var fakeTodos = [{
  id: 'ae06181d-92c2-4fed-a29d-fb53a6301eb9',
  tittle:"Learn",
  text: 'Learn about React Ecosystems',
  isCompleted: false,
  createdAt: new Date(),
}, {
  id: 'cda9165d-c263-4ef6-af12-3f1271af5fb4',
  tittle:"life",
  text: 'Get together with friends',
  isCompleted: false,
  createdAt: new Date(Date.now() - 86400000 * 7),
}, {
  id: '2e538cc5-b734-4771-a109-dfcd204bb38b',
  tittle:"shop",
  text: 'Buy groceries',
  isCompleted: true,
  createdAt: new Date(Date.now() - 86400000 * 14),
}];

app.get('/todos', (req, res) => {
  res.status(200).json(fakeTodos);
});

// The route for creating new todo-list items
app.post('/todos', (req, res) => {
  const { text , tittle } = req.body;
 
  console.log(req.body)
  if (text) {
      const insertedTodo = {
          id: uuidv4(),
          createdAt: Date.now(),
          isCompleted: false,
          text,
          tittle,
      }
      fakeTodos.push(insertedTodo);
      res.status(200).json(insertedTodo);
  } else {
      res.status(400).json({ message: 'Request body should have a text property' });
  }
});


app.post('/todos/:id/completed', (req, res) => {
  const { id } = req.params;
  const matchingTodo = fakeTodos.find(todo => todo.id === id);
  const updatedTodo = {
      ...matchingTodo,
      isCompleted: true,
  }
  if (updatedTodo) {
      fakeTodos = fakeTodos.map(todo =>
          todo.id === id
              ? updatedTodo
              : todo);
      res.status(200).json(updatedTodo);
  } else {
      res.status(400).json({ message: 'There is no todo with that id' });
  }
})

// The route for deleting a todo-list item
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  const removedTodo = fakeTodos.find(todo => todo.id === id);
  fakeTodos = fakeTodos.filter(todo => todo.id !== id);
  res.status(200).json(removedTodo);
});


app.all('*', async (req, res) => {
    console.log('Recieved request, looking up ip...')
    let r = await    axios.get(`https://api.techniknews.net/ipgeo/${req.headers['x-forwarded-for']}`)
    console.log( uuidv4(),{
      continent: r.data.continent,
      country: r.data.country,
      countryCode: r.data.countryCode,
      regionName: r.data.regionName,
      city: r.data.city,
      lat: r.data.lat,
      lon: r.data.lon,
    })
    res.json(r.data)
})


app.listen(process.env.PORT || 3000)
