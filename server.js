const RED = require('node-red');
const express = require('express');
const app = express();
const server = app.listen(process.env.PORT || 1880, () => {
    console.log('Servidor SAI corriendo en puerto', server.address().port);
});
RED.init(server, {
    httpAdminRoot: '/',
    httpNodeRoot: '/api',
    userDir: __dirname,
    flowFile: 'flows.json'
});
RED.start();
