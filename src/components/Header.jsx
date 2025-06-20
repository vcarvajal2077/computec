import React from "react";
import { Link } from "react-router-dom";

const Header = () => (
  <header className="header">
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <i className="fas fa-laptop-code"></i>
          <span>Computec</span>
        </div>
        <ul className="nav-menu">
          <li className="nav-item"><Link to="/" className="nav-link">Inicio</Link></li>
          <li className="nav-item"><Link to="/servicios" className="nav-link">Servicios</Link></li>
          <li className="nav-item"><Link to="/productos" className="nav-link">Productos</Link></li>
          <li className="nav-item"><Link to="/nosotros" className="nav-link">Nosotros</Link></li>
          <li className="nav-item"><Link to="/contacto" className="nav-link">Contacto</Link></li>
          <li className="nav-item"><Link to="/mi-cuenta" className="nav-link">Mi Cuenta</Link></li>
        </ul>
        <div className="header-session">
          <Link to="/login" className="btn-session">Iniciar sesión</Link>
          <Link to="/registro" className="btn-session secondary">Registrarse</Link>
        </div>
      </div>
    </nav>
  </header>
);

export default Header; 