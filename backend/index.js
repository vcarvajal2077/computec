const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint de prueba
app.get('/api/saludo', (req, res) => {
  res.json({ mensaje: '¡Hola desde el backend!' });
});

// Endpoint de ejemplo para obtener usuarios
app.get('/api/usuarios', (req, res) => {
  db.query('SELECT * FROM usuarios', (err, results) => {
    if (err) {
      console.error('Error en consulta:', err);
      return res.status(500).json({ error: 'Error al obtener usuarios' });
    }
    res.json(results);
  });
});

// Endpoint para probar la conexión a la base de datos
app.get('/api/test-db', (req, res) => {
  db.query('SELECT 1 as test', (err, results) => {
    if (err) {
      console.error('Error de conexión:', err);
      return res.status(500).json({ 
        status: 'error', 
        message: 'No se pudo conectar a la base de datos',
        error: err.message 
      });
    }
    res.json({ 
      status: 'success', 
      message: 'Conexión a la base de datos exitosa',
      data: results 
    });
  });
});

// Endpoint para guardar mensajes de contacto
app.post('/api/contacto', (req, res) => {
  const {
    name,
    email,
    phone,
    service,
    urgency,
    message,
    terms,
    newsletter
  } = req.body;

  // Validación básica
  if (!name || !email || !phone || !message || terms !== true) {
    return res.status(400).json({ error: 'Faltan campos obligatorios o no se aceptaron los términos.' });
  }

  const sql = `INSERT INTO contactos (nombre, email, telefono, servicio, urgencia, mensaje, acepta_terminos, newsletter)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [name, email, phone, service, urgency, message, terms, newsletter];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error al guardar contacto:', err);
      return res.status(500).json({ error: 'Error al guardar el mensaje de contacto.' });
    }
    res.json({ success: true, message: 'Mensaje enviado correctamente.' });
  });
});

// Endpoint de login
app.post('/api/login', (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son obligatorios.' });
  }

  // Buscar el usuario en la base de datos
  const sql = 'SELECT * FROM usuarios WHERE usuario = ? LIMIT 1';
  db.query(sql, [usuario], (err, results) => {
    if (err) {
      console.error('Error en consulta de login:', err);
      return res.status(500).json({ error: 'Error en el servidor.' });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
    }
    const user = results[0];
    // Comparar contraseñas (en producción usar hash)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
    }
    // Devolver datos del usuario (sin la contraseña)
    const { password: _, ...userData } = user;
    res.json({ success: true, user: userData });
  });
});

app.listen(4000, () => {
  console.log('🚀 Servidor backend ejecutándose en puerto 4000');
  console.log('📡 Endpoints disponibles:');
  console.log('   - GET /api/saludo');
  console.log('   - GET /api/usuarios');
  console.log('   - GET /api/test-db');
  console.log('   - POST /api/contacto');
  console.log('   - POST /api/login');
}); 