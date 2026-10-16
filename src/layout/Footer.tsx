/**
 * Pie de página estático: marca, enlaces de navegación y contacto.
 */
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <div className="footer-brand-box">
              <h5 className="footer-title">NutriVida</h5>
              <p className="footer-text">
                Clínica nutricional dedicada a mejorar tu calidad de vida
                mediante hábitos alimentarios saludables y atención profesional.
              </p>
            </div>
          </div>
          <div className="col-md-6 ms-auto">
            <div className="d-flex gap-5 justify-content-end">
              <div>
                <h5 className="footer-title">Enlaces</h5>
                <ul className="footer-links">
                  <li>
                    <Link to="/">Inicio</Link>
                  </li>
                  <li>
                    <Link to="/#nosotros">Quiénes somos</Link>
                  </li>
                  <li>
                    <Link to="/servicios">Servicios</Link>
                  </li>
                  <li>
                    <Link to="/#contacto">Contacto</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="footer-title">Contacto</h5>
                <ul className="footer-contact">
                  <li>
                    <i className="bi bi-geo-alt me-2" />
                    Milano 01591, Temuco
                  </li>
                  <li>
                    <i className="bi bi-telephone me-2" />
                    +56 9 1234 5678
                  </li>
                  <li>
                    <i className="bi bi-envelope me-2" />
                    contacto@nutrivida.cl
                  </li>
                  <li>
                    <i className="bi bi-clock me-2" />
                    Lun - Vie: 9:00 - 18:00
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <hr className="footer-divider" />
        <p className="footer-copyright">
          DSY1104 - 2026
          <br />
          Maxine Moreno
        </p>
      </div>
    </footer>
  );
}
