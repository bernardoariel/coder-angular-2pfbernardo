import { createReducer, on } from "@ngrx/store";
import { Usuario } from "src/app/core/services/auth.service";
import { EstablecerUsuarioAutenticado, QuitarUsuarioAutenticado } from "./auth.actions";


export const authFeatureKey= 'auth';

export interface authState {
  authUser: Usuario | null,
  token: string | null
}

const initialState: authState = {
  authUser:null,
  token:localStorage.getItem('token') || null
}
export const authReducer = createReducer(
  initialState,

  on(EstablecerUsuarioAutenticado,(currentState,{payload})=>{
    return{
      authUser:payload,
      token:payload.token
    }
  }),

  on(QuitarUsuarioAutenticado,(currentState) =>{
    return {
      authUser: null,
      token:null
    }
  })
)
