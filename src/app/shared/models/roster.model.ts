export interface Roster {
  equipo: string;
  equipos_famosos: string[];
  liga: string;
  reglas_especiales: any[];
  jugadores: Jugador[];
  segundas_oportunidades: Segundasoportunidades;
  apotecario: boolean;
  metadata: Metadata;
}

interface Metadata {
  pagina_pdf: number;
  pagina_txt: number;
  pagina_impresa: number;
  validado: boolean;
  faqs_revisadas: boolean;
}

interface Segundasoportunidades {
  cantidad: number;
  coste_cada_una: number;
}

export interface Jugador {
  nombre: string;
  cantidad: number;
  posicion: string;
  raza: string;
  coste: number;
  mv: number;
  fu: number;
  ag: string;
  ps: string;
  ar: string;
  habilidades_y_rasgos: string[];
  habilidades_primarias: string[];
  habilidades_secundarias: string[];
}