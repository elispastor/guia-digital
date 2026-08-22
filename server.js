const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Base de datos simple en archivo
const DB_FILE = path.join(__dirname, 'registros.json');

function leerRegistros() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function guardarRegistro(datos) {
  const registros = leerRegistros();
  registros.push(datos);
  fs.writeFileSync(DB_FILE, JSON.stringify(registros, null, 2), 'utf8');
}

function generarCodigoUnico(empresa) {
  const registros = leerRegistros();
  const numero = registros.length + 1;
  const prefijo = empresa.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6);
  return `SAI-${prefijo}-${String(numero).padStart(3, '0')}`;
}

// Formulario de registro
app.get('/registro', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'registro.html'));
});

// Generar tarjeta
app.post('/api/registro', (req, res) => {
  const { nombre, cedula, email, telefono, empresa, direccion, tipo } = req.body;

  if (!nombre || !telefono || !empresa) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  const codigo = generarCodigoUnico(empresa);
  const registro = {
    fecha: new Date().toISOString(),
    codigo,
    tipo: tipo || 'motorizados',
    nombre,
    cedula,
    email,
    telefono,
    empresa,
    direccion
  };

  guardarRegistro(registro);

  const html = generarTarjeta(registro);
  res.set('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

function generarTarjeta(datos) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes">
    <title>${datos.empresa}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', Roboto, system-ui, sans-serif; }
        body { background: linear-gradient(145deg, #0a1a2e, #1a2f44); min-height: 100vh; display: flex;
