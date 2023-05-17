import { createAction, props } from "@ngrx/store";
import { Usuario } from "src/app/core/services/auth.service";


export const EstablecerUsuarioAutenticado = createAction(
  '[auth] Establecer usuario',
  props<{payload:Usuario & {token:string} }>()
)

export const QuitarUsuarioAutenticado = createAction(
  '[auth] Quitar usuario'
)
