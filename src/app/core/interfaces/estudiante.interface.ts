export interface Estudiante {
  id?: number;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  fotoPerfilUrl: string;
  fotoUrl: string;
  email: string;
  dni: string;
  role: string;
  genero: string;
  idEstudiante?: number;
  password?: string;
}
