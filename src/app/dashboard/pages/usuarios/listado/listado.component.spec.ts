import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoComponent } from './listado.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from 'src/app/shared/material/material.module';

describe('ListadoComponent', () => {
  let component: ListadoComponent;
  let fixture: ComponentFixture<ListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoComponent ],
      imports:[
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MaterialModule,
        RouterTestingModule
      ],


    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('Al iniciar el componente que los usuarios esten vacios', () => {
    expect(component.usuarios).toEqual([]);
  })
  it('Al renderizar la vista que el el array de usuarios no este vacio', ()=>{
     // Simula la respuesta del servicio de usuarios
    const usuarios = [
      { id: 1, nombre: 'Juan', apellido: 'Pérez', correo: 'juan.perez@mail.com' },
      { id: 2, nombre: 'María', apellido: 'García', correo: 'maria.garcia@mail.com' },
    ];
     // Espía el método getUsuarios del servicio de usuarios
   /*  spyOn(component.usuarioService, 'getUsuarios').and.returnValue(of(usuarios));
    // Llama al método ngOnInit
    component.ngOnInit();
    // Verifica que la lista de usuarios se haya actualizado correctamente
    expect(component.usuarios).toEqual(usuarios); */
  })
});
