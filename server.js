const express = require('express');
const app = express();
const PORT = process.env.PORT || 1880;

// Almacén temporal de tarjetas (en memoria)
const tarjetas = {};

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// ==================== RUTAS ====================

// 1. Registro SAI (POST)
app.post('/api/sai/registro', (req, res) => {
  const { nombre, telefono, email } = req.body;
  console.log('Registro SAI recibido:', { nombre, telefono, email });
  res.json({
    mensaje: `✅ Registro exitoso, ${nombre}. Bienvenido al SAI.`,
    datos: { nombre, telefono, email }
  });
});

// 2. Generar tarjeta (POST)
app.post('/api/generar-tarjeta', (req, res) => {
  const { nombre, telefono, email } = req.body;
  const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  const enlace = `https://guia-digital-z612.onrender.com/tarjeta/${id}`;
  
  tarjetas[id] = { nombre, telefono, email, enlace };
  console.log('Tarjeta generada:', { id, nombre, telefono, email });
  
  res.json({ 
    mensaje: '✅ Tarjeta generada exitosamente.',
    id, 
    enlace, 
    tarjeta: { nombre, telefono, email } 
  });
});

// 3. Página principal (MAP)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/agente.html');
});

// 4. Tarjeta SAI (GET con ID)
app.get('/tarjeta/:id', (req, res) => {
  const id = req.params.id;
  const tarjeta = tarjetas[id];
  
  if (!tarjeta) {
    return res.status(404).send('Tarjeta no encontrada');
  }

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Tarjeta SAI</title>
      <style>
        body { font-family: Arial; max-width: 600px; margin: 40px auto; padding: 20px; background: #f5f5f5; text-align: center; }
        .card { background: white; padding: 30px; border-radius: 16px; border: 1px solid #ddd; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        h1 { color: #0b2b40; }
        .datos { font-size: 18px; margin: 20px 0; }
        .id { color: #888; font-size: 14px; margin-top: 20px; }
        .botones { display: flex; gap: 10px; justify-content: center; margin-top: 20px; flex-wrap: wrap; }
        .btn { padding: 10px 20px; border-radius: 8px; text-decoration: none; color: white; font-weight: bold; }
        .btn-compartir { background: #0b2b40; }
        .btn-llamar { background: #2a7a6a; }
        .btn-whatsapp { background: #25d366; }
        .enlace { color: #0b2b40; text-decoration: none; font-weight: bold; }
        .qr { margin: 20px auto; }
        .qr img { max-width: 150px; height: auto; border: 1px solid #ddd; border-radius: 8px; padding: 8px; background: white; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>🧾 Tarjeta SAI</h1>
        <div class="datos">
          <p><strong>👤 ${tarjeta.nombre}</strong></p>
          <p>📱 ${tarjeta.telefono}</p>
          <p>📧 ${tarjeta.email}</p>
        </div>
        <div class="qr">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(tarjeta.enlace)}" alt="QR">
        </div>
        <div class="botones">
          <a href="${tarjeta.enlace}" target="_blank" class="btn btn-compartir">🔗 Compartir</a>
          <a href="tel:${tarjeta.telefono}" class="btn btn-llamar">📞 Llamar</a>
          <a href="https://wa.me/${tarjeta.telefono}" target="_blank" class="btn btn-whatsapp">💬 WhatsApp</a>
        </div>
        <div class="id">ID: ${id}</div>
        <p><a href="/" class="enlace">← Volver al SAI</a></p>
      </div>
    </body>
    </html>
  `);
});

// ==================== SERVIDOR ====================
app.listen(PORT, () => {
  console.log(`Servidor SAI corriendo en puerto ${PORT}`);
});
