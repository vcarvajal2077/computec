import React from "react";

const App = () => (
  <header className="header">
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <i className="fas fa-laptop-code"></i>
          <span>Computec</span>
        </div>
        <ul className="nav-menu">
          <li className="nav-item"><a href="#" className="nav-link">Inicio</a></li>
          <li className="nav-item"><a href="#" className="nav-link">Servicios</a></li>
          <li className="nav-item"><a href="#" className="nav-link">Productos</a></li>
          <li className="nav-item"><a href="#" className="nav-link">Nosotros</a></li>
          <li className="nav-item"><a href="#" className="nav-link">Contacto</a></li>
          <li className="nav-item"><a href="#" className="nav-link">Mi Cuenta</a></li>
        </ul>
        <div className="header-session">
          <a href="#" className="btn-session">Iniciar sesión</a>
          <a href="#" className="btn-session secondary">Registrarse</a>
        </div>
      </div>
    </nav>
  </header>
);

export default App;
