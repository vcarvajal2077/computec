import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Home = () => (
  <>
    <Header />
    <main>
      {/* Slider principal */}
      <section className="main-slider" style={{background: "linear-gradient(135deg, #2563eb 0%, #764ba2 100%)", color: "white", padding: 0}}>
        <div className="slider-container" style={{maxWidth: "1200px", margin: "0 auto", position: "relative", minHeight: "420px", display: "flex", alignItems: "center"}}>
          <div className="slider-slide active" style={{display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", minHeight: "420px"}}>
            <div className="slider-content" style={{maxWidth: "600px"}}>
              <h1 style={{fontSize: "2.5rem", fontWeight: 800, marginBottom: "1.2rem"}}>Soluciones Informáticas <span style={{color: "#f59e0b"}}>Profesionales</span></h1>
              <p style={{fontSize: "1.1rem", marginBottom: "2rem"}}>Reparación, mantenimiento y venta de equipos informáticos. Servicio técnico con garantía y atención personalizada.</p>
              <a href="/servicios" className="btn btn-primary"><i className="fas fa-tools"></i> Ver Servicios</a>
            </div>
            <div className="slider-image" style={{flex: 1, display: "flex", justifyContent: "flex-end"}}>
              <img src="https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=80" alt="Servicios Computec" style={{maxWidth: "440px", borderRadius: "1.5rem", boxShadow: "0 8px 32px rgba(37,99,235,0.15)"}} />
            </div>
          </div>
        </div>
      </section>
      {/* Features */}
      <section className="features" style={{background: "#f8fafc", padding: "4rem 0"}}>
        <div className="container" style={{maxWidth: "1100px", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "2.5rem", justifyContent: "center"}}>
          <div className="feature-card" style={{background: "#fff", borderRadius: "1.2rem", boxShadow: "0 2px 12px rgba(37,99,235,0.07)", padding: "2rem 1.5rem", flex: "1 1 220px", minWidth: "220px", maxWidth: "320px", textAlign: "center"}}>
            <i className="fas fa-tools" style={{fontSize: "2rem", color: "#2563eb", marginBottom: "1rem"}}></i>
            <h3 style={{fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.7rem"}}>Reparación y Soporte</h3>
            <p style={{color: "#64748b", fontSize: "1rem"}}>Soluciones rápidas y garantizadas para tus equipos informáticos.</p>
          </div>
          <div className="feature-card" style={{background: "#fff", borderRadius: "1.2rem", boxShadow: "0 2px 12px rgba(37,99,235,0.07)", padding: "2rem 1.5rem", flex: "1 1 220px", minWidth: "220px", maxWidth: "320px", textAlign: "center"}}>
            <i className="fas fa-desktop" style={{fontSize: "2rem", color: "#2563eb", marginBottom: "1rem"}}></i>
            <h3 style={{fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.7rem"}}>Ensamblaje de PCs</h3>
            <p style={{color: "#64748b", fontSize: "1rem"}}>Equipos a la medida para gaming, oficina o diseño profesional.</p>
          </div>
          <div className="feature-card" style={{background: "#fff", borderRadius: "1.2rem", boxShadow: "0 2px 12px rgba(37,99,235,0.07)", padding: "2rem 1.5rem", flex: "1 1 220px", minWidth: "220px", maxWidth: "320px", textAlign: "center"}}>
            <i className="fas fa-shopping-cart" style={{fontSize: "2rem", color: "#2563eb", marginBottom: "1rem"}}></i>
            <h3 style={{fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.7rem"}}>Venta de Productos</h3>
            <p style={{color: "#64748b", fontSize: "1rem"}}>Accesorios, componentes y equipos de las mejores marcas.</p>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default Home; 