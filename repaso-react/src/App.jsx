import React, { useState, useEffect } from "react";
import './website-styles.css';
import './App.css';
import {
  FaTools, FaDesktop, FaShoppingCart, FaChevronLeft, FaChevronRight, FaLaptopCode, FaHeadset, FaShieldAlt, FaCheck, FaArrowRight, FaMedal, FaClock, FaDollarSign, FaInfoCircle, FaFacebook, FaInstagram, FaWhatsapp, FaYoutube, FaLaptop
} from 'react-icons/fa';

const sliderData = [
  {
    title: <>Soluciones Informáticas <span style={{color: '#f59e0b'}}>Profesionales</span></>,
    desc: 'Reparación, mantenimiento y venta de equipos informáticos. Servicio técnico con garantía y atención personalizada.',
    btn: { text: 'Ver Servicios', icon: 'fas fa-tools', href: '#' },
    img: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=80',
    imgAlt: 'Servicios Computec',
  },
  {
    title: <>Ensamblaje de <span style={{color: '#f59e0b'}}>PCs a Medida</span></>,
    desc: 'Arma tu equipo ideal para gaming, oficina o diseño. Componentes de calidad y asesoría experta.',
    btn: { text: 'Ver Productos', icon: 'fas fa-desktop', href: '#' },
    img: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=80',
    imgAlt: 'PCs Computec',
  },
  {
    title: <>Compra <span style={{color: '#f59e0b'}}>Accesorios y Componentes</span></>,
    desc: 'Encuentra todo lo que necesitas para tu PC: monitores, teclados, mouse, memorias y más.',
    btn: { text: 'Ver Catálogo', icon: 'fas fa-shopping-cart', href: '#' },
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=80',
    imgAlt: 'Accesorios Computec',
  },
];

const Slider = () => {
  const [current, setCurrent] = useState(0);
  const total = sliderData.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 7000);
    return () => clearInterval(interval);
  }, [total]);

  const goTo = (idx) => setCurrent(idx);
  const prev = () => setCurrent((prev) => (prev - 1 + total) % total);
  const next = () => setCurrent((prev) => (prev + 1) % total);

  const getBtnIcon = (icon) => {
    switch (icon) {
      case 'fas fa-tools':
        return <FaTools />;
      case 'fas fa-desktop':
        return <FaDesktop />;
      case 'fas fa-shopping-cart':
        return <FaShoppingCart />;
      default:
        return null;
    }
  };

  return (
    <section className="main-slider" style={{background: "linear-gradient(135deg, #2563eb 0%, #764ba2 100%)", color: "white", padding: 0}}>
      <div className="slider-container" style={{maxWidth: "1200px", margin: "0 auto", position: "relative", minHeight: "420px", display: "flex", alignItems: "center"}}>
        {sliderData.map((slide, idx) => (
          <div
            key={idx}
            className={`slider-slide${current === idx ? ' active' : ''}`}
            style={{display: current === idx ? 'flex' : 'none', alignItems: 'center', justifyContent: 'space-between', width: '100%', minHeight: '420px'}}
          >
            <div className="slider-content" style={{maxWidth: "600px"}}>
              <h1 style={{fontSize: "2.5rem", fontWeight: 800, marginBottom: "1.2rem"}}>{slide.title}</h1>
              <p style={{fontSize: "1.1rem", marginBottom: "2rem"}}>{slide.desc}</p>
              <a href={slide.btn.href} className="btn btn-primary">{getBtnIcon(slide.btn.icon)} {slide.btn.text}</a>
            </div>
            <div className="slider-image" style={{flex: 1, display: "flex", justifyContent: "flex-end"}}>
              <img src={slide.img} alt={slide.imgAlt} style={{maxWidth: "440px", borderRadius: "1.5rem", boxShadow: "0 8px 32px rgba(37,99,235,0.15)"}} />
            </div>
          </div>
        ))}
        {/* Controles del slider */}
        <button className="slider-prev" onClick={prev} style={{position: "absolute", left: "-3.5rem", top: "45%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.15)", border: "none", borderRadius: "50%", width: "2.5rem", height: "2.5rem", color: "white", fontSize: "1.3rem", cursor: "pointer"}}><FaChevronLeft /></button>
        <button className="slider-next" onClick={next} style={{position: "absolute", right: "-3.5rem", top: "45%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.15)", border: "none", borderRadius: "50%", width: "2.5rem", height: "2.5rem", color: "white", fontSize: "1.3rem", cursor: "pointer"}}><FaChevronRight /></button>
      </div>
      {/* Indicadores */}
      <div className="slider-indicators" style={{display: "flex", justifyContent: "center", gap: "0.7rem", marginTop: "-2.5rem", marginBottom: "2.5rem", position: "relative", zIndex: 2}}>
        {sliderData.map((_, idx) => (
          <span
            key={idx}
            className={`slider-dot${current === idx ? ' active' : ''}`}
            style={{width: "12px", height: "12px", borderRadius: "50%", background: "#fff", opacity: current === idx ? 0.7 : 0.4, cursor: "pointer"}}
            onClick={() => goTo(idx)}
          ></span>
        ))}
      </div>
    </section>
  );
};

