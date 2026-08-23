const express = require('express');
const app = express();
const PORT = process.env.PORT || 1880;

app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/sai/registro', (req, res) => {
  const { nombre, telefono, email } = req.body;
  console.log('Registro SAI recibido:', { nombre, telefono, email });
  res.json({
    mensaje: `✅ Registro exitoso, ${nombre}. Bienvenido al SAI.`,
    datos: { nombre, telefono, email }
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/agente.html');
});

app.listen(PORT, () => {
  console.log(`Servidor SAI corriendo en puerto ${PORT}`);
});
