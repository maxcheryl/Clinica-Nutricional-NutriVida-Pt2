import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AppModal from '../ui/AppModal'
import { esDominioDuoc } from '../utils/validators'

export default function HomePage() {
  const location = useLocation()

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [errorContacto, setErrorContacto] = useState<string | null>(null)
  const [modalExitoAbierto, setModalExitoAbierto] = useState(false)

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1))
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }, [location.hash])

  function manejarContacto(e: FormEvent) {
    e.preventDefault()
    setErrorContacto(null)

    const nombreTrim = nombre.trim()
    const emailTrim = email.trim()
    const mensajeTrim = mensaje.trim()

    if (!nombreTrim || !emailTrim || !mensajeTrim) {
      setErrorContacto('Nombre, correo y mensaje son obligatorios')
      return
    }

    if (nombreTrim.length < 2) {
      setErrorContacto('El nombre debe tener al menos 2 caracteres')
      return
    }

    if (!esDominioDuoc(emailTrim)) {
      setErrorContacto('El dominio del correo debe ser @duocuc.cl')
      return
    }

    setModalExitoAbierto(true)
    setNombre('')
    setEmail('')
    setTelefono('')
    setMensaje('')
  }

  return (
    <>
      <main>
        {/* HERO */}
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <img src="/assets/img/icons/logo.png" alt="NutriVida" className="hero-logo" />
              <h1 className="hero-title">
                Alimenta Tu Bienestar
                <br />
                Transforma Tu Salud
              </h1>
              <p className="hero-subtitle">
                En NutriVida te acompañamos con atención nutricional personalizada para alcanzar
                tus objetivos y construir hábitos saludables.
              </p>
              <Link to="/servicios" className="btn btn-accent btn-lg mt-3">
                Reservar servicio
              </Link>
            </div>

            <div className="row g-4 justify-content-center">
              <div className="col-md-4">
                <div className="card card-servicio">
                  <div className="card-body">
                    <div className="card-icon">
                      <i className="bi bi-heart-pulse" />
                    </div>
                    <h5 className="card-title">Primera consulta nutricional</h5>
                    <p className="card-text">
                      Primera evaluación nutricional completa para diseñar tu plan personalizado.
                    </p>
                    <div className="card-price">$35.000</div>
                    <Link to="/servicios/CN001" className="btn">
                      Ver más
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card card-servicio">
                  <div className="card-body">
                    <div className="card-icon">
                      <i className="bi bi-clipboard2-pulse" />
                    </div>
                    <h5 className="card-title">Plan de pérdida de peso</h5>
                    <p className="card-text">
                      Plan de alimentación de 1 mes con seguimiento y ajustes semanales.
                    </p>
                    <div className="card-price">$65.000</div>
                    <Link to="/servicios/PL001" className="btn">
                      Ver más
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card card-servicio">
                  <div className="card-body">
                    <div className="card-icon">
                      <i className="bi bi-activity" />
                    </div>
                    <h5 className="card-title">Antropometría completa</h5>
                    <p className="card-text">
                      Evaluación completa de composición corporal con mediciones detalladas.
                    </p>
                    <div className="card-price">$18.000</div>
                    <Link to="/servicios/EV001" className="btn">
                      Ver más
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NOSOTROS */}
        <section id="nosotros" className="py-section bg-alt">
          <div className="container">
            <h2 className="section-title">Quiénes Somos</h2>
            <p className="section-subtitle mb-5">Conoce al equipo detrás de NutriVida</p>

            <div className="row align-items-center mb-5">
              <div className="col-lg-6 mb-4 mb-lg-0 pe-lg-4">
                <h3 className="subsection-title mb-3">Nuestra Historia</h3>
                <p className="history-text">
                  Somos el equipo de NutriVida, una clínica de nutrición y dietética fundada en
                  2016 en Temuco. Contamos con 4 nutricionistas certificados cuyo propósito es
                  entregar orientación nutricional personalizada y promover hábitos saludables,
                  ayudando a cada paciente a alcanzar sus objetivos de bienestar.
                </p>
              </div>
              <div className="col-lg-6 text-center">
                <img
                  src="/assets/img/team.png"
                  alt="Nutricionista NutriVida"
                  className="img-fluid rounded-4 history-img"
                />
              </div>
            </div>

            <h3 className="subsection-title text-center mt-5 mb-2">Nuestro Equipo</h3>
            <p className="section-subtitle">Profesionales comprometidos con tu salud</p>
            <div className="row g-4 justify-content-center">
              <div className="col-md-6 col-lg-3">
                <div className="card card-equipo h-100 text-center">
                  <div className="card-body">
                    <img src="/assets/img/nut1.png" alt="Nut. Carolina Fuentes M." className="equipo-avatar" />
                    <h5 className="card-title">Carolina Fuentes M.</h5>
                    <p className="card-text text-muted">
                      Especialista en obesidad y síndrome metabólico
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="card card-equipo h-100 text-center">
                  <div className="card-body">
                    <img src="/assets/img/nut2.png" alt="Nut. Rodrigo Sepúlveda A." className="equipo-avatar" />
                    <h5 className="card-title">Rodrigo Sepúlveda A.</h5>
                    <p className="card-text text-muted">
                      Especialista en nutrición deportiva y rendimiento
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="card card-equipo h-100 text-center">
                  <div className="card-body">
                    <img src="/assets/img/nut3.png" alt="Nut. Daniela Morales C." className="equipo-avatar" />
                    <h5 className="card-title">Daniela Morales C.</h5>
                    <p className="card-text text-muted">
                      Especialista en alimentación vegetariana, vegana y trastornos alimentarios
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="card card-equipo h-100 text-center">
                  <div className="card-body">
                    <img src="/assets/img/nut4.png" alt="Nut. Felipe Araya R." className="equipo-avatar" />
                    <h5 className="card-title">Felipe Araya R.</h5>
                    <p className="card-text text-muted">Especialista en nutrición pediátrica y familiar</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACTO */}
        <section id="contacto" className="py-section">
          <div className="container">
            <h2 className="section-title">Contáctanos</h2>
            <p className="section-subtitle">Estamos aquí para ayudarte. Envíanos tu consulta.</p>

            <div className="row g-4 g-lg-5">
              <div className="col-lg-6">
                <div className="card card-contacto h-100">
                  <div className="card-body p-4 p-lg-5">
                    <h4 className="contacto-card-title mb-4">Envíanos un mensaje</h4>
                    <form id="contactForm" onSubmit={manejarContacto}>
                      <div className="mb-3">
                        <label htmlFor="nombre" className="form-label">
                          Nombre completo<span className="obligatorio">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="nombre"
                          placeholder="Tu nombre"
                          required
                          minLength={2}
                          maxLength={50}
                          value={nombre}
                          onChange={(e) => setNombre(e.target.value)}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                          Correo electrónico<span className="obligatorio">*</span>
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          placeholder="correo@correo.com"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="telefono" className="form-label">
                          Teléfono
                        </label>
                        <input
                          type="tel"
                          className="form-control"
                          id="telefono"
                          placeholder="+56 9 1234 5678"
                          value={telefono}
                          onChange={(e) => setTelefono(e.target.value)}
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="mensaje" className="form-label">
                          Mensaje<span className="obligatorio">*</span>
                        </label>
                        <textarea
                          className="form-control"
                          id="mensaje"
                          rows={4}
                          placeholder="Escribe tu mensaje aquí..."
                          required
                          minLength={10}
                          maxLength={500}
                          value={mensaje}
                          onChange={(e) => setMensaje(e.target.value)}
                        />
                      </div>
                      <button type="submit" className="btn btn-contacto w-100">
                        Enviar Mensaje
                      </button>
                    </form>
                    <div
                      id="mensajeContacto"
                      className={`alert alert-danger${errorContacto ? '' : ' d-none'} mt-3`}
                    >
                      {errorContacto}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6 d-flex flex-column">
                <div className="card card-contacto mb-4">
                  <div className="card-body p-4 p-lg-4">
                    <h4 className="contacto-card-title mb-4">Información de contacto</h4>
                    <div className="contact-item">
                      <div className="contact-icon">
                        <i className="bi bi-geo-alt" />
                      </div>
                      <div className="contact-info">
                        <strong>Dirección</strong>
                        <p>Milano 01591, Temuco</p>
                      </div>
                    </div>
                    <div className="contact-item">
                      <div className="contact-icon">
                        <i className="bi bi-telephone" />
                      </div>
                      <div className="contact-info">
                        <strong>Teléfono</strong>
                        <p>
                          <a href="tel:+56912345678">+56 9 1234 5678</a>
                        </p>
                      </div>
                    </div>
                    <div className="contact-item">
                      <div className="contact-icon">
                        <i className="bi bi-envelope" />
                      </div>
                      <div className="contact-info">
                        <strong>Correo</strong>
                        <p>
                          <a href="mailto:contacto@nutrivida.cl">contacto@nutrivida.cl</a>
                        </p>
                      </div>
                    </div>
                    <div className="contact-item mb-0">
                      <div className="contact-icon">
                        <i className="bi bi-clock" />
                      </div>
                      <div className="contact-info">
                        <strong>Horario</strong>
                        <p>Lun - Vie: 9:00 - 18:00</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card card-contacto flex-grow-1 overflow-hidden">
                  <div className="map-responsive">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m21!1m12!1m3!1d449.3127921749834!2d-72.62761412843615!3d-38.759737890809305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m6!3e3!4m0!4m3!3m2!1d-38.75973853338196!2d-72.62755234923134!5e0!3m2!1ses-419!2scl!4v1788635136026!5m2!1ses-419!2scl"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                      title="Mapa Clínica NutriVida"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="container">
            <div className="row align-items-center justify-content-center g-5">
              <div className="col-lg-3 text-center">
                <img src="/assets/img/doctora1.png" alt="Nutricionista NutriVida" className="cta-img" />
              </div>
              <div className="col-lg-5">
                <div className="cta-text-box">
                  <h2>¿Listo para empezar?</h2>
                  <p>Reserva tu primera consulta y descubre cómo podemos mejorar tu calidad de vida.</p>
                  <Link to="/servicios/CN001" className="btn btn-accent btn-lg">
                    Reserva tu primera consulta
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* MODAL ÉXITO CONTACTO */}
      <AppModal show={modalExitoAbierto} onHide={() => setModalExitoAbierto(false)}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-body text-center p-5">
              <div className="auth-icon mx-auto mb-3">
                <i className="bi bi-check-circle" />
              </div>
              <h4 className="auth-title">Mensaje enviado</h4>
              <p className="text-secondary mb-4">¡Gracias por escribirnos! Te responderemos pronto.</p>
              <button
                type="button"
                className="btn btn-success rounded-pill px-5"
                onClick={() => setModalExitoAbierto(false)}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      </AppModal>
    </>
  )
}
