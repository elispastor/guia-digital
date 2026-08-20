const RED = require('node-red');
const express = require('express');
const path = require('path');

const app = express();

const server = app.listen(process.env.PORT || 1880, () => {
    console.log('Servidor SAI corriendo en puerto', server.address().port);
});

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Ruta /registro (formulario)
app.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'registro.html'));
});

// Inicializar Node-RED
RED.init(server, {
    httpAdminRoot: '/editor',      // Editor de Node-RED en /editor
    httpNodeRoot: '/api',          // Endpoints de flujos en /api
    userDir: __dirname,
    flowFile: 'flows.json'
});
RED.start();
