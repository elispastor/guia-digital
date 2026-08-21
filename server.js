const RED = require('node-red');
const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/registro', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'registro.html'));
});

const server = app.listen(process.env.PORT || 1880, () => {
  console.log('Servidor SAI corriendo en puerto', server.address().port);
});

RED.init(server, {
  httpAdminRoot: '/',
  httpNodeRoot: '/api',
  userDir: __dirname,
  flowFile: 'flows.json'
});

RED.start().catch((error) => {
  console.error('Error iniciando Node-RED:', error);
  process.exit(1);
});
