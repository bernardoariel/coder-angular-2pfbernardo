
import { TestBed } from "@angular/core/testing";
import { LoginComponent } from "./login.component";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { Store } from "@ngrx/store";
import { RouterTestingModule } from "@angular/router/testing";
import { MaterialModule } from "src/app/shared/material/material.module";
import { ReactiveFormsModule } from "@angular/forms";
import { PipesModule } from "src/app/shared/pipes/pipes.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AuthService } from "src/app/core/services/auth.service";


describe('Pruebas de LoginComponent', ()=>{
  
  let component: LoginComponent;

  beforeEach( async ()=>{
    TestBed.configureTestingModule({
       declarations: [LoginComponent],
       imports:[
        HttpClientModule,
        RouterTestingModule,
        MaterialModule,
        ReactiveFormsModule,
        PipesModule,
        BrowserAnimationsModule
       ],
       providers: [
      { provide: Store, useValue: {} } 
    ],
    }).compileComponents()

    const fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  })

  it('Si el campo email esta vacio el FormControl del email debe ser invalido', ()=>{
     component.loginForm.setValue({email:null, password:null});
     expect(component.emailControl.invalid).toBeTrue()
  })
  it('Si el campo password esta vacio el FormControl del email debe ser invalido', ()=>{
     component.loginForm.setValue({email:null, password:null});
     expect(component.passwordControl.invalid).toBeTrue()
  })
  
  it('Si el loginForm es invalido, debe marcar todos los controles como touched',()=>{
    component.loginForm.setValue({email:null, password:null});

    const spyOnMarkAllAsTouched = spyOn(component.loginForm, 'markAllAsTouched')

    component.onSubmit();

    expect(spyOnMarkAllAsTouched).toHaveBeenCalled()
  })

   it('Debe llamar a authService.login cuando loginForm es válido', () => {
    const authService = TestBed.inject(AuthService);
    const loginSpy = spyOn(authService, 'login').and.returnValue(Promise.resolve(true) as any);

    component.loginForm.setValue({ email: 'admin@admin.com', password: '123456' });
    component.onSubmit();

    expect(loginSpy).toHaveBeenCalledWith({ email: 'admin@admin.com', password: '123456' });
  });
  
  it('Debe establecer errorAutenticacion en verdadero si authService.login devuelve falso', async () => {
    const authService = TestBed.inject(AuthService);
    spyOn(authService, 'login').and.returnValue(Promise.resolve(false) as any);

    component.loginForm.setValue({ email: 'admin@admin.com', password: '123456' });
    await component.onSubmit();

    expect(component.errorAutenticacion).toBeTrue();
  });

  

})
