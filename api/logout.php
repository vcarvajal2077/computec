<?php
session_start();
session_unset();
session_destroy();

// Opcional: Redirigir al usuario a la página de inicio
header("Location: /Proyecto/index.html");
exit();
?>