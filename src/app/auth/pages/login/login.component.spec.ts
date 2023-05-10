import { AuthService } from 'src/app/core/services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { TestBed } from "@angular/core/testing";
import { LoginComponent } from "./login.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MaterialModule } from "src/app/shared/material/material.module";
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthServiceMock } from '../../mocks/auth-service.mock';

describe('Pruebas de LoginComponente', ()=>{
  let component: LoginComponent;
  beforeEach(async ()=>{
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports:[
        HttpClientTestingModule,
        RouterTestingModule,
        MaterialModule,
        ReactiveFormsModule,
        PipesModule,
        BrowserAnimationsModule
      ],
      providers:[
        {
          provide: AuthService,
          useClass: AuthServiceMock

        }
      ]
    })
    .compileComponents();
    const fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('Si el campo email esta vacio el FormControl del email debe ser invalido', ()=>{
    component.loginForm.setValue({email:'',password:''})

    expect(component.emailControl.invalid).toBeTrue()
  })
  it('Si el loginForm es invalido, debe marcar todos los controles como touched', () =>{
    component.loginForm.setValue({email:'',password:''})
    const spyOnMarkAllAsTouched = spyOn(component.loginForm, 'markAllAsTouched')

    component.onSubmit()
    /* expect(component.emailControl.touched).toBeTrue()
    expect(component.passwordControl.touched).toBeTrue() */
    expect(spyOnMarkAllAsTouched).toHaveBeenCalled();

  })
  it('si el login es valido debera llamar al login del authService', ()=>{
    component.loginForm.setValue({email:'admin@admin.com',password:'123456'})
    const spyOnLogin = spyOn(TestBed.inject(AuthService), 'login')
    component.onSubmit();
    expect(component.loginForm.valid).toBeTrue()
    expect(spyOnLogin).toHaveBeenCalled()
  })
})
