const express = require('express');
const path = require('path');
const app = express();

//Acá hacemos la conexiones del build
app.use(express.static(path.join(__dirname, '../../frontend/build')))


