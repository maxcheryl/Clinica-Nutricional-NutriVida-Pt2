import type { Servicio } from '../types'

export const servicios: Servicio[] = [
  // CONSULTAS
  {
    codigo: 'CN001',
    tipo: 'Consulta',
    nombre: 'Primera consulta nutricional',
    duracion: '50 min',
    modalidad: 'Presencial',
    precio: 35000,
    cuposIniciales: 5,
    descripcion:
      'Evaluación inicial: anamnesis, antropometría completa y diseño del primer plan alimenticio.',
  },
  {
    codigo: 'CN002',
    tipo: 'Consulta',
    nombre: 'Control nutricional (seguimiento)',
    duracion: '30 min',
    modalidad: 'Presencial',
    precio: 25000,
    cuposIniciales: 5,
    descripcion: 'Seguimiento mensual: medición de indicadores y ajuste del plan vigente.',
  },
  {
    codigo: 'CN003',
    tipo: 'Consulta',
    nombre: 'Control nutricional quincenal',
    duracion: '30 min',
    modalidad: 'Presencial',
    precio: 22000,
    cuposIniciales: 5,
    descripcion: 'Seguimiento intensivo cada 15 días. Recomendado en los primeros 2 meses.',
  },
  {
    codigo: 'CN004',
    tipo: 'Consulta',
    nombre: 'Teleconsulta nutricional',
    duracion: '30 min',
    modalidad: 'Online (video)',
    precio: 20000,
    cuposIniciales: 5,
    descripcion:
      'Consulta de seguimiento vía videollamada. Requiere contar con consulta presencial previa.',
  },
  {
    codigo: 'CN005',
    tipo: 'Consulta',
    nombre: 'Consulta de urgencia / reagendada',
    duracion: '30 min',
    modalidad: 'Presencial',
    precio: 28000,
    cuposIniciales: 5,
    descripcion: 'Para pacientes que requieren atención fuera de su control habitual.',
  },
  // PLANES ESPECIALIZADOS
  {
    codigo: 'PL001',
    tipo: 'Plan especializado',
    nombre: 'Plan pérdida de peso (1 mes)',
    duracion: '—',
    modalidad: 'Presencial',
    precio: 65000,
    cuposIniciales: 3,
    descripcion:
      'Incluye primera consulta + 1 control quincenal + plan alimenticio personalizado + seguimiento por WhatsApp.',
  },
  {
    codigo: 'PL002',
    tipo: 'Plan especializado',
    nombre: 'Plan pérdida de peso (3 meses)',
    duracion: '—',
    modalidad: 'Presencial',
    precio: 170000,
    cuposIniciales: 3,
    descripcion:
      'Incluye primera consulta + 5 controles + 3 planes mensuales + seguimiento continuo.',
  },
  {
    codigo: 'PL003',
    tipo: 'Plan especializado',
    nombre: 'Plan nutrición deportiva (1 mes)',
    duracion: '—',
    modalidad: 'Presencial',
    precio: 70000,
    cuposIniciales: 3,
    descripcion:
      'Para deportistas y personas con actividad física frecuente. Cálculo de requerimientos energéticos y proteicos.',
  },
  {
    codigo: 'PL004',
    tipo: 'Plan especializado',
    nombre: 'Plan control diabetes / hipertensión',
    duracion: '—',
    modalidad: 'Presencial',
    precio: 75000,
    cuposIniciales: 3,
    descripcion:
      'Plan adaptado para patologías metabólicas. Coordinación con médico tratante si aplica.',
  },
  {
    codigo: 'PL005',
    tipo: 'Plan especializado',
    nombre: 'Plan alimentación vegetariana/vegana',
    duracion: '—',
    modalidad: 'Presencial',
    precio: 68000,
    cuposIniciales: 3,
    descripcion:
      'Diseñado para garantizar aporte adecuado de proteínas, hierro, vitamina B12 y calcio sin productos animales.',
  },
  {
    codigo: 'PL006',
    tipo: 'Plan especializado',
    nombre: 'Plan alimentación infantil (2-12 años)',
    duracion: '—',
    modalidad: 'Presencial',
    precio: 65000,
    cuposIniciales: 3,
    descripcion:
      'Evaluación nutricional pediátrica y diseño de plan adaptado a la etapa de desarrollo del niño.',
  },
  // EVALUACIONES
  {
    codigo: 'EV001',
    tipo: 'Evaluación',
    nombre: 'Antropometría completa',
    duracion: '20 min',
    modalidad: 'Presencial',
    precio: 18000,
    cuposIniciales: 8,
    descripcion:
      'Peso, talla, IMC, circunferencia de cintura, cadera, brazo y % de grasa corporal con bioimpedanciometría.',
  },
  {
    codigo: 'EV002',
    tipo: 'Evaluación',
    nombre: 'Bioimpedanciometría',
    duracion: '15 min',
    modalidad: 'Presencial',
    precio: 12000,
    cuposIniciales: 8,
    descripcion:
      'Medición de composición corporal: masa grasa, masa muscular, agua corporal y edad metabólica.',
  },
  {
    codigo: 'EV003',
    tipo: 'Evaluación',
    nombre: 'Encuesta de hábitos alimentarios',
    duracion: '20 min',
    modalidad: 'Presencial',
    precio: 10000,
    cuposIniciales: 8,
    descripcion:
      'Análisis del patrón alimentario actual. Identificación de déficit y excesos nutricionales.',
  },
  {
    codigo: 'EV004',
    tipo: 'Evaluación',
    nombre: 'Análisis de exámenes de laboratorio',
    duracion: '20 min',
    modalidad: 'Presencial',
    precio: 15000,
    cuposIniciales: 8,
    descripcion:
      'Interpretación de hemograma, perfil bioquímico y lipídico en contexto nutricional.',
  },
  // TALLERES GRUPALES
  {
    codigo: 'TG001',
    tipo: 'Taller grupal',
    nombre: 'Taller de alimentación saludable',
    duracion: '90 min',
    modalidad: 'Presencial (grupo)',
    precio: 15000,
    cuposIniciales: 10,
    descripcion:
      'Máx. 10 personas. Conceptos básicos de alimentación equilibrada y lectura de etiquetas.',
  },
  {
    codigo: 'TG002',
    tipo: 'Taller grupal',
    nombre: 'Taller de cocina nutritiva',
    duracion: '120 min',
    modalidad: 'Presencial (grupo)',
    precio: 20000,
    cuposIniciales: 8,
    descripcion: 'Preparación de recetas saludables. Incluye degustación. Máx. 8 personas.',
  },
  {
    codigo: 'TG003',
    tipo: 'Taller grupal',
    nombre: 'Taller nutrición para deportistas',
    duracion: '90 min',
    modalidad: 'Presencial (grupo)',
    precio: 18000,
    cuposIniciales: 12,
    descripcion:
      'Hidratación, nutrición pre y post entrenamiento, suplementación básica. Máx. 12 personas.',
  },
]

export function getServicioPorCodigo(codigo: string): Servicio | undefined {
  return servicios.find((s) => s.codigo === codigo)
}

export function getBadgeClass(tipo: string): string {
  const classes: Record<string, string> = {
    Consulta: 'bg-success text-white',
    'Plan especializado': 'bg-primary text-white',
    Evaluación: 'bg-warning text-dark',
    'Taller grupal': 'bg-info text-dark',
  }
  return classes[tipo] || 'bg-secondary text-white'
}

export function getTipoIcon(tipo: string): string {
  const icons: Record<string, string> = {
    Consulta: 'bi-person-heart',
    'Plan especializado': 'bi-journal-medical',
    Evaluación: 'bi-clipboard2-pulse',
    'Taller grupal': 'bi-people',
  }
  return icons[tipo] || 'bi-tag'
}
