const express = require('express');
const app = express();
const PORT = process.env.PORT || 1880;

// Servir archivos estáticos (como agente.html)
app.use(express.static(__dirname));
app.use(express.json());

// Endpoint para el registro SAI
app.post('/api/sai/registro', (req, res) => {
  const { nombre, telefono, email } = req.body;
  console.log('Registro recibido:', { nombre, telefono, email });
  res.json({
    mensaje: `Registro exitoso para ${nombre}. Teléfono: ${telefono}, Email: ${email}`
  });
});

// Ruta raíz: mostrar el agente
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/agente.html');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
