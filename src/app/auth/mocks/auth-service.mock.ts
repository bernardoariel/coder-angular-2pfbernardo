import { BehaviorSubject, Observable, of } from "rxjs";
import { LoginFormValue, Usuario } from "src/app/core/services/auth.service";

const USUARIO_MOCK: Usuario = {

    nombre: "ariel",
    apellido: "apellido",
    email: "admin@admin.com",
    password: "123456",
    role: "admin",
    token: "dsLnKJtyBluy0987876asdaasd",
    id: 1,
    idEstudiante: 0

}

export class AuthServiceMock{

  private authUser$ = new BehaviorSubject<Usuario | null>(null);
  login(formValue:LoginFormValue):void{
    console.log('INGRESANDO AL SERVICIO MOCK')
    this.authUser$.next(USUARIO_MOCK)
  }

  verificarToken():Observable<boolean>{
    return of(true)
  }
}
