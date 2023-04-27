
import { Curso} from 'src/app/core/interfaces/curso.interface';

const cursos: Curso[] = [
  { id: 1, nombre: 'JavaScript',tipo: 'basico'},
  { id: 2, nombre: 'Python',tipo: 'intermedio'},
  { id: 3, nombre: 'Java', tipo: 'avanzado'},
  { id: 4, nombre: 'C++',tipo:'avanzado'},
  { id: 5, nombre: 'Ruby', tipo: 'basico'},
  { id: 6, nombre: 'Swift',tipo:  'basico'},
  { id: 7, nombre: 'Go', tipo: 'basico'},
  { id: 8, nombre: 'PHP', tipo: 'intermedio'},
  { id: 9, nombre: 'TypeScript',tipo: 'avanzado'},
  { id: 10, nombre: 'Rust', tipo: 'basico'}
];
export function obtenerCursos(): Promise<Curso[]> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(cursos);
    }, 2000);
  });
}
