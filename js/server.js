// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Configura el servidor
const app = express();
const port = 5000;

// Conectar a MongoDB Atlas
const mongoURI = 'mongodb+srv://landaverde:3PJXxw3L5LV4ZSrf@cluster0.3tu1g.mongodb.net/Pre-Especialización?retryWrites=true&w=majority';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch(err => console.error('Error al conectar a MongoDB Atlas', err));




// Middleware
app.use(cors());
app.use(bodyParser.json());


// Iniciar el servidor
app.listen(port, () => console.log(`Servidor corriendo en http://localhost:${port}`));
