import { HttpClientModule, HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { CursoService } from "./curso.service";
import { Curso } from "../interfaces/curso.interface";
import { of } from "rxjs";

describe('Pruebas de CursoService', () => {
  let service: CursoService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule
      ],
      providers: [
        CursoService,
        { provide: HttpClient, useValue: spy }
      ]
    });

    service = TestBed.inject(CursoService);
    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
  });

  it('debería obtener una lista de cursos', () => {
    const mockCursos: Curso[] = [
      { id: 1, nombre: 'Curso 1', tipo: 'Descripción del curso 1' },
      { id: 2, nombre: 'Curso 2', tipo: 'Descripción del curso 2' }
    ];

    httpClientSpy.get.and.returnValue(of(mockCursos));

    service.getCursos().subscribe(cursos => {
      expect(cursos.length).toBeGreaterThan(0);
    });
  });

  it('debería agregar un curso', () => {
    const nuevoCurso: Curso = { id: 3, nombre: 'Nuevo Curso', tipo: 'Descripción del nuevo curso' };

    httpClientSpy.post.and.returnValue(of(nuevoCurso));

    service.agregarCurso(nuevoCurso).subscribe(curso => {
      expect(curso).toEqual(nuevoCurso);
    });
  });

  it('debería actualizar un curso', () => {
    const cursoActualizado: Curso = { id: 1, nombre: 'Curso 1 Actualizado', tipo: 'Descripción actualizada' };

    httpClientSpy.put.and.returnValue(of(cursoActualizado));

    service.actualizarCurso(cursoActualizado).subscribe(curso => {
      expect(curso).toEqual(cursoActualizado);
    });
  });

  it('debería borrar un curso', () => {
    const cursoId = 1;

    httpClientSpy.delete.and.returnValue(of({}));
    service.borrarCurso(cursoId).subscribe(response => {
      expect(response).toBeTruthy();
    });

  });
  
});
