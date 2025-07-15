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

// Ruta de login con async/await y validación de usuario y tipo
app.post('/api/login', async (req, res) => {
  const { correo, password } = req.body;
  if (!correo || !password) {
    return res.status(400).json({ success: false, message: 'Correo y contraseña son obligatorios.' });
  }

  try {
    // Consulta el usuario y su tipo
    const sql = `SELECT u.id, u.correo, u.contraseña, t.tipo
                 FROM usuarios u
                 JOIN tipo_usuario t ON u.tipo_usuario_id = t.id
                 WHERE u.correo = ? LIMIT 1`;
    const [rows] = await db.promise().query(sql, [correo]);

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos.' });
    }
    const user = rows[0];

    // Comparar contraseñas (en producción usar hash)
    if (user.contraseña !== password) {
      return res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos.' });
    }

    // Devolver datos del usuario (sin la contraseña)
    return res.json({
      success: true,
      user: {
        id: user.id,
        correo: user.correo,
        tipo: user.tipo
      }
    });
  } catch (err) {
    console.error('Error en login:', err);
    return res.status(500).json({ success: false, message: 'Error en el servidor.' });
  }
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