const App = () => (
  <>
    <header className="header">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <FaLaptopCode />
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
    <main>
      <Slider />
      {/* Features */}
      <section className="features" style={{background: "#f8fafc", padding: "4rem 0"}}>
        <div className="container" style={{maxWidth: "1100px", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "2.5rem", justifyContent: "center"}}>
          <div className="feature-card" style={{background: "#fff", borderRadius: "1.2rem", boxShadow: "0 2px 12px rgba(37,99,235,0.07)", padding: "2rem 1.5rem", flex: "1 1 220px", minWidth: "220px", maxWidth: "320px", textAlign: "center"}}>
            <FaTools style={{fontSize: "2rem", color: "#2563eb", marginBottom: "1rem"}} />
            <h3 style={{fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.7rem"}}>Reparación y Soporte</h3>
            <p style={{color: "#64748b", fontSize: "1rem"}}>Soluciones rápidas y garantizadas para tus equipos informáticos.</p>
          </div>
          <div className="feature-card" style={{background: "#fff", borderRadius: "1.2rem", boxShadow: "0 2px 12px rgba(37,99,235,0.07)", padding: "2rem 1.5rem", flex: "1 1 220px", minWidth: "220px", maxWidth: "320px", textAlign: "center"}}>
            <FaDesktop style={{fontSize: "2rem", color: "#2563eb", marginBottom: "1rem"}} />
            <h3 style={{fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.7rem"}}>Ensamblaje de PCs</h3>
            <p style={{color: "#64748b", fontSize: "1rem"}}>Equipos a la medida para gaming, oficina o diseño profesional.</p>
          </div>
          <div className="feature-card" style={{background: "#fff", borderRadius: "1.2rem", boxShadow: "0 2px 12px rgba(37,99,235,0.07)", padding: "2rem 1.5rem", flex: "1 1 220px", minWidth: "220px", maxWidth: "320px", textAlign: "center"}}>
            <FaShoppingCart style={{fontSize: "2rem", color: "#2563eb", marginBottom: "1rem"}} />
            <h3 style={{fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.7rem"}}>Venta de Productos</h3>
            <p style={{color: "#64748b", fontSize: "1rem"}}>Accesorios, componentes y equipos de las mejores marcas.</p>
          </div>
        </div>
      </section>
      {/* Slider de Servicios */}
      <section className="main-slider" style={{background: "linear-gradient(135deg, #f8fafc 0%, #dbeafe 100%)", color: "#1e293b", padding: 0, marginBottom: "4rem"}}>
        <div className="slider-container" style={{maxWidth: "1200px", margin: "0 auto", position: "relative", minHeight: "380px", display: "flex", alignItems: "center"}}>
          <div className="slider-slide active" style={{display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", minHeight: "380px"}}>
            <div className="slider-content" style={{maxWidth: "600px"}}>
              <h2 style={{fontSize: "2rem", fontWeight: 800, marginBottom: "1.2rem"}}>Reparación de Computadoras</h2>
              <p style={{fontSize: "1.05rem", marginBottom: "2rem"}}>Diagnóstico y reparación profesional de laptops y PCs. Servicio rápido y garantizado.</p>
              <a href="#" className="btn btn-primary"><FaTools /> Más info</a>
            </div>
            <div className="slider-image" style={{flex: 1, display: "flex", justifyContent: "flex-end"}}>
              <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=80" alt="Reparación" style={{maxWidth: "340px", borderRadius: "1.5rem", boxShadow: "0 8px 32px rgba(37,99,235,0.10)"}} />
            </div>
          </div>
          {/* Puedes agregar más slides aquí si deseas el slider completo */}
          <button className="slider-prev" style={{position: "absolute", left: "-3.5rem", top: "45%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.10)", border: "none", borderRadius: "50%", width: "2.5rem", height: "2.5rem", color: "#2563eb", fontSize: "1.3rem", cursor: "pointer"}}><FaChevronLeft /></button>
          <button className="slider-next" style={{position: "absolute", right: "-3.5rem", top: "45%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.10)", border: "none", borderRadius: "50%", width: "2.5rem", height: "2.5rem", color: "#2563eb", fontSize: "1.3rem", cursor: "pointer"}}><FaChevronRight /></button>
        </div>
        <div className="slider-indicators" style={{display: "flex", justifyContent: "center", gap: "0.7rem", marginTop: "-2.5rem", marginBottom: "2.5rem", position: "relative", zIndex: 2}}>
          <span className="slider-dot active" style={{width: "12px", height: "12px", borderRadius: "50%", background: "#2563eb", opacity: 0.7, cursor: "pointer"}}></span>
          <span className="slider-dot" style={{width: "12px", height: "12px", borderRadius: "50%", background: "#2563eb", opacity: 0.4, cursor: "pointer"}}></span>
          <span className="slider-dot" style={{width: "12px", height: "12px", borderRadius: "50%", background: "#2563eb", opacity: 0.4, cursor: "pointer"}}></span>
        </div>
      </section>
      {/* Slider de Productos */}
      <section className="main-slider" style={{background: "linear-gradient(135deg, #fff 0%, #dbeafe 100%)", color: "#1e293b", padding: 0, marginBottom: "4rem"}}>
        <div className="slider-container" style={{maxWidth: "1200px", margin: "0 auto", position: "relative", minHeight: "380px", display: "flex", alignItems: "center"}}>
          <div className="slider-slide active" style={{display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", minHeight: "380px"}}>
            <div className="slider-content" style={{maxWidth: "600px"}}>
              <h2 style={{fontSize: "2rem", fontWeight: 800, marginBottom: "1.2rem"}}>Laptops y PCs</h2>
              <p style={{fontSize: "1.05rem", marginBottom: "2rem"}}>Equipos de alto rendimiento para gaming, oficina y estudio. ¡Con garantía!</p>
              <a href="#" className="btn btn-primary"><FaLaptop /> Ver más</a>
            </div>
            <div className="slider-image" style={{flex: 1, display: "flex", justifyContent: "flex-end"}}>
              <img src="https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=80" alt="Laptops" style={{maxWidth: "340px", borderRadius: "1.5rem", boxShadow: "0 8px 32px rgba(37,99,235,0.10)"}} />
            </div>
          </div>
          {/* Puedes agregar más slides aquí si deseas el slider completo */}
          <button className="slider-prev" style={{position: "absolute", left: "-3.5rem", top: "45%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.10)", border: "none", borderRadius: "50%", width: "2.5rem", height: "2.5rem", color: "#2563eb", fontSize: "1.3rem", cursor: "pointer"}}><FaChevronLeft /></button>
          <button className="slider-next" style={{position: "absolute", right: "-3.5rem", top: "45%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.10)", border: "none", borderRadius: "50%", width: "2.5rem", height: "2.5rem", color: "#2563eb", fontSize: "1.3rem", cursor: "pointer"}}><FaChevronRight /></button>
        </div>
        <div className="slider-indicators" style={{display: "flex", justifyContent: "center", gap: "0.7rem", marginTop: "-2.5rem", marginBottom: "2.5rem", position: "relative", zIndex: 2}}>
          <span className="slider-dot active" style={{width: "12px", height: "12px", borderRadius: "50%", background: "#2563eb", opacity: 0.7, cursor: "pointer"}}></span>
          <span className="slider-dot" style={{width: "12px", height: "12px", borderRadius: "50%", background: "#2563eb", opacity: 0.4, cursor: "pointer"}}></span>
          <span className="slider-dot" style={{width: "12px", height: "12px", borderRadius: "50%", background: "#2563eb", opacity: 0.4, cursor: "pointer"}}></span>
        </div>
      </section>
      {/* Sección de Servicios */}
      <section className="services">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Nuestros Servicios</h2>
            <p className="section-subtitle">Soluciones completas para todos tus problemas informáticos</p>
          </div>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <FaTools />
              </div>
              <h3>Reparación de Computadoras</h3>
              <p>Diagnóstico y reparación profesional de laptops y computadoras de escritorio. Solucionamos problemas de hardware y software.</p>
              <ul className="service-features">
                <li><FaCheck /> Diagnóstico gratuito</li>
                <li><FaCheck /> Garantía de 3 meses</li>
                <li><FaCheck /> Repuestos originales</li>
                <li><FaCheck /> Servicio a domicilio</li>
              </ul>
              <div className="service-price">
                <span className="price">Desde $50.000</span>
                <span className="price-note">*Precio base</span>
              </div>
            </div>
            <div className="service-card featured">
              <div className="service-badge">Más Popular</div>
              <div className="service-icon">
                <FaDesktop />
              </div>
              <h3>Ensamblaje de PCs</h3>
              <p>Diseñamos y ensamblamos computadoras personalizadas según tus necesidades. Gaming, trabajo, diseño gráfico y más.</p>
              <ul className="service-features">
                <li><FaCheck /> Configuración personalizada</li>
                <li><FaCheck /> Componentes de calidad</li>
                <li><FaCheck /> Instalación de software</li>
                <li><FaCheck /> Garantía de 1 año</li>
              </ul>
              <div className="service-price">
                <span className="price">Desde $800.000</span>
                <span className="price-note">*Configuración básica</span>
              </div>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <FaHeadset />
              </div>
              <h3>Soporte Técnico</h3>
              <p>Soporte técnico remoto y presencial para empresas y hogares. Mantenimiento preventivo y soluciones rápidas.</p>
              <ul className="service-features">
                <li><FaCheck /> Soporte remoto 24/7</li>
                <li><FaCheck /> Mantenimiento preventivo</li>
                <li><FaCheck /> Instalación de programas</li>
                <li><FaCheck /> Recuperación de datos</li>
              </ul>
              <div className="service-price">
                <span className="price">Desde $30.000</span>
                <span className="price-note">*Por visita</span>
              </div>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <FaShieldAlt />
              </div>
              <h3>Seguridad Informática</h3>
              <p>Protección completa de tus equipos con antivirus, firewall y backup automático. Mantén tus datos seguros.</p>
              <ul className="service-features">
                <li><FaCheck /> Instalación de antivirus</li>
                <li><FaCheck /> Configuración de firewall</li>
                <li><FaCheck /> Backup automático</li>
                <li><FaCheck /> Monitoreo de seguridad</li>
              </ul>
              <div className="service-price">
                <span className="price">Desde $80.000</span>
                <span className="price-note">*Anual</span>
              </div>
            </div>
          </div>
          <div className="services-cta">
            <a href="#" className="btn btn-primary">
              <FaArrowRight />
              Ver Todos los Servicios
            </a>
          </div>
        </div>
      </section>
      {/* Productos Destacados */}
      <section className="products">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Productos Destacados</h2>
            <p className="section-subtitle">Equipos y accesorios de las mejores marcas</p>
          </div>
          <div className="products-grid">
            <div className="product-card">
              <div className="product-image">
                <img src="https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Laptop Gaming" />
                <div className="product-badge">Nuevo</div>
              </div>
              <div className="product-info">
                <h3>Laptop Gaming ASUS ROG</h3>
                <p>Intel i7, 16GB RAM, GTX 1650, 512GB SSD</p>
                <div className="product-price">
                  <span className="current-price">$2.500.000</span>
                  <span className="original-price">$2.800.000</span>
                </div>
                <button className="btn btn-product">Ver Detalles</button>
              </div>
            </div>
            <div className="product-card">
              <div className="product-image">
                <img src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="PC Gaming" />
                <div className="product-badge">Oferta</div>
              </div>
              <div className="product-info">
                <h3>PC Gaming Armada</h3>
                <p>Ryzen 5, 8GB RAM, GTX 1660, 1TB HDD</p>
                <div className="product-price">
                  <span className="current-price">$1.800.000</span>
                  <span className="original-price">$2.200.000</span>
                </div>
                <button className="btn btn-product">Ver Detalles</button>
              </div>
            </div>
            <div className="product-card">
              <div className="product-image">
                <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Auriculares" />
              </div>
              <div className="product-info">
                <h3>Auriculares Gaming</h3>
                <p>Logitech G Pro X, 7.1 Surround, Micrófono</p>
                <div className="product-price">
                  <span className="current-price">$350.000</span>
                </div>
                <button className="btn btn-product">Ver Detalles</button>
              </div>
            </div>
            <div className="product-card">
              <div className="product-image">
                <img src="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Monitor" />
              </div>
              <div className="product-info">
                <h3>Monitor Gaming 24"</h3>
                <p>144Hz, 1ms, Full HD, FreeSync</p>
                <div className="product-price">
                  <span className="current-price">$450.000</span>
                </div>
                <button className="btn btn-product">Ver Detalles</button>
              </div>
            </div>
          </div>
          <div className="products-cta">
            <a href="#" className="btn btn-primary">
              <FaShoppingCart />
              Ver Catálogo Completo
            </a>
          </div>
        </div>
      </section>
      {/* Sección Nosotros */}
      <section className="about">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>¿Por qué elegir Computec?</h2>
              <p>Con más de 5 años de experiencia en el sector informático, nos hemos convertido en la opción preferida de cientos de clientes satisfechos.</p>
              <div className="about-features">
                <div className="feature">
                  <FaMedal />
                  <div>
                    <h3>Experiencia Garantizada</h3>
                    <p>5+ años resolviendo problemas informáticos</p>
                  </div>
                </div>
                <div className="feature">
                  <FaClock />
                  <div>
                    <h3>Servicio Rápido</h3>
                    <p>Reparaciones en 24-48 horas</p>
                  </div>
                </div>
                <div className="feature">
                  <FaShieldAlt />
                  <div>
                    <h3>Garantía Total</h3>
                    <p>Todos nuestros servicios incluyen garantía</p>
                  </div>
                </div>
                <div className="feature">
                  <FaDollarSign />
                  <div>
                    <h3>Precios Justos</h3>
                    <p>Los mejores precios sin comprometer calidad</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="about-stats">
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Clientes Satisfechos</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">1000+</div>
                <div className="stat-label">Equipos Reparados</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">PCs Ensambladas</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">5</div>
                <div className="stat-label">Años de Experiencia</div>
              </div>
            </div>
          </div>
          <div className="about-cta">
            <a href="#" className="btn btn-primary">
              <FaInfoCircle />
              Conoce Más Sobre Nosotros
            </a>
          </div>
        </div>
      </section>
      {/* Testimonios */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Lo que dicen nuestros clientes</h2>
            <p className="section-subtitle">Testimonios reales de clientes satisfechos</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Excelente servicio. Repararon mi laptop en menos de 24 horas y quedó como nueva. Muy recomendados."</p>
              </div>
              <div className="testimonial-author">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Carlos Rodríguez" />
                <div>
                  <h4>Carlos Rodríguez</h4>
                  <span>Empresario</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Me ensamblaron una PC gaming increíble. El precio fue muy bueno y la calidad excelente. Volveré seguro."</p>
              </div>
              <div className="testimonial-author">
                <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="María González" />
                <div>
                  <h4>María González</h4>
                  <span>Diseñadora Gráfica</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"El soporte técnico es fantástico. Siempre están disponibles cuando los necesito. Muy profesionales."</p>
              </div>
              <div className="testimonial-author">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Juan Pérez" />
                <div>
                  <h4>Juan Pérez</h4>
                  <span>Contador</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <FaLaptopCode />
                <span>Computec</span>
              </div>
              <p>Soluciones informáticas profesionales con la mejor calidad y garantía del mercado.</p>
              <div className="social-links">
                <a href="#" className="social-link"><FaFacebook /></a>
                <a href="#" className="social-link"><FaInstagram /></a>
                <a href="#" className="social-link"><FaWhatsapp /></a>
                <a href="#" className="social-link"><FaYoutube /></a>
              </div>
            </div>
            <div className="footer-section">
              <h3>Servicios</h3>
              <ul>
                <li><a href="#">Reparación de computadoras</a></li>
                <li><a href="#">Ensamblaje de PCs</a></li>
                <li><a href="#">Soporte técnico</a></li>
                <li><a href="#">Seguridad informática</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Productos</h3>
              <ul>
                <li><a href="#">Laptops Gaming</a></li>
                <li><a href="#">PCs Armadas</a></li>
                <li><a href="#">Accesorios</a></li>
                <li><a href="#">Componentes</a></li>
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
      {/* Botón de WhatsApp */}
      <a href="https://wa.me/573001234567" className="whatsapp-button" target="_blank" rel="noopener noreferrer">
        <FaWhatsapp size={32} />
      </a>
    </main>
  </>
);

export default App;
