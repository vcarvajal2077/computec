<?php
$conn = new mysqli("localhost", "vcarvaja", "1127053339", "vcarvaja_sistema_computec");
if ($conn->connect_error) die("Error de conexión: " . $conn->connect_error);

if (isset($_GET["delete"])) {
    $id = intval($_GET["delete"]);
    $conn->query("DELETE FROM clientes WHERE id_cliente = $id");
    echo "<p style='color:green;text-align:center;'>Cliente eliminado.</p>";
}

$result = $conn->query("SELECT id_cliente, nombre, apellido, documento, telefono, email, direccion, tipo_cliente FROM clientes");
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Lista de Clientes</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f4f6f8;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 1100px;
            margin: 40px auto;
            background: #fff;
            padding: 30px 40px 20px 40px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        h2 {
            text-align: center;
            color: #333;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            padding: 10px 8px;
            text-align: left;
        }
        th {
            background: #1976d2;
            color: #fff;
        }
        tr:nth-child(even) {
            background: #f4f6f8;
        }
        tr:hover {
            background: #e3f0fc;
        }
        .acciones a {
            color: #d32f2f;
            text-decoration: none;
            font-weight: bold;
            margin-right: 8px;
        }
        .acciones a:hover {
            text-decoration: underline;
        }
        .add-link {
            display: inline-block;
            margin-bottom: 15px;
            background: #1976d2;
            color: #fff;
            padding: 8px 16px;
            border-radius: 4px;
            text-decoration: none;
            transition: background 0.2s;
        }
        .add-link:hover {
            background: #1565c0;
        }
    </style>
</head>
<body>
<div class="container">
    <h2>Lista de Clientes</h2>
    <a class="add-link" href="clientes_form.php">Agregar nuevo cliente</a>
    <table>
        <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Documento</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Dirección</th>
            <th>Tipo</th>
            <th>Acción</th>
        </tr>
        <?php while ($row = $result->fetch_assoc()): ?>
        <tr>
            <td><?= htmlspecialchars($row['nombre']) ?></td>
            <td><?= htmlspecialchars($row['apellido']) ?></td>
            <td><?= htmlspecialchars($row['documento']) ?></td>
            <td><?= htmlspecialchars($row['telefono']) ?></td>
            <td><?= htmlspecialchars($row['email']) ?></td>
            <td><?= htmlspecialchars($row['direccion']) ?></td>
            <td><?= htmlspecialchars(ucfirst($row['tipo_cliente'])) ?></td>
            <td class="acciones">
                <a href='Clientes2.php?delete=<?= $row['id_cliente'] ?>' onclick="return confirm('¿Eliminar?')">Eliminar</a>
            </td>
        </tr>
        <?php endwhile; ?>
    </table>
</div>
</body>
</html>