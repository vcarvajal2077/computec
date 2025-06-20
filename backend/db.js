const mysql = require('mysql2');

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',           // Host de tu servidor MySQL
  user: 'root',                // Tu usuario de MySQL (normalmente 'root')
  password: '',                // Tu contraseña de MySQL (déjala vacía si no tienes contraseña)
  database: 'computec_sistema'         // El nombre de tu base de datos
});

// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar con la base de datos:', err);
    console.log('💡 Asegúrate de que:');
    console.log('   1. MySQL esté ejecutándose');
    console.log('   2. La base de datos "computec" exista');
    console.log('   3. El usuario y contraseña sean correctos');
    return;
  }
  console.log('✅ ¡Conectado exitosamente a la base de datos MySQL!');
  console.log('📊 Base de datos: computec_sistema');
});

// Manejar errores de conexión
connection.on('error', (err) => {
  console.error('❌ Error en la conexión de la base de datos:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('🔄 Reconectando a la base de datos...');
  } else {
    // Comentado temporalmente para evitar que el servidor se detenga
    // throw err;
    console.error('⚠️ Error de base de datos (servidor continúa ejecutándose):', err.message);
  }
});

module.exports = connection; 