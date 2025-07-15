import React from "react";

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo">
            <i className="fas fa-laptop-code"></i>
            <span>Computec</span>
          </div>
          <p>Soluciones informáticas profesionales con la mejor calidad y garantía del mercado.</p>
          <div className="social-links">
            <a href="#" className="social-link"><i className="fab fa-facebook"></i></a>
            <a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
            <a href="#" className="social-link"><i className="fab fa-whatsapp"></i></a>
            <a href="#" className="social-link"><i className="fab fa-youtube"></i></a>
          </div>
        </div>
        <div className="footer-section">
          <h3>Servicios</h3>
          <ul>
            <li><a href="/servicios">Reparación de computadoras</a></li>
            <li><a href="/servicios">Ensamblaje de PCs</a></li>
            <li><a href="/servicios">Soporte técnico</a></li>
            <li><a href="/servicios">Seguridad informática</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Productos</h3>
          <ul>
            <li><a href="/productos">Laptops Gaming</a></li>
            <li><a href="/productos">PCs Armadas</a></li>
            <li><a href="/productos">Accesorios</a></li>
            <li><a href="/productos">Componentes</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contacto</h3>
          <ul>
            <li><i className="fas fa-phone"></i> +57 300 123 4567</li>
            <li><i className="fas fa-envelope"></i> info@computec.com</li>
            <li><i className="fas fa-map-marker-alt"></i> Bogotá, Colombia</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Computec. Todos los derechos reservados.</p>
        <div className="footer-links">
          <a href="#">Política de privacidad</a>
          <a href="#">Términos y condiciones</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer; 