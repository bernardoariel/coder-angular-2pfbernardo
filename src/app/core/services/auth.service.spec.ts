import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService, LoginFormValue, Usuario } from './auth.service';
import { enviroment } from 'src/environments/enviroments';
import { Router } from '@angular/router';
import { skip } from 'rxjs';
describe('Pruebas de AuthService', () => {
  let service: AuthService;
  let httpController: HttpTestingController;
  beforeEach( async () =>{
    await TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule,
      ],
    }).compileComponents();

    service = TestBed.inject(AuthService)
    httpController = TestBed.inject(HttpTestingController)

  })

  it('El login debe funcionar',()=>{
    const loginFake:LoginFormValue ={
      email:'test@test.com',
      password:'123456'
    }
    service.login(loginFake)
    service.obtenerUsuarioAutenticado()
    .pipe(
      skip(1)
    )
    .subscribe(usuario=>{
      console.log('usuario::: ', usuario);
      expect(usuario).toBeTruthy()

    })
    spyOn(TestBed.inject(Router), 'navigate')
    const MOCK_REQUEST_RESULT:Usuario[] =[
      {
        id:1,
        email:loginFake.email,
        password:loginFake.password,
        nombre:'test',
        apellido:'test',
        role:'user',
        token:'123456'
      }
    ]
    httpController.expectOne({
      url:`${enviroment.baseUrl}/usuarios?email=${loginFake.email}&password=${loginFake.password}`,
      method:'GET'
    }).flush(MOCK_REQUEST_RESULT)

  })

  it('Al loguearse debe guardar el token en el localstorage',()=>{
    const loginFake:LoginFormValue ={
      email:'test@test.com',
      password:'123456'
    }
    const MOCK_REQUEST_RESULT:Usuario[] =[
      {
        id:1,
        email:loginFake.email,
        password:loginFake.password,
        nombre:'test',
        apellido:'test',
        role:'user',
        token:'123456'
      }
    ]
    spyOn(TestBed.inject(Router), 'navigate')

    service.login(loginFake)
    httpController.expectOne({
      url:`${enviroment.baseUrl}/usuarios?email=${loginFake.email}&password=${loginFake.password}`,
      method:'GET'
    }).flush(MOCK_REQUEST_RESULT)
    const tokenLS = localStorage.getItem('token')
    expect(tokenLS).toBe('123456')
  })
  it('El logout debe emitr un authUser null , remover el token del ls y redireccionar al usuario', ()=>{
    const loginFake:LoginFormValue ={
      email:'test@test.com',
      password:'123456'
    }
    const MOCK_REQUEST_RESULT:Usuario[] =[
      {
        id:1,
        email:loginFake.email,
        password:loginFake.password,
        nombre:'test',
        apellido:'test',
        role:'user',
        token:'123456'
      }
    ]
    const spyOnNavigate = spyOn(TestBed.inject(Router), 'navigate')

    service.login(loginFake)

    httpController.expectOne({
      url:`${enviroment.baseUrl}/usuarios?email=${loginFake.email}&password=${loginFake.password}`,
      method:'GET'
    }).flush(MOCK_REQUEST_RESULT)
    service.logout()
    const tokenLS = localStorage.getItem('token')
    expect(tokenLS).toBeNull()
    expect(spyOnNavigate).toHaveBeenCalled()
    expect(TestBed.inject(Router).navigate).toHaveBeenCalledWith(['/landing'])
  })
})
