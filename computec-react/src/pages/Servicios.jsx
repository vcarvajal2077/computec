import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Servicios = () => (
  <>
    <Header />
    <main>
      <section className="main-slider" style={{background: "linear-gradient(135deg, #2563eb 0%, #764ba2 100%)", color: "white", padding: 0}}>
        <div className="slider-container" style={{maxWidth: "1200px", margin: "0 auto", position: "relative", minHeight: "420px", display: "flex", alignItems: "center"}}>
          <div className="slider-slide active" style={{display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", minHeight: "420px"}}>
            <div className="slider-content" style={{maxWidth: "600px"}}>
              <h1 style={{fontSize: "2.5rem", fontWeight: 800, marginBottom: "1.2rem"}}>Reparación y <span style={{color: "#f59e0b"}}>Soporte Técnico</span></h1>
              <p style={{fontSize: "1.1rem", marginBottom: "2rem"}}>Soluciones rápidas y garantizadas para tus equipos informáticos. Atención personalizada.</p>
              <a href="#servicios-detallados" className="btn btn-primary"><i className="fas fa-tools"></i> Ver Servicios</a>
            </div>
            <div className="slider-image" style={{flex: 1, display: "flex", justifyContent: "flex-end"}}>
              <img src="https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=80" alt="Servicios Computec" style={{maxWidth: "440px", borderRadius: "1.5rem", boxShadow: "0 8px 32px rgba(37,99,235,0.15)"}} />
            </div>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default Servicios; 